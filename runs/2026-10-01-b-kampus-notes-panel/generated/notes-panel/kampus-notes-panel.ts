import '@sl-design-system/button/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/icon/register.js';
import { type Checkbox } from '@sl-design-system/checkbox';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './kampus-notes-panel.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-bknp-notes-close': SlBknpNotesCloseEvent;
    'sl-bknp-notes-see-all': SlBknpNotesSeeAllEvent;
    'sl-bknp-notes-filter-change': SlBknpNotesFilterChangeEvent;
    'sl-bknp-note-edit': SlBknpNoteEditEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-bknp-notes-panel': BknpNotesPanel;
  }
}

/** Whether a saved note is a plain note or a text highlight. */
export type BknpNoteKind = 'note' | 'highlight';

/** A single saved note or highlight. */
export interface NoteModel {
  /** Stable identifier, used for the edit event and the `key` of the rendered `<li>`. */
  id: string;

  /** Whether this is a plain note or a highlighted text excerpt. */
  kind: BknpNoteKind;

  /** The highlighted source excerpt (only present when `kind` is `'highlight'`). */
  highlightText?: string;

  /** The note's free-text body (optional — a highlight may carry no added comment). */
  body?: string;

  /** The date the note was created, ISO-8601 (e.g. `'2020-10-14'`). */
  date: string;
}

/** A subchapter's group of notes, headed by a link back to that subchapter. */
export interface NoteGroupModel {
  /** Stable identifier of the subchapter this group belongs to. */
  subchapterId: string;

  /** The subchapter label shown as the group heading (e.g. `'1.7 Vastaa kysymyksiin'`). */
  label: string;

  /** The URL the group heading links to. */
  href: string;

  /** The notes/highlights saved against this subchapter. */
  notes: NoteModel[];
}

/** The data needed to render the notes side panel. */
export interface NotesPanelModel {
  /** The note groups, one per subchapter that has at least one saved note. */
  groups: NoteGroupModel[];
}

/** Emitted when the user closes the panel. */
export type SlBknpNotesCloseEvent = CustomEvent<void>;

/** Emitted when the user activates "See all". */
export type SlBknpNotesSeeAllEvent = CustomEvent<void>;

/** Emitted when the user changes either filter checkbox. */
export type SlBknpNotesFilterChangeEvent = CustomEvent<{ showHighlights: boolean; showNotes: boolean }>;

/** Emitted when the user activates a note's edit button. */
export type SlBknpNoteEditEvent = CustomEvent<{ noteId: string }>;

/** Formats a note's ISO date the way the design shows it ("14.10.2020"). */
const DATE_FORMAT = new Intl.DateTimeFormat('fi-FI', { day: '2-digit', month: '2-digit', year: 'numeric' });

/**
 * The 360px Notes side panel: a header ("Notes" / "See all" / close), a two-checkbox filter row
 * ("Highlights" / "Notes"), and a scrolling list of note groups — a purple subchapter-link heading
 * followed by that subchapter's note/highlight cards. Presentational: the page passes in its
 * `model` and handles the four emitted events; filtering by kind happens locally so the checkbox
 * state has an immediate visible effect, but the authoritative "what counts as a highlight vs a
 * note" is still data the parent owns (`NoteModel.kind`).
 *
 * A note card is rendered inline as an `<li>` here, not as a child component — see the run's
 * IMPL-BRIEF.md: the row has no internal interactive complexity beyond a single edit button, so a
 * dedicated child would just add an extra shadow tree for a static block of text.
 *
 * ```html
 * <sl-bknp-notes-panel .model=${model}></sl-bknp-notes-panel>
 * ```
 *
 * @fires sl-bknp-notes-close - Emitted when the user closes the panel.
 * @fires sl-bknp-notes-see-all - Emitted when the user activates "See all".
 * @fires sl-bknp-notes-filter-change - Emitted when the user changes either filter checkbox.
 * @fires sl-bknp-note-edit - Emitted when the user activates a note's edit button.
 */
