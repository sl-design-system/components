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
var _countId,
  _countValiditySet,
  _describedByObserver,
  _isOverLimitState,
  _lastObservedDescribedBy,
  _observer,
  _previousCountState,
  _showCountMessage,
  _showValidityBeforeCount,
  _TextArea_instances,
  attachTextareaListeners_fn,
  detachTextareaListeners_fn,
  getCountDescriptionId_fn,
  getCountState_fn,
  getShowCountLimit_fn,
  getValue_fn,
  isCountVisible_fn,
  _onTextareaFocus,
  _onTextareaBlur,
  syncCountAriaDescription_fn,
  trySetAriaDescribedByElements_fn,
  getCountText_fn,
  onBlur_fn,
  onInput_fn,
  syncCountValidity_fn,
  setOverLimitVisualState_fn,
  onSlotchange_fn,
  setSize_fn,
  syncTextarea_fn;
import { localized, msg, str } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import {
  ObserveAttributesMixin,
  event,
  getCharacterPluralSuffix,
  getPluralCategory
} from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './text-area.scss.js';
let nextUniqueId = 0;
export let TextArea = class extends ObserveAttributesMixin(
  FormControlMixin(ScopedElementsMixin(LitElement)),
  ['aria-describedby', 'aria-disabled', 'aria-label', 'aria-labelledby', 'aria-required']
) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _TextArea_instances);
    /** ID used to connect the character count to the textarea via aria-describedby. */
    __privateAdd(this, _countId, `sl-text-area-count-${nextUniqueId++}`);
    /**
     * True when we have called `textarea.setCustomValidity(countMessage)`. Used to guard the
     * clearing call in `updateInternalValidity()` so we never unconditionally wipe a custom error
     * set by a user.
     */
    __privateAdd(this, _countValiditySet, false);
    /** Keep count aria-describedby linkage resilient to external textarea attribute changes. */
    __privateAdd(
      this,
      _describedByObserver,
      new MutationObserver(() => {
        const countDescriptionId = __privateMethod(
            this,
            _TextArea_instances,
            getCountDescriptionId_fn
          ).call(this),
          describedBy = this.textarea?.getAttribute('aria-describedby') ?? '';
        if (describedBy === __privateGet(this, _lastObservedDescribedBy)) {
          return;
        }
        __privateSet(this, _lastObservedDescribedBy, describedBy);
        const hasCountDescription = describedBy.split(/\s+/).includes(countDescriptionId),
          shouldHaveCountDescription = __privateMethod(
            this,
            _TextArea_instances,
            isCountVisible_fn
          ).call(this);
        if (shouldHaveCountDescription || hasCountDescription) {
          __privateMethod(this, _TextArea_instances, syncCountAriaDescription_fn).call(this);
        }
      })
    );
    /** True when the value is over the character limit and sets validation state. */
    __privateAdd(this, _isOverLimitState, false);
    /** Last observed aria-describedby value to avoid redundant observer work. */
    __privateAdd(this, _lastObservedDescribedBy, '');
    /** Observe the textarea width. */
    __privateAdd(
      this,
      _observer,
      new ResizeObserver(() => {
        requestAnimationFrame(() =>
          __privateMethod(this, _TextArea_instances, setSize_fn).call(this)
        );
      })
    );
    /** The last count state, used to announce only when state changes. */
    __privateAdd(this, _previousCountState);
    /** Whether the showCount overflow message may be shown (after reportValidity was called). */
    __privateAdd(this, _showCountMessage, false);
    /** Snapshot of external show-validity before showCount temporarily forces invalid styling. */
    __privateAdd(this, _showValidityBeforeCount);
    this.resize = 'vertical';
    this.value = '';
    this.wrap = 'soft';
    /** Stable focus handler for attaching/removing listeners. */
    __privateAdd(this, _onTextareaFocus, () => {
      this.focusEvent.emit();
    });
    /** Stable blur handler for attaching/removing listeners. */
    __privateAdd(this, _onTextareaBlur, () =>
      __privateMethod(this, _TextArea_instances, onBlur_fn).call(this)
    );
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-icon': Icon
    };
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.textarea) {
      this.textarea =
        this.querySelector('textarea[slot="textarea"]') || document.createElement('textarea');
      this.textarea.slot = 'textarea';
      __privateMethod(this, _TextArea_instances, syncTextarea_fn).call(this, this.textarea);
      if (!this.textarea.parentElement) {
        this.append(this.textarea);
      }
    }
    __privateMethod(this, _TextArea_instances, attachTextareaListeners_fn).call(
      this,
      this.textarea
    );
    __privateGet(this, _observer).observe(this.textarea);
    __privateSet(
      this,
      _lastObservedDescribedBy,
      this.textarea.getAttribute('aria-describedby') ?? ''
    );
    __privateGet(this, _describedByObserver).observe(this.textarea, {
      attributes: true,
      attributeFilter: ['aria-describedby']
    });
    this.setFormControlElement(this.textarea);
  }
  disconnectedCallback() {
    __privateGet(this, _observer).disconnect();
    __privateGet(this, _describedByObserver).disconnect();
    __privateMethod(this, _TextArea_instances, detachTextareaListeners_fn).call(
      this,
      this.textarea
    );
    this.querySelector(
      `#${__privateMethod(this, _TextArea_instances, getCountDescriptionId_fn).call(this)}`
    )?.remove();
    __privateSet(this, _countValiditySet, false);
    __privateSet(this, _previousCountState, void 0);
    super.disconnectedCallback();
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    const valueChangedProgrammatically =
      changes.has('value') && this.value !== this.textarea?.value;
    if (valueChangedProgrammatically && this.textarea) {
      this.textarea.value = this.value?.toString() || '';
    }
    if (valueChangedProgrammatically || changes.has('showCount')) {
      __privateMethod(this, _TextArea_instances, syncCountValidity_fn).call(this);
      this.updateValidity();
      if (changes.has('showCount')) {
        __privateSet(
          this,
          _previousCountState,
          this.showCount !== void 0
            ? __privateMethod(this, _TextArea_instances, getCountState_fn).call(this)
            : void 0
        );
      } else if (valueChangedProgrammatically && this.showCount !== void 0) {
        __privateSet(
          this,
          _previousCountState,
          __privateMethod(this, _TextArea_instances, getCountState_fn).call(this)
        );
      }
    }
  }
  updated(changes) {
    super.updated(changes);
    const props = [
      'autocomplete',
      'disabled',
      'maxLength',
      'minLength',
      'placeholder',
      'readonly',
      'resize',
      'required',
      'rows',
      'wrap'
    ];
    if (props.some(prop => changes.has(prop))) {
      __privateMethod(this, _TextArea_instances, syncTextarea_fn).call(this, this.textarea);
    }
    const valueChangedProgrammatically = changes.has('value') && this.value !== this.textarea.value;
    if (valueChangedProgrammatically) {
      this.textarea.value = this.value?.toString() || '';
    }
    const changed = __privateMethod(this, _TextArea_instances, syncCountAriaDescription_fn).call(
      this
    );
    if (changed) {
      requestAnimationFrame(() => {
        if (this.isConnected) {
          __privateMethod(this, _TextArea_instances, syncCountAriaDescription_fn).call(this);
        }
      });
    }
  }
  render() {
    return html`
      <div class="field">
        <slot
          @input=${__privateMethod(this, _TextArea_instances, onInput_fn)}
          @slotchange=${__privateMethod(this, _TextArea_instances, onSlotchange_fn)}
          name="textarea"></slot>
        <slot name="suffix">
          ${this.showValidity === 'valid' ? html`<sl-icon class="valid" name="circle-check-solid"></sl-icon>` : nothing}
        </slot>
      </div>
      ${
        __privateMethod(this, _TextArea_instances, isCountVisible_fn).call(this)
          ? html`
              <span
                class="count"
                count-state=${__privateMethod(this, _TextArea_instances, getCountState_fn).call(this)}
                id=${__privateGet(this, _countId)}>
                ${__privateMethod(this, _TextArea_instances, getCountText_fn).call(this)}
              </span>
            `
          : nothing
      }
      <slot name="count-description"></slot>
    `;
  }
  focus() {
    this.textarea.focus();
  }
  reportValidity() {
    __privateSet(this, _showCountMessage, true);
    if (__privateGet(this, _isOverLimitState) || this.validity.valueMissing) {
      this.requestUpdate();
    }
    return super.reportValidity();
  }
  getLocalizedValidationMessage() {
    if (this.validity.tooShort) {
      const length = this.value.length;
      return msg(
        str`Please enter at least ${this.minLength} character${getCharacterPluralSuffix(
          this.minLength ?? 0
        )} (you currently have ${length} character${getCharacterPluralSuffix(length)}).`,
        { id: 'sl.common.validation.tooShort' }
      );
    }
    if (this.validity.customError) {
      if (__privateGet(this, _isOverLimitState) && !__privateGet(this, _showCountMessage)) {
        return '';
      }
      return this.validationMessage;
    }
    return super.getLocalizedValidationMessage();
  }
  /**
   * Sets or clears the character count custom validity error. Only clears the error if we set it
   * ourselves, so we never accidentally overwrite a custom error set by the user.
   */
  updateInternalValidity() {
    if (__privateGet(this, _isOverLimitState)) {
      if (this.textarea.validity.customError && !__privateGet(this, _countValiditySet)) {
        return;
      }
      const showCountLimit = __privateMethod(this, _TextArea_instances, getShowCountLimit_fn).call(
        this
      );
      if (showCountLimit === void 0) {
        return;
      }
      const over =
        __privateMethod(this, _TextArea_instances, getValue_fn).call(this).length - showCountLimit;
      let validationMessage;
      switch (getPluralCategory(over)) {
        case 'one':
          validationMessage = msg(str`Please remove at least ${over} character.`, {
            id: 'sl.textArea.validation.tooLong_one'
          });
          break;
        case 'few':
          validationMessage = msg(str`Please remove at least ${over} characters.`, {
            id: 'sl.textArea.validation.tooLong_few'
          });
          break;
        default:
          validationMessage = msg(str`Please remove at least ${over} characters.`, {
            id: 'sl.textArea.validation.tooLong_other'
          });
          break;
      }
      this.textarea.setCustomValidity(validationMessage);
      __privateSet(this, _countValiditySet, true);
    } else if (__privateGet(this, _countValiditySet)) {
      this.textarea.setCustomValidity('');
      __privateSet(this, _countValiditySet, false);
    }
  }
  /**
   * Override setCustomValidity to reset the count validity flag whenever an external custom error
   * is set. This ensures the component can distinguish between errors it set itself and errors set
   * externally by consumers.
   */
  setCustomValidity(message) {
    __privateSet(this, _countValiditySet, false);
    super.setCustomValidity(message);
  }
};
_countId = new WeakMap();
_countValiditySet = new WeakMap();
_describedByObserver = new WeakMap();
_isOverLimitState = new WeakMap();
_lastObservedDescribedBy = new WeakMap();
_observer = new WeakMap();
_previousCountState = new WeakMap();
_showCountMessage = new WeakMap();
_showValidityBeforeCount = new WeakMap();
_TextArea_instances = new WeakSet();
/** Attaches focus and blur listeners to the current textarea. */
attachTextareaListeners_fn = function (textarea) {
  textarea.addEventListener('blur', __privateGet(this, _onTextareaBlur));
  textarea.addEventListener('focus', __privateGet(this, _onTextareaFocus));
};
/** Removes focus and blur listeners from the given textarea. */
detachTextareaListeners_fn = function (textarea) {
  textarea?.removeEventListener('blur', __privateGet(this, _onTextareaBlur));
  textarea?.removeEventListener('focus', __privateGet(this, _onTextareaFocus));
};
/** Returns the ID used for the hidden count description element. */
getCountDescriptionId_fn = function () {
  return `${__privateGet(this, _countId)}-description`;
};
/** Returns the current count state for the visible counter. */
getCountState_fn = function () {
  const showCountLimit = __privateMethod(this, _TextArea_instances, getShowCountLimit_fn).call(
    this
  );
  if (showCountLimit === void 0) {
    return 'default';
  }
  const remaining =
    showCountLimit - __privateMethod(this, _TextArea_instances, getValue_fn).call(this).length;
  if (remaining < 0) {
    return 'danger';
  } else if (remaining <= showCountLimit * 0.1) {
    return 'caution';
  }
  return 'default';
};
/** Returns the active soft count limit, or `undefined` when count is disabled. */
getShowCountLimit_fn = function () {
  const limit = Number(this.showCount);
  return Number.isFinite(limit) && limit > 0 ? Math.trunc(limit) : void 0;
};
/** Returns the current value as a string, ensuring it's never null or undefined. */
getValue_fn = function () {
  return this.value?.toString() ?? '';
};
/** Returns whether the character count should currently be shown. */
isCountVisible_fn = function () {
  const showCountLimit = __privateMethod(this, _TextArea_instances, getShowCountLimit_fn).call(
    this
  );
  return (
    showCountLimit !== void 0 &&
    !(__privateGet(this, _isOverLimitState) && __privateGet(this, _showCountMessage)) &&
    !(__privateGet(this, _showCountMessage) && this.validity.valueMissing)
  );
};
_onTextareaFocus = new WeakMap();
_onTextareaBlur = new WeakMap();
/**
 * Keeps the hidden description span and aria-describedby in sync with the visible character count.
 * Returns `true` when the describedby linkage changed structurally (element created or removed, or
 * the ID list changed), so callers can decide whether a deferred re-sync is needed.
 */
