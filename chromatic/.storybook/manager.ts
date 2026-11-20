import { createElement } from 'react';
import { addons, types, useGlobalTypes, useGlobals } from 'storybook/manager-api';
import { Select } from 'storybook/internal/components';
import { create } from 'storybook/theming';

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

addons.setConfig({
  ui: {
    enableShortcuts: false
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
