import { createElement } from 'react';
import { Select } from 'storybook/internal/components';
import { addons, types, useGlobalTypes, useGlobals } from 'storybook/manager-api';
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

const SubthemeTool = () => {
  const [globals, updateGlobals] = useGlobals(),
    subthemes = useGlobalTypes().subtheme?.subthemes as Record<string, string[]> | undefined,
    theme = (globals.theme as string | undefined) ?? 'sanoma-learning',
    values = subthemes?.[theme];

  if (!values) {
    return null;
  }

  const current = values.includes(globals.subtheme as string)
    ? (globals.subtheme as string)
    : undefined;

  return createElement(
    Select,
    {
      // Select is uncontrolled, so remount it when the theme or value changes elsewhere
      key: `${theme}-${current}`,
      ariaLabel: 'Subtheme',
      tooltip: 'Subtheme',
      defaultOptions: current ? [current] : [],
      options: values.map(value => ({
        title: value.charAt(0).toUpperCase() + value.slice(1),
        value
      })),
      resetLabel: 'Default',
      onReset: () => updateGlobals({ subtheme: undefined }),
      onSelect: value => updateGlobals({ subtheme: value })
    },
    'Subtheme'
  );
};

addons.register('sl/subtheme', () => {
  // Tools render in insertion order; defer so this is added after the core globals toolbar
  queueMicrotask(() => {
    addons.add('sl/subtheme/tool', {
      title: 'Subtheme',
      type: types.TOOL,
      match: ({ tabId }) => !tabId,
      render: () => createElement(SubthemeTool)
    });
  });
});

addons.setConfig({
  ui: {
    enableShortcuts: false
  },
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
