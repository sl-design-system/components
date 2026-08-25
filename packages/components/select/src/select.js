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
var _buttonAriaObserver,
  _buttonAriaObserverOptions,
  _events,
  _initialState,
  _focusLeavingComponent,
  _lastRenderedOption,
  _observer,
  _selectedOptionObserver,
  _widthCalculationFrame,
  _popoverClosing,
  _rovingTabindexController,
  _selectedContentContainer,
  _Select_instances,
  renderSelectedContent_fn,
  onSelectedOptionContentChange_fn,
  onBeforetoggle_fn,
  onButtonClick_fn,
  _onButtonClear,
  onClear_fn,
  onClearButtonClick_fn,
  onClearButtonFocusin_fn,
  onClearButtonFocusout_fn,
  onClick_fn,
  onFocusin_fn,
  onFocusout_fn,
  onKeydown_fn,
  onListboxClick_fn,
  onListboxMousedown_fn,
  onListboxKeydown_fn,
  onSlotchange_fn,
  onToggle_fn,
  calculateLargestOptionWidth_fn,
  getExplicitLabelState_fn,
  setupMeasureElement_fn,
  syncListboxLabeling_fn,
  getAllOptions_fn,
  setSelectedOption_fn,
  observeSelectedOptionContent_fn,
  resolveLabelledByElements_fn,
  scheduleLargestOptionWidthCalculation_fn,
  updateAriaKeyShortcuts_fn,
  updateValueAndValidity_fn,
  verifyRegisteredListboxElements_fn;
