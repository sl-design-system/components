import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Paginator } from './paginator.js';

type Props = Pick<Paginator, 'page' | 'pageSize' | 'size' | 'totalItems'>;
type Story = StoryObj<Props>;

export default {
  title: 'Navigation/Paginator/Paginator',
  tags: ['draft'],
  parameters: {
    viewport: {
      defaultViewport: 'reset'
    }
  },
  args: {
    page: 2,
    pageSize: 10,
    totalItems: 200
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['xs', 'sm', 'md', 'lg']
    }
  },
  render: ({ page, pageSize, totalItems, size }) => {
    return html`
      <sl-paginator
        .page=${page}
        .pageSize=${pageSize}
        .totalItems=${totalItems}
        size=${ifDefined(size)}
      ></sl-paginator>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone5'
    }
  }
};

export const All: Story = {
  args: {
    totalItems: 200
  },
  render: ({ page, pageSize, totalItems }) => {
    const onPageChange = (event: SlChangeEvent<number>): void => {
      document.querySelectorAll('sl-paginator').forEach(paginator => {
        if (paginator === event.target) return;

        paginator.page = event.detail;
      });
    };

    return html`
      <style>
        section {
          align-items: center;
          display: grid;
          gap: 1rem;
          grid-template-columns: auto 1fr;
        }
        sl-paginator {
          justify-content: center;
        }
        sl-paginator-size {
          justify-content: end;
        }
      </style>
      <section>
        <span>xs</span>
        <sl-paginator
          @sl-page-change=${onPageChange}
          .page=${page}
          .pageSize=${pageSize}
          .totalItems=${totalItems}
          size="xs"
        ></sl-paginator>

        <span>sm</span>
        <sl-paginator
          @sl-page-change=${onPageChange}
          .page=${page}
          .pageSize=${pageSize}
          .totalItems=${totalItems}
          size="sm"
        ></sl-paginator>

        <span>md</span>
        <sl-paginator
          @sl-page-change=${onPageChange}
          .page=${page}
          .pageSize=${pageSize}
          .totalItems=${totalItems}
          size="md"
        ></sl-paginator>

        <span>lg</span>
        <sl-paginator
          @sl-page-change=${onPageChange}
          .page=${page}
          .pageSize=${pageSize}
          .totalItems=${totalItems}
          size="lg"
        ></sl-paginator>
      </section>
    `;
  }
};
