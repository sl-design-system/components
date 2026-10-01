import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import — registers `sl-a2-global-nav` globally (guarded). A `type`-only
// import here would be elided at build time and the element would never be defined.
import './global-nav.js';
import { type GlobalNav, type NavUserModel } from './global-nav.js';

const USER: NavUserModel = {
  id: 'u-1',
  displayName: 'Lynn Smith'
};

const LONG_NAME_USER: NavUserModel = {
  id: 'u-2',
  displayName: 'Maximiliana Theodora Van Der Berghe-Lindqvist'
};

type Props = Pick<GlobalNav, 'user' | 'searchValue'>;
type Story = StoryObj<Props>;

export default {
  title: 'Runs/A2 NSP Class Overview/Global nav',
  args: { user: USER, searchValue: '' },
  argTypes: {
    user: { control: false },
    searchValue: { control: 'text' }
  },
  render: ({ user, searchValue }) =>
    html`<sl-a2-global-nav .user=${user} search-value=${searchValue}></sl-a2-global-nav>`
} satisfies Meta<Props>;

export const Basic: Story = {};

/** A user with a long display name, to check the profile control doesn't break layout. */
export const LongDisplayName: Story = {
  args: { user: LONG_NAME_USER }
};

/** The search field pre-filled with a value, as if the user already typed a query. */
export const SearchPrefilled: Story = {
  args: { searchValue: 'Algebra' }
};

/** Content projected into the `actions` slot, between search and the profile control. */
export const WithActions: Story = {
  render: ({ user, searchValue }) => html`
    <sl-a2-global-nav .user=${user} search-value=${searchValue}>
      <button slot="actions" type="button">Notifications</button>
    </sl-a2-global-nav>
  `
};

/** No signed-in user — `user` is `null`, so the profile control falls back to "Account". */
export const NoUser: Story = {
  args: { user: null }
};
