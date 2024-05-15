import { addons, type API, type LeafEntry, type HashEntry } from '@storybook/manager-api';
import { styled } from '@storybook/theming';
import { Fragment, createElement } from 'react';

const SYSTEM_TAGS = ['dev', 'autodocs', 'test'];

const findComponentTags = (stories: LeafEntry[]) => {
  const allTags = stories.flatMap((story) => story?.tags ?? []);
  const tagToCount = allTags.reduce(
    (acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  return Object.entries(tagToCount)
    .filter(([tag, count]) => count === stories.length && !SYSTEM_TAGS.includes(tag))
    .map(([tag]) => tag);
};

addons.setConfig({
  enableShortcuts: false,
  sidebar: {
    renderLabel: (item: HashEntry, api: API) => {
      if (item.type !== 'component') return item.name;

      const tags = findComponentTags(item.children.map((childId) => api.getData(childId)));
      if (tags.length) {
        const Status = styled.span(({ theme }) => ({
          borderRadius: 2,
          color: theme.color.inverseText,
          display: 'inline-flex',
          marginInlineStart: 'auto',
          paddingInline: 6,
          textTransform: 'capitalize'
        }));

        const Deprecated = styled(Status)(({ theme }) => ({
          background: `color-mix(in srgb, ${theme.color.negative}, transparent 80%)`,
          color: `color-mix(in srgb, ${theme.color.darker} 70%, ${theme.color.negative})`
        }));

        const Draft = styled(Status)(({ theme }) => ({
          background: `color-mix(in srgb, ${theme.color.darker}, transparent 80%)`,
          color: theme.color.darker
        }));

        const Preview = styled(Status)(({ theme }) => ({
          background: `color-mix(in srgb, ${theme.color.secondary}, transparent 80%)`,
          color: `color-mix(in srgb, ${theme.color.darker} 70%, ${theme.color.secondary})`
        }));

        const Stable = styled(Status)(({ theme }) => ({
          background: `color-mix(in srgb, ${theme.color.positive}, transparent 80%)`,
          color: `color-mix(in srgb, ${theme.color.darker} 70%, ${theme.color.positive})`
        }));

        const tag = tags[0];

        switch (tag) {
          case 'deprecated':
            return createElement(Fragment, null, item.name, createElement(Deprecated, null, tag));
          case 'draft':
            return createElement(Fragment, null, item.name, createElement(Draft, null, tag));
          case 'preview':
            return createElement(Fragment, null, item.name, createElement(Preview, null, tag));
          case 'stable':
            return createElement(Fragment, null, item.name, createElement(Stable, null, tag));
          default:
            return createElement(Fragment, null, item.name, createElement(Status, null, tag));
        }
      } else {
        return item.name;
      }
    },
  }
});
