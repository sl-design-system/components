import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import — registers `sl-itsl-files-top-nav` globally (guarded). A `type`-only
// import here would be erased at transform time and the element would never be defined.
import './top-nav.js';
import { type TopNav, type TopNavModel } from './top-nav.js';

type Props = Pick<TopNav, 'model'>;
type Story = StoryObj<Props>;

export default {
  title: 'Runs/B Itsl Bookmk Course Files/Top Nav',
  render: () => html`<sl-itsl-files-top-nav></sl-itsl-files-top-nav>`
} satisfies Meta<Props>;

export const Basic: Story = {};

// Moves the active-link underline from "Courses" (the component's own default) to "Calendar".
const calendarActive: TopNavModel = { user: { name: 'Jane Doe' }, activeLinkId: 'calendar' };

/** A different nav link is active — "Calendar" instead of the default "Courses". */
export const DifferentActiveLink: Story = {
  render: () => html`<sl-itsl-files-top-nav .model=${calendarActive}></sl-itsl-files-top-nav>`
};

// A search term as if the user had already typed into the search field; `model.searchTerm` feeds
// straight into `sl-search-field`'s own `.value`.
const withSearchTerm: TopNavModel = {
  user: { name: 'Jane Doe' },
  activeLinkId: 'courses',
  searchTerm: 'Math 2c'
};

/** The search field pre-filled with a search term via `model.searchTerm`. */
export const WithSearchTerm: Story = {
  render: () => html`<sl-itsl-files-top-nav .model=${withSearchTerm}></sl-itsl-files-top-nav>`
};

// A user name that yields different initials from the default "Jane Doe" ("JD"): no `avatarUrl`
// is set, so `sl-avatar` falls back to deriving initials ("MA") from `model.user.name` itself.
const differentInitialsUser: TopNavModel = {
  user: { name: 'Marcus Aurelius' },
  activeLinkId: 'courses'
};

/** A user whose name yields different initials ("MA") than the default "Jane Doe" ("JD"). */
export const DifferentUserInitials: Story = {
  render: () => html`<sl-itsl-files-top-nav .model=${differentInitialsUser}></sl-itsl-files-top-nav>`
};
