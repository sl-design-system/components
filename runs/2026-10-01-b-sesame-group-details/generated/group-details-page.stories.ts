import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// A PLAIN side-effect import, on purpose. `import { type GroupDetailsPage } from './…'` is erased
// at transform time, so `customElements.define` would never run: Storybook would render an
// unregistered, zero-by-zero element with no shadow root, and the type check would still pass.
import './group-details-page.js';

type Story = StoryObj;

export default {
  title: 'Runs/B Sesame Group Details/Page',
  parameters: { layout: 'fullscreen' }
} satisfies Meta;

/**
 * The frame exactly as Figma draws it (`2142:48093`, 1280 x 2392) — which includes all three of
 * its mutually exclusive states at once: the add-student search panel, the create-student form
 * and the "no students yet" empty state, while the Students tab badge says 10.
 *
 * That is the design's own inconsistency, not the implementation's, and this story reproduces it
 * because the frame is what Stage 4 measures against.
 */
export const Basic: Story = {
  render: () => html`<sl-b-sesame-group-details-page></sl-b-sesame-group-details-page>`
};

/**
 * The realistic exclusive states the frame conflates. The design draws the search panel, the
 * create form and the empty state simultaneously while the Students tab badge says 10
 * (Inconsistency 7); a running product shows one at a time. These variants exist so Stage 6 and a
 * reviewer can exercise each independently — they are NOT what Stage 4 measures against.
 */
const only = (state: 'search' | 'create' | 'empty') => () => {
  const page = document.createElement('sl-b-sesame-group-details-page');

  // Set through the element's own attribute surface rather than reaching into its private fields.
  page.setAttribute('data-only', state);

  return page;
};

/** Just the "Add student to group" search panel, with no results. */
export const SearchOnly: Story = { render: only('search') };

/** Just the "Can't find the student?" create form. */
export const CreateOnly: Story = { render: only('create') };

/** Just the "You don't have any students yet" state. */
export const EmptyOnly: Story = { render: only('empty') };
