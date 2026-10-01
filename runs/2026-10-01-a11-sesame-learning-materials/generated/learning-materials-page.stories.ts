import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { MOCK_PAGE } from './mock-data.js';
import { type LearningMaterialsPageModel } from './types.js';
// Plain side-effect import on purpose: a `import { type LearningMaterialsPage } from …` import is
// erased at transform time, so `customElements.define` would never run and Storybook would render
// an unregistered, zero-by-zero element with no shadow root — silently blank, even though the
// type-check would still pass.
import './learning-materials-page.js';

/**
 * Every story renders the root, because the four children are scoped elements with no global
 * registration — there is no tag to mount them with on their own. Variants are expressed by
 * handing the root a modified `model`.
 */
const withModel = (model: LearningMaterialsPageModel) =>
  html`<sl-sesame-learning-materials-page .model=${model}></sl-sesame-learning-materials-page>`;

export default {
  title: 'Runs/A11 Sesame Learning Materials/Learning materials page',
  parameters: { layout: 'fullscreen' },
  render: () => html`<sl-sesame-learning-materials-page></sl-sesame-learning-materials-page>`
} satisfies Meta;

/** The design as drawn: seven assigned materials across three vendor platforms. */
export const Basic: StoryObj = {};

/**
 * No licences assigned yet. Shows the teal band collapsing to its own padding with nothing in it —
 * the state a newly onboarded teacher sees before any material is assigned.
 */
export const NoAssignedMaterials: StoryObj = {
  render: () =>
    withModel({
      ...MOCK_PAGE,
      assignedMaterials: { ...MOCK_PAGE.assignedMaterials, materials: [] }
    })
};

/** A single row, so the list can be checked at its minimum without the repetition of seven. */
export const SingleMaterial: StoryObj = {
  render: () =>
    withModel({
      ...MOCK_PAGE,
      assignedMaterials: {
        ...MOCK_PAGE.assignedMaterials,
        materials: MOCK_PAGE.assignedMaterials.materials.slice(0, 1)
      }
    })
};

/**
 * Titles long enough to wrap onto a second line. The card is 80px in the design, but it is sized
 * with `min-block-size`, so this is what proves it grows rather than clipping its own content.
 */
export const LongTitles: StoryObj = {
  render: () =>
    withModel({
      ...MOCK_PAGE,
      assignedMaterials: {
        ...MOCK_PAGE.assignedMaterials,
        materials: MOCK_PAGE.assignedMaterials.materials.slice(0, 3).map((material, index) => ({
          ...material,
          title:
            index === 1
              ? material.title
              : `${material.title} — Volledige editie voor het secundair onderwijs, tweede graad`
        }))
      }
    })
};
