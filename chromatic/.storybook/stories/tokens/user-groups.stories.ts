import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { ecosystemMatrixModes } from '../../modes';
import { isTypographyToken, tokenStory } from './token-stories';

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

// The raw `--sl-computed-*` values are only listed in the inventory; the typography aliases
// that use them are rendered here
export const Typography: StoryObj = tokenStory({
  bucket: 'userGroup',
  filter: name => isTypographyToken(name) && !name.startsWith('--sl-computed-')
});

export const Inventory: StoryObj = tokenStory({
  bucket: 'userGroup',
  layout: 'list'
});
