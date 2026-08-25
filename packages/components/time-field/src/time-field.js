var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __typeError = msg2 => {
  throw TypeError(msg2);
};
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __accessCheck = (obj, member, msg2) => member.has(obj) || __typeError('Cannot ' + msg2);
var __privateGet = (obj, member, getter) => (
  __accessCheck(obj, member, 'read from private field'),
  getter ? getter.call(obj) : member.get(obj)
);
var __privateAdd = (obj, member, value) =>
  member.has(obj)
    ? __typeError('Cannot add the same private member more than once')
    : member instanceof WeakSet
      ? member.add(obj)
      : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (
  __accessCheck(obj, member, 'write to private field'),
  setter ? setter.call(obj, value) : member.set(obj, value),
  value
);
var __privateMethod = (obj, member, method) => (
  __accessCheck(obj, member, 'access private method'),
  method
);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _events,
  _enteredDigits,
  _preserveTimeParts,
  _popoverJustClosed,
  _rovingIndex,
  _startTime,
  _valueAsNumbers,
  _value,
  _TimeField_instances,
  getFormattedValue_fn,
  getMaxForType_fn,
  getMinForType_fn,
  onBeforeToggle_fn,
  onClick_fn,
  _onFocusIn,
  _onFocusOut,
  onButtonClick_fn,
  onDialogFocusin_fn,
  onDialogFocusout_fn,
  onHourClick_fn,
  onHourKeydown_fn,
  onSeparatorPointerDown_fn,
  onKeydown_fn,
  onMinuteClick_fn,
  onMinuteKeydown_fn,
  onPartBlur_fn,
  onPartFocus_fn,
  onPartKeydown_fn,
  onSelectAllBlur_fn,
  onSelectAllKeydown_fn,
  onSelectAllMouseDown_fn,
  exitSelectAll_fn,
  selectContentOnNextFrame_fn,
  selectContent_fn,
  moveFocus_fn,
  applyDigitToTimePart_fn,
  adjustTimePart_fn,
  compareTimes_fn,
  shouldAutoAdvanceOnSingleDigit_fn,
  trySetValue_fn,
  onPaste_fn,
  onToggle_fn,
  formatTime_fn,
  isMinuteDisabled_fn,
  parseTime_fn,
  getStartTime_fn,
  getConstrainedMinutes_fn,
  getTimeSeparator_fn,
  scrollAndFocusStartTime_fn,
  scrollTimeIntoView_fn,
  focusTimeElement_fn;
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import {
  EventsController,
  LocaleMixin,
  anchor,
  event,
  isPopoverOpen
} from '@sl-design-system/shared';
import { FieldButton } from '@sl-design-system/text-field';
import { LitElement, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './time-field.scss.js';
import { getTimeFormat, getTimeUnitLetter, getTimeUnitName } from './utils.js';
const timeSeparators = /* @__PURE__ */ new Map();
export let TimeField = class extends LocaleMixin(
  FormControlMixin(ScopedElementsMixin(LitElement))
) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _TimeField_instances);
    /** Events controller. */
    // eslint-disable-next-line no-unused-private-class-members
    __privateAdd(
      this,
      _events,
      new EventsController(this, {
        click: __privateMethod(this, _TimeField_instances, onClick_fn)
      })
    );
    /** Tracks how many digits have been entered for the current part. */
    __privateAdd(this, _enteredDigits, 0);
    /**
     * Flag to prevent willUpdate from clearing timeParts when the value is set to undefined
     * internally (e.g. when the user enters an invalid time).
     */
    __privateAdd(this, _preserveTimeParts, false);
    /**
     * Flag indicating whether the popover was just closed. We need to know this so we can properly
     * handle button clicks that close the popover. If the popover was just closed, we don't want to
     * show it again when the button click event fires.
     */
    __privateAdd(this, _popoverJustClosed, false);
    /** The index of the active time part for roving tabindex. */
    __privateAdd(this, _rovingIndex, 0);
    /**
     * The start time; the time that has the initial focus when the picker is opened when there is
     * no value set.
     */
    __privateAdd(this, _startTime);
    /** The current value in numbers. */
    __privateAdd(this, _valueAsNumbers);
    /** The value in HH:mm format. */
    __privateAdd(this, _value);
    this.hourStep = TimeField.hourStep;
    /** @internal */
    this.internals = this.attachInternals();
    this.minuteStep = TimeField.minuteStep;
    this.timeParts = {};
    __privateAdd(this, _onFocusIn, event2 => {
      const relatedTarget = event2.relatedTarget;
      if (
        !relatedTarget ||
        (!this.contains(relatedTarget) && !this.renderRoot.contains(relatedTarget))
      ) {
        this.focusEvent.emit();
      }
      this.placeholderShown = false;
    });
    __privateAdd(this, _onFocusOut, event2 => {
      const relatedTarget = event2.relatedTarget;
      if (
        !relatedTarget ||
        (!this.contains(relatedTarget) && !this.renderRoot.contains(relatedTarget))
      ) {
        this.placeholderShown = !this.value && !!this.placeholder;
        this.blurEvent.emit();
        this.updateState({ touched: true });
        this.updateValidity();
        const movingToDialog = relatedTarget && this.dialog?.contains(relatedTarget);
        if (!movingToDialog && this.dialog && isPopoverOpen(this.dialog)) {
          this.dialog.hidePopover();
        }
      }
    });
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-field-button': FieldButton,
      'sl-icon': Icon
    };
  }
  get value() {
    return __privateGet(this, _value);
  }
  set value(value) {
    if (value) {
      const time = __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, value);
      if (time && !Number.isNaN(time.hour) && !Number.isNaN(time.minute)) {
        __privateSet(
          this,
          _value,
          __privateMethod(this, _TimeField_instances, formatTime_fn).call(
            this,
            time.hour,
            time.minute
          )
        );
        __privateSet(this, _valueAsNumbers, time);
        this.timeParts = { hour: time.hour, minute: time.minute };
      } else {
        __privateSet(this, _value, void 0);
        __privateSet(this, _valueAsNumbers, void 0);
        this.timeParts = {};
      }
    } else {
      __privateSet(this, _value, void 0);
      __privateSet(this, _valueAsNumbers, void 0);
      this.timeParts = {};
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.internals.role = 'group';
    this.setFormControlElement(this);
    this.addEventListener('focusin', __privateGet(this, _onFocusIn));
    this.addEventListener('focusout', __privateGet(this, _onFocusOut));
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('focusin', __privateGet(this, _onFocusIn));
    this.removeEventListener('focusout', __privateGet(this, _onFocusOut));
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('start')) {
      __privateSet(
        this,
        _startTime,
        this.start
          ? __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, this.start)
          : void 0
      );
    }
    if (changes.has('value')) {
      if (this.value) {
        this.timeParts = {
          hour: __privateGet(this, _valueAsNumbers)?.hour,
          minute: __privateGet(this, _valueAsNumbers)?.minute
        };
      } else if (changes.get('value') !== void 0 && !__privateGet(this, _preserveTimeParts)) {
        this.timeParts = {};
        __privateSet(this, _enteredDigits, 0);
      }
      __privateSet(this, _preserveTimeParts, false);
    }
    if (changes.has('timeParts') || changes.has('placeholder') || changes.has('value')) {
      if (this.value || this.timeParts.hour !== void 0 || this.timeParts.minute !== void 0) {
        this.placeholderShown = false;
      } else if (this.placeholder) {
        this.placeholderShown = true;
      } else {
        this.placeholderShown = false;
      }
    }
    if (changes.has('placeholderShown')) {
      if (this.placeholderShown) {
        this.internals.states.add('placeholder-shown');
      } else {
        this.internals.states.delete('placeholder-shown');
      }
    }
    if (changes.has('value')) {
      if (this.value) {
        this.internals.states.add('has-value');
      } else {
        this.internals.states.delete('has-value');
      }
      this.internals.setFormValue(this.value || null);
    }
    if (
      changes.has('min') ||
      changes.has('max') ||
      changes.has('required') ||
      changes.has('value')
    ) {
      this.updateValidity();
    }
  }
  /** @internal */
  focus() {
    this.renderRoot.querySelector('span[role="spinbutton"]')?.focus();
    this.internals.states.add('has-focus');
  }
  render() {
    const locale = this.locale || 'default',
      parts = getTimeFormat(locale);
    let timePartIndex = 0;
    return html`
      <div class="field">
        <div class="wrapper">
          ${
            this.selectAll
              ? html`
                  <span
                    @blur=${__privateMethod(this, _TimeField_instances, onSelectAllBlur_fn)}
                    @keydown=${__privateMethod(this, _TimeField_instances, onSelectAllKeydown_fn)}
                    @mousedown=${__privateMethod(this, _TimeField_instances, onSelectAllMouseDown_fn)}
                    @beforeinput=${event2 => event2.preventDefault()}
                    @paste=${event2 => event2.preventDefault()}
                    @drop=${event2 => event2.preventDefault()}
                    class="select-all"
                    contenteditable="plaintext-only"
                    >${__privateMethod(this, _TimeField_instances, getFormattedValue_fn).call(this)}</span
                  >
                `
              : html`
                  <div class="parts">
                    ${parts.map(part => {
                      const index = part.type === 'literal' ? -1 : timePartIndex++;
                      return this.renderPart(part, locale, index);
                    })}
                  </div>
                  ${
                    this.placeholder
                      ? html`
                          <div
                            aria-hidden=${ifDefined(this.placeholderShown ? void 0 : 'true')}
                            class="placeholder">
                            ${this.placeholder}
                          </div>
                        `
                      : nothing
                  }
                `
          }
        </div>
        <sl-field-button
          @click=${__privateMethod(this, _TimeField_instances, onButtonClick_fn)}
          ?disabled=${this.disabled || this.readonly}
          aria-controls="dialog"
          aria-expanded=${this.dialog && isPopoverOpen(this.dialog) ? 'true' : 'false'}
          aria-haspopup="dialog"
          aria-label=${msg('Select time', { id: 'sl.timeField.toggleDropdown' })}
          tabindex=${this.disabled || this.readonly ? '-1' : '0'}>
          <sl-icon name="clock"></sl-icon>
        </sl-field-button>
      </div>

      <dialog
        ${anchor({
          element: this,
          offset: TimeField.offset,
          position: 'bottom-start',
          viewportMargin: TimeField.viewportMargin
        })}
        @beforetoggle=${__privateMethod(this, _TimeField_instances, onBeforeToggle_fn)}
        @toggle=${__privateMethod(this, _TimeField_instances, onToggle_fn)}
        @focusin=${__privateMethod(this, _TimeField_instances, onDialogFocusin_fn)}
        @focusout=${__privateMethod(this, _TimeField_instances, onDialogFocusout_fn)}
        @keydown=${__privateMethod(this, _TimeField_instances, onKeydown_fn)}
        id="dialog"
        popover>
        <ul
          aria-label=${msg('Select hours', { id: 'sl.timeField.selectHours' })}
          class="hours"
          role="listbox"
          tabindex="-1">
          ${this.renderHours()}
        </ul>
        <hr aria-hidden="true" />
        <ul
          aria-label=${msg('Select minutes', { id: 'sl.timeField.selectMinutes' })}
          class="minutes"
          role="listbox"
          tabindex="-1">
          ${this.renderMinutes()}
        </ul>
      </dialog>
    `;
  }
  /** @internal */
  renderPart(part, locale, timePartIndex) {
    if (part.type === 'literal') {
      return html`
        <span
          @pointerdown=${__privateMethod(this, _TimeField_instances, onSeparatorPointerDown_fn)}
          class="separator"
          aria-hidden="true"
          >${part.value}</span
        >
      `;
    }
    const partType = part.type,
      placeholder = getTimeUnitLetter(locale, partType).repeat(part.value.length),
      currentValue = this.timeParts[partType],
      hasValue = currentValue !== void 0,
      displayValue = hasValue ? String(currentValue).padStart(part.value.length, '0') : placeholder,
      valueText = hasValue
        ? String(currentValue).padStart(part.value.length, '0')
        : msg('Empty', { id: 'sl.timeField.empty' });
    return html`
      <span
        @beforeinput=${e => e.preventDefault()}
        @blur=${__privateMethod(this, _TimeField_instances, onPartBlur_fn)}
        @focus=${__privateMethod(this, _TimeField_instances, onPartFocus_fn)}
        @keydown=${e => __privateMethod(this, _TimeField_instances, onPartKeydown_fn).call(this, e, partType)}
        @paste=${__privateMethod(this, _TimeField_instances, onPaste_fn)}
        @drop=${e => e.preventDefault()}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-label=${getTimeUnitName(locale, partType)}
        aria-readonly=${this.readonly || this.selectOnly ? 'true' : 'false'}
        aria-valuemax=${__privateMethod(this, _TimeField_instances, getMaxForType_fn).call(this, partType)}
        aria-valuemin=${__privateMethod(this, _TimeField_instances, getMinForType_fn).call(this, partType)}
        aria-valuenow=${ifDefined(currentValue)}
        aria-valuetext=${valueText}
        contenteditable=${this.disabled || this.readonly || this.selectOnly ? 'false' : 'true'}
        inputmode="numeric"
        role="spinbutton"
        tabindex=${ifDefined(
          this.disabled ? void 0 : timePartIndex === __privateGet(this, _rovingIndex) ? '0' : '-1'
        )}
        >${displayValue}</span
      >
    `;
  }
  /**
   * Renders hour options (00–23) using hourStep, applies min/max constraints, and marks the
   * selected hour with aria-selected. Can be overridden.
   */
  renderHours() {
    let hours = Array.from({ length: 24 / this.hourStep }, (_, i) => i * this.hourStep);
    if (this.min) {
      const minHour = __privateMethod(this, _TimeField_instances, parseTime_fn).call(
        this,
        this.min
      )?.hour;
      if (minHour !== void 0) {
        hours = hours.filter(h => h >= minHour);
      }
    }
    if (this.max) {
      const maxHour = __privateMethod(this, _TimeField_instances, parseTime_fn).call(
        this,
        this.max
      )?.hour;
      if (maxHour !== void 0) {
        hours = hours.filter(h => h <= maxHour);
      }
    }
    return hours.map(
      (hour, index) => html`
        <li
          @click=${() => __privateMethod(this, _TimeField_instances, onHourClick_fn).call(this, hour)}
          @keydown=${event2 => __privateMethod(this, _TimeField_instances, onHourKeydown_fn).call(this, event2, hour)}
          aria-label=${`${hour.toString()} ${getTimeUnitName(this.locale || 'default', 'hour')}`}
          aria-selected=${hour === __privateGet(this, _valueAsNumbers)?.hour}
          role="option"
          tabindex=${index === 0 ? '0' : '-1'}>
          ${hour.toString().padStart(2, '0')}
        </li>
      `
    );
  }
  /**
   * Renders minute options using minuteStep and marks the selected one with aria-selected. Can be
   * overridden.
   */
  renderMinutes() {
    const minutes = Array.from({ length: 60 / this.minuteStep }, (_, i) => i * this.minuteStep);
    return minutes.map((minute, index) => {
      const isDisabled = __privateMethod(this, _TimeField_instances, isMinuteDisabled_fn).call(
        this,
        minute
      );
      return html`
        <li
          @click=${() => __privateMethod(this, _TimeField_instances, onMinuteClick_fn).call(this, minute)}
          @keydown=${event2 => __privateMethod(this, _TimeField_instances, onMinuteKeydown_fn).call(this, event2, minute)}
          ?disabled=${isDisabled}
          aria-label=${`${minute.toString()} ${getTimeUnitName(this.locale || 'default', 'minute')}`}
          aria-selected=${minute === __privateGet(this, _valueAsNumbers)?.minute && !isDisabled}
          role="option"
          tabindex=${ifDefined(isDisabled ? void 0 : index === 0 ? '0' : '-1')}>
          ${minute.toString().padStart(2, '0')}
        </li>
      `;
    });
  }
  /** Show the time picker. */
  showPicker() {
    this.dialog?.showPopover();
  }
  /** Hide the time picker. */
  hidePicker() {
    this.dialog?.hidePopover();
  }
  /** @internal */
  updateInternalValidity() {
    if (this.validity.customError) {
      return;
    }
    const { hour, minute } = this.timeParts,
      hasCompleteTime = hour !== void 0 && minute !== void 0;
    if (hasCompleteTime && !this.value) {
      const completeParts = this.timeParts;
      const { hour: completeHour, minute: completeMinute } = completeParts;
      if (completeHour < 0 || completeHour > 23 || completeMinute < 0 || completeMinute > 59) {
        this.internals.setValidity(
          { badInput: true },
          msg('Please enter a valid time.', { id: 'sl.timeField.typeMismatch' })
        );
        return;
      }
      const minTime = this.min
          ? __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, this.min)
          : void 0,
        maxTime = this.max
          ? __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, this.max)
          : void 0;
      if (
        minTime &&
        __privateMethod(this, _TimeField_instances, compareTimes_fn).call(
          this,
          completeParts,
          minTime
        ) < 0
      ) {
        this.internals.setValidity(
          { rangeUnderflow: true },
          msg(str`Please select a time that is no earlier than ${this.min}.`, {
            id: 'sl.timeField.rangeUnderflow'
          })
        );
        return;
      } else if (
        maxTime &&
        __privateMethod(this, _TimeField_instances, compareTimes_fn).call(
          this,
          completeParts,
          maxTime
        ) > 0
      ) {
        this.internals.setValidity(
          { rangeOverflow: true },
          msg(str`Please select a time that is no later than ${this.max}.`, {
            id: 'sl.timeField.rangeOverflow'
          })
        );
        return;
      } else {
        this.internals.setValidity(
          { badInput: true },
          msg('Please enter a valid time.', { id: 'sl.timeField.typeMismatch' })
        );
        return;
      }
    }
    if (!hasCompleteTime && (this.timeParts.hour !== void 0 || this.timeParts.minute !== void 0)) {
      this.internals.setValidity(
        { badInput: true },
        msg('Please enter a valid time.', { id: 'sl.timeField.typeMismatch' })
      );
      return;
    }
    if (this.required && !this.value) {
      this.internals.setValidity(
        { valueMissing: true },
        msg('Please enter a time.', { id: 'sl.timeField.valueMissing' })
      );
      return;
    }
    if (this.value && this.min && __privateGet(this, _valueAsNumbers)) {
      const minTime = __privateMethod(this, _TimeField_instances, parseTime_fn).call(
        this,
        this.min
      );
      if (
        minTime &&
        __privateMethod(this, _TimeField_instances, compareTimes_fn).call(
          this,
          __privateGet(this, _valueAsNumbers),
          minTime
        ) < 0
      ) {
        this.internals.setValidity(
          { rangeUnderflow: true },
          msg(str`Please select a time that is no earlier than ${this.min}.`, {
            id: 'sl.timeField.rangeUnderflow'
          })
        );
        return;
      }
    }
    if (this.value && this.max && __privateGet(this, _valueAsNumbers)) {
      const maxTime = __privateMethod(this, _TimeField_instances, parseTime_fn).call(
        this,
        this.max
      );
      if (
        maxTime &&
        __privateMethod(this, _TimeField_instances, compareTimes_fn).call(
          this,
          __privateGet(this, _valueAsNumbers),
          maxTime
        ) > 0
      ) {
        this.internals.setValidity(
          { rangeOverflow: true },
          msg(str`Please select a time that is no later than ${this.max}.`, {
            id: 'sl.timeField.rangeOverflow'
          })
        );
        return;
      }
    }
    this.internals.setValidity({});
  }
};
_events = new WeakMap();
_enteredDigits = new WeakMap();
_preserveTimeParts = new WeakMap();
_popoverJustClosed = new WeakMap();
_rovingIndex = new WeakMap();
_startTime = new WeakMap();
_valueAsNumbers = new WeakMap();
_value = new WeakMap();
_TimeField_instances = new WeakSet();
/** Returns the formatted time string for the select-all input. */
getFormattedValue_fn = function () {
  const locale = this.locale || 'default',
    parts = getTimeFormat(locale);
  return parts
    .map(part => {
      if (part.type === 'literal') {
        return part.value;
      }
      const partType = part.type,
        currentValue = this.timeParts[partType];
      if (currentValue !== void 0) {
        return String(currentValue).padStart(part.value.length, '0');
      }
      return getTimeUnitLetter(locale, partType).repeat(part.value.length);
    })
    .join('');
};
getMaxForType_fn = function (partType) {
  switch (partType) {
    case 'hour':
      return 23;
    case 'minute':
      return 59;
  }
};
getMinForType_fn = function (partType) {
  switch (partType) {
    case 'hour':
    case 'minute':
      return 0;
  }
};
onBeforeToggle_fn = function (event2) {
  if (event2.newState !== 'open') {
    this.button?.setAttribute('aria-expanded', 'false');
    __privateSet(this, _popoverJustClosed, true);
  } else {
    this.button?.setAttribute('aria-expanded', 'true');
  }
};
onClick_fn = function (event2) {
  if (!this.disabled && event2.composedPath()[0] === this) {
    this.focus();
  }
};
_onFocusIn = new WeakMap();
_onFocusOut = new WeakMap();
onButtonClick_fn = function () {
  if (!__privateGet(this, _popoverJustClosed)) {
    this.dialog?.togglePopover();
  }
};
onDialogFocusin_fn = function (event2) {
  const target = event2.target;
  if (!(target instanceof HTMLLIElement)) {
    return;
  }
  this.dialog?.querySelectorAll('li[tabindex="0"]').forEach(li => {
    if (li !== target) {
      li.setAttribute('tabindex', '-1');
    }
  });
  target.tabIndex = 0;
};
onDialogFocusout_fn = function (event2) {
  const relatedTarget = event2.relatedTarget;
  if (relatedTarget instanceof Node && this.dialog?.contains(relatedTarget)) {
    return;
  }
  if (this.dialog && isPopoverOpen(this.dialog)) {
    this.dialog.hidePopover();
  }
};
onHourClick_fn = function (hour) {
  const constrainedMinutes = __privateMethod(
    this,
    _TimeField_instances,
    getConstrainedMinutes_fn
  ).call(this, hour, __privateGet(this, _valueAsNumbers)?.minute ?? 0);
  __privateSet(this, _valueAsNumbers, { hour, minute: constrainedMinutes });
  __privateSet(
    this,
    _value,
    __privateMethod(this, _TimeField_instances, formatTime_fn).call(
      this,
      __privateGet(this, _valueAsNumbers).hour,
      __privateGet(this, _valueAsNumbers).minute
    )
  );
  const { hour: normalizedHours, minute: normalizedMinutes } = __privateGet(this, _valueAsNumbers);
  this.timeParts = { hour: normalizedHours, minute: normalizedMinutes };
  this.requestUpdate('value');
  this.changeEvent.emit(this.value ?? '');
  this.updateState({ dirty: true });
  this.updateValidity();
};
onHourKeydown_fn = function (event2, hours) {
  if (event2.key === 'Enter' || event2.key === ' ') {
    event2.preventDefault();
    __privateMethod(this, _TimeField_instances, onHourClick_fn).call(this, hours);
  }
};
onSeparatorPointerDown_fn = function (event2) {
  event2.preventDefault();
  event2.stopImmediatePropagation();
  event2.target.previousElementSibling?.focus();
};
onKeydown_fn = async function (event2) {
  if (event2.key === 'Escape') {
    event2.stopPropagation();
    requestAnimationFrame(() => {
      this.renderRoot.querySelector('span[role="spinbutton"]')?.focus();
    });
  } else if (['ArrowUp', 'ArrowDown'].includes(event2.key)) {
    event2.preventDefault();
    const activeElement = this.shadowRoot?.activeElement;
    if (!activeElement || !(activeElement instanceof HTMLLIElement)) {
      return;
    }
    const elements = Array.from(activeElement.parentElement?.querySelectorAll('li') ?? []).filter(
      li => !li.hasAttribute('disabled')
    );
    if (elements.length === 0) {
      return;
    }
    let index = elements.indexOf(activeElement);
    if (index === -1) {
      index = 0;
    }
    if (event2.key === 'ArrowUp') {
      index = index === 0 ? elements.length - 1 : index - 1;
    } else if (event2.key === 'ArrowDown') {
      index = index === elements.length - 1 ? 0 : index + 1;
    }
    elements[index]?.focus();
    elements[index]?.scrollIntoView({ block: 'nearest' });
  } else if (['ArrowLeft', 'ArrowRight'].includes(event2.key)) {
    event2.preventDefault();
    await __privateMethod(this, _TimeField_instances, scrollAndFocusStartTime_fn).call(
      this,
      event2.key === 'ArrowRight' ? 'minute' : 'hour'
    );
  }
};
onMinuteClick_fn = function (minute) {
  if (__privateMethod(this, _TimeField_instances, isMinuteDisabled_fn).call(this, minute)) {
    return;
  }
  __privateSet(this, _valueAsNumbers, {
    hour: __privateGet(this, _valueAsNumbers)?.hour ?? __privateGet(this, _startTime)?.hour ?? 0,
    minute
  });
  __privateSet(
    this,
    _value,
    __privateMethod(this, _TimeField_instances, formatTime_fn).call(
      this,
      __privateGet(this, _valueAsNumbers).hour ?? 0,
      __privateGet(this, _valueAsNumbers).minute ?? 0
    )
  );
  const { hour: normalizedHours, minute: normalizedMinutes } = __privateGet(this, _valueAsNumbers);
  this.timeParts = { hour: normalizedHours, minute: normalizedMinutes };
  this.requestUpdate('value');
  this.changeEvent.emit(this.value ?? '');
  this.updateState({ dirty: true });
  this.updateValidity();
  this.dialog?.hidePopover();
  this.renderRoot.querySelectorAll('span[role="spinbutton"]')[1]?.focus();
};
onMinuteKeydown_fn = function (event2, minutes) {
  if (__privateMethod(this, _TimeField_instances, isMinuteDisabled_fn).call(this, minutes)) {
    return;
  }
  if (event2.key === 'Enter' || event2.key === ' ') {
    event2.preventDefault();
    __privateMethod(this, _TimeField_instances, onMinuteClick_fn).call(this, minutes);
  }
};
onPartBlur_fn = function (event2) {
  const relatedTarget = event2.relatedTarget,
    isSpinbutton =
      relatedTarget?.getAttribute('role') === 'spinbutton' &&
      this.renderRoot.contains(relatedTarget);
  if (!isSpinbutton) {
    this.renderRoot.ownerDocument.getSelection()?.removeAllRanges();
  }
  if (!this.selectAll) {
    this.internals.states.delete('has-focus');
  }
};
onPartFocus_fn = function (event2) {
  const span = event2.composedPath().at(0),
    spans = Array.from(this.renderRoot.querySelectorAll('span[role="spinbutton"]')),
    index = spans.indexOf(span);
  if (index >= 0 && index !== __privateGet(this, _rovingIndex)) {
    __privateSet(this, _rovingIndex, index);
    this.requestUpdate();
  }
  __privateSet(this, _enteredDigits, 0);
  this.internals.states.add('has-focus');
  __privateMethod(this, _TimeField_instances, selectContentOnNextFrame_fn).call(this, span);
};
onPartKeydown_fn = function (event2, partType) {
  const span = event2.target;
  const locale = this.locale || 'default',
    parts = getTimeFormat(locale),
    separators = parts.filter(p => p.type === 'literal').map(p => p.value);
  if (separators.includes(event2.key)) {
    event2.preventDefault();
    __privateMethod(this, _TimeField_instances, moveFocus_fn).call(this, span, 1);
    return;
  }
  if ((event2.ctrlKey || event2.metaKey) && event2.key === 'a') {
    event2.preventDefault();
    this.selectAll = true;
    this.internals.states.add('has-focus');
    requestAnimationFrame(() => {
      const selectAll = this.renderRoot.querySelector('.select-all');
      selectAll.focus();
      __privateMethod(this, _TimeField_instances, selectContent_fn).call(this, selectAll);
    });
    return;
  }
  if (event2.key >= '0' && event2.key <= '9') {
    event2.preventDefault();
    if (this.readonly || this.selectOnly) {
      return;
    }
    const digit = parseInt(event2.key, 10);
    const wasEmpty =
      this.timeParts[partType] === void 0 || __privateGet(this, _enteredDigits) === 0;
    __privateMethod(this, _TimeField_instances, applyDigitToTimePart_fn).call(
      this,
      partType,
      digit
    );
    const shouldAutoAdvance =
      __privateGet(this, _enteredDigits) >= 2 ||
      (wasEmpty &&
        __privateMethod(this, _TimeField_instances, shouldAutoAdvanceOnSingleDigit_fn).call(
          this,
          partType,
          digit
        ));
    if (shouldAutoAdvance) {
      __privateSet(this, _enteredDigits, 0);
      __privateMethod(this, _TimeField_instances, moveFocus_fn).call(this, span, 1);
    } else {
      __privateMethod(this, _TimeField_instances, selectContentOnNextFrame_fn).call(this, span);
    }
    __privateMethod(this, _TimeField_instances, trySetValue_fn).call(this, true);
    return;
  }
  switch (event2.key) {
    case 'ArrowUp':
      event2.preventDefault();
      if (!this.readonly && !this.selectOnly) {
        __privateMethod(this, _TimeField_instances, adjustTimePart_fn).call(
          this,
          partType,
          partType === 'hour' ? this.hourStep : this.minuteStep
        );
        __privateMethod(this, _TimeField_instances, selectContent_fn).call(this, span);
        __privateMethod(this, _TimeField_instances, trySetValue_fn).call(this);
      }
      break;
    case 'ArrowDown':
      event2.preventDefault();
      if (!this.readonly && !this.selectOnly) {
        __privateMethod(this, _TimeField_instances, adjustTimePart_fn).call(
          this,
          partType,
          partType === 'hour' ? -this.hourStep : -this.minuteStep
        );
        __privateMethod(this, _TimeField_instances, selectContent_fn).call(this, span);
        __privateMethod(this, _TimeField_instances, trySetValue_fn).call(this);
      }
      break;
    case 'ArrowLeft':
      event2.preventDefault();
      __privateMethod(this, _TimeField_instances, moveFocus_fn).call(this, span, -1);
      break;
    case 'ArrowRight':
      event2.preventDefault();
      __privateMethod(this, _TimeField_instances, moveFocus_fn).call(this, span, 1);
      break;
    case 'Backspace':
    case 'Delete':
      event2.preventDefault();
      if (!this.readonly && !this.selectOnly) {
        this.timeParts = {
          hour: partType === 'hour' ? void 0 : this.timeParts.hour,
          minute: partType === 'minute' ? void 0 : this.timeParts.minute
        };
        __privateSet(this, _enteredDigits, 0);
        __privateMethod(this, _TimeField_instances, selectContent_fn).call(this, span);
        __privateMethod(this, _TimeField_instances, trySetValue_fn).call(this);
      }
      break;
  }
  if (event2.key.length === 1 && !event2.ctrlKey && !event2.metaKey) {
    event2.preventDefault();
  }
};
onSelectAllBlur_fn = function () {
  __privateMethod(this, _TimeField_instances, exitSelectAll_fn).call(this);
};
onSelectAllKeydown_fn = function (event2) {
  if (['Control', 'Meta', 'Shift', 'Alt'].includes(event2.key)) {
    return;
  }
  if ((event2.ctrlKey || event2.metaKey) && (event2.key === 'c' || event2.key === 'C')) {
    return;
  }
  if (event2.key === 'Tab') {
    __privateMethod(this, _TimeField_instances, exitSelectAll_fn).call(this);
    if (!event2.shiftKey) {
      event2.preventDefault();
      requestAnimationFrame(() => {
        this.renderRoot.querySelector('sl-field-button')?.focus();
      });
    }
    return;
  }
  if (event2.key === 'Backspace' || event2.key === 'Delete') {
    event2.preventDefault();
    this.timeParts = {};
    __privateSet(this, _enteredDigits, 0);
    this.value = void 0;
    this.changeEvent.emit(this.value ?? '');
    this.updateState({ dirty: true });
    this.updateValidity();
    __privateMethod(this, _TimeField_instances, exitSelectAll_fn).call(this, true);
    return;
  }
  event2.preventDefault();
  __privateMethod(this, _TimeField_instances, exitSelectAll_fn).call(this, true);
};
onSelectAllMouseDown_fn = function (event2) {
  event2.preventDefault();
  __privateMethod(this, _TimeField_instances, exitSelectAll_fn).call(this, true);
};
exitSelectAll_fn = function (refocus = false) {
  this.selectAll = false;
  this.internals.states.delete('has-focus');
  if (refocus) {
    requestAnimationFrame(() => {
      this.renderRoot.querySelector('span[role="spinbutton"]')?.focus();
    });
  }
};
/**
 * Selects the content of the given part on the next frame, but only if it still has focus by then.
 * Selecting the content of a contenteditable moves focus into it, so doing this after focus has
 * already moved on (by tabbing to the field button, for example) would steal it back.
 */
