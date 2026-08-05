import { ButtonComponent } from '@sl-design-system/angular/button';
import { ButtonBarComponent } from '@sl-design-system/angular/button-bar';
import {
  GridColumnComponent,
  GridColumnGroupComponent,
  GridComponent,
  GridSelectionColumnComponent,
  GridSortColumnComponent
} from '@sl-design-system/angular/grid';
import { IconComponent } from '@sl-design-system/angular/icon';
import { MenuButtonComponent, MenuItemComponent } from '@sl-design-system/angular/menu';
import { SkeletonComponent } from '@sl-design-system/angular/skeleton';
import { Avatar } from '@sl-design-system/avatar';
import {
  FetchListDataSource,
  FetchListDataSourceError,
  ListDataSourcePlaceholder
} from '@sl-design-system/data-source';
import { getStudents } from '@sl-design-system/example-data';
import { Icon } from '@sl-design-system/icon';
import { MenuButton, MenuItem } from '@sl-design-system/menu';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { html } from 'lit';

type StudentType = Awaited<ReturnType<typeof getStudents>>['students'][number];

const avatarRenderer = (student: StudentType) => {
  const { firstName, infix, lastName, pictureUrl } = student;

  return html`
    <sl-avatar
      .displayName=${[firstName, infix, lastName].filter(Boolean).join(' ')}
      .pictureUrl=${pictureUrl}
      size="sm"></sl-avatar>
  `;
};

const avatarScopedElements = { 'sl-avatar': Avatar };

const menuButtonRenderer = () => html`
  <sl-menu-button fill="ghost" size="sm">
    <sl-icon slot="button" name="ellipsis"></sl-icon>
    <sl-menu-item>Do something with this student</sl-menu-item>
    <sl-menu-item>Something else</sl-menu-item>
    <hr />
    <sl-menu-item>Delete person</sl-menu-item>
  </sl-menu-button>
`;

const menuButtonScopedElements = {
  'sl-icon': Icon,
  'sl-menu-button': MenuButton,
  'sl-menu-item': MenuItem
};

export default {
  title: 'Wrappers/Grid/Basics',
  decorators: [
    moduleMetadata({
      imports: [
        ButtonBarComponent,
        ButtonComponent,
        GridColumnComponent,
        GridColumnGroupComponent,
        GridComponent,
        GridSelectionColumnComponent,
        GridSortColumnComponent,
        IconComponent,
        MenuButtonComponent,
        MenuItemComponent,
        SkeletonComponent
      ]
    })
  ]
} as Meta;

export const Basic: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as StudentType[];

    return {
      description:
        'A grid displays tabular data in rows and columns. This example shows a basic setup with static data and simple columns.',
      props: { students, avatarRenderer, avatarScopedElements },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-column [grow]="0" header="Nr." path="id"></sl-grid-column>
          <sl-grid-column
            [grow]="3"
            header="Student"
            path="fullName"
            [renderer]="avatarRenderer"
            [scopedElements]="avatarScopedElements"></sl-grid-column>
          <sl-grid-column header="Date of birth" path="dateOfBirth"></sl-grid-column>
          <sl-grid-column header="School" path="school.name"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const ColumnGroups: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as StudentType[];

    return {
      description:
        'You can group related columns by using sl-grid-column-group for clearer table structure.',
      props: { students },
      template: `
        <sl-grid [items]="students" [striped]="true" [noSkipLinks]="true">
          <sl-grid-column-group header="Name">
            <sl-grid-column path="firstName"></sl-grid-column>
            <sl-grid-column path="lastName"></sl-grid-column>
          </sl-grid-column-group>
          <sl-grid-column-group header="School">
            <sl-grid-column path="school.name"></sl-grid-column>
            <sl-grid-column path="school.city"></sl-grid-column>
          </sl-grid-column-group>
        </sl-grid>
      `
    };
  }
};

