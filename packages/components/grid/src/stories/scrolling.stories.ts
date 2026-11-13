import { Avatar } from '@sl-design-system/avatar';
import { type Student, getStudents } from '@sl-design-system/example-data';
import { type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '.././register.js';
import { avatarRenderer, pupils } from './story-utils.js';

type Story = StoryObj;

export default {
  title: 'Grid/Scrolling',
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  },
  loaders: [async () => ({ students: (await getStudents()).students })]
};

export const Vertical: Story = {
  render: (_, { loaded: { students } }) => html`
    <p>
      This example shows how vertical scrolling works with a large grid. Here there is no
      <code>overflow</code> on the grid itself, so you have to vertically scroll the page. By
      default, the header is sticky, so it will always be visible when scrolling. This is the
      default behavior, you don't have to set anything for this.
    </p>
    <sl-grid .items=${students}>
      <sl-grid-column grow="0" header="Nr." path="studentNumber"></sl-grid-column>
      <sl-grid-column
        grow="3"
        header="Student"
        path="fullName"
        .renderer=${avatarRenderer}
        .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
    </sl-grid>
  `
};

export const VerticalOverflow: Story = {
  render: (_, { loaded: { students } }) => html`
    <p>
      This example shows that by setting a <code>block-size</code> and <code>overflow</code> on the
      <code>sl-grid</code> element, you can create a scrollable container for the grid items. The
      header is still sticky, so it will always be visible at the top of the scroll container. This
      example also shows how you can have a border around the scroll container. You have to set this
      yourself. The <code>sl-grid</code> element does not have a border by default, so you have to
      use the <code>no-border</code> attribute and add a border yourself.
    </p>
    <style>
      sl-grid {
        block-size: 320px;
        border: var(--sl-size-borderWidth-default) solid var(--sl-color-border-plain);
        border-radius: var(--sl-size-borderRadius-default);
        overflow-y: auto;
      }
    </style>
    <sl-grid .items=${students} no-border>
      <sl-grid-column grow="0" header="Nr." path="studentNumber"></sl-grid-column>
      <sl-grid-column
        grow="3"
        header="Student"
        path="fullName"
        .renderer=${avatarRenderer}
        .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
    </sl-grid>
  `
};

export const Both: Story = {
  render: (_, { loaded: { students } }) => {
    const columns = [
      'email',
      'group.name',
      'school.name',
      'school.address',
      'school.city',
      'school.country'
    ];

    const onAdd = () => {
      const count = document.querySelectorAll('sl-grid-column').length,
        column = document.createElement('sl-grid-column');

      column.path = columns[count - 1];
      document.querySelector('sl-grid')?.appendChild(column);
    };

    const onRemove = () => document.querySelector('sl-grid-column:last-of-type')?.remove();

    return html`
      <style>
        html {
          display: block;
        }
        body {
          padding-block-start: 0 !important;
        }
        p:first-of-type {
          margin-block-start: 0;
          padding-block-start: 1rem;
        }
        .cover {
          background: var(--sl-elevation-surface-base-default);
          block-size: 1rem;
          position: sticky;
          inset-block-start: 0;
          z-index: 3;
        }
        sl-grid::part(thead) {
          inset-block-start: 1rem;
        }
      </style>
      <p>
        This example shows how you can have a large grid where you can both scroll horizontally as
        well as vertically. Here there is no <code>overflow</code> on the grid itself, but when grid
        detects that the rows are wider than the grid itself, it will enable horizontal scrolling.
        Vertical scrolling is done via the page itself. Since you generally don't want to
        horizontally scroll the page but only the contents of the grid, horizontal scrolling is
        handled by the grid itself. It also will use the custom <code>sl-scrollbar</code> component
        for horizontal scrolling. That ensures that the horizontal scrollbar is always visible and
        not just when you've scrolled to the bottom of the page.
      </p>
      <p>
        This example also shows how you can make the grid header sticky at an offset from the top of
        the viewport. When you do this, you have to add a "cover" element to make sure that the rows
        are not visible when they've scrolled past the header.
      </p>
      <p>
        You can add and remove columns to show that the grid automatically adjusts the position of
        the custom scrollbar.
      </p>
      <sl-button-bar>
        <sl-button @click=${onAdd}>Add column</sl-button>
        <sl-button @click=${onRemove}>Remove column</sl-button>
      </sl-button-bar>
      <div class="cover"></div>
      <sl-grid .items=${students}>
        <sl-grid-column
          header="Student"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
        ${columns.map(c => html`<sl-grid-column path=${c}></sl-grid-column>`)}
      </sl-grid>
    `;
  }
};

