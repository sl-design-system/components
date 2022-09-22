import React from 'react';
import { addons, types } from '@storybook/addons';
import { useGlobals } from '@storybook/api';
import { Icons, IconButton, TooltipLinkList, WithTooltip } from '@storybook/components';
import { styled } from '@storybook/theming';

export const ColorIcon = styled.span(
  ({ background }) => ({
    borderRadius: '50%',
    display: 'block',
    height: '1rem',
    width: '1rem',
    background
  }),
  ({ theme }) => ({
    boxShadow: `${theme.appBorderColor} 0 0 0 1px inset`,
  })
);

const createThemeSelectorItem = ({ id, name, color }, selectedTheme, update) => {
  return {
    id,
    title: name,
    value: id,
    right: <ColorIcon background={color}></ColorIcon>,
    onClick: () => update(id),
    active: id === selectedTheme
  };
};

const updateThemeInIframes = (themes, id) => {  
  if (id === undefined) {
    return;
  }

  document.querySelectorAll('iframe[data-is-storybook]').forEach(iframe => {
    const body = iframe.contentWindow.document.body;

    for (const theme of themes) {
      if (theme.id === id) {
        body?.classList.add(theme.id);
      } else {
        body?.classList.remove(theme.id);
      }
    }
  });
};

addons.register('my/toolbar', api => {
  addons.add('my-toolbar-addon/toolbar', {
    title: 'Theme switcher',
    type: types.TOOL,
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => {
      const [{ themes, selectedTheme }, updateGlobals] = useGlobals(),
        updateTheme = id => updateGlobals({ selectedTheme: id });

      let items = [];
      if (Array.isArray(themes)) {
        items = themes.map(theme => createThemeSelectorItem(theme, selectedTheme, updateTheme));

        const theme = themes.find(t => t.id === selectedTheme) || themes[0];
        updateThemeInIframes(themes, theme.id);
      }

      return (
        <WithTooltip placement="top" trigger="click" tooltip={() => <TooltipLinkList links={items} />}>
          <IconButton
            key="theme"
            active={selectedTheme}
            title="Change the theme of the preview"
          >
            <Icons icon="paintbrush" />
          </IconButton>
        </WithTooltip>
      );
    }
  });
});
