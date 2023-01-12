import type { CSSResultGroup, TemplateResult } from 'lit';
import type { SnackBarConfig } from './snack-bar-config.js';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { LitElement, html } from 'lit';
import styles from './snack-bar-overlay.scss.js';
import { SnackBarOverlay } from './snack-bar-overlay.js';

declare global {
  interface ShadowRoot {
    createElement: typeof document.createElement;
  }
}

export class SnackBarController extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-snack-bar-overlay': SnackBarOverlay
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** All the snacks currently on screen. */
  #snacks: SnackBarOverlay[] = [];

  #onShow = (event: CustomEvent<SnackBarConfig>): void => {
    // There should always be just a single controller instance in the document
    // Make sure this event does not propagate to any other instances
    event.preventDefault();
    event.stopImmediatePropagation();

    console.log('onShow in controller');
    if (!this.shadowRoot) {
      // This never happens, but just to satisfy typescript
      return;
    }

    const config = event.detail;
    // config.offset = this.#getNextSnackOffset(config.offset, config.spacing);

    // Use shadowRoot to create elements so the custom elements are scoped properly
    // See https://github.com/webcomponents/polyfills/tree/master/packages/scoped-custom-element-registry
    const snack = this.appendChild(this.shadowRoot.createElement('sl-snack-bar-overlay') as SnackBarOverlay);

    this.#addSnack(snack, config);

    // void snack.show(config);
  };

  #addSnack(snack: SnackBarOverlay, config: SnackBarConfig): void {
    this.#snacks = [...this.#snacks, snack];
    console.log(config);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    document.addEventListener('snack-bar-show', this.#onShow as EventListener);
  }

  override disconnectedCallback(): void {
    document.removeEventListener('snack-bar-show', this.#onShow as EventListener);

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html` <b>SnackBarController works</b> <sl-snack-bar-overlay></sl-snack-bar-overlay>`;
  }
}
