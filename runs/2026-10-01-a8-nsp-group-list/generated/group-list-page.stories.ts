import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import so `sl-group-list-page` actually registers. A type-only import (or an
// inline `import { type X }`) is erased at transform time, the module never runs,
// `customElements.define` never fires, and Storybook renders an unregistered element - present in
// the DOM, zero by zero, with no shadow root. The type check passes either way, which is why
// nothing else in the pipeline catches it.
import './group-list-page.js';
import { DEFAULT_DATA, type GroupListPageData } from './group-list-page.js';

type Props = { data: GroupListPageData };
type Story = StoryObj<Props>;

export default {
  title: 'Examples/Group list page',
  parameters: { layout: 'fullscreen' },
  render: ({ data }) => html`<sl-group-list-page .data=${data}></sl-group-list-page>`
} satisfies Meta<Props>;

/** The design as drawn: app bar, greeting, one live lesson, and five groups. */
export const Basic: Story = { args: { data: DEFAULT_DATA } };

/** No lesson is live right now - the "Live now" section collapses away. */
export const NoLiveLesson: Story = {
  args: { data: { ...DEFAULT_DATA, liveLesson: null } }
};

/** Nothing unread - the bell loses its red dot and its label drops "unread". */
export const NoUnreadNotifications: Story = {
  args: {
    data: { ...DEFAULT_DATA, appBar: { ...DEFAULT_DATA.appBar, unreadNotificationCount: 0 } }
  }
};

/** A single group - checks that the two-column grid degrades to one filled cell. */
export const SingleGroup: Story = {
  args: { data: { ...DEFAULT_DATA, groups: DEFAULT_DATA.groups.slice(0, 1) } }
};

/** No groups yet - the grid renders empty rather than collapsing the section heading. */
export const NoGroups: Story = {
  args: { data: { ...DEFAULT_DATA, groups: [] } }
};
