import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Calendar } from '@sl-design-system/calendar';
import { FormControlMixin, type SlFormControlEvent, type SlUpdateStateEvent } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, LocaleMixin, anchor, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent,
  type SlSelectEvent
} from '@sl-design-system/shared/events.js';
import { FieldButton, TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './date-field.scss.js';
import { type DateSegment, DateSegmentParser } from './date-segment-parser.js';

/**
 * A form component that allows the user to pick a date from a calendar.
 */
@localized()
export class DateField extends LocaleMixin(FormControlMixin(ScopedElementsMixin(LitElement))) {
  /** @internal The default offset of the popover to the text-field. */
  static offset = 6;

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-calendar': Calendar,
      'sl-field-button': FieldButton,
      'sl-icon': Icon,
      'sl-text-field': TextField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal The default margin between the popover and the viewport. */
  static viewportMargin = 8;

  /** Formatter for displaying the value in the input. */
  #formatter?: Intl.DateTimeFormat;

  /**
   * Flag indicating whether the popover was just closed. We need to know this so we can
   * properly handle button clicks that close the popover. If the popover was just closed,
   * we don't want to show it again when the button click event fires.
   */
  #popoverJustClosed = false;

  /** @internal Parser for handling date segments and keyboard navigation. */
  #segmentParser?: DateSegmentParser;

  /** @internal Current date segments for keyboard navigation. */
  #dateSegments: DateSegment[] = [];

  /** @internal Current active segment index for keyboard navigation. */
  #currentSegmentIndex = 0;

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<Date>>;

  /**
   * Date and time format that will be used for formatting the date in the input.
   * This support the `Intl.DateTimeFormatOptions` format.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
   */
  @property({ type: Object, attribute: 'date-time-format' })
  dateTimeFormat: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'numeric', year: 'numeric' };

  /** Whether the date field is disabled; when set no interaction is possible. */
  @property({ type: Boolean }) override disabled?: boolean;

  /**
   * The first day of the week; 0 for Sunday, 1 for Monday.
   * @default 1
   */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek?: number;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** @internal The input element in the light DOM. */
  input!: HTMLInputElement;

  /**
   * The maximum date selectable in the calendar.
   * @default undefined
   */
  @property({ converter: dateConverter }) max?: Date;

  /**
   * The minimum date selectable in the calendar.
   * @default undefined
   */
  @property({ converter: dateConverter }) min?: Date;

  /** The current month to display. */
  @property({ converter: dateConverter }) month?: Date;

  /**
   * The placeholder for the date field.
   * @default undefined
   */
  @property() placeholder?: string;

  /**
   * Whether the date field is readonly.
   * @default false
   */
  @property({ type: Boolean }) readonly?: boolean;

  /**
   * Whether the date field is a required field.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /**
   * Whether the component is select only. This means you cannot type in the text field,
   * but you can still pick a date via de popover.
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'select-only' }) selectOnly?: boolean;

  /**
   * Shows the week numbers.
   * @default false
   */
  @property({ type: Boolean, attribute: 'show-week-numbers' }) showWeekNumbers?: boolean;

  /** The selected date in the calendar. */
  @property({ converter: dateConverter }) override value?: Date;

  /** @internal The wrapper element that is also the popover. */
  @query('[part="wrapper"]') wrapper?: HTMLSlotElement;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.input) {
      this.input = this.querySelector<HTMLInputElement>('input[slot="input"]') || document.createElement('input');
      this.input.autocomplete = 'off';
      this.input.slot = 'input';

      if (!this.input.parentElement) {
        this.append(this.input);
      }
    }

    this.setFormControlElement(this.input);

    // Add keyboard event listeners for navigation
    this.input.addEventListener('keydown', this.#onKeyDown.bind(this));

    // This is a workaround, because :has is not working in Safari and Firefox with :host element as it works in Chrome
    const style = document.createElement('style');
    style.innerHTML = `
      sl-date-field:has(input:hover):not(:focus-within)::part(text-field) {
        --_bg-opacity: var(--sl-opacity-light-interactive-plain-hover);
      }
    `;
    this.prepend(style);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('dateTimeFormat') || changes.has('locale')) {
      this.#formatter = new Intl.DateTimeFormat(this.locale, this.dateTimeFormat);
      this.#segmentParser = new DateSegmentParser(this.locale, this.dateTimeFormat);
    }

    if (changes.has('value')) {
      this.input.value = this.value && this.#formatter ? this.#formatter.format(this.value) : '';
      this.#parseCurrentValue();
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-text-field
        @sl-blur=${this.#onTextFieldBlur}
        @sl-change=${this.#onTextFieldChange}
        @sl-focus=${this.#onTextFieldFocus}
        @sl-form-control=${this.#onTextFieldFormControl}
        @sl-update-state=${this.#onTextFieldUpdateState}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly || this.selectOnly}
        ?required=${this.required}
        part="text-field"
        placeholder=${ifDefined(this.placeholder)}
      >
        <slot name="input" slot="input"></slot>
        <sl-field-button
          @click=${this.#onButtonClick}
          ?disabled=${this.disabled || this.readonly}
          aria-label=${msg('Toggle calendar', { id: 'sl.dateField.toggleCalendar' })}
          slot="suffix"
          tabindex=${this.disabled ? '-1' : '0'}
        >
          <sl-icon name="calendar"></sl-icon>
        </sl-field-button>
      </sl-text-field>

      <slot
        ${anchor({
          element: this,
          offset: DateField.offset,
          position: 'bottom-start',
          viewportMargin: DateField.viewportMargin
        })}
        @beforetoggle=${this.#onBeforeToggle}
        @toggle=${this.#onToggle}
        name="calendar"
        part="wrapper"
        popover
        tabindex="-1"
      >
        ${this.wrapper?.matches(':popover-open')
          ? html`
              <sl-calendar
                @sl-change=${this.#onChange}
                .selected=${this.value}
                ?show-week-numbers=${this.showWeekNumbers}
                first-day-of-week=${ifDefined(this.firstDayOfWeek)}
                locale=${ifDefined(this.locale)}
                max=${ifDefined(this.max?.toISOString())}
                min=${ifDefined(this.min?.toISOString())}
                month=${ifDefined(this.month?.toISOString())}
                show-today
              ></sl-calendar>
            `
          : nothing}
      </slot>
    `;
  }

  #onBeforeToggle(event: ToggleEvent): void {
    if (event.newState === 'open') {
      this.input.setAttribute('aria-expanded', 'true');
    } else {
      this.input.setAttribute('aria-expanded', 'false');
      this.#popoverJustClosed = true;
    }
  }

  #onButtonClick(): void {
    // Prevents the popover from reopening immediately after it was just closed
    if (!this.#popoverJustClosed) {
      this.wrapper?.togglePopover();
    }
  }

  #onChange(event: SlSelectEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();

    this.value = event.detail;
    this.changeEvent.emit(this.value);

    this.updateState({ dirty: true });
    this.updateValidity();

    setTimeout(() => {
      this.wrapper?.hidePopover();
      this.input.focus();
    }, 500);
  }

  #onTextFieldBlur(event: SlBlurEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.blurEvent.emit();
    this.updateState({ touched: true });
  }

  #onTextFieldChange(event: SlChangeEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  #onTextFieldFocus(event: SlFocusEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.focusEvent.emit();

    // Initialize keyboard navigation when input gains focus
    if (this.value) {
      this.#parseCurrentValue();
      this.#highlightCurrentSegment();
    }
  }

  #onTextFieldFormControl(event: SlFormControlEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  #onTextFieldUpdateState(event: SlUpdateStateEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  #onToggle(event: ToggleEvent): void {
    if (event.newState === 'closed') {
      this.#popoverJustClosed = false;
    } else {
      // Wait for the calendar to render in the popover
      requestAnimationFrame(() => {
        this.renderRoot.querySelector('sl-calendar')?.focus();
      });
    }

    // Trigger a rerender so the calendar will be rendered
    this.requestUpdate();
  }

  /**
   * Handle keyboard events for date segment navigation.
   */
  #onKeyDown(event: KeyboardEvent): void {
    // Only handle keyboard events when input is focused and has a value
    if (document.activeElement !== this.input || !this.value) {
      return;
    }

    const { key } = event;
    let handled = false;

    switch (key) {
      case 'ArrowLeft':
        handled = this.#navigateToSegment(this.#currentSegmentIndex - 1);
        break;
      case 'ArrowRight':
        handled = this.#navigateToSegment(this.#currentSegmentIndex + 1);
        break;
      case 'ArrowUp':
        handled = this.#incrementSegment(1);
        break;
      case 'ArrowDown':
        handled = this.#incrementSegment(-1);
        break;
      case 'Enter':
        handled = this.#moveToNextSegment();
        break;
      case 'Escape':
        handled = this.#resetToFirstSegment();
        break;
      case 'Tab':
        // Allow tab to work normally but reset segment position
        this.#resetToFirstSegment();
        break;
      case '/':
      case '-':
      case '.':
        // Separator keys should move to next segment
        handled = this.#moveToNextSegment();
        break;
      default:
        // Handle digit input
        if (/^\d$/.test(key)) {
          handled = this.#handleDigitInput(key);
        }
        break;
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /**
   * Navigate to a specific segment by index.
   */
  #navigateToSegment(index: number): boolean {
    if (!this.#dateSegments.length) {
      return false;
    }

    // Wrap around the segment index
    if (index < 0) {
      index = this.#dateSegments.length - 1;
    } else if (index >= this.#dateSegments.length) {
      index = 0;
    }

    this.#currentSegmentIndex = index;
    this.#highlightCurrentSegment();
    return true;
  }

  /**
   * Increment or decrement the current segment value.
   * Phase 2: Enhanced with better date validation and smart wrapping.
   */
  #incrementSegment(direction: 1 | -1): boolean {
    if (!this.#dateSegments.length || !this.value) {
      return false;
    }

    const segment = this.#dateSegments[this.#currentSegmentIndex];
    if (!segment) {
      return false;
    }

    let newValue = segment.value + direction;

    // Phase 2 Enhancement: Smart wrapping with date awareness
    if (segment.type === 'day') {
      // For days, check if the month can support this day
      const currentDate = new Date(this.value);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      if (newValue > segment.max) {
        newValue = segment.min;
      } else if (newValue < segment.min) {
        newValue = segment.max;
      }

      // Validate that this day exists in the current month
      const testDate = new Date(year, month, newValue);
      if (testDate.getDate() !== newValue) {
        // Day doesn't exist (e.g., Feb 30), wrap to valid day
        newValue = direction > 0 ? segment.min : segment.max;
      }
    } else if (segment.type === 'month') {
      // For months, handle wrapping and adjust day if needed
      if (newValue > segment.max) {
        newValue = segment.min;
      } else if (newValue < segment.min) {
        newValue = segment.max;
      }
    } else {
      // For years and other segments, simple wrapping
      if (newValue > segment.max) {
        newValue = segment.min;
      } else if (newValue < segment.min) {
        newValue = segment.max;
      }
    }

    // Use the helper method for consistent updating
    this.#updateSegmentValue(segment, newValue);
    return true;
  }

  /**
   * Move to the next segment.
   */
  #moveToNextSegment(): boolean {
    return this.#navigateToSegment(this.#currentSegmentIndex + 1);
  }

  /**
   * Reset to the first segment.
   */
  #resetToFirstSegment(): boolean {
    this.#currentSegmentIndex = 0;
    this.#highlightCurrentSegment();
    return true;
  }

  /**
   * Handle direct digit input to update segment value.
   * Phase 2: Enhanced with smart digit handling and auto-advancement.
   */
  #handleDigitInput(digit: string): boolean {
    if (!this.#dateSegments.length || !this.value) {
      return false;
    }

    const segment = this.#dateSegments[this.#currentSegmentIndex];
    if (!segment) {
      return false;
    }

    const digitValue = parseInt(digit, 10);
    const currentValue = segment.value;

    // Phase 2 Enhancement: Improved digit input logic
    if (segment.type === 'day' || segment.type === 'month') {
      // For day/month: smart handling based on current value and constraints
      if (currentValue === 0 || currentValue.toString().length >= 2) {
        // Replace with new digit if current is 0 or already 2 digits
        const newValue = digitValue;
        if (newValue >= segment.min && newValue <= segment.max) {
          this.#updateSegmentValue(segment, newValue);
          // Auto-advance if this makes a complete valid value
          if (digitValue > 3 && segment.type === 'day') this.#moveToNextSegment();
          if (digitValue > 1 && segment.type === 'month') this.#moveToNextSegment();
        }
      } else {
        // Append digit to current value
        const newValueStr = currentValue.toString() + digit;
        const newValue = parseInt(newValueStr, 10);

        if (newValue <= segment.max) {
          this.#updateSegmentValue(segment, newValue);
          // Auto-advance if we hit 2 digits or an obvious complete value
          if (
            newValueStr.length >= 2 ||
            (segment.type === 'day' && newValue > 3) ||
            (segment.type === 'month' && newValue > 1)
          ) {
            this.#moveToNextSegment();
          }
        } else if (digitValue >= segment.min && digitValue <= segment.max) {
          // If appending would exceed max, start fresh with just the digit
          this.#updateSegmentValue(segment, digitValue);
          if (digitValue > 3 && segment.type === 'day') this.#moveToNextSegment();
          if (digitValue > 1 && segment.type === 'month') this.#moveToNextSegment();
        }
      }
    } else if (segment.type === 'year') {
      // For year: build up the 4-digit year intelligently
      const currentStr = currentValue.toString();

      if (currentStr.length >= 4 || currentValue === 0) {
        // Start fresh with new digit, assuming 21st century
        const newValue = digitValue === 0 ? 2000 : digitValue === 1 ? 1000 + digitValue : 2000 + digitValue;
        this.#updateSegmentValue(segment, newValue);
      } else {
        // Append to current year
        const newValueStr = currentStr + digit;
        const newValue = parseInt(newValueStr, 10);

        if (newValueStr.length <= 4 && newValue >= segment.min && newValue <= segment.max) {
          this.#updateSegmentValue(segment, newValue);
          // Auto-advance after 4 digits
          if (newValueStr.length >= 4) {
            this.#moveToNextSegment();
          }
        }
      }
    }

    return true;
  }

  /**
   * Highlight the current segment using setSelectionRange.
   */
  #highlightCurrentSegment(): void {
    if (!this.#dateSegments.length || !this.input) {
      return;
    }

    const segment = this.#dateSegments[this.#currentSegmentIndex];
    if (segment) {
      this.input.setSelectionRange(segment.position.start, segment.position.end);
    }
  }

  /**
   * Phase 3: Helper method to update segment value with enhanced validation.
   */
  #updateSegmentValue(segment: DateSegment, newValue: number): void {
    const originalDate = this.value!;
    const newDate = this.#segmentParser!.updateSegment(originalDate, segment.type, newValue);

    // Phase 3: Enhanced validation
    if (newDate && this.#isValidDateValue(newDate)) {
      // Only update if the date actually changed and is valid
      if (newDate.getTime() !== originalDate.getTime()) {
        this.value = newDate;
        this.changeEvent.emit(this.value);

        // Re-parse segments to get updated positions and values
        this.#parseCurrentValue();

        // Re-highlight the current segment with improved timing
        this.#scheduleHighlight();
      }
    }
    // If validation fails, the change is silently ignored
    // In a future phase, we could add user feedback here
  }

  /**
   * Phase 3: Validate that a date value is within acceptable bounds.
   */
  #isValidDateValue(date: Date | null): boolean {
    if (!date || isNaN(date.getTime())) {
      return false;
    }

    // Check against reasonable date bounds
    const minYear = 1900;
    const maxYear = new Date().getFullYear() + 100;
    const year = date.getFullYear();

    return year >= minYear && year <= maxYear;
  }

  /**
   * Phase 3: Schedule segment highlighting with proper timing.
   */
  #scheduleHighlight(): void {
    // Use requestAnimationFrame to ensure DOM updates are complete
    requestAnimationFrame(() => {
      this.#highlightCurrentSegment();
    });
  }

  /**
   * Parse the current value into date segments.
   */
  #parseCurrentValue(): void {
    if (!this.value || !this.#segmentParser) {
      this.#dateSegments = [];
      return;
    }

    this.#dateSegments = this.#segmentParser.parseDate(this.value);

    // Ensure current segment index is valid
    if (this.#currentSegmentIndex >= this.#dateSegments.length) {
      this.#currentSegmentIndex = 0;
    }
  }
}
