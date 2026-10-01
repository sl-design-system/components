import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Plain side-effect import so `sl-a2-students-grid` actually registers — a type-only import
// would be erased at transform time and the element would never be defined.
import './students-grid.js';
import { type StudentRow, type StudentsGrid } from './students-grid.js';
import { DEFAULT_STUDENT_ROWS } from '../../fixtures/class-overview.fixture.js';

type Props = Pick<StudentsGrid, 'rows' | 'showFooter'>;
type Story = StoryObj<Props>;

// The design is a blueprint with no domain data: 10 rows × 4 columns, every cell reading "Text".
// In the real app the data-owning `students-panel` would fetch the class roster (e.g.
// `GET /api/classes/:id/students`) and pass the relevant subset in as `rows`.
const rows: StudentRow[] = Array.from({ length: 10 }, (_, index) => ({
  id: `row-${index + 1}`,
  column1: 'Text',
  column2: 'Text',
  column3: 'Text',
  column4: 'Text'
}));

export default {
  title: 'Runs/A2 NSP Class Overview/Students grid',
  args: { rows, showFooter: true },
  argTypes: {
    rows: { control: false },
    showFooter: { control: 'boolean' }
  },
  render: ({ rows, showFooter }) =>
    html`<sl-a2-students-grid .rows=${rows} ?show-footer=${showFooter}></sl-a2-students-grid>`
} satisfies Meta<Props>;

export const Basic: Story = {};

/** A short 3-row roster — the grid with fewer rows than the design's full 10-row blueprint. */
export const ShortRoster: Story = {
  args: { rows: DEFAULT_STUDENT_ROWS.slice(0, 3) }
};

/** The grid's own empty state: no rows at all, footer still shown below it. */
export const NoRows: Story = {
  args: { rows: [] }
};

/** `showFooter=false` — the footer row is omitted entirely below the grid. */
export const FooterHidden: Story = {
  args: { showFooter: false }
};

/** Custom content projected into the `footer` slot, replacing the default literal "Footer". */
export const CustomFooter: Story = {
  render: ({ rows, showFooter }) => html`
    <sl-a2-students-grid .rows=${rows} ?show-footer=${showFooter}>
      <span slot="footer">10 students · 0 selected</span>
    </sl-a2-students-grid>
  `
};
