import '@sl-design-system/dialog/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type DateField } from './date-field.js';

type Props = Pick<
  DateField,
  | 'disabled'
  | 'locale'
  | 'max'
  | 'min'
  | 'month'
  | 'placeholder'
  | 'readonly'
  | 'required'
  | 'selectOnly'
  | 'showValid'
  | 'showWeekNumbers'
  | 'value'
> & {
  hint?: string;
  label?: string;
  reportValidity?: boolean;
  slot?(): TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'Form/Date field',
  tags: ['draft'],
  args: {
    disabled: false,
    label: 'Date',
    placeholder: 'Pick a date',
    readonly: false,
    required: false,
    selectOnly: false,
    showValid: true,
    showWeekNumbers: false
  },
  argTypes: {
    hint: {
      table: { disable: true }
    },
    label: {
      table: { disable: true }
    },
    locale: {
      control: 'inline-radio',
      options: ['de', 'en-GB', 'es', 'fi', 'fr', 'it', 'nl', 'nl-BE', 'no', 'pl', 'sv']
    },
    max: {
      control: 'date'
    },
    min: {
      control: 'date'
    },
    month: {
      control: 'date'
    },
    slot: {
      table: { disable: true }
    },
    value: {
      control: 'date'
    }
  },
  render: ({
    disabled,
    hint,
    label,
    locale,
    max,
    min,
    month,
    placeholder,
    readonly,
    reportValidity,
    required,
    selectOnly,
    showValid,
    showWeekNumbers,
    slot,
    value
  }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    console.log('value in date field story', value);

    return html`
      <sl-form .value=${value}>
        <sl-form-field .hint=${hint} .label=${label}>
          <sl-date-field
            ?disabled=${disabled}
            ?readonly=${readonly}
            ?required=${required}
            ?select-only=${selectOnly}
            ?show-week-numbers=${showWeekNumbers}
            .value=${value}
            .show-valid=${showValid}
            locale=${ifDefined(locale)}
            max=${ifDefined(max?.toISOString())}
            min=${ifDefined(min?.toISOString())}
            month=${ifDefined(month?.toISOString())}
            placeholder=${ifDefined(placeholder)}
            style="width: fit-content"
          >
            ${slot?.()}
          </sl-date-field>
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

export const MinMax: Story = {
  args: {
    month: new Date(2025, 0, 1),
    max: new Date(2025, 0, 20),
    min: new Date(2025, 0, 10)
  }
};

export const Readonly: Story = {
  args: {
    readonly: true
  }
};

export const Required: Story = {
  args: {
    hint: 'This field is required, if you leave it empty you will see an error message when clicking the button.',
    reportValidity: true,
    required: true
  }
};

export const SelectOnly: Story = {
  args: {
    selectOnly: true
  }
};

export const ShowWeekNumbers: Story = {
  args: {
    showWeekNumbers: true
  }
};

export const Value: Story = {
  args: {
    value: new Date(2024, 8, 12)
  }
};

export const Dialog: Story = {
  render: () => {
    const onClick = async (event: Event & { target: HTMLElement }) => {
      const dialog = document.createElement('sl-dialog');

      dialog.innerHTML = `
        <span slot="title">Dialog with a date field</span>
        <div class="container">
          This dialog should not be closed when the date picker is closed.
          <sl-date-field select-only placeholder="this is a date field in the dialog" style="width: fit-content"> </sl-date-field>
        </div>
        <sl-button slot="primary-actions" sl-dialog-close variant="primary">Close</sl-button>
      `;

      dialog.closeButton = true;

      dialog.addEventListener('sl-close', () => dialog.remove());

      event.target.insertAdjacentElement('afterend', dialog);

      await dialog.updateComplete;

      dialog.showModal();
    };

    return html`
      <style>
        .container {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-block-end: 0.5rem;
        }
      </style>
      <sl-button @click=${onClick}>Open dialog</sl-button>
    `;
  }
};
