import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
// A SEPARATE BARE IMPORT is required. A value import whose bindings are only used in type
// position is elided by TypeScript, the module never runs, `customElements.define` never happens,
// and Storybook renders an unknown element with no shadow root — while the type check still
// passes. This line is what actually registers `sl-a6-shared-folder-page`.
import './shared-folder-page.js';

type Story = StoryObj;

export default {
  title: 'Runs/A6 Itsl Collab Shared Folder/Shared folder page',
  parameters: { layout: 'fullscreen' },
  render: () => html`<sl-a6-shared-folder-page></sl-a6-shared-folder-page>`
} satisfies Meta;

/**
 * The frame as drawn: `Shared folder - teacher view` (`4200:13792`), 1280 x 1335, with the
 * Actions dropdown shown open exactly as the reference captures it.
 */
export const Basic: Story = {};

/**
 * The same page with every event it emits logged to a visible panel and to the console.
 *
 * The root has no public properties — it owns its mock data outright — but it emits eleven
 * events, each namespaced `sl-a6-` so it cannot collide with the `b-itsl-collab-add-element` run
 * drawn from the same Figma file, nor with the design system's own `sl-page-change` and
 * `sl-page-size-change` (which `sl-paginator` and `sl-paginator-page-size` already declare
 * globally — without the prefix, two of these would be duplicate-identifier build breaks).
 *
 * Every event bubbles and composes out of the root's shadow tree, so a listener attached directly
 * to the element — as below — is how a hosting app would wire them up. This story exists because
 * a still capture cannot tell a wired control from an inert one: an earlier run in this batch
 * shipped a page whose controls fired nothing and still passed the type, token and screenshot
 * gates.
 */
export const Events: Story = {
  render: () => {
    const log = (name: string, detail?: unknown): void => {
      console.info(name, detail);

      const panel = document.getElementById('a6-event-log');

      if (panel) {
        const entry = document.createElement('div');

        entry.textContent = detail === undefined ? name : `${name}: ${JSON.stringify(detail)}`;
        panel.prepend(entry);
      }
    };

    return html`
      <div
        id="a6-event-log"
        style="position: fixed; inset-block-start: 0; inset-inline-end: 0; z-index: 10; max-block-size: 40vh; overflow: auto; inline-size: 24rem; padding: 0.5rem; background: #fff; border: 1px solid #e1e1e1; font: 12px/1.4 monospace;"></div>
      <sl-a6-shared-folder-page
        @sl-a6-top-nav-search=${(e: CustomEvent) => log('sl-a6-top-nav-search', e.detail)}
        @sl-a6-course-bar-overflow=${() => log('sl-a6-course-bar-overflow')}
        @sl-a6-page-header-overflow=${() => log('sl-a6-page-header-overflow')}
        @sl-a6-file-search=${(e: CustomEvent) => log('sl-a6-file-search', e.detail)}
        @sl-a6-bulk-action=${(e: CustomEvent) => log('sl-a6-bulk-action', e.detail)}
        @sl-a6-file-selection-change=${(e: CustomEvent) =>
          log('sl-a6-file-selection-change', e.detail)}
        @sl-a6-file-sort-change=${(e: CustomEvent) => log('sl-a6-file-sort-change', e.detail)}
        @sl-a6-file-row-action=${(e: CustomEvent) => log('sl-a6-file-row-action', e.detail)}
        @sl-a6-page-change=${(e: CustomEvent) => log('sl-a6-page-change', e.detail)}
        @sl-a6-page-size-change=${(e: CustomEvent) => log('sl-a6-page-size-change', e.detail)}
        @sl-a6-settings-edit=${() => log('sl-a6-settings-edit')}></sl-a6-shared-folder-page>
    `;
  }
};
