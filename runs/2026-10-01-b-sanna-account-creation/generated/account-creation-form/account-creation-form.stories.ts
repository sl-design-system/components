import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Value import (not `type`-only): this child does not self-register, and the page that would
// normally register it in its own scoped registry doesn't exist in this story, so the module's
// side effect of defining the custom element below must run.
import { AccountCreationForm, type AccountCreationFormValue } from './account-creation-form.js';
// `<sl-account-creation-form>` only registers `sl-button` in its own *scoped* registry (via
// `ScopedElementsMixin`), which covers the elements its own template renders - not light-DOM
// content a story slots in from outside. The `CustomActions` story below slots in a real
// `<sl-button>`, so it needs the bare global registration side effect too.
import '@sl-design-system/button/register.js';

if (!customElements.get('sl-account-creation-form')) {
  customElements.define('sl-account-creation-form', AccountCreationForm);
}

type Props = Pick<AccountCreationForm, 'disabled' | 'value'>;
type Story = StoryObj<Props>;

// In the real page this would be the initial value the data-owning page passes in; the design
// shows empty fields (so their placeholders stay visible) with all three consents pre-checked.
const value: AccountCreationFormValue = {
  firstName: '',
  lastName: '',
  email: '',
  acceptTerms: true,
  acceptPrivacy: true,
  acceptCookies: true
};

export default {
  title: 'Runs/b-sanna-account-creation/Account creation form',
  parameters: { layout: 'centered' },
  args: {
    disabled: false,
    value
  },
  render: ({ disabled, value }) => html`
    <sl-account-creation-form ?disabled=${disabled} .value=${value}></sl-account-creation-form>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

/** `disabled` reflects to the attribute and is forwarded to the inner `<sl-form>`. */
export const Disabled: Story = {
  args: { disabled: true }
};

/** A `value` with the name/email fields already filled in, rather than the design's empty state. */
export const Prefilled: Story = {
  args: {
    value: {
      firstName: 'Jamie',
      lastName: 'Rivera',
      email: 'jamie.rivera@example.com',
      acceptTerms: true,
      acceptPrivacy: true,
      acceptCookies: true
    }
  }
};

/**
 * All three consents unchecked - the counter-case to the design, which ships them pre-checked.
 * Interesting because it's the one state the design's own screenshot doesn't show.
 */
export const ConsentsUnchecked: Story = {
  args: {
    value: {
      firstName: '',
      lastName: '',
      email: '',
      acceptTerms: false,
      acceptPrivacy: false,
      acceptCookies: false
    }
  }
};

/** Replacing the default "Continue"/"Go back" action pair via the `actions` slot. */
export const CustomActions: Story = {
  render: ({ disabled, value }) => html`
    <sl-account-creation-form ?disabled=${disabled} .value=${value}>
      <div slot="actions">
        <sl-button shape="pill" size="lg" type="submit" variant="primary">Create account</sl-button>
      </div>
    </sl-account-creation-form>
  `
};
