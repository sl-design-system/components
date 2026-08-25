import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/infotip/register.js';
import '@sl-design-system/tooltip/register.js';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
export default {
  title: 'Form/Checkbox/Checkbox',
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
    const onClick = event => {
      event.target.closest('sl-form')?.reportValidity();
    };
    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          ${
            slot?.() ??
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
            `
          }
        </sl-form-field>
        ${
          reportValidity
            ? html`
                <sl-button-bar>
                  <sl-button @click=${onClick}>Report validity</sl-button>
                </sl-button-bar>
              `
            : nothing
        }
      </sl-form>
    `;
  }
};
export const Basic = {};
export const Checked = {
  args: {
    checked: true
  }
};
export const Disabled = {
  args: {
    disabled: true
  }
};
export const Empty = {
  args: {
    hint: 'This checkbox has no text and is only as wide as the checkbox itself',
    text: ''
  }
};
export const Indeterminate = {
  render: () => {
    const onChange = event => {
      let check = event.target;
      if (check.indeterminate) {
        check.checked = true;
        check.indeterminate = false;
      }
      if (!check) return;
      check.parentElement?.querySelectorAll('sl-checkbox').forEach(child => {
        child.checked = check.checked;
        child.indeterminate = false;
      });
      while (check && check !== null) {
        const parentContainer = check.closest('ul')?.parentNode;
        if (!parentContainer || parentContainer?.nodeName !== 'LI') return;
        const parent = parentContainer.querySelector('sl-checkbox');
        if (!parent) return;
        const checkStatus = Array.from(
          parent?.closest('li')?.querySelector('ul')?.querySelectorAll('sl-checkbox') ?? []
        ).map(child => child.checked);
        const every = checkStatus.every(Boolean);
        const some = checkStatus.some(Boolean);
        parent.checked = every;
        parent.indeterminate = !every && every !== some;
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
        When you use the checkboxes in a nested structure, or have one checkbox to rule them all (to
        select all in a list of items for example) this is how the indeterminate state should
        behave:
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
                  <sl-checkbox @sl-change=${onChange} name="tall-2-1" id="tall-2-1"
                    >Andre</sl-checkbox
                  >
                </li>
                <li>
                  <sl-checkbox @sl-change=${onChange} name="tall-2-2" id="tall-2-2"
                    >Paul Bunyan</sl-checkbox
                  >
                </li>
              </ul>
            </li>
            <li>
              <sl-checkbox @sl-change=${onChange} name="tall-3" id="tall-3"
                >Two sandwiches</sl-checkbox
              >
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
              <sl-checkbox @sl-change=${onChange} name="short-2" id="short-2"
                >Mushrooms</sl-checkbox
              >
            </li>
            <li>
              <sl-checkbox @sl-change=${onChange} name="short-3" id="short-3"
                >One Sandwich</sl-checkbox
              >
            </li>
          </ul>
        </li>
      </ul>
    `;
  }
};
export const NoVisibleLabel = {
  render: () => {
    return html`
      <p style="margin: 0 0 1rem 0">This checkbox has no label. It uses a tooltip as the label.</p>
      <sl-checkbox id="checkbox"></sl-checkbox>
      <sl-tooltip for="checkbox">Toggle me</sl-tooltip>
    `;
  }
};
export const Infotip = {
  render: () => {
    return html`
      <sl-checkbox>
        Option 1
        <sl-infotip slot="infotip">This is an info tip for option 1</sl-infotip>
      </sl-checkbox>
    `;
  }
};
export const Overflow = {
  args: {
    hint: 'The checkbox should be aligned with the first row of text',
    text: 'Nostrud exercitation irure sint sint aliquip quis nostrud adipisicing. Amet qui proident aliqua est. Voluptate dolore est et nisi adipisicing minim magna excepteur officia sit ullamco aute dolor. Sit velit enim labore ullamco aute. Est ea officia velit aliquip anim non irure in occaecat ipsum est aliquip dolore. Excepteur magna aute duis sint enim exercitation aliqua dolor enim ullamco sit ex. Sit ea ex ut aute veniam laboris consectetur Lorem fugiat laboris.'
  }
};
export const Required = {
  args: {
    hint: 'This checkbox is required and should display an error after reporting the validity',
    reportValidity: true,
    required: true
  }
};
export const Valid = {
  args: {
    checked: true,
    hint: 'This checkbox is marked as valid after reporting the validity',
    reportValidity: true,
    showValid: true
  }
};
export const CustomValidity = {
  args: {
    hint: 'This story has both builtin validation (required) and custom validation. You need to tick the box to make the field valid. The custom validation is done by listening to the sl-validate event and setting the custom validity on the checkbox.',
    reportValidity: true,
    slot: () => {
      const onValidate = event => {
        event.target.setCustomValidity(event.target.checked ? '' : 'You need to tick the box');
      };
      return html`
        <sl-checkbox @sl-validate=${onValidate} required value="1"
          >I agree to all terms &amp; conditions</sl-checkbox
        >
      `;
    }
  }
};
export const CustomAsyncValidity = {
  args: {
    hint: 'This story has an async validator. You need to select the middle option to make the field valid. It will wait 2 seconds before validating.',
    reportValidity: true,
    slot: () => {
      const onValidate = event => {
        if (event.target.checked) {
          return;
        }
        const promise = new Promise(resolve =>
          setTimeout(() => resolve(event.target.checked ? '' : 'You need to tick the box'), 2e3)
        );
        event.target.setCustomValidity(promise);
      };
      return html`
        <sl-checkbox @sl-validate=${onValidate} required value="1"
          >I agree to all terms &amp; conditions</sl-checkbox
        >
      `;
    }
  }
};
//# sourceMappingURL=checkbox.stories.js.map
