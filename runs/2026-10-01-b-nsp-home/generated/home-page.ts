import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
// One import per child module. These are VALUE imports, so each module body runs and its
// guarded `customElements.define` executes — the registration side effect is already covered;
// a separate `import './x.js'` line would be a duplicate.
import { ClassCard, type ClassCardModel } from './class-card/class-card.js';
import { DEFAULT_CLASSES, DEFAULT_NAV } from './demo-data.js';
import { PlaceholderBlock } from './placeholder-block/placeholder-block.js';
import { TopNav, type TopNavModel } from './top-nav/top-nav.js';
import styles from './home-page.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-nsp-home-page': HomePage;
  }

  interface GlobalEventHandlersEventMap {
    'sl-nsp-create-class': SlNspCreateClassEvent;
  }
}

/** The number of placeholder blocks in the "Task list" panel's default (fallback) content. */
const PLACEHOLDER_BLOCK_COUNT = 3;

export type SlNspCreateClassEvent = CustomEvent<void>;

/**
 * The NSP `home` teacher dashboard page: a top navigation bar, a "Classes" panel (a grid of class
 * cards plus a "Create class" action), and a "Task list" panel.
 *
 * This is the root/data-owning component: it holds the demo `classes` and `nav` data (in a real
 * app these would be fetched — see `./demo-data.ts` for where that call would go) and passes each
 * child its own slice as a single cohesive model object. It renders the whole design with no args.
 *
 * ```html
 * <sl-nsp-home-page></sl-nsp-home-page>
 * ```
 *
 * @slot task-list - The "Task list" panel's content. Falls back to the design's three
 *   `<sl-nsp-placeholder-block>` blueprint blocks.
 * @fires sl-nsp-create-class - Emitted when the "Create class" button is pressed.
 */
export class HomePage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      // These three must be listed even though each also registers itself globally:
      // ScopedElementsMixin gives this host its own registry, and a tag missing from
      // this map is NOT resolved against the global one — it renders as an inert
      // unknown element with no shadow root.
      'sl-nsp-class-card': ClassCard,
      'sl-nsp-placeholder-block': PlaceholderBlock,
      'sl-nsp-top-nav': TopNav
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when the "Create class" button is pressed. */
  @event({ name: 'sl-nsp-create-class' }) createClassEvent!: EventEmitter<SlNspCreateClassEvent>;

  /**
   * The classes rendered in the "Classes" grid, in display order.
   *
   * @default DEFAULT_CLASSES
   */
  @property({ attribute: false }) classes: ClassCardModel[] = [...DEFAULT_CLASSES];

  /**
   * The signed-in user, active nav link and search term shown in the top nav.
   *
   * @default DEFAULT_NAV
   */
  @property({ attribute: false }) nav: TopNavModel = DEFAULT_NAV;

  override render(): TemplateResult {
    return html`
      <sl-nsp-top-nav .model=${this.nav}></sl-nsp-top-nav>
      <div class="content">
        <section class="classes" aria-labelledby="classes-heading">
          <div class="section-header">
            <h2 id="classes-heading">Classes</h2>
            <sl-button fill="outline" variant="primary" @click=${this.#onCreateClass}>
              <sl-icon name="plus"></sl-icon>Create class
            </sl-button>
          </div>
          <ul class="card-grid">
            ${this.classes.map(
              cls => html`
                <li>
                  <sl-nsp-class-card .model=${cls}></sl-nsp-class-card>
                </li>
              `
            )}
          </ul>
        </section>
        <section class="tasks" aria-labelledby="tasks-heading">
          <h2 id="tasks-heading">Task list</h2>
          <ul class="task-list">
            <slot name="task-list">
              ${Array.from(
                { length: PLACEHOLDER_BLOCK_COUNT },
                () => html`
                  <li>
                    <sl-nsp-placeholder-block></sl-nsp-placeholder-block>
                  </li>
                `
              )}
            </slot>
          </ul>
        </section>
      </div>
    `;
  }

  #onCreateClass(): void {
    this.createClassEvent.emit();
  }
}

// This is the top-level element for this run's page, so — unlike its scoped `sl-button`/
// `sl-icon` children above — it registers itself globally, guarded so re-importing doesn't throw.
if (!customElements.get('sl-nsp-home-page')) {
  customElements.define('sl-nsp-home-page', HomePage);
}
