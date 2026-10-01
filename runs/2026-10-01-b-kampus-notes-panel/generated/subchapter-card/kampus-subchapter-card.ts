import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, type PropertyValues, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './kampus-subchapter-card.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-bknp-subchapter-actions': SlBknpSubchapterActionsEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-bknp-subchapter-card': BknpSubchapterCard;
  }
}

/** The data this component renders: a single subchapter's cover, title and availability. */
export interface SubchapterCardModel {
  /** The subchapter's stable identifier. */
  id: string;

  /** The subchapter's title, e.g. "Subchapter 1.0". */
  title: string;

  /** Where the card's primary link navigates to. Ignored (no link rendered) when `locked`. */
  href: string;

  /** The URL of the subchapter's cover photograph. */
  coverImageUrl: string;

  /** The accessible alternative text for the cover photograph. */
  coverImageAlt: string;

  /** Whether this subchapter is locked (not yet available to the student). */
  locked: boolean;
}

/** Emitted when the user activates the card's ellipsis ("more actions") button. */
export type SlBknpSubchapterActionsEvent = CustomEvent<{ subchapterId: string }>;

/**
 * A single subchapter cover card in the chapter's subchapter grid: a full-width cover
 * photograph, a title, and an overflow ("more actions") button.
 *
 * Presentational component - it receives its `model` from the data-owning root
 * (`sl-bknp-chapter-page`) and emits an event per action instead of navigating or fetching
 * anything itself.
 *
 * Renders a plain `<article>` rather than composing `sl-card`: `sl-card`'s `setTitle` only
 * inspects *direct* assigned elements and force-colours a slotted title link with an
 * `!important` rule, and the locked variant's dashed border + reduced opacity on the whole
 * surface is simpler to express on this component's own markup. See IMPL-BRIEF.md (A5).
 *
 * The root wraps each card in an `<li>` - this component does not emit list markup itself, so
 * it must never be placed directly inside a `<ul>`.
 *
 * ```html
 * <sl-bknp-subchapter-card .model=${model}></sl-bknp-subchapter-card>
 * ```
 *
 * @fires sl-bknp-subchapter-actions - Emitted when the user activates the ellipsis button.
 */
export class BknpSubchapterCard extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The subchapter this card renders. */
  @property({ attribute: false }) model?: SubchapterCardModel;

  /**
   * Whether this card renders its locked variant (dashed border, no shadow, reduced opacity,
   * grey title). Reflected so `:host([locked])` can drive the CSS variant; kept in sync with
   * `model.locked` in `willUpdate` rather than read from `model` directly in `render`, so the
   * selector is available before the first paint of a freshly-set model.
   *
   * @default false
   */
  @property({ type: Boolean, reflect: true }) locked = false;

  /** Emits when the user activates the ellipsis ("more actions") button. */
  @event({ name: 'sl-bknp-subchapter-actions' }) actionsEvent!: EventEmitter<SlBknpSubchapterActionsEvent>;

  protected override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('model') && this.model) {
      this.locked = this.model.locked;
    }
  }

  override render(): TemplateResult {
    if (!this.model) {
      return html`${nothing}`;
    }

    const { id, title, href, coverImageUrl, coverImageAlt, locked } = this.model;

    return html`
      <article>
        <a class="cover-link" href=${locked ? nothing : href} aria-disabled=${locked ? 'true' : nothing}>
          <!-- No asset-export step in this pipeline: coverImageUrl points at /assets/... and
               404s in this harness by design (recorded Stage 4 discrepancy). The <img> still
               renders with its real alt text; the CSS aspect-ratio keeps the box intact either
               way, so the 404 does not reflow the layout. -->
          <img class="cover" src=${coverImageUrl} alt=${coverImageAlt} />
          <h2 class="title">${title}</h2>
        </a>
        <sl-button
          class="actions"
          fill="ghost"
          aria-label="More actions for ${title}"
          ?disabled=${locked}
          @click=${() => this.#onActions(id)}
        >
          <sl-icon name="ellipsis"></sl-icon>
        </sl-button>
      </article>
    `;
  }

  #onActions(subchapterId: string): void {
    this.actionsEvent.emit({ subchapterId });
  }
}

// Guarded global define - this run mints `sl-bknp-*` tags; see the resume addendum in
// IMPL-BRIEF.md for why (a sibling run already minted components from the same shared Figma
// page chrome under different, unprefixed names).
if (!customElements.get('sl-bknp-subchapter-card')) {
  customElements.define('sl-bknp-subchapter-card', BknpSubchapterCard);
}
