import '@sl-design-system/badge/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../register.js';
import { type Listbox } from './listbox.js';

type Props = Pick<Listbox, 'items' | 'itemLabelPath' | 'itemSelectedPath' | 'itemValuePath'> & {
  options?(): TemplateResult;
};
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Listbox',
  tags: ['draft'],
  argTypes: {
    items: {
      table: { disable: true }
    },
    options: {
      table: { disable: true }
    }
  },
  render: ({ items, itemLabelPath, itemSelectedPath, itemValuePath, options }) => {
    return html`
      <style>
        sl-listbox {
          border: var(--sl-color-elevation-border-raised) solid var(--sl-size-borderWidth-default);
          border-radius: var(--sl-size-borderRadius-default);
          max-block-size: calc(100dvh - 3rem);
        }
      </style>
      <sl-listbox
        .items=${items}
        .itemLabelPath=${itemLabelPath}
        .itemSelectedPath=${itemSelectedPath}
        .itemValuePath=${itemValuePath}
      >
        ${options?.()}
      </sl-listbox>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    options: () => html`
      <sl-option>Option 1</sl-option>
      <sl-option selected>Option 2</sl-option>
      <sl-option>Option 3</sl-option>
    `
  }
};

export const Disabled: Story = {
  args: {
    options: () => html`
      <sl-option disabled>Option 1</sl-option>
      <sl-option>Option 2</sl-option>
      <sl-option>Option 3</sl-option>
    `
  }
};

export const Divider: Story = {
  args: {
    options: () => html`
      <sl-option>Option 1</sl-option>
      <sl-option>Option 2</sl-option>
      <hr />
      <sl-option>Option 3</sl-option>
    `
  }
};

export const Grouped: Story = {
  args: {
    options: () => html`
      <sl-option-group label="Group 1">
        <sl-option>Option 1</sl-option>
        <sl-option>Option 2</sl-option>
      </sl-option-group>
      <sl-option-group label="Group 2">
        <sl-option>Option 3</sl-option>
        <sl-option>Option 4</sl-option>
      </sl-option-group>
    `
  }
};

export const Overflow: Story = {
  args: {
    options: () => html`
      <sl-option>
        Magna ea amet aute est ullamco elit. Culpa fugiat commodo exercitation nulla sunt et ea eiusmod et duis sit.
        Labore ad laborum esse mollit nulla amet fugiat incididunt. Velit aliquip amet nostrud aliquip labore velit
        consectetur sint aute. Nostrud aliquip dolore minim commodo ea. Ut veniam dolor laborum sunt voluptate voluptate
        adipisicing.
      </sl-option>
      <sl-option selected>
        Excepteur nisi tempor nisi sint. Deserunt esse eiusmod tempor aliqua. Adipisicing est est nostrud pariatur eu
        dolore veniam exercitation. Anim labore et ea non sunt irure excepteur ad. Ex duis aliqua et esse. Adipisicing
        id laboris cupidatat ullamco fugiat in. Sunt deserunt sint veniam labore reprehenderit magna mollit commodo id
        irure ut excepteur.
      </sl-option>
      <sl-option>
        Nisi ut cupidatat do qui dolore aliquip reprehenderit ad proident laboris pariatur in nostrud laborum. Mollit
        esse occaecat ex duis dolore officia laboris quis. Duis eiusmod sint exercitation enim consequat eu occaecat eu
        magna dolore nulla ut proident non. Anim Lorem reprehenderit consectetur duis quis exercitation cupidatat
        laboris cupidatat fugiat consectetur culpa.
      </sl-option>
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
      <sl-option-group label="Module 1">
        <sl-option>Chapter 1 <sl-badge emphasis="bold" variant="info">Published</sl-badge></sl-option>
        <sl-option>Chapter 2 <sl-badge emphasis="bold" variant="info">Published</sl-badge></sl-option>
      </sl-option-group>
      <sl-option-group label="Module 2">
        <sl-option selected>
          Cillum proident reprehenderit amet ipsum labore aliqua ea excepteur enim duis. Nisi eu nulla eiusmod irure ut
          anim aute ex eiusmod nisi do Lorem ut. Pariatur anim tempor in fugiat. Sit ullamco exercitation ipsum et eu
          nisi id minim ut. Labore id fugiat exercitation dolor fugiat non dolore anim et enim ex consequat non Lorem.
          Lorem quis sint et et. <sl-badge emphasis="bold">Draft</sl-badge>
        </sl-option>
      </sl-option-group>
    `
  }
};

export const VirtualList: Story = {
  args: {
    itemLabelPath: 'label',
    itemSelectedPath: 'selected',
    itemValuePath: 'value',
    items: Array.from({ length: 10000 }).map((_, i) => ({ label: `Option ${i + 1}`, selected: i % 2 === 0, value: i }))
  }
};
