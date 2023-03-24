let baseStyles, variantStyles, fonts;

export const updateTheme = (theme,mode='light') => {
  baseStyles ??= document.head.appendChild(document.createElement('link'));
  baseStyles.href = `/themes/${theme.id}/base.css`;
  baseStyles.rel = 'stylesheet';

  variantStyles ??= document.head.appendChild(document.createElement('link'));
  variantStyles.href = `/themes/${theme.id}/${mode}.css`;
  variantStyles.rel = 'stylesheet';

  if (theme?.fonts) {
    if (fonts?.length !== theme.fonts.length) {
      fonts = new Array(theme.fonts.length);
    }

    theme.fonts.forEach((font, index) => {
      fonts[index] ??= document.head.appendChild(document.createElement('link'));
      fonts[index].href = font;
      fonts[index].rel = 'stylesheet';
    });
  }

  theme?.setup?.();
  // console.log('theme.setup() in theme.js');
  // theme.setup(icons);
};

