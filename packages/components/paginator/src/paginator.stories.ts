import '@sl-design-system/button/register.js';
import '@sl-design-system/card/register.js';
import { ArrayDataSource } from '@sl-design-system/data-source';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { LitElement, type PropertyValues, type TemplateResult, css, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { PaginatorStatus } from './paginator-status.js';
import { type Paginator, PaginatorSize } from './paginator.js';

type Props = Pick<Paginator, 'page' | 'pageSize' | 'size' | 'totalItems'> & {
  actions?(): string | TemplateResult;
  content?(): string | TemplateResult;
};
type Story = StoryObj<Props>;

const sizes: PaginatorSize[] = ['xs', 'sm', 'md', 'lg'];

export default {
  title: 'Navigation/Paginator',
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
      options: sizes
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

export const Overflow: Story = {
  args: {
    totalItems: 900
  }
};

export const WithEvents: Story = {
  args: {
    totalItems: 200
  },
  render: ({ page, pageSize, size, totalItems }) => {
    setTimeout(() => {
      const paginator = document.querySelector('sl-paginator') as Paginator,
        pageSize = document.querySelector('sl-paginator-page-size'),
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
        <sl-paginator .page=${page} .pageSize=${pageSize} .totalItems=${totalItems} .size=${size}></sl-paginator>
        <sl-paginator-size .pageSizes=${[5, 10, 15]} .pageSize=${pageSize}></sl-paginator-size>
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
            return html`
              <div class="pagination">
                <sl-paginator-status .dataSource=${this.dataSource}></sl-paginator-status>
                <sl-paginator-page-size
                  .dataSource=${this.dataSource}
                  .pageSizes=${this.pageSizes}
                ></sl-paginator-page-size>
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
  render: ({ page, pageSize, totalItems }) => {
    const onPageChange = (event: SlChangeEvent<number>): void => {
      document.querySelectorAll('sl-paginator').forEach(paginator => {
        if (paginator === event.target) return;

        paginator.page = event.detail;
      });
    };

    return html`
      <style>
        div {
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
      <div>
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
      </div>
    `;
  }
};
