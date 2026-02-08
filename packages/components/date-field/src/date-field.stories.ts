import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type DateField } from './date-field.js';

type Props = Pick<
  DateField,
  | 'disabled'
  | 'max'
  | 'min'
  | 'month'
  | 'placeholder'
  | 'readonly'
  | 'requireConfirmation'
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
    requireConfirmation: false,
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
    max,
    min,
    month,
    placeholder,
    readonly,
    reportValidity,
    requireConfirmation,
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

    return html`
      <sl-form .value=${value}>
        <sl-form-field .hint=${hint} .label=${label}>
          <sl-date-field
            ?disabled=${disabled}
            ?readonly=${readonly}
            ?require-confirmation=${requireConfirmation}
            ?required=${required}
            ?select-only=${selectOnly}
            ?show-week-numbers=${showWeekNumbers}
            .value=${value}
            .show-valid=${showValid}
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

export const ExtraControls: Story = {
  args: {
    requireConfirmation: true,
    slot: () => {
      const onClear = (): void => {
        const dateField = document.querySelector('sl-date-field'),
          calendar = dateField?.renderRoot.querySelector('sl-calendar');

        if (calendar) {
          calendar.selected = undefined;
        }
      };

      const onToday = (): void => {
        const dateField = document.querySelector('sl-date-field'),
          calendar = dateField?.renderRoot.querySelector('sl-calendar');

        if (calendar) {
          calendar.selected = new Date();
        }
      };

      return html`
        <sl-button @click=${onToday} fill="link">Today</sl-button>
        <sl-button @click=${onClear} fill="link">Clear</sl-button>
      `;
    }
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

export const All: Story = {
  render: () => {
    // Mock date in Chromatic is 2025-06-01
    const mockDate = new Date('2025-06-15');

    return html`
      <style>
        section {
          display: inline-grid;
          gap: 2rem;
          grid-template-columns: repeat(2, auto);
        }
        .date-field-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .date-field-wrapper > span {
          font-weight: var(--sl-text-new-typeset-fontWeight-semiBold);
        }
      </style>
      <section>
        <div class="date-field-wrapper">
          <span>Basic</span>
          <sl-form-field label="Date">
            <sl-date-field placeholder="Pick a date"></sl-date-field>
          </sl-form-field>
        </div>

        <div class="date-field-wrapper">
          <span>With Value</span>
          <sl-form-field label="Date">
            <sl-date-field .value=${mockDate} placeholder="Pick a date"></sl-date-field>
          </sl-form-field>
        </div>

        <div class="date-field-wrapper">
          <span>Required</span>
          <sl-form-field label="Date">
            <sl-date-field placeholder="Pick a date" required></sl-date-field>
          </sl-form-field>
        </div>

        <div class="date-field-wrapper">
          <span>Disabled</span>
          <sl-form-field label="Date">
            <sl-date-field disabled placeholder="Pick a date"></sl-date-field>
          </sl-form-field>
        </div>

        <div class="date-field-wrapper">
          <span>Readonly</span>
          <sl-form-field label="Date">
            <sl-date-field .value=${mockDate} placeholder="Pick a date" readonly></sl-date-field>
          </sl-form-field>
        </div>

        <div class="date-field-wrapper">
          <span>Select Only</span>
          <sl-form-field label="Date">
            <sl-date-field placeholder="Pick a date" select-only></sl-date-field>
          </sl-form-field>
        </div>

        <div class="date-field-wrapper">
          <span>Week Numbers</span>
          <sl-form-field label="Date">
            <sl-date-field placeholder="Pick a date" show-week-numbers></sl-date-field>
          </sl-form-field>
        </div>

        <div class="date-field-wrapper">
          <span>Min/Max</span>
          <sl-form-field label="Date">
            <sl-date-field
              max=${new Date('2025-06-20').toISOString()}
              min=${new Date('2025-06-10').toISOString()}
              month=${new Date('2025-06-01').toISOString()}
              placeholder="Pick a date"
            ></sl-date-field>
          </sl-form-field>
        </div>
      </section>
    `;
  }
};
