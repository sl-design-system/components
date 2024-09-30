import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/checkbox/register.js';
import { type Person, getPeople } from '@sl-design-system/example-data';
import '@sl-design-system/filter/register.js';
import '@sl-design-system/form/register.js';
import { type SlSearchEvent } from '@sl-design-system/search-field';
import '@sl-design-system/search-field/register.js';
import { ArrayDataSource } from '@sl-design-system/shared';
import '@sl-design-system/tabs/register.js';
import { type StoryObj } from '@storybook/web-components';
import { type CSSResultGroup, LitElement, type TemplateResult, css, html } from 'lit';
import { state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

type Story = StoryObj;

export default {
  title: 'Grid/Examples',
  loaders: [async () => ({ people: (await getPeople()).people })]
};

export const ColumnReordering: Story = {
  render: (_, { loaded: { people } }) => {
    class ColumnReorderingExample extends LitElement {
      @state()
      columns = [
        { path: 'firstName' },
        { path: 'lastName' },
        { path: 'profession', type: 'filter' },
        { path: 'status', type: 'filter' },
        { path: 'membership', type: 'filter' }
      ];

      override render(): TemplateResult {
        return html`
          <sl-button-bar style="margin-block-end: 1rem">
            <sl-button @click=${this.onClick}>Reorder columns</sl-button>
          </sl-button-bar>
          <sl-grid .items=${people}>
            ${repeat(
              this.columns,
              column => column.path,
              column => {
                if (column.type === 'filter') {
                  return html`<sl-grid-filter-column .path=${column.path}></sl-grid-filter-column>`;
                } else {
                  return html`<sl-grid-column .path=${column.path}></sl-grid-column>`;
                }
              }
            )}
          </sl-grid>
        `;
      }

      onClick(): void {
        this.columns = [...this.columns.sort(() => Math.random() - 0.5)];
      }
    }

    try {
      customElements.define('column-reordering-example', ColumnReorderingExample);
    } catch {
      /* empty */
    }

    return html`<column-reordering-example></column-reordering-example>`;
  }
};

export const Filtering: Story = {
  parameters: {
    layout: 'fullscreen'
  },
  render: (_, { loaded: { people } }) => {
    class FilteringExample extends LitElement {
      static override styles: CSSResultGroup = css`
        :host {
          display: grid;
          grid-template-areas:
            'page-header page-header'
            'tabs tabs'
            'header sidebar'
            'main sidebar';
          grid-template-columns: auto 200px;
          grid-template-rows: auto auto auto 1fr;
          padding: 1rem 1rem 0 1rem;
        }

        h1 {
          grid-area: page-header;
          margin-block: 0 1rem;
        }

        sl-tab-group {
          grid-area: tabs;
        }

        .header {
          background: white;
          grid-area: header;
          align-items: center;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          padding-block: 1rem;
          position: sticky;
          inset-block-start: 0;
          z-index: 1;
        }

        sl-grid {
          grid-area: main;
          min-inline-size: 0;

          &::part(table) {
            anchor-name: --grid-anchor;
            margin-block-end: 1rem;
          }

          &::part(thead) {
            position: sticky;
            inset-block-start: 4rem;
          }
        }

        sl-button-bar {
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          box-shadow: 0 0 1rem rgba(0, 0, 0, 0.3);
          inset-block-start: calc(anchor(bottom) + 1rem);
          justify-self: anchor-center;
          padding: 0.5rem 1rem;
          position: fixed;
          position-anchor: --grid-anchor;
          position-try: --viewport-block-end;
        }

        @position-try --viewport-block-end {
          position-anchor: initial;
          inset-block-start: auto;
          inset-block-end: 1rem;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          grid-area: sidebar;
          margin-block-start: 1rem;
          max-block-size: calc(100vh - 2rem);
          position: sticky;
          inset-block-start: 1rem;

          h2 {
            line-height: 2rem;
            margin: 0 1rem;
          }

          .wrapper {
            block-size: 100%;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding-inline: 1rem;
            overflow: auto;
            scrollbar-color: #ccc transparent;
            scrollbar-width: thin;
          }
        }
      `;

      @state() dataSource = new ArrayDataSource(people as Person[]);

      override render(): TemplateResult {
        return html`
          <h1>Page header</h1>
          <sl-tab-group>
            <sl-tab selected>Overview</sl-tab>
            <sl-tab>Other tab 1</sl-tab>
            <sl-tab>Other tab 2</sl-tab>
          </sl-tab-group>
          <div class="header">
            <sl-filter-status .dataSource=${this.dataSource}></sl-filter-status>
            <sl-search-field
              @sl-clear=${this.#onClear}
              @sl-change=${this.#onSearch}
              placeholder="Find a person"
            ></sl-search-field>
          </div>

          <sl-grid .dataSource=${this.dataSource}>
            <sl-grid-selection-column></sl-grid-selection-column>
            <sl-grid-column path="firstName"></sl-grid-column>
            <sl-grid-column path="lastName"></sl-grid-column>
            <sl-grid-column path="email"></sl-grid-column>
            <sl-grid-column path="address.phone"></sl-grid-column>
            <sl-grid-column path="profession"></sl-grid-column>
            <sl-grid-column path="membership"></sl-grid-column>
          </sl-grid>

          <sl-button-bar>
            <sl-button>Action 1</sl-button>
            <sl-button>Action 2</sl-button>
            <sl-button>Action 3</sl-button>
          </sl-button-bar>

          <div class="sidebar">
            <h2>Filters</h2>

            <div class="wrapper">
              <sl-filter-group
                .dataSource=${this.dataSource}
                label="Profession"
                .options=${Array.from(new Set((people as Person[]).map(person => person.profession))).sort()}
                path="profession"
              ></sl-filter-group>

              <sl-filter-group
                .dataSource=${this.dataSource}
                label="Profession 2"
                .options=${Array.from(new Set((people as Person[]).map(person => person.profession))).sort()}
                path="profession"
              ></sl-filter-group>

              <sl-filter-group
                .dataSource=${this.dataSource}
                label="Membership"
                .options=${['Regular', 'Premium', 'VIP']}
                path="membership"
              ></sl-filter-group>
            </div>
          </div>
        `;
      }

      #onClear(): void {
        this.dataSource.removeFilter('search');
        this.dataSource.update();
      }

      #onSearch(event: SlSearchEvent): void {
        const value = event.detail.trim() ?? '';

        this.dataSource.removeFilter('search');

        if (value) {
          const regex = new RegExp(value, 'i');

          this.dataSource.addFilter('search', ({ firstName, lastName }) => {
            return regex.test(firstName) || regex.test(lastName);
          });
        }

        this.dataSource.update();
      }
    }

    try {
      customElements.define('filtering-example', FilteringExample);
    } catch {
      // empty
    }

    return html`<filtering-example></filtering-example>`;
  }
};