export const BothSticky: Story = {
  render: (_, { loaded: { students } }) => html`
    <style>
      html {
        display: block;
      }
      body {
        padding-block-start: 0 !important;
      }
      p:first-of-type {
        margin-block-start: 0;
        padding-block-start: 1rem;
      }
      .cover {
        background: var(--sl-elevation-surface-base-default);
        block-size: 1rem;
        position: sticky;
        inset-block-start: 0;
        z-index: 3;
      }
      sl-grid::part(thead) {
        inset-block-start: 1rem;
      }
    </style>
    <p>
      This example shows a large grid where you can both scroll horizontally as well as vertically.
      It also has both a sticky header as well as sticky columns, and activates rows when you click
      them. You can make a column sticky by adding the <code>sticky</code> attribute. Note that this
      only works for columns at the start or end of the grid. You cannot have sticky columns in the
      middle of the grid.
    </p>
    <div class="cover"></div>
    <sl-grid .items=${students} row-action="activate">
      <sl-grid-selection-column sticky></sl-grid-selection-column>
      <sl-grid-column grow="0" header="Nr." path="studentNumber" sticky></sl-grid-column>
      <sl-grid-column path="group.name" sticky></sl-grid-column>
      <sl-grid-column
        grow="3"
        header="Student"
        path="fullName"
        .renderer=${avatarRenderer}
        .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
      <sl-grid-column path="school.name"></sl-grid-column>
      <sl-grid-column path="school.address"></sl-grid-column>
      <sl-grid-column path="school.city"></sl-grid-column>
      <sl-grid-column path="school.country" sticky></sl-grid-column>
    </sl-grid>
  `
};

export const BothStickySummaryRow: Story = {
  render: (_, { loaded: { students } }) => {
    // The example students have no numeric or boolean values, so add some deterministic ones
    const rows = (students as Student[]).map((student, index) => ({
      ...student,
      absences: (index * 3) % 7,
      grade: 4 + ((index * 7) % 12) / 2,
      homework: index % 3 !== 0,
      present: index % 5 !== 0
    }));

    return html`
      <p>
        This example combines a sticky header, sticky columns and a summary row in a large grid that
        scrolls both horizontally and vertically. The summary row sticks to the bottom of the
        viewport, and its cells in the sticky columns stay in place when you scroll horizontally.
        The number columns show an average and a sum, the boolean columns a fraction.
      </p>
      <style>
        .container {
          contain: inline-size;
        }
      </style>
      <div class="container">
        <sl-grid .items=${rows} row-action="activate">
          <sl-grid-selection-column sticky></sl-grid-selection-column>
          <sl-grid-column grow="0" header="Nr." path="studentNumber" sticky></sl-grid-column>
          <sl-grid-column path="group.name" sticky></sl-grid-column>
          <sl-grid-column
            grow="3"
            header="Student"
            path="fullName"
            summary-label="students"
            summary-menu
            summary-type="text"
            .renderer=${avatarRenderer}
            .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
          <sl-grid-column
            align="end"
            header="Grade"
            path="grade"
            summary-format="average"
            summary-type="number"></sl-grid-column>
          <sl-grid-column
            align="end"
            header="Absences"
            path="absences"
            summary-type="number"></sl-grid-column>
          <sl-grid-column
            header="Homework"
            path="homework"
            summary-type="boolean"
            .renderer=${(row: { homework: boolean }) => (row.homework ? 'Yes' : 'No')}>
          </sl-grid-column>
          <sl-grid-column
            header="Present"
            path="present"
            summary-type="boolean"
            .renderer=${(row: { present: boolean }) => (row.present ? 'Yes' : 'No')}>
          </sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>
          <sl-grid-column path="school.name"></sl-grid-column>
          <sl-grid-column path="school.address"></sl-grid-column>
          <sl-grid-column path="school.city"></sl-grid-column>
          <sl-grid-column path="school.country" sticky summary-type="text"></sl-grid-column>
        </sl-grid>
      </div>
    `;
  }
};

