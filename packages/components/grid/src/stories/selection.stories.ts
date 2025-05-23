import { faCopy, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { Avatar } from '@sl-design-system/avatar';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { ArrayListDataSource } from '@sl-design-system/data-source';
import { type Person, getPeople, getStudents } from '@sl-design-system/example-data';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import { type SelectionController } from '@sl-design-system/shared';
import { type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../register.js';
import { type SlActiveItemChangeEvent } from '../grid.js';
import { avatarRenderer } from './story-utils.js';

type Story = StoryObj;

export default {
  title: 'Grid/Selection',
  tags: ['draft'],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  }
};

Icon.register(faCopy, faTrash);

export const Single: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const onActiveItemChange = ({ detail: { item } }: SlActiveItemChangeEvent<Person>): void => {
      console.log('current active item:', item);
    };

    return html`
      <sl-grid @sl-active-item-change=${onActiveItemChange} .items=${people} clickable-row>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="profession"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Multiple: Story = {
  args: {
    selectAll: false
  },
  loaders: [async () => ({ students: (await getStudents()).students })],
  render: ({ selectAll }, { loaded: { students } }) => {
    const onSelectionChange = ({ detail: { selected, size } }: CustomEvent<SelectionController>): void => {
      const p = document.querySelector<HTMLParagraphElement>('.selection')!;

      if (selected) {
        p.innerText = `${selected} of ${size} selected`;
      } else {
        p.innerText = 'No selection';
      }
    };

    return html`
      <p class="selection" style="margin-block: 0 1rem">
        This is updated outside the component by listening to the <code>sl-selection-change</code> event.
      </p>
      <sl-grid @sl-selection-change=${onSelectionChange} .items=${students}>
        <sl-grid-selection-column .selectAll=${selectAll}></sl-grid-selection-column>
        <sl-grid-column
          header="Student"
          path="fullName"
          .renderer=${avatarRenderer}
          .scopedElements=${{ 'sl-avatar': Avatar }}
        ></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>

        <!-- These get slotted into the floating tool-bar -->
        <sl-button fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-copy"></sl-icon>
          Duplicate
        </sl-button>
        <sl-button fill="outline" slot="bulk-actions" variant="inverted">
          <sl-icon name="far-trash"></sl-icon>
          Delete
        </sl-button>
      </sl-grid>
    `;
  }
};

export const MultipleWithClickableRow: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const onActiveItemChange = ({ detail: { item } }: SlActiveItemChangeEvent<Person>): void => {
      console.log('current active item:', item);
    };

    return html`
      <sl-grid @sl-active-item-change=${onActiveItemChange} clickable-row .items=${people}>
        <sl-grid-selection-column auto-select></sl-grid-selection-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Grouped: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayListDataSource(people as Person[]);
    dataSource.setGroupBy('membership');

    const onActiveItemChange = ({ detail: { item } }: SlActiveItemChangeEvent<Person>): void => {
      console.log('current active item:', item);
    };

    return html`
      <sl-grid .dataSource=${dataSource} clickable-row @sl-active-item-change=${onActiveItemChange}>
        <sl-grid-selection-column></sl-grid-selection-column>
        <sl-grid-column path="firstName"></sl-grid-column>
        <sl-grid-column path="lastName"></sl-grid-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="address.phone"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
    `;
  }
};
