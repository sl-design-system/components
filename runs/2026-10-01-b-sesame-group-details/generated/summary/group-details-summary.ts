import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Card } from '@sl-design-system/card';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { type GroupDetailFieldId, type GroupSummaryModel } from '../types.js';
import styles from './group-details-summary.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-b-sesame-group-details-archive-group': SlBSesameGroupDetailsArchiveGroupEvent;
    'sl-b-sesame-group-details-back': SlBSesameGroupDetailsBackEvent;
    'sl-b-sesame-group-details-edit-field': SlBSesameGroupDetailsEditFieldEvent;
  }
}

/** Emitted when the "Back to Groups" link is activated. */
export type SlBSesameGroupDetailsBackEvent = CustomEvent<void>;

/** Emitted when one of the three inline edit controls is activated. */
export type SlBSesameGroupDetailsEditFieldEvent = CustomEvent<{ fieldId: GroupDetailFieldId }>;

/** Emitted when "Archive group" is activated. */
export type SlBSesameGroupDetailsArchiveGroupEvent = CustomEvent<{ groupId: string }>;

/**
 * The block above the tab strip: a link back to the group list, the page heading, the group's
 * three editable detail rows, the destructive "Archive group" action, and the linking-code card
 * a student uses to join.
 *
 * Presentational — it renders the model the page gives it and emits on each affordance.
 *
 * Three glyphs this block draws — `pencil` (the three row edit buttons), `archive` and `key` —
 * are **not** in the theme's icon registry. Each is omitted with its 16x16 footprint preserved and
 * recorded as a Stage 4 discrepancy. Nothing is drawn in their place.
 *
 * @fires sl-b-sesame-group-details-back - Emitted when the back link is activated.
 * @fires sl-b-sesame-group-details-edit-field - Emitted with the field id being edited.
 * @fires sl-b-sesame-group-details-archive-group - Emitted with the group id to archive.
 */
export class GroupDetailsSummary extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return { 'sl-button': Button, 'sl-card': Card, 'sl-icon': Icon };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The group's identity, its three detail rows, its linking code and whether it can be archived. */
  @property({ attribute: false }) model?: GroupSummaryModel;

  /** @internal Emits when the back link is activated. */
  @event({ name: 'sl-b-sesame-group-details-back' })
  backEvent!: EventEmitter<SlBSesameGroupDetailsBackEvent>;

  /** @internal Emits when an inline edit control is activated. */
  @event({ name: 'sl-b-sesame-group-details-edit-field' })
  editFieldEvent!: EventEmitter<SlBSesameGroupDetailsEditFieldEvent>;

  /** @internal Emits when the group is archived. */
  @event({ name: 'sl-b-sesame-group-details-archive-group' })
  archiveGroupEvent!: EventEmitter<SlBSesameGroupDetailsArchiveGroupEvent>;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html`${nothing}`;
    }

    return html`
      <!--
        A plain anchor, NOT sl-link. sl-link is a link-styled BUTTON: its :host paints
        "background: color-mix(..., --sl-color-background-secondary-bold, ...)", and only
        variant="primary" sets "--_bg-color: transparent" for ghost/outline fills, so every
        other variant keeps a solid block behind the text. The design draws a bare text link
        with no chrome, and the design system has no component for that.
      -->
      <a class="back" href="#" @click=${this.#onBackClick}>&lt; Back to Groups</a>

      <h1>Group details</h1>

      <div class="body">
        <dl class="details">
          ${model.fields.map(
            field => html`
              <div class="row">
                <div class="pair">
                  <dt>${field.label}</dt>
                  <dd>${field.value}</dd>
                </div>
                <sl-button
                  aria-label="Edit ${field.label}"
                  fill="outline"
                  shape="rect"
                  size="sm"
                  @click=${() => this.#onEditClick(field.id)}
                >
                  <!-- "pencil" is not in the theme's 54-icon registry. Omitted with its footprint
                       preserved; never hand-drawn. Recorded as a Stage 4 discrepancy. -->
                  <span aria-hidden="true" class="icon-omitted"></span>
                </sl-button>
              </div>
            `
          )}
        </dl>

        <div class="aside">
          ${model.canArchive
            ? html`
                <sl-button
                  class="archive"
                  fill="link"
                  size="md"
                  variant="danger"
                  @click=${this.#onArchiveClick}
                >
                  <!-- "archive" is not in the registry; same treatment as "pencil". -->
                  <span aria-hidden="true" class="icon-omitted"></span>
                  Archive group
                </sl-button>
              `
            : nothing}

          <sl-card class="linking-code">
            <div class="linking-code-heading">
              <!-- "key" is not in the registry; same treatment as "pencil". -->
              <span aria-hidden="true" class="icon-omitted"></span>
              <span>Linking code</span>
            </div>
            <p class="linking-code-value">${model.linkingCode}</p>
            <!-- Figma node 2142:48133 is a 249x40 EMPTY frame at the bottom of this card. It is
                 almost certainly a missing "Copy code" button, but inventing one would put
                 content in the visual diff that the reference does not have. Nothing rendered. -->
          </sl-card>
        </div>
      </div>
    `;
  }

  #onBackClick(event: Event): void {
    event.preventDefault();
    this.backEvent.emit();
  }

  #onEditClick(fieldId: GroupDetailFieldId): void {
    this.editFieldEvent.emit({ fieldId });
  }

  #onArchiveClick(): void {
    if (this.model) {
      this.archiveGroupEvent.emit({ groupId: this.model.groupId });
    }
  }
}