selectContentOnNextFrame_fn = function (span) {
  requestAnimationFrame(() => {
    if (this.shadowRoot?.activeElement === span) {
      __privateMethod(this, _TimeField_instances, selectContent_fn).call(this, span);
    }
  });
};
selectContent_fn = function (span) {
  const ownerDocument = span.ownerDocument;
  if (!ownerDocument) {
    return;
  }
  const selection = ownerDocument.getSelection();
  if (!selection) {
    return;
  }
  selection.removeAllRanges();
  if (typeof selection.setBaseAndExtent === 'function') {
    selection.setBaseAndExtent(span, 0, span, span.childNodes.length);
  } else {
    const range = ownerDocument.createRange();
    range.selectNodeContents(span);
    selection.addRange(range);
  }
};
moveFocus_fn = function (span, direction) {
  const spans = Array.from(this.renderRoot.querySelectorAll('span[role="spinbutton"]')),
    index = spans.indexOf(span),
    next = spans[index + direction];
  if (next) {
    next.focus();
  }
};
applyDigitToTimePart_fn = function (partType, digit) {
  const currentValue = this.timeParts[partType],
    maxValue = __privateMethod(this, _TimeField_instances, getMaxForType_fn).call(this, partType);
  let newValue;
  if (currentValue === void 0 || __privateGet(this, _enteredDigits) === 0) {
    newValue = digit;
  } else {
    const combined = currentValue * 10 + digit;
    newValue = combined > maxValue ? digit : combined;
  }
  this.timeParts = {
    hour: partType === 'hour' ? newValue : this.timeParts.hour,
    minute: partType === 'minute' ? newValue : this.timeParts.minute
  };
  __privateWrapper(this, _enteredDigits)._++;
};
adjustTimePart_fn = function (partType, delta) {
  const startTime = __privateMethod(this, _TimeField_instances, getStartTime_fn).call(this),
    currentValue =
      this.timeParts[partType] ?? (partType === 'hour' ? startTime.hour : startTime.minute),
    maxValue = __privateMethod(this, _TimeField_instances, getMaxForType_fn).call(this, partType),
    minTime = this.min
      ? __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, this.min)
      : void 0,
    maxTime = this.max
      ? __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, this.max)
      : void 0,
    wrapped = ((((currentValue || 0) + delta) % (maxValue + 1)) + (maxValue + 1)) % (maxValue + 1),
    currentHour = this.timeParts.hour ?? startTime.hour,
    effectiveMin =
      partType === 'hour'
        ? (minTime?.hour ?? 0)
        : minTime && currentHour === minTime.hour
          ? (minTime.minute ?? 0)
          : 0,
    effectiveMax =
      partType === 'hour'
        ? (maxTime?.hour ?? maxValue)
        : maxTime && currentHour === maxTime.hour
          ? (maxTime.minute ?? maxValue)
          : maxValue,
    newValue = Math.min(Math.max(wrapped, effectiveMin), effectiveMax);
  this.timeParts = {
    hour: partType === 'hour' ? newValue : this.timeParts.hour,
    minute: partType === 'minute' ? newValue : this.timeParts.minute
  };
  __privateSet(this, _enteredDigits, 0);
};
/**
 * Compares two time objects.
 *
 * @param time1 The first time as a TimePart object.
 * @param time2 The second time as a TimePart object.
 * @returns A negative number if time1 is earlier than time2, a positive number if time1 is later
 *   than time2, or 0 if they are equal.
 */
