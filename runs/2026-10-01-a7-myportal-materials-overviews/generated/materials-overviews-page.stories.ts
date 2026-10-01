import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { type A7PageModel, MOCK_PAGE } from './mock-data.js';
// Plain side-effect import on purpose. `import { type A7MaterialsOverviewsPage } from './…'` is
// erased at transform time, and so is a value import whose binding is only used in a type
// position — in either case the module never runs, `customElements.define` never happens, and
// Storybook renders an unregistered element with no shadow root. It looks blank, and the type
// check passes either way.
import './materials-overviews-page.js';

const withModel = (model: A7PageModel) =>
  html`<sl-a7-myportal-materials-overviews-page
    .model=${model}
  ></sl-a7-myportal-materials-overviews-page>`;

export default {
  parameters: { layout: 'fullscreen' },
  render: () =>
    html`<sl-a7-myportal-materials-overviews-page></sl-a7-myportal-materials-overviews-page>`,
  title: 'Runs/A7 MyPortal Materials Overviews/Materials overviews page'
} satisfies Meta;

/** The design as drawn: "Overviews" selected, eight files, every chapter collapsed. */
export const Basic: StoryObj = {};

export const AllSectionsCollapsed: StoryObj = {
  render: () =>
    withModel({
      ...MOCK_PAGE,
      tree: { sections: MOCK_PAGE.tree.sections.map(section => ({ ...section, expanded: false })) }
    })
};

export const NoFiles: StoryObj = {
  render: () => withModel({ ...MOCK_PAGE, filePanel: { ...MOCK_PAGE.filePanel, files: [] } })
};

export const DifferentSectionSelected: StoryObj = {
  render: () =>
    withModel({
      ...MOCK_PAGE,
      activeTreeItemId: 'manuals',
      filePanel: { ...MOCK_PAGE.filePanel, heading: 'Manuals' }
    })
};

export const LongMaterialTitle: StoryObj = {
  render: () =>
    withModel({
      ...MOCK_PAGE,
      materialHeader: {
        ...MOCK_PAGE.materialHeader,
        title: 'Reken Maar! 4 — Rekenwijzer voor het vierde leerjaar basisonderwijs'
      }
    })
};
