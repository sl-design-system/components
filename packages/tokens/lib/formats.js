import StyleDictionary from 'style-dictionary';

const tokenToCss = (dictionary, token, options = { prefix: '  ' }) => {
  let value = token.value;

  if (token.palette) {
    const { rgb: { r, g, b }} = token.attributes;

    return `${options.prefix}--${token.name}: ${r} ${g} ${b};`;
  } else if (dictionary.usesReference(token.original.value) && typeof value === 'string') {
    const refs = dictionary.getReferences(token.original.value);

    refs.forEach(ref => {
      if (ref.value && ref.name) {
        if (ref.palette && !value.startsWith('rgba(')) {
          value = value.replace(ref.value, () => `rgb(var(--${ref.name}))`);
        } else {
          value = value.replace(ref.value, () => `var(--${ref.name})`);

          if (value.startsWith('rgba')) {
            value = value.replace(',', ' /');
          }
        }
      }
    });

    return `${options.prefix}--${token.name}: ${value};`;
  } else {
    return StyleDictionary.formatHelpers.createPropertyFormatter({ format: 'css', dictionary, outputReferences: true })(token);
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

export const cssVariables = {
  name: 'custom/css/variables',
  formatter: ({ dictionary, options, file }) => {
    const tokens = dictionary.allTokens
      .filter(token => typeof token.value !== 'object')
      .filter(token => options.filterFile ? token.filePath === options.filterFile : true)
      .sort(StyleDictionary.formatHelpers.sortByReference(dictionary))
      .map(token => tokenToCss(dictionary, token, { prefix: '  ' }))
      .join('\n');

    return StyleDictionary.formatHelpers.fileHeader({ file }) + `${options.selector || ':root'} {\n${tokens}\n}\n`;
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

        return `@mixin ${name} {\n${props}\n}\n`;
      })
      .join('\n');

    return StyleDictionary.formatHelpers.fileHeader({ file }) + mixins;
  }
};

export const scssVariables = {
  name: 'custom/scss/variables',
  formatter: ({ dictionary, file, options }) => {    
    const tokens = dictionary.allTokens
      .filter(token => options.filterFile ? token.filePath === options.filterFile : true)
      .filter(token => typeof token.value !== 'object')
      .sort(StyleDictionary.formatHelpers.sortByReference(dictionary))
      .map(token => tokenToCss(dictionary, token, { prefix: '  ' }))
      .join('\n');

    const mixinName = options.mixinName || 'sl-theme-base';
    
    return StyleDictionary.formatHelpers.fileHeader({ file }) + `@mixin ${mixinName} {\n${tokens}\n}\n`;
  }
};
