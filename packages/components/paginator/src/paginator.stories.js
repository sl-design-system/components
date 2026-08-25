import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
export default {
  title: 'Navigation/Paginator/Paginator',
  parameters: {
    viewport: { disable: true }
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
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg']
    },
    width: {
      control: 'radio',
      options: ['xs', 'sm', 'md', 'lg']
    }
  },
  render: ({ emphasis, page, pageSize, size, totalItems, width }) => {
    return html`
      <sl-paginator
        .page=${page}
        .pageSize=${pageSize}
        .totalItems=${totalItems}
        emphasis=${ifDefined(emphasis)}
        size=${ifDefined(size)}
        width=${ifDefined(width)}></sl-paginator>
    `;
  }
};
export const Basic = {};
export const Mobile = {
  parameters: {
    viewport: {
      defaultViewport: 'mobileSmall'
    }
  }
};
export const All = {
  args: {
    totalItems: 200
  },
  render: ({ page, pageSize, totalItems }) => {
    const sizes = ['sm', 'md', 'lg'];
    const onPageChange = event => {
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
              width="xs"></sl-paginator>

            <span>Ghost, width: sm</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              size=${size}
              width="sm"></sl-paginator>

            <span>Ghost, width: md</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              size=${size}
              width="md"></sl-paginator>

            <span>Ghost, width: lg</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              size=${size}
              width="lg"></sl-paginator>
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
              width="xs"></sl-paginator>

            <span>Ghost, width: sm</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              emphasis="bold"
              size=${size}
              width="sm"></sl-paginator>

            <span>Ghost, width: md</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              emphasis="bold"
              size=${size}
              width="md"></sl-paginator>

            <span>Ghost, width: lg</span>
            <sl-paginator
              @sl-page-change=${onPageChange}
              .page=${page}
              .pageSize=${pageSize}
              .totalItems=${totalItems}
              emphasis="bold"
              size=${size}
              width="lg"></sl-paginator>
          </section>
        `
      )}
    `;
  }
};
//# sourceMappingURL=paginator.stories.js.map
