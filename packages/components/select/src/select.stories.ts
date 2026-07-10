import {
  faCircle as fasCircle,
  faHexagon as fasHexagon,
  faSquare as fasSquare,
  faTriangle as fasTriangle
} from '@fortawesome/pro-solid-svg-icons';
import '@sl-design-system/avatar/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/listbox/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Select, type SelectSize } from './select.js';

type Props = Pick<
  Select,
  'clearable' | 'disabled' | 'placeholder' | 'required' | 'size' | 'value'
> & {
  hint?: string;
  label?: string;
  options?(): TemplateResult;
  reportValidity?: boolean;
  slot?(): TemplateResult;
};
type Story = StoryObj<Props>;

const sizes: SelectSize[] = ['md', 'lg'];

Icon.register(fasCircle, fasTriangle, fasHexagon, fasSquare);

export default {
  title: 'Form/Select',
  args: {
    disabled: false,
    label: 'Label',
    placeholder: 'Select an option',
    required: false,
    size: 'md',
    value: null
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: sizes
    },
    value: {
      control: 'text'
    }
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            /**
             * The rule is disabled for sl-select-button because it uses ariaLabelledByElements to
             * set aria-labelledby across shadow DOM boundaries, which the a11y checker cannot
             * reliably detect.
             */
            id: 'aria-input-field-name',
            enabled: false,
            selector: 'sl-select >> sl-select-button'
          }
        ]
      }
    }
  },
  render: ({
    clearable,
    disabled,
    hint,
    label,
    options,
    placeholder,
    reportValidity,
    required,
    size,
    slot,
    value
  }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <style>
        #storybook-root {
          max-width: calc(100vw - 2rem);
        }
      </style>
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          ${slot?.() ??
          html`
            <sl-select
              ?clearable=${clearable}
              ?disabled=${disabled}
              ?required=${required}
              .value=${value}
              placeholder=${ifDefined(placeholder)}
              size=${ifDefined(size)}>
              ${options?.() ??
              html`
                <sl-option value="1">Option 1</sl-option>
                <sl-option value="2">Option 2</sl-option>
                <sl-option value="3">Option 3</sl-option>
              `}
            </sl-select>
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

export const Clearable: Story = {
  args: {
    clearable: true,
    value: '2'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const EmbeddedComponents: Story = {
  args: {
    label: 'Student',
    placeholder: 'Select a student',
    slot: () => html`
      <style>
        sl-select-button::part(selected-option) {
          inline-size: 200px;
          padding-block: 5px;
        }
        sl-option::part(container) {
          padding-block: 4px;
        }
      </style>
      <sl-select value="2">
        <sl-option value="1">
          <sl-avatar size="sm" display-name="Ashley Howard"></sl-avatar>
        </sl-option>
        <sl-option value="2">
          <sl-avatar size="sm" display-name="Aria Bailey"></sl-avatar>
        </sl-option>
        <sl-option value="3">
          <sl-avatar size="sm" display-name="Cooper Philips"></sl-avatar>
        </sl-option>
        <sl-option value="4">
          <sl-avatar size="sm" display-name="Abigail Lewis"></sl-avatar>
        </sl-option>
        <sl-option disabled value="5">
          <sl-avatar size="sm" display-name="Ryder Turner"></sl-avatar>
        </sl-option>
        <sl-option value="6">
          <sl-avatar size="sm" display-name="Zoe Robinson"></sl-avatar>
        </sl-option>
      </sl-select>
    `
  }
};

export const CustomStyling: Story = {
  render: () => {
    return html`
      <style>
        sl-select-button {
          inline-size: 200px;
        }

        sl-select-button::part(selected-option) {
          padding-block: 5px;
        }

        sl-option::part(container) {
          padding-block: 4px;
        }

        .colorball {
          display: inline-block;
          width: 1em;
          height: 1em;
          border-radius: 50%;
          margin-inline-end: 0.5em;
        }
      </style>

      <p>
        This story shows a select component with custom styling. Each option displays a colored
        circle, and a label.
      </p>
      <sl-form>
        <sl-form-field label="Favorite color">
          <sl-select placeholder="Select a color">
            <sl-option value="red">
              <span class="colorball" style="background-color: red;"></span>
              Red
            </sl-option>
            <sl-option value="blue">
              <span class="colorball" style="background-color: blue;"></span>
              Blue
            </sl-option>
            <sl-option value="green">
              <span class="colorball" style="background-color: green;"></span>
              Green
            </sl-option>
          </sl-select>
        </sl-form-field>
      </sl-form>
    `;
  }
};

export const OptionsStyling: Story = {
  render: () => {
    const options = [
      { value: 'circle', label: 'Circle', icon: 'fas-circle' },
      { value: 'triangle', label: 'Triangle', icon: 'fas-triangle' },
      { value: 'square', label: 'Square', icon: 'fas-square' },
      { value: 'hexagon', label: 'Hexagon', icon: 'fas-hexagon' }
    ];

    type OptionType = { value: string; label: string; icon: string };

    const optionsRenderer = (option: OptionType) => {
      return html`
        <sl-option value=${option.value}>
          <div class="option-element">
            <div class="colorball"></div>
            <sl-icon name=${option.icon}></sl-icon>
            ${option.label}
          </div>
        </sl-option>
      `;
    };

    return html`
      <style>
        sl-select-button::part(selected-option) {
          inline-size: 200px;
          padding-block: 7px;
        }

        sl-option::part(container) {
          padding-block: 6px;
        }

        .option-element {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .colorball {
          background-color: yellow;
          display: inline-block;
          border-radius: 50%;
          margin-inline-end: 0.5em;
          width: 20px;
          height: 20px;
        }

        sl-icon {
          color: var(--sl-color-foreground-primary-bold);
        }
      </style>
      <p>
        This story demonstrates select options with custom content, including icons and styled
        elements. Each option displays a colored circle, an sl-icon, and a label. The story shows
        how to style the selected option display and individual option containers.
      </p>
      <sl-form>
        <sl-form-field label="Favorite shape">
          <sl-select value="circle">${options.map(optionsRenderer)} </sl-select>
        </sl-form-field>
      </sl-form>
    `;
  }
};

export const Empty: Story = {
  args: {
    placeholder: undefined
  }
};

export const Groups: Story = {
  args: {
    options: () => html`
      <sl-option-group label="Happy">
        <sl-option>😄 Grinning Face with Smiling Eyes</sl-option>
        <sl-option>😂 Face with Tears of Joy</sl-option>
        <sl-option>😊 Smiling Face with Smiling Eyes</sl-option>
        <sl-option>🤩 Star-Struck</sl-option>
        <sl-option disabled>🙂 Slightly Smiling Face</sl-option>
        <sl-option>🥳 Partying Face</sl-option>
      </sl-option-group>
      <sl-option>😶 Unfazed</sl-option>
      <sl-option-group label="Sad">
        <sl-option>😒 Unamused Face</sl-option>
        <sl-option>🤧 Sneezing Face</sl-option>
        <sl-option>😓 Downcast Face with Sweat</sl-option>
        <sl-option>😡 Enraged Face</sl-option>
      </sl-option-group>
      <sl-option-group>
        <sl-option>🐷 Pig</sl-option>
        <sl-option selected>🐨 Koala</sl-option>
        <sl-option>🐼 Panda</sl-option>
        <sl-option>🦊 Fox</sl-option>
      </sl-option-group>
      <sl-option>🤖 Robot</sl-option>
    `
  }
};

export const NoVisibleLabel: StoryObj = {
  render: () => {
    return html`
      <p style="margin: 0 0 1rem 0">
        This select has no internal or external label. It only has an
        <code>aria-label</code> attribute. That attribute is automatically applied to the
        <code>sl-select-button</code> element.
      </p>
      <sl-select aria-label="Select an option">
        <sl-option value="1">Option 1</sl-option>
        <sl-option value="2">Option 2</sl-option>
        <sl-option value="3">Option 3</sl-option>
      </sl-select>
    `;
  }
};

export const OptionOverflow: Story = {
  args: {
    hint: 'This field has a lot of options, try scrolling through them.',
    options: () => html`
      ${Array.from(
        { length: 100 },
        (_, i) => html`<sl-option value=${i + 1}>Option ${i + 1}</sl-option>`
      )}
    `
  }
};

export const Required: Story = {
  args: {
    hint: 'This field is required, if you leave it empty you will see an error message when clicking the button.',
    reportValidity: true,
    required: true
  }
};

export const Selected: Story = {
  args: {
    value: '2'
  }
};

export const TextOverflow: Story = {
  args: {
    placeholder:
      'Cupidatat adipisicing adipisicing dolore in ea ea magna culpa Lorem aute veniam in. Laboris ea pariatur velit adipisicing pariatur aliqua Lorem est aliqua Lorem minim excepteur.',
    options: () => html`
      <sl-option value="1">
        Voluptate sint ullamco proident cillum sint nostrud laborum labore et ad minim veniam
        eiusmod.
      </sl-option>
      <sl-option value="2">Consequat cupidatat amet sunt laborum laborum quis.</sl-option>
      <sl-option value="3">
        Culpa cillum nulla aute non quis deserunt minim sit magna. Consectetur in laborum mollit ea
        cillum dolor est ut deserunt qui nostrud deserunt. Labore adipisicing anim non sint.
      </sl-option>
    `
  }
};

export const WordBreak: Story = {
  args: {
    slot: () => html`
      <style>
        sl-select {
          width: 9em;
        }
      </style>
      <sl-select value="2">
        <sl-option value="1" lang="nl">Schoenenborsteldoosje</sl-option>
        <sl-option value="2" lang="en">1. MBO Paragraphcomponent</sl-option>
        <sl-option value="3" lang="en">Disproportionate</sl-option>
      </sl-select>
    `
  }
};

export const DisplayInlineBlock: Story = {
  render: () => html`
    <style>
      section {
        border: 2px solid coral;
        display: grid;
        grid-template-columns: repeat(3, minmax(0px, 1fr));
        gap: 8px;
      }
    </style>
    <section>
      <sl-select value="2" aria-label="Select step 1">
        <sl-option value="1">short</sl-option>
        <sl-option value="2">very very long option text</sl-option>
      </sl-select>
      <sl-select value="2" aria-label="Select step 2">
        <sl-option value="1">short</sl-option>
        <sl-option value="2">very very long option text</sl-option>
      </sl-select>
      <sl-select value="2" aria-label="Select step 3">
        <sl-option value="1">short</sl-option>
        <sl-option value="2">very very long option text</sl-option>
      </sl-select>
    </section>
  `
};

export const Valid: Story = {
  args: {
    hint: 'After clicking the button, this field will show it is valid.',
    reportValidity: true
  }
};

export const CustomValidity: Story = {
  args: {
    hint: 'This story has both builtin validation (required) and custom validation. The second option should be selected to make the field valid. In this example, you should never see the builtin validation message.',
    reportValidity: true,
    slot: () => {
      const onValidate = (event: Event & { target: Select }): void => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const value = event.target.value;

        event.target.setCustomValidity(value === '2' ? '' : 'Select the second option.');
      };

      return html`
        <sl-select @sl-validate=${onValidate} required>
          <sl-option value="1">Option 1</sl-option>
          <sl-option value="2">Option 2</sl-option>
          <sl-option value="3">Option 3</sl-option>
        </sl-select>
      `;
    }
  }
};

export const CustomAsyncValidity: Story = {
  args: {
    hint: 'This story has an async validator. You need to the second option to make the field valid. It will wait 2 seconds before validating.',
    reportValidity: true,
    slot: () => {
      const onValidate = (event: Event & { target: Select }): void => {
        const promise = new Promise<string>(resolve =>
          setTimeout(
            () => resolve(event.target.value === '2' ? '' : 'Select the second option'),
            2000
          )
        );

        event.target.setCustomValidity(promise);
      };

      return html`
        <sl-select @sl-validate=${onValidate} required>
          <sl-option value="1">Option 1</sl-option>
          <sl-option value="2">Option 2</sl-option>
          <sl-option value="3">Option 3</sl-option>
        </sl-select>
      `;
    }
  }
};

export const HideWhenOutOfView: StoryObj = {
  render: () => {
    return html`
      <style>
        #root-inner {
          min-height: 150vh;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        header {
          background:
            linear-gradient(var(--sl-color-background-subtle), var(--sl-color-background-subtle)),
            var(--sl-elevation-surface-base-default);
          position: sticky;
          top: 0;
          padding: 24px;
          z-index: 2;
        }

        .container {
          height: 400px;
          overflow: auto;
          margin-top: 24px;
          border: 1px solid var(--sl-color-border-neutral-subtle);
        }
        .scrollcontent {
          height: 800px;
          padding: 16px;
        }
      </style>
      <header>Sticky header</header>
      <sl-form-field hint="This will hide when the whole page" label="Window scroll">
        <sl-select hide-margin-top="100">
          <sl-option value="1">Option 1</sl-option>
          <sl-option value="2">Option 2</sl-option>
          <sl-option value="3">Option 3</sl-option>
          <sl-option value="4">Option 4</sl-option>
          <sl-option value="5">Option 5</sl-option>
          <sl-option value="6">Option 6</sl-option>
        </sl-select>
      </sl-form-field>

      <div class="container">
        <div class="scrollcontent">
          <sl-form-field
            hint="This will hide when the container is scrolled AND when the window is scrolled"
            label="Container scroll">
            <sl-select>
              <sl-option value="1">Option 1</sl-option>
              <sl-option value="2">Option 2</sl-option>
              <sl-option value="3">Option 3</sl-option>
              <sl-option value="4">Option 4</sl-option>
              <sl-option value="5">Option 5</sl-option>
              <sl-option value="6">Option 6</sl-option>
            </sl-select>
          </sl-form-field>
        </div>
      </div>
    `;
  }
};

export const All: Story = {
  render: () => {
    return html`
      <style>
        .wrapper {
          align-items: center;
          display: inline-grid;
          grid-template-columns: auto minmax(200px, 1fr) minmax(200px, 1fr);
          gap: 1rem;
        }
      </style>
      <div class="wrapper">
        <span></span>
        <span style="justify-self: center">md</span>
        <span style="justify-self: center">lg</span>

        <span>Placeholder</span>
        <sl-select placeholder="Select an option" aria-label="Medium select with placeholder">
          <sl-option>Value 1</sl-option>
          <sl-option>Value 2</sl-option>
          <sl-option>Value 3</sl-option>
        </sl-select>
        <sl-select
          placeholder="Select an option"
          size="lg"
          aria-label="Large select with placeholder">
          <sl-option>Value 1</sl-option>
          <sl-option>Value 2</sl-option>
          <sl-option>Value 3</sl-option>
        </sl-select>

        <span>Selected</span>
        <sl-select
          placeholder="Select an option"
          value="Value 2"
          aria-label="Medium select with selected value">
          <sl-option>Value 1</sl-option>
          <sl-option>Value 2</sl-option>
          <sl-option>Value 3</sl-option>
        </sl-select>
        <sl-select
          placeholder="Select an option"
          value="Value 2"
          size="lg"
          aria-label="Large select with selected value">
          <sl-option>Value 1</sl-option>
          <sl-option>Value 2</sl-option>
          <sl-option>Value 3</sl-option>
        </sl-select>

        <span>Clearable</span>
        <sl-select
          clearable
          placeholder="Select an option"
          value="Value 2"
          aria-label="Medium clearable select with selected value">
          <sl-option>Value 1</sl-option>
          <sl-option>Value 2</sl-option>
          <sl-option>Value 3</sl-option>
        </sl-select>
        <sl-select
          clearable
          placeholder="Select an option"
          value="Value 2"
          size="lg"
          aria-label="Large clearable select with selected value">
          <sl-option>Value 1</sl-option>
          <sl-option>Value 2</sl-option>
          <sl-option>Value 3</sl-option>
        </sl-select>

        <span>Valid</span>
        <sl-select
          placeholder="Select an option"
          show-validity="valid"
          value="Value 2"
          aria-label="Medium valid select with selected value">
          <sl-option>Value 1</sl-option>
          <sl-option>Value 2</sl-option>
          <sl-option>Value 3</sl-option>
        </sl-select>
        <sl-select
          placeholder="Select an option"
          show-validity="valid"
          value="Value 2"
          size="lg"
          aria-label="Large valid select with selected value">
          <sl-option>Value 1</sl-option>
          <sl-option>Value 2</sl-option>
          <sl-option>Value 3</sl-option>
        </sl-select>

        <span>Invalid</span>
        <sl-select
          placeholder="Select an option"
          show-validity="invalid"
          value="Value 2"
          aria-label="Medium invalid select with selected value">
          <sl-option>Value 1</sl-option>
          <sl-option>Value 2</sl-option>
          <sl-option>Value 3</sl-option>
        </sl-select>
        <sl-select
          placeholder="Select an option"
          show-validity="invalid"
          value="Value 2"
          size="lg"
          aria-label="Large invalid select with selected value">
          <sl-option>Value 1</sl-option>
          <sl-option>Value 2</sl-option>
          <sl-option>Value 3</sl-option>
        </sl-select>

        <span>Disabled</span>
        <sl-select
          disabled
          placeholder="Select an option"
          value="Value 2"
          aria-label="Medium disabled select with selected value">
          <sl-option>Value 1</sl-option>
          <sl-option>Value 2</sl-option>
          <sl-option>Value 3</sl-option>
        </sl-select>
        <sl-select
          disabled
          placeholder="Select an option"
          value="Value 2"
          size="lg"
          aria-label="Large disabled select with selected value">
          <sl-option>Value 1</sl-option>
          <sl-option>Value 2</sl-option>
          <sl-option>Value 3</sl-option>
        </sl-select>
      </div>
    `;
  }
};
