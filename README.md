# aria-props — WAI-ARIA query tool

Which states and properties are **required**, **supported**, **inherited**, **prohibited** or **deprecated** on which
WAI-ARIA roles, answered straight from the WAI-ARIA 1.3 specification. Zero runtime dependencies, one HTML file.

- Two views: roles for a state/property, or states/properties for a role.
- Every name opens a dialog with the verbatim spec description, value table, characteristics and a link to the spec anchor.
- Filters: relationship, kind (state/property), name substring, abstract roles.
- Every result set is a shareable URL (`#prop=aria-checked&type=required`); v1 links keep working.

## Data

`data/aria-dataset.json` is **generated** from the [W3C-REFS](https://github.com/GetEvinced/W3C-REFS) corpus, which
converts the live w3c/aria editor's draft into atomic Markdown with the characteristics tables in YAML frontmatter and
syncs weekly. Do not edit the JSON by hand.

```bash
npm run data:build              # regenerate from a local W3C-REFS checkout
npm run data:build -- --refs D:/path/to/W3C-REFS
W3C_REFS_DIR=... npm run data:build
npm run data:check              # fail if the JSON differs from what W3C-REFS would produce
npm run data:diff               # alias of data:check
node scripts/validate-dataset.mjs   # schema + referential integrity
```

The generator looks for W3C-REFS at `--refs`, `$W3C_REFS_DIR`, `../../_work/W3C-REFS`, `../W3C-REFS`, then `./.w3c-refs`.
Relations and per-role deprecation are taken from the **role** atoms (`required_/supported_/inherited_/prohibited_` and
`deprecated_states_and_properties`); `isGlobal` comes from the attribute's `used_in_roles`, and the generator
cross-checks `used_in_roles_except` against the role-side prohibitions. Needs W3C-REFS at commit `07c6e0f` or later.
See [PLAN.md](PLAN.md) for the schema and the reasoning.

**Refreshing the data.** W3C-REFS syncs from w3c/aria every Monday. When it has changed, from this repo:

```bash
npm run data:build
npm run ci
git add data/aria-dataset.json
git commit -m "data: sync WAI-ARIA 1.3 dataset"
```

Pushing to `main` redeploys the site. `update-dataset.yml` does the same on GitHub and opens a PR, but it is
manual-only (`workflow_dispatch`) because it needs a `W3C_REFS_TOKEN` secret that can read the private corpus
repository; a fine-grained token there has to be approved by the GetEvinced org. Re-enable the schedule in the
workflow file once that token works.

## Develop

```bash
npm install
npm run dev        # Vite dev server
npm test           # vitest: query engine, generator (fixture corpus), validator
npm run typecheck
npm run build      # dist/index.html, single file, works from file://
```

## Architecture

- `src/lib/query.ts` — pure query engine and URL-hash state (unit tested, no DOM).
- `src/components/*` — native custom elements in light DOM: `<aria-app>`, `<aria-query-form>`,
  `<aria-results-table>`, `<aria-detail-dialog>`.
- `src/styles.css` — hand-written, light/dark via `prefers-color-scheme`, forced-colors aware.
- `scripts/build-dataset.mjs`, `scripts/validate-dataset.mjs` — data pipeline.

## License

Code: MIT. Spec text and characteristics in `data/aria-dataset.json` are © W3C, reproduced under the
[W3C Document License](https://www.w3.org/copyright/document-license/); each entry carries its `sourceUrl`.
