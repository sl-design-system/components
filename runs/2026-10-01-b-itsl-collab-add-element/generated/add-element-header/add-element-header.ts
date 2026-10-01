import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Breadcrumbs } from '@sl-design-system/breadcrumbs';
import { Button } from '@sl-design-system/button';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './add-element-header.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-upload-file-action': SlUploadFileActionEvent;
    'sl-create-folder-action': SlCreateFolderActionEvent;
  }
}

/** One crumb in the breadcrumb trail. */
export interface BreadcrumbLink {
  id: string;
  label: string;
  href: string;
}

/** The data this component renders: the breadcrumb trail and the folder the page is adding to. */
export interface AddElementHeaderModel {
  breadcrumbs: BreadcrumbLink[];
  folderName: string;
}

export type SlUploadFileActionEvent = CustomEvent<void>;
export type SlCreateFolderActionEvent = CustomEvent<void>;

/**
 * The page header of the "Add element" screen: a breadcrumb trail, the "Add element to
 * [folder name]" page title, and the Upload file / Create folder action row.
 *
 * Presentational — it renders the `model` it's given and emits when an action button is
 * activated; the root owns the breadcrumb/folder data and handles the emitted events.
 *
 * The action-row button labels, variants and the heading template are structural/presentation
 * config owned by this component, not the model.
 *
 * ```html
 * <sl-add-element-header .model=${{ breadcrumbs, folderName }}></sl-add-element-header>
 * ```
 *
 * @fires sl-upload-file-action - Emitted when the "Upload file" button is activated.
 * @fires sl-create-folder-action - Emitted when the "Create folder" button is activated.
 */
export class AddElementHeader extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-breadcrumbs': Breadcrumbs,
      'sl-button': Button
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The breadcrumb trail and the folder this page adds an element to. */
  @property({ attribute: false }) model?: AddElementHeaderModel;

  /** @internal Emits when the "Upload file" button is activated. */
  @event({ name: 'sl-upload-file-action' }) uploadFileEvent!: EventEmitter<SlUploadFileActionEvent>;

  /** @internal Emits when the "Create folder" button is activated. */
  @event({ name: 'sl-create-folder-action' })
  createFolderEvent!: EventEmitter<SlCreateFolderActionEvent>;

  override render(): TemplateResult {
    const model = this.model,
      crumbs = model?.breadcrumbs ?? [];

    return html`
      <sl-breadcrumbs no-home>
        <!-- The design shows a trailing chevron after the last crumb; sl-breadcrumbs only
             renders separators between items, so that trailing chevron cannot be reproduced.
             Recorded as a Stage 4 discrepancy. -->
        ${crumbs.map(crumb => html`<a href=${crumb.href}>${crumb.label}</a>`)}
      </sl-breadcrumbs>
      <h1>Add element to ${model?.folderName ?? ''}</h1>
      <div class="actions">
        <sl-button variant="primary" fill="solid" @click=${this.#onUploadFileClick}>
          <!-- Design shows a file-upload glyph here; "file-import" is not registered by the
               itslearning theme, so it is left out. Recorded as a Stage 4 discrepancy. -->
          Upload file
        </sl-button>
        <sl-button variant="secondary" fill="outline" @click=${this.#onCreateFolderClick}>
          <!-- Design shows a folder-plus glyph here; "folder-plus" is not registered by the
               itslearning theme, so it is left out. Recorded as a Stage 4 discrepancy. -->
          Create folder
        </sl-button>
      </div>
    `;
  }

  #onUploadFileClick(): void {
    this.uploadFileEvent.emit();
  }

  #onCreateFolderClick(): void {
    this.createFolderEvent.emit();
  }
}