syncCountAriaDescription_fn = function () {
  const { textarea } = this;
  if (!textarea) {
    return false;
  }
  const countDescriptionId = __privateMethod(
    this,
    _TextArea_instances,
    getCountDescriptionId_fn
  ).call(this);
  let countDescriptionElement = this.querySelector(`#${countDescriptionId}`) ?? void 0;
  let structuralChange = false;
  if (__privateMethod(this, _TextArea_instances, isCountVisible_fn).call(this)) {
    if (!countDescriptionElement) {
      countDescriptionElement = document.createElement('span');
      countDescriptionElement.id = countDescriptionId;
      countDescriptionElement.slot = 'count-description';
      countDescriptionElement.className = 'visually-hidden';
      this.append(countDescriptionElement);
      structuralChange = true;
    }
    countDescriptionElement.textContent = __privateMethod(
      this,
      _TextArea_instances,
      getCountText_fn
    ).call(this);
  } else {
    if (countDescriptionElement) {
      countDescriptionElement.remove();
      countDescriptionElement = void 0;
      structuralChange = true;
    }
  }
  const externalIds = (textarea.getAttribute('aria-describedby') ?? '')
    .split(/\s+/)
    .filter(id => Boolean(id) && id !== countDescriptionId);
  const nextIds = countDescriptionElement ? [...externalIds, countDescriptionId] : externalIds,
    nextDescribedBy = nextIds.join(' ');
  const describedByRefCapable = textarea;
  if (describedByRefCapable.ariaDescribedByElements !== void 0) {
    const externalRefs = (describedByRefCapable.ariaDescribedByElements ?? []).filter(
        el => el.id !== countDescriptionId
      ),
      nextRefs = countDescriptionElement
        ? [...externalRefs, countDescriptionElement]
        : externalRefs;
    __privateMethod(this, _TextArea_instances, trySetAriaDescribedByElements_fn).call(
      this,
      describedByRefCapable,
      nextRefs
    );
  }
  if (nextDescribedBy.length > 0) {
    if (textarea.getAttribute('aria-describedby') !== nextDescribedBy) {
      textarea.setAttribute('aria-describedby', nextDescribedBy);
      __privateSet(this, _lastObservedDescribedBy, nextDescribedBy);
      structuralChange = true;
    }
  } else if (textarea.hasAttribute('aria-describedby')) {
    textarea.removeAttribute('aria-describedby');
    __privateSet(this, _lastObservedDescribedBy, '');
    structuralChange = true;
  }
  return structuralChange;
};
/** Updates `ariaDescribedByElements` with a fallback to same root references when needed. */
trySetAriaDescribedByElements_fn = function (target, refs) {
  const controlRoot = target.getRootNode(),
    candidates = [
      refs,
      refs.filter(el => {
        const root = el.getRootNode();
        return root === controlRoot || root === document;
      })
    ];
  for (const list of candidates) {
    try {
      target.ariaDescribedByElements = list.length > 0 ? list : null;
      return;
    } catch {}
  }
};
/** Returns the localized counter text for the current value and soft limit. */
getCountText_fn = function () {
  const showCountLimit = __privateMethod(this, _TextArea_instances, getShowCountLimit_fn).call(
    this
  );
  if (showCountLimit === void 0) {
    return '';
  }
  const remaining =
    showCountLimit - __privateMethod(this, _TextArea_instances, getValue_fn).call(this).length;
  if (remaining < 0) {
    const over = -remaining;
    switch (getPluralCategory(over)) {
      case 'one':
        return msg(str`${over} character too many`, {
          id: 'sl.textArea.charCountTooMany_one'
        });
      case 'few':
        return msg(str`${over} characters too many`, {
          id: 'sl.textArea.charCountTooMany_few'
        });
      default:
        return msg(str`${over} characters too many`, {
          id: 'sl.textArea.charCountTooMany_other'
        });
    }
  }
  switch (getPluralCategory(remaining)) {
    case 'one':
      return msg(str`${remaining} character remaining`, {
        id: 'sl.textArea.charCountRemaining_one'
      });
    case 'few':
      return msg(str`${remaining} characters remaining`, {
        id: 'sl.textArea.charCountRemaining_few'
      });
    default:
      return msg(str`${remaining} characters remaining`, {
        id: 'sl.textArea.charCountRemaining_other'
      });
  }
};
onBlur_fn = function () {
  this.blurEvent.emit();
  this.updateState({ touched: true });
};
onInput_fn = function ({ target }) {
  this.value = target.value;
  this.updateState({ dirty: true });
  __privateMethod(this, _TextArea_instances, syncCountValidity_fn).call(this);
  this.updateValidity();
  __privateMethod(this, _TextArea_instances, setSize_fn).call(this);
  this.changeEvent.emit(this.value);
  if (this.showCount !== void 0) {
    const currentCountState = __privateMethod(this, _TextArea_instances, getCountState_fn).call(
      this
    );
    if (
      __privateGet(this, _previousCountState) !== void 0 &&
      currentCountState !== __privateGet(this, _previousCountState)
    ) {
      announce(__privateMethod(this, _TextArea_instances, getCountText_fn).call(this), 'polite');
    }
    __privateSet(this, _previousCountState, currentCountState);
  }
};
/** Updates the soft limit validity state based on the current value. */
syncCountValidity_fn = function () {
  const showCountLimit = __privateMethod(this, _TextArea_instances, getShowCountLimit_fn).call(
    this
  );
  if (showCountLimit === void 0) {
    if (__privateGet(this, _isOverLimitState)) {
      __privateMethod(this, _TextArea_instances, setOverLimitVisualState_fn).call(this, false);
    }
    __privateSet(this, _showCountMessage, false);
    __privateSet(this, _previousCountState, void 0);
    return;
  }
  __privateMethod(this, _TextArea_instances, setOverLimitVisualState_fn).call(
    this,
    __privateMethod(this, _TextArea_instances, getValue_fn).call(this).length > showCountLimit
  );
};
/** Applies or restores the temporary `show-validity` state used for soft-limit overflow. */
setOverLimitVisualState_fn = function (isOverLimit) {
  if (isOverLimit) {
    if (!__privateGet(this, _isOverLimitState)) {
      __privateSet(this, _showValidityBeforeCount, this.getAttribute('show-validity'));
    }
    this.setAttribute('show-validity', 'invalid');
    __privateSet(this, _isOverLimitState, true);
    return;
  }
  if (__privateGet(this, _isOverLimitState)) {
    if (__privateGet(this, _showValidityBeforeCount) === null) {
      this.removeAttribute('show-validity');
    } else if (__privateGet(this, _showValidityBeforeCount) !== void 0) {
      this.setAttribute('show-validity', __privateGet(this, _showValidityBeforeCount));
    }
    __privateSet(this, _showValidityBeforeCount, void 0);
    __privateSet(this, _isOverLimitState, false);
  }
};
/** Handles a newly slotted textarea and wires it up to the component state. */
onSlotchange_fn = function (event2) {
  const elements = event2.target.assignedElements({ flatten: true }),
    textarea = elements.find(el => el instanceof HTMLTextAreaElement);
  if (textarea) {
    const previousTextarea = this.textarea;
    if (previousTextarea) {
      __privateMethod(this, _TextArea_instances, detachTextareaListeners_fn).call(
        this,
        previousTextarea
      );
    }
    if (previousTextarea && previousTextarea !== textarea) {
      __privateGet(this, _observer).unobserve(previousTextarea);
    }
    this.textarea = textarea;
    __privateMethod(this, _TextArea_instances, attachTextareaListeners_fn).call(
      this,
      this.textarea
    );
    __privateMethod(this, _TextArea_instances, syncTextarea_fn).call(this, this.textarea);
    this.textarea.value = this.value?.toString() || '';
    __privateGet(this, _observer).observe(this.textarea);
    __privateGet(this, _describedByObserver).disconnect();
    __privateSet(
      this,
      _lastObservedDescribedBy,
      this.textarea.getAttribute('aria-describedby') ?? ''
    );
    __privateGet(this, _describedByObserver).observe(this.textarea, {
      attributes: true,
      attributeFilter: ['aria-describedby']
    });
    __privateSet(this, _countValiditySet, false);
    __privateMethod(this, _TextArea_instances, syncCountValidity_fn).call(this);
    this.updateValidity();
    __privateMethod(this, _TextArea_instances, syncCountAriaDescription_fn).call(this);
    this.setFormControlElement(this.textarea);
  }
};
/** Applies the resize mode to the textarea. */
setSize_fn = function () {
  if (this.resize === 'auto') {
    this.textarea.style.height = 'auto';
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;
    this.textarea.style.resize = 'none';
  } else if (this.resize === 'vertical') {
    this.textarea.style.height = void 0;
  } else {
    this.textarea.style.removeProperty('height');
  }
};
/** Syncs the managed textarea with the component properties. */
syncTextarea_fn = function (textarea) {
  textarea.autocomplete = this.autocomplete || 'off';
  textarea.autofocus = this.autofocus;
  textarea.disabled = !!this.disabled;
  textarea.id ||= `sl-text-area-${nextUniqueId++}`;
  textarea.placeholder = this.placeholder ?? '';
  textarea.readOnly = !!this.readonly;
  textarea.required = !!this.required;
  textarea.rows = this.rows && this.rows > 0 ? this.rows : 3;
  textarea.style.resize = this.resize ?? 'vertical';
  textarea.wrap = this.wrap ?? 'soft';
  textarea.style.setProperty('--_sl-text-area-rows', textarea.rows?.toString());
  this.setAttributesTarget(textarea);
  if (typeof this.maxLength === 'number') {
    textarea.setAttribute('maxlength', this.maxLength.toString());
  } else {
    textarea.removeAttribute('maxlength');
  }
  if (typeof this.minLength === 'number') {
    textarea.setAttribute('minlength', this.minLength.toString());
  } else {
    textarea.removeAttribute('minlength');
  }
  __privateMethod(this, _TextArea_instances, setSize_fn).call(this);
};
/** @internal */
TextArea.shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };
/** @internal */
TextArea.styles = styles;
__decorateClass([event({ name: 'sl-blur' })], TextArea.prototype, 'blurEvent', 2);
__decorateClass([event({ name: 'sl-change' })], TextArea.prototype, 'changeEvent', 2);
__decorateClass([event({ name: 'sl-focus' })], TextArea.prototype, 'focusEvent', 2);
__decorateClass([property()], TextArea.prototype, 'autocomplete', 2);
__decorateClass([property({ type: Boolean, reflect: true })], TextArea.prototype, 'disabled', 2);
__decorateClass(
  [property({ type: Number, attribute: 'maxlength' })],
  TextArea.prototype,
  'maxLength',
  2
);
__decorateClass(
  [property({ type: Number, attribute: 'minlength' })],
  TextArea.prototype,
  'minLength',
  2
);
__decorateClass([property()], TextArea.prototype, 'placeholder', 2);
__decorateClass([property({ type: Boolean })], TextArea.prototype, 'readonly', 2);
__decorateClass([property({ type: Boolean })], TextArea.prototype, 'required', 2);
__decorateClass([property({ reflect: true })], TextArea.prototype, 'resize', 2);
__decorateClass([property({ type: Number })], TextArea.prototype, 'rows', 2);
__decorateClass(
  [property({ type: Number, attribute: 'show-count' })],
  TextArea.prototype,
  'showCount',
  2
);
__decorateClass(
  [property({ type: Boolean, attribute: 'show-valid' })],
  TextArea.prototype,
  'showValid',
  2
);
__decorateClass([property({ reflect: true })], TextArea.prototype, 'size', 2);
__decorateClass([property()], TextArea.prototype, 'value', 2);
__decorateClass([property()], TextArea.prototype, 'wrap', 2);
TextArea = __decorateClass([localized()], TextArea);
//# sourceMappingURL=text-area.js.map
