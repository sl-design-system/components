import { useAddonState } from '@storybook/client-api';
import { ADDON_ID } from './constants.js';
import { updateTheme } from './theme.js';

export const withTheme = (StoryFn, context) => {
  let { themes, selectedTheme, mode } = context.globals,
    [state] = useAddonState(ADDON_ID, { selected: selectedTheme });

  updateTheme(themes.find(t => t.id === state.selected), mode);

  return StoryFn();
};
