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

  /** @internal The tooltip element. */
  @query('sl-tooltip') tooltip!: Tooltip;

  disconnectedCallback(): void {
    if (this.#setTimeoutId) {
      clearTimeout(this.#setTimeoutId);
      this.#setTimeoutId = undefined;
    }

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <sl-button @click=${this.#onClick} aria-labelledby="tooltip" ?disabled=${!this.content} fill="ghost">
        <sl-icon name="far-copy"></sl-icon>
      </sl-button>
      <sl-tooltip id="tooltip">${this.copyText}</sl-tooltip>
    `;
  }

  async #onClick() {
    await navigator.clipboard.writeText(this.content!);

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
  }
}