compareTimes_fn = function (time1, time2) {
  const totalMinutes1 = time1.hour * 60 + time1.minute,
    totalMinutes2 = time2.hour * 60 + time2.minute;
  return totalMinutes1 - totalMinutes2;
};
/**
 * Determines if we should auto-advance to the next field after entering a single digit. For hours:
 * digits 3-9 make a second digit impossible (since max hour is 23) For minutes: digits 6-9 make a
 * second digit impossible (since max minute is 59)
 */
shouldAutoAdvanceOnSingleDigit_fn = function (partType, digit) {
  if (partType === 'hour') {
    return digit >= 3;
  } else {
    return digit >= 6;
  }
};
trySetValue_fn = function (digit) {
  const { hour, minute } = this.timeParts,
    hadValue = this.value !== void 0;
  if (hour !== void 0 && minute !== void 0) {
    let constrainedMinutes = __privateMethod(
      this,
      _TimeField_instances,
      getConstrainedMinutes_fn
    ).call(this, hour, minute);
    if (digit) {
      constrainedMinutes = Math.min(Math.max(minute, 0), 59);
    }
    __privateSet(this, _valueAsNumbers, { hour, minute: constrainedMinutes });
    __privateSet(
      this,
      _value,
      __privateMethod(this, _TimeField_instances, formatTime_fn).call(
        this,
        hour,
        constrainedMinutes
      )
    );
    this.requestUpdate('value');
    __privateMethod(this, _TimeField_instances, scrollTimeIntoView_fn).call(
      this,
      hour,
      constrainedMinutes
    );
    this.changeEvent.emit(this.value ?? '');
    this.updateState({ dirty: true });
    this.updateValidity();
  } else {
    __privateSet(this, _preserveTimeParts, true);
    __privateSet(this, _valueAsNumbers, void 0);
    __privateSet(this, _value, void 0);
    this.requestUpdate('value');
    if (hadValue) {
      this.changeEvent.emit(this.value ?? '');
      this.updateState({ dirty: true });
    }
    this.updateValidity();
  }
};
onPaste_fn = function (event2) {
  event2.preventDefault();
  if (this.readonly || this.disabled || this.selectOnly) {
    return;
  }
  const text = event2.clipboardData?.getData('text/plain') ?? '',
    time = __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, text);
  if (time && !Number.isNaN(time.hour) && !Number.isNaN(time.minute)) {
    const formattedTime = __privateMethod(this, _TimeField_instances, formatTime_fn).call(
      this,
      time.hour,
      time.minute
    );
    if (formattedTime) {
      __privateSet(this, _valueAsNumbers, time);
      __privateSet(this, _value, formattedTime);
      this.timeParts = { hour: time.hour, minute: time.minute };
      this.requestUpdate('value');
      this.changeEvent.emit(this.value ?? '');
      this.updateState({ dirty: true });
      this.updateValidity();
    }
  }
};
onToggle_fn = async function (event2) {
  if (event2.newState === 'closed') {
    __privateSet(this, _popoverJustClosed, false);
  } else {
    await __privateMethod(this, _TimeField_instances, scrollAndFocusStartTime_fn).call(this);
  }
};
formatTime_fn = function (hours, minutes) {
  if (
    hours === void 0 ||
    minutes === void 0 ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return void 0;
  }
  return `${hours.toString().padStart(2, '0')}${__privateMethod(this, _TimeField_instances, getTimeSeparator_fn).call(this)}${minutes.toString().padStart(2, '0')}`;
};
isMinuteDisabled_fn = function (minutes) {
  const hour =
    __privateGet(this, _valueAsNumbers)?.hour ?? __privateGet(this, _startTime)?.hour ?? 0;
  if (this.min) {
    const minTime = __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, this.min);
    if (minTime && hour === minTime.hour && minutes < (minTime.minute ?? 0)) {
      return true;
    }
  }
  if (this.max) {
    const maxTime = __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, this.max);
    if (maxTime && hour === maxTime.hour && minutes > (maxTime.minute ?? 59)) {
      return true;
    }
  }
  return false;
};
parseTime_fn = function (value) {
  const timeParts = value
    .split(__privateMethod(this, _TimeField_instances, getTimeSeparator_fn).call(this))
    .map(Number);
  if (timeParts.length === 2) {
    return { hour: timeParts[0], minute: timeParts[1] };
  } else {
    return void 0;
  }
};
getStartTime_fn = function () {
  let time = __privateGet(this, _valueAsNumbers);
  if (!time && this.start) {
    time = __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, this.start);
  }
  if (!time) {
    const now = /* @__PURE__ */ new Date();
    let hour = Math.ceil(now.getHours() / this.hourStep) * this.hourStep;
    const minute = 0;
    if (hour >= 24) {
      hour = 0;
    }
    time = { hour, minute };
  }
  return time;
};
getConstrainedMinutes_fn = function (hours, minutes) {
  const minTime = this.min
      ? __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, this.min)
      : void 0,
    maxTime = this.max
      ? __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, this.max)
      : void 0;
  if (minTime && hours === minTime.hour && minutes < (minTime.minute ?? 0)) {
    const constrained = Math.ceil((minTime.minute ?? 0) / this.minuteStep) * this.minuteStep;
    return Math.min(Math.max(constrained, 0), 59);
  }
  if (maxTime && hours === maxTime.hour && minutes > (maxTime.minute ?? 59)) {
    const constrained = Math.floor((maxTime.minute ?? 59) / this.minuteStep) * this.minuteStep;
    return Math.min(Math.max(constrained, 0), 59);
  }
  return Math.min(Math.max(minutes, 0), 59);
};
getTimeSeparator_fn = function () {
  const locale = this.locale && this.locale !== 'default' ? this.locale : void 0;
  if (locale && timeSeparators.has(locale)) {
    return timeSeparators.get(locale);
  }
  const formatter = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }),
    parts = formatter.formatToParts(/* @__PURE__ */ new Date()),
    separator = parts.find(part => part.type === 'literal')?.value ?? ':';
  timeSeparators.set(this.locale || 'default', separator);
  return separator;
};
scrollAndFocusStartTime_fn = async function (focus = 'hour') {
  const time = __privateSet(this, _startTime, {
      ...__privateMethod(this, _TimeField_instances, getStartTime_fn).call(this)
    }),
    minTime = this.min
      ? __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, this.min)
      : void 0,
    maxTime = this.max
      ? __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, this.max)
      : void 0;
  time.hour = Math.round(time.hour / this.hourStep) * this.hourStep;
  time.minute = Math.round(time.minute / this.minuteStep) * this.minuteStep;
  if (
    minTime &&
    (time.hour < minTime.hour || (time.hour === minTime.hour && time.minute < minTime.minute))
  ) {
    time.hour = minTime.hour;
    const roundedMinutes = Math.ceil(minTime.minute / this.minuteStep) * this.minuteStep;
    if (roundedMinutes >= 60) {
      if (minTime.hour < 23) {
        time.hour = minTime.hour + 1;
        time.minute = 0;
      } else {
        time.minute = 59;
      }
    } else {
      time.minute = roundedMinutes;
    }
  }
  if (
    maxTime &&
    (time.hour > maxTime.hour || (time.hour === maxTime.hour && time.minute > maxTime.minute))
  ) {
    time.hour = maxTime.hour;
    time.minute = Math.floor(maxTime.minute / this.minuteStep) * this.minuteStep;
  }
  this.requestUpdate();
  await this.updateComplete;
  __privateMethod(this, _TimeField_instances, scrollTimeIntoView_fn).call(
    this,
    time.hour,
    time.minute,
    'start'
  );
  __privateMethod(this, _TimeField_instances, focusTimeElement_fn).call(
    this,
    time.hour,
    time.minute,
    focus
  );
};
scrollTimeIntoView_fn = function (hours, minutes, block = 'nearest') {
  const hoursEl = this.renderRoot.querySelector('.hours'),
    minutesEl = this.renderRoot.querySelector('.minutes');
  let minHour = 0;
  if (this.min) {
    minHour =
      __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, this.min)?.hour ?? 0;
  }
  const hoursIndex = Math.floor((hours - minHour) / this.hourStep),
    minutesIndex = Math.floor((minutes ?? 0) / this.minuteStep);
  hoursEl.children[hoursIndex]?.scrollIntoView({ block });
  if (minutes !== void 0) {
    minutesEl.children[minutesIndex]?.scrollIntoView({ block });
  }
};
focusTimeElement_fn = function (hours, minutes, focus) {
  const hoursEl = this.renderRoot.querySelector('.hours'),
    minutesEl = this.renderRoot.querySelector('.minutes');
  let minHour = 0;
  if (this.min) {
    minHour =
      __privateMethod(this, _TimeField_instances, parseTime_fn).call(this, this.min)?.hour ?? 0;
  }
  const hoursIndex = Math.floor((hours - minHour) / this.hourStep),
    minutesIndex = Math.floor(minutes / this.minuteStep);
  if (focus === 'hour') {
    hoursEl.children[hoursIndex]?.focus();
  } else if (focus === 'minute') {
    const targetMinuteEl = minutesEl.children[minutesIndex];
    if (targetMinuteEl?.hasAttribute('disabled')) {
      const firstEnabledMinute = Array.from(minutesEl.children).find(
        child => !child.hasAttribute('disabled')
      );
      firstEnabledMinute?.focus();
    } else {
      targetMinuteEl?.focus();
    }
  }
};
/** @internal */
TimeField.formAssociated = true;
/** The default step between each hour option. */
TimeField.hourStep = 1;
/** The default step between each minute option. */
TimeField.minuteStep = 5;
/** @internal The default offset of the popover to the text-field. */
TimeField.offset = 6;
/** @internal */
TimeField.styles = styles;
/** @internal The default margin between the popover and the viewport. */
TimeField.viewportMargin = 8;
__decorateClass([event({ name: 'sl-blur' })], TimeField.prototype, 'blurEvent', 2);
__decorateClass([query('sl-field-button')], TimeField.prototype, 'button', 2);
__decorateClass([event({ name: 'sl-change' })], TimeField.prototype, 'changeEvent', 2);
__decorateClass([query('dialog')], TimeField.prototype, 'dialog', 2);
__decorateClass([property({ type: Boolean, reflect: true })], TimeField.prototype, 'disabled', 2);
__decorateClass([event({ name: 'sl-focus' })], TimeField.prototype, 'focusEvent', 2);
__decorateClass(
  [property({ type: Number, attribute: 'hour-step' })],
  TimeField.prototype,
  'hourStep',
  2
);
__decorateClass([property()], TimeField.prototype, 'max', 2);
__decorateClass([property()], TimeField.prototype, 'min', 2);
__decorateClass(
  [property({ type: Number, attribute: 'minute-step' })],
  TimeField.prototype,
  'minuteStep',
  2
);
__decorateClass([property()], TimeField.prototype, 'placeholder', 2);
__decorateClass([state()], TimeField.prototype, 'placeholderShown', 2);
__decorateClass([property({ type: Boolean })], TimeField.prototype, 'readonly', 2);
__decorateClass([property({ type: Boolean, reflect: true })], TimeField.prototype, 'required', 2);
__decorateClass([state()], TimeField.prototype, 'selectAll', 2);
__decorateClass(
  [property({ type: Boolean, reflect: true, attribute: 'select-only' })],
  TimeField.prototype,
  'selectOnly',
  2
);
__decorateClass([property()], TimeField.prototype, 'start', 2);
__decorateClass([state()], TimeField.prototype, 'timeParts', 2);
__decorateClass([property()], TimeField.prototype, 'value', 1);
TimeField = __decorateClass([localized()], TimeField);
//# sourceMappingURL=time-field.js.map
