import {
  faArrowDown,
  faArrowDownToLine,
  faArrowUp,
  faArrowUpToLine
} from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/badge/register.js';
import '@sl-design-system/button/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Listbox, type ListboxItem } from './listbox.js';

Icon.register(faArrowDown, faArrowDownToLine, faArrowUp, faArrowUpToLine);

type Props = Pick<
  Listbox,
  | 'emphasis'
  | 'options'
  | 'optionGroupPath'
  | 'optionLabelPath'
  | 'optionSelectedPath'
  | 'optionValuePath'
> & {
  slot?(): TemplateResult;
  behavior?: 'smooth' | 'auto';
};
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Listbox',
  argTypes: {
    behavior: {
      control: 'radio',
      options: ['smooth', 'auto']
    },
    emphasis: {
      control: 'inline-radio',
      options: ['subtle', 'bold']
    },
    options: {
      table: { disable: true }
    },
    slot: {
      table: { disable: true }
    }
  },
  render: ({
    behavior,
    emphasis,
    options,
    optionGroupPath,
    optionLabelPath,
    optionSelectedPath,
    optionValuePath,
    slot
  }) => {
    let scrollToPosition = 0;

    const renderer = (
      item: ListboxItem<{ value: number; label: string; selected: boolean }>,
      index: number
    ) => {
      // Only render options, skip group headers
      if (!('option' in item)) {
        const header = document.createElement('sl-option-group-header');
        header.textContent = item.label;
        return header;
      }

      const option = document.createElement('sl-option');
      option.textContent = item.label;
      option.value = item.value;
      option.selected = item.selected;
      if (index === scrollToPosition) {
        option.setAttribute('current', '');
      }
      return option;
    };

    const scrollTo = (index: number): void => {
      scrollToPosition = index;
      if (index < 0) {
        scrollToPosition = 0;
      } else if (index >= (options?.length ?? 0)) {
        scrollToPosition = (options?.length ?? 1) - 1;
      }
      const listbox = document.querySelector('sl-listbox');
      listbox?.scrollToIndex(scrollToPosition, { behavior });
      // Trigger a re-render with the new current index
      listbox?.requestUpdate();
    };

    return html`
      <style>
        sl-listbox {
          border: var(--sl-color-border-plain) solid var(--sl-size-borderWidth-subtle);
          border-radius: var(--sl-size-borderRadius-default);
          max-block-size: calc(100dvh - 4rem);
        }
        sl-button-bar + sl-listbox {
          margin-block-start: 1rem;
          max-block-size: calc(100dvh - 7rem);
        }
      </style>
      ${options
        ? html`
            <sl-button-bar>
              Scroll:
              <sl-button @click=${() => scrollTo(0)} aria-label="Scroll to top"
                ><sl-icon name="far-arrow-up-to-line"></sl-icon
              ></sl-button>
              <sl-button @click=${() => scrollTo(scrollToPosition - 1)} aria-label="Scroll up one"
                ><sl-icon name="far-arrow-up"></sl-icon
              ></sl-button>
              <sl-button @click=${() => scrollTo(Math.floor(options.length / 2) - 1)}
                >Scroll to ${Math.floor(options.length / 2)}</sl-button
              >
              <sl-button @click=${() => scrollTo(scrollToPosition + 1)} aria-label="Scroll down one"
                ><sl-icon name="far-arrow-down"></sl-icon
              ></sl-button>
              <sl-button @click=${() => scrollTo(options.length - 1)} aria-label="Scroll to bottom"
                ><sl-icon name="far-arrow-down-to-line"></sl-icon
              ></sl-button>
            </sl-button-bar>
          `
        : nothing}
      <sl-listbox
        .options=${options}
        .optionGroupPath=${optionGroupPath}
        .optionLabelPath=${optionLabelPath}
        .optionSelectedPath=${optionSelectedPath}
        .optionValuePath=${optionValuePath}
        .renderer=${options ? renderer : undefined}
        emphasis=${ifDefined(emphasis)}>
        ${slot?.()}
      </sl-listbox>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    slot: () => html`
      <sl-option>Option 1</sl-option>
      <sl-option selected>Option 2</sl-option>
      <sl-option>Option 3</sl-option>
    `
  }
};

export const Disabled: Story = {
  args: {
    slot: () => html`
      <sl-option disabled>Option 1</sl-option>
      <sl-option>Option 2</sl-option>
      <sl-option>Option 3</sl-option>
    `
  }
};

export const Divider: Story = {
  args: {
    slot: () => html`
      <sl-option>Option 1</sl-option>
      <sl-option>Option 2</sl-option>
      <hr />
      <sl-option>Option 3</sl-option>
    `
  }
};

export const Emphasis: Story = {
  args: {
    ...Basic.args,
    emphasis: 'bold'
  }
};

export const Groups: Story = {
  args: {
    slot: () => html`
      <sl-option-group label="Group 1">
        <sl-option>Option 1</sl-option>
        <sl-option>Option 2</sl-option>
      </sl-option-group>
      <sl-option>I am not in a group</sl-option>
      <sl-option-group label="Group 2">
        <sl-option>Option 3</sl-option>
        <sl-option>Option 4</sl-option>
      </sl-option-group>
    `
  }
};

export const Overflow: Story = {
  args: {
    slot: () => html`
      <sl-option>
        Magna ea amet aute est ullamco elit. Culpa fugiat commodo exercitation nulla sunt et ea
        eiusmod et duis sit. Labore ad laborum esse mollit nulla amet fugiat incididunt. Velit
        aliquip amet nostrud aliquip labore velit consectetur sint aute. Nostrud aliquip dolore
        minim commodo ea. Ut veniam dolor laborum sunt voluptate voluptate adipisicing.
      </sl-option>
      <sl-option selected>
        Excepteur nisi tempor nisi sint. Deserunt esse eiusmod tempor aliqua. Adipisicing est est
        nostrud pariatur eu dolore veniam exercitation. Anim labore et ea non sunt irure excepteur
        ad. Ex duis aliqua et esse. Adipisicing id laboris cupidatat ullamco fugiat in. Sunt
        deserunt sint veniam labore reprehenderit magna mollit commodo id irure ut excepteur.
      </sl-option>
      <sl-option>
        Nisi ut cupidatat do qui dolore aliquip reprehenderit ad proident laboris pariatur in
        nostrud laborum. Mollit esse occaecat ex duis dolore officia laboris quis. Duis eiusmod sint
        exercitation enim consequat eu occaecat eu magna dolore nulla ut proident non. Anim Lorem
        reprehenderit consectetur duis quis exercitation cupidatat laboris cupidatat fugiat
        consectetur culpa.
      </sl-option>
    `
  }
};

export const RichContent: Story = {
  args: {
    slot: () => html`
      <style>
        sl-option::part(wrapper) {
          gap: 0.5rem;
        }
        sl-badge {
          flex-shrink: 0;
          margin-inline-start: auto;
        }
      </style>
      <sl-option-group label="Module 1">
        <sl-option
          >Chapter 1 <sl-badge emphasis="bold" variant="info">Published</sl-badge></sl-option
        >
        <sl-option
          >Chapter 2 <sl-badge emphasis="bold" variant="info">Published</sl-badge></sl-option
        >
      </sl-option-group>
      <sl-option-group label="Module 2">
        <sl-option selected>
          Cillum proident reprehenderit amet ipsum labore aliqua ea excepteur enim duis. Nisi eu
          nulla eiusmod irure ut anim aute ex eiusmod nisi do Lorem ut. Pariatur anim tempor in
          fugiat. Sit ullamco exercitation ipsum et eu nisi id minim ut. Labore id fugiat
          exercitation dolor fugiat non dolore anim et enim ex consequat non Lorem. Lorem quis sint
          et et. <sl-badge emphasis="bold">Draft</sl-badge>
        </sl-option>
      </sl-option-group>
    `
  }
};

export const VirtualList: Story = {
  args: {
    optionLabelPath: 'label',
    optionSelectedPath: 'selected',
    optionValuePath: 'value',
    options: Array.from({ length: 10000 }).map((_, i) => ({
      label: `Option ${i + 1}`,
      selected: i % 2 === 0,
      value: i
    }))
  }
};

export const VirtualListWithGroups: Story = {
  args: {
    optionGroupPath: 'group',
    optionLabelPath: 'label',
    optionSelectedPath: 'selected',
    optionValuePath: 'value',
    options: Array.from({ length: 10000 }).map((_, i) => ({
      group: `Options ${Math.floor((i + 1) / 100) * 100}..${Math.floor((i + 1) / 100) * 100 + 99}`,
      label: `Option ${i + 1}`,
      selected: i % 2 === 0,
      value: i
    }))
  }
};

export const VirtualListUnconstrained: Story = {
  args: {
    optionLabelPath: 'label',
    optionValuePath: 'value',
    options: Array.from({ length: 1000 }).map((_, i) => ({
      label: `Option ${i + 1}`,
      value: i
    }))
  },
  render: ({ options, optionLabelPath, optionValuePath }) => html`
    <style>
      .demo-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .demo-box {
        border: 2px dashed #ccc;
        padding: 1rem;
      }
      .demo-box h3 {
        margin: 0 0 0.5rem;
        font-size: 0.875rem;
        font-weight: bold;
      }
      .demo-box p {
        margin: 0 0 1rem;
        font-size: 0.875rem;
        color: #666;
      }
      sl-listbox {
        border: var(--sl-color-border-plain) solid var(--sl-size-borderWidth-subtle);
        border-radius: var(--sl-size-borderRadius-default);
      }
      .css-height-30 {
        height: 30rem;
      }
      .css-max-height-25 {
        max-height: 25rem;
      }
      .css-max-height-15 {
        max-height: 15rem;
      }
    </style>
    <div class="demo-container">
      <div class="demo-box">
        <h3>Without explicit height (gets 20rem fallback)</h3>
        <p>
          Virtual lists without height constraints get a 20rem max-height fallback to prevent
          unstable behavior.
        </p>
        <sl-listbox
          .options=${options}
          .optionLabelPath=${optionLabelPath}
          .optionValuePath=${optionValuePath}>
        </sl-listbox>
      </div>

      <div class="demo-box">
        <h3>With inline style: height: 30rem (not clamped)</h3>
        <p>
          Inline styles have the highest specificity, so they override the 20rem fallback. The
          listbox respects the authored 30rem height.
        </p>
        <sl-listbox
          style="height: 30rem"
          .options=${options}
          .optionLabelPath=${optionLabelPath}
          .optionValuePath=${optionValuePath}>
        </sl-listbox>
      </div>

      <div class="demo-box">
        <h3>With CSS class: max-height: 25rem (not clamped)</h3>
        <p>
          When consumers set max-height via CSS, the fallback detects it and is not applied. Use
          max-height (not height) for CSS-based constraints.
        </p>
        <sl-listbox
          class="css-max-height-25"
          .options=${options}
          .optionLabelPath=${optionLabelPath}
          .optionValuePath=${optionValuePath}>
        </sl-listbox>
      </div>

      <div class="demo-box">
        <h3>With CSS class: max-height: 15rem (shorter than fallback)</h3>
        <p>Consumers can also set a max-height via CSS shorter than the 20rem fallback.</p>
        <sl-listbox
          class="css-max-height-15"
          .options=${options}
          .optionLabelPath=${optionLabelPath}
          .optionValuePath=${optionValuePath}>
        </sl-listbox>
      </div>

      <div class="demo-box">
        <h3>⚠️ Limitation: CSS height (gets clamped)</h3>
        <p>
          Setting height via CSS class doesn't prevent the fallback (technical limitation). Use
          inline style or max-height instead for CSS-based sizing.
        </p>
        <sl-listbox
          class="css-height-30"
          .options=${options}
          .optionLabelPath=${optionLabelPath}
          .optionValuePath=${optionValuePath}>
        </sl-listbox>
      </div>
    </div>
  `
};
