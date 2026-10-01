import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
// Bare import for the side effect only: the child's guarded `customElements.define` runs when the
// module body executes. A `import { type X } from './x.js'` is erased and registers nothing — and
// so is a value import whose binding is used only in a type position.
import './avatar-cluster/a3mp-avatar-cluster.js';
import { type AvatarClusterModel } from './avatar-cluster/a3mp-avatar-cluster.js';
import styles from './a3mp-chapter-header-card.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a3mp-chapter-header-action': SlA3mpChapterHeaderActionEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-a3mp-chapter-header': A3mpChapterHeader;
  }
}

/** Emitted when one of the header's two action buttons is activated. */
export type SlA3mpChapterHeaderActionEvent = CustomEvent<{ actionId: string }>;

/** One of the two action buttons drawn at the top right of the header card. */
export interface ChapterHeaderAction {
  /** Stable key, e.g. `'digiboardware'`. */
  id: string;
  /** The label as drawn. */
  label: string;
  /** Whether the button is the solid primary one. */
  primary: boolean;
}

/** The data the header card renders; owned by the page. */
export interface ChapterHeaderModel {
  /** The method title, e.g. `'Reken Maar! 4'`. */
  title: string;
  /** The publisher line, e.g. `'Uitgeverij VAN IN'`. */
  publisher: string;
  /** The method code line, e.g. `'LO-J4'`. */
  methodCode: string;
  /** Path to the cover image. There is no asset-export step, so this 404s by design. */
  coverSrc: string;
  /** Alt text for the cover image. */
  coverAlt: string;
  /** The two action buttons, in display order. */
  actions: ChapterHeaderAction[];
  /** The authorship clusters below the divider, in display order. */
  clusters: AvatarClusterModel[];
}

/**
 * The book/method header card: cover image, title block, two actions, and a row of authorship
 * avatar clusters below a divider. Presentational — the page owns the model.
 *
 * ```html
 * <sl-a3mp-chapter-header .model=${header}></sl-a3mp-chapter-header>
 * ```
 *
 * @fires sl-a3mp-chapter-header-action - Emitted with the activated action's id.
 */
export class A3mpChapterHeader extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when an action button is activated. */
  @event({ name: 'sl-a3mp-chapter-header-action' })
  chapterHeaderActionEvent!: EventEmitter<SlA3mpChapterHeaderActionEvent>;

  /**
   * The header card's content.
   *
   * @default undefined
   */
  @property({ attribute: false }) model?: ChapterHeaderModel;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html``;
    }

    return html`
      <div class="card">
        <!-- The cover and the right-hand column sit side by side, and the divider plus the
             authorship clusters live INSIDE that right column — not below the whole row. The
             Figma frame makes this explicit: "Frame 467" is 1120x208 and contains the 156x208
             cover beside "Frame 15495" (948x208), which itself holds the title block, the divider
             and the clusters. Stacking them below the cover instead made the card 307px tall
             against the drawn 232px (208 cover + 16 gap + 1 rule + 16 gap + 66 clusters). -->
        <img alt=${model.coverAlt} class="cover" height="208" src=${model.coverSrc} width="156" />
        <div class="column">
          <div class="details">
            <div class="titles">
              <h1>${model.title}</h1>
              <p class="publisher">${model.publisher}</p>
              <p class="method-code">${model.methodCode}</p>
            </div>
            <div class="actions">
              ${model.actions.map(
                action => html`
                  <sl-button
                    fill=${action.primary ? 'solid' : 'outline'}
                    variant=${action.primary ? 'primary' : 'default'}
                    @click=${() => this.chapterHeaderActionEvent.emit({ actionId: action.id })}>
                    <!-- Icons omitted: the design draws 'presentation-screen' on the primary
                         button and 'arrow-right' on the secondary. Only 'arrow-right' is among
                         the 34 names bingel-int registers. -->
                    ${action.primary
                      ? html`<span aria-hidden="true" class="btn-icon"></span>`
                      : ''}${action.label}${action.primary
                      ? ''
                      : html`<sl-icon name="arrow-right" size="md"></sl-icon>`}
                  </sl-button>
                `
              )}
            </div>
          </div>
          <hr />
          <div class="clusters">
            ${model.clusters.map(
              cluster => html`<sl-a3mp-avatar-cluster .model=${cluster}></sl-a3mp-avatar-cluster>`
            )}
          </div>
        </div>
      </div>
    `;
  }
}

// Guarded global registration.
if (!customElements.get('sl-a3mp-chapter-header')) {
  customElements.define('sl-a3mp-chapter-header', A3mpChapterHeader);
}
