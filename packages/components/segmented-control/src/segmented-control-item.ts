import { isDevMode } from '@sl-design-system/shared/dev-mode.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
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
 * <sl-segmented-control value="list">
 *   <sl-segmented-control-item value="list">
 *     <sl-icon name="far-list" slot="icon"></sl-icon>
 *     <sl-icon name="fas-list" slot="selected-icon"></sl-icon>
 *     List
 *   </sl-segmented-control-item>
 *   <sl-segmented-control-item value="grid">Grid</sl-segmented-control-item>
 * </sl-segmented-control>
 * ```
 *
 * @slot default - The label of the option.
 * @slot icon - The icon shown before the label.
 * @slot selected-icon - The icon shown instead of the `icon` when the option is selected.
 */
export class SegmentedControlItem extends LitElement {
  /** Prevents repeating the same dev-mode warning every update. */
  #lastError?: string;

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Whether the option is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** @internal Whether there is an icon in the `icon` slot. */
  @state() hasIcon = false;

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

  /** @internal Whether the option is selected. Set by the segmented control. */
  @state() selected = false;

  /** @internal Set by the segmented control. */
  @property({ reflect: true }) shape?: 'pill' | 'rect';

  /** @internal Set by the segmented control. */
  @property({ reflect: true }) size?: 'md' | 'lg';

  /** The value of the option. */
  @property({ reflect: true }) value!: string;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'listitem');
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    if (isDevMode()) {
      // Wait for the slotchange events to fire before checking for errors.
      requestAnimationFrame(() => this.#validateIcons());
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (isDevMode()) {
      this.#validateIcons();
    }
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
        <slot @slotchange=${this.#onIconSlotChange} name="icon"></slot>
        <slot @slotchange=${this.#onSelectedIconSlotChange} name="selected-icon"></slot>
        <span class="label"><slot @slotchange=${this.#onLabelSlotChange}></slot></span>
      </button>
    `;
  }

  #iconName(slot: HTMLSlotElement): string | undefined {
    return slot.assignedElements({ flatten: true })[0]?.getAttribute('name') ?? undefined;
  }

  #onIconSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.hasIcon = event.target.assignedElements({ flatten: true }).length > 0;
  }

  #onLabelSlotChange(): void {
    this.label = this.textContent?.trim() ?? '';
  }

  #onSelectedIconSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.hasSelectedIcon = event.target.assignedElements({ flatten: true }).length > 0;
  }

  #validateIcons(): void {
    const iconSlot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="icon"]'),
      selectedIconSlot = this.renderRoot.querySelector<HTMLSlotElement>(
        'slot[name="selected-icon"]'
      ),
      iconName = iconSlot ? this.#iconName(iconSlot) : undefined,
      selectedIconName = selectedIconSlot ? this.#iconName(selectedIconSlot) : undefined;

    let message: string | undefined;

    if (this.iconOnly && !this.hasIcon) {
      message =
        'There needs to be an sl-icon in the "icon" slot for an icon-only segmented control item.';
    } else if (selectedIconName && !iconName) {
      message =
        'Do not use an sl-icon in the "selected-icon" slot without also setting an sl-icon in the "icon" slot.';
    } else if (iconName && selectedIconName && iconName === selectedIconName) {
      message = 'Do not use the same icon for both states of a segmented control item.';
    }

    if (!message) {
      this.#lastError = undefined;
    } else if (message !== this.#lastError) {
      console.error(message);
      this.#lastError = message;
    }
  }
}