export const Horizontal: Story = {
  render: (_, { loaded: { students } }) => html`
    <p>
      This example shows how horizontal scrolling works with a large grid. There are only a few
      rows, so there is no need to vertically scroll. The grid will automatically detect that the
      rows are wider than the grid itself and will enable horizontal scrolling. There is nothing you
      need to do for this.
    </p>
    <style>
      html {
        display: block;
      }
    </style>
    <sl-grid .items=${(students as Student[]).slice(0, 5)}>
      <sl-grid-column grow="0" header="Nr." path="studentNumber"></sl-grid-column>
      <sl-grid-column
        grow="3"
        header="Student"
        path="fullName"
        .renderer=${avatarRenderer}
        .scopedElements=${{ 'sl-avatar': Avatar }}></sl-grid-column>
      <sl-grid-column path="email"></sl-grid-column>
      <sl-grid-column path="group.name"></sl-grid-column>
      <sl-grid-column path="school.name"></sl-grid-column>
      <sl-grid-column path="school.address"></sl-grid-column>
      <sl-grid-column path="school.city"></sl-grid-column>
      <sl-grid-column path="school.country"></sl-grid-column>
    </sl-grid>
  `
};

export const VerticalOverflowSummaryRow: Story = {
  render: () => html`
    <p>
      This example shows a summary row in a grid with a scrollable container. The header sticks to
      the top and the summary row sticks to the bottom of the scroll container, so the totals are
      always visible while you scroll through the rows.
    </p>
    <style>
      sl-grid {
        block-size: 320px;
        border: var(--sl-size-borderWidth-default) solid var(--sl-color-border-plain);
        border-radius: var(--sl-size-borderRadius-default);
        overflow-y: auto;
      }
    </style>
    <sl-grid .items=${pupils} no-border>
      <sl-grid-column
        header="Student"
        path="name"
        summary-label="students"
        summary-type="text"></sl-grid-column>
      <sl-grid-column header="Class" path="class"></sl-grid-column>
      <sl-grid-column
        align="end"
        header="Grade"
        path="grade"
        summary-format="average"
        summary-type="number"></sl-grid-column>
    </sl-grid>
  `
};

export const VerticalOverflowSummaryRowTop: Story = {
  render: () => html`
    <p>
      This example shows a summary row at the top of a scrollable grid. It sticks below the header,
      so the totals stay visible while you scroll through the rows.
    </p>
    <style>
      sl-grid {
        block-size: 320px;
        border: var(--sl-size-borderWidth-default) solid var(--sl-color-border-plain);
        border-radius: var(--sl-size-borderRadius-default);
        overflow-y: auto;
      }
    </style>
    <sl-grid summary-position="top" .items=${pupils} no-border>
      <sl-grid-column
        header="Student"
        path="name"
        summary-label="students"
        summary-type="text"></sl-grid-column>
      <sl-grid-column header="Class" path="class"></sl-grid-column>
      <sl-grid-column
        align="end"
        header="Grade"
        path="grade"
        summary-format="average"
        summary-type="number"></sl-grid-column>
    </sl-grid>
  `
};

export const HorizontalSummaryRow: Story = {
  render: () => html`
    <p>
      This example shows a summary row in a grid that scrolls both horizontally and vertically. The
      first and last columns are sticky, and the summary cells in those columns stay in place as
      well.
    </p>
    <sl-grid .items=${pupils} style="inline-size: 480px; block-size: 320px; overflow-y: auto">
      <sl-grid-column
        grow="0"
        header="Student"
        path="name"
        sticky
        summary-label="students"
        summary-type="text"
        width="200"></sl-grid-column>
      <sl-grid-column grow="0" header="Class" path="class" width="200"></sl-grid-column>
      <sl-grid-column
        grow="0"
        header="Homework"
        path="homework"
        summary-type="boolean"
        width="200"></sl-grid-column>
      <sl-grid-column
        grow="0"
        header="Present"
        path="present"
        summary-type="boolean"
        width="200"></sl-grid-column>
      <sl-grid-column
        align="end"
        grow="0"
        header="Grade"
        path="grade"
        sticky
        summary-format="average"
        summary-type="number"
        width="120"></sl-grid-column>
    </sl-grid>
  `
};
