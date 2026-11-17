import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { ecosystemMatrixModes } from '../../modes';
import { tokenStory } from './token-stories';

/**
 * Tokens with the same values in every theme, but different values per user group. One theme is
 * enough, so only the 4 user groups of a single subtheme are snapshotted.
 */
export default {
  title: 'Tokens/User Groups',
  parameters: {
    chromatic: {
      modes: Object.fromEntries(
        Object.entries(ecosystemMatrixModes).filter(([key]) =>
          key.startsWith('sl-ecosystem-purple-')
        )
      )
    }
  }
} satisfies Meta;

export const Inventory: StoryObj = tokenStory({
  bucket: 'userGroup'
});
