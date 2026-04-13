const baseNew = require('./base-new.json');
const primitives = require('./primitives.json');

function flattenTokens(obj, prefix, category) {
  const results = [];
  for (const [key, val] of Object.entries(obj)) {
    if (val && val['$type']) {
      const rawValue = (val['$value'] || '').replace(/^\{|\}$/g, '');
      const tokenName = (prefix + key).replace(/^--sl-/, '');
      results.push({
        token: prefix + key,
        value: rawValue,
        title: tokenName
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/[.\-]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase()),
        type: val['$type'] || '',
        description: val['$description'] || '',
        category: category || key
      });
    } else if (val && typeof val === 'object') {
      results.push(...flattenTokens(val, prefix + key + '-', category || key));
    }
  }
  return results;
}

module.exports = {
  textNew: flattenTokens(baseNew['text-new'], '--sl-text-new-'),
  sizeTextNew: flattenTokens(baseNew.size['text-new'], '--sl-size-text-new-'),
  fontWeight: flattenTokens(primitives.fontWeight, '--sl-fontWeight-')
};

