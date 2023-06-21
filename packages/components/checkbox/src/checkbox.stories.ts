import type { Checkbox, CheckboxSize } from './checkbox.js';
import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/label/register.js';
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

//  helper function to create nodeArrays (not collections)
const nodeArray = (selector: string, parent?: Document | ParentNode | null): Element[] => {
  parent = parent ?? document;
  return [].slice.call(parent.querySelectorAll(selector));
};

const onChange = (event: Event): void => {
  let check: Checkbox = event.target as Checkbox;
  if (check.indeterminate) {
    check.checked = true;
    check.indeterminate = false;
  }

  if (!check) return;

  //  check/uncheck children (includes check itself)
  const children = nodeArray('sl-checkbox', check.parentNode);
  children.forEach(child => {
    (child as Checkbox).checked = check.checked;
    (child as Checkbox).indeterminate = false;
  });

  //  traverse up from target check
  while (check && check !== null) {
    const parentContainer = (check as Element).closest('ul')?.parentNode;

    if (!parentContainer || parentContainer?.nodeName !== 'LI') return;

    const parent = parentContainer.querySelector('sl-checkbox');
    const siblings = nodeArray('sl-checkbox', parent?.closest('li')?.querySelector('ul'));

    if (!parent) return;

    //  get checked state of siblings
    //  are every or some siblings checked (using Boolean as test function)
    const checkStatus = siblings.map(check => (check as Checkbox).checked);
    const every = checkStatus.every(Boolean);
    const some = checkStatus.some(Boolean);

    //  check parent if all siblings are checked
    //  set indeterminate if not all and not none are checked
    parent.checked = every;
    parent.indeterminate = !every && every !== some;

    //  prepare for nex loop
    if (check != parent) {
      check = parent;
    } else {
      return;
    }
  }
};

const sizes: CheckboxSize[] = ['md', 'lg'];
const states: string[] = ['', 'valid', 'invalid'];
const checked: string[] = ['', 'checked', 'indeterminate'];

export default {
  title: 'Checkbox',
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
    text: 'Toggle me',
    value: '12345',
    size: 'md',
    hint: 'Something to help the user out'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    }
  }
};

export const API: StoryObj = {
  render: ({ checked, disabled, indeterminate, text, value, size, hint }) => html`
    <sl-checkbox
      ?checked=${checked}
      ?disabled=${disabled}
      .indeterminate=${indeterminate}
      .value=${value}
      .size=${size}
      .hint=${hint}
      >${text}</sl-checkbox
    >
  `
};

