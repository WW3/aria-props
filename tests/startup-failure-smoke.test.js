const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { validateDataset } = require('../scripts/validate-dataset-schema');

test('index.html keeps startup failure UI path for dataset load errors', () => {
  const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');

  assert.match(html, /Could not initialize ARIA dataset\./);
  assert.match(html, /errorMessage\.classList\.remove\('hidden'\);/);
  assert.match(html, /datasetVersion\.textContent = 'Data version: unavailable';/);
  assert.match(html, /return;/);
});

test('dataset schema validator rejects malformed data', () => {
  const bad = {
    generatedAt: '2026-01-01T00:00:00.000Z',
    source: 'x',
    roleCount: 1,
    propertyCount: 1,
    ariaRoles: ['button'],
    ariaData: [
      {
        prop: 'aria-label',
        valueType: 'string',
        isGlobal: true,
        rolesRequired: [],
        rolesSupported: ['unknown-role'],
        rolesInherited: [],
        rolesProhibited: [],
      },
    ],
  };

  assert.throws(() => validateDataset(bad), /unknown role/i);
});
