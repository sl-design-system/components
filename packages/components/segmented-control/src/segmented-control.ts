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
 * "List" and a "Grid" view. Each option is an `sl-segmented-control-item`. Set `selected` on the
 * option that should be selected; when no option is selected, the first enabled option is. The
 * selected option has `aria-current="true"`, all others `aria-current="false"`.
 *
 * ```html
 * <sl-segmented-control aria-label="View">
 *   <sl-segmented-control-item value="list">List</sl-segmented-control-item>
 *   <sl-segmented-control-item selected value="grid">Grid</sl-segmented-control-item>
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
    return { 'sl-option': Option, 'sl-select': Select };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Used for the `animated`, `measuring` and `overflowing` custom states. */
  #internals = this.attachInternals();

  /** Detects whether the options fit; if not, a select is shown instead. */
  #overflow = new OverflowController(this, this.#internals);

  /** Picks up changes to the `selected` attribute of the options made outside the control. */
  #observer = new MutationObserver(entries => {
    const items = entries
      .map(entry => entry.target)
      .filter((el): el is SegmentedControlItem => this.items.includes(el as SegmentedControlItem));

    // Ignore the changes the control made itself; those already match the selected option.
    const selected = items.find(item => item.selected && item !== this.selectedItem),
      deselected = items.find(item => !item.selected && item === this.selectedItem);

    if (selected) {
      this.#select(selected, false);
    } else if (deselected) {
      this.#select(undefined, false);
    }
  });

  /** The previously selected option, so its fill can animate out. */
  #previousItem?: SegmentedControlItem;

  /** Manage keyboard navigation between the options. */
  #rovingTabindexController = new RovingTabindexController<SegmentedControlItem>(this, {
    direction: 'horizontal',
    elements: () => this.items,
    focusInIndex: (elements: SegmentedControlItem[]) => {
      const selected = elements.findIndex(el => el.selected && !el.disabled);

      return selected === -1 ? elements.findIndex(el => !el.disabled) : selected;
    },
    isFocusableElement: (el: SegmentedControlItem) => !el.disabled
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
    this.#observer.observe(this, { attributeFilter: ['selected'], subtree: true });
  }

  override disconnectedCallback(): void {
    this.removeEventListener('click', this.#onClick);
    this.#observer.disconnect();
    this.#internals.states.delete('animated');

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('selectedItem')) {
      // Only animate the old fill out when the options are visible.
      this.#previousItem = this.#overflow.overflowing ? undefined : changes.get('selectedItem');
    }

    this.#updateLabelReference();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (this.#showsSelect !== this.#overflow.overflowing) {
      this.#showsSelect = this.#overflow.overflowing;

      if (this.#showsSelect) {
        this.#previousItem = undefined;
      }
    }

    this.items.forEach(item => {
      item.emphasis = this.emphasis;
      item.iconOnly = this.iconOnly;
      item.leaving = item === this.#previousItem;
      item.selected = item === this.selectedItem;
      item.shape = this.shape;
      item.size = this.size;
    });

    if (changes.has('items')) {
      this.#rovingTabindexController.clearElementCache();
    }

    // Only animate selection changes, not the initial selection.
    if (this.items.length && !this.#internals.states.has('animated')) {
      requestAnimationFrame(() => {
        if (this.isConnected) {
          this.#internals.states.add('animated');
        }
      });
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
                  .value=${this.selectedItem?.value}
                  aria-label=${ifDefined(label ?? undefined)}
                  part="select"
                  shape=${this.shape}
                  size=${this.size}>
                  ${repeat(
                    this.items,
                    item => item,
                    item => html`
                      <sl-option .value=${item.value} ?disabled=${item.disabled}>
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

    if (!item || item.disabled || !this.items.includes(item)) {
      return;
    }

    this.#select(item);
  };

  #onSelectChange(event: SlChangeEvent<string>): void {
    // Don't leak the event of the internal select; the control emits its own `sl-change` event.
    event.stopPropagation();

    const item = this.items.find(i => i.value === event.detail);
    if (item) {
      this.#select(item);
    }
  }

  /** The internal select is not a form control of the surrounding form, so stop it registering. */
  #onSelectFormControl(event: Event): void {
    event.stopPropagation();
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.items = event.target
      .assignedElements({ flatten: true })
      .filter((el): el is SegmentedControlItem => el instanceof SegmentedControlItem);

    // Keep the current selection if it is still there, otherwise use the option marked as selected,
    // or the first enabled option.
    const selected = this.items.includes(this.selectedItem!)
      ? this.selectedItem
      : (this.items.find(item => item.selected) ??
        this.items.find(item => !item.disabled) ??
        this.items[0]);

    this.#select(selected, false);
  }

  #select(item?: SegmentedControlItem, emitEvent = true): void {
    if (item === this.selectedItem) {
      return;
    }

    this.selectedItem = item;

    if (emitEvent && item?.value !== undefined) {
      this.changeEvent.emit(item.value);
    }
  }

  /**
   * An `aria-labelledby` reference can't cross the shadow DOM boundary, so resolve the referenced
   * elements and use their text as the accessible name of the list.
   */
  #updateLabelReference(): void {
    const ids = this.getAttribute('aria-labelledby')?.split(/\s+/).filter(Boolean) ?? [];

    if (!ids.length || this.ariaLabel) {
      this.labelFromReference = undefined;
      return;
    }

    const root = this.getRootNode() as Document | ShadowRoot;

    this.labelFromReference =
      ids
        .map(id => root.getElementById?.(id)?.textContent?.trim())
        .filter(Boolean)
        .join(' ') || undefined;
  }
}
