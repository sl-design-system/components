import React from 'react';
import { addons, types, useAddonState, useGlobals } from '@storybook/manager-api';
import { Icons, IconButton, TooltipLinkList, WithTooltip } from '@storybook/components';
import { styled } from '@storybook/theming';
import { ADDON_ID } from './constants.js';

const ColorIcon = styled.span(
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

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'Theme switcher',
    type: types.TOOL,
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => {
      const [{ themes, selectedTheme }] = useGlobals(),
        [state, setState] = useAddonState(ADDON_ID, { selected: selectedTheme }),
        updateTheme = id => setState({ selected: id });

      let items = [];
      if (Array.isArray(themes)) {
        items = themes.map(theme => createThemeSelectorItem(theme, state.selected, updateTheme));
      }

      return (
        <WithTooltip placement="top" trigger="click" tooltip={() => <TooltipLinkList links={items} />}>
          <IconButton
            key="theme"
            active={state.selected}
            title="Change the theme of the preview"
          >
            <Icons icon="paintbrush" />
          </IconButton>
        </WithTooltip>
      );
    }
  });
});
