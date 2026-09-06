# aria13 adapter: characteristics-table fidelity issues

**For:** `GetEvinced/W3C-REFS` maintainers (adapter `src/adapters/aria13.ts`, shared parser `src/adapters/respec.ts`)
**From:** `aria-props` (downstream consumer; generator `scripts/build-dataset.mjs` reads `data/aria13/roles/*.md` and `data/aria13/attributes/*.md`)
**Corpus state analysed:** W3C-REFS `53e9574`, upstream w3c/aria `2f5c69b0` (2026-08-29), 100 role atoms, 53 attribute atoms
**Severity:** issue 1 is a correctness bug (frontmatter states the opposite of the spec). Issues 2 to 5 are lost information that consumers currently re-parse from the HTML fallback table.

All findings are about `parseCharacteristics()` in `src/adapters/respec.ts` (lines 120 to 149 at the commit above), which
lifts the "Characteristics" table into frontmatter with this precedence per row:

```
true/false text  →  boolean
any <code> in td →  list of <code> texts          ← the source of issues 1, 2, 3
any <li> in td   →  list of <li> texts
otherwise        →  raw text
```

Taking `<code>` texts whenever any exist discards the surrounding prose, the `<li>` annotations, and per-item markup.
Everything below follows from that.

---

## Issue 1 (bug): "All elements … except for the following roles" becomes a positive `used_in_roles` list

### Upstream markup

The ARIA 1.3 draft writes the "Used in Roles" row of five attributes as prose followed by an exception list:

```html
<th class="property-applicability-head" scope="row">Used in Roles:</th>
<td class="property-applicability">All elements of the base markup except for the following roles:
  <a href="https://w3c.github.io/aria/#caption" class="role-reference"><code>caption</code></a>,
  <a href="https://w3c.github.io/aria/#code" class="role-reference"><code>code</code></a>,
  … </td>
```

`sources/aria13/aria.html` contains 5 occurrences of `except for the following roles`.

### Current output (wrong)

Because `<code>` elements exist, the parser emits the exception list as the *usage* list:

```yaml
# data/aria13/attributes/aria-label.md
used_in_roles:
  - caption
  - code
  - definition
  - deletion
  - emphasis
  - generic
  - insertion
  - mark
  - none
  - paragraph
  - strong
  - subscript
  - suggestion
  - superscript
  - term
  - time
  - tooltip
```

Read literally, this says aria-label is used *only* on the roles where the spec *prohibits* it. Affected atoms:

| Attribute | `used_in_roles` today | Spec meaning |
|---|---|---|
| `aria-label` | 17 roles (caption … tooltip) | global, prohibited on those 17 |
| `aria-labelledby` | 17 roles | global, prohibited on those 17 |
| `aria-braillelabel` | 17 roles | global, prohibited on those 17 |
| `aria-brailleroledescription` | `[generic]` | global, prohibited on generic |
| `aria-roledescription` | `[generic]` | global, prohibited on generic |

The other 19 global attributes (for example `aria-busy`, `aria-hidden`) have no exceptions, so their td has no `<code>`
and the parser falls through to raw text: `used_in_roles: All elements of the base markup`. That is why the bug is
confined to these five and why a consumer cannot detect it from the frontmatter alone (a list of roles looks legitimate).

### Proposed frontmatter

Keep the existing string form for the global case so unaffected atoms do not churn, and add the exceptions as a
separate key:

```yaml
used_in_roles: All elements of the base markup
used_in_roles_except:
  - caption
  - code
  - …
```

Optionally add `global: true` for every attribute whose row starts with "All elements of the base markup" (see issue 4).

### Suggested fix

In `parseCharacteristics()`, before the `<code>` branch, special-case the prose form:

```ts
const raw = textOf(td).trim();
const except = raw.match(/^All elements of the base markup(?: except for the following roles:)?/i);
if (except) {
  out[key] = "All elements of the base markup";
  const codes = selectAll("code", td as Element).map((c) => textOf(c));
  if (codes.length) out[`${key}_except`] = [...new Set(codes)];
  continue;
}
```

A more general alternative: only take the `<code>` shortcut when the td's text, with all `<code>` texts and
separators removed, is empty. Otherwise the row is prose and needs a row-specific rule.

### Acceptance

- `aria-label.md`, `aria-labelledby.md`, `aria-braillelabel.md`: `used_in_roles` is the string; `used_in_roles_except` has 17 entries including `generic`, `tooltip`, `caption`.
- `aria-brailleroledescription.md`, `aria-roledescription.md`: `used_in_roles_except: [generic]`.
- Every other attribute atom is byte-identical to before the fix (determinism invariant).
- Cross-check: each name in `used_in_roles_except` appears in that role's `prohibited_states_and_properties`. This holds today from the role side, so the role atoms are the reliable source until this is fixed.

---

## Issue 2 (lost data): per-role deprecation markers are dropped

### Upstream markup

Role tables annotate individual list items:

```html
<li><a href="https://w3c.github.io/aria/#aria-disabled" class="state-reference"><code>aria-disabled</code></a> (state)
  <strong>(deprecated on this role in ARIA 1.2)</strong></li>
```

`sources/aria13/aria.html` has 307 such markers; they survive only in the raw-HTML fallback table in 90 role atom bodies.
The `<code>` shortcut keeps `aria-disabled` and loses the `<strong>` note, so `inherited_states_and_properties` on
`button` lists `aria-errormessage` and `aria-invalid` exactly like the non-deprecated entries.

