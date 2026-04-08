import { faCircleInfo } from '@fortawesome/pro-regular-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Popover } from '@sl-design-system/popover';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './infotip.scss.js';

Icon.register(faCircleInfo);

declare global {
  interface HTMLElementTagNameMap {
    'sl-infotip': Infotip;
  }
}

/**
 * An info icon button that triggers a popover showing slotted content.
 *
 * ```html
 * <sl-infotip>This is additional information.</sl-infotip>
 * ```
 *
 * @slot default - The content to display inside the infotip popover.
 */
export class Infotip extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-popover': Popover
    };
  }

  /** @internal */
  @query('sl-popover') popoverEl?: Popover;

  /**
   * The name of the icon to show in the trigger button.
   * @default far-circle-info
   */
  @property() icon = 'far-circle-info';

  /**
   * The maximum width of the infotip popover in pixels.
   */
  @property({ type: Number, attribute: 'max-width' }) maxWidth?: number;

  override render(): TemplateResult {
    return html`
      <sl-button id="trigger" aria-label="More information" fill="ghost" @click=${this.#onClick}>
        <sl-icon name=${this.icon}></sl-icon>
      </sl-button>
      <sl-popover anchor="trigger" position="top">
        <slot></slot>
      </sl-popover>
    `;
  }

  #onClick(): void {
    if (this.popoverEl?.matches(':popover-open')) {
      this.popoverEl.hidePopover();
    } else {
      this.popoverEl?.showPopover();
    }
  }
}
