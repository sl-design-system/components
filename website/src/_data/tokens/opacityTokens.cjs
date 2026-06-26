const primitives = require('./primitives.json');
const system = require('./system.json');
const themeNew = require('./theme-new.json');

function flattenTokens(obj, prefix) {
  const results = [];
  for (const [key, val] of Object.entries(obj)) {
    if (val && val['$type']) {
      const rawValue = (val['$value'] || '').replace(/[{}]/g, '');
      const tokenName = (prefix + key).replace(/^--sl-/, '');
      results.push({
        token: prefix + key,
        value: rawValue,
        title: tokenName
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/[.\-]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase()),
        type: val['$type'] || '',
        description: val['$description'] || ''
      });
    } else if (val && typeof val === 'object') {
      results.push(...flattenTokens(val, prefix + key + '-'));
    }
  }
  return results;
}

module.exports = {
  primitives: [
    ...flattenTokens(primitives['opacity-new'], '--sl-opacity-new-'),
    ...flattenTokens(system.opacity, '--sl-opacity-')
  ],
  theme: flattenTokens(themeNew.opacity, '--sl-opacity-')
};

