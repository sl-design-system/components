import { useAddonState } from '@storybook/client-api';
import { ADDON_ID } from './constants.js';
import { updateTheme } from './theme.js';

export const withTheme = (StoryFn, context) => {
  let { themes, selectedTheme } = context.globals,
    [state] = useAddonState(ADDON_ID, { selected: selectedTheme });

  updateTheme(themes.find(t => t.id === state.selected));

  return StoryFn();
};