export const All: StoryObj = {
  render: () => {
    return html`
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
                              <sl-checkbox
                                ?checked=${c === 'checked'}
                                ?indeterminate=${c === 'indeterminate'}
                                ?invalid=${state === 'invalid'}
                                ?required=${state === 'invalid'}
                                ?valid=${state === 'valid'}
                                size=${size}
                                data-mock-state
                                >Label
                              </sl-checkbox>
                            </td>
                          `
                      )}
                      <td>
                        <sl-checkbox
                          ?checked=${c === 'checked'}
                          ?indeterminate=${c === 'indeterminate'}
                          size=${size}
                          disabled
                          data-mock-state
                          >Label
                        </sl-checkbox>
                      </td>`
                )}
              </tr>`
          )}
        </tbody>
      </table>
    `;
  }
};

export const Indeterminate: StoryObj = {
  render: () => html`
    <h2>Single</h2>
    <sl-checkbox indeterminate>Indeterminate</sl-checkbox>
    <h2>In group, with children</h2>
    <p>
      When you use the checkboxes in a nested structure, or have one checkbox to rule them all (to select all in a list
      of items for example) this is how the indeterminate state should behave:
    </p>
    <ul>
      <li>
        <sl-checkbox @sl-change=${onChange} name="tall" id="tall">Tall Things</sl-checkbox>
        <ul>
          <li>
            <sl-checkbox @sl-change=${onChange} name="tall-1" id="tall-1">Buildings</sl-checkbox>
          </li>
          <li>
            <sl-checkbox @sl-change=${onChange} name="tall-2" id="tall-2">Giants</sl-checkbox>

            <ul>
              <li>
                <sl-checkbox @sl-change=${onChange} name="tall-2-1" id="tall-2-1">Andre</sl-checkbox>
              </li>
              <li>
                <sl-checkbox @sl-change=${onChange} name="tall-2-2" id="tall-2-2">Paul Bunyan</sl-checkbox>
              </li>
            </ul>
          </li>
          <li>
            <sl-checkbox @sl-change=${onChange} name="tall-3" id="tall-3">Two sandwiches</sl-checkbox>
          </li>
        </ul>
      </li>
      <li>
        <sl-checkbox @sl-change=${onChange} name="short" id="short">Short Things</sl-checkbox>
        <ul>
          <li>
            <sl-checkbox @sl-change=${onChange} name="short-1" id="short-1">Smurfs</sl-checkbox>
          </li>
          <li>
            <sl-checkbox @sl-change=${onChange} name="short-2" id="short-2">Mushrooms</sl-checkbox>
          </li>
          <li>
            <sl-checkbox @sl-change=${onChange} name="short-3" id="short-3">One Sandwich</sl-checkbox>
          </li>
        </ul>
      </li>
    </ul>
  `
};

export const NoText: StoryObj = {
  render: () => html`
    <style>
      div {
        align-items: start;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      sl-checkbox {
        background: hotpink;
      }
    </style>
    <div>
      <sl-checkbox aria-label="Hello world"> </sl-checkbox>
      <sl-checkbox>Hello world</sl-checkbox>
      <sl-checkbox aria-label="Hello world" size="lg"></sl-checkbox>
      <sl-checkbox size="lg">Hello world</sl-checkbox>
    </div>
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
    <em>Borders are added to show the alignment in the container</em>
    <div class="wrapper">
      <sl-checkbox
        >Elit consectetur duis nisi id veniam id deserunt cupidatat. Consectetur consectetur consequat ea proident nulla
        consectetur anim incididunt esse magna eu. In est cupidatat ea veniam exercitation irure ullamco nisi proident
        enim.
      </sl-checkbox>
    </div>
    <div class="wrapper">
      <sl-checkbox>Elit consectetur. </sl-checkbox>
    </div>
  `
};

export const WithLabel: StoryObj = {
  render: () => html`
    <style>
      .wrapper {
        display: flex;
        flex-direction: column;
      }
    </style>
    ${sizes.map(
      size => html`
        <h2>Size: ${size}</h2>
        <div class="wrapper">
          <sl-label for="checkbox" size=${size}>Label</sl-label>
          <sl-checkbox id="checkbox" size=${size}>Checkbox</sl-checkbox>
        </div>
      `
    )}
  `
};

export const Group: StoryObj = {
  render: () => html`
    <sl-label for="group">Checkbox group</sl-label>
    <sl-checkbox-group id="group" hint="Pick one of these options.">
      <sl-checkbox>Check me</sl-checkbox>
      <sl-checkbox>No me</sl-checkbox>
      <sl-checkbox>I was here first!</sl-checkbox>
      <sl-checkbox disabled>Can't check me, even if you wanted to</sl-checkbox>
    </sl-checkbox-group>
  `
};

export const ValidateInForm: StoryObj = {
  render: () => {
    setTimeout(() => document.querySelector('form')?.reportValidity());

    return html`
      <style>
        form {
          align-items: start;
          display: flex;
          flex-direction: column;
        }
        sl-label {
          margin-block-start: 0.5rem;
        }
        sl-label:first-of-type {
          margin-block-start: 0;
        }
        sl-button-bar,
        sl-text-input,
        sl-textarea {
          align-self: stretch;
        }
      </style>
      <form @submit=${onSubmit}>
        <sl-label for="group">Checkbox group</sl-label>
        <sl-checkbox-group id="group" required id="options" name="options">
          <sl-checkbox value="1">Check me</sl-checkbox>
          <sl-checkbox value="2" checked>No me</sl-checkbox>
          <sl-checkbox value="3">I was here first!</sl-checkbox>
          <sl-checkbox value="4" disabled>Can't check me, even if you wanted to</sl-checkbox>
        </sl-checkbox-group>
        <sl-label for="conditions">Read everything?</sl-label>
        <sl-checkbox value="read" name="conditions" required checked
          >Yes, I have read the terms and conditions</sl-checkbox
        >
        <sl-label for="newletter">Can we spam you?</sl-label>
        <sl-checkbox value="yes" name="newletter">Yes, subscribe me to the newsletter</sl-checkbox>
        <sl-button-bar align="end">
          <sl-button type="reset">Reset</sl-button>
          <sl-button type="submit">Submit</sl-button>
        </sl-button-bar>
      </form>
    `;
  }
};
