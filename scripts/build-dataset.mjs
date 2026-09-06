#!/usr/bin/env node
/**
 * Build data/aria-dataset.json (schema v2) from the W3C-REFS corpus.
 *
 *   node scripts/build-dataset.mjs [--refs <dir>] [--out <file>] [--check]
 *
 * Source of truth: role atoms in <refs>/data/aria13/roles/*.md (characteristics tables lifted into
 * YAML frontmatter, including `deprecated_states_and_properties`). Attribute atoms provide
 * kind/value/description and `used_in_roles` / `used_in_roles_except`. The spec's "Global States and
 * Properties" list is read from the states_and_properties concept atom for the "global use
 * deprecated" notes. Requires W3C-REFS at or after commit 07c6e0f (characteristics parser fix).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');
const SPEC_BASE = 'https://w3c.github.io/aria/';

/** Count gates protect against a silently degraded corpus; tests lower them for fixtures. */
const DEFAULT_GATES = { minConcreteRoles: 85, minAttributes: 50, minGlobals: 20 };

export function buildDataset(refsDir, gates = {}) {
  const limits = { ...DEFAULT_GATES, ...gates };
  const ariaDir = path.join(refsDir, 'data', 'aria13');
  if (!fs.existsSync(ariaDir)) throw new Error(`W3C-REFS aria13 corpus not found at ${ariaDir}`);

  const roleAtoms = readAtoms(path.join(ariaDir, 'roles'));
  const attrAtoms = readAtoms(path.join(ariaDir, 'attributes'));
  const conceptAtom = readAtom(path.join(ariaDir, 'concepts', 'states_and_properties.md'));

  const globals = parseGlobalList(conceptAtom.body, limits.minGlobals);
  const attributeNames = new Set(attrAtoms.map((a) => a.fm.attribute));

  const roles = roleAtoms.map((atom) => buildRole(atom, attributeNames)).sort(byName);
  const roleNames = new Set(roles.map((r) => r.name));
  const attributes = attrAtoms.map((atom) => buildAttribute(atom, globals)).sort(byName);

  const dataset = {
    schemaVersion: 2,
    spec: buildSpecMeta(roleAtoms[0].fm, refsDir),
    roles,
    attributes,
  };
  // used_in_roles_except (attribute side) must agree with prohibited_states_and_properties (role side)
  const exceptions = new Map(
    attrAtoms.filter((a) => Array.isArray(a.fm.used_in_roles_except)).map((a) => [a.fm.attribute, a.fm.used_in_roles_except]),
  );
  gate(dataset, roleNames, attributeNames, limits, exceptions);
  return dataset;
}

// ---------------------------------------------------------------------------

function buildRole(atom, attributeNames) {
  const fm = atom.fm;
  const name = fm.role;
  const rel = (key) =>
    normalizeAttrList(fm[key]).filter((a) => {
      if (!attributeNames.has(a)) throw new Error(`Role ${name}: unknown attribute "${a}" in ${key}`);
      return true;
    });
  return compact({
    name,
    abstract: Boolean(fm.abstract),
    deprecated: parseDeprecatedIn(atom.body),
    superclass: list(fm.superclass_role),
    subclasses: list(fm.subclass_roles),
    required: rel('required_states_and_properties'),
    supported: rel('supported_states_and_properties'),
    inherited: rel('inherited_states_and_properties'),
    prohibited: rel('prohibited_states_and_properties'),
    deprecatedOn: deprecatedAttributes(fm.deprecated_states_and_properties, name, attributeNames),
    nameFrom: list(fm.name_from),
    accessibleNameRequired: bool(fm.accessible_name_required),
    childrenPresentational: bool(fm.children_presentational),
    requiredParents: list(fm.required_accessibility_parent_roles),
    allowedChildren: list(fm.allowed_accessibility_child_roles),
    baseConcepts: list(fm.base_concept),
    relatedConcepts: list(fm.related_concepts),
    implicitValues: list(fm.implicit_value_for_role),
    description: firstParagraph(atom.body),
    sourceUrl: fm.source_url,
  });
}

function buildAttribute(atom, globals) {
  const fm = atom.fm;
  const name = fm.attribute;
  // Two sources agree for every global attribute except the four whose global use is deprecated
  // (aria-disabled, aria-errormessage, aria-haspopup, aria-invalid): the spec keeps them in the
  // global list with a note but their own table now enumerates roles. Anything else is drift.
  const usedEverywhere = typeof fm.used_in_roles === 'string' && /^All elements of the base markup/i.test(fm.used_in_roles);
  const inGlobalList = globals.has(name);
  if (usedEverywhere && !inGlobalList) throw new Error(`Attribute ${name}: used on all elements but missing from the global list`);
  if (inGlobalList && !usedEverywhere && !globals.get(name).globalDeprecated) {
    throw new Error(`Attribute ${name}: in the global list but its table enumerates roles without a deprecation note`);
  }
  const isGlobal = usedEverywhere || inGlobalList;
  return compact({
    name,
    kind: fm.kind,
    valueType: String(fm.value),
    isGlobal,
    globalDeprecated: globals.get(name)?.globalDeprecated,
    deprecated: parseDeprecatedIn(atom.body),
    values: parseValueTable(atom.body),
    relatedConcepts: list(fm.related_concepts),
    description: firstParagraph(atom.body),
    sourceUrl: fm.source_url,
  });
}

