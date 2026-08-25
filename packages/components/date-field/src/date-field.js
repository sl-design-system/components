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
  _formatter,
  _slotObserver,
  _preserveDateParts,
  _rovingIndex,
  _opening,
  _openDialogCancelled,
  _DateField_instances,
  openDialog_fn,
  onButtonClick_fn,
  onChange_fn,
  onClick_fn,
  onConfirm_fn,
  _onFocusIn,
  _onFocusOut,
  onKeydown_fn,
  onPartBlur_fn,
  onPartFocus_fn,
  onPartKeydown_fn,
  onPaste_fn,
  onSelectAllBlur_fn,
  onSelectAllKeydown_fn,
  onSelectAllMouseDown_fn,
  onSeparatorPointerDown_fn,
  onSlotChange_fn,
  updateHasActionSlotContent_fn,
  onClose_fn,
  onDialogClick_fn,
  adjustDatePart_fn,
  applyDigitToDatePart_fn,
  exitSelectAll_fn,
  getFormattedValue_fn,
  getMaxForType_fn,
  getMinForType_fn,
  hasPartialDate_fn,
  selectContent_fn,
  moveFocus_fn,
  setValueAndCloseDialog_fn,
  trySetValue_fn;
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Calendar } from '@sl-design-system/calendar';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { EventsController, LocaleMixin, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { isSameDate } from '@sl-design-system/shared/date.js';
import { FieldButton } from '@sl-design-system/text-field';
import { LitElement, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './date-field.scss.js';
import {
  getDateFormat,
  getDateUnitLetter,
  getDateUnitName,
  getMonthName,
  parseDateString
} from './utils.js';
export let DateField = class extends LocaleMixin(
  FormControlMixin(ScopedElementsMixin(LitElement))
) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _DateField_instances);
    /** Events controller. */
    // eslint-disable-next-line no-unused-private-class-members
    __privateAdd(
      this,
      _events,
      new EventsController(this, {
        click: __privateMethod(this, _DateField_instances, onClick_fn)
      })
    );
    /** Tracks how many digits have been entered for the current part. */
    __privateAdd(this, _enteredDigits, 0);
    /** Formatter for displaying the value and validation messages. */
    __privateAdd(this, _formatter);
    /** Watches light DOM changes so action controls can be rendered only when needed. */
    __privateAdd(
      this,
      _slotObserver,
      new MutationObserver(() =>
        __privateMethod(this, _DateField_instances, updateHasActionSlotContent_fn).call(this)
      )
    );
    /**
     * Flag to prevent willUpdate from clearing dateParts when the value is set to undefined
     * internally (e.g. when the user enters an invalid date).
     */
    __privateAdd(this, _preserveDateParts, false);
    /** The index of the active date part for roving tabindex. */
    __privateAdd(this, _rovingIndex, 0);
    /** Guard to prevent concurrent #openDialog() calls. */
    __privateAdd(this, _opening, false);
    /** Used to cancel a pending #openDialog() before showModal() runs. */
    __privateAdd(this, _openDialogCancelled, false);
    this.dateParts = {};
    /** @internal */
    this.internals = this.attachInternals();
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
      }
    });
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-calendar': Calendar,
      'sl-field-button': FieldButton,
      'sl-icon': Icon
    };
  }
  /**
   * The calendar element. This will return an instance of the calendar when the dialog is shown or
   * always when the calendar is slotted. Otherwise it will return undefined.
   */
  get calendar() {
    return (
      this.querySelector('sl-calendar[slot="calendar"]') ??
      this.renderRoot.querySelector('sl-calendar')
    );
  }
  get formValue() {
    if (!this.value) {
      return null;
    }
    const y = this.value.getFullYear(),
      m = String(this.value.getMonth() + 1).padStart(2, '0'),
      d = String(this.value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  set formValue(value) {
    if (value instanceof Date) {
      this.value = value;
    } else if (typeof value === 'string') {
      this.value = parseDateString(value, this.locale ?? 'default');
    } else {
      this.value = void 0;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.internals.role = 'group';
    this.setFormControlElement(this);
    this.addEventListener('focusin', __privateGet(this, _onFocusIn));
    this.addEventListener('focusout', __privateGet(this, _onFocusOut));
    __privateGet(this, _slotObserver).observe(this, {
      attributeFilter: ['slot'],
      attributes: true,
      childList: true,
      subtree: true
    });
    __privateMethod(this, _DateField_instances, updateHasActionSlotContent_fn).call(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('focusin', __privateGet(this, _onFocusIn));
    this.removeEventListener('focusout', __privateGet(this, _onFocusOut));
    __privateGet(this, _slotObserver).disconnect();
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('locale')) {
      __privateSet(
        this,
        _formatter,
        new Intl.DateTimeFormat(this.locale, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      );
    }
    if (changes.has('locale') || changes.has('value')) {
      if (this.value) {
        this.dateParts = {
          day: this.value.getDate(),
          month: this.value.getMonth() + 1,
          year: this.value.getFullYear()
        };
      } else if (changes.get('value') !== void 0 && !__privateGet(this, _preserveDateParts)) {
        this.dateParts = {};
        __privateSet(this, _enteredDigits, 0);
      }
      __privateSet(this, _preserveDateParts, false);
    }
    if (changes.has('dateParts') || changes.has('placeholder') || changes.has('value')) {
      if (this.value || __privateMethod(this, _DateField_instances, hasPartialDate_fn).call(this)) {
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
      if (this.calendar && !isSameDate(this.value, this.calendar?.selected)) {
        this.calendar.selected = this.value;
      }
      if (this.value) {
        this.internals.states.add('has-value');
      } else {
        this.internals.states.delete('has-value');
      }
      this.internals.setFormValue(this.formValue);
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
    const locale = this.locale ?? 'default',
      parts = getDateFormat(locale),
      hasExtraControls = this.requireConfirmation || this.hasActionSlotContent;
    return html`
      <div class="field">
        <div class="wrapper">
          ${
            this.selectAll
              ? html`
                  <span
                    @blur=${__privateMethod(this, _DateField_instances, onSelectAllBlur_fn)}
                    @keydown=${__privateMethod(this, _DateField_instances, onSelectAllKeydown_fn)}
                    @mousedown=${__privateMethod(this, _DateField_instances, onSelectAllMouseDown_fn)}
                    class="select-all"
                    contenteditable="true">
                    ${__privateMethod(this, _DateField_instances, getFormattedValue_fn).call(this)}
                  </span>
                `
              : html`
                  <div class="parts">${parts.map(part => this.renderPart(part, locale))}</div>
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
          @click=${__privateMethod(this, _DateField_instances, onButtonClick_fn)}
          ?disabled=${this.disabled || this.readonly}
          aria-controls="dialog"
          aria-expanded=${this.dialog?.open ? 'true' : 'false'}
          aria-haspopup="dialog"
          aria-label=${msg('Select date', { id: 'sl.dateField.selectDate' })}
          tabindex=${this.disabled || this.readonly ? '-1' : '0'}>
          <sl-icon name="calendar"></sl-icon>
        </sl-field-button>
      </div>

      <dialog
        @cancel=${e => e.preventDefault()}
        @click=${__privateMethod(this, _DateField_instances, onDialogClick_fn)}
        @close=${__privateMethod(this, _DateField_instances, onClose_fn)}
        @keydown=${__privateMethod(this, _DateField_instances, onKeydown_fn)}
        aria-label=${msg('Select date', { id: 'sl.dateField.selectDate' })}
        id="dialog">
        ${
          this.calendarVisible
            ? html`
                <slot
                  @slotchange=${__privateMethod(this, _DateField_instances, onSlotChange_fn)}
                  @sl-change=${__privateMethod(this, _DateField_instances, onChange_fn)}
                  name="calendar">
                  <sl-calendar
                    .selected=${this.value}
                    ?show-week-numbers=${this.showWeekNumbers}
                    first-day-of-week=${ifDefined(this.firstDayOfWeek)}
                    locale=${ifDefined(this.locale)}
                    max=${ifDefined(this.max?.toISOString())}
                    min=${ifDefined(this.min?.toISOString())}
                    month=${ifDefined(this.month?.toISOString())}
                    show-today></sl-calendar>
                </slot>
                ${
                  hasExtraControls
                    ? html`
                        <sl-button-bar>
                          <slot></slot>
                          ${
                            this.requireConfirmation
                              ? html`
                                  <sl-button
                                    @click=${__privateMethod(this, _DateField_instances, onConfirm_fn)}
                                    variant="primary">
                                    ${msg('Confirm', { id: 'sl.dateField.confirm' })}
                                    <sl-icon name="check"></sl-icon>
                                  </sl-button>
                                `
                              : nothing
                          }
                        </sl-button-bar>
                      `
                    : nothing
                }
              `
            : nothing
        }
      </dialog>
    `;
  }
  /** @internal */
  renderPart(part, locale) {
    if (part.type === 'literal') {
      return html`
        <span
          @pointerdown=${__privateMethod(this, _DateField_instances, onSeparatorPointerDown_fn)}
          class="separator"
          >${part.value}</span
        >
      `;
    }
    const partType = part.type,
      formatParts = getDateFormat(locale),
      datePartTypes = formatParts.filter(p => p.type !== 'literal').map(p => p.type),
      datePartIndex = datePartTypes.indexOf(partType),
      placeholder = getDateUnitLetter(locale, partType).repeat(part.value.length),
      currentValue = this.dateParts[partType],
      hasValue = currentValue !== void 0,
      displayValue = hasValue ? String(currentValue).padStart(part.value.length, '0') : placeholder,
      isMonth = partType === 'month',
      isValidMonth =
        isMonth && typeof currentValue === 'number' && currentValue >= 1 && currentValue <= 12,
      valueText = hasValue
        ? isMonth
          ? isValidMonth
            ? getMonthName(locale, currentValue)
            : String(currentValue).padStart(part.value.length, '0')
          : String(currentValue)
        : msg('Empty', { id: 'sl.dateField.empty' });
    return html`
      <span
        @beforeinput=${e => e.preventDefault()}
        @blur=${__privateMethod(this, _DateField_instances, onPartBlur_fn)}
        @focus=${__privateMethod(this, _DateField_instances, onPartFocus_fn)}
        @keydown=${e => __privateMethod(this, _DateField_instances, onPartKeydown_fn).call(this, e, partType)}
        @paste=${__privateMethod(this, _DateField_instances, onPaste_fn)}
        @drop=${e => e.preventDefault()}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-label=${getDateUnitName(locale, partType)}
        aria-readonly=${this.readonly || this.selectOnly ? 'true' : 'false'}
        aria-valuemax=${__privateMethod(this, _DateField_instances, getMaxForType_fn).call(this, partType)}
        aria-valuemin=${__privateMethod(this, _DateField_instances, getMinForType_fn).call(this, partType)}
        aria-valuenow=${ifDefined(currentValue)}
        aria-valuetext=${valueText}
        contenteditable=${this.disabled || this.readonly || this.selectOnly ? 'false' : 'true'}
        inputmode="numeric"
        role="spinbutton"
        tabindex=${ifDefined(
          this.disabled ? void 0 : datePartIndex === __privateGet(this, _rovingIndex) ? '0' : '-1'
        )}
        >${displayValue}</span
      >
    `;
  }
  /** @internal */
  updateInternalValidity() {
    const { day, month, year } = this.dateParts,
      hasCompleteDate = day !== void 0 && month !== void 0 && year !== void 0;
    if (hasCompleteDate && !this.value) {
      const date = new Date(year, month - 1, day);
      if (this.min && date < this.min) {
        const formattedMin =
          __privateGet(this, _formatter)?.format(this.min) ?? this.min.toLocaleDateString();
        this.setCustomValidity(
          msg(str`Please select a date that is no earlier than ${formattedMin}.`, {
            id: 'sl.dateField.rangeUnderflow'
          })
        );
      } else if (this.max && date > this.max) {
        const formattedMax =
          __privateGet(this, _formatter)?.format(this.max) ?? this.max.toLocaleDateString();
        this.setCustomValidity(
          msg(str`Please select a date that is no later than ${formattedMax}.`, {
            id: 'sl.dateField.rangeOverflow'
          })
        );
      } else {
        this.setCustomValidity(
          msg('Please enter a valid date.', { id: 'sl.dateField.typeMismatch' })
        );
      }
    } else if (this.required && !this.value) {
      this.setCustomValidity(msg('Please enter a date.', { id: 'sl.dateField.valueMissing' }));
    } else if (this.value && this.min && this.value < this.min) {
      const formattedMin =
        __privateGet(this, _formatter)?.format(this.min) ?? this.min.toLocaleDateString();
      this.setCustomValidity(
        msg(str`Please select a date that is no earlier than ${formattedMin}.`, {
          id: 'sl.dateField.rangeUnderflow'
        })
      );
    } else if (this.value && this.max && this.value > this.max) {
      const formattedMax =
        __privateGet(this, _formatter)?.format(this.max) ?? this.max.toLocaleDateString();
      this.setCustomValidity(
        msg(str`Please select a date that is no later than ${formattedMax}.`, {
          id: 'sl.dateField.rangeOverflow'
        })
      );
    } else {
      this.setCustomValidity('');
    }
  }
  /** Show the date picker. */
  showPicker() {
    if (this.dialog?.open) {
      return;
    }
    void __privateMethod(this, _DateField_instances, openDialog_fn).call(this);
  }
  /** Hide the date picker. */
  hidePicker() {
    __privateSet(this, _openDialogCancelled, true);
    if (__privateGet(this, _opening) && !this.dialog?.open) {
      this.calendarVisible = false;
      this.requestUpdate();
      return;
    }
    if (this.dialog?.open) {
      this.dialog.close();
      this.requestUpdate();
    }
  }
};
_events = new WeakMap();
_enteredDigits = new WeakMap();
_formatter = new WeakMap();
_slotObserver = new WeakMap();
_preserveDateParts = new WeakMap();
_rovingIndex = new WeakMap();
_opening = new WeakMap();
_openDialogCancelled = new WeakMap();
_DateField_instances = new WeakSet();
openDialog_fn = async function () {
  if (__privateGet(this, _opening)) {
    return;
  }
  __privateSet(this, _opening, true);
  __privateSet(this, _openDialogCancelled, false);
  try {
    this.calendarVisible = true;
    await this.updateComplete;
    if (__privateGet(this, _openDialogCancelled)) {
      return;
    }
    if (!this.dialog?.open) {
      this.dialog?.showModal();
      this.requestUpdate();
    }
    requestAnimationFrame(() => {
      if (this.dialog?.open) {
        this.calendar?.focus();
      }
    });
  } finally {
    __privateSet(this, _opening, false);
  }
};
onButtonClick_fn = function () {
  if (this.dialog?.open || __privateGet(this, _opening)) {
    this.hidePicker();
  } else {
    this.showPicker();
  }
};
onChange_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
  if (this.requireConfirmation) {
    return;
  }
  __privateMethod(this, _DateField_instances, setValueAndCloseDialog_fn).call(this, event2.detail);
};
onClick_fn = function (event2) {
  if (!this.disabled && event2.composedPath()[0] === this) {
    this.focus();
  }
};
onConfirm_fn = function () {
  const selected = this.calendar?.selected;
  if (this.value !== selected && !isSameDate(this.value, selected)) {
    __privateMethod(this, _DateField_instances, setValueAndCloseDialog_fn).call(this, selected);
  } else {
    this.hidePicker();
  }
};
_onFocusIn = new WeakMap();
_onFocusOut = new WeakMap();
onKeydown_fn = function (event2) {
  if (event2.key === 'Escape') {
    event2.preventDefault();
    event2.stopPropagation();
    this.hidePicker();
    requestAnimationFrame(() => {
      this.renderRoot.querySelector('sl-field-button')?.focus();
    });
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
  if (!this.selectAll && !isSpinbutton) {
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
  requestAnimationFrame(() =>
    __privateMethod(this, _DateField_instances, selectContent_fn).call(this, span)
  );
};
onPartKeydown_fn = function (event2, partType) {
  const span = event2.target;
  const locale = this.locale ?? 'default',
    parts = getDateFormat(locale),
    separators = parts.filter(p => p.type === 'literal').map(p => p.value);
  if (separators.includes(event2.key)) {
    event2.preventDefault();
    __privateMethod(this, _DateField_instances, moveFocus_fn).call(this, span, 1);
    return;
  }
  if ((event2.ctrlKey || event2.metaKey) && event2.key === 'a') {
    event2.preventDefault();
    this.selectAll = true;
    requestAnimationFrame(() => {
      const selectAll = this.renderRoot.querySelector('.select-all');
      selectAll.focus();
      __privateMethod(this, _DateField_instances, selectContent_fn).call(this, selectAll);
    });
    return;
  }
  if (event2.key >= '0' && event2.key <= '9') {
    event2.preventDefault();
    if (this.readonly || this.selectOnly) {
      return;
    }
    const digit = parseInt(event2.key, 10);
    __privateMethod(this, _DateField_instances, applyDigitToDatePart_fn).call(
      this,
      partType,
      digit
    );
    const maxDigits = partType === 'year' ? 4 : 2;
    if (__privateGet(this, _enteredDigits) >= maxDigits) {
      __privateSet(this, _enteredDigits, 0);
      __privateMethod(this, _DateField_instances, moveFocus_fn).call(this, span, 1);
    } else {
      requestAnimationFrame(() =>
        __privateMethod(this, _DateField_instances, selectContent_fn).call(this, span)
      );
    }
    __privateMethod(this, _DateField_instances, trySetValue_fn).call(this);
    return;
  }
  switch (event2.key) {
    case 'ArrowUp':
      event2.preventDefault();
      if (!this.readonly && !this.selectOnly) {
        __privateMethod(this, _DateField_instances, adjustDatePart_fn).call(this, partType, 1);
        __privateMethod(this, _DateField_instances, selectContent_fn).call(this, span);
        __privateMethod(this, _DateField_instances, trySetValue_fn).call(this);
      }
      break;
    case 'ArrowDown':
      event2.preventDefault();
      if (!this.readonly && !this.selectOnly) {
        __privateMethod(this, _DateField_instances, adjustDatePart_fn).call(this, partType, -1);
        __privateMethod(this, _DateField_instances, selectContent_fn).call(this, span);
        __privateMethod(this, _DateField_instances, trySetValue_fn).call(this);
      }
      break;
    case 'ArrowLeft':
      event2.preventDefault();
      __privateMethod(this, _DateField_instances, moveFocus_fn).call(this, span, -1);
      break;
    case 'ArrowRight':
      event2.preventDefault();
      __privateMethod(this, _DateField_instances, moveFocus_fn).call(this, span, 1);
      break;
    case 'Backspace':
    case 'Delete':
      event2.preventDefault();
      if (!this.readonly && !this.selectOnly) {
        this.dateParts = { ...this.dateParts, [partType]: void 0 };
        __privateSet(this, _enteredDigits, 0);
        __privateMethod(this, _DateField_instances, selectContent_fn).call(this, span);
        __privateMethod(this, _DateField_instances, trySetValue_fn).call(this);
      }
      break;
  }
  if (event2.key.length === 1 && !event2.ctrlKey && !event2.metaKey) {
    event2.preventDefault();
  }
};
onPaste_fn = function (event2) {
  event2.preventDefault();
  if (this.readonly || this.selectOnly) {
    return;
  }
  const text = event2.clipboardData?.getData('text/plain')?.trim();
  if (!text) {
    return;
  }
  const date = parseDateString(text, this.locale ?? 'default');
  if (date) {
    this.value = date;
    this.changeEvent.emit(this.value);
    this.updateState({ dirty: true });
    this.updateValidity();
  }
};
onSelectAllBlur_fn = function () {
  __privateMethod(this, _DateField_instances, exitSelectAll_fn).call(this);
};
onSelectAllKeydown_fn = function (event2) {
  if (['Control', 'Meta', 'Shift', 'Alt'].includes(event2.key)) {
    return;
  }
  if ((event2.ctrlKey || event2.metaKey) && (event2.key === 'c' || event2.key === 'C')) {
    return;
  }
  if (event2.key === 'Tab') {
    event2.preventDefault();
    __privateMethod(this, _DateField_instances, exitSelectAll_fn).call(this);
    if (!event2.shiftKey) {
      requestAnimationFrame(() => {
        this.renderRoot.querySelector('sl-field-button')?.focus();
      });
    }
    return;
  }
  if (event2.key === 'Backspace' || event2.key === 'Delete') {
    event2.preventDefault();
    this.dateParts = {};
    __privateSet(this, _enteredDigits, 0);
    this.value = void 0;
    this.changeEvent.emit(this.value);
    this.updateState({ dirty: true });
    this.updateValidity();
    __privateMethod(this, _DateField_instances, exitSelectAll_fn).call(this, true);
    return;
  }
  event2.preventDefault();
  __privateMethod(this, _DateField_instances, exitSelectAll_fn).call(this, true);
};
onSelectAllMouseDown_fn = function (event2) {
  event2.preventDefault();
  __privateMethod(this, _DateField_instances, exitSelectAll_fn).call(this, true);
};
onSeparatorPointerDown_fn = function (event2) {
  event2.preventDefault();
  event2.stopImmediatePropagation();
  event2.target.previousElementSibling?.focus();
};
onSlotChange_fn = function () {
  if (!this.calendar) {
    return;
  }
  this.calendar.selected = this.value;
};
updateHasActionSlotContent_fn = function () {
  this.hasActionSlotContent = Array.from(this.children).some(
    child => child.slot !== 'calendar' && child.tagName !== 'STYLE'
  );
};
onClose_fn = function () {
  void Promise.allSettled(this.dialog?.getAnimations().map(a => a.finished) ?? []).then(() => {
    if (!this.dialog?.open) {
      this.calendarVisible = false;
    }
  });
};
/** Handles clicks on the dialog backdrop to implement light dismiss. */
onDialogClick_fn = function (event2) {
  if (!this.dialog || event2.target !== this.dialog) {
    return;
  }
  const rect = this.dialog.getBoundingClientRect();
  if (
    event2.clientX < rect.left ||
    event2.clientX > rect.right ||
    event2.clientY < rect.top ||
    event2.clientY > rect.bottom
  ) {
    this.hidePicker();
  }
};
/**
 * Adjusts a date part by the given delta, with wrapping.
 *
 * @param partType The type of part to adjust
 * @param delta The amount to adjust by (1 or -1)
 */
adjustDatePart_fn = function (partType, delta) {
  const currentValue = this.dateParts[partType];
  let newValue;
  if (currentValue === void 0) {
    if (partType === 'day') {
      newValue = delta > 0 ? 1 : 31;
    } else if (partType === 'month') {
      newValue = delta > 0 ? 1 : 12;
    } else {
      newValue = /* @__PURE__ */ new Date().getFullYear();
    }
  } else {
    if (partType === 'day') {
      newValue = currentValue + delta;
      if (newValue > 31) newValue = 1;
      if (newValue < 1) newValue = 31;
    } else if (partType === 'month') {
      newValue = currentValue + delta;
      if (newValue > 12) newValue = 1;
      if (newValue < 1) newValue = 12;
    } else {
      newValue = Math.max(1, Math.min(9999, currentValue + delta));
    }
  }
  this.dateParts = { ...this.dateParts, [partType]: newValue };
};
/**
 * Applies a new digit to the specified date part, combining with existing digits if continuing to
 * type.
 */
applyDigitToDatePart_fn = function (partType, newDigit) {
  const maxDigits = partType === 'year' ? 4 : 2,
    currentValue = this.dateParts[partType];
  let newValue;
  if (
    __privateGet(this, _enteredDigits) > 0 &&
    __privateGet(this, _enteredDigits) < maxDigits &&
    currentValue !== void 0
  ) {
    newValue = currentValue * 10 + newDigit;
  } else {
    newValue = newDigit;
    __privateSet(this, _enteredDigits, 0);
  }
  __privateWrapper(this, _enteredDigits)._++;
  this.dateParts = { ...this.dateParts, [partType]: newValue };
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
/** Returns the formatted date string for the select-all input. */
getFormattedValue_fn = function () {
  const locale = this.locale ?? 'default',
    parts = getDateFormat(locale);
  return parts
    .map(part => {
      if (part.type === 'literal') {
        return part.value;
      }
      const partType = part.type,
        currentValue = this.dateParts[partType];
      if (currentValue !== void 0) {
        return String(currentValue).padStart(part.value.length, '0');
      }
      return getDateUnitLetter(locale, partType).repeat(part.value.length);
    })
    .join('');
};
getMaxForType_fn = function (partType) {
  switch (partType) {
    case 'day':
      return 31;
    case 'month':
      return 12;
    case 'year':
      return 9999;
  }
};
getMinForType_fn = function (partType) {
  switch (partType) {
    case 'day':
    case 'month':
      return 1;
    case 'year':
      return 1;
  }
};
hasPartialDate_fn = function () {
  return (
    this.dateParts.day !== void 0 ||
    this.dateParts.month !== void 0 ||
    this.dateParts.year !== void 0
  );
};
/** Selects all text content in a contenteditable element. */
selectContent_fn = function (element) {
  const selection = element.ownerDocument.getSelection();
  if (selection) {
    selection.setBaseAndExtent(element, 0, element, element.childNodes.length);
  }
};
/** Moves focus to the next or previous spinbutton input. */
moveFocus_fn = function (current, direction) {
  const spans = Array.from(this.renderRoot.querySelectorAll('span[role="spinbutton"]')),
    index = spans.indexOf(current),
    target = spans[index + direction];
  if (target) {
    target.focus();
    __privateMethod(this, _DateField_instances, selectContent_fn).call(this, target);
  }
};
setValueAndCloseDialog_fn = function (date) {
  this.value = date;
  this.value?.setHours(0, 0, 0, 0);
  this.changeEvent.emit(this.value);
  this.updateState({ dirty: true });
  this.updateValidity();
  this.hidePicker();
  requestAnimationFrame(() => {
    const firstSpan = this.renderRoot.querySelector('span[role="spinbutton"]');
    firstSpan?.focus();
  });
};
/** Tries to set the value if all date parts are defined, or clears it. */
trySetValue_fn = function () {
  const { day, month, year } = this.dateParts,
    hadValue = this.value !== void 0;
  if (day !== void 0 && month !== void 0 && year !== void 0) {
    const date = new Date(year, month - 1, day);
    if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
      if ((this.min && date < this.min) || (this.max && date > this.max)) {
        __privateSet(this, _preserveDateParts, true);
        this.value = void 0;
        if (hadValue) {
          this.changeEvent.emit(this.value);
          this.updateState({ dirty: true });
        }
        this.updateValidity();
      } else {
        this.value = date;
        this.changeEvent.emit(this.value);
        this.updateState({ dirty: true });
        this.updateValidity();
      }
    } else {
      __privateSet(this, _preserveDateParts, true);
      this.value = void 0;
      if (hadValue) {
        this.changeEvent.emit(this.value);
        this.updateState({ dirty: true });
      }
      this.updateValidity();
    }
  } else {
    __privateSet(this, _preserveDateParts, true);
    this.value = void 0;
    if (hadValue) {
      this.changeEvent.emit(this.value);
      this.updateState({ dirty: true });
    }
    this.updateValidity();
  }
};
/** @internal */
DateField.formAssociated = true;
/** @internal */
DateField.styles = styles;
__decorateClass([event({ name: 'sl-blur' })], DateField.prototype, 'blurEvent', 2);
__decorateClass([state()], DateField.prototype, 'calendarVisible', 2);
__decorateClass([state()], DateField.prototype, 'hasActionSlotContent', 2);
__decorateClass([event({ name: 'sl-change' })], DateField.prototype, 'changeEvent', 2);
__decorateClass([state()], DateField.prototype, 'dateParts', 2);
__decorateClass([query('dialog')], DateField.prototype, 'dialog', 2);
__decorateClass([property({ type: Boolean, reflect: true })], DateField.prototype, 'disabled', 2);
__decorateClass(
  [property({ type: Number, attribute: 'first-day-of-week' })],
  DateField.prototype,
  'firstDayOfWeek',
  2
);
__decorateClass([event({ name: 'sl-focus' })], DateField.prototype, 'focusEvent', 2);
__decorateClass([property({ converter: dateConverter })], DateField.prototype, 'max', 2);
__decorateClass([property({ converter: dateConverter })], DateField.prototype, 'min', 2);
__decorateClass([property({ converter: dateConverter })], DateField.prototype, 'month', 2);
__decorateClass([property()], DateField.prototype, 'placeholder', 2);
__decorateClass([state()], DateField.prototype, 'placeholderShown', 2);
__decorateClass([property({ type: Boolean, reflect: true })], DateField.prototype, 'readonly', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'require-confirmation' })],
  DateField.prototype,
  'requireConfirmation',
  2
);
__decorateClass([property({ type: Boolean, reflect: true })], DateField.prototype, 'required', 2);
__decorateClass([state()], DateField.prototype, 'selectAll', 2);
__decorateClass(
  [property({ type: Boolean, reflect: true, attribute: 'select-only' })],
  DateField.prototype,
  'selectOnly',
  2
);
__decorateClass(
  [property({ type: Boolean, attribute: 'show-week-numbers' })],
  DateField.prototype,
  'showWeekNumbers',
  2
);
__decorateClass([property({ converter: dateConverter })], DateField.prototype, 'value', 2);
DateField = __decorateClass([localized()], DateField);
//# sourceMappingURL=date-field.js.map
