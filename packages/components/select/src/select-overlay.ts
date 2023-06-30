import type { CSSResultGroup, TemplateResult } from 'lit';
import type { PopoverPosition } from '@sl-design-system/shared';
import { EventsController, popoverPolyfillStyles } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-overlay.scss.js';
import { Select } from './select.js';

export class SelectOverlay extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = [popoverPolyfillStyles, styles];

  /** Tooltip position. */
  @property() position: PopoverPosition = 'bottom-start';

  #events = new EventsController(this);

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('popover', 'manual');
    this.setAttribute('role', 'listbox');
    this.setAttribute('main-axis', '0');
    this.setAttribute('cross-axis', '0');

    this.#events.listen(document, 'click', e => this.hide(e.target), { capture: true });
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  show(target: HTMLElement): void {
    this.anchorElement = target;
    super.showPopover();
  }

  hide(target: EventTarget | null): void {
    if (!(target instanceof Select)) {
      this.anchorElement = undefined;
      super.hidePopover();
    }
  }
}
