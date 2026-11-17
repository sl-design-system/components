import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { allModes } from '../../modes';
import { isBorderToken, isTypographyToken, tokenStory } from './token-stories';

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

export const Colors: StoryObj = tokenStory({
  bucket: 'themed',
  filter: name => name.includes('color') && !name.includes('color-shadow')
});

export const Shadows: StoryObj = tokenStory({
  bucket: 'themed',
  filter: name => name.includes('elevation') || name.includes('color-shadow')
});

export const BordersAndRadii: StoryObj = tokenStory({
  bucket: 'themed',
  filter: isBorderToken
});

export const Typography: StoryObj = tokenStory({
  bucket: 'themed',
  filter: isTypographyToken
});

export const Inventory: StoryObj = tokenStory({
  bucket: 'themed',
  layout: 'list'
});
