import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Importing the module registers `sl-a3mp-digital-exercises-page` globally (guarded) as a side
// effect. A `import { type … }` here would be erased at compile time, the module would never run,
// and `customElements.define` would never happen — the type check passes either way, which is why
// nothing in the pipeline catches it.
import './a3mp-digital-exercises-page.js';
import { type A3mpDigitalExercisesPage } from './a3mp-digital-exercises-page.js';
import { DEFAULT_PAGE_DATA, type DigitalExercisesPageData } from './demo-data.js';

type Story = StoryObj;

/** Derive a variant from the default data without mutating the shared constant. */
const withData = (patch: Partial<DigitalExercisesPageData>) => {
  const data: DigitalExercisesPageData = { ...DEFAULT_PAGE_DATA, ...patch };

  return html`<sl-a3mp-digital-exercises-page .data=${data}></sl-a3mp-digital-exercises-page>`;
};

export default {
  title: 'Runs/A3 MyPortal Digital Exercises/Digital exercises page',
  parameters: { layout: 'fullscreen' },
  render: () => html`<sl-a3mp-digital-exercises-page></sl-a3mp-digital-exercises-page>`
} satisfies Meta;

/** The design as drawn: Chapter 2 expanded, Digital Exercises selected, four exercise blocks. */
export const Basic: Story = {};

/**
 * The drawn state of the level filter, which the design captures **open**.
 *
 * `sl-select` exposes no public API for this — `listbox` is a `@query('sl-listbox')` marked
 * `/** @internal *\/` — so this story deliberately reaches past that internal member. It is the
 * only place in this run that does, it is not what the primary Stage 4 capture measures, and it is
 * recorded as such in the run report.
 */
export const LevelMenuOpen: Story = {
  play: async ({ canvasElement }) => {
    const page = canvasElement.querySelector<A3mpDigitalExercisesPage>(
      'sl-a3mp-digital-exercises-page'
    );

    await page?.updateComplete;

    const select = page?.renderRoot
      .querySelector('sl-a3mp-exercises-panel')
      ?.renderRoot.querySelector('sl-select') as
      | (HTMLElement & { listbox?: { showPopover: () => void } })
      | null
      | undefined;

    select?.listbox?.showPopover();
  }
};

/** Nothing added yet — every exercise shows the add affordance rather than the added check. */
export const NoneAdded: Story = {
  render: () =>
    withData({
      exercisesPanel: {
        ...DEFAULT_PAGE_DATA.exercisesPanel,
        exercises: DEFAULT_PAGE_DATA.exercisesPanel.exercises.map(e => ({ ...e, added: false }))
      }
    })
};

/** Every exercise already added, exercising the `check-solid` state of the add toggle. */
export const AllAdded: Story = {
  render: () =>
    withData({
      exercisesPanel: {
        ...DEFAULT_PAGE_DATA.exercisesPanel,
        exercises: DEFAULT_PAGE_DATA.exercisesPanel.exercises.map(e => ({ ...e, added: true }))
      }
    })
};

/** All chapters collapsed — the left column with no expanded row and no selected tool. */
export const NoChapterExpanded: Story = {
  render: () =>
    withData({
      chapterNav: {
        ...DEFAULT_PAGE_DATA.chapterNav,
        chapters: DEFAULT_PAGE_DATA.chapterNav.chapters.map(c => ({
          ...c,
          expanded: false,
          highlighted: false
        }))
      }
    })
};
