import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Paginator } from './paginator.js';

type Props = Pick<Paginator, 'emphasis' | 'fill' | 'page' | 'pageSize' | 'size' | 'totalItems' | 'width'>;
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
    emphasis: {
      control: 'inline-radio',
      options: ['subtle', 'bold']
    },
    fill: {
      control: 'inline-radio',
      options: ['ghost', 'outline']
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg']
    },
    width: {
      control: 'radio',
      options: ['xs', 'sm', 'md', 'lg']
    }
  },
  render: ({ emphasis, fill, page, pageSize, size, totalItems, width }) => {
    return html`
      <sl-paginator
        .page=${page}
        .pageSize=${pageSize}
        .totalItems=${totalItems}
        emphasis=${ifDefined(emphasis)}
        fill=${ifDefined(fill)}
        size=${ifDefined(size)}
        width=${ifDefined(width)}
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
  parameters: {
    viewport: {
      defaultViewport: 'reset'
    }
  },
  render: ({ page, pageSize, totalItems }) => {
    const sizes = ['sm', 'md', 'lg'];

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
      ${sizes.map(
        size => html`
          <h2>Size: ${size}</h2>
          <h3>Emphasis subtle (default)</h3>
          <section>
            <span>Ghost, width: xs</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              size=${size}
              width="xs"
            ></sl-paginator>

            <span>Ghost, width: sm</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              size=${size}
              width="sm"
            ></sl-paginator>

            <span>Ghost, width: md</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              size=${size}
              width="md"
            ></sl-paginator>

            <span>Ghost, width: lg</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              size=${size}
              width="lg"
            ></sl-paginator>

            <span>Outline, width: sm</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              fill="outline"
              size=${size}
              width="sm"
            ></sl-paginator>

            <span>Outline, width: md</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              fill="outline"
              size=${size}
              width="md"
            ></sl-paginator>

            <span>Outline, width: lg</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              fill="outline"
              size=${size}
              width="lg"
            ></sl-paginator>
          </section>
          <h3>Emphasis bold</h3>
          <section>
            <span>Ghost, width: xs</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              emphasis="bold"
              size=${size}
              width="xs"
            ></sl-paginator>

            <span>Ghost, width: sm</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              emphasis="bold"
              size=${size}
              width="sm"
            ></sl-paginator>

            <span>Ghost, width: md</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              emphasis="bold"
              size=${size}
              width="md"
            ></sl-paginator>

            <span>Ghost, width: lg</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              emphasis="bold"
              size=${size}
              width="lg"
            ></sl-paginator>

            <span>Outline, width: sm</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              emphasis="bold"
              fill="outline"
              size=${size}
              width="sm"
            ></sl-paginator>

            <span>Outline, width: md</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              emphasis="bold"
              fill="outline"
              size=${size}
              width="md"
            ></sl-paginator>

            <span>Outline, width: lg</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              emphasis="bold"
              fill="outline"
              size=${size}
              width="lg"
            ></sl-paginator>
          </section>
        `
      )}
    `;
  }
};
