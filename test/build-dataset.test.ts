import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain ESM script without type declarations
import { buildDataset } from '../scripts/build-dataset.mjs';
import type { Dataset } from '../src/types';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = path.join(here, 'fixtures', 'w3c-refs-mini');
const gates = { minConcreteRoles: 1, minAttributes: 1, minGlobals: 1 };

describe('build-dataset (fixture corpus)', () => {
  const ds = buildDataset(fixture, gates) as Dataset;
  const button = ds.roles.find((r) => r.name === 'button')!;
  const roletype = ds.roles.find((r) => r.name === 'roletype')!;
  const byName = (n: string) => ds.attributes.find((a) => a.name === n)!;

  it('emits schema v2 with spec metadata from the atoms', () => {
    expect(ds.schemaVersion).toBe(2);
    expect(ds.spec.versionLine).toBe('WAI-ARIA 1.3');
    expect(ds.spec.upstreamCommit).toMatch(/^[0-9a-f]{40}$/);
    expect(ds.spec.upstreamUpdated).toBe('2026-08-29');
  });

  it('parses role characteristics and sorts relation lists', () => {
    expect(button.abstract).toBe(false);
    expect(button.superclass).toEqual(['widget']);
    expect(button.supported).toEqual(['aria-disabled', 'aria-pressed']);
    expect(button.inherited).toEqual(['aria-errormessage', 'aria-label']);
    expect(button.accessibleNameRequired).toBe(true);
    expect(button.baseConcepts).toEqual(['<button>']);
    expect(button.required).toBeUndefined();
  });

  it('reads abstract role relations as-is (W3C-REFS now strips kind suffixes)', () => {
    expect(roletype.supported).toEqual(['aria-disabled', 'aria-errormessage', 'aria-label']);
  });

  it('takes per-role deprecation from deprecated_states_and_properties frontmatter', () => {
    expect(button.deprecatedOn).toEqual(['aria-errormessage']);
    expect(ds.roles.find((r) => r.name === 'generic')!.deprecatedOn).toBeUndefined();
  });

  it('cross-checks used_in_roles_except against role-side prohibitions', () => {
    // aria-label is excepted on generic in the fixture, and generic prohibits it: passes.
    expect(ds.roles.find((r) => r.name === 'generic')!.prohibited).toEqual(['aria-label']);
    expect(byName('aria-label').isGlobal).toBe(true);
  });

  it('derives isGlobal from the "All elements" phrase, with global deprecation notes from the spec list', () => {
    expect(byName('aria-disabled').isGlobal).toBe(true);
    expect(byName('aria-disabled').globalDeprecated).toBe('ARIA 1.2');
    expect(byName('aria-label').isGlobal).toBe(true);
    expect(byName('aria-label').globalDeprecated).toBeUndefined();
    expect(byName('aria-errormessage').isGlobal).toBe(true);
    expect(byName('aria-pressed').isGlobal).toBe(false);
  });

  it('parses value tables and default markers', () => {
    const values = byName('aria-pressed').values!;
    expect(values.map((v) => v.value)).toEqual(['false', 'mixed', 'true', 'undefined']);
    expect(values.find((v) => v.value === 'undefined')!.isDefault).toBe(true);
    expect(values.find((v) => v.value === 'true')!.isDefault).toBe(false);
    expect(byName('aria-label').values).toBeUndefined();
  });

  it('rewrites corpus-relative links to spec anchors and unwraps unresolvable ones', () => {
    expect(button.description).toBe(
      'An input that allows for user-triggered actions when clicked or pressed. See related [`link`](https://w3c.github.io/aria/#link) and widgets.',
    );
    expect(byName('aria-pressed').description).toContain('[`aria-checked`](https://w3c.github.io/aria/#aria-checked)');
    expect(byName('aria-pressed').description).toContain('"pressed" state of toggle buttons');
  });

  it('omits empty arrays and undefined fields', () => {
    expect('prohibited' in button).toBe(false);
    expect('deprecated' in button).toBe(false);
  });

  it('fails loudly when a role references an unknown attribute', () => {
    expect(() => buildDataset(path.join(here, 'fixtures', 'does-not-exist'), gates)).toThrow(/not found/);
  });
});
