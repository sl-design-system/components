const themeNew = require('./theme-new.json');

function flattenColorTokens(obj, prefix) {
  const results = [];

  for (const [key, val] of Object.entries(obj)) {
    if (val && val['$type']) {
      results.push({
        token: prefix + key,
        value: (val['$value'] || '').replace(/[{}]/g, ''),
        description: val['$description'] || ''
      });
    } else if (val && typeof val === 'object') {
      results.push(...flattenColorTokens(val, prefix + key + '-'));
    }
  }
  return results;
}

module.exports = Object.entries(themeNew.color).map(([category, value]) => ({
  category,
  tokens: flattenColorTokens(value, '--sl-color-' + category + '-')
}));

