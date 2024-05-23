import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type CheckboxGroup } from './checkbox-group.js';
import { type Checkbox, type CheckboxSize } from './checkbox.js';

type Props = Pick<
  Checkbox,
  'checked' | 'disabled' | 'indeterminate' | 'required' | 'showValid' | 'showValidity' | 'size' | 'value'
> & {
  hint?: string;
  label?: string;
  slot?(): TemplateResult;
  text?: string;
};
type Story = StoryObj<Props>;

const sizes: CheckboxSize[] = ['sm', 'md', 'lg'];

export default {
  title: 'Form/Checkbox group',
  tags: ['stable'],
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
    label: 'Label',
    text: 'Toggle me',
    value: '12345',
    size: 'md'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes
    }
  },
  render: ({ checked, disabled, hint, indeterminate, label, required, showValid, size, slot, text, value }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          ${slot?.() ??
          html`
            <sl-checkbox
              ?checked=${checked}
              ?disabled=${disabled}
              ?indeterminate=${indeterminate}
              ?required=${required}
              .showValid=${showValid}
              .size=${size ?? 'md'}
              .value=${value}
              >${text}</sl-checkbox
            >
          `}
        </sl-form-field>
        <sl-button-bar>
          <sl-button @click=${onClick}>Report validity</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Empty: Story = {
  args: {
    hint: 'This checkbox has no text and is only as wide as the checkbox itself',
    text: ''
  }
};

export const Required: Story = {
  args: {
    hint: 'This checkbox is required and should display an error after reporting the validity',
    required: true
  }
};

export const Group: Story = {
  args: {
    slot: () => html`
      <sl-checkbox-group>
        <sl-checkbox value="0">Check me</sl-checkbox>
        <sl-checkbox value="1">No me</sl-checkbox>
        <sl-checkbox value="2">I was here first!</sl-checkbox>
        <sl-checkbox disabled value="3">Can't check me, even if you wanted to</sl-checkbox>
      </sl-checkbox-group>
    `
  }
};

export const Indeterminate: StoryObj = {
  render: () => {
    const onChange = (event: Event & { target: Checkbox }): void => {
      let check = event.target;

      if (check.indeterminate) {
        check.checked = true;
        check.indeterminate = false;
      }

      if (!check) return;

      // check/uncheck children (includes check itself)
      check.parentElement?.querySelectorAll('sl-checkbox').forEach(child => {
        child.checked = check.checked;
        child.indeterminate = false;
      });

      //  traverse up from target check
      while (check && check !== null) {
        const parentContainer = (check as Element).closest('ul')?.parentNode;

        if (!parentContainer || parentContainer?.nodeName !== 'LI') return;

        const parent = parentContainer.querySelector('sl-checkbox');
        if (!parent) return;

        const checkStatus = Array.from(
          parent?.closest('li')?.querySelector('ul')?.querySelectorAll('sl-checkbox') ?? []
        ).map(child => child.checked);

        //  get checked state of siblings
        //  are every or some siblings checked (using Boolean as test function)
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

    return html`
      <h2>Single</h2>
      <sl-checkbox indeterminate>Indeterminate</sl-checkbox>
      <h2>In group, with children</h2>
      <p>
        When you use the checkboxes in a nested structure, or have one checkbox to rule them all (to select all in a
        list of items for example) this is how the indeterminate state should behave:
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
    `;
  }
};

export const Overflow: Story = {
  args: {
    hint: 'The checkbox should be aligned with the first row of text',
    text: 'Nostrud exercitation irure sint sint aliquip quis nostrud adipisicing. Amet qui proident aliqua est. Voluptate dolore est et nisi adipisicing minim magna excepteur officia sit ullamco aute dolor. Sit velit enim labore ullamco aute. Est ea officia velit aliquip anim non irure in occaecat ipsum est aliquip dolore. Excepteur magna aute duis sint enim exercitation aliqua dolor enim ullamco sit ex. Sit ea ex ut aute veniam laboris consectetur Lorem fugiat laboris.'
  }
};

export const Valid: Story = {
  args: {
    checked: true,
    hint: 'This checkbox is marked as valid after reporting the validity',
    showValid: true
  }
};

export const CustomValidity: Story = {
  args: {
    hint: 'This story has both builtin validation (required) and custom validation. You need to select the middle option to make the field valid. The custom validation is done by listening to the sl-validate event and setting the custom validity on the checkbox group.',
    slot: () => {
      const onValidate = (event: Event & { target: CheckboxGroup }): void => {
        event.target.setCustomValidity(event.target.value?.includes('2') ? '' : 'Pick the middle option');
      };

      return html`
        <sl-checkbox-group @sl-validate=${onValidate} required>
          <sl-checkbox value="1">One</sl-checkbox>
          <sl-checkbox value="2">Two</sl-checkbox>
          <sl-checkbox value="3">Three</sl-checkbox>
        </sl-checkbox-group>
      `;
    }
  }
};

export const CustomAsyncValidity: Story = {
  args: {
    hint: 'This story has an async validator. You need to select the middle option to make the field valid. It will wait 2 seconds before validating.',
    slot: () => {
      const onValidate = (event: Event & { target: CheckboxGroup }): void => {
        if (!event.target.value?.length) {
          return;
        }

        const promise = new Promise<string>(resolve =>
          setTimeout(() => resolve(event.target.value?.includes('2') ? '' : 'Pick the middle option'), 2000)
        );

        event.target.setCustomValidity(promise);
      };

      return html`
        <sl-checkbox-group @sl-validate=${onValidate} required>
          <sl-checkbox value="1">One</sl-checkbox>
          <sl-checkbox value="2">Two</sl-checkbox>
          <sl-checkbox value="3">Three</sl-checkbox>
        </sl-checkbox-group>
      `;
    }
  }
};

export const All: StoryObj = {
  render: () => {
    const checked: string[] = ['', 'checked', 'indeterminate'];

    return html`
      <style>
        table {
          border-collapse: collapse;
          border-spacing: 0;
        }
        td[colspan] {
          font-weight: bold;
          padding-block-start: 1rem;
          text-align: center;
        }
        td {
          padding: 0.25rem 0.5rem;
        }
      </style>
      <table>
        <tbody>
          ${sizes.map(
            size => html`
              <tr>
                <td colspan="4">${size}</td>
              </tr>
              ${checked.map(
                check => html`
                  <tr>
                    <td>
                      <sl-checkbox
                        ?checked=${check === 'checked'}
                        ?indeterminate=${check === 'indeterminate'}
                        size=${size}
                        >Label
                      </sl-checkbox>
                    </td>
                    <td>
                      <sl-checkbox
                        ?checked=${check === 'checked'}
                        ?indeterminate=${check === 'indeterminate'}
                        show-validity="valid"
                        size=${size}
                        >Label
                      </sl-checkbox>
                    </td>
                    <td>
                      <sl-checkbox
                        ?checked=${check === 'checked'}
                        ?indeterminate=${check === 'indeterminate'}
                        show-validity="invalid"
                        size=${size}
                        >Label
                      </sl-checkbox>
                    </td>
                    <td>
                      <sl-checkbox
                        ?checked=${check === 'checked'}
                        ?indeterminate=${check === 'indeterminate'}
                        size=${size}
                        disabled
                        >Label
                      </sl-checkbox>
                    </td>
                  </tr>
                `
              )}
            `
          )}
        </tbody>
      </table>
    `;
  }
};
