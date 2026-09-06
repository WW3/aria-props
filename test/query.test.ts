import { describe, expect, it } from 'vitest';
import { dataset } from '../src/data';
import {
  buildHash,
  isEmptyQuery,
  parseHash,
  primaryRelation,
  relationsOf,
  runQuery,
  sanitizeQuery,
  sortRows,
  summarize,
} from '../src/lib/query';

const role = (name: string) => dataset.roles.find((r) => r.name === name)!;

describe('relationsOf', () => {
  it('reads the flags straight from the role characteristics', () => {
    expect(relationsOf(role('checkbox'), 'aria-checked')).toMatchObject({ required: true, supported: false });
    expect(relationsOf(role('button'), 'aria-pressed')).toMatchObject({ supported: true, required: false });
    expect(relationsOf(role('button'), 'aria-label')).toMatchObject({ inherited: true });
    expect(relationsOf(role('generic'), 'aria-label')).toMatchObject({ prohibited: true });
    expect(relationsOf(role('button'), 'aria-errormessage')).toMatchObject({ inherited: true, deprecated: true });
  });

  it('ranks prohibited above everything else when summarising', () => {
    expect(primaryRelation(relationsOf(role('generic'), 'aria-label'))).toBe('prohibited');
    expect(primaryRelation(relationsOf(role('checkbox'), 'aria-checked'))).toBe('required');
    expect(primaryRelation(relationsOf(role('button'), 'aria-errormessage'))).toBe('inherited');
  });
});

describe('runQuery', () => {
  it('returns nothing for an empty query instead of the whole matrix', () => {
    expect(isEmptyQuery({ view: 'attribute' })).toBe(true);
    expect(runQuery(dataset, { view: 'attribute' })).toEqual([]);
  });

  it('lists the roles for an attribute, excluding abstract roles by default', () => {
    const rows = runQuery(dataset, { view: 'attribute', attribute: 'aria-checked' });
    const names = rows.map((r) => r.role);
    expect(names).toEqual(expect.arrayContaining(['checkbox', 'menuitemcheckbox', 'menuitemradio', 'option', 'radio', 'switch', 'treeitem']));
    expect(names).not.toContain('input');
    expect(rows.every((r) => r.attribute === 'aria-checked')).toBe(true);
  });

  it('includes abstract roles on request', () => {
    const rows = runQuery(dataset, { view: 'attribute', attribute: 'aria-activedescendant', abstract: true });
    expect(rows.map((r) => r.role)).toContain('composite');
  });

  it('filters by relationship', () => {
    const rows = runQuery(dataset, { view: 'attribute', attribute: 'aria-checked', relation: 'required' });
    expect(rows.map((r) => r.role).sort()).toEqual(['checkbox', 'menuitemcheckbox', 'menuitemradio', 'radio', 'switch']);
  });

  it('lists the attributes of a role, sorted by attribute name', () => {
    const rows = runQuery(dataset, { view: 'role', role: 'slider' });
    const names = rows.map((r) => r.attribute);
    expect(names).toEqual([...names].sort());
    expect(rows.find((r) => r.attribute === 'aria-valuenow')!.required).toBe(true);
    expect(rows.find((r) => r.attribute === 'aria-orientation')!.supported).toBe(true);
    expect(rows.find((r) => r.attribute === 'aria-hidden')!.inherited).toBe(true);
  });

  it('applies kind and text filters', () => {
    const states = runQuery(dataset, { view: 'role', role: 'button', kind: 'state' });
    expect(states.map((r) => r.attribute)).toContain('aria-pressed');
    expect(states.map((r) => r.attribute)).not.toContain('aria-label');

    const rows = runQuery(dataset, { view: 'attribute', text: 'rowindex', relation: 'supported' });
    expect(new Set(rows.map((r) => r.attribute))).toEqual(new Set(['aria-rowindex', 'aria-rowindextext']));
  });

  it('covers the attributes that were missing from the v1 dataset', () => {
    for (const name of ['aria-busy', 'aria-current', 'aria-disabled', 'aria-hidden', 'aria-invalid', 'aria-pressed', 'aria-selected']) {
      expect(runQuery(dataset, { view: 'attribute', attribute: name }).length, name).toBeGreaterThan(0);
    }
    expect(runQuery(dataset, { view: 'attribute', attribute: 'aria-expanded', relation: 'supported' }).map((r) => r.role)).toContain('button');
  });
});

describe('sortRows / summarize', () => {
  const rows = runQuery(dataset, { view: 'attribute', attribute: 'aria-expanded' });

  it('sorts by key and direction', () => {
    const desc = sortRows(rows, 'role', 'descending').map((r) => r.role);
    expect(desc).toEqual([...desc].sort().reverse());
  });

  it('counts distinct roles and attributes and per-relation hits', () => {
    const s = summarize(rows);
    expect(s.attributes).toBe(1);
    expect(s.roles).toBe(rows.length);
    expect(s.byRelation.required).toBe(1); // combobox requires aria-expanded
    expect(s.byRelation.required + s.byRelation.supported + s.byRelation.inherited).toBe(rows.length);
  });
});

describe('hash round-trip', () => {
  it('reads v1 links', () => {
    expect(parseHash('#prop=aria-checked&type=rolesRequired&role=all')).toEqual({
      view: 'attribute',
      attribute: 'aria-checked',
      relation: 'required',
    });
  });

  it('round-trips v2 queries', () => {
    const q = { view: 'role' as const, role: 'slider', relation: 'supported' as const, kind: 'state' as const, text: 'value', abstract: true };
    expect(parseHash('#' + buildHash(q))).toEqual(q);
  });

  it('drops unknown relation values and names', () => {
    expect(parseHash('#type=bogus&prop=aria-nope').relation).toBeUndefined();
    expect(sanitizeQuery(dataset, { view: 'attribute', attribute: 'aria-nope', role: 'button' })).toEqual({ view: 'attribute', role: 'button' });
  });
});