export const Header: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as StudentType[];

    return {
      description: 'Customize column header labels by setting the header attribute per column.',
      props: { students },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-column header="Student number" path="id"></sl-grid-column>
          <sl-grid-column header="Student name" path="fullName"></sl-grid-column>
          <sl-grid-column header="Birth date" path="dateOfBirth"></sl-grid-column>
          <sl-grid-column header="School name" path="school.name"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const EllipsizeText: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 30 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as StudentType[];

    return {
      description:
        'Use ellipsize-text to truncate text that overflows its column. Truncated content automatically adds a tooltip with the full text on hover.',
      props: { students },
      template: `
        <sl-grid
          [items]="students"
          [ellipsizeText]="true"
          [noSkipLinks]="true"
          style="max-inline-size: 500px">
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
          <sl-grid-column path="school.name"></sl-grid-column>
          <sl-grid-column path="school.address"></sl-grid-column>
          <sl-grid-column path="school.city"></sl-grid-column>
          <sl-grid-column path="school.country"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const Striped: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as StudentType[];

    return {
      description: 'Use striped rows to improve readability in larger datasets.',
      props: { students },
      template: `
        <sl-grid [items]="students" [striped]="true" [noSkipLinks]="true">
          <sl-grid-column path="id"></sl-grid-column>
          <sl-grid-column path="fullName"></sl-grid-column>
          <sl-grid-column path="school.name"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const KeyboardHeaderScroll: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as StudentType[];

    return {
      description:
        'This example shows keyboard navigation through sortable column headers in a horizontally scrollable grid with a sticky selection column.',
      props: { students },
      template: `
        <sl-grid [items]="students" style="inline-size: 320px" [noSkipLinks]="true">
          <sl-grid-selection-column [sticky]="true"></sl-grid-selection-column>
          <sl-grid-sort-column [grow]="0" path="firstName" [width]="220"></sl-grid-sort-column>
          <sl-grid-sort-column [grow]="0" path="lastName" [width]="220"></sl-grid-sort-column>
          <sl-grid-sort-column [grow]="0" path="email" [width]="260"></sl-grid-sort-column>
          <sl-grid-sort-column [grow]="0" path="school.name" [width]="260"></sl-grid-sort-column>
        </sl-grid>
        <button type="button">Focus after grid</button>
      `
    };
  }
};

