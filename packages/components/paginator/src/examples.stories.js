import '@sl-design-system/card/register.js';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { LitElement, css, html } from 'lit';
import '../register.js';
export default {
  title: 'Navigation/Paginator'
};
export const Connected = {
  render: () => {
    const onPageChange = event => {
      document.querySelector('sl-paginator-status').page = event.detail;
    };
    const onPageSizeChange = ({ detail: pageSize }) => {
      document.querySelector('sl-paginator').page = 0;
      document.querySelector('sl-paginator').pageSize = pageSize;
      document.querySelector('sl-paginator-status').pageSize = pageSize;
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
        <sl-paginator
          @sl-page-change=${onPageChange}
          page-size="10"
          total-items="200"></sl-paginator>
        <sl-paginator-page-size
          @sl-page-size-change=${onPageSizeChange}
          page-size="10"
          page-sizes="[5,10,15]"></sl-paginator-page-size>
      </section>
    `;
  }
};
export const DataSource = {
  render: () => {
    try {
      customElements.define(
        'paginated-cards-example',
        class extends LitElement {
          constructor() {
            super(...arguments);
            this.dataSource = new ArrayListDataSource(
              Array.from({ length: 80 }, (_, index) => ({
                nr: index + 1,
                title: `Title of card number ${index + 1}`
              })),
              { pagination: true }
            );
            /**
             * We need to trigger an update on this component, so it will re-render the cards when
             * the data source is updated.
             */
            this.onUpdate = () => this.requestUpdate();
          }
          static {
            this.styles = css`
              :host {
                display: flex;
                flex-direction: column;
                gap: 1rem;
              }
              .pagination {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
              }
              .cards-container {
                display: flex;
                flex-direction: column;
                gap: 2rem;
              }
              sl-paginator {
                justify-content: center;
              }
            `;
          }
          connectedCallback() {
            super.connectedCallback();
            this.dataSource.setPage(2);
            this.dataSource.setPageSize(5);
            this.dataSource.update();
            this.dataSource.addEventListener('sl-update', this.onUpdate);
          }
          disconnectedCallback() {
            this.dataSource.removeEventListener('sl-update', this.onUpdate);
            super.disconnectedCallback();
          }
          render() {
            return html`
              <div class="pagination">
                <sl-paginator-status .dataSource=${this.dataSource}></sl-paginator-status>
                <sl-paginator-page-size
                  .dataSource=${this.dataSource}
                  page-sizes="[5,10,15,20]"></sl-paginator-page-size>
              </div>
              <div class="cards-container">
                ${this.dataSource?.items.map(
                  item => html`
                    <sl-card responsive padding>
                      <h2>Card ${item.data.nr}</h2>
                      <div slot="body">${item.data.title}</div>
                    </sl-card>
                  `
                )}
              </div>
              <sl-paginator .dataSource=${this.dataSource}></sl-paginator>
            `;
          }
        }
      );
    } catch {}
    return html`<paginated-cards-example></paginated-cards-example>`;
  }
};
//# sourceMappingURL=examples.stories.js.map
