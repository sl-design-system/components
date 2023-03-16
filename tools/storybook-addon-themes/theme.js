let baseStyles, variantStyles, fonts;

export const updateTheme = (theme) => {
  console.log('updateTheme');
  const [id, variant] = theme.id.split('/');
  
  baseStyles ??= document.head.appendChild(document.createElement('link'));
  baseStyles.href = `/themes/${id}/base.css`;
  baseStyles.rel = 'stylesheet';

  if (variant) {
    variantStyles ??= document.head.appendChild(document.createElement('link'));
    variantStyles.href = `/themes/${id}/${variant}.css`;
    variantStyles.rel = 'stylesheet';
  } else {
    variantStyles?.remove();
    variantStyles = undefined;
  }

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

  console.log('setup theme after change?', theme.name, theme.setup);
  theme.setup();
  console.log('theme has been setup');
};

