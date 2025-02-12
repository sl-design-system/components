import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Checkbox } from './checkbox.js';

type Props = Pick<
  Checkbox,
  'checked' | 'disabled' | 'indeterminate' | 'required' | 'showValid' | 'showValidity' | 'size' | 'value'
> & {
  hint?: string;
  label?: string;
  reportValidity?: boolean;
  slot?(): TemplateResult;
  text?: string;
};
type Story = StoryObj<Props>;

export default {
  title: 'Form/Checkbox',
  tags: ['stable'],
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            selector: 'sl-checkbox:not([disabled])'
          }
        ]
      }
    }
  },
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
    label: 'Label',
    text: 'Toggle me',
    value: '12345'
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg']
    }
  },
  render: ({
    checked,
    disabled,
    hint,
    indeterminate,
    label,
    reportValidity,
    required,
    showValid,
    size,
    slot,
    text,
    value
  }) => {
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
              .value=${value}
              size=${ifDefined(size)}
              >${text}</sl-checkbox
            >
          `}
        </sl-form-field>
        ${reportValidity
          ? html`
              <sl-button-bar>
                <sl-button @click=${onClick}>Report validity</sl-button>
              </sl-button-bar>
            `
          : nothing}
      </sl-form>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Checked: Story = {
  args: {
    checked: true
  }
};

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

export const Required: Story = {
  args: {
    hint: 'This checkbox is required and should display an error after reporting the validity',
    reportValidity: true,
    required: true
  }
};

export const Valid: Story = {
  args: {
    checked: true,
    hint: 'This checkbox is marked as valid after reporting the validity',
    reportValidity: true,
    showValid: true
  }
};

export const CustomValidity: Story = {
  args: {
    hint: 'This story has both builtin validation (required) and custom validation. You need to tick the box to make the field valid. The custom validation is done by listening to the sl-validate event and setting the custom validity on the checkbox.',
    reportValidity: true,
    slot: () => {
      const onValidate = (event: Event & { target: Checkbox }): void => {
        event.target.setCustomValidity(event.target.checked ? '' : 'You need to tick the box');
      };

      return html`
        <sl-checkbox @sl-validate=${onValidate} required value="1">I agree to all terms &amp; conditions</sl-checkbox>
      `;
    }
  }
};

export const CustomAsyncValidity: Story = {
  args: {
    hint: 'This story has an async validator. You need to select the middle option to make the field valid. It will wait 2 seconds before validating.',
    reportValidity: true,
    slot: () => {
      const onValidate = (event: Event & { target: Checkbox }): void => {
        if (event.target.checked) {
          return;
        }

        const promise = new Promise<string>(resolve =>
          setTimeout(() => resolve(event.target.checked ? '' : 'You need to tick the box'), 2000)
        );

        event.target.setCustomValidity(promise);
      };

      return html`
        <sl-checkbox @sl-validate=${onValidate} required value="1">I agree to all terms &amp; conditions</sl-checkbox>
      `;
    }
  }
};

export const All: Story = {
  render: () => {
    return html`
      <style>
        .wrapper {
          align-items: center;
          display: inline-grid;
          gap: 1rem;
          grid-template-columns: auto repeat(1fr, 9);
        }
      </style>
      <div class="wrapper">
        <span></span>
        <span style="grid-column: 2 / 5; justify-self: center">sm</span>
        <span style="grid-column: 5 / 8; justify-self: center">md</span>
        <span style="grid-column: 8 / 11; justify-self: center">lg</span>

        <span>Default</span>
        <sl-checkbox size="sm">Unchecked</sl-checkbox>
        <sl-checkbox checked size="sm">Checked</sl-checkbox>
        <sl-checkbox indeterminate size="sm">Indeterminate</sl-checkbox>
        <sl-checkbox>Unchecked</sl-checkbox>
        <sl-checkbox checked>Checked</sl-checkbox>
        <sl-checkbox indeterminate>Indeterminate</sl-checkbox>
        <sl-checkbox size="lg">Unchecked</sl-checkbox>
        <sl-checkbox checked size="lg">Checked</sl-checkbox>
        <sl-checkbox indeterminate size="lg">Indeterminate</sl-checkbox>

        <span>Invalid</span>
        <sl-checkbox show-validity="invalid" size="sm">Unchecked</sl-checkbox>
        <sl-checkbox checked show-validity="invalid" size="sm">Checked</sl-checkbox>
        <sl-checkbox indeterminate show-validity="invalid" size="sm">Indeterminate</sl-checkbox>
        <sl-checkbox show-validity="invalid">Unchecked</sl-checkbox>
        <sl-checkbox checked show-validity="invalid">Checked</sl-checkbox>
        <sl-checkbox indeterminate show-validity="invalid">Indeterminate</sl-checkbox>
        <sl-checkbox show-validity="invalid" size="lg">Unchecked</sl-checkbox>
        <sl-checkbox checked show-validity="invalid" size="lg">Checked</sl-checkbox>
        <sl-checkbox indeterminate show-validity="invalid" size="lg">Indeterminate</sl-checkbox>

        <span>Valid</span>
        <sl-checkbox show-validity="valid" size="sm">Unchecked</sl-checkbox>
        <sl-checkbox checked show-validity="valid" size="sm">Checked</sl-checkbox>
        <sl-checkbox indeterminate show-validity="valid" size="sm">Indeterminate</sl-checkbox>
        <sl-checkbox show-validity="valid">Unchecked</sl-checkbox>
        <sl-checkbox checked show-validity="valid">Checked</sl-checkbox>
        <sl-checkbox indeterminate show-validity="valid">Indeterminate</sl-checkbox>
        <sl-checkbox show-validity="valid" size="lg">Unchecked</sl-checkbox>
        <sl-checkbox checked show-validity="valid" size="lg">Checked</sl-checkbox>
        <sl-checkbox indeterminate show-validity="valid" size="lg">Indeterminate</sl-checkbox>

        <span>Disabled</span>
        <sl-checkbox disabled size="sm">Unchecked</sl-checkbox>
        <sl-checkbox checked disabled size="sm">Checked</sl-checkbox>
        <sl-checkbox disabled indeterminate size="sm">Indeterminate</sl-checkbox>
        <sl-checkbox disabled>Unchecked</sl-checkbox>
        <sl-checkbox checked disabled>Checked</sl-checkbox>
        <sl-checkbox disabled indeterminate>Indeterminate</sl-checkbox>
        <sl-checkbox disabled size="lg">Unchecked</sl-checkbox>
        <sl-checkbox checked disabled size="lg">Checked</sl-checkbox>
        <sl-checkbox disabled indeterminate size="lg">Indeterminate</sl-checkbox>
      </div>
    `;
  }
};
