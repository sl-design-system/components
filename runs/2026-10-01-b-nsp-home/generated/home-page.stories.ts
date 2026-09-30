import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Importing the component registers `sl-nsp-home-page` globally (guarded) as a side effect.
import './home-page.js';
import { type ClassCardModel } from './class-card/class-card.js';
import { DEFAULT_CLASSES, DEFAULT_NAV } from './demo-data.js';
import { type TopNavModel } from './top-nav/top-nav.js';

type Story = StoryObj;

export default {
  title: 'Runs/B NSP Home/Home page',
  parameters: { layout: 'fullscreen' },
  render: () => html`<sl-nsp-home-page></sl-nsp-home-page>`
} satisfies Meta;

export const Basic: Story = {};

/** The empty state: the "Classes" heading and "Create class" action with no cards in the grid. */
export const NoClasses: Story = {
  render: () => html`<sl-nsp-home-page .classes=${[]}></sl-nsp-home-page>`
};

// A single class with exactly one student, exercising the card's singular "1 student" label
// (as opposed to the pluralised "n students" the other stories/design show).
const singleClass: ClassCardModel[] = [
  { id: '5b-english', name: '5B English', studentCount: 1, hasMethod: false }
];

/** One class card only, with a roster of one — exercises the singular "1 student" label. */
export const SingleClass: Story = {
  render: () => html`<sl-nsp-home-page .classes=${singleClass}></sl-nsp-home-page>`
};

// Every record has a method assigned, so no card renders a "No method added" status row.
const allMethodsAdded: ClassCardModel[] = DEFAULT_CLASSES.map(cls => ({ ...cls, hasMethod: true }));

/** All five classes have a method assigned, so no card shows the "No method added" status row. */
export const AllMethodsAdded: Story = {
  render: () => html`<sl-nsp-home-page .classes=${allMethodsAdded}></sl-nsp-home-page>`
};

/** Content projected into the `task-list` slot, replacing the default placeholder blocks. */
export const CustomTaskList: Story = {
  render: () => html`
    <sl-nsp-home-page>
      <li slot="task-list">Grade 5B homework</li>
      <li slot="task-list">Prepare 6A quiz</li>
    </sl-nsp-home-page>
  `
};

// Moves the top nav's active-link underline from "Home" to "Calendar".
const calendarNav: TopNavModel = { ...DEFAULT_NAV, activeLinkId: 'calendar' };

/** The top nav's active link is "Calendar" instead of the default "Home". */
export const DifferentActiveNavLink: Story = {
  render: () => html`<sl-nsp-home-page .nav=${calendarNav}></sl-nsp-home-page>`
};
