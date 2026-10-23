import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Option, Select } from '@sl-design-system/select';
import { type EventEmitter, RovingTabindexController, event } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { OverflowController } from './overflow-controller.js';
import { SegmentedControlItem } from './segmented-control-item.js';
import styles from './segmented-control.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-segmented-control': SegmentedControl;
  }
}

export type SegmentedControlEmphasis = 'subtle' | 'bold';
export type SegmentedControlFill = 'outline' | 'solid';
export type SegmentedControlShape = 'pill' | 'rect';
export type SegmentedControlSize = 'md' | 'lg';

/**
 * A segmented control lets the user switch between a small number of related options, for example a
 * "List" and a "Grid" view. Each option is an `sl-segmented-control-item`; give the control a
 * `value` and it will select the matching option. When no value is set, the first option that is
 * not `aria-disabled` is selected. The selected option has `aria-current="true"`, all others
 * `aria-current="false"`.
 *
 * Use `aria-disabled="true"` on an item to make it unavailable while keeping it focusable.
 *
 * ```html
 * <sl-segmented-control aria-label="View" value="grid">
 *   <sl-segmented-control-item value="list">List</sl-segmented-control-item>
 *   <sl-segmented-control-item value="grid">Grid</sl-segmented-control-item>
 * </sl-segmented-control>
 * ```
 *
 * When there is not enough space to show all options, the control renders an `sl-select` with the
 * same options instead. It switches back to the options as soon as they fit again.
 *
 * Give the control an accessible name using `aria-label` or `aria-labelledby` on the host element.
 * The name should explain what the control changes, such as "View" or "Sort by".
 *
 * The control is a single tab stop; use the left and right arrow keys to move between options.
 *
 * @slot default - The `sl-segmented-control-item` elements.
 * @csspart select - The `sl-select` that is shown when the options don't fit. Use it to change the
 *   width of the select, for example to let it fill the full width of the control.
 */
