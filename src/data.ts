import raw from '../data/aria-dataset.json';
import type { Attribute, Dataset, Role } from './types';

export const dataset = raw as unknown as Dataset;

export const roleByName: ReadonlyMap<string, Role> = new Map(dataset.roles.map((r) => [r.name, r]));
export const attributeByName: ReadonlyMap<string, Attribute> = new Map(dataset.attributes.map((a) => [a.name, a]));

export const SPEC_ANCHOR = (id: string): string => `${dataset.spec.sourceUrl}#${id}`;
