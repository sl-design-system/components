import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// A plain side-effect import is what actually runs the module body, and therefore
// `customElements.define('sl-account-creation-page', ...)`. It must be a SEPARATE bare import:
// the named `AccountCreationPage` binding below is only ever used in a *type* position
// (`Pick<AccountCreationPage, ...>`), so the compiler elides that import entirely even though it
// is not written as `import { type ... }`. Measured: without this line the story renders an
// unknown element with no shadow root and the type check still passes.
import './account-creation-page.js';
import { type AccountCreationPage } from './account-creation-page.js';
import { type AccountCreationFormValue } from './account-creation-form/account-creation-form.js';

type Props = Pick<AccountCreationPage, 'loading' | 'prefillEndpoint'>;
type Story = StoryObj<Props>;

export default {
  title: 'Runs/b-sanna-account-creation/Account creation page',
  parameters: { layout: 'fullscreen' },
  args: {
    loading: false,
    prefillEndpoint: '/api/signup/prefill'
  },
  render: () => html` <sl-account-creation-page></sl-account-creation-page> `
} satisfies Meta<Props>;

// Keep rendering the design with no args: a reviewer opens this story to see the Figma frame
// pixel-for-pixel, so it must not depend on any control.
export const Basic: Story = {};

/** `loading` reflects through to the form's `disabled`, greying out every field and action. */
export const Loading: Story = {
  render: () => html` <sl-account-creation-page loading></sl-account-creation-page> `
};

/**
 * A `value` with the name/email fields already filled in. Useful precisely because `Basic` is
 * deliberately empty (matching the design's placeholders); this shows the filled-in state the
 * design itself doesn't depict.
 */
export const Prefilled: Story = {
  render: () => {
    const value: AccountCreationFormValue = {
      firstName: 'Jamie',
      lastName: 'Rivera',
      email: 'jamie.rivera@example.com',
      acceptTerms: true,
      acceptPrivacy: true,
      acceptCookies: true
    };

    return html` <sl-account-creation-page .value=${value}></sl-account-creation-page> `;
  }
};

/** Replacing the default "Create an account" heading via the forwarded `heading` slot. */
export const WithCustomHeading: Story = {
  render: () => html`
    <sl-account-creation-page>
      <h1 slot="heading">Join AI Teacher Assistant</h1>
    </sl-account-creation-page>
  `
};

/**
 * Content slotted into `media`, replacing the default `<img>` (which 404s in this run - there is
 * no asset-export step for the design's hero photo). A CSS-drawn block stands in for the photo;
 * this is deliberately *not* used to "fix" the default's 404, which is an expected, recorded gap.
 */
export const WithSlottedMedia: Story = {
  render: () => html`
    <sl-account-creation-page>
      <div
        slot="media"
        style="inline-size: 100%; block-size: 100%; background: linear-gradient(135deg, var(--sl-color-background-accent-blue-subtle), var(--sl-color-background-accent-blue-bold));"
      ></div>
    </sl-account-creation-page>
  `
};