function buildSpecMeta(fm, refsDir) {
  let corpusCommit = null;
  try {
    corpusCommit = execSync('git rev-parse HEAD', { cwd: refsDir, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    /* corpus may not be a git checkout */
  }
  return {
    name: 'WAI-ARIA',
    versionLine: fm.version_line,
    status: fm.spec_status,
    sourceUrl: SPEC_BASE,
    upstreamCommit: fm.upstream_commit,
    upstreamUpdated: String(fm.upstream_updated),
    corpusRepo: 'GetEvinced/W3C-REFS',
    corpusCommit,
    license: fm.license,
  };
}

/** Parse the bullet list under "## Global States and Properties" (stops at the next heading). */
function parseGlobalList(body, minGlobals) {
  const start = body.search(/^## Global States and Properties/m);
  if (start < 0) throw new Error('Global States and Properties section not found in concept atom');
  const rest = body.slice(start).split('\n').slice(1);
  const out = new Map();
  for (const line of rest) {
    if (/^#{1,6}\s/.test(line)) break;
    const m = line.match(/^- \[`(aria-[a-z]+)(?: \(state\))?`\]\([^)]*\)(.*)$/);
    if (!m) continue;
    const dep = m[2].match(/Global use deprecated in ARIA ([\d.]+)/i);
    out.set(m[1], { globalDeprecated: dep ? `ARIA ${dep[1]}` : undefined });
  }
  if (out.size < minGlobals) throw new Error(`Global list looks truncated (${out.size} entries)`);
  return out;
}

/** `deprecated_states_and_properties: [{ attribute, since }]` → sorted attribute names. */
function deprecatedAttributes(entries, roleName, attributeNames) {
  if (entries == null) return [];
  if (!Array.isArray(entries)) throw new Error(`Role ${roleName}: deprecated_states_and_properties must be a list`);
  const names = entries.map((e) => {
    if (!e || typeof e.attribute !== 'string') throw new Error(`Role ${roleName}: malformed deprecated entry ${JSON.stringify(e)}`);
    if (!attributeNames.has(e.attribute)) throw new Error(`Role ${roleName}: unknown deprecated attribute "${e.attribute}"`);
    return e.attribute;
  });
  return [...new Set(names)].sort();
}

/** "Deprecated in ARIA 1.2" at role or attribute level, taken from the first two paragraphs only. */
function parseDeprecatedIn(body) {
  const head = paragraphs(body).slice(0, 2).join('\n');
  const m = head.match(/\bDeprecated in ARIA ([\d.]+)/i);
  return m ? `ARIA ${m[1]}` : undefined;
}

/** GFM "| Value | Description |" table → [{ value, isDefault, description }] */
function parseValueTable(body) {
  const lines = body.split('\n');
  const start = lines.findIndex((l) => /^\|\s*Value\s*\|\s*Description\s*\|/i.test(l));
  if (start < 0) return [];
  const rows = [];
  for (let i = start + 2; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith('|')) break;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 2) continue;
    let value = cells[0].replace(/\*\*/g, '').trim();
    const isDefault = /\(default\)/i.test(value);
    value = value.replace(/\s*\(default\)/i, '').trim();
    rows.push({ value, isDefault, description: cleanMarkdown(cells[1]) });
  }
  return rows;
}

// ----- markdown helpers -----------------------------------------------------

function paragraphs(body) {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !/^(<table|\||>|#|```)/.test(p));
}

function firstParagraph(body) {
  return cleanMarkdown(paragraphs(body)[0] ?? '');
}

/**
 * Keep inline code and emphasis (the app renders those), resolve relative corpus links to spec
 * anchors and unwrap links we cannot resolve. Output stays markdown-lite: `code`, *em*, [text](url).
 */
function cleanMarkdown(md) {
  return (
    md
      .replace(/\[([^\]]*)\]\(\)/g, '$1')
      // Role and attribute atoms are named after their spec anchor, whether linked as a sibling
      // (./link.md from a role, ./aria-checked.md from an attribute) or across directories.
      .replace(/\[([^\]]*)\]\((?:\.\/|\.\.\/(?:roles|attributes)\/)([a-z-]+)\.md\)/g, (_, t, id) => `[${t}](${SPEC_BASE}#${id})`)
      // Terms/concepts have dfn-style anchors we cannot derive reliably: keep the text only.
      .replace(/\[([^\]]*)\]\(\.\.?\/[^)]*\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

// ----- generic helpers -------------------------------------------------------

const byName = (a, b) => a.name.localeCompare(b.name);

function normalizeAttrList(v) {
  return [...new Set(list(v))].sort();
}
function list(v) {
  if (v == null) return [];
  return (Array.isArray(v) ? v : [v]).map((x) => String(x)).filter(Boolean);
}
function bool(v) {
  return typeof v === 'boolean' ? v : undefined;
}
function compact(obj) {
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (v === undefined || v === null || (Array.isArray(v) && v.length === 0)) delete obj[k];
  }
  return obj;
}

function readAtoms(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => readAtom(path.join(dir, f)));
}
function readAtom(file) {
  const text = fs.readFileSync(file, 'utf8');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error(`No frontmatter in ${file}`);
  return { file, fm: YAML.parse(m[1]), body: m[2] };
}

