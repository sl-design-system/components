import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Paginator } from './paginator.js';

type Props = Pick<Paginator, 'emphasis' | 'fill' | 'page' | 'pageSize' | 'totalItems' | 'width'>;
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
    width: {
      control: 'radio',
      options: ['xs', 'sm', 'md', 'lg']
    }
  },
  render: ({ emphasis, fill, page, pageSize, totalItems, width }) => {
    return html`
      <sl-paginator
        .page=${page}
        .pageSize=${pageSize}
        .totalItems=${totalItems}
        emphasis=${ifDefined(emphasis)}
        fill=${ifDefined(fill)}
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
      <h2>Emphasis subtle (default)</h2>
      <section>
        <span>Ghost, width: xs</span>
        <sl-paginator
          @sl-page-change=${onPageChange}
          .page=${page}
          .pageSize=${pageSize}
          .totalItems=${totalItems}
          width="xs"
        ></sl-paginator>

        <span>Ghost, width: sm</span>
        <sl-paginator
          @sl-page-change=${onPageChange}
          .page=${page}
          .pageSize=${pageSize}
          .totalItems=${totalItems}
          width="sm"
        ></sl-paginator>

        <span>Ghost, width: md</span>
        <sl-paginator
          @sl-page-change=${onPageChange}
          .page=${page}
          .pageSize=${pageSize}
          .totalItems=${totalItems}
          width="md"
        ></sl-paginator>

        <span>Ghost, width: lg</span>
        <sl-paginator
          @sl-page-change=${onPageChange}
          .page=${page}
          .pageSize=${pageSize}
          .totalItems=${totalItems}
          width="lg"
        ></sl-paginator>

        <span>Outline, width: sm</span>
        <sl-paginator
          @sl-page-change=${onPageChange}
          .page=${page}
          .pageSize=${pageSize}
          .totalItems=${totalItems}
          fill="outline"
          width="sm"
        ></sl-paginator>

        <span>Outline, width: md</span>
        <sl-paginator
          @sl-page-change=${onPageChange}
          .page=${page}
          .pageSize=${pageSize}
          .totalItems=${totalItems}
          fill="outline"
          width="md"
        ></sl-paginator>

        <span>Outline, width: lg</span>
        <sl-paginator
          @sl-page-change=${onPageChange}
          .page=${page}
          .pageSize=${pageSize}
          .totalItems=${totalItems}
          fill="outline"
          width="lg"
        ></sl-paginator>
      </section>
      <h2>Emphasis bold</h2>
      <section>
        <span>Ghost, width: xs</span>
        <sl-paginator
          @sl-page-change=${onPageChange}
          .page=${page}
          .pageSize=${pageSize}
          .totalItems=${totalItems}
          emphasis="bold"
          width="xs"
        ></sl-paginator>

        <span>Ghost, width: sm</span>
        <sl-paginator
          @sl-page-change=${onPageChange}
          .page=${page}
          .pageSize=${pageSize}
          .totalItems=${totalItems}
          emphasis="bold"
          width="sm"
        ></sl-paginator>

        <span>Ghost, width: md</span>
        <sl-paginator
          @sl-page-change=${onPageChange}
          .page=${page}
          .pageSize=${pageSize}
          .totalItems=${totalItems}
          emphasis="bold"
          width="md"
        ></sl-paginator>

        <span>Ghost, width: lg</span>
        <sl-paginator
          @sl-page-change=${onPageChange}
          .page=${page}
          .pageSize=${pageSize}
          .totalItems=${totalItems}
          emphasis="bold"
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
          width="lg"
        ></sl-paginator>
      </section>
    `;
  }
};

// TODO: change everythere size to width
// TODO: reset viewport? right now it's not always working in the stories, mobile everywhere?
// TODO: select `md` and `lg` and `md` as default???
