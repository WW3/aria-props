export interface SpecMeta {
  name: string;
  versionLine: string;
  status: string;
  sourceUrl: string;
  upstreamCommit: string;
  upstreamUpdated: string;
  corpusRepo: string;
  corpusCommit: string | null;
  license: string;
}

export interface Role {
  name: string;
  abstract: boolean;
  deprecated?: string;
  superclass?: string[];
  subclasses?: string[];
  required?: string[];
  supported?: string[];
  inherited?: string[];
  prohibited?: string[];
  deprecatedOn?: string[];
  nameFrom?: string[];
  accessibleNameRequired?: boolean;
  childrenPresentational?: boolean;
  requiredParents?: string[];
  allowedChildren?: string[];
  baseConcepts?: string[];
  relatedConcepts?: string[];
  implicitValues?: string[];
  description?: string;
  sourceUrl: string;
}

export interface AttributeValue {
  value: string;
  isDefault: boolean;
  description: string;
}

export interface Attribute {
  name: string;
  kind: 'state' | 'property';
  valueType: string;
  isGlobal: boolean;
  globalDeprecated?: string;
  deprecated?: string;
  values?: AttributeValue[];
  relatedConcepts?: string[];
  description: string;
  sourceUrl: string;
}

export interface Dataset {
  schemaVersion: 2;
  spec: SpecMeta;
  roles: Role[];
  attributes: Attribute[];
}
