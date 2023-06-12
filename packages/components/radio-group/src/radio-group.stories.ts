import type { RadioGroup } from './radio-group.js';
import type { RadioButtonSize } from './radio.js';
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

const sizes: RadioButtonSize[] = ['md', 'lg'];
const states: string[] = ['', 'valid', 'invalid'];
const checked: string[] = ['', 'checked'];

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
      table {
        border-collapse: collapse;
        margin-bottom: 24px;
      }

      th {
        text-transform: capitalize;
      }
      th,
      td {
        padding: 4px 8px;
      }
      thead td {
        text-align: center;
      }

      tbody td:nth-of-type(4n + 5) {
        border-right: 2px solid #dedede;
        padding-right: 24px;
      }
      tbody td:nth-of-type(4n + 2):not(:first-of-type) {
        padding-left: 24px;
      }
      tbody td:last-of-type {
        border: none;
      }
    </style>
    <table>
      <thead>
        <tr>
          <th></th>
          ${sizes.map(size => html` <th colspan=${states.length + 1}>Size: ${size}</th> `)}
        </tr>
      </thead>
      <tbody>
        ${checked.map(
          c =>
            html` <tr>
              <td>${c}</td>
              ${sizes.map(
                size =>
                  html`${states.map(
                      state =>
                        html`
                          <td>
                            <sl-radio
                              ?checked=${c === 'checked'}
                              ?invalid=${state === 'invalid'}
                              ?required=${state === 'invalid'}
                              ?valid=${state === 'valid'}
                              size=${size}
                              data-mock-state
                              >Label
                            </sl-radio>
                          </td>
                        `
                    )}
                    <td>
                      <sl-radio ?checked=${c === 'checked'} size=${size} disabled data-mock-state>Label </sl-radio>
                    </td>`
              )}
            </tr>`
        )}
      </tbody>
    </table>
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
