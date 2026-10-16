import '@sl-design-system/button/register.js';
import { ArrayListDataSource, FetchListDataSource } from '@sl-design-system/data-source';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../register.js';

type Story = StoryObj;
type Row = { name: string; description: string; kind: 'short' | 'long' };

const makeRows = (count: number, long: boolean, repetitions = 5): Row[] =>
  Array.from({ length: count }, (_, index) => ({
    name: `Row ${index + 1}`,
    description: long
      ? 'This is a long description of a profession that must remain fully visible. '.repeat(
          repetitions
        ) + 'END OF DESCRIPTION'
      : 'Short description',
    kind: long ? 'long' : 'short'
  }));

const columns = () => html`
  <sl-grid-column path="name" width="130" grow="0"></sl-grid-column>
  <sl-grid-column path="description" width="350" grow="0"></sl-grid-column>
`;

export default {
  title: 'Grid/Row heights',
  parameters: {
    chromatic: { disableSnapshot: true }
  }
} satisfies Meta;

export const Filtering: Story = {
  render: () => {
    const dataSource = new ArrayListDataSource([...makeRows(20, false), ...makeRows(2, true)]);

    return html`
      <section style="max-inline-size: 600px">
        <h2>Wrapped text after filtering</h2>
        <p>Manual regression test for #1556. Follow these steps after the initial rows appear:</p>
        <ol>
          <li>
            Show one long row: check that END OF DESCRIPTION is visible above the bottom border.
          </li>
          <li>Show two long rows: check that both descriptions are visible and the rows touch.</li>
          <li>Show no results: check that the previous rows disappear.</li>
          <li>Show one long row again, then show all rows. Repeat the sequence.</li>
        </ol>
        <p>Expected: no clipped text, overlapping rows, or extra blank space below the last row.</p>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-block: 16px">
          <sl-button
            @click=${() => {
              dataSource.addFilter('kind', row => row.kind === 'long' && row.name === 'Row 1');
              dataSource.update();
            }}
            >Show long row</sl-button
          >
          <sl-button
            @click=${() => {
              dataSource.addFilter('kind', 'kind', 'long');
              dataSource.update();
            }}
            >Show two long rows</sl-button
          >
          <sl-button
            @click=${() => {
              dataSource.addFilter('kind', () => false);
              dataSource.update();
            }}
            >Show no results</sl-button
          >
          <sl-button
            @click=${() => {
              dataSource.removeFilter('kind');
              dataSource.update();
            }}
            >Show all rows</sl-button
          >
        </div>
        <sl-grid style="inline-size: 480px" .dataSource=${dataSource} no-skip-links>
          ${columns()}
        </sl-grid>
        <p>End of grid</p>
      </section>
    `;
  }
};

export const LazyLoading: Story = {
  render: () => {
    let rows = makeRows(10, true, 2),
      firstRequest = true;
    const dataSource = new FetchListDataSource<Row>({
        pageSize: 20,
        fetchPage: async () => {
          const result = rows;
          // Delay only the initial response. Measuring skeletons between subsequent
          // datasets can overwrite the stale cache and mask the regression.
          if (firstRequest) {
            firstRequest = false;
            await new Promise(resolve => setTimeout(resolve, 700));
          }
          return { items: result, totalItems: result.length };
        }
      }),
      loadRows = (count: number, long: boolean) => {
        rows = makeRows(count, long, count === 10 ? 2 : 5);
        dataSource.update();
      };

    return html`
      <section style="max-inline-size: 600px">
        <h2>Last row after lazy loading</h2>
        <p>
          Manual regression test for #3066. Wait for the initial 10 tall rows to finish loading.
        </p>
        <ol>
          <li>Load 7 short rows: check that the bottom border is directly below row 7.</li>
          <li>Load 1 long row: check that END OF DESCRIPTION is fully visible.</li>
          <li>Load no results: check that the previous rows disappear.</li>
          <li>Load 10 tall rows to reset, then repeat the sequence.</li>
        </ol>
        <p>
          Expected: no clipped text or extra blank space inside the grid. The “End of grid” label
          should follow the grid. Data is simulated locally; no backend or console commands are
          needed.
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-block: 16px">
          <sl-button @click=${() => loadRows(10, true)}>Load 10 tall rows</sl-button>
          <sl-button @click=${() => loadRows(7, false)}>Load 7 short rows</sl-button>
          <sl-button @click=${() => loadRows(1, true)}>Load 1 long row</sl-button>
          <sl-button @click=${() => loadRows(0, false)}>Load no results</sl-button>
        </div>
        <sl-grid style="inline-size: 480px" .dataSource=${dataSource} no-skip-links>
          ${columns()}
        </sl-grid>
        <p>End of grid</p>
      </section>
    `;
  }
};
