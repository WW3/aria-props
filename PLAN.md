# aria-props v2 — rewrite plan

Status legend: [x] done · [ ] pending · [~] partial

## Goals

- One source of truth for data: the **W3C-REFS** corpus (`data/aria13/**` atoms, synced weekly from w3c/aria).
- No CSS framework, no LLM, no runtime dependencies. Modern platform features only
  (ES modules, custom elements, `<dialog>`, CSS nesting/custom properties, `prefers-color-scheme`).
- Spec-grounded: every role/attribute shows the verbatim spec description and links to the spec anchor,
  which replaces the old "Explain with AI" button.
- Works offline and from `file://` (single-file build), deploys to GitHub Pages.

## Decisions

| Topic | Decision | Why |
|---|---|---|
| Data provider | Generator in this repo reads W3C-REFS role/attribute atoms (`scripts/build-dataset.mjs`) | Keeps W3C-REFS untouched; role-side frontmatter is the reliable side (attribute-side `used_in_roles` mis-parses "except for" lists) |
| Relations source | Role atoms only; attribute→roles is derived in the app | Single direction avoids two lists drifting apart |
| Globals | `isGlobal` flag on the attribute (from the spec's Global States and Properties list) + per-role `prohibited`/`deprecatedOn` | Matches the spec model instead of expanding globals into every role |
| Deprecation | Parsed from the HTML characteristics table markers `(deprecated on this role in ARIA 1.2)` and from "Deprecated in ARIA x.y" paragraphs | W3C-REFS frontmatter does not carry these yet |
| Components | Native custom elements, **light DOM** (no shadow root) | A query tool is one page with one stylesheet; light DOM keeps `aria-describedby`, focus management and global styles trivial |
| Build | Vite + TypeScript, `vite-plugin-singlefile` → `dist/index.html` | Zero runtime deps, file:// friendly, still a normal dev server |
| Tests | Vitest: pure query module + generator against a fixture corpus + schema validation | Replaces regex-on-HTML smoke tests |
| Versioning | Dataset carries `upstreamCommit`/`upstreamUpdated` from the atoms and the W3C-REFS commit | Deterministic output, no timestamps |

## Phases

### Phase 1 — Data (prerequisite for everything else)
- [x] `scripts/build-dataset.mjs` — generate `data/aria-dataset.json` (schema v2) from W3C-REFS
- [x] `scripts/validate-dataset.mjs` — structural + referential validation, count gates
- [x] `--check` mode for drift detection in CI
- [x] Restore the 9 attributes missing from v1 (busy, current, disabled, dropeffect, grabbed, hidden, invalid, pressed, selected)

### Phase 2 — App rewrite
- [x] Vite + TS scaffold, single-file build
- [x] `src/lib/query.ts` — pure functions: attribute→roles, role→attributes, text filter, sort
- [x] Components: `<aria-app>`, `<aria-query-form>`, `<aria-results-table>`, `<aria-detail-dialog>`
- [x] Attribute→roles view (parity with v1, same hash permalink params `prop`, `type`, `role`)
- [x] Role→attributes view
- [x] Detail dialog: spec description, value table, characteristics, spec link
- [x] Hand-written stylesheet with light/dark themes
- [x] Remove OpenAI flow, Tailwind, highlight.js, `dist/` from git

### Phase 3 — Quality & delivery
- [x] Vitest suites (query, generator fixture, schema)
- [x] CI: validate → typecheck → test → build
- [x] Pages deploy workflow
- [x] `update-dataset.yml` — manual/scheduled regeneration from W3C-REFS that opens a PR
- [ ] Optional: contribute `deprecatedOn` + global-flag frontmatter upstream to W3C-REFS and fix the "except for" parser there

## Dataset schema v2 (summary)

```
{
  schemaVersion: 2,
  spec: { name, versionLine, status, sourceUrl, upstreamCommit, upstreamUpdated, corpusRepo, corpusCommit, license },
  roles: [{ name, abstract, deprecated?, superclass[], subclasses[], required[], supported[], inherited[],
            prohibited[], deprecatedOn[], nameFrom[], accessibleNameRequired?, childrenPresentational?,
            requiredParents[], allowedChildren[], baseConcepts[], relatedConcepts[], implicitValues[],
            description, sourceUrl }],
  attributes: [{ name, kind: 'state'|'property', valueType, isGlobal, globalDeprecated?, deprecated?,
                 values[{ value, isDefault, description }], relatedConcepts[], description, sourceUrl }]
}
```

Empty arrays and undefined fields are omitted from the JSON.