export const MenuButtonStory: StoryObj = {
  name: 'Menu Button',
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('sl-grid') as
      | (HTMLElement & {
          requestUpdate?(): void;
          updateComplete?: Promise<unknown>;
          recalculateColumnWidths?(): Promise<void>;
        })
      | null;

    // Wait until custom elements and fonts are ready, then re-measure columns.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    if ('fonts' in document) {
      await (document as Document & { fonts: { ready: Promise<unknown> } }).fonts.ready;
    }

    await grid?.updateComplete;
    await grid?.recalculateColumnWidths?.();

    // Trigger observers that rely on viewport size changes.
    window.dispatchEvent(new Event('resize'));
  },
  render: (_, { loaded }) => {
    const students = loaded['students'] as StudentType[];

    return {
      description:
        'This example has a column with a custom renderer that renders an sl-menu-button inside each cell, providing per-row actions.',
      props: {
        students,
        avatarRenderer,
        avatarScopedElements,
        menuButtonRenderer,
        menuButtonScopedElements
      },
      template: `
        <sl-grid [items]="students" [noSkipLinks]="true">
          <sl-grid-column
            [grow]="3"
            header="Student"
            path="fullName"
            [renderer]="avatarRenderer"
            [scopedElements]="avatarScopedElements"></sl-grid-column>
          <sl-grid-column path="email"></sl-grid-column>
          <sl-grid-column
            [grow]="0"
            [autoWidth]="true"
            header="Actions"
            [hideHeaderText]="true"
            [parts]="'menu-button'"
            [renderer]="menuButtonRenderer"
            [scopedElements]="menuButtonScopedElements"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const SkipLinks: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as StudentType[];

    const linkRenderer = (student: StudentType) =>
      html`<a href="mailto:${student.email}">${student.email}</a>`;

    return {
      description:
        'This example shows how, when using keyboard navigation, you can skip the grid and jump directly past it using the skip links.',
      props: { students, linkRenderer },
      template: `
        <sl-grid [items]="students">
          <sl-grid-column path="firstName"></sl-grid-column>
          <sl-grid-column path="lastName"></sl-grid-column>
          <sl-grid-column path="email" [renderer]="linkRenderer"></sl-grid-column>
          <sl-grid-column path="school.address"></sl-grid-column>
          <sl-grid-column path="school.city"></sl-grid-column>
        </sl-grid>
        <p>A paragraph that follows the table, with a <a href="#">link</a> in it.</p>
      `
    };
  }
};

export const LazyLoad: StoryObj = {
  render: () => {
    interface Quote {
      id: string;
      quote: string;
      author: string;
    }

    interface QuotesResponse {
      quotes: Quote[];
      total: number;
      skip: number;
      limit: number;
    }

    const ds = new FetchListDataSource<Quote>({
      pageSize: 30,
      fetchPage: async ({ page, pageSize }) => {
        const response = await fetch(
          `https://dummyjson.com/quotes?skip=${page * pageSize}&limit=${pageSize}`
        );

        if (response.ok) {
          const { quotes, total } = (await response.json()) as QuotesResponse;

          return { items: quotes, totalItems: total };
        } else {
          throw new FetchListDataSourceError('Failed to fetch data', response);
        }
      }
    });

    return {
      description:
        'This example uses FetchListDataSource to lazy-load quotes from a remote service. Data is loaded on demand as you scroll. It uses data from dummyjson.com.',
      props: { ds },
      template: `
        <sl-grid [dataSource]="ds" [noSkipLinks]="true">
          <sl-grid-column path="id" [grow]="0" [width]="50"></sl-grid-column>
          <sl-grid-column path="quote" [grow]="3"></sl-grid-column>
          <sl-grid-column path="author"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const Skeleton: StoryObj = {
  render: () => {
    const skeletonAvatarRenderer = (item: StudentType | symbol) => {
      if (typeof item === 'symbol' && item === ListDataSourcePlaceholder) {
        return html`
          <div style="display: flex; align-items: center; gap: 0.25rem; inline-size: 100%">
            <sl-skeleton
              style="aspect-ratio: 1; block-size: var(--sl-size-300); inline-size: auto"
              variant="circle"></sl-skeleton>
            <sl-skeleton
              style="block-size: 18px; inline-size: ${Math.max(
                Math.random() * 100,
                30
              )}%"></sl-skeleton>
          </div>
        `;
      }

      const { firstName, infix, lastName, pictureUrl } = item as StudentType;

      return html`
        <sl-avatar
          .displayName=${[firstName, infix, lastName].filter(Boolean).join(' ')}
          .pictureUrl=${pictureUrl}
          size="sm"></sl-avatar>
      `;
    };

    const ds = new FetchListDataSource<StudentType>({
      pageSize: 30,
      fetchPage: async ({ page, pageSize }) => {
        const { students, total } = await getStudents({
          count: pageSize,
          startIndex: page * pageSize
        });

        // Simulate a slow response
        await new Promise(resolve => setTimeout(resolve, 3000));

        return { items: students, totalItems: total };
      },
      size: Math.floor(window.innerHeight / 30)
    });

    return {
      description:
        'This example customizes the student column renderer to handle loading/placeholder states, showing skeleton loaders while data is being fetched.',
      props: { ds, skeletonAvatarRenderer, skeletonScopedElements: { 'sl-avatar': Avatar } },
      template: `
        <sl-grid [dataSource]="ds" [noSkipLinks]="true">
          <sl-grid-column
            [grow]="0"
            [autoWidth]="false"
            header="Nr."
            path="studentNumber"
            [width]="160"></sl-grid-column>
          <sl-grid-column
            header="Student"
            [renderer]="skeletonAvatarRenderer"
            [scopedElements]="skeletonScopedElements"></sl-grid-column>
          <sl-grid-column header="School" path="school.name"></sl-grid-column>
        </sl-grid>
      `
    };
  }
};

export const ReorderColumns: StoryObj = {
  loaders: [
    async () => {
      const { students } = await getStudents({ count: 50 });

      return { students };
    }
  ],
  render: (_, { loaded }) => {
    const students = loaded['students'] as StudentType[];

    const columns = [
      { path: 'fullName', header: 'Student' },
      { path: 'email', header: 'Email' },
      { path: 'group.name', header: 'Group' },
      { path: 'school.name', header: 'School' }
    ];

    const reorder = (): void => {
      // Keep the same array reference so ngFor can detect item moves in-place.
      columns.sort(() => Math.random() - 0.5);
    };

    return {
      description:
        'This example demonstrates that when you programmatically reorder the columns array, the grid updates accordingly.',
      props: { students, columns, reorder },
      template: `
        <sl-button-bar style="margin-block-end: 1rem">
          <sl-button (click)="reorder()">Reorder columns</sl-button>
        </sl-button-bar>
        <sl-grid [items]="students" [noSkipLinks]="true">
          @for (col of columns; track col.path) {
            <sl-grid-column [path]="col.path" [header]="col.header"></sl-grid-column>
          }
        </sl-grid>
      `
    };
  }
};