export class SegmentedControl extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-option': Option,
      'sl-select': Select
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Used for the `measuring` and `overflowing` custom states. */
  #internals = this.attachInternals();

  /** Refreshes the accessible name when `aria-label`, `aria-labelledby` or the label text changes. */
  #labelObserver = new MutationObserver(() => {
    this.#updateLabelReference();
    this.requestUpdate();
  });

  /** Detects whether the options fit. If not, a select is shown instead. */
  #overflow = new OverflowController(this, this.#internals);

  /** Keeps the fallback select in sync when an option's disabled state or label changes. */
  #itemObserver = new MutationObserver(() => this.requestUpdate());

  /** The previously selected option, so its fill can animate out. */
  #previousItem?: SegmentedControlItem;

  /** Retry selection reconciliation after leaving the select fallback. */
  #selectionRetryFrame?: number;

  /** How many times we've retried selection reconciliation after leaving the select fallback. */
  #selectionRetryAttempts = 0;

  /** Manage keyboard navigation between the options. */
  #rovingTabindexController = new RovingTabindexController<SegmentedControlItem>(this, {
    direction: 'horizontal',
    elements: () => this.items,
    focusInIndex: (elements: SegmentedControlItem[]) => {
      const selected = elements.findIndex(el => el.selected);

      return selected === -1 ? elements.findIndex(() => true) : selected;
    },
    isFocusableElement: () => true
  });

  /** Whether the last render showed the select. */
  #showsSelect = false;

  /** @internal Emits when the selected option changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<string>>;

  /**
   * The emphasis of the selected option. `subtle` uses a light background with an underline, `bold`
   * uses a strong background.
   *
   * @default 'subtle'
   */
  @property({ reflect: true }) emphasis: SegmentedControlEmphasis = 'subtle';

  /**
   * The fill of the control. In the `outline` fill the control has a border, in the `solid` fill it
   * has a background.
   *
   * @default 'solid'
   */
  @property({ reflect: true }) fill: SegmentedControlFill = 'solid';

  /** Whether the segmented control should hide option labels and render only icons. */
  @property({ attribute: 'icon-only', type: Boolean, reflect: true }) iconOnly = false;

  /** @internal The options of the control. */
  @state() items: SegmentedControlItem[] = [];

  /** @internal The accessible name resolved from `aria-labelledby`, if set. */
  @state() labelFromReference?: string;

  /** The value of the selected option. */
  @property({ reflect: true }) value?: string;

  /** @internal The selected option. */
  @state() selectedItem?: SegmentedControlItem;

  /**
   * The shape of the control.
   *
   * @default 'rect'
   */
  @property({ reflect: true }) shape: SegmentedControlShape = 'rect';

  /**
   * The size of the control.
   *
   * @default 'md'
   */
  @property({ reflect: true }) size: SegmentedControlSize = 'md';

  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('click', this.#onClick);
    this.#observeItems();
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.#onClick);
    this.#itemObserver.disconnect();
    this.#labelObserver.disconnect();

    if (this.#selectionRetryFrame !== undefined) {
      cancelAnimationFrame(this.#selectionRetryFrame);
      this.#selectionRetryFrame = undefined;
    }

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('value') || changes.has('items')) {
      const value = this.#requestedValue(),
        selectedItem = this.#resolveSelectedItem(value);

      if (selectedItem !== this.selectedItem) {
        // Only animate the old fill out when the options are visible.
        this.#previousItem = this.#overflow.overflowing ? undefined : this.selectedItem;
        this.selectedItem = selectedItem;
      }

      if (selectedItem && selectedItem.value !== this.value) {
        this.value = selectedItem?.value;
      }
    }

    this.#updateLabelReference();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (this.#showsSelect !== this.#overflow.overflowing) {
      this.#showsSelect = this.#overflow.overflowing;

      if (this.#showsSelect) {
        this.#previousItem = undefined;
      } else if (this.#selectionRetryFrame === undefined) {
        this.#selectionRetryAttempts = 0;

        const retry = (): void => {
          this.#selectionRetryFrame = requestAnimationFrame(() => {
            this.#selectionRetryFrame = undefined;

            if (!this.isConnected || this.#overflow.overflowing) {
              return;
            }

            const value = this.#requestedValue(),
              selectedItem = this.#resolveSelectedItem(value);

            if (selectedItem !== this.selectedItem) {
              this.selectedItem = selectedItem;
            }

            if (
              value !== undefined &&
              selectedItem?.value !== value &&
              this.#selectionRetryAttempts < 5
            ) {
              this.#selectionRetryAttempts += 1;
              retry();
            }
          });
        };

        retry();
      }
    }

    if (!this.#overflow.overflowing) {
      const selectedItem = this.#resolveSelectedItem();

      if (selectedItem !== this.selectedItem) {
        this.selectedItem = selectedItem;
      }
    }

    this.items.forEach(item => {
      item.emphasis = this.emphasis;
      item.iconOnly = this.iconOnly;
      // Only the options that change state animate their fill in or out.
      item.entering = item === this.selectedItem && this.#previousItem !== undefined;
      item.leaving = item === this.#previousItem;
      item.selected = item === this.selectedItem;
      item.shape = this.shape;
      item.size = this.size;
    });

    if (changes.has('items')) {
      this.#rovingTabindexController.clearElementCache();
    }
  }

  override render(): TemplateResult {
    const label = this.ariaLabel ?? this.labelFromReference,
      overflowing = this.#overflow.overflowing;

    return html`
      <div class="content">
        <div class="track">
          <div
            ?inert=${overflowing}
            aria-hidden=${ifDefined(overflowing ? 'true' : undefined)}
            aria-label=${ifDefined(overflowing ? undefined : (label ?? undefined))}
            class="list"
            role="list">
            <slot @slotchange=${this.#onSlotChange}></slot>
          </div>
        </div>
        ${
          overflowing
            ? html`
                <sl-select
                  @sl-change=${this.#onSelectChange}
                  @sl-form-control=${this.#onSelectFormControl}
                  .value=${this.#requestedValue()}
                  aria-label=${ifDefined(label ?? undefined)}
                  part="select"
                  shape=${this.shape}
                  size=${this.size}>
                  ${repeat(
                    this.items,
                    item => item,
                    item => html`
                      <sl-option
                        .value=${this.#itemValue(item)}
                        ?disabled=${this.#isAriaDisabled(item)}>
                        ${item.textContent?.trim()}
                      </sl-option>
                    `
                  )}
                </sl-select>
              `
            : nothing
        }
      </div>
    `;
  }

  #onClick = (event: Event): void => {
    const item = event
      .composedPath()
      .find((el): el is SegmentedControlItem => el instanceof SegmentedControlItem);

    if (!item || this.#isAriaDisabled(item) || !this.items.includes(item)) {
      return;
    }

    this.#select(item.value);
  };

  #onSelectChange(event: SlChangeEvent<string>): void {
    // Don't leak the event of the internal select; the control emits its own `sl-change` event.
    event.stopPropagation();

    this.#select(event.detail);
  }

  /** The internal select is not a form control of the surrounding form, so stop it registering. */
  #onSelectFormControl(event: Event): void {
    event.stopPropagation();
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.items = event.target
      .assignedElements({ flatten: true })
      .filter((el): el is SegmentedControlItem => el instanceof SegmentedControlItem);

    this.#observeItems();
  }

  #observeItems(): void {
    this.#itemObserver.disconnect();
    this.items.forEach(item =>
      this.#itemObserver.observe(item, {
        attributeFilter: ['aria-disabled'],
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true
      })
    );
  }

  #requestedValue(): string | undefined {
    return this.value;
  }

  #resolveSelectedItem(value = this.#requestedValue()): SegmentedControlItem | undefined {
    const selected = this.items.find(item => this.#itemValue(item) === value);

    if (value !== undefined) {
      return selected;
    }

    return selected ?? this.items.find(item => !this.#isAriaDisabled(item)) ?? this.items[0];
  }

  #itemValue(item: SegmentedControlItem): string {
    return item.value ?? item.getAttribute('value') ?? '';
  }

  #isAriaDisabled(item: SegmentedControlItem): boolean {
    const ariaDisabled = item.ariaDisabledState;

    return ariaDisabled !== undefined && ariaDisabled !== 'false';
  }

  /** Update the selected value and optionally emit `sl-change` for user-driven changes. */
  #select(value: string, emitEvent = true): void {
    if (value === this.#requestedValue()) {
      return;
    }

    // Reject disabled options, also when the value comes from the fallback select.
    const item = this.items.find(item => this.#itemValue(item) === value);

    if (item && this.#isAriaDisabled(item)) {
      return;
    }

    this.value = value;

    if (emitEvent) {
      this.changeEvent.emit(value);
    }
  }

  /**
   * Resolve the host's accessible name to a plain text string so the internal list and fallback
   * select can reuse it inside the shadow DOM, and observe everything the name depends on.
   */
  #updateLabelReference(): void {
    const root = this.getRootNode() as Document | ShadowRoot,
      ids = this.getAttribute('aria-labelledby')?.split(/\s+/).filter(Boolean) ?? [],
      elements = this.ariaLabelledByElements?.length
        ? Array.from(this.ariaLabelledByElements)
        : ids.map(id => root.getElementById?.(id)).filter((el): el is HTMLElement => !!el);
    this.labelFromReference = this.ariaLabel
      ? undefined
      : elements
          .map(el => el.textContent?.trim())
          .filter(Boolean)
          .join(' ') || undefined;

    this.#labelObserver.disconnect();
    this.#labelObserver.observe(this, {
      attributeFilter: ['aria-label', 'aria-labelledby'],
      attributes: true
    });

    elements.forEach(el =>
      this.#labelObserver.observe(el, { characterData: true, childList: true, subtree: true })
    );
  }
}
