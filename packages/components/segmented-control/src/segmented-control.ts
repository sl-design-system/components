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
 */
export class SegmentedControl extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return { 'sl-icon': Icon, 'sl-option': Option, 'sl-select': Select };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The element internals, used for the `overflow` custom state. */
  #internals = this.attachInternals();

  /** Manage keyboard navigation between the buttons. */
  #rovingTabindexController: RovingTabindexController<HTMLButtonElement> =
    new RovingTabindexController<HTMLButtonElement>(this, {
      direction: 'horizontal',
      elements: (): HTMLButtonElement[] =>
        Array.from(this.renderRoot?.querySelectorAll('.content button') ?? []),
      focusInIndex: (elements: HTMLButtonElement[]) => elements.findIndex(el => !el.disabled),
      isFocusableElement: (el: HTMLButtonElement) => !el.disabled
    });

  /**
   * Observe the host (available width) and the measurement list (required width, which changes when
   * fonts load or the theme changes).
   */
  #resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(() => this.#updateLayoutMode());
  });

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

  /** @internal Whether there is not enough space for the buttons, so a select is shown instead. */
  @state() useSelect = false;

  /** The value of the selected option. Defaults to the first option. */
  @property() value?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#resizeObserver.observe(this);
  }

  override disconnectedCallback(): void {
    this.#resizeObserver.disconnect();

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('items') && this.items.length && !this.#selectedValue) {
      this.value = this.items.find(item => !item.disabled)?.value ?? this.items[0].value;
    }

    this.#updateLabelReference();
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    const measurementList = this.renderRoot.querySelector('ul[data-measurement]');
    if (measurementList) {
      this.#resizeObserver.observe(measurementList);
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('items') || changes.has('useSelect')) {
      this.#rovingTabindexController.clearElementCache();
    }

    if (changes.has('useSelect')) {
      // Lets the host (and the select) stretch to the full available width in the overflow state.
      if (this.useSelect) {
        this.#internals.states.add('overflow');
      } else {
        this.#internals.states.delete('overflow');
      }
    }

    this.#updateLayoutMode();
  }

  override render(): TemplateResult {
    const label = this.ariaLabel ?? this.labelFromReference;

    return html`
      <div aria-hidden="true" class="measure">
        <ul data-measurement>
          ${this.#renderOptions()}
        </ul>
      </div>
      <div aria-hidden="true" class="sizer">${this.items.map(() => html`<span></span>`)}</div>
      <div class="content">
        ${
          this.useSelect
            ? html`
                <sl-select
                  @sl-change=${this.#onSelectChange}
                  @sl-form-control=${this.#onSelectFormControl}
                  .value=${this.value}
                  aria-label=${ifDefined(label ?? undefined)}>
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
   * Switch between the buttons and the select, depending on whether the buttons fit.
   *
   * The required width is measured using an off-screen copy of the buttons. That width is also
   * applied to the (invisible) sizer, which makes the host _ask_ for that width. The host is then
   * exactly as wide as the buttons need when there is enough space, and narrower when there isn't.
   * Because the visible content never influences the width of the host (see `.content` in the CSS),
   * the host keeps asking for the full width while the select is shown. That is what allows the
   * control to switch back to buttons when more space becomes available; otherwise the host would
   * shrink to the width of the select and containers sized to their content (table cells, flex
   * items, etc.) would never offer more space again.
   */
  #updateLayoutMode(): void {
    const measurementList = this.renderRoot.querySelector<HTMLElement>('ul[data-measurement]'),
      sizer = this.renderRoot.querySelector<HTMLElement>('.sizer');

    if (!measurementList || !sizer || !this.items.length) {
      return;
    }

    const requiredWidth = measurementList.getBoundingClientRect().width,
      segmentSize = `${requiredWidth / this.items.length}px`;

    if (sizer.style.getPropertyValue('--_segment-size') !== segmentSize) {
      sizer.style.setProperty('--_segment-size', segmentSize);
    }

    // Reading the width after updating the sizer forces a synchronous layout with the new value.
    // Allow half a pixel of tolerance for sub-pixel rounding.
    const availableWidth = this.getBoundingClientRect().width,
      useSelect = requiredWidth > 0 && requiredWidth - availableWidth > 0.5;

    if (useSelect !== this.useSelect) {
      this.useSelect = useSelect;
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
