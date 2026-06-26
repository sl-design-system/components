const baseNew = require('./base-new.json');
const primitives = require('./primitives.json');
const fs = require('fs');
const path = require('path');

// Read compiled CSS to extract actual token values
const cssPath = path.resolve(__dirname, '../../../../packages/themes/sanoma-learning/dark.css');
let cssValues = {};
try {
  const css = fs.readFileSync(cssPath, 'utf8');
  const regex = /--(sl-[\w-]+)\s*:\s*(.+?)\s*;/g;
  let match;
  while ((match = regex.exec(css)) !== null) {
    cssValues['--' + match[1]] = match[2].replace(/\/\*.*?\*\//g, '').trim();
  }
} catch (e) {
  // CSS file not available, fall back to reference values
}

function flattenTokens(obj, prefix, category) {
  const results = [];
  for (const [key, val] of Object.entries(obj)) {
    if (val && val['$type']) {
      const rawValue = (val['$value'] || '').replace(/[{}]/g, '');
      const token = prefix + key;
      const tokenName = token.replace(/^--sl-/, '');
      const isIcon = (category || key) === 'icon' || key === 'icon' || token.includes('-icon');
      results.push({
        token,
        value: cssValues[token] || rawValue,
        title: tokenName
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/[.\-]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase()),
        type: val['$type'] || '',
        description: val['$description'] || '',
        category: category || key,
        isIcon
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

