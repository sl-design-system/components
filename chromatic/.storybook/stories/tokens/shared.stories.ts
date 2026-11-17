import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { allModes } from '../../modes';
import { isBorderToken, isTypographyToken, tokenStory } from './token-stories';

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

export const Spacing: StoryObj = tokenStory({
  bucket: 'shared',
  filter: name => /^--sl-(brand-)?space-/.test(name)
});

export const Sizing: StoryObj = tokenStory({
  bucket: 'shared',
  filter: name =>
    /^--sl-(brand-)?size-/.test(name) && !isTypographyToken(name) && !isBorderToken(name)
});

export const Typography: StoryObj = tokenStory({
  bucket: 'shared',
  filter: isTypographyToken
});

export const Opacity: StoryObj = tokenStory({
  bucket: 'shared',
  filter: name => name.includes('opacity')
});

export const Animation: StoryObj = tokenStory({
  bucket: 'shared',
  filter: name => name.includes('animation')
});

export const Inventory: StoryObj = tokenStory({
  bucket: 'shared',
  layout: 'list'
});