import { LOCALE_STATUS_EVENT, localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Listbox, Option, OptionGroup } from '@sl-design-system/listbox';
import {
  EventsController,
  ObserveAttributesMixin,
  RovingTabindexController,
  anchor,
  event,
  isPopoverOpen
} from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property, query, queryAssignedElements, state } from 'lit/decorators.js';
import { SelectButton } from './select-button.js';
import styles from './select.scss.js';
export let Select = class extends ObserveAttributesMixin(
  FormControlMixin(ScopedElementsMixin(LitElement)),
  ['aria-describedby', 'aria-label', 'aria-labelledby']
) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Select_instances);
    /** Keep listbox labeling synced when proxied ARIA attributes on the button change. */
    __privateAdd(
      this,
      _buttonAriaObserver,
      new MutationObserver(() =>
        __privateMethod(this, _Select_instances, syncListboxLabeling_fn).call(this)
      )
    );
    /** Shared observer config for proxied ARIA attributes on the button. */
    __privateAdd(this, _buttonAriaObserverOptions, {
      attributes: true,
      attributeFilter: ['aria-label', 'aria-labelledby']
    });
    /** Events controller. */
    __privateAdd(
      this,
      _events,
      new EventsController(this, {
        click: __privateMethod(this, _Select_instances, onClick_fn),
        focusin: __privateMethod(this, _Select_instances, onFocusin_fn),
        focusout: __privateMethod(this, _Select_instances, onFocusout_fn)
      })
    );
    /** The initial state when the form was associated with the select. Used to reset the select. */
    __privateAdd(this, _initialState);
    /**
     * Track when focus is intentionally leaving the component (e.g. by clicking outside or tabbing
     * away). Set to true in #onFocusout when the listbox is open, and we're not already
     * programmatically closing it. Used to prevent restoring focus to the button when the user
     * intentionally moved focus elsewhere.
     */
    __privateAdd(this, _focusLeavingComponent, false);
    /**
     * The last option that was rendered in the button's selected content. Used to avoid unnecessary
     * DOM updates.
     */
    __privateAdd(this, _lastRenderedOption);
    /** Detect when options are added to the host, or a nested option group and clear the cache. */
    __privateAdd(
      this,
      _observer,
      new MutationObserver(() => __privateGet(this, _rovingTabindexController).clearElementCache())
    );
    /**
     * Detect when the selected option content changes, so the button can refresh its cloned
     * content.
     */
    __privateAdd(
      this,
      _selectedOptionObserver,
      new MutationObserver(records =>
        __privateMethod(this, _Select_instances, onSelectedOptionContentChange_fn).call(
          this,
          records
        )
      )
    );
    /** Tracks a scheduled largest-option-width recalculation frame. */
    __privateAdd(this, _widthCalculationFrame);
    /** Since we can't use `popovertarget`, we need to monitor the closing state manually. */
    __privateAdd(this, _popoverClosing, false);
    /** Manage keyboard navigation. */
    __privateAdd(
      this,
      _rovingTabindexController,
      new RovingTabindexController(this, {
        direction: 'vertical',
        elements: () => this.options || [],
        focusInIndex: elements => {
          const index = elements.findIndex(el => el.selected);
          return index !== -1 ? index : elements.findIndex(el => !el.disabled);
        },
        isFocusableElement: el => !el.disabled,
        listenerScope: () => this.listbox
      })
    );
    /** @internal The container element for the selected option's content in the button's light DOM. */
    __privateAdd(this, _selectedContentContainer);
    /** @internal */
    this.internals = this.attachInternals();
    this.rootMarginTop = 0;
    __privateAdd(this, _onButtonClear, event2 => {
      event2.stopPropagation();
      __privateMethod(this, _Select_instances, onClear_fn).call(this);
      this.clearEvent.emit();
    });
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-icon': Icon,
      'sl-listbox': Listbox,
      'sl-select-button': SelectButton
    };
  }
  /**
   * @internal Since we move the aria-label to the button, we need to proxy it here,
   * otherwise the `<sl-form-validation-errors>` component will not be able to read it.
   */
  get ariaLabel() {
    return this.button?.getAttribute('aria-label') || '';
  }
  /** @internal A flattened array of all options (even grouped ones). */
  get options() {
    const elements =
      this.renderRoot.querySelector('slot:not([name])')?.assignedElements({ flatten: true }) ?? [];
    return elements.flatMap(element =>
      __privateMethod(this, _Select_instances, getAllOptions_fn).call(this, element)
    );
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.button) {
      this.button = this.shadowRoot.createElement('sl-select-button');
      this.button.addEventListener('click', () =>
        __privateMethod(this, _Select_instances, onButtonClick_fn).call(this)
      );
      this.button.addEventListener('keydown', event2 =>
        __privateMethod(this, _Select_instances, onKeydown_fn).call(this, event2)
      );
      this.button.addEventListener('sl-clear', __privateGet(this, _onButtonClear));
      this.button.clearable = !!this.clearable;
      this.button.disabled = !!this.disabled;
      this.button.fill = this.fill;
      this.button.placeholder = this.placeholder;
      this.button.required = !!this.required;
      this.button.selected = this.selectedOption;
      this.button.showValid = !!this.showValid;
      this.button.showValidity = this.showValidity;
      this.button.size = this.size;
      this.button.tabIndex = this.disabled ? -1 : 0;
      this.button.setAttribute('aria-expanded', 'false');
      this.button.setAttribute('aria-haspopup', 'listbox');
      this.prepend(this.button);
    }
    this.setFormControlElement(this);
    this.setAttributesTarget(this.button);
    __privateGet(this, _observer).observe(this, { childList: true, subtree: true });
    __privateGet(this, _buttonAriaObserver).observe(
      this.button,
      __privateGet(this, _buttonAriaObserverOptions)
    );
    __privateMethod(this, _Select_instances, observeSelectedOptionContent_fn).call(this);
    __privateMethod(this, _Select_instances, onSelectedOptionContentChange_fn).call(this);
    __privateGet(this, _events).listen(
      window,
      LOCALE_STATUS_EVENT,
      __privateMethod(this, _Select_instances, updateValueAndValidity_fn)
    );
  }
  disconnectedCallback() {
    __privateGet(this, _observer).disconnect();
    __privateGet(this, _buttonAriaObserver).disconnect();
    __privateGet(this, _selectedOptionObserver).disconnect();
    if (__privateGet(this, _widthCalculationFrame) !== void 0) {
      cancelAnimationFrame(__privateGet(this, _widthCalculationFrame));
      __privateSet(this, _widthCalculationFrame, void 0);
    }
    super.disconnectedCallback();
  }
  formAssociatedCallback() {
    __privateSet(this, _initialState, this.value);
  }
  formResetCallback() {
    this.value = __privateGet(this, _initialState);
    this.changeEvent.emit(this.value);
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('clearable')) {
      this.button.clearable = this.clearable;
      __privateMethod(this, _Select_instances, updateAriaKeyShortcuts_fn).call(this);
    }
    if (changes.has('disabled')) {
      this.button.disabled = this.disabled;
      this.button.tabIndex = this.disabled ? -1 : 0;
      __privateMethod(this, _Select_instances, updateAriaKeyShortcuts_fn).call(this);
    }
    if (changes.has('fill')) {
      this.button.fill = this.fill;
    }
    if (changes.has('placeholder')) {
      this.button.placeholder = this.placeholder;
    }
    if (changes.has('required')) {
      this.button.required = this.required;
      this.internals.ariaRequired = Boolean(this.required).toString();
      __privateMethod(this, _Select_instances, updateValueAndValidity_fn).call(this);
    }
    if (changes.has('showValid')) {
      this.button.showValid = this.showValid;
    }
    if (changes.has('showValidity')) {
      this.button.showValidity = this.showValidity;
    }
    if (changes.has('size')) {
      this.button.size = this.size;
    }
    if (changes.has('value')) {
      const selectedOption = this.options.find(option => option.value === this.value);
      if (selectedOption !== this.selectedOption) {
        __privateMethod(this, _Select_instances, setSelectedOption_fn).call(
          this,
          selectedOption,
          false
        );
      }
    }
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    requestAnimationFrame(() => {
      if (this.listbox) {
        this.button.internals.ariaControlsElements = [this.listbox];
      }
      __privateMethod(this, _Select_instances, syncListboxLabeling_fn).call(this);
    });
  }
  render() {
    const showClearButton = !this.disabled && this.clearable && this.selectedOption;
    return html`
      <slot name="button"></slot>
      ${
        showClearButton
          ? html`
              <button
                @click=${__privateMethod(this, _Select_instances, onClearButtonClick_fn)}
                @focusin=${__privateMethod(this, _Select_instances, onClearButtonFocusin_fn)}
                @focusout=${__privateMethod(this, _Select_instances, onClearButtonFocusout_fn)}
                aria-label=${msg('Clear selection', { id: 'sl.select.clearSelection' })}>
                <sl-icon name="circle-xmark"></sl-icon>
                <sl-icon name="circle-xmark-solid"></sl-icon>
              </button>
            `
          : nothing
      }
      <sl-listbox
        ${anchor({
          element: this.button,
          offset: Select.offset,
          position: 'bottom-start',
          rootMarginTop: this.rootMarginTop,
          viewportMargin: Select.viewportMargin
        })}
        @beforetoggle=${__privateMethod(this, _Select_instances, onBeforetoggle_fn)}
        @click=${__privateMethod(this, _Select_instances, onListboxClick_fn)}
        @keydown=${__privateMethod(this, _Select_instances, onListboxKeydown_fn)}
        @mousedown=${__privateMethod(this, _Select_instances, onListboxMousedown_fn)}
        @toggle=${__privateMethod(this, _Select_instances, onToggle_fn)}
        part="listbox"
        popover>
        <slot @slotchange=${__privateMethod(this, _Select_instances, onSlotchange_fn)}></slot>
      </sl-listbox>
    `;
  }
  focus(options) {
    this.button?.focus(options);
  }
};
_buttonAriaObserver = new WeakMap();
_buttonAriaObserverOptions = new WeakMap();
_events = new WeakMap();
_initialState = new WeakMap();
_focusLeavingComponent = new WeakMap();
_lastRenderedOption = new WeakMap();
_observer = new WeakMap();
_selectedOptionObserver = new WeakMap();
_widthCalculationFrame = new WeakMap();
_popoverClosing = new WeakMap();
_rovingTabindexController = new WeakMap();
_selectedContentContainer = new WeakMap();
_Select_instances = new WeakSet();
renderSelectedContent_fn = function () {
  if (!this.button) {
    return;
  }
  if (__privateGet(this, _lastRenderedOption) === this.selectedOption) {
    return;
  }
  let container =
    __privateGet(this, _selectedContentContainer) ??
    this.button.querySelector('[slot="selected-content"]') ??
    void 0;
  if (!this.selectedOption) {
    if (container && container.parentNode === this.button) {
      container.remove();
    }
    __privateSet(this, _selectedContentContainer, void 0);
    __privateSet(this, _lastRenderedOption, null);
    return;
  }
  if (!container) {
    container = document.createElement('span');
    container.setAttribute('slot', 'selected-content');
    this.button.appendChild(container);
  }
  __privateSet(this, _selectedContentContainer, container);
  const slotNodes = this.selectedOption.renderRoot.querySelector('slot')?.assignedNodes() ?? [];
  if (slotNodes.length) {
    const clones = [];
    slotNodes.forEach(node => {
      const rootNode = node.getRootNode();
      const scopedImportNode = rootNode.importNode;
      const ownerDocument = node.ownerDocument ?? document;
      const clone =
        typeof scopedImportNode === 'function'
          ? scopedImportNode.call(rootNode, node, true)
          : ownerDocument.importNode(node, true);
      clones.push(clone);
    });
    container.replaceChildren(...clones);
  } else {
    container.textContent = this.selectedOption.textContent?.trim() || '';
  }
  __privateSet(this, _lastRenderedOption, this.selectedOption);
};
onSelectedOptionContentChange_fn = function (records) {
  if (!this.selectedOption) {
    return;
  }
  const selectedOptionValue = this.selectedOption.value;
  if (selectedOptionValue !== this.value) {
    this.value = selectedOptionValue;
    __privateMethod(this, _Select_instances, updateValueAndValidity_fn).call(this);
  }
  const hasSelectedContentChange =
    !records ||
    records.some(record => record.type !== 'attributes' || record.attributeName !== 'value');
  if (!hasSelectedContentChange) {
    return;
  }
  __privateSet(this, _lastRenderedOption, void 0);
  __privateMethod(this, _Select_instances, renderSelectedContent_fn).call(this);
  __privateMethod(this, _Select_instances, scheduleLargestOptionWidthCalculation_fn).call(this);
};
onBeforetoggle_fn = function ({ newState }) {
  if (newState === 'open') {
    this.button.setAttribute('aria-expanded', 'true');
    this.listbox.style.setProperty(
      '--_select-listbox-width',
      `${this.button.getBoundingClientRect().width}px`
    );
    this.currentOption = this.selectedOption ?? this.options[0];
  } else {
    __privateSet(this, _popoverClosing, true);
    this.button.setAttribute('aria-expanded', 'false');
  }
};
onButtonClick_fn = function () {
  if (this.disabled) {
    return;
  } else if (
    !this.listbox ||
    (!isPopoverOpen(this.listbox) && !__privateGet(this, _popoverClosing))
  ) {
    this.listbox?.showPopover();
  }
  __privateSet(this, _popoverClosing, false);
};
_onButtonClear = new WeakMap();
onClear_fn = function () {
  __privateMethod(this, _Select_instances, setSelectedOption_fn).call(this, void 0, true);
};
onClearButtonClick_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
  if (this.listbox && isPopoverOpen(this.listbox)) {
    __privateSet(this, _popoverClosing, true);
    this.listbox.hidePopover();
  }
  __privateMethod(this, _Select_instances, onClear_fn).call(this);
  this.clearEvent.emit();
  this.button.focus();
};
onClearButtonFocusin_fn = function () {
  this.button.clearFocused = true;
};
onClearButtonFocusout_fn = function () {
  this.button.clearFocused = false;
};
onClick_fn = function (event2) {
  if (event2.target === this) {
    this.button.focus();
  }
};
onFocusin_fn = function () {
  this.focusEvent.emit();
};
onFocusout_fn = function (event2) {
  const leavingComponent =
    event2.relatedTarget !== this.button &&
    event2.relatedTarget !== this.clearButton &&
    (!(event2.relatedTarget instanceof Element) ||
      event2.relatedTarget?.closest('sl-select') !== this);
  if (leavingComponent) {
    const listboxIsOpen = this.listbox && isPopoverOpen(this.listbox);
    if (!__privateGet(this, _popoverClosing) && listboxIsOpen) {
      __privateSet(this, _focusLeavingComponent, true);
    }
    if (listboxIsOpen) {
      this.listbox.hidePopover();
      __privateSet(this, _popoverClosing, true);
    }
    this.blurEvent.emit();
    this.updateState({ touched: true });
  }
};
onKeydown_fn = function (event2) {
  if (this.disabled) {
    event2.preventDefault();
    event2.stopPropagation();
    return;
  } else if (!this.listbox || !isPopoverOpen(this.listbox)) {
    if (['ArrowDown', 'Enter', ' '].includes(event2.key)) {
      __privateGet(this, _rovingTabindexController).focus();
    } else if (event2.key === 'Home') {
      __privateGet(this, _rovingTabindexController).focusToElement(0);
    } else if (event2.key === 'End') {
      __privateGet(this, _rovingTabindexController).focusToElement(this.options.length - 1);
    } else {
      return;
    }
    event2.preventDefault();
    event2.stopPropagation();
    this.listbox?.showPopover();
  }
};
onListboxClick_fn = function (event2) {
  const option = event2.target?.closest('sl-option');
  if (option) {
    __privateMethod(this, _Select_instances, setSelectedOption_fn).call(this, option);
    __privateSet(this, _popoverClosing, true);
    this.listbox?.hidePopover();
  }
};
/**
 * Mousedown on the listbox surface (including scrollbar area) can move focus away from the trigger
 * button, which fires `focusout` on `<sl-select>` and closes the popover.
 *
 * We intentionally use `mousedown` (not `pointerdown`) to keep this fix scoped to the
 * mouse-triggered focus-transfer path that causes the regression.
 */