function gate(ds, roleNames, attributeNames, limits, exceptions) {
  const concrete = ds.roles.filter((r) => !r.abstract);
  for (const [attribute, roles] of exceptions) {
    for (const roleName of roles) {
      const role = ds.roles.find((r) => r.name === roleName);
      if (!role) throw new Error(`Attribute ${attribute}: used_in_roles_except names unknown role "${roleName}"`);
      if (!(role.prohibited ?? []).includes(attribute)) {
        throw new Error(`Attribute ${attribute}: excepted on ${roleName} but that role does not prohibit it`);
      }
    }
  }
  if (ds.attributes.length < limits.minAttributes) {
    throw new Error(`Only ${ds.attributes.length} attributes parsed; expected ≥ ${limits.minAttributes}`);
  }
  if (concrete.length < limits.minConcreteRoles) {
    throw new Error(`Only ${concrete.length} concrete roles parsed; expected ≥ ${limits.minConcreteRoles}`);
  }
  for (const r of ds.roles) {
    for (const s of [...(r.superclass ?? []), ...(r.subclasses ?? []), ...(r.requiredParents ?? []), ...(r.allowedChildren ?? [])]) {
      if (!roleNames.has(s)) throw new Error(`Role ${r.name}: unknown related role "${s}"`);
    }
    for (const a of r.deprecatedOn ?? []) {
      if (!attributeNames.has(a)) throw new Error(`Role ${r.name}: unknown deprecatedOn "${a}"`);
    }
    if (!r.abstract && !r.description) throw new Error(`Role ${r.name}: empty description`);
  }
  const used = new Set(
    ds.roles.flatMap((r) => [...(r.required ?? []), ...(r.supported ?? []), ...(r.inherited ?? []), ...(r.prohibited ?? [])]),
  );
  for (const a of ds.attributes) {
    if (!['state', 'property'].includes(a.kind)) throw new Error(`Attribute ${a.name}: bad kind "${a.kind}"`);
    if (!a.description) throw new Error(`Attribute ${a.name}: empty description`);
    if (!a.isGlobal && !used.has(a.name)) throw new Error(`Attribute ${a.name} is non-global but no role references it`);
  }
}

// ----- CLI -------------------------------------------------------------------

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--check') out.check = true;
    else if (a === '--refs') out.refs = argv[++i];
    else if (a === '--out') out.out = argv[++i];
    else throw new Error(`Unknown argument ${a}`);
  }
  return out;
}

export function resolveRefsDir(explicit) {
  const candidates = [
    explicit,
    process.env.W3C_REFS_DIR,
    path.resolve(repoRoot, '..', '..', '_work', 'W3C-REFS'),
    path.resolve(repoRoot, '..', 'W3C-REFS'),
    path.resolve(repoRoot, '.w3c-refs'),
  ].filter(Boolean);
  for (const c of candidates) if (fs.existsSync(path.join(c, 'data', 'aria13'))) return path.resolve(c);
  throw new Error(`Cannot locate W3C-REFS. Pass --refs <dir> or set W3C_REFS_DIR. Tried:\n  ${candidates.join('\n  ')}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const refsDir = resolveRefsDir(args.refs);
  const outFile = path.resolve(repoRoot, args.out ?? 'data/aria-dataset.json');
  const dataset = buildDataset(refsDir);
  const json = JSON.stringify(dataset, null, 2) + '\n';

  if (args.check) {
    const existing = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : '';
    if (existing === json) {
      console.log(`Dataset is up to date with W3C-REFS (upstream ${dataset.spec.upstreamCommit.slice(0, 8)}).`);
      return;
    }
    console.error(`${path.relative(repoRoot, outFile)} differs from W3C-REFS output. Run: npm run data:build`);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, json);
  const concrete = dataset.roles.filter((r) => !r.abstract).length;
  console.log(
    `Wrote ${path.relative(repoRoot, outFile)}: ${dataset.roles.length} roles (${concrete} concrete), ` +
      `${dataset.attributes.length} attributes, upstream ${dataset.spec.upstreamUpdated} (${dataset.spec.upstreamCommit.slice(0, 8)}).`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error(`build-dataset: ${err.message}`);
    process.exit(1);
  }
}
