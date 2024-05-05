import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/breadcrumbs/register.js';
import '@sl-design-system/button/register.js';
import { Icon } from '@sl-design-system/icon';
import { type Person, getPeople } from '@sl-design-system/example-data';
import '@sl-design-system/grid/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/text-field/register.js';
import '@sl-design-system/tree/register.js';
import { FlatTreeModel } from '@sl-design-system/tree';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';

type Story = StoryObj;

Icon.register(faPlus);

export default {
  title: 'Experiments/Grades',
  parameters: {
    layout: 'fullscreen'
  }
}

export const Default: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const courses = [
      { id: 1, name: 'Group 1', level: 0 },
      { id: 3, name: 'Mathematics', level: 1 },
      { id: 4, name: 'Science', level: 1 },
      { id: 5, name: 'History', level: 1 },
      { id: 2, name: 'Group 2', level: 0 },
      { id: 6, name: 'Algebra', level: 1 },
      { id: 7, name: 'Geometry', level: 1 },
      { id: 8, name: 'Physics', level: 1 },
      { id: 9, name: 'Chemistry', level: 1 },
      { id: 10, name: 'World History', level: 1 },
      { id: 11, name: 'Group 3A', level: 0 },
      { id: 12, name: 'Group 3B', level: 0 },
      { id: 13, name: 'Group 3C', level: 0 },
      { id: 14, name: 'Group 4A', level: 0 },
      { id: 15, name: 'Group 4B', level: 0 },
      { id: 16, name: 'Group 4C', level: 0 },
      { id: 17, name: 'Group 5A', level: 0 },
      { id: 18, name: 'Group 5B', level: 0 },
      { id: 19, name: 'Group 5C', level: 0 },
      { id: 20, name: 'Group 6', level: 0 },
      { id: 21, name: 'Group 7', level: 0 },
      { id: 22, name: 'Group 8', level: 0 },
      { id: 23, name: 'Group 9', level: 0 },
      { id: 24, name: 'Group 10', level: 0 },
      { id: 25, name: 'Group 11', level: 0 },
      { id: 26, name: 'Group 12', level: 0 },
      { id: 27, name: 'Group 13', level: 0 },
      { id: 28, name: 'Group 14', level: 0 },
      { id: 29, name: 'Group 15', level: 0 },
      { id: 30, name: 'Group 16', level: 0 },
      { id: 31, name: 'Group 17', level: 0 },
      { id: 32, name: 'Group 18', level: 0 },
    ];

    const model = new FlatTreeModel(courses, ({ name }) => name, ({ level }) => level, ({ level }) => level === 0, { trackBy: course => course.id });

    return html`
      <style>
        #root-inner {
          display: grid;
          grid-template-areas: 'breadcrumbs breadcrumbs'
          'heading heading'
          'nav nav'
          'filter grades';
          block-size: 100dvh;
        }

        h1, h2, h3 {
          margin: 0;
        }

        sl-breadcrumbs {
          grid-area: breadcrumbs;
          padding: 1rem 1rem 0rem 1rem;
        }

        h1 {
          background: #fff;
          border-block-end: 1px solid var(--sl-color-palette-neutral-100);
          font: var(--sl-text-dialog-heading);
          grid-area: heading;
          padding: 0 1rem 0.25rem 1rem;
          position: sticky;
          inset-block-start: 0;
          z-index: 1;
        }

        nav {
          background: #fff;
          border-bottom: 1px solid var(--sl-color-palette-neutral-100);
          display: flex;
          gap: 1rem;
          grid-area: nav;
          inset-block-start: 39px;
          padding: 0.5rem 1rem;
          position: sticky;
          z-index: 1;
        }

        section {
          display: flex;
          flex-direction: column;
          padding: 0.5rem 1rem;
        }

        p {
          margin: 0;
        }

        .filter {
          block-size: calc(100dvh - 136px);
          border-right: 1px solid var(--sl-color-palette-neutral-100);
          grid-area: filter;
          inset-block-start: 96px;
          overflow: auto;
          position: sticky;

          p {
            margin-bottom: 0.5rem;
          }

          sl-text-field {
            flex-shrink: 0;
            inset-block-start: 4px;
            position: sticky;
            z-index: 1;
          }

          sl-tree {
            margin-block-start: 0.5rem;
          }
        }

        .grades {
          grid-area: grades;

          header {
            align-items: center;
            display: flex;
            gap: 1rem;
            inline-size: 100%;
            margin-block-end: 0.5rem;

            .heading {
              margin-inline-end: auto;
            }
          }
        }
      </style>
      <sl-breadcrumbs>
        <a href="javascript:void(0)">Grades</a>
        <a href="javascript:void(0)">Administration</a>
      </sl-breadcrumbs>
      <h1>Grade columns</h1>
      <nav>
        <sl-select>
          <sl-select-option>2023 - 2024</sl-select-option>
        </sl-select>

        <sl-select>
          <sl-select-option>All locations</sl-select-option>
        </sl-select>

        <sl-switch checked reverse>Show organisation layout</sl-switch>
      </nav>
      <section class="filter">
        <h3>Studies</h3>
        <p>9 studies for all locations</p>
        <sl-text-field placeholder="Filter by study or course"></sl-text-field>
        <sl-tree .model=${model}></sl-tree>
      </section>

      <section class="grades">
        <header>
          <div class="heading">
            <h2>Dutch</h2>
            <p>HAVO 3</p>
          </div>
          <sl-switch reverse>Show only PTA exams</sl-switch>
          <sl-button variant="primary">
            <sl-icon name="far-plus"></sl-icon>
            New grade column
          </sl-button>
        </header>
        <sl-grid .items=${people}>
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>
          <sl-grid-column path="address.phone"></sl-grid-column>
          <sl-grid-column path="profession"></sl-grid-column>
        </sl-grid>
      </section>
    `;
  }
};
