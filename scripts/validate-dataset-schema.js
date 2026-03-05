const fs = require('fs');
const path = require('path');

function validateDataset(dataset) {
  if (!dataset || typeof dataset !== 'object') {
    throw new Error('Dataset payload is missing.');
  }

  const requiredTop = ['generatedAt', 'source', 'roleCount', 'propertyCount', 'ariaRoles', 'ariaData'];
  for (const key of requiredTop) {
    if (!(key in dataset)) {
      throw new Error(`Missing top-level field: ${key}`);
    }
  }

  if (!Array.isArray(dataset.ariaRoles) || dataset.ariaRoles.length === 0) {
    throw new Error('ariaRoles must be a non-empty array.');
  }

  if (!Array.isArray(dataset.ariaData) || dataset.ariaData.length === 0) {
    throw new Error('ariaData must be a non-empty array.');
  }

  if (dataset.roleCount !== dataset.ariaRoles.length) {
    throw new Error(`roleCount mismatch: ${dataset.roleCount} != ${dataset.ariaRoles.length}`);
  }

  if (dataset.propertyCount !== dataset.ariaData.length) {
    throw new Error(`propertyCount mismatch: ${dataset.propertyCount} != ${dataset.ariaData.length}`);
  }

  const roleSet = new Set(dataset.ariaRoles);
  if (roleSet.size !== dataset.ariaRoles.length) {
    throw new Error('ariaRoles contains duplicates.');
  }

  const propSet = new Set();
  const relationFields = ['rolesRequired', 'rolesSupported', 'rolesInherited', 'rolesProhibited'];

  for (const item of dataset.ariaData) {
    if (!item || typeof item !== 'object') {
      throw new Error('ariaData contains invalid entries.');
    }

    if (typeof item.prop !== 'string' || !item.prop.startsWith('aria-')) {
      throw new Error(`Invalid prop name: ${item.prop}`);
    }

    if (propSet.has(item.prop)) {
      throw new Error(`Duplicate property entry: ${item.prop}`);
    }
    propSet.add(item.prop);

    if (typeof item.valueType !== 'string' || item.valueType.length === 0) {
      throw new Error(`Invalid valueType for ${item.prop}`);
    }

    if (typeof item.isGlobal !== 'boolean') {
      throw new Error(`isGlobal must be boolean for ${item.prop}`);
    }

    for (const field of relationFields) {
      if (!Array.isArray(item[field])) {
        throw new Error(`${field} must be an array for ${item.prop}`);
      }
      const unique = new Set(item[field]);
      if (unique.size !== item[field].length) {
        throw new Error(`${field} contains duplicates for ${item.prop}`);
      }
      for (const role of item[field]) {
        if (!roleSet.has(role)) {
          throw new Error(`${item.prop}.${field} references unknown role: ${role}`);
        }
      }
    }
  }
}

function main() {
  const datasetPath = process.argv[2] || path.join(process.cwd(), 'aria13-dataset.json');
  const raw = fs.readFileSync(datasetPath, 'utf8');
  const dataset = JSON.parse(raw);
  validateDataset(dataset);
  console.log(`Dataset schema valid: ${dataset.ariaData.length} properties, ${dataset.ariaRoles.length} roles.`);
}

if (require.main === module) {
  main();
}

module.exports = { validateDataset };
