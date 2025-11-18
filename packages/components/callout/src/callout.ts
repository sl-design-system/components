import { localized } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './callout.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-callout': Callout;
  }
}

export type CalloutSize = 'md' | 'lg';

export type CalloutVariant = 'info' | 'positive' | 'caution' | 'negative';

/**
 * A callout component for displaying additional information.
 * Meant to be used with actions and should not be shown/hidden dynamically in response to user actions (unlike the inline-message).
 * This means the callout should remain visible as part of the static page layout, rather than appearing or disappearing based on user interaction.
 * There is no aria role on this component as it is not meant to interrupt the user.
 *
 * @slot default - The body of the callout.
 * @slot icon - Icon shown on the left side of the component.
 * @slot title - Title content for the callout.
 */
@localized()
export class Callout extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal The name of the icon, depending on the variant. */
  get iconName(): string {
    switch (this.variant) {
      case 'positive':
        return 'circle-check-solid';
      case 'caution':
        return 'octagon-exclamation-solid';
      case 'negative':
        return 'diamond-exclamation-solid';
      default:
        return 'info';
    }
  }

  /** @internal If the title is missing, the content needs to be placed where the title should be. */
  @property({ type: Boolean, attribute: 'no-title', reflect: true }) noTitle = true;

  /**
   * The size of the callout.
   * @default md
   */
  @property({ reflect: true }) size?: CalloutSize;

  /**
   * The variant of the callout.
   * @default 'info'
   */
  @property({ reflect: true }) variant?: CalloutVariant;

  override render(): TemplateResult {
    return html`
      <div part="icon">
        <slot name="icon">
          <sl-icon .name=${this.iconName} size="md"></sl-icon>
        </slot>
      </div>
      <div part="title">
        <slot @slotchange=${this.#onTitleSlotChange} name="title"></slot>
      </div>
      <div part="content">
        <slot></slot>
      </div>
    `;
  }

  #onTitleSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.noTitle = !Array.from(event.target.assignedNodes({ flatten: true })).some(
      node => node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim()
    );
  }
}
