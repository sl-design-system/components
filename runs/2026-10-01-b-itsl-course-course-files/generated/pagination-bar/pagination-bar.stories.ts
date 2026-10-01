import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import so `sl-itsl-course-pagination-bar` actually registers — a type-only import
// would be erased at transform time and the element would never be defined.
import './pagination-bar.js';
import { type PaginationBar, type PaginationModel } from './pagination-bar.js';

type Props = Pick<PaginationBar, 'model'>;
type Story = StoryObj<Props>;

// In the real app this would come from `sl-itsl-course-files-page`, which owns the course-files
// list and derives `totalItems` from the fetch; this story exercises the component standalone
// with the design's own state: page 1 of 5, page size 10, 47 items total.
const model: PaginationModel = {
  page: 1,
  pageSize: 10,
  totalItems: 47
};

export default {
  title: 'Runs/B Itsl Course Course Files/Pagination bar',
  args: { model },
  render: ({ model }) => html`<sl-itsl-course-pagination-bar .model=${model}></sl-itsl-course-pagination-bar>`
} satisfies Meta<Props>;

export const Basic: Story = {};

/** Mid-range: both chevrons enabled, the selected page away from either end. */
export const MiddlePage: Story = { args: { model: { page: 3, pageSize: 10, totalItems: 47 } } };

/** The last page: the next chevron is disabled and the range ends at the total. */
export const LastPage: Story = { args: { model: { page: 5, pageSize: 10, totalItems: 47 } } };

/** A single page of results — both chevrons disabled. */
export const SinglePage: Story = { args: { model: { page: 1, pageSize: 10, totalItems: 4 } } };
