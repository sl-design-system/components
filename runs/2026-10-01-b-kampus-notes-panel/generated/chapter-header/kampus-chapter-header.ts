import '@sl-design-system/breadcrumbs/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/switch/register.js';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type Switch } from '@sl-design-system/switch';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './kampus-chapter-header.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-bknp-chapter-navigate': SlBknpChapterNavigateEvent;
    'sl-bknp-chapter-actions': SlBknpChapterActionsEvent;
    'sl-bknp-student-view-change': SlBknpStudentViewChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-bknp-chapter-header': BknpChapterHeader;
  }
}

/** A single crumb in the chapter header's breadcrumb trail. */
export interface BknpBreadcrumb {
  /** The visible text of the crumb. */
  label: string;

  /** The link target; omitted on the current (last, non-link) crumb. */
  href?: string;
}

/** The data this component needs to render the chapter header. */
export interface ChapterHeaderModel {
  /** The breadcrumb trail, ending with the current (non-link) chapter. */
  breadcrumbs: BknpBreadcrumb[];

  /** The chapter title, rendered as the page's `<h1>`. */
  title: string;

  /** The permalink URL for the "copy link" action next to the title. */
  permalinkHref: string;

  /** The previous chapter's URL; when absent, the "previous" button is disabled. */
  previousHref?: string;

  /** The next chapter's URL; when absent, the "next" button is disabled. */
  nextHref?: string;
}

/** Emitted when the user activates the previous/next chapter button. */
export type SlBknpChapterNavigateEvent = CustomEvent<{ direction: 'previous' | 'next' }>;

/** Emitted when the user activates the chapter actions ("...") button. */
export type SlBknpChapterActionsEvent = CustomEvent<void>;

/** Emitted when the user toggles "Student view". */
export type SlBknpStudentViewChangeEvent = CustomEvent<{ studentView: boolean }>;

/**
 * The chapter header at the top of the Kampus notes panel's content column: a breadcrumb trail
 * with previous/next chapter navigation, the chapter title with its link/actions buttons, and
 * the "Student view" toggle.
 *
 * This is a presentational component: it receives its `model` from the data-owning
 * `sl-bknp-chapter-page` and emits an event per interaction instead of navigating or fetching
 * anything itself.
 *
 * ```html
 * <sl-bknp-chapter-header .model=${model}></sl-bknp-chapter-header>
 * ```
 *
 * @fires sl-bknp-chapter-navigate - Emitted when the user activates the previous/next chapter button.
 * @fires sl-bknp-chapter-actions - Emitted when the user activates the chapter actions ("...") button.
 * @fires sl-bknp-student-view-change - Emitted when the user toggles "Student view".
 */
export class BknpChapterHeader extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The breadcrumb trail, title and navigation targets this header renders. */
  @property({ attribute: false }) model?: ChapterHeaderModel;

  /**
   * Whether "Student view" is switched on.
   *
   * @default false
   */
  @property({ type: Boolean, attribute: 'student-view', reflect: true }) studentView = false;

  /** @internal Emits when the user activates the previous/next chapter button. */
  @event({ name: 'sl-bknp-chapter-navigate' }) chapterNavigateEvent!: EventEmitter<SlBknpChapterNavigateEvent>;

  /** @internal Emits when the user activates the chapter actions ("...") button. */
  @event({ name: 'sl-bknp-chapter-actions' }) chapterActionsEvent!: EventEmitter<SlBknpChapterActionsEvent>;

  /** @internal Emits when the user toggles "Student view". */
  @event({ name: 'sl-bknp-student-view-change' }) studentViewChangeEvent!: EventEmitter<SlBknpStudentViewChangeEvent>;

  override render(): TemplateResult {
    if (!this.model) {
      return html`${nothing}`;
    }

    const { breadcrumbs, title, permalinkHref, previousHref, nextHref } = this.model;

    return html`
      <div class="breadcrumb-row">
        <sl-breadcrumbs no-home>
          ${breadcrumbs.map(
            crumb => html`<a href=${ifDefined(crumb.href)}>${crumb.label}</a>`
          )}
        </sl-breadcrumbs>
        <div class="nav-buttons">
          <sl-button
            aria-label="Previous chapter"
            class="nav-button"
            fill="solid"
            shape="pill"
            variant="primary"
            ?disabled=${!previousHref}
            @click=${() => this.#onNavigate('previous')}>
            <sl-icon name="chevron-left"></sl-icon>
          </sl-button>
          <sl-button
            aria-label="Next chapter"
            class="nav-button"
            fill="solid"
            shape="pill"
            variant="primary"
            ?disabled=${!nextHref}
            @click=${() => this.#onNavigate('next')}>
            <sl-icon name="chevron-right"></sl-icon>
          </sl-button>
        </div>
      </div>

      <div class="title-row">
        <h1>${title}</h1>
        <!--
          The design shows a link/chain glyph here, but the kampus theme's 55-icon set has no
          matching icon - left out per the brief rather than hand-drawn. The link itself (and its
          accessible name) is still rendered, at the same footprint as the actions button below.
        -->
        <a aria-label="Copy chapter link" class="icon-button permalink" href=${permalinkHref}></a>
        <sl-button
          aria-label="Chapter actions"
          class="icon-button"
          fill="ghost"
          size="sm"
          variant="primary"
          @click=${this.#onActions}>
          <sl-icon name="ellipsis"></sl-icon>
        </sl-button>
      </div>

      <div class="student-view-row">
        <sl-switch
          ?checked=${this.studentView}
          @sl-change=${this.#onStudentViewChange}
          reverse
          size="sm">
          Student view
        </sl-switch>
      </div>
    `;
  }

  #onNavigate(direction: 'previous' | 'next'): void {
    this.chapterNavigateEvent.emit({ direction });
  }

  #onActions(): void {
    this.chapterActionsEvent.emit();
  }

  // Note: `sl-switch`'s default (non-`reverse`) grid-template places the label column first and
  // the toggle column second ([part='wrapper'] before [part='toggle'] in `'wrapper toggle' / 1fr
  // auto`) - i.e. the default is label-left/control-right. The design wants the control on the
  // left and the label on the right, which is what `reverse` actually produces here (its own
  // JSDoc: "the toggle is shown before the label" when set).
  #onStudentViewChange(event: Event & { target: Switch }): void {
    this.studentView = !!event.target.checked;
    this.studentViewChangeEvent.emit({ studentView: this.studentView });
  }
}

// Guarded global define — this run mints `sl-bknp-*` tags; see the resume addendum
// in IMPL-BRIEF.md for why (a sibling run already minted an unprefixed/differently
// prefixed set of tags from the same Figma file).
if (!customElements.get('sl-bknp-chapter-header')) {
  customElements.define('sl-bknp-chapter-header', BknpChapterHeader);
}
