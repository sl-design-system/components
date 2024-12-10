import { Button } from '@sl-design-system/button';
import { ArrayDataSource } from '@sl-design-system/data-source';
import { type Person, getPeople } from '@sl-design-system/example-data';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html } from 'lit';
import '../../register.js';

type Story = StoryObj;

export default {
  title: 'Grid/Sorting',
  tags: ['draft'],
  loaders: [async () => ({ people: (await getPeople()).people })],
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  }
} satisfies Meta;

export const Basic: Story = {
  render: (_, { loaded: { people } }) => {
    return html`
      <sl-grid .items=${people}>
        <sl-grid-sort-column path="id"></sl-grid-sort-column>
        <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
      </sl-grid>
    `;
  }
};

export const CustomColumnSorter2: Story = {
  render: (/*_, { loaded: { people } }*/) => {
    // const renderer = ({ firstName, lastName }: Person): TemplateResult => {
    //   return html`<sl-button>${firstName} ${lastName}</sl-button>`;
    // };
    //
    // const sorter = (a: Person, b: Person): number => {
    //   const lastNameCmp = a.lastName.localeCompare(b.lastName);
    //
    //   if (lastNameCmp === 0) {
    //     return a.firstName.localeCompare(b.firstName);
    //   } else {
    //     return lastNameCmp;
    //   }
    // };

    // console.log('custom sorter???', sorter);

    interface Foo {
      description: string;
      code: string;
    }

    const items: Foo[] = [
      { description: 'B', code: 'b' },
      { description: 'a', code: 'A' },
      { description: 'c', code: 'C' }
    ];

    // const sort = (a: Foo, b: Foo) => a.description.localeCompare(b.description, undefined, { sensitivity: 'accent' });

    // const sort = (a: Foo, b: Foo) => a.description.toLocaleLowerCase() > b.description.toLocaleLowerCase() ? 1 : (a.description.toLocaleLowerCase() < b.description.toLocaleLowerCase() ? -1 : 0);

    //// const sort = (a: Foo, b: Foo) => a.description.localeCompare(b.description, undefined, { caseFirst: 'upper' });

    //  const sort = (a: Foo, b: Foo) => a.description.toLowerCase().localeCompare(b.description.toLowerCase());

    //  const sort = (a: Foo, b: Foo) => a.description.localeCompare(b.description, 'en-US', {sensitivity: "case"});

    // 'en-US-u-kf-lower'

    //////  const sort = (a: Foo, b: Foo) => a.description.localeCompare(b.description);

    // valueA.localeCompare(valueB)

    // const sort = (a: Foo, b: Foo) => a.description.localeCompare(b.description, undefined, { sensitivity: 'base' });

    // const sort = (a: Foo, b: Foo) => a.description.localeCompare(b.description);

    const sort = (a: Foo, b: Foo) => a.description.toLocaleLowerCase().localeCompare(b.description.toLocaleLowerCase());

    return html`
      <sl-grid .items=${items}>
        <sl-grid-sort-column path="description" direction="asc" .sorter=${sort}></sl-grid-sort-column>
        <sl-grid-sort-column path="code"></sl-grid-sort-column>
      </sl-grid>
    `;
  } // .sorter=${sort}
};

export const CustomColumnSorter: Story = {
  render: (_, { loaded: { people } }) => {
    const renderer = ({ firstName, lastName }: Person): TemplateResult => {
      return html`<sl-button>${firstName} ${lastName}</sl-button>`;
    };

    const sorter = (a: Person, b: Person): number => {
      const lastNameCmp = a.lastName.localeCompare(b.lastName);

      if (lastNameCmp === 0) {
        return a.firstName.localeCompare(b.firstName);
      } else {
        return lastNameCmp;
      }
    };

    console.log('custom sorter???', sorter);

    return html`
      <sl-grid .items=${people}>
        <sl-grid-sort-column header="User" .renderer=${renderer} .sorter=${sorter}></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
      </sl-grid>
    `;
  }
};

export const CustomDataSourceSorter: Story = {
  render: (_, { loaded: { people } }) => {
    const sorter = (a: Person, b: Person): number => {
      const lastNameCmp = a.lastName.localeCompare(b.lastName);

      if (lastNameCmp === 0) {
        return a.firstName.localeCompare(b.firstName);
      } else {
        return lastNameCmp;
      }
    };

    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.setSort('custom', sorter, 'asc');

    return html`
      <p>This grid sorts people by last name, then first name, via a custom sorter on the data directly.</p>
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
        <sl-grid-column path="email"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Grouped: Story = {
  loaders: [async () => ({ people: (await getPeople()).people })],
  render: (_, { loaded: { people } }) => {
    const dataSource = new ArrayDataSource(people as Person[]);
    dataSource.setGroupBy('membership');

    return html`
      <sl-grid .dataSource=${dataSource}>
        <sl-grid-sort-column path="id"></sl-grid-sort-column>
        <sl-grid-sort-column path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
        <sl-grid-column path="email"></sl-grid-column>
        <sl-grid-column path="membership"></sl-grid-column>
      </sl-grid>
    `;
  }
};

export const Sorted: Story = {
  render: (_, { loaded: { people } }) => {
    return html`
      <sl-grid .items=${people}>
        <sl-grid-sort-column direction="asc" path="firstName"></sl-grid-sort-column>
        <sl-grid-sort-column path="lastName"></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
      </sl-grid>
    `;
  }
};

export const ScopedElements: Story = {
  render: (_, { loaded: { people } }) => {
    const renderer = ({ firstName, lastName }: Person): TemplateResult => {
      return html`<sl-button>${firstName} ${lastName}</sl-button>`;
    };

    return html`
      <sl-grid .items=${people}>
        <sl-grid-sort-column
          header="User"
          path="firstName"
          .renderer=${renderer}
          .scopedElements=${{ 'sl-button': Button }}
        ></sl-grid-sort-column>
        <sl-grid-sort-column path="email"></sl-grid-sort-column>
      </sl-grid>
    `;
  }
};
