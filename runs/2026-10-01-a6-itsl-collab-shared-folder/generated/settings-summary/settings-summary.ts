import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './settings-summary.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a6-settings-edit': SlA6SettingsEditEvent;
  }
}

/** Whether students can see the folder. */
export type SettingsVisibility = 'visible' | 'hidden';

/** The data this component renders; owned/fetched by the page. */
export interface SettingsSummaryModel {
  visibility: SettingsVisibility;
  /** ISO 8601 instant; this component formats it. */
  closingDate?: string;
  assignedParticipantCount: number;
  assignedGroupNames: string[];
  toolNames: string[];
}

export type SlA6SettingsEditEvent = CustomEvent<void>;

/**
 * The sentence drawn for each visibility state, keyed off the stable `visibility` value.
 * Structure, not data — the model carries the key and this component owns the wording.
 */
const VISIBILITY_LABEL: Record<SettingsVisibility, string> = {
  visible: 'Visible to students',
  hidden: 'Hidden from students'
};

/**
 * Explicit `en-GB` so the output does not drift with the ambient locale. The design's exact
 * string is `May 30, 2025 23:00`; `en-GB` with these options gives `30 May 2025 23:00`, so the
 * day/month order differs from the reference by design-locale choice rather than by accident.
 * Pinning the locale is still right: an unpinned formatter would differ per machine.
 */
const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

/**
 * Figma `settings summary` `4994:15549`, 400 x 358 — the sidebar card summarising how the shared
 * folder is configured: visibility, closing date, who it is assigned to, which tools it accepts,
 * and an Edit action.
 *
 * Presentational — the page owns the `model`.
 *
 * **Neither `sl-panel` nor `sl-card`.** `sl-panel` is a *collapsible* container (a toggle button,
 * `role="region"`, an `inert` body, an `sl-tool-bar` header, an `sl-toggle` event) and this card
 * does not collapse; `sl-card` is a *media* card (a `<figure>`/media slot, a resize observer,
 * line-clamp math, and a click handler that forwards clicks onto a title-slot `<a>`). Both would
 * drag their machinery in for what is a 1px border and some padding, so the container is written
 * here.
 *
 * The heading is an `<h2>` because the design says so: the a11y annotation `4571:8205` from the
 * A11y Annotation Kit points at "Settings summary" and marks it **H2**.
 *
 * ```html
 * <sl-a6-settings-summary .model=${model}></sl-a6-settings-summary>
 * ```
 *
 * @fires sl-a6-settings-edit - Emitted when the Edit button is activated.
 */
export class A6SettingsSummary extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** How the folder is configured. */
  @property({ attribute: false }) model?: SettingsSummaryModel;

  /** @internal Emits when the Edit button is activated. */
  @event({ name: 'sl-a6-settings-edit' })
  editEvent!: EventEmitter<SlA6SettingsEditEvent>;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html`<h2>Settings summary</h2>`;
    }

    const groups = model.assignedGroupNames.join(', '),
      assigned = groups
        ? `Assigned to ${model.assignedParticipantCount} participants + ${groups}`
        : `Assigned to ${model.assignedParticipantCount} participants`;

    return html`
      <h2>Settings summary</h2>

      <!-- 'eye' IS registered in this theme. -->
      ${this.#row(html`<sl-icon name="eye"></sl-icon>`, VISIBILITY_LABEL[model.visibility])}

      <!-- Figma calls this glyph 'timer'; the theme registers the same concept as 'clock'. -->
      ${model.closingDate
        ? this.#row(
            html`<sl-icon name="clock"></sl-icon>`,
            `Closing date: ${DATE_FORMAT.format(new Date(model.closingDate))}`
          )
        : nothing}

      <!--
        'users' is NOT registered in this theme, so the glyph is omitted rather than substituted
        with a different registered icon. The 24px box is kept so the 8px gap and the label's
        x-offset are unchanged.
      -->
      ${this.#row(nothing, assigned)}

      <div class="tools">
        <!-- 'pen-ruler' is NOT registered either; same treatment. -->
        ${this.#row(nothing, 'Tools')}
        <div class="details">
          <ul>
            <!--
              ONE <li>: the design draws exactly one bullet marker, so the tool names are joined
              rather than listed separately.
            -->
            <li>${model.toolNames.join(', ')}</li>
          </ul>
        </div>
      </div>

      <div class="actions">
        <sl-button @click=${this.#onEditClick} class="edit" fill="outline">Edit</sl-button>
      </div>
    `;
  }

  #row(icon: TemplateResult | typeof nothing, label: string): TemplateResult {
    return html`
      <div class="row">
        <span aria-hidden="true" class="row-icon">${icon}</span>
        <span class="row-label">${label}</span>
      </div>
    `;
  }

  #onEditClick(): void {
    this.editEvent.emit();
  }
}
