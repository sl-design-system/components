import { faCopy } from '@fortawesome/pro-regular-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './copy-button.css' with { type: 'css' };

Icon.register(faCopy);

export class CopyButton extends ScopedElementsMixin(Button) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = [Button.styles, styles];

  /** Cleanup function for the lazy tooltip. */
  #cleanupTooltip?: () => void;

  /** The DOM id of the element whose text content should be copied. */
  @property() target?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    this.fill ??= 'ghost';
    this.addEventListener('click', this.#onClick);

    this.#cleanupTooltip = Tooltip.lazy(this, tooltip => {
      tooltip.textContent = 'Copy';
    });
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.#onClick);
    this.#cleanupTooltip?.();

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`<sl-icon name="far-copy"></sl-icon>`;
  }

  #onClick = async (): Promise<void> => {
    if (!this.target) {
      return;
    }

    const el = document.getElementById(this.target);
    if (el) {
      await navigator.clipboard.writeText(el.textContent?.trim() ?? '');
    }
  };
}
