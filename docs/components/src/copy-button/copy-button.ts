import { faCopy } from '@fortawesome/pro-regular-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import styles from './copy-button.css' with { type: 'css' };

Icon.register(faCopy);

export class CopyButton extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = [Button.styles, styles];

  /** The ID of the timeout used to hide the tooltip. */
  #setTimeoutId?: number;

  /** @internal */
  @state() copyText = 'Copy';

  /** The content to be copied to the clipboard. */
  @property() content?: string;

  /** The fill style of the button. */
  @property() fill = 'ghost';

  /** The DOM id of the element whose text content should be copied. Only used when `content` is not set. */
  @property() target?: string;

  /** @internal The tooltip element. */
  @query('sl-tooltip') tooltip!: Tooltip;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'button');
    this.addEventListener('click', this.#onClick);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.#onClick);

    if (this.#setTimeoutId) {
      clearTimeout(this.#setTimeoutId);
      this.#setTimeoutId = undefined;
    }

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <sl-button aria-labelledby="tooltip" ?disabled=${!this.content && !this.target} fill=${this.fill}>
        <sl-icon name="far-copy"></sl-icon>
      </sl-button>
      <sl-tooltip id="tooltip">${this.copyText}</sl-tooltip>
    `;
  }

  #onClick = async () => {
    let text: string | undefined;

    if (this.content) {
      text = this.content;
    } else if (this.target) {
      text = document.getElementById(this.target)?.textContent?.trim();
    }

    if (!text) {
      return;
    }

    await navigator.clipboard.writeText(text);

    this.copyText = 'Copied!';
    await this.updateComplete;
    this.tooltip.showPopover();

    if (this.#setTimeoutId) {
      clearTimeout(this.#setTimeoutId);
    }

    this.#setTimeoutId = window.setTimeout(() => {
      this.tooltip.hidePopover();
      this.copyText = 'Copy';
      this.#setTimeoutId = undefined;
    }, 2000);
  };
}