onListboxMousedown_fn = function (event2) {
  if (event2.button !== 0 || !this.listbox || event2.target !== this.listbox) {
    return;
  }
  event2.preventDefault();
};
onListboxKeydown_fn = function (event2) {
  if (event2.target instanceof Option && [' ', 'Enter'].includes(event2.key)) {
    event2.preventDefault();
    event2.stopPropagation();
    __privateMethod(this, _Select_instances, setSelectedOption_fn).call(this, event2.target);
    __privateSet(this, _popoverClosing, true);
    this.listbox?.hidePopover();
  } else if (event2.key === 'Escape') {
    event2.stopPropagation();
  }
};
onSlotchange_fn = function () {
  __privateMethod(this, _Select_instances, verifyRegisteredListboxElements_fn).call(this);
  this.listbox?.applyFlattenedOptionAccessibility(this.options);
  if (this.value !== void 0 && this.value !== null) {
    __privateMethod(this, _Select_instances, setSelectedOption_fn).call(
      this,
      this.options.find(option => option.value === this.value),
      false
    );
  } else {
    const selected = this.options.find(option => option.selected);
    __privateMethod(this, _Select_instances, setSelectedOption_fn).call(this, selected, false);
  }
  this.optionGroups?.forEach(group => {
    group.classList.remove('bottom-divider');
    if (group.nextElementSibling?.nodeName === 'SL-OPTION') {
      group.classList.add('bottom-divider');
    }
  });
  __privateMethod(this, _Select_instances, calculateLargestOptionWidth_fn).call(this);
};
onToggle_fn = function (event2) {
  if (event2.newState === 'open') {
    __privateGet(this, _rovingTabindexController).focus();
  } else if (event2.newState === 'closed') {
    if (!__privateGet(this, _focusLeavingComponent)) {
      this.button.focus();
    }
    __privateSet(this, _popoverClosing, false);
    __privateSet(this, _focusLeavingComponent, false);
  }
};
calculateLargestOptionWidth_fn = function () {
  if (!this.button) {
    return;
  }
  const notAllOptionsAreTextOnly = this.options.some(option => !!option.children.length);
  if (notAllOptionsAreTextOnly) {
    return;
  }
  const measureElement = __privateMethod(this, _Select_instances, setupMeasureElement_fn).call(
    this
  );
  let maxWidth = 0;
  this.options.forEach(option => {
    const textContent = option.textContent?.trim() || '';
    if (textContent) {
      measureElement.textContent = textContent;
      const totalWidth = measureElement.getBoundingClientRect().width + 16 + 8;
      maxWidth = Math.max(maxWidth, totalWidth);
    }
  });
  if (this.placeholder) {
    measureElement.textContent = this.placeholder;
    maxWidth = Math.max(maxWidth, measureElement.getBoundingClientRect().width);
  }
  document.body.removeChild(measureElement);
  this.button.optionSize = maxWidth;
};
getExplicitLabelState_fn = function () {
  const hostAriaLabel = this.getAttribute('aria-label')?.trim() || '',
    hostAriaLabelledBy = this.getAttribute('aria-labelledby')?.trim() || '',
    buttonAriaLabel = this.button.getAttribute('aria-label')?.trim() || '',
    buttonAriaLabelledBy = this.button.getAttribute('aria-labelledby')?.trim() || '',
    ariaLabel = hostAriaLabel || buttonAriaLabel,
    explicitLabelledBy = hostAriaLabelledBy || buttonAriaLabelledBy,
    explicitLabelledByElements = __privateMethod(
      this,
      _Select_instances,
      resolveLabelledByElements_fn
    ).call(this, explicitLabelledBy),
    hasExplicitLabel = Boolean(ariaLabel) || Boolean(explicitLabelledBy);
  return { ariaLabel, explicitLabelledBy, explicitLabelledByElements, hasExplicitLabel };
};
setupMeasureElement_fn = function () {
  const measureElement = document.createElement('span');
  measureElement.style.visibility = 'hidden';
  measureElement.style.position = 'absolute';
  measureElement.style.whiteSpace = 'nowrap';
  document.body.appendChild(measureElement);
  const buttonComputedStyle = getComputedStyle(this.button);
  measureElement.style.font = buttonComputedStyle.font;
  measureElement.style.fontFamily = buttonComputedStyle.fontFamily;
  measureElement.style.fontSize = buttonComputedStyle.fontSize;
  measureElement.style.fontWeight = buttonComputedStyle.fontWeight;
  return measureElement;
};
syncListboxLabeling_fn = function () {
  if (!this.listbox) {
    return;
  }
  __privateGet(this, _buttonAriaObserver).disconnect();
  try {
    const labels = Array.from(this.internals.labels),
      { ariaLabel, explicitLabelledBy, explicitLabelledByElements, hasExplicitLabel } =
        __privateMethod(this, _Select_instances, getExplicitLabelState_fn).call(this);
    if (!hasExplicitLabel && labels.length) {
      this.listbox.removeAttribute('aria-label');
      this.button.ariaLabelledByElements = labels;
      this.listbox.ariaLabelledByElements = labels;
    } else if (explicitLabelledBy) {
      this.listbox.removeAttribute('aria-label');
      this.button.ariaLabelledByElements = explicitLabelledByElements;
      this.listbox.ariaLabelledByElements = explicitLabelledByElements;
      if (!explicitLabelledByElements.length) {
        this.button.setAttribute('aria-labelledby', explicitLabelledBy);
        this.listbox.setAttribute('aria-labelledby', explicitLabelledBy);
      }
    } else if (ariaLabel) {
      this.button.ariaLabelledByElements = [];
      this.listbox.ariaLabel = ariaLabel;
      this.listbox.ariaLabelledByElements = [];
    } else {
      this.button.ariaLabelledByElements = [];
      this.listbox.removeAttribute('aria-label');
      this.listbox.ariaLabelledByElements = [];
    }
  } finally {
    if (this.isConnected) {
      __privateGet(this, _buttonAriaObserver).observe(
        this.button,
        __privateGet(this, _buttonAriaObserverOptions)
      );
    }
  }
};
/** Returns a flattened array of all options (also the options in groups). */
getAllOptions_fn = function (root) {
  if (root instanceof Option) {
    return root;
  } else if (root instanceof OptionGroup) {
    return Array.from(root.children).flatMap(child =>
      __privateMethod(this, _Select_instances, getAllOptions_fn).call(this, child)
    );
  } else {
    return [];
  }
};
setSelectedOption_fn = function (option, emitEvent = true) {
  if (this.selectedOption) {
    this.selectedOption.selected = false;
    this.selectedOption.setAttribute('aria-selected', 'false');
  }
  this.selectedOption = option;
  if (this.selectedOption) {
    this.selectedOption.selected = true;
    this.selectedOption.setAttribute('aria-selected', 'true');
  }
  __privateMethod(this, _Select_instances, observeSelectedOptionContent_fn).call(this);
  this.button.selected = this.selectedOption;
  this.value = this.selectedOption?.value;
  __privateMethod(this, _Select_instances, renderSelectedContent_fn).call(this);
  if (emitEvent) {
    this.changeEvent.emit(this.value);
    this.updateState({ dirty: true });
  }
  __privateMethod(this, _Select_instances, updateValueAndValidity_fn).call(this);
  __privateMethod(this, _Select_instances, updateAriaKeyShortcuts_fn).call(this);
};
observeSelectedOptionContent_fn = function () {
  __privateGet(this, _selectedOptionObserver).disconnect();
  if (!this.selectedOption) {
    return;
  }
  __privateGet(this, _selectedOptionObserver).observe(this.selectedOption, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['value']
  });
};
resolveLabelledByElements_fn = function (ariaLabelledBy) {
  if (!ariaLabelledBy) {
    return [];
  }
  const root = this.getRootNode();
  return ariaLabelledBy
    .split(/\s+/)
    .map(id => id.trim())
    .filter(Boolean)
    .map(id => root.querySelector(`#${CSS.escape(id)}`))
    .filter(element => element !== null);
};
scheduleLargestOptionWidthCalculation_fn = function () {
  if (__privateGet(this, _widthCalculationFrame) !== void 0) {
    return;
  }
  __privateSet(
    this,
    _widthCalculationFrame,
    requestAnimationFrame(() => {
      __privateSet(this, _widthCalculationFrame, void 0);
      __privateMethod(this, _Select_instances, calculateLargestOptionWidth_fn).call(this);
    })
  );
};
updateAriaKeyShortcuts_fn = function () {
  if (this.clearable && !this.disabled && this.selectedOption) {
    this.button.setAttribute('aria-keyshortcuts', 'Delete Backspace');
  } else {
    this.button.removeAttribute('aria-keyshortcuts');
  }
};
updateValueAndValidity_fn = function () {
  this.internals.setFormValue(this.nativeFormValue);
  if (!this.validity.customError) {
    this.internals.setValidity(
      { valueMissing: this.required && !this.selectedOption },
      msg('Please choose an option from the list.', { id: 'sl.select.validation.valueMissing' })
    );
  }
  this.updateValidity();
};
verifyRegisteredListboxElements_fn = function () {
  const option = this.querySelector('sl-option');
  if (option && !(option instanceof Option)) {
    console.warn(
      'sl-option elements must be registered as custom elements via the @sl-design-system/listbox package'
    );
  }
};
/** @internal */
Select.formAssociated = true;
/** @internal The default offset of the listbox to the button. */
Select.offset = 6;
/** @internal */
Select.styles = styles;
/** @internal The default margin between the tooltip and the viewport. */
Select.viewportMargin = 8;
__decorateClass([event({ name: 'sl-blur' })], Select.prototype, 'blurEvent', 2);
__decorateClass([event({ name: 'sl-change' })], Select.prototype, 'changeEvent', 2);
__decorateClass([event({ name: 'sl-clear' })], Select.prototype, 'clearEvent', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Select.prototype, 'clearable', 2);
__decorateClass([state()], Select.prototype, 'currentOption', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Select.prototype, 'disabled', 2);
__decorateClass([property()], Select.prototype, 'fill', 2);
__decorateClass([event({ name: 'sl-focus' })], Select.prototype, 'focusEvent', 2);
__decorateClass([query('button')], Select.prototype, 'clearButton', 2);
__decorateClass([query('sl-listbox')], Select.prototype, 'listbox', 2);
__decorateClass(
  [queryAssignedElements({ selector: 'sl-option-group', flatten: true })],
  Select.prototype,
  'optionGroups',
  2
);
__decorateClass([property()], Select.prototype, 'placeholder', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Select.prototype, 'required', 2);
__decorateClass([state()], Select.prototype, 'selectedOption', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'show-valid' })],
  Select.prototype,
  'showValid',
  2
);
__decorateClass([property({ reflect: true })], Select.prototype, 'size', 2);
__decorateClass(
  [property({ type: Number, attribute: 'hide-margin-top' })],
  Select.prototype,
  'rootMarginTop',
  2
);
__decorateClass([property()], Select.prototype, 'value', 2);
Select = __decorateClass([localized()], Select);
//# sourceMappingURL=select.js.map
