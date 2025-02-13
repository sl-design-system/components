import '@sl-design-system/button/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import '../register.js';
import { type RadioGroup } from './radio-group.js';

type Props = Pick<RadioGroup, 'disabled' | 'horizontal' | 'required' | 'showValid' | 'size' | 'value'> & {
  hint?: string;
  label?: string;
  options?(): TemplateResult;
  reportValidity?: boolean;
  slot?(): TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'Form/Radio group',
  tags: ['stable'],
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            selector: ':where(sl-radio, sl-radio-group):not([disabled])'
          }
        ]
      }
    }
  },
  args: {
    disabled: false,
    horizontal: false,
    label: 'Label',
    required: false,
    showValid: false,
    size: 'md',
    value: null
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    },
    value: {
      control: 'text'
    }
  },
  render: ({ disabled, hint, horizontal, label, options, reportValidity, required, showValid, slot, value, size }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          ${slot?.() ??
          html`
            <sl-radio-group
              ?disabled=${disabled}
              ?horizontal=${horizontal}
              ?required=${required}
              ?show-valid=${showValid}
              .size=${size}
              .value=${value}
            >
              ${options?.() ??
              html`
                <sl-radio value="1">One</sl-radio>
                <sl-radio value="2">Two</sl-radio>
                <sl-radio value="3">Three</sl-radio>
              `}
            </sl-radio-group>
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

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Horizontal: Story = {
  args: {
    horizontal: true
  }
};

export const Overflow: Story = {
  args: {
    options: () => html`
      <sl-radio value="1">Lorem ipsum</sl-radio>
      <sl-radio value="2">
        Elit consectetur duis nisi id veniam id deserunt cupidatat. Consectetur consectetur consequat ea
      </sl-radio>
      <sl-radio value="3">
        Amet consequat veniam nostrud labore. Labore labore sunt in nisi ut voluptate cillum. Consequat ex dolor nostrud
        duis veniam ut est. Commodo dolor incididunt laborum cupidatat anim magna voluptate Lorem eu elit eiusmod mollit
        irure.
      </sl-radio>
    `
  }
};

export const Required: Story = {
  args: {
    hint: "This field is required, if you don't select an option, you will see an error message when clicking the button.",
    reportValidity: true,
    required: true
  }
};

export const Valid: Story = {
  args: {
    hint: 'After clicking the button, this field will show it is valid.',
    reportValidity: true,
    showValid: true
  }
};

export const Value: Story = {
  args: {
    value: '2'
  }
};

export const CustomValidity: Story = {
  args: {
    hint: 'This story has both builtin validation (required) and custom validation. You need to pick the middle option to make the field valid. The custom validation is done by listening to the sl-change event and setting the custom validity on the radio group. If you never select any option, then only the builtin validation applies.',
    reportValidity: true,
    slot: () => {
      const onValidate = (event: Event & { target: RadioGroup }): void => {
        event.target.setCustomValidity(event.target.value === '2' ? '' : 'Pick the middle option');
      };

      return html`
        <sl-radio-group @sl-validate=${onValidate} required>
          <sl-radio value="1">One</sl-radio>
          <sl-radio value="2">Two</sl-radio>
          <sl-radio value="3">Three</sl-radio>
        </sl-radio-group>
      `;
    }
  }
};

export const CustomAsyncValidity: Story = {
  args: {
    hint: 'This story has an async validator. You need to pick the middle option to make the field valid. It will wait 2 seconds before validating.',
    reportValidity: true,
    slot: () => {
      const onValidate = (event: Event & { target: RadioGroup }): void => {
        const promise = new Promise<string>(resolve =>
          setTimeout(() => resolve(event.target.value === '2' ? '' : 'Pick the middle option'), 2000)
        );

        event.target.setCustomValidity(promise);
      };

      return html`
        <sl-radio-group @sl-validate=${onValidate} required>
          <sl-radio value="1">One</sl-radio>
          <sl-radio value="2">Two</sl-radio>
          <sl-radio value="3">Three</sl-radio>
        </sl-radio-group>
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
          grid-template-columns: auto 1fr 1fr 1fr 1fr;
        }
      </style>
      <div class="wrapper">
        <span></span>
        <span style="grid-column: 2 / 4; justify-self: center">md</span>
        <span style="grid-column: 4 / 6; justify-self: center">lg</span>

        <span>Default</span>
        <sl-radio>Unchecked</sl-radio>
        <sl-radio checked>Checked</sl-radio>
        <sl-radio size="lg">Unchecked</sl-radio>
        <sl-radio checked size="lg">Checked</sl-radio>

        <span>Invalid</span>
        <sl-radio show-validity="invalid">Unchecked</sl-radio>
        <sl-radio checked show-validity="invalid">Checked</sl-radio>
        <sl-radio show-validity="invalid" size="lg">Unchecked</sl-radio>
        <sl-radio checked show-validity="invalid" size="lg">Checked</sl-radio>

        <span>Valid</span>
        <sl-radio show-validity="valid">Unchecked</sl-radio>
        <sl-radio checked show-validity="valid">Checked</sl-radio>
        <sl-radio show-validity="valid" size="lg">Unchecked</sl-radio>
        <sl-radio checked show-validity="valid" size="lg">Checked</sl-radio>

        <span>Disabled</span>
        <sl-radio disabled>Unchecked</sl-radio>
        <sl-radio checked disabled>Checked</sl-radio>
        <sl-radio disabled size="lg">Unchecked</sl-radio>
        <sl-radio checked disabled size="lg">Checked</sl-radio>
      </div>
    `;
  }
};
