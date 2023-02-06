import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Placement } from '../popover/utils/position-anchored-element.js';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { AnchoredPopoverMixin } from '../popover/mixins/anchored-popover.js';
import { popoverMixinStyles } from '../popover/mixins/popover.js';
import { EventsController } from '../utils/controllers/index.js';
import styles from './select-overlay.scss.js';

export class SelectOverlay extends AnchoredPopoverMixin(LitElement) {
  /** @private */
  static override styles: CSSResultGroup = [popoverMixinStyles, styles];

  /** Tooltip placement. */
  @property() placement: Placement = 'bottom-start';

  #events = new EventsController(this);

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('popover', 'manual');
    this.setAttribute('role', 'listbox');
    this.setAttribute('main-axis', '0');
    this.setAttribute('cross-axis', '0');

    this.#events.listen(document, 'click', this.#onHide, { capture: true });
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  show(target: HTMLElement): void {
    this.anchorElement = target;
    this.showPopover();
  }

  hide(): void {
    this.anchorElement = undefined;
    this.hidePopover();
  }

  #onHide = (): void => {
    this.anchorElement = undefined;
    this.hidePopover();
  };
}
