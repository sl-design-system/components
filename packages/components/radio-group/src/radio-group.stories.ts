import type { RadioGroup } from './radio-group.js';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/button/register.js';
import '@sl-design-system/checkbox/register.js';
import { html } from 'lit';
import '../register.js';

const onSubmit = (event: Event & { target: HTMLFormElement }): void => {
  const data = new FormData(event.target),
    output = (event.target.nextElementSibling || document.createElement('pre')) as HTMLOutputElement;

  event.preventDefault();
  event.target.after(output);

  output.textContent = '';
  data.forEach((value, key) => (output.textContent += `${key}: ${value.toString()}\n`));
};

export default {
  title: 'Radio group'
};

export const API: StoryObj = {
  args: {
    disabled: false,
    horizontal: false,
    value: undefined,
    size: 'md'
  },
  argTypes: {
    value: {
      control: 'inline-radio',
      options: ['1', '2', '3']
    },
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    }
  },
  render: ({ disabled, horizontal, value, size }) => html`
    <sl-radio-group ?disabled=${disabled} ?horizontal=${horizontal} .value=${value}>
      <sl-radio value="1" .size=${size}>One</sl-radio>
      <sl-radio value="2" .size=${size}>Two</sl-radio>
      <sl-radio value="3" .size=${size}>Three</sl-radio>
    </sl-radio-group>
  `
};

export const All: StoryObj = {
  render: () => html`
    <style>
      .grid {
        display: inline-grid;
        gap: 1rem;
        grid-template-columns: repeat(2, 1fr);
        justify-items: center;
      }
      h2 {
        font-family: var(--sl-text-typeset-font-family-heading);
      }
    </style>
    <h2>Medium</h2>
    <div class="grid">
      <sl-radio>Default</sl-radio>
      <sl-radio checked>Checked</sl-radio>

      <sl-radio disabled>Default</sl-radio>
      <sl-radio disabled checked>Checked</sl-radio>

      <sl-radio invalid>Default</sl-radio>
      <sl-radio invalid checked>Checked</sl-radio>

      <sl-radio invalid disabled>Default</sl-radio>
      <sl-radio invalid disabled checked>Checked</sl-radio>

      <sl-radio valid>Default</sl-radio>
      <sl-radio valid checked>Checked</sl-radio>

      <sl-radio valid disabled>Default</sl-radio>
      <sl-radio valid disabled checked>Checked</sl-radio>
    </div>
    <h2>Large</h2>
    <div class="grid">
      <sl-radio size="lg">Default</sl-radio>
      <sl-radio size="lg" checked>Checked</sl-radio>

      <sl-radio size="lg" disabled>Default</sl-radio>
      <sl-radio size="lg" disabled checked>Checked</sl-radio>

      <sl-radio size="lg" invalid>Default</sl-radio>
      <sl-radio size="lg" invalid checked>Checked</sl-radio>

      <sl-radio size="lg" invalid disabled>Default</sl-radio>
      <sl-radio size="lg" invalid disabled checked>Checked</sl-radio>

      <sl-radio size="lg" valid>Default</sl-radio>
      <sl-radio size="lg" valid checked>Checked</sl-radio>

      <sl-radio size="lg" valid disabled>Default</sl-radio>
      <sl-radio size="lg" valid disabled checked>Checked</sl-radio>
    </div>
  `
};

export const Horizontal: StoryObj = {
  render: () => html`
    <sl-radio-group horizontal>
      <sl-radio value="1">One</sl-radio>
      <sl-radio value="2">Two</sl-radio>
      <sl-radio value="3">Three</sl-radio>
    </sl-radio-group>
  `
};

export const Overflow: StoryObj = {
  render: () => html`
    <style>
      div {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .wrapper {
        border: 2px solid rgb(var(--sl-color-palette-accent-base));
      }
    </style>
    <em>Borders are added to show the allignment in the container</em>
    <div class="wrapper">
      <sl-radio
        >Elit consectetur duis nisi id veniam id deserunt cupidatat. Consectetur consectetur consequat ea proident nulla
        consectetur anim incididunt esse magna eu. In est cupidatat ea veniam exercitation irure ullamco nisi proident
        enim.
      </sl-radio>
    </div>
    <div class="wrapper">
      <sl-radio>Elit consectetur. </sl-radio>
    </div>
  `
};

export const Label: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
    </style>
    <form>
      <sl-label for="radio-group">How many pets do you have?</sl-label>
      <sl-radio-group id="radio-group">
        <sl-radio value="0">None</sl-radio>
        <sl-radio value="1">One</sl-radio>
        <sl-radio value="2">Two</sl-radio>
        <sl-radio value="3">Three</sl-radio>
      </sl-radio-group>
    </form>
  `
};

export const Hint: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
    </style>
    <form>
      <sl-label for="radio-group">How many pets do you have?</sl-label>
      <sl-radio-group id="radio-group" hint="Fish count as well.">
        <sl-radio value="0">None</sl-radio>
        <sl-radio value="1">One</sl-radio>
        <sl-radio value="2">Two</sl-radio>
        <sl-radio value="3">Three</sl-radio>
      </sl-radio-group>
    </form>
  `
};

export const RichLabelHint: StoryObj = {
  render: () => html`
    <style>
      form {
        display: flex;
        flex-direction: column;
      }
    </style>
    <form>
      <sl-label for="radio-group">
        <label slot="label">Custom <i>label</i></label>
      </sl-label>
      <sl-radio-group id="radio-group">
        <sl-radio value="0">None</sl-radio>
        <sl-radio value="1">One</sl-radio>
        <sl-radio value="2">Two</sl-radio>
        <sl-radio value="3">Three</sl-radio>
        <div slot="hint">
          Hint is an accessible way to provide <strong>additional information</strong> that might help the user
        </div>
      </sl-radio-group>
    </form>
  `
};

export const InForm: StoryObj = {
  render: () => {
    return html`
      <form @submit=${onSubmit} name="formpje">
        <sl-label for="hm">How many pets do you have?</sl-label>
        <sl-radio-group required name="how-many" id="hm">
          <sl-radio value="1">One</sl-radio>
          <sl-radio value="2">Two</sl-radio>
          <sl-radio value="3">Three</sl-radio>
        </sl-radio-group>
        <sl-label for="preselected">What's your favourite letter?</sl-label>
        <sl-radio-group required name="preselected" id="preselected" value="c">
          <sl-radio value="a">A</sl-radio>
          <sl-radio value="b">B</sl-radio>
          <sl-radio value="c">C</sl-radio>
        </sl-radio-group>
        <sl-button type="reset">Reset</sl-button>
        <sl-button type="submit">Validate</sl-button>
      </form>
    `;
  }
};

export const CustomValidation: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as RadioGroup)?.reportValidity();
    };

    return html`
      <sl-radio-group required>
        <sl-radio value="1">One</sl-radio>
        <sl-radio value="2">Two</sl-radio>
        <sl-radio value="3">Three</sl-radio>
        <div slot="value-missing">This is the custom value-missing message (for the required attribute).</div>
      </sl-radio-group>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};
