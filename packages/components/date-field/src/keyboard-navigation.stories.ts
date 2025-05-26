import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type DateField } from './date-field.js';

type Props = Pick<DateField, 'disabled' | 'locale' | 'placeholder' | 'readonly' | 'value'>;
type Story = StoryObj<Props>;

export default {
  title: 'Form/Date field/Keyboard Navigation',
  tags: ['draft'],
  args: {
    disabled: false,
    placeholder: 'Pick a date using keyboard',
    readonly: false,
    value: new Date(2024, 0, 15) // January 15, 2024
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en-US', 'en-GB', 'de-DE', 'fr-FR', 'nl-NL']
    }
  },
  render: ({ disabled, locale, placeholder, readonly, value }) => {
    return html`
      <div style="padding: 20px; font-family: system-ui;">
        <h3>Keyboard Navigation Test</h3>
        <p style="background: #e3f2fd; padding: 10px; border-radius: 4px; margin-bottom: 20px;">
          <strong>Instructions:</strong><br />
          1. Focus the input field<br />
          2. Use <kbd>Left/Right</kbd> arrows to navigate between segments<br />
          3. Use <kbd>Up/Down</kbd> arrows to increment/decrement values<br />
          4. Type digits to input values directly<br />
          5. Use <kbd>Enter</kbd> or separators (/, -, .) to move to next segment<br />
          6. Use <kbd>Escape</kbd> or <kbd>Tab</kbd> to reset to first segment
        </p>

        <sl-date-field
          ?disabled=${disabled}
          locale=${ifDefined(locale)}
          placeholder=${ifDefined(placeholder)}
          ?readonly=${readonly}
          .value=${value}
          @sl-change=${(event: CustomEvent) => {
            console.log('Date changed:', event.detail);
            // Show change in UI
            const output = document.getElementById('output');
            if (output) {
              const date = event.detail as Date;
              output.textContent = `Changed to: ${date instanceof Date ? date.toLocaleDateString() : 'null'}`;
            }
          }}
        ></sl-date-field>

        <div style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
          <strong>Current value:</strong>
          <div id="output">\${value?.toLocaleDateString() || 'No date selected'}</div>
        </div>

        <div style="margin-top: 15px; font-size: 14px; color: #666;">
          <strong>Expected behaviors:</strong>
          <ul>
            <li>✅ Left/Right arrows navigate between day, month, year segments</li>
            <li>✅ Up/Down arrows increment/decrement the focused segment</li>
            <li>✅ Values wrap around (e.g., Dec 31 → Jan 1, day 31 → 1)</li>
            <li>✅ Direct digit input updates the focused segment</li>
            <li>✅ Segment is visually highlighted during navigation</li>
          </ul>
        </div>
      </div>
    `;
  }
} as Meta<Props>;

export const KeyboardNavigation: Story = {};

export const DifferentLocales: Story = {
  args: {
    locale: 'de-DE',
    value: new Date(2024, 11, 31) // December 31, 2024
  }
};

export const PaddedFormat: Story = {
  args: {
    locale: 'en-GB',
    value: new Date(2024, 5, 5) // June 5, 2024 (will show as 05/06/2024)
  },
  render: ({ disabled, locale, placeholder, readonly, value }) => {
    return html`
      <div style="padding: 20px; font-family: system-ui;">
        <h3>Padded Format Test (dd/MM/yyyy)</h3>
        <sl-date-field
          ?disabled=${disabled}
          locale=${ifDefined(locale)}
          placeholder=${ifDefined(placeholder)}
          ?readonly=${readonly}
          .value=${value}
          date-time-format='{"day": "2-digit", "month": "2-digit", "year": "numeric"}'
        ></sl-date-field>
      </div>
    `;
  }
};
