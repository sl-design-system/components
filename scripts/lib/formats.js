import StyleDictionary from 'style-dictionary';

const replaceReferences = (dictionary, originalValue, value) => {
  if (!dictionary.usesReference(originalValue)) {
    return value;
  }

  dictionary.getReferences(originalValue).forEach(ref => {
    if (ref.value && ref.name) {
      if (ref.palette && !value.includes('rgba(')) {
        value = value.replace(ref.value, () => `rgb(var(--${ref.name}))`);
      } else {
        value = value.replace(ref.value, () => `var(--${ref.name})`);
      }
    }
  });

  return value;
};

const tokenToCss = (dictionary, token, options = { prefix: '  ' }) => {
  let value = token.value;

  if (token.palette) {
    const {
      rgb: { r, g, b, a }
    } = token.attributes;

    if (a !== 1) {
      return `${options.prefix}--${token.name}: ${r} ${g} ${b} / ${a};`;
    } else {
      return `${options.prefix}--${token.name}: ${r} ${g} ${b};`;
    }
  } else if (typeof value === 'object' && token.type === 'typography') {
    const [fontFamily, fontSize, fontWeight, lineHeight] = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight'].map(
      // FIXME remove Elvis operator, this should fail when there's no value.
      attr => replaceReferences(dictionary, token.original.value[attr], value[attr]?.toString()));

    return `${options.prefix}--${token.name}: ${fontWeight} ${fontSize}/${lineHeight} ${fontFamily};`;
  } else if (token.type === 'fontFamilies') {
    return `${options.prefix}--${token.name}: ${value.replace(/\s+/g, '-').toLowerCase()};`;
  } else if (dictionary.usesReference(token.original.value) && typeof value === 'string') {
    value = replaceReferences(dictionary, token.original.value, value);
    if (value.startsWith('rgba')){
      value = value.replace(',','/');
    }

    // Wrap the value inside a calc() function if it contains an expression
    if (!value.startsWith('rgb') && token.type !== 'boxShadow' && [' - ', ' + ', ' / '].some(expr => value.indexOf(expr) !== -1)) {
      value = `calc(${value})`;
    }

    return `${options.prefix}--${token.name}: ${value};`;
  } else {
    return StyleDictionary.formatHelpers.createPropertyFormatter({ format: 'css', dictionary, outputReferences: true })(
      token
    );
  }
};

export const cssTypography = {
  name: 'custom/css/typography',
  formatter: ({ dictionary, file }) => {
    const groupMap = dictionary.allTokens
      .filter(token => token.type === 'typography')
      .sort(StyleDictionary.formatHelpers.sortByReference(dictionary))
      .reduce((prev, curr) => {
        prev[curr.name] = curr;

        return prev;
      }, {});

    const keys = {
      paragraphSpacing: 'marginBottom',
      textCase: 'textTransform'
    };

    const classes = Object.entries(groupMap)
      .map(([name, token]) => {
        const props = Object.entries(token.original.value)
          .map(([key, originalValue]) => {
            let value = token.value[key];

            dictionary.getReferences(originalValue).forEach(ref => {
              if (ref.name && ref.value) {
                value = value.toString().replace(ref.value, () => `var(--${ref.name})`);
              }
            });

            if (keys[key]) {
              key = keys[key];
            }

            key = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

            return `  ${key}: ${value};`;
          })
          .join('\n');

        return `.${name} {\n${props}\n}\n`;
      })
      .join('\n');

    return StyleDictionary.formatHelpers.fileHeader({ file }) + classes;
  }
};

export const scssTypography = {
  name: 'custom/scss/typography',
  formatter: ({ dictionary, file }) => {
    const groupMap = dictionary.allTokens
      .filter(token => token.type === 'typography')
      .sort(StyleDictionary.formatHelpers.sortByReference(dictionary))
      .reduce((prev, curr) => {
        prev[curr.name] = curr;

        return prev;
      }, {});

    const keys = {
      paragraphSpacing: 'marginBottom',
      textCase: 'textTransform'
    };

    const mixins = Object.entries(groupMap)
      .map(([name, token]) => {
        const props = Object.entries(token.original.value)
          .map(([key, originalValue]) => {
            let value = token.value[key];

            dictionary.getReferences(originalValue).forEach(ref => {
              if (ref.name && ref.value) {
                value = value.toString().replace(ref.value, () => `var(--${ref.name})`);
              }
            });

            if (keys[key]) {
              key = keys[key];
            }

            key = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

            return `  ${key}: ${value};`;
          })
          .join('\n');

        return `@mixin ${name} {\n${props}${props.length ? '\n' : ''}}\n`;
      })
      .join('\n');

    return StyleDictionary.formatHelpers.fileHeader({ file }) + mixins;
  }
};

export const scssVariables = {
  name: 'custom/scss/variables',
  formatter: ({ dictionary, file, options }) => {
    const tokens = dictionary.allTokens
      .filter(token => (options.filterFile ? token.filePath === options.filterFile : true))
      .sort(StyleDictionary.formatHelpers.sortByReference(dictionary))
      .map(token => tokenToCss(dictionary, token, { prefix: '  ' }))
      .filter(token => !!token)
      .join('\n');

    const mixinName = options.mixinName || 'sl-theme-base';

    return StyleDictionary.formatHelpers.fileHeader({ file }) + `@mixin ${mixinName} {\n${tokens}${tokens.length ? '\n' : ''}}\n`;
  }
};
