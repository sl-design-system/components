import '@sl-design-system/button/register.js';
import '@sl-design-system/card/register.js';
import { ArrayDataSource } from '@sl-design-system/data-source';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/paginator/register.js';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { LitElement, type TemplateResult, css, html } from 'lit';
import '../register.js';
import { type PaginatorSize } from './paginator-size';
import { PaginatorStatus } from './paginator-status';
import { type Paginator, VisiblePagesSize } from './paginator.js';

type Props = Pick<Paginator, 'activePage' | 'itemsPerPage' | 'pageSizes' | 'total' | 'size'> & {
  actions?(): string | TemplateResult;
  content?(): string | TemplateResult;
};
type Story = StoryObj<Props>;

const sizes: VisiblePagesSize[] = ['xs', 'sm', 'md', 'lg'];

export default {
  title: 'Navigation/Paginator',
  tags: ['draft'],
  parameters: {
    viewport: {
      defaultViewport: 'reset'
    }
  },
  args: {
    total: 100,
    itemsPerPage: 10,
    pageSizes: [5, 10, 15],
    activePage: 2,
    size: 'lg'
  },
  argTypes: {
    size: {
      control: 'radio',
      options: sizes
    }
  },
  render: ({ activePage, itemsPerPage, pageSizes, total, size }) => {
    return html`
      <sl-paginator
        .total=${total}
        .pageSizes=${pageSizes}
        .activePage=${activePage}
        .itemsPerPage=${itemsPerPage}
        .size=${size}
      ></sl-paginator>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Overflow: Story = {
  args: {
    total: 900
  }
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone5'
    }
  },
  args: {
    activePage: 5
  },
  render: ({ activePage, itemsPerPage, pageSizes, total }) => {
    return html`
      <sl-paginator
        .total=${total}
        .pageSizes=${pageSizes}
        .activePage=${activePage}
        .itemsPerPage=${itemsPerPage}
      ></sl-paginator>
    `;
  }
};

export const PageSizeComponent: Story = {
  render: ({ pageSizes, itemsPerPage }) => {
    return html`<sl-paginator-size .pageSizes=${pageSizes} .itemsPerPage=${itemsPerPage}></sl-paginator-size>`;
  }
};

export const ItemsCounterComponent: Story = {
  render: ({ activePage, itemsPerPage, total }) => html`
    <sl-paginator-status .total=${total} .activePage=${activePage} .itemsPerPage=${itemsPerPage}></sl-paginator-status>
  `
};

export const WithEvents: Story = {
  args: {
    total: 200
  },
  render: ({ activePage, itemsPerPage, pageSizes, size, total }) => {
    setTimeout(() => {
      const paginator = document.querySelector('sl-paginator') as Paginator,
        pageSize = document.querySelector('sl-paginator-size') as PaginatorSize,
        visibleItems = document.querySelector('sl-paginator-status') as PaginatorStatus;

      paginator?.addEventListener('sl-page-change', (event: SlChangeEvent) => {
        visibleItems.activePage = event.detail as number;
      });

      pageSize?.addEventListener('sl-page-size-change', (event: SlChangeEvent) => {
        const detail = event.detail as number;
        paginator.itemsPerPage = detail;
        visibleItems.itemsPerPage = detail;
      });
    });
    return html`
      <style>
        .pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        sl-paginator {
          flex: 1;
        }

        sl-paginator-size {
          justify-content: end;
        }
      </style>
      <div class="pagination">
        <sl-paginator-status
          .total=${total}
          .activePage=${activePage}
          .itemsPerPage=${itemsPerPage}
        ></sl-paginator-status>
        <sl-paginator
          .total=${total}
          .pageSizes=${pageSizes}
          .activePage=${activePage}
          .itemsPerPage=${itemsPerPage}
          .size=${size}
        ></sl-paginator>
        <sl-paginator-size .pageSizes=${pageSizes} .itemsPerPage=${itemsPerPage}></sl-paginator-size>
      </div>
    `;
  }
};

export const WithDataSource: Story = {
  render: () => {
    try {
      customElements.define(
        'paginated-cards-example',
        class extends LitElement {
          static override styles = css`
          <style>
          :host {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }

            .cards-container {
              display: flex;
              flex-direction: column;
              gap: 2rem;
            }

            .pagination {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
              margin-block-end: 1rem;
            }

            sl-paginator {
              margin-block: 2rem;
            }

            sl-paginator-size {
              justify-content: end;
            }
          </style>
          `;

          items = Array.from({ length: 80 }, (_, index) => ({
            nr: index + 1,
            title: `Title of card number ${index + 1}`
          }));

          pageSizes = [5, 10, 15, 20];

          dataSource = new ArrayDataSource(this.items);

          total: number = 1;

          override connectedCallback(): void {
            super.connectedCallback();

            this.dataSource = new ArrayDataSource(this.items);

            requestAnimationFrame(() => {
              this.total = this.dataSource?.paginatedItems.length;

              this.dataSource.addEventListener('sl-update', this.#onUpdate);

              this.dataSource.paginate(2, 5, this.total);
              this.dataSource.update();
            });
          }

          override disconnectedCallback(): void {
            this.dataSource.removeEventListener('sl-update', this.#onUpdate);

            super.disconnectedCallback();
          }

          override render(): TemplateResult {
            return html`
              <div class="pagination">
                <sl-paginator-status .dataSource=${this.dataSource}></sl-paginator-status>
                <sl-paginator-size .pageSizes=${this.pageSizes} .dataSource=${this.dataSource}></sl-paginator-size>
              </div>
              <div class="cards-container">
                ${this.dataSource?.items.map(
                  item => html`
                    <sl-card responsive padding>
                      <h2>Card ${item.nr}</h2>
                    </sl-card>
                  `
                )}
              </div>
              <sl-paginator .dataSource=${this.dataSource} .pageSizes=${this.pageSizes}></sl-paginator>
            `;
          }

          #onUpdate = () => {
            this.requestUpdate();
          };
        }
      );
    } catch {
      /* empty */
    }

    return html`<paginated-cards-example></paginated-cards-example>`;
  }
};

export const All: Story = {
  args: {
    total: 200
  },
  render: ({ activePage, itemsPerPage, pageSizes, total }) => {
    return html`
      <style>
        .pagination {
          display: block;
          text-align: center;
        }

        sl-paginator-size {
          justify-content: end;
        }
      </style>
      <div class="pagination">
        ${sizes.map(
          size => html`
            <h3>Size: ${size}</h3>
            <sl-paginator
              .total=${total}
              .pageSizes=${pageSizes}
              .activePage=${activePage}
              .itemsPerPage=${itemsPerPage}
              .size=${size}
            ></sl-paginator>
          `
        )}
      </div>
    `;
  }
};
