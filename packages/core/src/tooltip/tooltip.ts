import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import styles from './tooltip.scss.js';

const ENTER_EVENTS = ['pointerenter', 'focus'],
  LEAVE_EVENTS = ['pointerleave', 'blur', 'keydown', 'click'];

export class Tooltip extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  static lazy(target: Element, callback: (target: Tooltip) => void): void {
    const createTooltip = (): void => {
      const tooltip = document.createElement('sl-tooltip');
      callback(tooltip);
      target.parentNode!.insertBefore(tooltip, target.nextSibling);
      tooltip.show();

      // We only need to create the tooltip once, so ignore all future events.
      ENTER_EVENTS.forEach(eventName => target.removeEventListener(eventName, createTooltip));
    };

    LEAVE_EVENTS.forEach(eventName => target.addEventListener(eventName, createTooltip));
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }

  show(): void {
    console.log('show');
  }
}
