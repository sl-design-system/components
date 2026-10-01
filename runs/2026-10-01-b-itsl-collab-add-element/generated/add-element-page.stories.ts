import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// Importing the component registers `sl-add-element-page` globally (guarded) as a side effect.
import './add-element-page.js';
import { type SlResourceCategorySelectEvent } from './resource-category-panel/resource-category-panel.js';
import { type SlTopNavSearchEvent } from './its-top-nav/its-top-nav.js';

type Story = StoryObj;

export default {
  title: 'Runs/B Itsl Collab Add Element/Add element page',
  parameters: { layout: 'fullscreen' },
  render: () => html`<sl-add-element-page></sl-add-element-page>`
} satisfies Meta;

export const Basic: Story = {};

/**
 * The root has no public properties — it owns its mock data outright — but it does emit five
 * events as a consumer app would observe them: `sl-top-nav-search` (type in the search field),
 * `sl-course-bar-overflow` (the course bar's "more options" button), `sl-upload-file-action` /
 * `sl-create-folder-action` (the header's action buttons), and `sl-resource-category-select` (a
 * category link in the Resources panel).
 *
 * All five bubble and compose out of `sl-add-element-page`'s own shadow tree (the root only
 * logs them internally via `console.info`), so a listener attached directly on the element, as
 * below, is how a hosting app would wire them up. Each is logged here to a visible panel and to
 * the console.
 */
export const Events: Story = {
  render: () => {
    const log = (name: string, detail?: unknown): void => {
      console.info(name, detail);

      const panel = document.getElementById('event-log');
      if (panel) {
        const entry = document.createElement('div');
        entry.textContent = detail === undefined ? name : `${name}: ${JSON.stringify(detail)}`;
        panel.prepend(entry);
      }
    };

    const onTopNavSearch = (event: SlTopNavSearchEvent): void => log('sl-top-nav-search', event.detail);
    const onCourseBarOverflow = (): void => log('sl-course-bar-overflow');
    const onUploadFile = (): void => log('sl-upload-file-action');
    const onCreateFolder = (): void => log('sl-create-folder-action');
    const onResourceCategorySelect = (event: SlResourceCategorySelectEvent): void =>
      log('sl-resource-category-select', event.detail);

    return html`
      <sl-add-element-page
        @sl-top-nav-search=${onTopNavSearch}
        @sl-course-bar-overflow=${onCourseBarOverflow}
        @sl-upload-file-action=${onUploadFile}
        @sl-create-folder-action=${onCreateFolder}
        @sl-resource-category-select=${onResourceCategorySelect}>
      </sl-add-element-page>
      <div
        id="event-log"
        style="position: fixed; inset-block-end: 0; inset-inline-start: 0; max-block-size: 30%; overflow: auto; background: rgba(0, 0, 0, 0.8); color: #fff; font: 12px monospace; padding: 8px; z-index: 1000;">
      </div>
    `;
  }
};
