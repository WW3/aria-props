#!/usr/bin/env node
/**
 * Validate data/aria-dataset.json (schema v2): shape, referential integrity, count gates.
 *   node scripts/validate-dataset.mjs [file]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RELATIONS = ['required', 'supported', 'inherited', 'prohibited', 'deprecatedOn'];
const ROLE_LISTS = ['superclass', 'subclasses', 'requiredParents', 'allowedChildren'];

export function validateDataset(ds) {
  const errors = [];
  const err = (m) => errors.push(m);

  if (!ds || typeof ds !== 'object') return ['Dataset payload is missing.'];
  if (ds.schemaVersion !== 2) err(`schemaVersion must be 2 (got ${ds.schemaVersion})`);
  for (const k of ['versionLine', 'status', 'sourceUrl', 'upstreamCommit', 'upstreamUpdated']) {
    if (!ds.spec || typeof ds.spec[k] !== 'string' || !ds.spec[k]) err(`spec.${k} missing`);
  }
  if (!Array.isArray(ds.roles) || ds.roles.length < 85) err('roles must be an array of ≥ 85 entries');
  if (!Array.isArray(ds.attributes) || ds.attributes.length < 50) err('attributes must be an array of ≥ 50 entries');
  if (errors.length) return errors;

  const roleNames = new Set();
  for (const r of ds.roles) {
    if (typeof r.name !== 'string' || !/^[a-z]+$/.test(r.name)) err(`role name invalid: ${JSON.stringify(r.name)}`);
    if (roleNames.has(r.name)) err(`duplicate role ${r.name}`);
    roleNames.add(r.name);
    if (typeof r.abstract !== 'boolean') err(`role ${r.name}: abstract must be boolean`);
    if (typeof r.sourceUrl !== 'string') err(`role ${r.name}: sourceUrl missing`);
    if (!r.abstract && typeof r.description !== 'string') err(`role ${r.name}: description missing`);
  }
  const attrNames = new Set();
  for (const a of ds.attributes) {
    if (typeof a.name !== 'string' || !a.name.startsWith('aria-')) err(`attribute name invalid: ${JSON.stringify(a.name)}`);
    if (attrNames.has(a.name)) err(`duplicate attribute ${a.name}`);
    attrNames.add(a.name);
    if (!['state', 'property'].includes(a.kind)) err(`attribute ${a.name}: kind must be state|property`);
    if (typeof a.valueType !== 'string' || !a.valueType) err(`attribute ${a.name}: valueType missing`);
    if (typeof a.isGlobal !== 'boolean') err(`attribute ${a.name}: isGlobal must be boolean`);
    if (typeof a.description !== 'string' || !a.description) err(`attribute ${a.name}: description missing`);
    if (typeof a.sourceUrl !== 'string') err(`attribute ${a.name}: sourceUrl missing`);
    if (a.values !== undefined) {
      if (!Array.isArray(a.values) || a.values.length === 0) err(`attribute ${a.name}: values must be a non-empty array when present`);
      else {
        for (const v of a.values) {
          if (typeof v.value !== 'string' || typeof v.isDefault !== 'boolean' || typeof v.description !== 'string') {
            err(`attribute ${a.name}: malformed value entry ${JSON.stringify(v)}`);
          }
        }
      }
    }
  }

  const referenced = new Set();
  for (const r of ds.roles) {
    for (const key of RELATIONS) {
      const arr = r[key];
      if (arr === undefined) continue;
      if (!Array.isArray(arr) || arr.length === 0) err(`role ${r.name}.${key} must be a non-empty array when present`);
      else {
        if (new Set(arr).size !== arr.length) err(`role ${r.name}.${key} has duplicates`);
        for (const a of arr) {
          if (!attrNames.has(a)) err(`role ${r.name}.${key} references unknown attribute ${a}`);
          if (key !== 'deprecatedOn') referenced.add(a);
        }
      }
    }
    // an attribute cannot be both prohibited and required/supported on the same role
    const prohibited = new Set(r.prohibited ?? []);
    for (const a of [...(r.required ?? []), ...(r.supported ?? [])]) {
      if (prohibited.has(a)) err(`role ${r.name}: ${a} is both prohibited and required/supported`);
    }
    for (const key of ROLE_LISTS) {
      for (const s of r[key] ?? []) if (!roleNames.has(s)) err(`role ${r.name}.${key} references unknown role ${s}`);
    }
    for (const s of r.superclass ?? []) {
      const sup = ds.roles.find((x) => x.name === s);
      if (sup && !(sup.subclasses ?? []).includes(r.name)) err(`role ${r.name}: superclass ${s} does not list it as a subclass`);
    }
  }
  for (const a of ds.attributes) {
    if (!a.isGlobal && !referenced.has(a.name)) err(`attribute ${a.name}: non-global but referenced by no role`);
  }
  return errors;
}

function main() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const file = path.resolve(process.argv[2] ?? path.join(here, '..', 'data', 'aria-dataset.json'));
  const ds = JSON.parse(fs.readFileSync(file, 'utf8'));
  const errors = validateDataset(ds);
  if (errors.length) {
    console.error(`Dataset invalid (${errors.length} problem${errors.length === 1 ? '' : 's'}):`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  const concrete = ds.roles.filter((r) => !r.abstract).length;
  console.log(`Dataset valid: ${ds.roles.length} roles (${concrete} concrete), ${ds.attributes.length} attributes, ${ds.spec.versionLine} ${ds.spec.status} @ ${ds.spec.upstreamUpdated}.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
