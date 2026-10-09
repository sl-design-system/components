import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
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

  /**
   * Hides the visible text so only the icon is shown (requires `icon`). The label is still used as
   * the accessible name of the button.
   */
  hideLabel?: boolean;

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
 * Give the control an accessible name using `aria-label` or `aria-labelledby` on the host element.
 * The name should explain what the control changes, such as "View" or "Sort by".
 *
 * The control is a single tab stop; use the left and right arrow keys to move between options.
 */
export class SegmentedControl extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return { 'sl-icon': Icon };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Manage keyboard navigation between the buttons. */
  #rovingTabindexController = new RovingTabindexController<HTMLButtonElement>(this, {
    direction: 'horizontal',
    elements: () => Array.from(this.renderRoot?.querySelectorAll('button') ?? []),
    focusInIndex: (elements: HTMLButtonElement[]) => elements.findIndex(el => !el.disabled),
    isFocusableElement: (el: HTMLButtonElement) => !el.disabled
  });

  /** The accessible name resolved from `aria-labelledby`, if set. */
  @state() labelFromReference?: string;

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

  /** The options to show. */
  @property({ attribute: false }) items: SegmentedControlItem[] = [];

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

    if (changes.has('items') && this.items.length && !this.#selectedValue) {
      this.value = this.items.find(item => !item.disabled)?.value ?? this.items[0].value;
    }

    this.#updateLabelReference();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('items')) {
      this.#rovingTabindexController.clearElementCache();
      this.#equalizeButtonWidths();
    }
  }

  override render(): TemplateResult {
    const label = this.ariaLabel ?? this.labelFromReference;

    return html`
      <ul aria-label=${ifDefined(label ?? undefined)}>
        ${repeat(
          this.items,
          item => item.value,
          item => html`
            <li>
              <button
                @click=${() => this.#onClick(item)}
                ?disabled=${item.disabled}
                aria-current=${item.value === this.value ? 'true' : 'false'}
                aria-label=${ifDefined(item.hideLabel ? item.label : undefined)}
                type="button">
                ${item.icon ? html`<sl-icon .name=${item.icon}></sl-icon>` : nothing}
                ${item.hideLabel ? nothing : item.label}
              </button>
            </li>
          `
        )}
      </ul>
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

  /** Measure all buttons and set them to the same width as the longest button. */
  #equalizeButtonWidths(): void {
    const buttons = Array.from(this.renderRoot?.querySelectorAll('button') ?? []);

    if (!buttons.length) {
      return;
    }

    // Force a reflow to ensure accurate measurements
    const maxWidth = Math.max(
      ...buttons.map(btn => {
        btn.style.width = '';
        return btn.offsetWidth;
      })
    );

    // Set all buttons to the max width
    buttons.forEach(btn => {
      btn.style.width = `${maxWidth}px`;
    });
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
