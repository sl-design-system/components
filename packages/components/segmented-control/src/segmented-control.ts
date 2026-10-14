import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
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

/** A single option in the segmented control. */
export interface SegmentedControlItem {
  /** Disables this option. */
  disabled?: boolean;

  /** Optional name of an icon to show before the label. */
  icon?: string;

  /** The visible text of the option. */
  label: string;

  /** The unique value of the option. */
  value: string;
}

/**
 * A segmented control lets the user switch between a small number of related options, for example a
 * "List" and a "Grid" view. It renders an unordered list of buttons; the selected button has
 * `aria-current="true"`, all others `aria-current="false"`.
 *
 * When there is not enough space to show all buttons, the control renders an `sl-select` with the
 * same options instead. It switches back to the buttons as soon as they fit again.
 *
 * Give the control an accessible name using `aria-label` or `aria-labelledby` on the host element.
 * The name should explain what the control changes, such as "View" or "Sort by".
 *
 * The control is a single tab stop; use the left and right arrow keys to move between options.
 *
 * @csspart select - The `sl-select` that is shown when the buttons don't fit. Use it to change the
 *   width of the select, for example to let it fill the full width of the control.
 */
export class SegmentedControl extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return { 'sl-icon': Icon, 'sl-option': Option, 'sl-select': Select };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Manage keyboard navigation between the buttons. */
  #rovingTabindexController: RovingTabindexController<HTMLButtonElement> =
    new RovingTabindexController<HTMLButtonElement>(this, {
      direction: 'horizontal',
      elements: (): HTMLButtonElement[] =>
        Array.from(this.renderRoot?.querySelectorAll('.content button') ?? []),
      focusInIndex: (elements: HTMLButtonElement[]) => elements.findIndex(el => !el.disabled),
      isFocusableElement: (el: HTMLButtonElement) => !el.disabled
    });

  /** Detects whether the buttons fit; if not, a select is shown instead. */
  #overflow = new OverflowController(this);

  /** The previously selected value, used to animate the fill from the old to the new option. */
  #previousValue?: string;

  /** Whether the last render showed the select, to know when the buttons were (re)created. */
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

  /** The options to show. */
  @property({ attribute: false }) items: SegmentedControlItem[] = [];

  /** @internal The accessible name resolved from `aria-labelledby`, if set. */
  @state() labelFromReference?: string;

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

  /** The value of the selected option. Defaults to the first option. */
  @property() value?: string;

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('value')) {
      this.#previousValue = changes.get('value');
    }

    if (changes.has('items') && this.items.length && !this.#selectedValue) {
      this.value = this.items.find(item => !item.disabled)?.value ?? this.items[0].value;
    }

    this.#updateLabelReference();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('items') || this.#showsSelect !== this.#overflow.overflowing) {
      this.#showsSelect = this.#overflow.overflowing;
      this.#rovingTabindexController.clearElementCache();
    }
  }

  override render(): TemplateResult {
    const label = this.ariaLabel ?? this.labelFromReference;

    return html`
      <div aria-hidden="true" class="measure">
        <ul>
          ${this.#renderOptions()}
        </ul>
      </div>
      <div aria-hidden="true" class="sizer">${this.items.map(() => html`<span></span>`)}</div>
      <div class="content">
        ${
          this.#overflow.overflowing
            ? html`
                <sl-select
                  @sl-change=${this.#onSelectChange}
                  @sl-form-control=${this.#onSelectFormControl}
                  .value=${this.value}
                  aria-label=${ifDefined(label ?? undefined)}
                  part="select"
                  shape=${this.shape}
                  size=${this.size}>
                  ${this.#renderSelectOptions()}
                </sl-select>
              `
            : html`
                <ul aria-label=${ifDefined(label ?? undefined)}>
                  ${this.#renderOptions()}
                </ul>
              `
        }
      </div>
    `;
  }

  #renderOptions(): TemplateResult {
    return html`
      ${repeat(
        this.items,
        item => item.value,
        item => html`
          <li>
            <button
              @click=${() => this.#onClick(item)}
              ?disabled=${item.disabled}
              class=${ifDefined(this.#animationFor(item))}
              aria-current=${item.value === this.value ? 'true' : 'false'}
              aria-label=${ifDefined(this.iconOnly ? item.label : undefined)}
              type="button">
              ${item.icon ? html`<sl-icon .name=${item.icon}></sl-icon>` : nothing}
              ${this.iconOnly ? nothing : item.label}
            </button>
          </li>
        `
      )}
    `;
  }

  #renderSelectOptions(): TemplateResult {
    return html`
      ${repeat(
        this.items,
        item => item.value,
        item => html`
          <sl-option .value=${item.value} ?disabled=${item.disabled}>${item.label}</sl-option>
        `
      )}
    `;
  }

  /** The fill animation of an option: grow in when it became selected, shrink out when it was. */
  #animationFor(item: SegmentedControlItem): string | undefined {
    if (this.#previousValue === undefined) {
      return undefined;
    } else if (item.value === this.value) {
      return 'fill-in';
    } else if (item.value === this.#previousValue) {
      return 'fill-out';
    }

    return undefined;
  }

  get #selectedValue(): string | undefined {
    return this.items.some(item => item.value === this.value) ? this.value : undefined;
  }

  #onClick(item: SegmentedControlItem): void {
    if (item.value === this.value) {
      return;
    }

    this.value = item.value;
    this.changeEvent.emit(item.value);
  }

  #onSelectChange(event: SlChangeEvent<string>): void {
    // Don't leak the event of the internal select; the control emits its own `sl-change` event.
    event.stopPropagation();

    const newValue = event.detail;
    if (!newValue || newValue === this.value) {
      return;
    }

    this.value = newValue;
    this.changeEvent.emit(newValue);
  }

  /** The internal select is not a form control of the surrounding form, so stop it registering. */
  #onSelectFormControl(event: Event): void {
    event.stopPropagation();
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
