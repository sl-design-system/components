import '@sl-design-system/button/register.js';
import '@sl-design-system/card/register.js';
import { ArrayDataSource } from '@sl-design-system/data-source';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/paginator/register.js';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { LitElement, type PropertyValues, type TemplateResult, css, html } from 'lit';
import '../register.js';
import { type PaginatorSize } from './paginator-size';
import { PaginatorStatus } from './paginator-status';
import { type Paginator, VisiblePagesSize } from './paginator.js';

type Props = Pick<Paginator, 'page' | 'pageSize' | 'pageSizes' | 'totalItems' | 'size'> & {
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
    totalItems: 100,
    pageSize: 10,
    pageSizes: [5, 10, 15],
    page: 2,
    size: 'lg'
  },
  argTypes: {
    size: {
      control: 'radio',
      options: sizes
    }
  },
  render: ({ page, pageSize, pageSizes, totalItems, size }) => {
    return html`
      <sl-paginator
        .totalItems=${totalItems}
        .pageSizes=${pageSizes}
        .page=${page}
        .pageSize=${pageSize}
        .size=${size}
      ></sl-paginator>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Overflow: Story = {
  args: {
    totalItems: 900
  }
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone5'
    }
  },
  args: {
    page: 5
  },
  render: ({ page, pageSize, pageSizes, totalItems }) => {
    return html`
      <sl-paginator
        .totalItems=${totalItems}
        .pageSizes=${pageSizes}
        .page=${page}
        .pageSize=${pageSize}
      ></sl-paginator>
    `;
  }
};

export const WithEvents: Story = {
  args: {
    totalItems: 200
  },
  render: ({ page, pageSize, pageSizes, size, totalItems }) => {
    setTimeout(() => {
      const paginator = document.querySelector('sl-paginator') as Paginator,
        pageSize = document.querySelector('sl-paginator-size') as PaginatorSize,
        visibleItems = document.querySelector('sl-paginator-status') as PaginatorStatus;

      paginator?.addEventListener('sl-page-change', (event: SlChangeEvent) => {
        visibleItems.page = event.detail as number;
      });

      pageSize?.addEventListener('sl-page-size-change', (event: SlChangeEvent) => {
        const detail = event.detail as number;
        paginator.pageSize = detail;
        visibleItems.pageSize = detail;
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
        <sl-paginator-status .totalItems=${totalItems} .page=${page} .pageSize=${pageSize}></sl-paginator-status>
        <sl-paginator
          .totalItems=${totalItems}
          .pageSizes=${pageSizes}
          .page=${page}
          .pageSize=${pageSize}
          .size=${size}
        ></sl-paginator>
        <sl-paginator-size .pageSizes=${pageSizes} .pageSize=${pageSize}></sl-paginator-size>
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

          totalItems: number = 1;

          override connectedCallback(): void {
            super.connectedCallback();

            this.dataSource = new ArrayDataSource(this.items);

            this.totalItems = this.dataSource?.items.length;

            requestAnimationFrame(() => {
              this.dataSource.paginate(2, 5, this.totalItems);
              this.dataSource.update();
            });
          }

          override firstUpdated(changes: PropertyValues<this>): void {
            super.firstUpdated(changes);

            requestAnimationFrame(() => {
              this.dataSource.paginate(2, 5, this.totalItems);
              this.dataSource.update();
            });
          }

          override willUpdate(changes: PropertyValues<this>): void {
            super.willUpdate(changes);

            this.dataSource.addEventListener('sl-update', this.#onUpdate);
          }

          override disconnectedCallback(): void {
            this.dataSource.removeEventListener('sl-update', this.#onUpdate);

            super.disconnectedCallback();
          }

          override render(): TemplateResult {
            console.log('datasource in example', this.dataSource);
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
    totalItems: 200
  },
  render: ({ page, pageSize, pageSizes, totalItems }) => {
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
              .totalItems=${totalItems}
              .pageSizes=${pageSizes}
              .page=${page}
              .pageSize=${pageSize}
              .size=${size}
            ></sl-paginator>
          `
        )}
      </div>
    `;
  }
};
