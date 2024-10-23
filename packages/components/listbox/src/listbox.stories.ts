import '@sl-design-system/badge/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';

type Props = { options?(): TemplateResult | TemplateResult[] };
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Listbox',
  tags: ['draft'],
  argTypes: {
    options: {
      table: { disable: true }
    }
  },
  render: ({ options }) => {
    return html`
      <style>
        sl-listbox {
          border: var(--sl-color-elevation-border-raised) solid var(--sl-size-borderWidth-default);
          border-radius: var(--sl-size-borderRadius-default);
          padding: var(--sl-space-new-md) 0;
        }
      </style>
      <sl-listbox>${options?.()}</sl-listbox>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    options: () => html`
      <option>Option 1</option>
      <option selected>Option 2</option>
      <option>Option 3</option>
    `
  }
};

export const Disabled: Story = {
  args: {
    options: () => html`
      <option disabled>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
    `
  }
};

export const Divider: Story = {
  args: {
    options: () => html`
      <option>Option 1</option>
      <option>Option 2</option>
      <hr />
      <option>Option 3</option>
    `
  }
};

export const Grouped: Story = {
  args: {
    options: () => html`
      <optgroup label="Group 1">
        <option>Option 1</option>
        <option>Option 2</option>
      </optgroup>
      <optgroup label="Group 2">
        <option>Option 3</option>
        <option>Option 4</option>
      </optgroup>
    `
  }
};

export const Overflow: Story = {
  args: {
    options: () => html`
      <option>
        Magna ea amet aute est ullamco elit. Culpa fugiat commodo exercitation nulla sunt et ea eiusmod et duis sit.
        Labore ad laborum esse mollit nulla amet fugiat incididunt. Velit aliquip amet nostrud aliquip labore velit
        consectetur sint aute. Nostrud aliquip dolore minim commodo ea. Ut veniam dolor laborum sunt voluptate voluptate
        adipisicing.
      </option>
      <option selected>
        Excepteur nisi tempor nisi sint. Deserunt esse eiusmod tempor aliqua. Adipisicing est est nostrud pariatur eu
        dolore veniam exercitation. Anim labore et ea non sunt irure excepteur ad. Ex duis aliqua et esse. Adipisicing
        id laboris cupidatat ullamco fugiat in. Sunt deserunt sint veniam labore reprehenderit magna mollit commodo id
        irure ut excepteur.
      </option>
      <option>
        Nisi ut cupidatat do qui dolore aliquip reprehenderit ad proident laboris pariatur in nostrud laborum. Mollit
        esse occaecat ex duis dolore officia laboris quis. Duis eiusmod sint exercitation enim consequat eu occaecat eu
        magna dolore nulla ut proident non. Anim Lorem reprehenderit consectetur duis quis exercitation cupidatat
        laboris cupidatat fugiat consectetur culpa.
      </option>
    `
  }
};

export const RichContent: Story = {
  args: {
    options: () => html`
      <style>
        sl-option::part(wrapper) {
          gap: 0.5rem;
        }
        sl-badge {
          flex-shrink: 0;
          margin-inline-start: auto;
        }
      </style>
      <sl-option>Chapter 1 <sl-badge emphasis="bold" variant="info">Published</sl-badge></sl-option>
      <sl-option>Chapter 2 <sl-badge emphasis="bold" variant="info">Published</sl-badge></sl-option>
      <sl-option selected>
        Cillum proident reprehenderit amet ipsum labore aliqua ea excepteur enim duis. Nisi eu nulla eiusmod irure ut
        anim aute ex eiusmod nisi do Lorem ut. Pariatur anim tempor in fugiat. Sit ullamco exercitation ipsum et eu nisi
        id minim ut. Labore id fugiat exercitation dolor fugiat non dolore anim et enim ex consequat non Lorem. Lorem
        quis sint et et. <sl-badge emphasis="bold">Draft</sl-badge>
      </sl-option>
    `
  }
};

export const Scrolling: Story = {
  parameters: {
    layout: 'fullscreen'
  },
  render: () => html`
    <style>
      sl-listbox {
        max-block-size: calc(100dvh - 1rem);
      }
    </style>
    <sl-listbox>${Array.from({ length: 100 }).map((_, i) => html`<option>Option ${i + 1}</option>`)}</sl-listbox>
  `
};