### Proposed frontmatter

Keep the relation lists as plain names (consumers key on them) and add a sibling list:

```yaml
inherited_states_and_properties:
  - aria-errormessage
  - aria-invalid
deprecated_states_and_properties:
  - attribute: aria-errormessage
    since: ARIA 1.2
  - attribute: aria-invalid
    since: ARIA 1.2
```

A flat `deprecated_states_and_properties: [aria-errormessage, aria-invalid]` would also serve; the version is
constant ("ARIA 1.2") in the current draft.

### Suggested fix

Iterate `<li>` instead of `<code>` for the four relation rows, taking the first `<code>` as the name and scanning the
`<li>` text for `/\(deprecated on this role in (ARIA [\d.]+)\)/`. Collect matches into the sibling key.

### Acceptance

- `roles/button.md` gains `deprecated_states_and_properties` with `aria-errormessage` and `aria-invalid`.
- Sum over all role atoms equals 307 entries (matches the marker count in the source snapshot).

---

## Issue 3 (data quality): "(state)" suffix leaks into attribute names on `roletype`

### Upstream markup

Only in the `roletype` table, the suffix is *inside* the `<code>` element (12 occurrences in the document):

```html
<li><a href="https://w3c.github.io/aria/#aria-busy" class="state-reference"><code>aria-busy (state)</code></a></li>
```

Everywhere else it is a text node after the link (`<code>aria-disabled</code></a> (state)`).

### Current output

```yaml
# data/aria13/roles/roletype.md
supported_states_and_properties:
  - aria-busy (state)
  - aria-current (state)
  …
```

Seven entries in `roletype.md` carry the suffix; no other role atom does. Any consumer joining on attribute name misses
them.

### Suggested fix

Normalise names taken from `<code>` in the relation rows: `.replace(/\s*\((state|property)\)\s*$/i, "")`. Better still,
prefer the `href` fragment of the enclosing `<a class="state-reference|property-reference">` (`#aria-busy`) over the
code text; it is the spec anchor and is never annotated.

---

## Issue 4 (missing signal): no structured "global" flag

Global applicability is expressed three ways in the spec and none is lifted into a boolean:

1. `Used in Roles: All elements of the base markup` (string form, 24 attributes once issue 1 is fixed).
2. The bullet list under `## Global States and Properties` in `concepts/states_and_properties.md`, which also carries
   "(Global use deprecated in ARIA 1.2)" for `aria-disabled`, `aria-errormessage`, `aria-haspopup`, `aria-invalid`.
3. `roletype`'s `supported_states_and_properties` (the same 24 names, with `data-prohibited="…"` on the `<li>` of the
   five "Except where prohibited" entries; 10 `data-prohibited` attributes in the document).

### Proposed frontmatter (attribute atoms)

```yaml
global: true
global_deprecated_since: ARIA 1.2   # only for the four
```

Source 1 is the simplest to derive inside `parseCharacteristics()` (it already has the string). Source 2 gives the
deprecation note; the concept atom is parsed by the same adapter run, so a two-pass merge is feasible.

---

## Issue 5 (missing signal): spec-level deprecation is prose only

`aria-dropeffect` and `aria-grabbed` ("Deprecated in ARIA 1.1") and role `directory` ("Deprecated in ARIA 1.2") state
this in their first paragraph and, upstream, in the section heading class. The frontmatter has no field for it.

### Proposed frontmatter

```yaml
deprecated_since: ARIA 1.1
```

Detect via the section's `class` (upstream uses `deprecated` on those sections) or, as a fallback, the first-paragraph
regex `/\bDeprecated in ARIA ([\d.]+)/`.

---

## Notes for implementers

- **Determinism:** all proposals add keys or replace wrong values; no timestamps, no reordering of existing keys.
  Golden fixtures in `test/fixtures/*.golden.md` will need a deliberate `UPDATE_GOLDEN=1` run for the five attributes in
  issue 1, `roletype.md` (issue 3), and every role with a deprecation marker (issue 2).
- **Stable IDs:** none of this touches atom ids or file names.
- **Consumer contract:** `index.json` and `sc-map.json` are unaffected; the changes are frontmatter-only. Per
  `CLAUDE.md`, `src/core/indexer.ts` is the place if you also want a consumer-shaped matrix export.
- **How aria-props copes today** (so you can verify against an independent implementation): it ignores
  `used_in_roles` for relations and derives them from the role side; it parses the `<strong>(deprecated on this role …)`
  markers and the `## Global States and Properties` bullets from atom bodies; it strips `(state)` suffixes. Once issues
  1 to 3 land, those workarounds can be deleted and the generator can trust the frontmatter.

## Verification snippets

Run from the W3C-REFS root after a fix:

```bash
# Issue 1: no attribute atom may list roles under used_in_roles while its body says "except for"
grep -l "except for the following roles" data/aria13/attributes/*.md | \
  xargs grep -L "^used_in_roles: All elements of the base markup" ; echo "(expect no output)"

# Issue 2: 307 markers in the source, same number of structured entries
grep -o "deprecated on this role" sources/aria13/aria.html | wc -l
grep -h "^  - attribute: aria-" data/aria13/roles/*.md | wc -l

# Issue 3: no "(state)" left in relation lists
grep -h "^  - aria-[a-z]* (state)" data/aria13/roles/*.md | wc -l ; echo "(expect 0)"
```
