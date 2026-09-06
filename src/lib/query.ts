import type { Attribute, Dataset, Role } from '../types';

export type Relation = 'required' | 'supported' | 'inherited' | 'prohibited' | 'deprecated';
export const RELATIONS: readonly Relation[] = ['required', 'supported', 'inherited', 'prohibited', 'deprecated'];

export const RELATION_LABEL: Record<Relation, string> = {
  required: 'Required',
  supported: 'Supported',
  inherited: 'Inherited',
  prohibited: 'Prohibited',
  deprecated: 'Deprecated on role',
};

export type View = 'attribute' | 'role';

export interface Query {
  view: View;
  attribute?: string;
  role?: string;
  relation?: Relation;
  kind?: Attribute['kind'];
  text?: string;
  abstract?: boolean;
}

export interface Row {
  attribute: string;
  role: string;
  required: boolean;
  supported: boolean;
  inherited: boolean;
  prohibited: boolean;
  deprecated: boolean;
}

export type SortKey = 'attribute' | 'role';
export type SortDirection = 'ascending' | 'descending';

/** Relationship flags of one attribute on one role, straight from the role's characteristics. */
export function relationsOf(role: Role, attribute: string): Row {
  return {
    attribute,
    role: role.name,
    required: role.required?.includes(attribute) ?? false,
    supported: role.supported?.includes(attribute) ?? false,
    inherited: role.inherited?.includes(attribute) ?? false,
    prohibited: role.prohibited?.includes(attribute) ?? false,
    deprecated: role.deprecatedOn?.includes(attribute) ?? false,
  };
}

export function hasAnyRelation(row: Row): boolean {
  return row.required || row.supported || row.inherited || row.prohibited || row.deprecated;
}

/** The single most specific relationship, used for badges and summaries. */
export function primaryRelation(row: Row): Relation | null {
  if (row.prohibited) return 'prohibited';
  if (row.required) return 'required';
  if (row.supported) return 'supported';
  if (row.inherited) return 'inherited';
  if (row.deprecated) return 'deprecated';
  return null;
}

/** A query needs at least one criterion, otherwise the result would be the whole matrix. */
export function isEmptyQuery(q: Query): boolean {
  return !q.attribute && !q.role && !q.relation && !q.kind && !(q.text && q.text.trim());
}

export function runQuery(ds: Dataset, q: Query): Row[] {
  if (isEmptyQuery(q)) return [];
  const text = q.text?.trim().toLowerCase() ?? '';
  const roles = ds.roles.filter((r) => (q.role ? r.name === q.role : q.abstract || !r.abstract));
  const attributes = ds.attributes.filter(
    (a) => (!q.attribute || a.name === q.attribute) && (!q.kind || a.kind === q.kind),
  );

  const rows: Row[] = [];
  for (const role of roles) {
    for (const attribute of attributes) {
      if (text && !role.name.includes(text) && !attribute.name.includes(text)) continue;
      const row = relationsOf(role, attribute.name);
      if (q.relation ? !row[q.relation] : !hasAnyRelation(row)) continue;
      rows.push(row);
    }
  }
  return sortRows(rows, q.view === 'role' ? 'attribute' : 'role', 'ascending', q.view === 'role' ? 'role' : 'attribute');
}

export function sortRows(rows: Row[], key: SortKey, direction: SortDirection, secondary?: SortKey): Row[] {
  const sign = direction === 'ascending' ? 1 : -1;
  return rows.slice().sort((a, b) => {
    const primary = a[key].localeCompare(b[key]) * sign;
    if (primary !== 0 || !secondary) return primary;
    return a[secondary].localeCompare(b[secondary]);
  });
}

export interface Summary {
  total: number;
  roles: number;
  attributes: number;
  byRelation: Record<Relation, number>;
}

export function summarize(rows: Row[]): Summary {
  const byRelation: Record<Relation, number> = { required: 0, supported: 0, inherited: 0, prohibited: 0, deprecated: 0 };
  const roles = new Set<string>();
  const attributes = new Set<string>();
  for (const r of rows) {
    roles.add(r.role);
    attributes.add(r.attribute);
    for (const rel of RELATIONS) if (r[rel]) byRelation[rel]++;
  }
  return { total: rows.length, roles: roles.size, attributes: attributes.size, byRelation };
}

// ----- URL state -------------------------------------------------------------

const LEGACY_TYPE: Record<string, Relation> = {
  rolesRequired: 'required',
  rolesSupported: 'supported',
  rolesInherited: 'inherited',
  rolesProhibited: 'prohibited',
};

/**
 * Parse `#prop=…&type=…&role=…` (v1-compatible) plus v2 params `view`, `kind`, `q`, `abstract`.
 * Unknown values are dropped rather than trusted; callers validate names against the dataset.
 */
export function parseHash(hash: string): Query {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const q: Query = { view: params.get('view') === 'role' ? 'role' : 'attribute' };
  const attribute = params.get('prop') ?? params.get('attr');
  if (attribute) q.attribute = attribute;
  const role = params.get('role');
  if (role && role !== 'all') q.role = role;
  const type = params.get('type') ?? params.get('rel');
  if (type) {
    const rel = (LEGACY_TYPE[type] ?? type) as Relation;
    if (RELATIONS.includes(rel)) q.relation = rel;
  }
  const kind = params.get('kind');
  if (kind === 'state' || kind === 'property') q.kind = kind;
  const text = params.get('q');
  if (text) q.text = text;
  if (params.get('abstract') === '1') q.abstract = true;
  return q;
}

export function buildHash(q: Query): string {
  const params = new URLSearchParams();
  if (q.view === 'role') params.set('view', 'role');
  if (q.attribute) params.set('prop', q.attribute);
  if (q.relation) params.set('type', q.relation);
  if (q.role) params.set('role', q.role);
  if (q.kind) params.set('kind', q.kind);
  if (q.text?.trim()) params.set('q', q.text.trim());
  if (q.abstract) params.set('abstract', '1');
  return params.toString();
}

/** Drop names that are not in the dataset (stale links, typos in the URL). */
export function sanitizeQuery(ds: Dataset, q: Query): Query {
  const out: Query = { ...q };
  if (out.attribute && !ds.attributes.some((a) => a.name === out.attribute)) delete out.attribute;
  if (out.role && !ds.roles.some((r) => r.name === out.role)) delete out.role;
  return out;
}
