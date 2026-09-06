import { describe, expect, it } from 'vitest';
// @ts-expect-error plain ESM script without type declarations
import { validateDataset } from '../scripts/validate-dataset.mjs';
import { dataset } from '../src/data';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

describe('validate-dataset', () => {
  it('accepts the shipped dataset', () => {
    expect(validateDataset(dataset)).toEqual([]);
  });

  it('rejects unknown attribute references', () => {
    const bad = clone(dataset);
    bad.roles.find((r) => r.name === 'button')!.supported!.push('aria-nope');
    expect(validateDataset(bad).join('\n')).toMatch(/unknown attribute aria-nope/);
  });

  it('rejects an attribute that is both prohibited and supported on a role', () => {
    const bad = clone(dataset);
    const generic = bad.roles.find((r) => r.name === 'generic')!;
    generic.supported = ['aria-label'];
    expect(validateDataset(bad).join('\n')).toMatch(/both prohibited and required\/supported/);
  });

  it('rejects a broken superclass/subclass pair', () => {
    const bad = clone(dataset);
    bad.roles.find((r) => r.name === 'command')!.subclasses = ['link'];
    expect(validateDataset(bad).join('\n')).toMatch(/superclass command does not list it as a subclass/);
  });

  it('rejects a non-global attribute that no role uses', () => {
    const bad = clone(dataset);
    bad.attributes.push({ name: 'aria-orphan', kind: 'property', valueType: 'string', isGlobal: false, description: 'x', sourceUrl: 'https://example.test' });
    expect(validateDataset(bad).join('\n')).toMatch(/aria-orphan: non-global/);
  });
});
