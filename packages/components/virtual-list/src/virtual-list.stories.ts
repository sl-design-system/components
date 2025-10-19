import { faker } from '@faker-js/faker';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../register.js';
import { type VirtualList } from './virtual-list.js';

type Props = Pick<VirtualList, 'estimateSize' | 'gap' | 'overscan' | 'renderItem'> & {
  itemCount?: number;
  items?: unknown[];
  overflow?: boolean;
};
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Virtual list',
  tags: ['draft'],
  parameters: {
    layout: 'fullscreen'
  },
  args: {
    estimateSize: 65,
    gap: 0,
    itemCount: 10000,
    overscan: 3
  },
  argTypes: {
    renderItem: { table: { disable: true } },
    items: { table: { disable: true } }
  },
  render: ({ estimateSize, gap, itemCount, items, overflow, overscan, renderItem }) => {
    items ??= Array.from({ length: itemCount ?? 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      description: `This is item number ${i}`
    }));

    renderItem ??= (item: { id: number; name: string; description: string }) => html`
      <div part="item-content">
        <p part="item-name">${item.name}</p>
        <p part="item-description">${item.description}</p>
      </div>
      <span part="item-id">#${item.id}</span>
    `;

    const scrollTo = (index: number): void => {
      document.querySelector('sl-virtual-list')?.scrollToIndex(index, { align: 'start' });
    };

    return html`
      ${overflow
        ? html`
            <style>
              sl-virtual-list {
                block-size: 400px;
                border: var(--sl-size-borderWidth-default) solid var(--sl-color-border-plain);
                border-radius: var(--sl-size-borderRadius-default);
                overflow: auto;
                margin: var(--sl-size-200);
              }
            </style>
          `
        : html`
            <style>
              sl-virtual-list {
                padding-inline: var(--sl-size-200);
              }
            </style>
          `}

      <style>
        sl-button-bar {
          background: var(--sl-elevation-surface-base-default);
          padding: var(--sl-size-200);
          position: sticky;
          inset-block-start: 0;
          z-index: 1;
        }
        sl-virtual-list {
          &::part(item) {
            align-items: center;
            border-block-end: var(--sl-size-borderWidth-default) solid var(--sl-color-border-plain);
            display: flex;
            gap: var(--sl-size-100);
            padding: var(--sl-size-150);
          }

          &::part(item-content) {
            flex: 1;
          }

          &::part(item-name) {
            font-weight: 600;
            margin: 0;
          }

          &::part(item-description) {
            color: var(--sl-color-neutral-600);
            font-size: 0.875rem;
            margin: 0;
          }

          &::part(item-id) {
            color: var(--sl-color-neutral-500);
            font-size: 0.75rem;
            font-family: monospace;
          }
        }
      </style>
      <sl-button-bar>
        <sl-button @click=${() => scrollTo(0)}>Scroll to top</sl-button>
        <sl-button @click=${() => scrollTo(items.length / 2)}>Scroll to ${items.length / 2}</sl-button>
        <sl-button @click=${() => scrollTo(items.length - 1)}>Scroll to bottom</sl-button>
      </sl-button-bar>
      <sl-virtual-list
        .estimateSize=${estimateSize}
        .gap=${gap}
        .items=${items}
        .overscan=${overscan}
        .renderItem=${renderItem}
      >
      </sl-virtual-list>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Gap: Story = {
  args: {
    gap: 8
  }
};

export const Overflow: Story = {
  args: {
    overflow: true
  }
};

export const Size: Story = {
  args: {
    items: Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      description: faker.lorem.paragraphs(1)
    }))
  }
};
