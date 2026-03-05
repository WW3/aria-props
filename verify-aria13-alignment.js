const fs = require('fs');

const dataset = require('./aria13-dataset.json');
const html = fs.readFileSync('index.html', 'utf8');

if (!/fetch\('aria13-dataset\.json'/.test(html)) {
  throw new Error('index.html is not configured to load aria13-dataset.json at runtime.');
}

if (!/let\s+ariaData\s*=\s*\[\s*\]/.test(html) || !/let\s+ariaRoles\s*=\s*\[\s*\]/.test(html)) {
  throw new Error('index.html should not contain hardcoded role/property dataset.');
}

function setEq(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function uniqSorted(arr) {
  return [...new Set(arr)].sort();
}

function runQuery(data, roles, selectedProp, selectedType, selectedRole) {
  let filteredData = data;
  if (selectedProp) {
    filteredData = filteredData.filter((item) => item.prop === selectedProp);
  }

  const rolesToSearch = selectedRole !== 'all' ? [selectedRole] : roles;
  const results = [];

  filteredData.forEach((propData) => {
    rolesToSearch.forEach((role) => {
      const roleIsRequired = propData.rolesRequired.includes(role);
      const roleIsSupported = propData.rolesSupported.includes(role) || propData.rolesSupported.includes('All roles');
      const roleIsInherited = propData.rolesInherited.includes(role);
      const roleIsProhibited = propData.rolesProhibited.includes(role);

      let shouldInclude = false;
      if (selectedType) {
        shouldInclude =
          (selectedType === 'rolesRequired' && roleIsRequired) ||
          (selectedType === 'rolesSupported' && roleIsSupported) ||
          (selectedType === 'rolesInherited' && roleIsInherited) ||
          (selectedType === 'rolesProhibited' && roleIsProhibited);
      } else {
        shouldInclude = roleIsRequired || roleIsSupported || roleIsInherited || roleIsProhibited;
      }

      if (shouldInclude) {
        results.push({ role, roleIsRequired, roleIsSupported, roleIsInherited, roleIsProhibited });
      }
    });
  });

  return results;
}

const ariaRoles = uniqSorted(dataset.ariaRoles || []);
const ariaData = (dataset.ariaData || []).slice().sort((a, b) => a.prop.localeCompare(b.prop));

if (ariaRoles.length === 0 || ariaData.length === 0) {
  throw new Error('Dataset is empty or malformed.');
}

for (const propData of ariaData) {
  for (const field of ['rolesRequired', 'rolesSupported', 'rolesInherited', 'rolesProhibited']) {
    const values = uniqSorted(propData[field] || []);
    for (const role of values) {
      if (!ariaRoles.includes(role)) {
        throw new Error(`Unknown role in ${propData.prop}.${field}: ${role}`);
      }
    }
    propData[field] = values;
  }
}

const typeToField = {
  rolesRequired: 'rolesRequired',
  rolesSupported: 'rolesSupported',
  rolesInherited: 'rolesInherited',
  rolesProhibited: 'rolesProhibited',
};

for (const propData of ariaData) {
  for (const [type, field] of Object.entries(typeToField)) {
    const actual = runQuery(ariaData, ariaRoles, propData.prop, type, 'all').map((r) => r.role).sort();
    const expected = propData[field].slice().sort();
    if (!setEq(actual, expected)) {
      throw new Error(`Query mismatch for ${propData.prop} (${type}): actual=${actual.length}, expected=${expected.length}`);
    }
  }

  const expectedAny = uniqSorted([
    ...propData.rolesRequired,
    ...propData.rolesSupported,
    ...propData.rolesInherited,
    ...propData.rolesProhibited,
  ]);
  const actualAny = runQuery(ariaData, ariaRoles, propData.prop, '', 'all').map((r) => r.role).sort();
  if (!setEq(actualAny, expectedAny)) {
    throw new Error(`Query mismatch for ${propData.prop} (all types): actual=${actualAny.length}, expected=${expectedAny.length}`);
  }
}

console.log(`Verification passed for ${ariaData.length} properties across ${ariaRoles.length} roles.`);
