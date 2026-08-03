import { addons } from 'storybook/manager-api';
import { color, create } from 'storybook/theming';

const theme = create({
  base: 'light',
  brandImage: 'https://sanomalearning.design/assets/logo-black.svg'
});

const baseStyle = {
  borderRadius: 2,
  fontSize: 14,
  fontWeight: 'normal',
  lineHeight: '20px',
  paddingBlock: 0,
  paddingInline: 6
};

const display = {
  sidebar: [
    { type: 'group', skipInherited: false },
    { type: 'component', skipInherited: true }
  ]
};

// Add keyboard shortcuts for expand/collapse all
document.addEventListener('keydown', event => {
  // Don't trigger shortcuts when typing in input fields
  const target = event.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    return;
  }

  // Ctrl/Cmd + Shift + E: Expand All
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyE') {
    event.preventDefault();
    (window as any).storybookExpandAll?.();
  }
  // Ctrl/Cmd + Shift + C: Collapse All
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.code === 'KeyC') {
    event.preventDefault();
    (window as any).storybookCollapseAll?.();
  }
});

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
      },
      display
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
      },
      display
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
      },
      display
    },
    {
      tags: {
        prefix: /^v$/i
      },
      badge: ({ getTagSuffix, tag }) => {
        const version = getTagSuffix(tag);

        return {
          text: `v${version}`,
          style: {
            ...baseStyle,
            background: `color-mix(in srgb, ${color.darker}, transparent 80%)`,
            color: color.darker
          }
        };
      },
      display: {
        sidebar: false,
        toolbar: true
      }
    }
  ]
});
