const baseNew = require('./base-new.json');
const system = require('./system.json');

function flattenTokens(obj, prefix) {
  const results = [];
  for (const [key, val] of Object.entries(obj)) {
    if (val && val['$type']) {
      let rawValue = (typeof val['$value'] === 'string' ? val['$value'] : '').replace(/[{}]/g, '');
      if (/\s[-+*/]\s/.test(rawValue)) {
        rawValue = `calc(${rawValue})`;
      }
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
  borderWidth: [
    ...flattenTokens(system.size.borderWidth, '--sl-size-borderWidth-'),
    ...flattenTokens(baseNew.size.borderWidth, '--sl-size-borderWidth-')
  ],
  borderRadius: [
    ...flattenTokens(system.size.borderRadius, '--sl-size-borderRadius-'),
    ...flattenTokens(baseNew.size.borderRadius, '--sl-size-borderRadius-')
  ],
  outlineWidth: [
    ...flattenTokens(system.size.outlineWidth, '--sl-size-outlineWidth-'),
    ...flattenTokens(baseNew.size.outlineWidth, '--sl-size-outlineWidth-')
  ],
  outlineOffset: flattenTokens(system.size.outlineOffset, '--sl-size-outlineOffset-')
};

