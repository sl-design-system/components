import { EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { iconGap } from '../icon-gap.js';
import styles from './file-panel.css' with { type: 'css' };

/** Stable keys for the file-type glyphs. None is in the theme registry; all render as a gap. */
export type A7FileTypeKey = 'text' | 'ppt' | 'mp4' | 'pdf' | 'invoice-dollar' | 'doc' | 'word';

/** One downloadable file. `id` must be unique — two rows in this design are otherwise identical. */
export interface A7FileEntry {
  id: string;
  name: string;
  size: string;
  fileType: A7FileTypeKey;
}

/** The panel's data. The "N files available" line is derived, not carried. */
export interface A7FilePanelModel {
  heading: string;
  files: A7FileEntry[];
}

export type SlA7MyportalFileOpenEvent = CustomEvent<{ fileId: string }>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a7-myportal-file-open': SlA7MyportalFileOpenEvent;
  }
}

/**
 * The right-hand panel listing the files available for the selected document type.
 *
 * Plain markup rather than `sl-panel`: the panel's header is two lines — the heading and a derived
 * availability count — which `sl-panel`'s single `heading` property does not model, and it carries
 * its own padding, radius and row rhythm.
 *
 * All seven file-type glyphs are absent from the theme's registry, so every row's icon is an
 * `iconGap(24)` and the omission is recorded rather than filled with invented artwork.
 */
export class A7FilePanel extends LitElement {
  static override styles: CSSResultGroup = styles;

  /** The panel's data. */
  @property({ attribute: false }) model?: A7FilePanelModel;

  /** Emits when a file row is activated. */
  @event({ name: 'sl-a7-myportal-file-open' }) fileOpenEvent!: EventEmitter<SlA7MyportalFileOpenEvent>;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html``;
    }

    return html`
      <section aria-labelledby="file-panel-heading">
        <h2 id="file-panel-heading">${model.heading}</h2>
        <div class="body">
          <p class="available">${model.files.length} files available</p>
          <ul>
            ${model.files.map(
              file => html`
                <li>
                  <button type="button" @click=${() => this.fileOpenEvent.emit({ fileId: file.id })}>
                    ${iconGap(24)}
                    <span class="name">${file.name}</span>
                    <span class="size">${file.size}</span>
                  </button>
                </li>
              `
            )}
          </ul>
        </div>
      </section>
    `;
  }
}
