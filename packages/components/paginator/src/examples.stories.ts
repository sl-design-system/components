import { ArrayDataSource } from '@sl-design-system/data-source';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { LitElement, type PropertyValues, type TemplateResult, css, html } from 'lit';
import '../register.js';

type Story = StoryObj;

export default {
  title: 'Navigation/Paginator',
  tags: ['draft']
} satisfies Meta;

export const Connected: Story = {
  render: () => {
    const onPageChange = (event: SlChangeEvent<number>): void => {
      document.querySelector('sl-paginator-status')!.page = event.detail;
    };

    const onPageSizeChange = ({ detail: pageSize }: SlChangeEvent<number>): void => {
      document.querySelector('sl-paginator')!.pageSize = pageSize;
      document.querySelector('sl-paginator-status')!.pageSize = pageSize;
    };

    return html`
      <style>
        section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        sl-paginator {
          flex: 1;
          justify-content: center;
        }
      </style>
      <section>
        <sl-paginator-status total-items="200" page-size="10"></sl-paginator-status>
        <sl-paginator @sl-page-change=${onPageChange} page-size="10" total-items="200"></sl-paginator>
        <sl-paginator-page-size
          @sl-page-size-change=${onPageSizeChange}
          page-size="10"
          page-sizes="[5,10,15]"
        ></sl-paginator-page-size>
      </section>
    `;
  }
};

export const DataSource: Story = {
  render: () => {
    return html`asdfasdf`;
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
