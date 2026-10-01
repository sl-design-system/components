import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// A bare side-effect import. This is the only reliable way to guarantee the module body runs and
// `customElements.define` executes: a value import whose binding is used only in a type position
// gets elided by the compiler, and the element then never registers — a defect that has shipped
// twice in this batch while the type check stayed green.
import './class-overview-page.js';
import {
  DEFAULT_CLASS_OVERVIEW,
  DEFAULT_STUDENT_ROWS,
  type ClassOverviewModel
} from './fixtures/class-overview.fixture.js';

type Story = StoryObj;

export default {
  title: 'Runs/A2 NSP Class Overview/Class overview page',
  parameters: { layout: 'fullscreen' },
  render: () => html`<sl-a2-class-overview-page></sl-a2-class-overview-page>`
} satisfies Meta;

/** The design as drawn: 10 blueprint rows, the `D9981` class code, "Participants" active. */
export const Basic: Story = {};

// The grid with no rows at all — exercises `sl-grid`'s own empty state.
const noStudents: ClassOverviewModel = { ...DEFAULT_CLASS_OVERVIEW, students: [] };

/** The empty roster: the panel and its actions with an empty grid. */
export const NoStudents: Story = {
  render: () => html`<sl-a2-class-overview-page .model=${noStudents}></sl-a2-class-overview-page>`
};

// Moves the class-nav active underline off the design's "Participants".
const overviewSection: ClassOverviewModel = {
  ...DEFAULT_CLASS_OVERVIEW,
  activeSection: 'overview'
};

/** The "Overview" section is active instead of the design's "Participants". */
export const OverviewSection: Story = {
  render: () => html`
    <sl-a2-class-overview-page .model=${overviewSection}></sl-a2-class-overview-page>
  `
};

// Three rows instead of ten, so the grid is shorter than the panel's fixed design height.
const fewStudents: ClassOverviewModel = {
  ...DEFAULT_CLASS_OVERVIEW,
  students: DEFAULT_STUDENT_ROWS.slice(0, 3)
};

/** A short roster — three rows rather than the design's ten. */
export const FewStudents: Story = {
  render: () => html`<sl-a2-class-overview-page .model=${fewStudents}></sl-a2-class-overview-page>`
};
