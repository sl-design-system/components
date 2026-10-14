import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './segmented-control-item.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-segmented-control-item': SegmentedControlItem;
  }
}

/**
 * A single option in an `sl-segmented-control`. Put an `sl-icon` in the `icon` slot to show an icon
 * before the label. Put a second `sl-icon` in the `selected-icon` slot to show a different icon
 * (usually the solid variant) when the option is selected, just like `sl-toggle-button`.
 *
 * ```html
 * <sl-segmented-control-item value="list">
 *   <sl-icon name="far-list" slot="icon"></sl-icon>
 *   <sl-icon name="fas-list" slot="selected-icon"></sl-icon>
 *   List
 * </sl-segmented-control-item>
 * ```
 *
 * @slot default - The label of the option.
 * @slot icon - The icon shown before the label.
 * @slot selected-icon - The icon shown instead of the `icon` when the option is selected.
 */
export class SegmentedControlItem extends LitElement {
  /** @internal */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Whether the option is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** @internal Set by the segmented control. */
  @property({ reflect: true }) emphasis?: 'subtle' | 'bold';

  /** @internal Whether there is an icon in the `selected-icon` slot. */
  @state() hasSelectedIcon = false;

  /** @internal Set by the segmented control; hides the label and uses it as the accessible name. */
  @property({ attribute: 'icon-only', type: Boolean, reflect: true }) iconOnly?: boolean;

  /** @internal The visible text of the option. */
  @state() label = '';

  /** @internal Set by the segmented control on the previously selected option, to animate it out. */
  @property({ type: Boolean, reflect: true }) leaving?: boolean;

  /** @internal Set by the segmented control on the selected option. */
  @property({ type: Boolean, reflect: true }) selected?: boolean;

  /** @internal Set by the segmented control. */
  @property({ reflect: true }) shape?: 'pill' | 'rect';

  /** @internal Set by the segmented control. */
  @property({ reflect: true }) size?: 'md' | 'lg';

  /** The value of the option. */
  @property() value?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'listitem');
  }

  override render(): TemplateResult {
    return html`
      <button
        ?disabled=${this.disabled}
        aria-current=${this.selected ? 'true' : 'false'}
        aria-label=${this.iconOnly && this.label ? this.label : nothing}
        class=${this.hasSelectedIcon ? 'has-selected-icon' : nothing}
        part="button"
        type="button">
        <span class="fill"></span>
        <slot name="icon"></slot>
        <slot @slotchange=${this.#onSelectedIconSlotChange} name="selected-icon"></slot>
        <span class="label"><slot @slotchange=${this.#onLabelSlotChange}></slot></span>
      </button>
    `;
  }

  #onLabelSlotChange(): void {
    this.label = this.textContent?.trim() ?? '';
  }

  #onSelectedIconSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.hasSelectedIcon = event.target.assignedElements({ flatten: true }).length > 0;
  }
}
