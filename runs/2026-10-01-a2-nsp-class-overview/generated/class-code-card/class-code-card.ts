import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './class-code-card.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a2-class-code-copy': SlA2ClassCodeCopyEvent;
    'sl-a2-class-code-share': SlA2ClassCodeShareEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-a2-class-code-card': ClassCodeCard;
  }
}

/** Emitted when the "copy" action button is activated; the detail carries the current code. */
export type SlA2ClassCodeCopyEvent = CustomEvent<{ code: string }>;

/** Emitted when the "share" action button is activated; the detail carries the current code. */
export type SlA2ClassCodeShareEvent = CustomEvent<{ code: string }>;

/**
 * A small card showing the class's join code, with copy/share actions.
 *
 * This is a presentational component: the `code` is passed in by the data-owning page
 * (`<sl-a2-class-overview-page>`), which fetches the class record; this component never
 * fetches anything itself.
 *
 * ```html
 * <sl-a2-class-code-card code="D9981"></sl-a2-class-code-card>
 * ```
 *
 * @slot actions - The action buttons cluster. Defaults to copy/share icon buttons; replace or
 *   extend to add/remove actions.
 * @fires sl-a2-class-code-copy - Emitted when the copy button is activated.
 * @fires sl-a2-class-code-share - Emitted when the share button is activated.
 */
export class ClassCodeCard extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The class join code to display.
   *
   * @default ''
   */
  @property() code = '';

  /** @internal Emits when the copy button is activated. */
  @event({ name: 'sl-a2-class-code-copy' }) copyEvent!: EventEmitter<SlA2ClassCodeCopyEvent>;

  /** @internal Emits when the share button is activated. */
  @event({ name: 'sl-a2-class-code-share' }) shareEvent!: EventEmitter<SlA2ClassCodeShareEvent>;

  #onCopy(): void {
    this.copyEvent.emit({ code: this.code });
  }

  #onShare(): void {
    this.shareEvent.emit({ code: this.code });
  }

  override render(): TemplateResult {
    return html`
      <div role="group" aria-labelledby="title">
        <div class="text">
          <!--
            Figma binds this title's fill to "color/black" (#000000), not a semantic foreground
            token. Using --sl-color-foreground-bold (#222222) instead - the semantic token for
            bold body text - rather than hardcoding the raw black. Recorded deviation: #222222
            vs. the design's literal #000000.
          -->
          <p id="title" class="title">Class code</p>
          <p class="value">${this.code}</p>
        </div>
        <div class="actions">
          <slot name="actions">
            <!-- Code Connect gives "far-copy"; not registered in this theme's icons.ts (only 54
                 unprefixed names are), and the far- prefix needs @fortawesome/pro-regular-svg-icons,
                 which isn't installed. Rendered with no icon - the button keeps its 36x36
                 footprint and a real name, but is visually empty. Recorded Stage 4 discrepancy. -->
            <sl-button aria-label="Copy class code" fill="ghost" @click=${this.#onCopy}>
            </sl-button>
            <!-- Same gap for "far-share": not in this theme's icon set either. -->
            <sl-button aria-label="Share class code" fill="ghost" @click=${this.#onShare}>
            </sl-button>
          </slot>
        </div>
      </div>
    `;
  }
}

// This is the top-level element for this component, so - unlike its scoped `sl-button` child
// above - it registers itself globally, guarded so re-importing this module doesn't throw (it's
// rendered standalone here and also composed by the sibling `sl-a2-class-overview-page`).
if (!customElements.get('sl-a2-class-code-card')) {
  customElements.define('sl-a2-class-code-card', ClassCodeCard);
}