export class BknpNotesPanel extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The note groups this panel renders. */
  @property({ attribute: false }) model?: NotesPanelModel;

  /** @internal Whether highlight-kind notes are shown. */
  @state() private showHighlights = true;

  /** @internal Whether note-kind notes are shown. */
  @state() private showNotes = true;

  /** @internal Emits when the user closes the panel. */
  @event({ name: 'sl-bknp-notes-close' }) closeEvent!: EventEmitter<SlBknpNotesCloseEvent>;

  /** @internal Emits when the user activates "See all". */
  @event({ name: 'sl-bknp-notes-see-all' }) seeAllEvent!: EventEmitter<SlBknpNotesSeeAllEvent>;

  /** @internal Emits when the user changes either filter checkbox. */
  @event({ name: 'sl-bknp-notes-filter-change' })
  filterChangeEvent!: EventEmitter<SlBknpNotesFilterChangeEvent>;

  /** @internal Emits when the user activates a note's edit button. */
  @event({ name: 'sl-bknp-note-edit' }) noteEditEvent!: EventEmitter<SlBknpNoteEditEvent>;

  override render(): TemplateResult {
    const groups = this.model?.groups ?? [];

    const visibleGroups = groups
      .map(group => ({
        ...group,
        notes: group.notes.filter(note => this.#isVisible(note))
      }))
      .filter(group => group.notes.length > 0);

    return html`
      <div class="header">
        <h2 id="notes-heading">Notes</h2>
        <div class="header-actions">
          <sl-button fill="outline" variant="primary" @click=${this.#onSeeAll}>See all</sl-button>
          <sl-button aria-label="Close notes panel" fill="ghost" @click=${this.#onClose}>
            <sl-icon name="xmark"></sl-icon>
          </sl-button>
        </div>
      </div>

      <div class="filters">
        <sl-checkbox ?checked=${this.showHighlights} @sl-change=${this.#onHighlightsChange}>
          Highlights
        </sl-checkbox>
        <sl-checkbox ?checked=${this.showNotes} @sl-change=${this.#onNotesChange}>Notes</sl-checkbox>
      </div>

      <div class="content" tabindex="0" aria-label="Saved notes and highlights">
        ${visibleGroups.map(group => this.#renderGroup(group))}
      </div>
    `;
  }

  #renderGroup(group: NoteGroupModel): TemplateResult {
    return html`
      <section>
        <h3><a class="group-link" href=${group.href}>${group.label}</a></h3>
        <ul>
          ${group.notes.map(note => this.#renderNote(note))}
        </ul>
      </section>
    `;
  }

  #renderNote(note: NoteModel): TemplateResult {
    return html`
      <li class="card">
        <sl-button
          aria-label=${`Edit note: ${this.#excerpt(note)}`}
          class="edit"
          fill="ghost"
          size="sm"
          @click=${() => this.#onEdit(note)}
        ></sl-button>
        ${note.kind === 'highlight'
          ? html`<p class="highlight-line"><mark>${note.highlightText}</mark></p>`
          : nothing}
        ${note.body ? html`<p class="body">${note.body}</p>` : nothing}
        <time class="date" datetime=${note.date}>${DATE_FORMAT.format(new Date(note.date))}</time>
      </li>
    `;
  }

  /** A short excerpt used to give each "Edit" button a distinguishing accessible name. */
  #excerpt(note: NoteModel): string {
    const text = note.body ?? note.highlightText ?? '';
    return text.length > 30 ? `${text.slice(0, 30)}…` : text;
  }

  #isVisible(note: NoteModel): boolean {
    return (note.kind === 'highlight' && this.showHighlights) || (note.kind === 'note' && this.showNotes);
  }

  #onClose(): void {
    this.closeEvent.emit();
  }

  #onSeeAll(): void {
    this.seeAllEvent.emit();
  }

  #onEdit(note: NoteModel): void {
    this.noteEditEvent.emit({ noteId: note.id });
  }

  #onHighlightsChange(event: Event & { target: Checkbox }): void {
    this.showHighlights = !!event.target.checked;
    this.filterChangeEvent.emit({ showHighlights: this.showHighlights, showNotes: this.showNotes });
  }

  #onNotesChange(event: Event & { target: Checkbox }): void {
    this.showNotes = !!event.target.checked;
    this.filterChangeEvent.emit({ showHighlights: this.showHighlights, showNotes: this.showNotes });
  }
}

// This run prefixes every tag/event it mints with `sl-bknp-` (see IMPL-BRIEF.md's resume
// addendum) to avoid colliding with the sibling A1 run, which decomposed the same shared page
// chrome from the same Figma file. Guarded global define — no `ScopedElementsMixin` (see the
// brief: a scoped registry silently renders an unlisted tag as an inert unknown element).
if (!customElements.get('sl-bknp-notes-panel')) {
  customElements.define('sl-bknp-notes-panel', BknpNotesPanel);
}
