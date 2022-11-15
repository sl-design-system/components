let baseStyles, variantStyles, fonts;

export const updateTheme = (theme) => {
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
    fonts ??= document.head.appendChild(document.createElement('link'));
    fonts.href = theme.fonts;
    fonts.rel = 'stylesheet';
  }
};

