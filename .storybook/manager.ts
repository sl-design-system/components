import { addons } from 'storybook/manager-api';
import { color, create } from 'storybook/theming';

const theme = create({
  base: 'light',
  brandImage: 'https://sanomalearning.design/assets/logo-black.svg',
});

const baseStyle = {
  borderRadius: 2,
  fontSize: 14,
  fontWeight: 'normal',
  lineHeight: '20px',
  paddingBlock: 0,
  paddingInline: 6,
  textTransform: 'capitalize'
}

addons.setConfig({
  enableShortcuts: false,
  theme,
  tagBadges: [
    {
      tags: 'stable',
      badge: {
        text: 'Stable',
        style: {
          ...baseStyle,
          background: `color-mix(in srgb, ${color.positive}, transparent 80%)`,
          color: `color-mix(in srgb, ${color.darker} 70%, ${color.positive})`
        }
      }
    },
    {
      tags: 'preview',
      badge: {
        text: 'Preview',
        style: {
          ...baseStyle,
          background: `color-mix(in srgb, ${color.secondary}, transparent 80%)`,
          color: `color-mix(in srgb, ${color.darker} 70%, ${color.secondary})`
        }
      }
    },
    {
      tags: 'draft',
      badge: {
        text: 'Draft',
        style: {
          ...baseStyle,
          background: `color-mix(in srgb, ${color.darker}, transparent 80%)`,
          color: color.darker
        }
      }
    }
  ]
});
