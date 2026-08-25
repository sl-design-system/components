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
var _events,
  _isInitialRender,
  _pendingActiveDescendantFrame,
  _noMatch,
  _observer,
  _pointerDown,
  _popoverJustClosed,
  _popoverOpenedViaKeyboard,
  _selectedGroup,
  _useVirtualList,
  _Combobox_instances,
  ariaAutocomplete_get,
  onBeforeToggle_fn,
  onButtonClick_fn,
  onClick_fn,
  onFocus_fn,
  onFocusout_fn,
  onInput_fn,
  onInputClick_fn,
  onKeydown_fn,
  onOptionClick_fn,
  onPointerDown_fn,
  onPointerUp_fn,
  onRemove_fn,
  getVisibleRemovableTags_fn,
  getNextSelectedTagItem_fn,
  focusSelectedTag_fn,
  onSlotChange_fn,
  onTextFieldBlur_fn,
  onTextFieldChange_fn,
  onTextFieldFocus_fn,
  onTextFieldFormControl_fn,
  onTextFieldUpdateState_fn,
  onToggle_fn,
  getListboxOptions_fn,
  addCustomOption_fn,
  removeCustomOption_fn,
  addGroupedOption_fn,
  removeGroupedOption_fn,
  addSelectedGroup_fn,
  removeSelectedGroup_fn,
  addSelectedOption_fn,
  removeSelectedOption_fn,
  toggleSelectedOption_fn,
  scrollSelectedGroupIntoView_fn,
  flattenOptions_fn,
  isEqualValue_fn,
  isStringCoercibleValue_fn,
  findItemByValue_fn,
  prepareOptions_fn,
  prepareOption_fn,
  renderItem_fn,
  updateCreateCustomOption_fn,
  updateCurrent_fn,
  setActiveDescendant_fn,
  cancelPendingActiveDescendantUpdate_fn,
  isElementVisibleInListbox_fn,
  updateFilteredOptions_fn,
  updateSelectedItems_fn,
  updateSelectedItemsFromItems_fn,
  updateTextFieldValue_fn,
  updateValue_fn,
  updateFormValue_fn;
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Listbox, Option, OptionGroup, OptionGroupHeader } from '@sl-design-system/listbox';
import {
  EventsController,
  ObserveAttributesMixin,
  anchor,
  event,
  getStringByPath,
  getValueByPath,
  isPopoverOpen,
  setValueByPath
} from '@sl-design-system/shared';
import { Tag, TagList } from '@sl-design-system/tag';
import { TextField } from '@sl-design-system/text-field';
import { LitElement, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import styles from './combobox.scss.js';
import { CreateCustomOption } from './create-custom-option.js';
import { CustomOption } from './custom-option.js';
import { GroupedOption } from './grouped-option.js';
import { NoMatch } from './no-match.js';
import { SelectedGroup } from './selected-group.js';
let nextUniqueId = 0;
export let Combobox = class extends ObserveAttributesMixin(
  FormControlMixin(ScopedElementsMixin(LitElement)),
  ['aria-label', 'aria-describedby', 'aria-labelledby']
) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _Combobox_instances);
    /** Event controller. */
    __privateAdd(
      this,
      _events,
      new EventsController(this, {
        click: __privateMethod(this, _Combobox_instances, onClick_fn),
        focusout: __privateMethod(this, _Combobox_instances, onFocusout_fn)
      })
    );
    /** Indicates if the component is rendering for the first time. */
    __privateAdd(this, _isInitialRender, true);
    /** ID of a pending aria-activedescendant update after virtual list scrolling. */
    __privateAdd(this, _pendingActiveDescendantFrame);
    /** Message element for when filtering results did not yield any results. */
    __privateAdd(this, _noMatch);
    /** Update the width of the popover while open. */
    __privateAdd(
      this,
      _observer,
      new ResizeObserver(entries => {
        if (this.wrapper && isPopoverOpen(this.wrapper)) {
          this.wrapper.style.inlineSize = `${entries[0].contentRect.width}px`;
        }
      })
    );
    /**
     * Flag indicating whether pointerdown event has happened. We need to know this so we know if we
     * need to show the popover when the input receives focus. If pointerdown has happened, we know
     * that the input is being focused as a result of a click, and we will show the popover in the
     * click event handler, not the focus event handler.
     */
    __privateAdd(this, _pointerDown, false);
    /**
     * Flag indicating whether the popover was just closed. We need to know this so we can properly
     * handle button clicks that close the popover. If the popover was just closed, we don't want to
     * show it again when the button click event fires.
     */
    __privateAdd(this, _popoverJustClosed, false);
    /** Flag indicating whether the popover was opened via keyboard navigation. */
    __privateAdd(this, _popoverOpenedViaKeyboard, false);
    /** The group that contains all the selected options when `groupSelected` is set. */
    __privateAdd(this, _selectedGroup);
    /** Flag to indicate when to use lit-virtualizer. */
    __privateAdd(this, _useVirtualList, false);
    this.autocomplete = 'both';
    /** @internal. */
    this.internals = this.attachInternals();
    this.items = [];
    this.selectedItems = [];
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-combobox-create-custom-option': CreateCustomOption,
      'sl-combobox-custom-option': CustomOption,
      'sl-combobox-grouped-option': GroupedOption,
      'sl-combobox-no-match': NoMatch,
      'sl-combobox-selected-group': SelectedGroup,
      'sl-icon': Icon,
      'sl-listbox': Listbox,
      'sl-option': Option,
      'sl-option-group-header': OptionGroupHeader,
      'sl-tag': Tag,
      'sl-tag-list': TagList,
      'sl-text-field': TextField
    };
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.input) {
      this.input = this.querySelector('input[slot="input"]') || document.createElement('input');
      this.input.autocomplete = 'off';
      this.input.slot = 'input';
      if (!this.input.parentElement) {
        this.append(this.input);
      }
    }
    this.input.setAttribute('role', 'combobox');
    this.input.setAttribute(
      'aria-autocomplete',
      __privateGet(this, _Combobox_instances, ariaAutocomplete_get)
    );
    this.input.setAttribute('aria-expanded', 'false');
    this.input.setAttribute('aria-haspopup', 'listbox');
    __privateGet(this, _events).listen(
      this.input,
      'click',
      __privateMethod(this, _Combobox_instances, onInputClick_fn)
    );
    __privateGet(this, _events).listen(
      this.input,
      'focus',
      __privateMethod(this, _Combobox_instances, onFocus_fn)
    );
    __privateGet(this, _events).listen(
      this.input,
      'pointerdown',
      __privateMethod(this, _Combobox_instances, onPointerDown_fn)
    );
    __privateGet(this, _events).listen(
      this.input,
      'pointerup',
      __privateMethod(this, _Combobox_instances, onPointerUp_fn)
    );
    __privateGet(this, _observer).observe(this);
    this.setFormControlElement(this);
    this.setAttributesTarget(this.input);
    const style = document.createElement('style');
    style.innerHTML = `
      sl-combobox:has(input:hover):not(:focus-within)::part(text-field) {
        --_bg-opacity: var(--sl-opacity-interactive-plain-hover);
      }
      sl-combobox[has-selected-items] input::placeholder {
        color: transparent;
      }
    `;
    this.prepend(style);
  }
  disconnectedCallback() {
    __privateGet(this, _observer).disconnect();
    __privateMethod(this, _Combobox_instances, cancelPendingActiveDescendantUpdate_fn).call(this);
    super.disconnectedCallback();
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('multiple')) {
      this.listbox?.setAttribute('aria-multiselectable', Boolean(this.multiple).toString());
      __privateMethod(this, _Combobox_instances, updateSelectedItems_fn).call(this);
    }
    if (changes.has('groupSelected')) {
      if (this.groupSelected) {
        __privateMethod(this, _Combobox_instances, addSelectedGroup_fn).call(this);
      } else {
        __privateMethod(this, _Combobox_instances, removeSelectedGroup_fn).call(this);
      }
    }
    if (changes.has('labelId')) {
      const previousLabelId = changes.get('labelId'),
        ariaLabel = this.input.getAttribute('aria-label'),
        ariaLabelledBy = this.input.getAttribute('aria-labelledby'),
        hasExplicitAccessibleName = Boolean(
          ariaLabel || (ariaLabelledBy && ariaLabelledBy !== previousLabelId)
        );
      if (!this.labelId || ariaLabel) {
        if (ariaLabelledBy === previousLabelId) {
          this.input.removeAttribute('aria-labelledby');
        }
      } else if (!hasExplicitAccessibleName) {
        this.input.setAttribute('aria-labelledby', this.labelId);
      }
    }
    const optionsConfigChanged =
      changes.has('options') ||
      changes.has('optionDisabledPath') ||
      changes.has('optionGroupPath') ||
      changes.has('optionLabelPath') ||
      changes.has('optionSelectedPath') ||
      changes.has('optionValuePath');
    if (optionsConfigChanged) {
      if (this.options) {
        this.items = __privateMethod(this, _Combobox_instances, prepareOptions_fn).call(
          this,
          this.options
        );
        this.listbox?.remove();
        this.listbox = this.shadowRoot.createElement('sl-listbox');
        this.listbox.items = this.items;
        this.listbox.renderer = (item, index) =>
          __privateMethod(this, _Combobox_instances, renderItem_fn).call(this, item, index);
        this.appendChild(this.listbox);
        __privateSet(this, _useVirtualList, true);
      } else if (changes.get('options')) {
        this.items = [];
        __privateSet(this, _useVirtualList, false);
      }
    }
    const usesOptionsApi =
      this.options !== void 0 || (changes.has('options') && changes.get('options') !== void 0);
    if (changes.has('value') && this.items.length) {
      __privateMethod(this, _Combobox_instances, updateSelectedItems_fn).call(this);
    } else if (optionsConfigChanged && usesOptionsApi) {
      if (changes.has('value') || (this.value !== void 0 && !changes.has('optionSelectedPath'))) {
        __privateMethod(this, _Combobox_instances, updateSelectedItems_fn).call(this);
      } else {
        __privateMethod(this, _Combobox_instances, updateSelectedItemsFromItems_fn).call(this);
      }
      if (!this.items.length) {
        __privateMethod(this, _Combobox_instances, updateTextFieldValue_fn).call(this);
        __privateMethod(this, _Combobox_instances, updateValue_fn).call(
          this,
          !__privateGet(this, _isInitialRender)
        );
        __privateSet(this, _isInitialRender, false);
      }
    }
    if (changes.has('selectedItems')) {
      this.toggleAttribute(
        'has-selected-items',
        Boolean(this.multiple && this.selectedItems.length > 0)
      );
      if (this.items.length) {
        __privateMethod(this, _Combobox_instances, updateTextFieldValue_fn).call(this);
        __privateMethod(this, _Combobox_instances, updateValue_fn).call(
          this,
          !__privateGet(this, _isInitialRender)
        );
        __privateSet(this, _isInitialRender, false);
      }
    }
    if (changes.has('required')) {
      this.internals.ariaRequired = this.required ? 'true' : 'false';
    }
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('autocomplete')) {
      this.input.setAttribute('aria-autocomplete', this.autocomplete || 'both');
    }
    if (changes.has('autocomplete') || changes.has('selectOnly')) {
      const value = __privateGet(this, _Combobox_instances, ariaAutocomplete_get);
      if (
        import.meta.env?.DEV &&
        this.selectOnly &&
        this.autocomplete &&
        this.autocomplete !== 'off'
      ) {
        console.warn(
          `sl-combobox: The 'autocomplete="${this.autocomplete}"' property is ignored when 'selectOnly' is true. Select-only comboboxes have a read-only input field and therefore cannot have autocomplete. The component will use aria-autocomplete="none" instead.`
        );
      }
      this.input.setAttribute('aria-autocomplete', value);
      this.input.readOnly = !!this.selectOnly;
    }
    if (changes.has('disabled')) {
      this.input.disabled = !!this.disabled;
    }
    if (
      changes.has('filterResults') &&
      changes.get('filterResults') &&
      !this.filterResults &&
      __privateGet(this, _useVirtualList)
    ) {
      this.items = this.items.map(o => ({ ...o, visible: true }));
      this.listbox.items = this.items;
    }
    if (changes.has('required')) {
      this.updateValidity();
    }
    if (changes.has('name') && this.input.hasAttribute('name')) {
      this.input.removeAttribute('name');
    }
  }
  /* eslint-disable slds/text-field-has-label -- aria-label/aria-labelledby are forwarded to the internal input via ObserveAttributesMixin */
  render() {
    return html`
      <sl-text-field
        @input=${__privateMethod(this, _Combobox_instances, onInput_fn)}
        @keydown=${__privateMethod(this, _Combobox_instances, onKeydown_fn)}
        @sl-blur=${__privateMethod(this, _Combobox_instances, onTextFieldBlur_fn)}
        @sl-change=${__privateMethod(this, _Combobox_instances, onTextFieldChange_fn)}
        @sl-focus=${__privateMethod(this, _Combobox_instances, onTextFieldFocus_fn)}
        @sl-form-control=${__privateMethod(this, _Combobox_instances, onTextFieldFormControl_fn)}
        @sl-update-state=${__privateMethod(this, _Combobox_instances, onTextFieldUpdateState_fn)}
        ?disabled=${this.disabled}
        ?readonly=${this.selectOnly}
        ?required=${this.required}
        part="text-field"
        placeholder=${ifDefined(
          this.multiple && this.selectedItems.length ? void 0 : this.placeholder
        )}
        show-validity=${ifDefined(this.showValidity)}
        size=${ifDefined(this.size)}>
        ${
          this.multiple && this.selectedItems.length
            ? html`
                <sl-tag-list
                  ?disabled=${this.disabled}
                  aria-label=${msg('Selected options', { id: 'sl.combobox.selectedOptions' })}
                  size=${ifDefined(this.size)}
                  slot="prefix"
                  stacked>
                  ${repeat(
                    this.selectedItems,
                    item => item,
                    item => html`
                      <sl-tag
                        @sl-remove=${event2 => {
                          event2.stopPropagation();
                          __privateMethod(this, _Combobox_instances, onRemove_fn).call(
                            this,
                            item,
                            event2
                          );
                        }}
                        ?disabled=${this.disabled}
                        ?removable=${!this.disabled}>
                        ${item.label}
                      </sl-tag>
                    `
                  )}
                </sl-tag-list>
              `
            : nothing
        }
        <slot name="input" slot="input"></slot>
        <button
          @click=${__privateMethod(this, _Combobox_instances, onButtonClick_fn)}
          ?disabled=${this.disabled}
          aria-expanded=${this.input?.getAttribute('aria-expanded') ?? 'false'}
          aria-label=${msg('Options', { id: 'sl.combobox.options' })}
          slot="suffix"
          tabindex="-1">
          <sl-icon name="chevron-down"></sl-icon>
        </button>
      </sl-text-field>

      <slot
        ${anchor({
          element: this,
          offset: Combobox.offset,
          position: 'bottom-start',
          viewportMargin: Combobox.viewportMargin
        })}
        @beforetoggle=${__privateMethod(this, _Combobox_instances, onBeforeToggle_fn)}
        @click=${__privateMethod(this, _Combobox_instances, onOptionClick_fn)}
        @slotchange=${() => __privateMethod(this, _Combobox_instances, onSlotChange_fn).call(this)}
        @toggle=${__privateMethod(this, _Combobox_instances, onToggle_fn)}
        part="wrapper"
        popover
        tabindex="-1"></slot>
    `;
  }
  /* eslint-enable slds/text-field-has-label */
  /** @internal */
  focus(options) {
    this.input?.focus(options);
  }
  getLocalizedValidationMessage() {
    if (this.validity.valueMissing) {
      return this.multiple
        ? msg('Please select at least one option.', {
            id: 'sl.combobox.validation.valueMissingMultiple'
          })
        : msg('Please select an option.', { id: 'sl.combobox.validation.valueMissing' });
    } else {
      return super.getLocalizedValidationMessage();
    }
  }
  /** @internal */
  updateInternalValidity() {
    if (!this.validity.customError) {
      if (this.multiple) {
        this.internals.setValidity(
          { valueMissing: this.required && this.selectedItems.length === 0 },
          msg('Please choose an option from the list.', { id: 'sl.select.validation.valueMissing' })
        );
      } else {
        this.internals.setValidity(
          { valueMissing: this.required && !this.input.value },
          msg('Please choose an option from the list.', { id: 'sl.select.validation.valueMissing' })
        );
      }
    }
  }
};
_events = new WeakMap();
_isInitialRender = new WeakMap();
_pendingActiveDescendantFrame = new WeakMap();
_noMatch = new WeakMap();
_observer = new WeakMap();
_pointerDown = new WeakMap();
_popoverJustClosed = new WeakMap();
_popoverOpenedViaKeyboard = new WeakMap();
_selectedGroup = new WeakMap();
_useVirtualList = new WeakMap();
_Combobox_instances = new WeakSet();
ariaAutocomplete_get = function () {
  if (this.selectOnly || this.autocomplete === 'off') {
    return 'none';
  }
  return this.autocomplete || 'both';
};
onBeforeToggle_fn = function (event2) {
  const expanded = event2.newState === 'open',
    button = this.renderRoot.querySelector('button[slot="suffix"]');
  button?.setAttribute('aria-expanded', expanded.toString());
  if (event2.newState === 'open') {
    this.input.setAttribute('aria-expanded', 'true');
    this.wrapper.style.inlineSize = `${this.getBoundingClientRect().width}px`;
  } else {
    this.input.setAttribute('aria-expanded', 'false');
    __privateSet(this, _popoverJustClosed, true);
  }
  this.requestUpdate();
};
onButtonClick_fn = function () {
  if (!__privateGet(this, _popoverJustClosed)) {
    this.wrapper?.togglePopover();
    this.input.focus();
  }
};
onClick_fn = function (event2) {
  if (
    event2
      .composedPath()
      .find(el => el instanceof HTMLElement && el.matches('button[slot="suffix"]'))
  ) {
    return;
  }
  if (event2.target === this) {
    this.input.focus();
  }
};
onFocus_fn = function () {
  if (__privateGet(this, _pointerDown)) {
    this.wrapper?.showPopover();
  }
};
onFocusout_fn = function (event2) {
  const leavingComponent =
    !event2.relatedTarget || (event2.relatedTarget !== this && event2.relatedTarget !== this.input);
  if (leavingComponent) {
    this.wrapper?.hidePopover();
    __privateMethod(this, _Combobox_instances, updateCreateCustomOption_fn).call(this);
    __privateMethod(this, _Combobox_instances, updateTextFieldValue_fn).call(this);
    __privateMethod(this, _Combobox_instances, updateFilteredOptions_fn).call(this);
    this.updateValidity();
  }
};
onInput_fn = function (event2) {
  const value = this.input.value;
  this.wrapper?.showPopover();
  let item = void 0;
  if (
    event2.inputType !== 'deleteContentBackward' &&
    (this.autocomplete === 'inline' || this.autocomplete === 'both')
  ) {
    item = this.items.find(
      i =>
        i.type === 'option' && !i.disabled && i.label.toLowerCase().startsWith(value.toLowerCase())
    );
    if (item) {
      this.input.value = item.label;
      this.input.setSelectionRange(value.length, item.label.length);
    }
  } else {
    item = __privateMethod(this, _Combobox_instances, findItemByValue_fn).call(
      this,
      value,
      item2 => !item2.disabled
    );
  }
  if (this.allowCustomValues && !item) {
    __privateMethod(this, _Combobox_instances, updateCreateCustomOption_fn).call(this, value);
    __privateMethod(this, _Combobox_instances, updateCurrent_fn).call(
      this,
      this.createCustomOption
    );
  } else {
    __privateMethod(this, _Combobox_instances, updateCurrent_fn).call(this, item);
  }
  __privateMethod(this, _Combobox_instances, updateFilteredOptions_fn).call(this, value);
  this.updateState({ dirty: true });
  this.updateValidity();
};
onInputClick_fn = function () {
  this.wrapper?.showPopover();
  if (!this.multiple && !__privateGet(this, _popoverOpenedViaKeyboard)) {
    if (this.currentItem) {
      this.currentItem.current = false;
    }
    this.currentItem?.element?.removeAttribute('current');
    this.listbox?.querySelector('[current]')?.removeAttribute('current');
    const selectedItem = this.selectedItems[0] ?? this.items.find(i => i.selected);
    if (selectedItem) {
      __privateMethod(this, _Combobox_instances, updateCurrent_fn).call(
        this,
        selectedItem,
        'instant',
        { visual: false }
      );
    } else {
      const selectedOption =
        this.querySelector('sl-option[selected]') ?? this.querySelector('sl-option');
      if (selectedOption) {
        selectedOption.id ||= `sl-combobox-option-${nextUniqueId++}`;
        this.input.setAttribute('aria-activedescendant', selectedOption.id);
      }
    }
  }
};
onKeydown_fn = function (event2) {
  if (!event2.composedPath().includes(this.input)) {
    return;
  }
  const isSelectOnlySpace = !!this.selectOnly && event2.key === ' ';
  if (event2.key === 'Enter' || isSelectOnlySpace) {
    if (isSelectOnlySpace) {
      event2.preventDefault();
    }
    if (this.allowCustomValues && this.currentItem === this.createCustomOption) {
      __privateMethod(this, _Combobox_instances, addCustomOption_fn).call(this, this.input.value);
    } else if (this.currentItem?.custom && this.currentItem?.option) {
      __privateMethod(this, _Combobox_instances, removeCustomOption_fn).call(
        this,
        this.currentItem
      );
    } else if (this.currentItem) {
      __privateMethod(this, _Combobox_instances, toggleSelectedOption_fn).call(
        this,
        this.currentItem
      );
      __privateMethod(this, _Combobox_instances, updateFilteredOptions_fn).call(this);
      __privateMethod(this, _Combobox_instances, updateCreateCustomOption_fn).call(this);
      if (!this.multiple) {
        this.wrapper?.hidePopover();
      }
    }
  } else if (
    !this.wrapper?.matches(':popover-open') &&
    ['ArrowDown', 'ArrowUp'].includes(event2.key)
  ) {
    __privateSet(this, _popoverOpenedViaKeyboard, true);
    this.wrapper?.showPopover();
  } else if (['ArrowDown', 'ArrowUp', 'End', 'Home'].includes(event2.key)) {
    event2.preventDefault();
    event2.stopPropagation();
    const items = this.items.filter(i => i.type === 'option' && i.visible && !i.disabled);
    if (items.length === 0) {
      return;
    }
    let delta = 0,
      index = -1;
    if (this.currentItem) {
      index = items.indexOf(this.currentItem);
    }
    switch (event2.key) {
      case 'ArrowDown':
        delta = 1;
        break;
      case 'ArrowUp':
        if (index === -1) {
          index = items.length;
        }
        delta = -1;
        break;
      case 'Home':
        index = 0;
        break;
      case 'End':
        index = items.length - 1;
        break;
    }
    index = (index + delta + items.length) % items.length;
    __privateMethod(this, _Combobox_instances, updateCurrent_fn).call(this, items[index], 'auto');
  } else if (event2.key === 'Escape') {
    event2.stopPropagation();
  }
};
onOptionClick_fn = function (event2) {
  const element = event2.composedPath().find(el => el instanceof Option);
  if (element instanceof CreateCustomOption) {
    __privateMethod(this, _Combobox_instances, addCustomOption_fn).call(this, element.value);
  } else if (element?.id) {
    const item = this.items.find(i => i.id === element.id && i.visible && !i.disabled);
    if (!item) {
      return;
    }
    __privateMethod(this, _Combobox_instances, toggleSelectedOption_fn).call(this, item);
    __privateMethod(this, _Combobox_instances, updateCurrent_fn).call(this);
    __privateMethod(this, _Combobox_instances, updateFilteredOptions_fn).call(this);
    __privateMethod(this, _Combobox_instances, updateCreateCustomOption_fn).call(this);
    this.input.focus();
    if (!this.multiple) {
      this.wrapper?.hidePopover();
    }
  }
};
onPointerDown_fn = function () {
  __privateSet(this, _pointerDown, true);
};
onPointerUp_fn = function () {
  __privateSet(this, _pointerDown, false);
};
onRemove_fn = function (item, event2) {
  const nextFocusedItem = event2
    ? __privateMethod(this, _Combobox_instances, getNextSelectedTagItem_fn).call(this, item)
    : void 0;
  __privateMethod(this, _Combobox_instances, removeSelectedOption_fn).call(this, item);
  __privateMethod(this, _Combobox_instances, updateFilteredOptions_fn).call(this);
  __privateMethod(this, _Combobox_instances, updateCurrent_fn).call(this);
  if (__privateGet(this, _popoverJustClosed)) {
    this.wrapper?.showPopover();
  }
  if (event2) {
    void this.updateComplete.then(() => {
      requestAnimationFrame(() =>
        __privateMethod(this, _Combobox_instances, focusSelectedTag_fn).call(this, nextFocusedItem)
      );
    });
  }
};
getVisibleRemovableTags_fn = function () {
  return Array.from(this.renderRoot.querySelectorAll('sl-tag')).filter(
    tag => tag.removable && tag.style.display !== 'none'
  );
};
getNextSelectedTagItem_fn = function (item) {
  const tags = Array.from(this.renderRoot.querySelectorAll('sl-tag')),
    visibleTags = new Set(
      __privateMethod(this, _Combobox_instances, getVisibleRemovableTags_fn).call(this)
    ),
    visibleTagItems = tags
      .map((tag, index2) => ({ item: this.selectedItems[index2], tag }))
      .filter(({ item: item2, tag }) => item2 && visibleTags.has(tag)),
    index = visibleTagItems.findIndex(({ item: tagItem }) => tagItem === item);
  return visibleTagItems[index + 1]?.item ?? visibleTagItems[index - 1]?.item;
};
focusSelectedTag_fn = function (item) {
  const tags = Array.from(this.renderRoot.querySelectorAll('sl-tag')),
    tag = item ? tags[this.selectedItems.indexOf(item)] : void 0,
    focusTarget =
      tag && tag.style.display !== 'none'
        ? tag
        : __privateMethod(this, _Combobox_instances, getVisibleRemovableTags_fn).call(this)[0];
  if (focusTarget) {
    focusTarget.focus();
  } else {
    this.input.focus();
  }
};
/** Updates the list of options and the listbox link with the text input. */
onSlotChange_fn = function () {
  this.listbox = this.wrapper
    ?.assignedElements({ flatten: true })
    .find(el => el instanceof Listbox);
  if (this.listbox) {
    this.listbox.id ||= `sl-combobox-listbox-${nextUniqueId++}`;
    this.input.setAttribute('aria-controls', this.listbox.id);
    if (this.multiple) {
      this.listbox.setAttribute('aria-multiselectable', 'true');
    } else {
      this.listbox.removeAttribute('aria-multiselectable');
    }
    if (__privateGet(this, _useVirtualList)) {
      this.listbox.items = this.items;
    } else if (this.listbox.childElementCount) {
      const { hasSelected, items, selectedItems } = __privateMethod(
        this,
        _Combobox_instances,
        getListboxOptions_fn
      ).call(this, this.listbox);
      this.items = items;
      this.selectedItems = selectedItems;
      if (hasSelected) {
        __privateMethod(this, _Combobox_instances, updateValue_fn).call(this, false);
      } else {
        __privateMethod(this, _Combobox_instances, updateSelectedItems_fn).call(this);
      }
    } else {
      this.listbox.renderRoot.addEventListener(
        'slotchange',
        () => __privateMethod(this, _Combobox_instances, onSlotChange_fn).call(this),
        {
          once: true
        }
      );
    }
  } else {
    this.input.removeAttribute('aria-controls');
    this.items = [];
  }
};
onTextFieldBlur_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
  this.blurEvent.emit();
  this.updateState({ touched: true });
};
onTextFieldChange_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
};
onTextFieldFocus_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
  this.focusEvent.emit();
};
onTextFieldFormControl_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
};
onTextFieldUpdateState_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
};
onToggle_fn = function (event2) {
  if (event2.newState === 'open') {
    if (!this.multiple) {
      const index = this.items.findIndex(i => i.selected);
      if (index !== -1) {
        this.listbox?.scrollToIndex(index, { block: 'start' });
      } else {
        this.listbox?.scrollIntoView({ block: 'start' });
      }
      const selectedOptionElement = this.listbox?.querySelector('sl-option[selected]');
      const selectedItem =
        this.selectedItems[0] ??
        this.items.find(
          i => i.selected || (selectedOptionElement && i.id === selectedOptionElement.id)
        );
      if (selectedItem) {
        __privateMethod(this, _Combobox_instances, updateCurrent_fn).call(
          this,
          selectedItem,
          'instant',
          {
            visual: __privateGet(this, _popoverOpenedViaKeyboard)
          }
        );
      } else if (selectedOptionElement?.id) {
        this.input.setAttribute('aria-activedescendant', selectedOptionElement.id);
      }
    }
    __privateSet(this, _popoverOpenedViaKeyboard, false);
  } else {
    __privateSet(this, _popoverJustClosed, false);
    __privateMethod(this, _Combobox_instances, updateCurrent_fn).call(this);
  }
};
getListboxOptions_fn = function (listbox) {
  let hasSelected = false,
    selectedItems = [];
  const items = Array.from(listbox.children)
    .flatMap(el => __privateMethod(this, _Combobox_instances, flattenOptions_fn).call(this, el))
    .filter(el => !(el instanceof CreateCustomOption))
    .map(el => {
      el.id ||= `sl-combobox-option-${nextUniqueId++}`;
      this.optionLabelPath ??= 'label';
      this.optionValuePath ??= 'value';
      const label = el.textContent?.trim(),
        value = el.value ?? label,
        group = el.closest('sl-option-group')?.label || void 0,
        selected = !el.disabled && el.selected;
      const item = {
        id: el.id,
        element: el,
        group,
        label,
        option: {
          [this.optionLabelPath || 'label']: label,
          [this.optionValuePath || 'value']: value
        },
        disabled: el.disabled,
        selected,
        type: 'option',
        value,
        visible: true
      };
      if (selected) {
        hasSelected = true;
        selectedItems = [...selectedItems, item];
      }
      el.selected = selected;
      el.setAttribute('aria-selected', Boolean(selected).toString());
      return item;
    });
  return { hasSelected, items, selectedItems };
};
addCustomOption_fn = function (value) {
  if (!value.trimEnd()) {
    return;
  }
  let option = void 0;
  if (this.optionLabelPath) {
    option = {};
    setValueByPath(option, this.optionLabelPath, value);
    if (this.optionValuePath) {
      setValueByPath(option, this.optionValuePath, value);
    }
  } else {
    option = value;
  }
  const item = {
    id: `sl-combobox-custom-option-${nextUniqueId++}`,
    custom: true,
    label: value,
    option,
    selected: true,
    type: 'option',
    value,
    visible: true
  };
  this.items = [item, ...this.items];
  if (__privateGet(this, _useVirtualList)) {
    this.listbox.items = this.items;
  } else {
    const el = (item.element ||= this.shadowRoot.createElement('sl-combobox-custom-option'));
    el.id = item.id;
    el.innerText = value;
    el.selected = true;
    el.value = value;
    el.setAttribute('aria-selected', 'true');
    if (!el.parentElement) {
      this.listbox?.prepend(el);
    }
  }
  __privateMethod(this, _Combobox_instances, addSelectedOption_fn).call(this, item);
  __privateMethod(this, _Combobox_instances, updateCreateCustomOption_fn).call(this);
  __privateMethod(this, _Combobox_instances, updateCurrent_fn).call(this, item);
};
removeCustomOption_fn = function (item) {
  if (!item) {
    return;
  }
  this.items = this.items.filter(i => i !== item);
  this.selectedItems = this.selectedItems.filter(i => i !== item);
  if (__privateGet(this, _useVirtualList)) {
    this.listbox.items = this.items;
  } else {
    item.element?.remove();
  }
};
addGroupedOption_fn = function (item) {
  __privateMethod(this, _Combobox_instances, addSelectedGroup_fn).call(this);
  const groupedItem = { ...item, selected: true, visible: true };
  let index = 0;
  if (this.items[0].type === 'group') {
    index = this.items.findIndex(i => i !== this.items[0] && i.type === 'group');
    index = Math.max(0, index);
  } else {
    index = this.items.findIndex(i => !(i.element instanceof GroupedOption));
    index = Math.max(0, index);
  }
  this.items = [...this.items.slice(0, index), groupedItem, ...this.items.slice(index)];
  this.selectedItems = [...this.selectedItems, groupedItem];
  if (__privateGet(this, _useVirtualList)) {
    this.listbox.items = this.items.filter(i => i.visible);
  } else {
    const el = (groupedItem.element = this.shadowRoot.createElement('sl-combobox-grouped-option'));
    el.group = groupedItem.group;
    el.id = groupedItem.id;
    el.innerText = groupedItem.label;
    el.selected = true;
    el.setAttribute('aria-selected', 'true');
    if (!el.parentElement) {
      __privateGet(this, _selectedGroup)?.append(el);
    }
  }
};
removeGroupedOption_fn = function (item) {
  const originalItem = this.items.find(i => i.id === item.id && !i.visible);
  if (originalItem) {
    originalItem.selected = false;
    originalItem.visible = true;
    if (originalItem.element instanceof Option) {
      originalItem.element.selected = false;
      originalItem.element.style.display = '';
      originalItem.element.setAttribute('aria-selected', 'false');
    }
  }
  this.items = this.items.filter(i => i !== item);
  this.selectedItems = this.selectedItems.filter(i => i !== item);
  if (__privateGet(this, _useVirtualList)) {
    this.listbox.items = this.items.filter(i => i.visible);
  } else {
    item.element?.remove();
    item.element = void 0;
  }
  __privateMethod(this, _Combobox_instances, updateCurrent_fn).call(
    this,
    this.items.find(i => i.id === item.id)
  );
  if (this.selectedItems.length === 0) {
    __privateMethod(this, _Combobox_instances, removeSelectedGroup_fn).call(this);
  }
};
addSelectedGroup_fn = function () {
  if (__privateGet(this, _useVirtualList)) {
    if (
      this.items[0].label === msg('Selected', { id: 'sl.common.selected' }) &&
      this.items[0].type === 'group'
    ) {
      return;
    }
    const selectedHeader = {
      id: `sl-combobox-option-group-${nextUniqueId++}`,
      label: msg('Selected', { id: 'sl.common.selected' }),
      type: 'group',
      visible: true
    };
    if (this.optionGroupPath) {
      this.items = [selectedHeader, ...this.items];
    } else {
      const allOptionsHeader = {
        id: `sl-combobox-option-group-${nextUniqueId++}`,
        label: msg('All options', { id: 'sl.common.allOptions' }),
        type: 'group',
        visible: true
      };
      this.items = [selectedHeader, allOptionsHeader, ...this.items];
    }
  } else {
    __privateGet(this, _selectedGroup) ||
      __privateSet(
        this,
        _selectedGroup,
        this.shadowRoot.createElement('sl-combobox-selected-group')
      );
    __privateGet(this, _selectedGroup).hasGroups = !!this.listbox?.querySelector('sl-option-group');
    if (!__privateGet(this, _selectedGroup).parentElement) {
      this.listbox?.prepend(__privateGet(this, _selectedGroup));
    }
  }
};
removeSelectedGroup_fn = function () {
  if (__privateGet(this, _useVirtualList)) {
    if (
      this.items[0].label === msg('Selected', { id: 'sl.common.selected' }) &&
      this.items[0].type === 'group'
    ) {
      this.items = this.items.slice(1);
    } else {
      return;
    }
    while (this.items[0].type !== 'group') {
      __privateMethod(this, _Combobox_instances, removeGroupedOption_fn).call(this, this.items[0]);
    }
    if (
      this.items[0].label === msg('All options', { id: 'sl.common.allOptions' }) &&
      this.items[0].type === 'group'
    ) {
      this.items = this.items.slice(1);
    }
    this.listbox.items = this.items;
  } else {
    __privateGet(this, _selectedGroup)?.remove();
    __privateSet(this, _selectedGroup, void 0);
  }
};
addSelectedOption_fn = function (item) {
  if (this.multiple) {
    if (this.groupSelected) {
      item.visible = false;
      __privateMethod(this, _Combobox_instances, addGroupedOption_fn).call(this, item);
    } else {
      item.selected = true;
      this.selectedItems = [...this.selectedItems, item];
    }
  } else {
    item.selected = true;
    this.selectedItems.forEach(item2 =>
      __privateMethod(this, _Combobox_instances, removeSelectedOption_fn).call(this, item2)
    );
    this.selectedItems = [item];
  }
  item.current = false;
  __privateMethod(this, _Combobox_instances, updateCurrent_fn).call(
    this,
    this.selectedItems.find(i => i.id === item.id)
  );
  if (item.element instanceof Option) {
    item.element.selected = item.selected;
    item.element.style.display = item.visible ? '' : 'none';
    item.element.setAttribute('aria-selected', Boolean(item.selected).toString());
  }
};
removeSelectedOption_fn = function (item) {
  if (this.groupSelected) {
    __privateMethod(this, _Combobox_instances, removeGroupedOption_fn).call(this, item);
  } else {
    item.selected = false;
    this.selectedItems = this.selectedItems.filter(i => i !== item);
    if (item.custom) {
      __privateMethod(this, _Combobox_instances, removeCustomOption_fn).call(this, item);
    } else if (item.element instanceof Option) {
      item.element.selected = false;
      item.element.setAttribute('aria-selected', 'false');
    }
  }
};
toggleSelectedOption_fn = function (item, force) {
  if (!item || item.type !== 'option' || item.disabled) {
    return;
  }
  const selected = typeof force === 'boolean' ? force : !item.selected;
  if (selected) {
    __privateMethod(this, _Combobox_instances, addSelectedOption_fn).call(this, item);
    if (this.multiple && this.groupSelected) {
      void __privateMethod(this, _Combobox_instances, scrollSelectedGroupIntoView_fn).call(this);
    }
  } else {
    __privateMethod(this, _Combobox_instances, removeSelectedOption_fn).call(this, item);
  }
};
scrollSelectedGroupIntoView_fn = async function () {
  await this.updateComplete;
  await this.listbox?.updateComplete;
  await new Promise(resolve => requestAnimationFrame(() => resolve()));
  if (__privateGet(this, _useVirtualList)) {
    this.listbox?.scrollToIndex(0, { block: 'start', behavior: 'auto' });
  } else {
    __privateGet(this, _selectedGroup)?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }
};
flattenOptions_fn = function (el) {
  if (el instanceof Option) {
    return [el];
  } else if (el instanceof OptionGroup) {
    return Array.from(el.children).flatMap(child =>
      __privateMethod(this, _Combobox_instances, flattenOptions_fn).call(this, child)
    );
  } else if (el instanceof HTMLSlotElement) {
    return Array.from(el.assignedElements({ flatten: true })).flatMap(child =>
      __privateMethod(this, _Combobox_instances, flattenOptions_fn).call(this, child)
    );
  }
  return [];
};
isEqualValue_fn = function (a, b) {
  if (a === b) {
    return true;
  }
  if (
    __privateMethod(this, _Combobox_instances, isStringCoercibleValue_fn).call(this, a) &&
    __privateMethod(this, _Combobox_instances, isStringCoercibleValue_fn).call(this, b)
  ) {
    return a.toString() === b.toString();
  }
  return false;
};
isStringCoercibleValue_fn = function (value) {
  switch (typeof value) {
    case 'bigint':
    case 'boolean':
    case 'number':
    case 'string':
      return true;
    default:
      return false;
  }
};
findItemByValue_fn = function (value, predicate = () => true) {
  return (
    this.items.find(item => item.type === 'option' && predicate(item) && item.value === value) ??
    this.items.find(
      item =>
        item.type === 'option' &&
        predicate(item) &&
        __privateMethod(this, _Combobox_instances, isEqualValue_fn).call(this, item.value, value)
    )
  );
};
prepareOptions_fn = function (options) {
  if (this.optionGroupPath) {
    const groups = Object.groupBy(options, option => getStringByPath(option, this.optionGroupPath));
    return Object.keys(groups).reduce((acc, group) => {
      return [
        ...acc,
        {
          id: `sl-combobox-option-group-${nextUniqueId++}`,
          label: group,
          type: 'group',
          visible: true
        },
        ...groups[group].map(option =>
          __privateMethod(this, _Combobox_instances, prepareOption_fn).call(
            this,
            option,
            options.indexOf(option),
            group
          )
        )
      ];
    }, []);
  } else {
    return options.map((option, index) =>
      __privateMethod(this, _Combobox_instances, prepareOption_fn).call(this, option, index)
    );
  }
};
prepareOption_fn = function (option, index, group) {
  const disabled = this.optionDisabledPath
      ? !!getValueByPath(option, this.optionDisabledPath)
      : false,
    label = this.optionLabelPath
      ? getStringByPath(option, this.optionLabelPath)
      : option.toString();
  return {
    group,
    id: `sl-combobox-option-${nextUniqueId++}`,
    index,
    label,
    option,
    disabled,
    selected:
      !disabled && this.optionSelectedPath
        ? !!getValueByPath(option, this.optionSelectedPath)
        : false,
    type: 'option',
    value: this.optionValuePath ? getValueByPath(option, this.optionValuePath) : option,
    visible: true
  };
};
renderItem_fn = function (item, index) {
  if ('option' in item) {
    let tagName = 'sl-option';
    if (item.custom) {
      tagName = 'sl-combobox-custom-option';
    } else if (this.groupSelected && item.selected) {
      tagName = 'sl-combobox-grouped-option';
    }
    const el = (item.element = this.shadowRoot.createElement(tagName));
    el.id = item.id;
    el.disabled = !!item.disabled;
    el.innerText = item.label;
    el.selected = !!item.selected;
    el.value = item.value;
    el.setAttribute('aria-selected', item.selected ? 'true' : 'false');
    const flattenedPosition = this.listbox.getFlattenedPosition(item);
    if (flattenedPosition !== -1) {
      el.setAttribute('aria-posinset', (flattenedPosition + 1).toString());
      el.setAttribute('aria-setsize', this.listbox.getFlattenedSetSize().toString());
    }
    if (item.group) {
      el.setAttribute('aria-label', `${item.label} (${item.group})`);
    }
    if (el instanceof GroupedOption) {
      el.group = item.group;
    }
    if (item.current) {
      el.setAttribute('current', '');
    }
    return el;
  } else if (item.custom) {
    const el = (item.element = this.shadowRoot.createElement('sl-combobox-create-custom-option'));
    el.id = item.id;
    el.value = item.label;
    if (item.current) {
      el.setAttribute('current', '');
    }
    return el;
  } else {
    const el = (item.element = this.shadowRoot.createElement('sl-option-group-header'));
    el.divider = index !== 0;
    el.innerText = item.label;
    return el;
  }
};
updateCreateCustomOption_fn = function (labelAndValue) {
  if (labelAndValue?.trim()) {
    if (this.createCustomOption) {
      this.createCustomOption.label = labelAndValue;
      this.createCustomOption.value = labelAndValue;
    } else {
      this.createCustomOption = {
        custom: true,
        id: `sl-combobox-create-custom-option-${nextUniqueId++}`,
        label: labelAndValue,
        type: 'option',
        value: labelAndValue,
        visible: true
      };
      this.items = [this.createCustomOption, ...this.items];
    }
    if (__privateGet(this, _useVirtualList)) {
      this.listbox.items = this.items;
    } else {
      this.createCustomOption.element ||= this.shadowRoot.createElement(
        'sl-combobox-create-custom-option'
      );
      this.createCustomOption.element.id = this.createCustomOption.id;
      if (!this.createCustomOption.element.parentElement) {
        this.listbox?.prepend(this.createCustomOption.element);
      }
    }
    if (this.createCustomOption.element) {
      this.createCustomOption.element.value = labelAndValue;
    }
  } else if (this.createCustomOption) {
    this.items = this.items.filter(i => i !== this.createCustomOption);
    if (__privateGet(this, _useVirtualList)) {
      this.listbox.items = this.items;
    } else {
      this.createCustomOption.element?.remove();
    }
    this.createCustomOption = void 0;
  }
};
/** Updates the options to reflect the current one. */
updateCurrent_fn = function (option, scrollBehaviour = 'instant', { visual = true } = {}) {
  if (this.currentItem) {
    this.currentItem.current = false;
    this.currentItem.element?.removeAttribute('current');
    this.listbox?.querySelector('[current]')?.removeAttribute('current');
  }
  if (!option || !option.visible) {
    this.currentItem = void 0;
    __privateMethod(this, _Combobox_instances, cancelPendingActiveDescendantUpdate_fn).call(this);
    this.input.removeAttribute('aria-activedescendant');
    return;
  }
  this.currentItem = option;
  if (this.currentItem) {
    let deferActiveDescendantUpdate = false;
    this.currentItem.current = visual;
    if (this.currentItem.element?.isConnected) {
      if (visual) {
        this.currentItem.element.setAttribute('current', '');
      } else {
        this.currentItem.element.removeAttribute('current');
      }
      if (
        !__privateMethod(this, _Combobox_instances, isElementVisibleInListbox_fn).call(
          this,
          this.currentItem.element
        )
      ) {
        this.currentItem.element.scrollIntoView({ block: 'nearest', behavior: scrollBehaviour });
        deferActiveDescendantUpdate = __privateGet(this, _useVirtualList);
      }
    } else {
      const index = this.listbox?.items?.indexOf(this.currentItem) ?? -1;
      if (index !== -1) {
        this.listbox?.scrollToIndex(index, {
          block: 'nearest',
          behavior: scrollBehaviour
        });
        deferActiveDescendantUpdate = __privateGet(this, _useVirtualList);
      }
    }
    __privateMethod(this, _Combobox_instances, setActiveDescendant_fn).call(
      this,
      this.currentItem.id,
      deferActiveDescendantUpdate
    );
  }
};
setActiveDescendant_fn = function (id, defer = false) {
  __privateMethod(this, _Combobox_instances, cancelPendingActiveDescendantUpdate_fn).call(this);
  if (!defer) {
    this.input.setAttribute('aria-activedescendant', id);
    return;
  }
  __privateSet(
    this,
    _pendingActiveDescendantFrame,
    requestAnimationFrame(() => {
      __privateSet(
        this,
        _pendingActiveDescendantFrame,
        requestAnimationFrame(() => {
          __privateSet(this, _pendingActiveDescendantFrame, void 0);
          this.updateComplete.then(() => {
            if (this.isConnected && this.input.isConnected && this.currentItem?.id === id) {
              this.input.setAttribute('aria-activedescendant', id);
            }
          });
        })
      );
    })
  );
};
cancelPendingActiveDescendantUpdate_fn = function () {
  if (__privateGet(this, _pendingActiveDescendantFrame) !== void 0) {
    cancelAnimationFrame(__privateGet(this, _pendingActiveDescendantFrame));
    __privateSet(this, _pendingActiveDescendantFrame, void 0);
  }
};
isElementVisibleInListbox_fn = function (element) {
  if (!this.listbox) {
    return true;
  }
  const elementRect = element.getBoundingClientRect(),
    listboxRect = this.listbox.getBoundingClientRect();
  return elementRect.top >= listboxRect.top && elementRect.bottom <= listboxRect.bottom;
};
updateFilteredOptions_fn = function (value) {
  if (!this.filterResults) {
    return;
  }
  let noMatch = true;
  this.items.forEach(item => {
    let match = !value;
    if (!match) {
      match = item.label.toLowerCase().startsWith(value.toLowerCase());
    }
    if (noMatch && match) {
      noMatch = false;
    }
    item.visible = match;
    if (!__privateGet(this, _useVirtualList)) {
      item.element.style.display = match ? '' : 'none';
    }
  });
  if (__privateGet(this, _useVirtualList)) {
    this.listbox.items = this.items.filter(o => o.visible);
  }
  this.listbox?.scrollToIndex(0);
  if (noMatch && value) {
    __privateGet(this, _noMatch) ||
      __privateSet(this, _noMatch, this.shadowRoot.createElement('sl-combobox-no-match'));
    __privateGet(this, _noMatch).value = value;
    this.listbox?.prepend(__privateGet(this, _noMatch));
  } else {
    __privateGet(this, _noMatch)?.remove();
    __privateSet(this, _noMatch, void 0);
  }
};
/** Updates the selection based on the options & value. */
updateSelectedItems_fn = function () {
  this.selectedItems.forEach(item =>
    __privateMethod(this, _Combobox_instances, removeSelectedOption_fn).call(this, item)
  );
  this.selectedItems = [];
  if (this.multiple) {
    if (!Array.isArray(this.value)) {
      return;
    }
    const selectedItems = /* @__PURE__ */ new Set();
    this.value.forEach(value => {
      const item = __privateMethod(this, _Combobox_instances, findItemByValue_fn).call(
        this,
        value,
        item2 => !item2.disabled && !selectedItems.has(item2)
      );
      if (item) {
        selectedItems.add(item);
      }
    });
    selectedItems.forEach(item =>
      __privateMethod(this, _Combobox_instances, addSelectedOption_fn).call(this, item)
    );
  } else {
    const item = __privateMethod(this, _Combobox_instances, findItemByValue_fn).call(
      this,
      this.value,
      item2 => !item2.disabled
    );
    if (item) {
      __privateMethod(this, _Combobox_instances, addSelectedOption_fn).call(this, item);
    }
  }
};
/** Updates the selection based on the selected state of the prepared items. */
updateSelectedItemsFromItems_fn = function () {
  [...this.selectedItems].forEach(item =>
    __privateMethod(this, _Combobox_instances, removeSelectedOption_fn).call(this, item)
  );
  this.selectedItems = [];
  const selectedItems = this.items.filter(
    item => item.type === 'option' && item.selected && !item.disabled
  );
  if (this.multiple) {
    selectedItems.forEach(item =>
      __privateMethod(this, _Combobox_instances, addSelectedOption_fn).call(this, item)
    );
  } else if (selectedItems[0]) {
    __privateMethod(this, _Combobox_instances, addSelectedOption_fn).call(this, selectedItems[0]);
  }
};
/** Update the value in the text field. */
updateTextFieldValue_fn = function () {
  if (this.multiple) {
    this.input.placeholder =
      this.selectedItems.map(i => i.label).join(', ') || this.placeholder || '';
    this.input.value = '';
  } else {
    const item = this.selectedItems.at(0);
    if (item) {
      this.input.value = item.label;
      this.input.setSelectionRange(-1, -1);
    } else {
      this.input.value = '';
    }
  }
};
/** Updates the value based on the current selection. */
updateValue_fn = function (emitEvent = true) {
  const values = this.selectedItems.map(i => i.value);
  const isValueEqual = this.multiple
    ? Array.isArray(this.value) &&
      this.value.length === values.length &&
      values.every(v =>
        this.value.some(value =>
          __privateMethod(this, _Combobox_instances, isEqualValue_fn).call(this, value, v)
        )
      )
    : __privateMethod(this, _Combobox_instances, isEqualValue_fn).call(this, this.value, values[0]);
  if (isValueEqual) {
    __privateMethod(this, _Combobox_instances, updateFormValue_fn).call(this);
    this.updateValidity();
    return;
  }
  this.value = this.multiple ? values : values[0];
  __privateMethod(this, _Combobox_instances, updateFormValue_fn).call(this);
  if (emitEvent) {
    this.changeEvent.emit(this.value);
    this.updateState({ dirty: true });
  }
  this.updateValidity();
};
/** Syncs the form value with the current selection. */
updateFormValue_fn = function () {
  if (this.multiple) {
    const values = this.selectedItems.map(i => i.value);
    this.internals.setFormValue(values.join(', ') || null);
  } else {
    const item = this.selectedItems.at(0);
    if (item) {
      this.internals.setFormValue(
        __privateGet(this, _useVirtualList) && item.index !== void 0
          ? item.index.toString()
          : item.value?.toString() || item.label
      );
    } else {
      this.internals.setFormValue(null);
    }
  }
};
/** @internal The default offset of the popover to the input. */
Combobox.offset = 6;
/** @internal */
Combobox.styles = styles;
/** @internal The default margin between the popover and the viewport. */
Combobox.viewportMargin = 8;
/** @internal */
Combobox.formAssociated = true;
__decorateClass(
  [property({ type: Boolean, attribute: 'allow-custom-values' })],
  Combobox.prototype,
  'allowCustomValues',
  2
);
__decorateClass([property()], Combobox.prototype, 'autocomplete', 2);
__decorateClass([event({ name: 'sl-blur' })], Combobox.prototype, 'blurEvent', 2);
__decorateClass([event({ name: 'sl-change' })], Combobox.prototype, 'changeEvent', 2);
__decorateClass([state()], Combobox.prototype, 'createCustomOption', 2);
__decorateClass([state()], Combobox.prototype, 'currentItem', 2);
__decorateClass([property({ type: Boolean, reflect: true })], Combobox.prototype, 'disabled', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'filter-results' })],
  Combobox.prototype,
  'filterResults',
  2
);
__decorateClass([event({ name: 'sl-focus' })], Combobox.prototype, 'focusEvent', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'group-selected' })],
  Combobox.prototype,
  'groupSelected',
  2
);
__decorateClass([state()], Combobox.prototype, 'items', 2);
__decorateClass([state()], Combobox.prototype, 'listbox', 2);
__decorateClass([property({ type: Boolean })], Combobox.prototype, 'multiple', 2);
__decorateClass([property({ attribute: 'data-label-id' })], Combobox.prototype, 'labelId', 2);
__decorateClass(
  [property({ attribute: 'option-group-path' })],
  Combobox.prototype,
  'optionGroupPath',
  2
);
__decorateClass(
  [property({ attribute: 'option-disabled-path' })],
  Combobox.prototype,
  'optionDisabledPath',
  2
);
__decorateClass(
  [property({ attribute: 'option-label-path' })],
  Combobox.prototype,
  'optionLabelPath',
  2
);
__decorateClass(
  [property({ attribute: 'option-selected-path' })],
  Combobox.prototype,
  'optionSelectedPath',
  2
);
__decorateClass(
  [property({ attribute: 'option-value-path' })],
  Combobox.prototype,
  'optionValuePath',
  2
);
__decorateClass([property({ type: Array })], Combobox.prototype, 'options', 2);
__decorateClass([property()], Combobox.prototype, 'placeholder', 2);
__decorateClass(
  [property({ type: Boolean, reflect: true, attribute: 'select-only' })],
  Combobox.prototype,
  'selectOnly',
  2
);
__decorateClass([property({ type: Boolean, reflect: true })], Combobox.prototype, 'required', 2);
__decorateClass([state()], Combobox.prototype, 'selectedItems', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'show-valid' })],
  Combobox.prototype,
  'showValid',
  2
);
__decorateClass([property({ reflect: true })], Combobox.prototype, 'size', 2);
__decorateClass([property()], Combobox.prototype, 'value', 2);
__decorateClass([query('[part="wrapper"]')], Combobox.prototype, 'wrapper', 2);
Combobox = __decorateClass([localized()], Combobox);
//# sourceMappingURL=combobox.js.map
