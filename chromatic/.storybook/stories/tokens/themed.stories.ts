import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { allModes } from '../../modes';
import { tokenStory } from './token-stories';

/**
 * Tokens whose value differs between themes or subthemes, or that only exist in some themes.
 * Snapshotted once per theme and per SL Ecosystem subtheme. None of these tokens vary per user
 * group, so the default user group is enough.
 */
export default {
  title: 'Tokens/Themed',
  parameters: {
    chromatic: {
      modes: Object.fromEntries(Object.entries(allModes).filter(([key]) => key !== 'default'))
    }
  }
} satisfies Meta;

export const Inventory: StoryObj = tokenStory({
  bucket: 'themed'
});
