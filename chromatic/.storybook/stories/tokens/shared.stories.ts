import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { allModes } from '../../modes';
import { tokenStory } from './token-stories';

/**
 * Tokens with the same value in every theme, subtheme and user group. One snapshot is enough: if a
 * theme starts to deviate, the token moves to the themed bucket and both snapshots change.
 */
export default {
  title: 'Tokens/Shared',
  parameters: {
    chromatic: {
      modes: { default: allModes.default }
    }
  }
} satisfies Meta;

export const Inventory: StoryObj = tokenStory({
  bucket: 'shared'
});
