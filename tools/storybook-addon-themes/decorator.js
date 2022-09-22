import { useEffect } from '@storybook/addons';

let baseStyles, variantStyles, fonts;

export const withTheme = (StoryFn, context) => {
  const { themes, selectedTheme } = context.globals;

  useEffect(() => {
    selectedTheme ??= themes[0].id;

    const [id, variant] = selectedTheme.split('/'),
      theme = themes.find(t => t.id === selectedTheme);
    
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
  }, [selectedTheme, context]);

  return StoryFn();
};
