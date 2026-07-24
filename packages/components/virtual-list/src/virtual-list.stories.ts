import { faker } from '@faker-js/faker';
import {
  faArrowDown,
  faArrowDownToLine,
  faArrowUp,
  faArrowUpToLine
} from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../register.js';
import { type VirtualList } from './virtual-list.js';

Icon.register(faArrowDown, faArrowDownToLine, faArrowUp, faArrowUpToLine);

type Props = Pick<VirtualList, 'estimateSize' | 'gap' | 'overscan' | 'renderItem'> & {
  itemCount?: number;
  items?: unknown[];
  overflow?: boolean;
  behavior?: 'smooth' | 'auto';
};
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Virtual list',
  parameters: {
    chromatic: { disableSnapshot: true },
    layout: 'fullscreen'
  },
  args: {
    behavior: 'auto',
    estimateSize: 65,
    gap: 0,
    itemCount: 10000,
    overscan: 3
  },
  argTypes: {
    renderItem: { table: { disable: true } },
    items: { table: { disable: true } },
    behavior: {
      control: { type: 'radio' },
      options: ['auto', 'smooth']
    }
  },
  render: ({ estimateSize, gap, itemCount, items, overflow, overscan, renderItem, behavior }) => {
    items ??= Array.from({ length: itemCount ?? 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      description: `This is item number ${i}`
    }));

    renderItem ??= (item: { id: number; name: string; description: string }) => html`
      <div
        part="item-content"
        style=${item.id === scrollToPosition
          ? '--_outline-color: var(--sl-color-border-focused)'
          : ''}>
        <p part="item-name">${item.name}</p>
        <p part="item-description">${item.description}</p>
      </div>
      <span part="item-id">#${item.id}</span>
    `;
    let scrollToPosition = 0;

    const scrollTo = (index: number): void => {
      scrollToPosition = index;
      if (index < 0) {
        scrollToPosition = 0;
      } else if (index >= items.length) {
        scrollToPosition = items.length - 1;
      }
      const list = document.querySelector<VirtualList>('sl-virtual-list');

      list?.scrollToIndex(scrollToPosition, { align: 'start', behavior });
      list?.requestUpdate();
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
          & [part='item'] {
            align-items: center;
            border-block-end: var(--sl-size-borderWidth-default) solid var(--sl-color-border-plain);
            display: flex;
            gap: var(--sl-size-100);
            padding: var(--sl-size-150);
          }

          & [part='item-content'] {
            flex: 1;
            outline-offset: 4px;
            outline: var(--_outline-color, transparent) solid;
            border-radius: 2px;
          }

          & [part='item-name'] {
            font-weight: 600;
            margin: 0;
          }

          & [part='item-description'] {
            color: var(--sl-color-neutral-600);
            font-size: 0.875rem;
            margin: 0;
          }

          & [part='item-id'] {
            color: var(--sl-color-neutral-500);
            font-size: 0.75rem;
            font-family: monospace;
          }
        }
      </style>
      <sl-button-bar>
        Scroll:
        <sl-button @click=${() => scrollTo(0)} aria-label="Scroll to top"
          ><sl-icon name="far-arrow-up-to-line"></sl-icon
        ></sl-button>
        <sl-button @click=${() => scrollTo(scrollToPosition - 1)} aria-label="Scroll up one"
          ><sl-icon name="far-arrow-up"></sl-icon
        ></sl-button>
        <sl-button @click=${() => scrollTo(Math.floor(items.length / 2))}
          >to ${Math.floor(items.length / 2)}</sl-button
        >
        <sl-button @click=${() => scrollTo(scrollToPosition + 1)} aria-label="Scroll down one"
          ><sl-icon name="far-arrow-down"></sl-icon
        ></sl-button>
        <sl-button @click=${() => scrollTo(items.length - 1)} aria-label="Scroll to bottom"
          ><sl-icon name="far-arrow-down-to-line"></sl-icon
        ></sl-button>
      </sl-button-bar>
      <sl-virtual-list
        .estimateSize=${estimateSize}
        .gap=${gap}
        .items=${items}
        .overscan=${overscan}
        .renderItem=${renderItem}>
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
