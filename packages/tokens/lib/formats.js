import StyleDictionary from 'style-dictionary';

export const cssVariables = {
  name: 'css/variables',
  formatter: ({ dictionary, options: { selector = ':root' }, file }) => {
    const tokens = dictionary.allTokens
      .sort(StyleDictionary.formatHelpers.sortByReference(dictionary))
      .map(token => {
        let value = token.value;

        if (token.palette) {
          const { rgb: { r, g, b }} = token.attributes;

          return `  --${token.name}: ${r} ${g} ${b};`;
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

          return `  --${token.name}: ${value};`;
        } else {
          return StyleDictionary.formatHelpers.createPropertyFormatter({ format: 'css', dictionary, outputReferences: true })(token);
        }
      });

    return StyleDictionary.formatHelpers.fileHeader({ file }) + `${selector} {\n${tokens.join('\n')}\n}\n`;
  }
};
