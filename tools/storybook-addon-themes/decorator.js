import { useEffect } from '@storybook/addons';
import { updateTheme } from './theme.js';

export const withTheme = (StoryFn, context) => {
  let { themes, selectedTheme } = context.globals;

  useEffect(() => {
    selectedTheme ??= themes[0].id;

    updateTheme(themes.find(t => t.id === selectedTheme));
  }, [selectedTheme, context]);

  return StoryFn();
};
