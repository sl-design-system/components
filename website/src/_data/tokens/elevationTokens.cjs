const system = require('./system.json');
const themeNew = require('./theme-new.json');

function flattenTokens(obj, prefix) {
  const results = [];
  for (const [key, val] of Object.entries(obj)) {
    if (val && val['$type']) {
      const rawValue = val['$value'];
      const tokenName = (prefix + key).replace(/^--sl-/, '');
      const isBoxShadow = val['$type'] === 'boxShadow';
      results.push({
        token: prefix + key,
        value: isBoxShadow ? formatBoxShadow(rawValue) : (typeof rawValue === 'string' ? rawValue.replace(/[{}]/g, '') : rawValue),
        title: tokenName
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/[.\-]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase()),
        type: val['$type'] || '',
        description: val['$description'] || ''
      });
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      results.push(...flattenTokens(val, prefix + key + '-'));
    }
  }
  return results;
}

function formatBoxShadow(layers) {
  if (!Array.isArray(layers)) return String(layers);
  return layers.map(l => {
    const parts = [l.x || '0', l.y || '0', l.blur || '0'];
    if (l.spread) parts.push(l.spread);
    parts.push(String(l.color || '').replace(/[{}]/g, ''));
    return parts.join(' ');
  }).join(', ');
}

module.exports = {
  shadow: flattenTokens(system.elevation.shadow, '--sl-elevation-shadow-'),
  surface: flattenTokens(themeNew.elevation.surface, '--sl-elevation-surface-')
};

