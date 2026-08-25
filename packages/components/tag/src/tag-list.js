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
var _breakResizeObserverLoop,
  _hasResolvedInitialVisibility,
  _scheduleVisibilityUpdate,
  _initialVisibilityPassFrame,
  _rovingTabindexManaged,
  _tagDisabledState,
  _tagMaxInlineSizeState,
  _initialVisibilityPasses,
  _observedStack,
  _observedParent,
  _TagList_instances,
  isStackedActive_fn,
  syncInitialVisibilityState_fn,
  resetInitialVisibilityState_fn,
  syncStackObservation_fn,
  syncParentObservation_fn,
  _resizeObserver,
  _rovingTabindexController,
  getHiddenTagsDescription_fn,
  onRemove_fn,
  isUnknownArray_fn,
  isResizeObserverSize_fn,
  isFocusableElement_fn,
  getBorderBoxInlineSize_fn,
  onResize_fn,
  onSlotChange_fn,
  syncTags_fn,
  syncTagDisabledState_fn,
  restoreTagDisabledState_fn,
  setTagMaxInlineSize_fn,
  restoreTagMaxInlineSize_fn,
  runVisibilityUpdate_fn,
  updateVisibility_fn,
  getMaxInlineSize_fn,
  constrainLastVisibleTag_fn,
  clearRovingTabindexCache_fn,
  clearManagedTabindexes_fn,
  syncRovingTabindexController_fn;
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { RovingTabindexController } from '@sl-design-system/shared';
import { Tooltip } from '@sl-design-system/tooltip';
import { LitElement, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './tag-list.scss.js';
import { Tag } from './tag.js';
const SUBPIXEL_BUFFER_PX = 0.5;
export let TagList = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    __privateAdd(this, _TagList_instances);
    /** Timer used for breaking a possible resize observer loop. */
    __privateAdd(this, _breakResizeObserverLoop);
    /** Tracks whether the first visibility resolution already happened. */
    __privateAdd(this, _hasResolvedInitialVisibility, false);
    /** Animation frame used to batch slot-change visibility updates. */
    __privateAdd(this, _scheduleVisibilityUpdate);
    /** Animation frame used to run an additional initial stabilization pass. */
    __privateAdd(this, _initialVisibilityPassFrame);
    /** Whether the roving tabindex controller is currently listening for keyboard navigation. */
    __privateAdd(this, _rovingTabindexManaged, true);
    /** Original disabled state of tags temporarily disabled through the tag list. */
    __privateAdd(this, _tagDisabledState, /* @__PURE__ */ new WeakMap());
    /** Original max-inline-size of tags temporarily constrained through stacked overflow. */
    __privateAdd(this, _tagMaxInlineSizeState, /* @__PURE__ */ new WeakMap());
    /** Number of completed passes before the initial visibility is considered stable. */
    __privateAdd(this, _initialVisibilityPasses, 0);
    /** Currently observed stack element, if stacked mode is active. */
    __privateAdd(this, _observedStack);
    /** Currently observed parent element, if connected. */
    __privateAdd(this, _observedParent);
    /**
     * Observe size changes so we can determine when to display a counter with the amount of hidden
     * tags.
     */
    __privateAdd(
      this,
      _resizeObserver,
      new ResizeObserver(entries =>
        __privateMethod(this, _TagList_instances, onResize_fn).call(this, entries)
      )
    );
    /** Manage keyboard navigation between tags. */
    __privateAdd(
      this,
      _rovingTabindexController,
      new RovingTabindexController(this, {
        direction: 'horizontal',
        focusInIndex: elements => {
          const index = elements.findIndex(el =>
            __privateMethod(this, _TagList_instances, isFocusableElement_fn).call(this, el)
          );
          return index === -1 ? 0 : index;
        },
        elements: () => {
          if (!this.keyboardNavigation) {
            return [];
          }
          const stackTags =
            this.stacked &&
            this.stackTag &&
            this.stackTag.style.display !== 'none' &&
            __privateMethod(this, _TagList_instances, isFocusableElement_fn).call(
              this,
              this.stackTag
            )
              ? [this.stackTag]
              : [];
          return [
            ...stackTags,
            ...(this.tags ?? []).filter(t => t.style.display !== 'none' && !!t.removable)
          ];
        },
        isFocusableElement: el =>
          __privateMethod(this, _TagList_instances, isFocusableElement_fn).call(this, el)
      })
    );
    this.keyboardNavigation = true;
    /** @internal The inline size of the stack element. */
    this.stackInlineSize = 0;
    this.stackSize = 0;
    this.tags = [];
    this.removeAttribute('data-visibility-resolved');
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-tag': Tag,
      'sl-tooltip': Tooltip
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'list');
    __privateMethod(this, _TagList_instances, resetInitialVisibilityState_fn).call(this);
    __privateMethod(this, _TagList_instances, syncStackObservation_fn).call(this);
    __privateMethod(this, _TagList_instances, syncParentObservation_fn).call(this);
    __privateGet(this, _resizeObserver).observe(this);
  }
  disconnectedCallback() {
    __privateGet(this, _resizeObserver).disconnect();
    __privateSet(this, _observedStack, void 0);
    __privateSet(this, _observedParent, void 0);
    if (__privateGet(this, _breakResizeObserverLoop)) {
      clearTimeout(__privateGet(this, _breakResizeObserverLoop));
      __privateSet(this, _breakResizeObserverLoop, void 0);
    }
    if (__privateGet(this, _scheduleVisibilityUpdate) !== void 0) {
      cancelAnimationFrame(__privateGet(this, _scheduleVisibilityUpdate));
      __privateSet(this, _scheduleVisibilityUpdate, void 0);
    }
    if (__privateGet(this, _initialVisibilityPassFrame) !== void 0) {
      cancelAnimationFrame(__privateGet(this, _initialVisibilityPassFrame));
      __privateSet(this, _initialVisibilityPassFrame, void 0);
    }
    super.disconnectedCallback();
  }
  updated(changes) {
    super.updated(changes);
    __privateMethod(this, _TagList_instances, syncTags_fn).call(this);
    if (changes.has('keyboardNavigation')) {
      __privateGet(this, _rovingTabindexController).clearElementCache();
      if (!this.keyboardNavigation) {
        __privateMethod(this, _TagList_instances, clearManagedTabindexes_fn).call(this);
      }
    }
    __privateMethod(this, _TagList_instances, syncRovingTabindexController_fn).call(this);
    if (changes.has('stacked')) {
      if (this.stacked && this.stack) {
        __privateMethod(this, _TagList_instances, resetInitialVisibilityState_fn).call(this);
      } else {
        __privateMethod(this, _TagList_instances, resetInitialVisibilityState_fn).call(this);
        this.stackSize = 0;
        this.removeAttribute('data-stacked-active');
        this.tags.forEach(tag => {
          tag.style.display = '';
          __privateMethod(this, _TagList_instances, restoreTagMaxInlineSize_fn).call(this, tag);
        });
      }
    }
    __privateMethod(this, _TagList_instances, syncStackObservation_fn).call(this);
  }
  render() {
    const hiddenTagsDescription =
      this.stacked && this.stackSize > 0
        ? __privateMethod(this, _TagList_instances, getHiddenTagsDescription_fn).call(this)
        : '';
    return html`
      ${
        this.stacked
          ? html`
              <sl-tag
                .tooltip=${hiddenTagsDescription}
                class="stack"
                role="listitem"
                size=${ifDefined(this.size)}
                variant=${ifDefined(this.variant)}>
                +${this.stackSize}
              </sl-tag>
            `
          : nothing
      }
      <div @sl-remove=${__privateMethod(this, _TagList_instances, onRemove_fn)} class="list">
        <slot @slotchange=${__privateMethod(this, _TagList_instances, onSlotChange_fn)}></slot>
      </div>
    `;
  }
};
_breakResizeObserverLoop = new WeakMap();
_hasResolvedInitialVisibility = new WeakMap();
_scheduleVisibilityUpdate = new WeakMap();
_initialVisibilityPassFrame = new WeakMap();
_rovingTabindexManaged = new WeakMap();
_tagDisabledState = new WeakMap();
_tagMaxInlineSizeState = new WeakMap();
_initialVisibilityPasses = new WeakMap();
_observedStack = new WeakMap();
_observedParent = new WeakMap();
_TagList_instances = new WeakSet();
/**
 * Stacked lists stay hidden until the first visibility calculation settles. These helpers keep that
 * initial render stable and ensure the resize observer follows only the currently rendered stack
 * element.
 */
isStackedActive_fn = function () {
  return this.stacked || this.hasAttribute('stacked');
};
/** Expose stacked tag list only after initial visibility has been resolved. */
syncInitialVisibilityState_fn = function () {
  this.toggleAttribute(
    'data-visibility-resolved',
    !__privateMethod(this, _TagList_instances, isStackedActive_fn).call(this) ||
      __privateGet(this, _hasResolvedInitialVisibility)
  );
};
/** Restart the initial visibility flow whenever stacked mode needs a fresh layout pass. */
resetInitialVisibilityState_fn = function () {
  __privateSet(this, _hasResolvedInitialVisibility, false);
  __privateSet(this, _initialVisibilityPasses, 0);
  __privateMethod(this, _TagList_instances, syncInitialVisibilityState_fn).call(this);
  if (__privateGet(this, _initialVisibilityPassFrame) !== void 0) {
    cancelAnimationFrame(__privateGet(this, _initialVisibilityPassFrame));
    __privateSet(this, _initialVisibilityPassFrame, void 0);
  }
};
/** Keep the ResizeObserver subscribed to the current stack element only. */
syncStackObservation_fn = function () {
  const nextObservedStack = this.stacked ? this.stack : void 0;
  if (__privateGet(this, _observedStack) === nextObservedStack) {
    return;
  }
  if (__privateGet(this, _observedStack)) {
    __privateGet(this, _resizeObserver).unobserve(__privateGet(this, _observedStack));
  }
  if (nextObservedStack) {
    __privateGet(this, _resizeObserver).observe(nextObservedStack);
  }
  __privateSet(this, _observedStack, nextObservedStack);
};
/** Recalculate tag visibility when the available space from the parent changes. */
syncParentObservation_fn = function () {
  const nextObservedParent = this.parentElement ?? void 0;
  if (__privateGet(this, _observedParent) === nextObservedParent) {
    return;
  }
  if (__privateGet(this, _observedParent)) {
    __privateGet(this, _resizeObserver).unobserve(__privateGet(this, _observedParent));
  }
  if (nextObservedParent) {
    __privateGet(this, _resizeObserver).observe(nextObservedParent);
  }
  __privateSet(this, _observedParent, nextObservedParent);
};
_resizeObserver = new WeakMap();
_rovingTabindexController = new WeakMap();
getHiddenTagsDescription_fn = function () {
  const labels = this.tags
    .filter(tag => tag.style.display === 'none')
    .map(tag => tag.label)
    .join(', ');
  return `${msg('List of hidden elements', { id: 'sl.tag.listOfHiddenElements' })}: ${labels}`;
};
onRemove_fn = function (event) {
  const elements = __privateGet(this, _rovingTabindexController).elements,
    index = elements.indexOf(event.target),
    nextIndex = index === 0 ? 1 : index - 1,
    nextFocusableTag = elements[nextIndex];
  if (!nextFocusableTag) {
    return;
  }
  __privateGet(this, _rovingTabindexController).focusToElement(nextFocusableTag);
};
isUnknownArray_fn = function (value) {
  return Array.isArray(value);
};
isResizeObserverSize_fn = function (value) {
  if (typeof value !== 'object' || value === null || !('inlineSize' in value)) {
    return false;
  }
  const inlineSize = value.inlineSize;
  return typeof inlineSize === 'number';
};
isFocusableElement_fn = function (el) {
  return el === this.stackTag || !el.disabled || !!el.removable;
};
getBorderBoxInlineSize_fn = function (entry) {
  const borderBoxSize = entry.borderBoxSize;
  if (__privateMethod(this, _TagList_instances, isUnknownArray_fn).call(this, borderBoxSize)) {
    const firstSize = borderBoxSize[0];
    return __privateMethod(this, _TagList_instances, isResizeObserverSize_fn).call(this, firstSize)
      ? firstSize.inlineSize
      : void 0;
  }
  return __privateMethod(this, _TagList_instances, isResizeObserverSize_fn).call(
    this,
    borderBoxSize
  )
    ? borderBoxSize.inlineSize
    : void 0;
};
onResize_fn = function (entries) {
  const stackEntry = entries.find(entry => entry.target === this.stack),
    stackInlineSize = stackEntry
      ? (__privateMethod(this, _TagList_instances, getBorderBoxInlineSize_fn).call(
          this,
          stackEntry
        ) ?? stackEntry.contentRect.width)
      : void 0;
  if (stackInlineSize && stackInlineSize !== this.stackInlineSize) {
    this.stackInlineSize = stackInlineSize;
    if (__privateGet(this, _breakResizeObserverLoop)) {
      clearTimeout(__privateGet(this, _breakResizeObserverLoop));
      __privateSet(this, _breakResizeObserverLoop, void 0);
    }
  } else if (__privateGet(this, _breakResizeObserverLoop)) {
    return;
  }
  if (!__privateGet(this, _hasResolvedInitialVisibility)) {
    __privateMethod(this, _TagList_instances, runVisibilityUpdate_fn).call(this);
    return;
  }
  __privateSet(
    this,
    _breakResizeObserverLoop,
    setTimeout(() => {
      __privateMethod(this, _TagList_instances, runVisibilityUpdate_fn).call(this);
      __privateSet(this, _breakResizeObserverLoop, void 0);
    }, 50)
  );
};
onSlotChange_fn = function (event) {
  this.tags.forEach(tag => {
    tag.navigationDescription = void 0;
    __privateMethod(this, _TagList_instances, restoreTagMaxInlineSize_fn).call(this, tag);
    __privateMethod(this, _TagList_instances, restoreTagDisabledState_fn).call(this, tag);
    tag.removeAttribute('role');
  });
  this.tags = Array.from(event.target.assignedElements({ flatten: true })).filter(
    el => el instanceof Tag
  );
  __privateMethod(this, _TagList_instances, syncTags_fn).call(this);
  __privateMethod(this, _TagList_instances, clearRovingTabindexCache_fn).call(this);
  if (!__privateGet(this, _hasResolvedInitialVisibility)) {
    __privateMethod(this, _TagList_instances, runVisibilityUpdate_fn).call(this);
    return;
  }
  if (__privateGet(this, _scheduleVisibilityUpdate) !== void 0) {
    cancelAnimationFrame(__privateGet(this, _scheduleVisibilityUpdate));
  }
  __privateSet(
    this,
    _scheduleVisibilityUpdate,
    requestAnimationFrame(() => {
      __privateMethod(this, _TagList_instances, runVisibilityUpdate_fn).call(this);
      __privateSet(this, _scheduleVisibilityUpdate, void 0);
    })
  );
};
syncTags_fn = function () {
  const navigationDescription = msg('Use arrow keys to move between removable tags.', {
    id: 'sl.tagList.navigationInstructions'
  });
  this.tags.forEach(tag => {
    tag.navigationDescription =
      this.keyboardNavigation && tag.removable ? navigationDescription : void 0;
    __privateMethod(this, _TagList_instances, syncTagDisabledState_fn).call(this, tag);
    tag.size = this.size;
    tag.variant = this.variant;
    tag.setAttribute('role', 'listitem');
  });
};
syncTagDisabledState_fn = function (tag) {
  if (this.disabled && tag.removable) {
    if (!__privateGet(this, _tagDisabledState).has(tag)) {
      __privateGet(this, _tagDisabledState).set(tag, tag.disabled);
    }
    tag.disabled = true;
  } else {
    __privateMethod(this, _TagList_instances, restoreTagDisabledState_fn).call(this, tag);
  }
};
restoreTagDisabledState_fn = function (tag) {
  if (!__privateGet(this, _tagDisabledState).has(tag)) {
    return;
  }
  tag.disabled = __privateGet(this, _tagDisabledState).get(tag);
  __privateGet(this, _tagDisabledState).delete(tag);
};
setTagMaxInlineSize_fn = function (tag, maxInlineSize) {
  if (!__privateGet(this, _tagMaxInlineSizeState).has(tag)) {
    __privateGet(this, _tagMaxInlineSizeState).set(tag, tag.style.maxInlineSize);
  }
  tag.style.maxInlineSize = `${Math.max(0, maxInlineSize)}px`;
};
restoreTagMaxInlineSize_fn = function (tag) {
  if (!__privateGet(this, _tagMaxInlineSizeState).has(tag)) {
    return;
  }
  tag.style.maxInlineSize = __privateGet(this, _tagMaxInlineSizeState).get(tag) ?? '';
  __privateGet(this, _tagMaxInlineSizeState).delete(tag);
};
runVisibilityUpdate_fn = function () {
  if (this.stack) {
    const measuredStackInlineSize = this.stack.getBoundingClientRect().width;
    if (measuredStackInlineSize > 0) {
      this.stackInlineSize = measuredStackInlineSize;
    }
  }
  __privateMethod(this, _TagList_instances, updateVisibility_fn).call(this);
  if (!__privateGet(this, _hasResolvedInitialVisibility) && this.stacked && this.tags.length > 0) {
    __privateSet(this, _initialVisibilityPasses, __privateGet(this, _initialVisibilityPasses) + 1);
    if (__privateGet(this, _initialVisibilityPasses) >= 2) {
      __privateSet(this, _hasResolvedInitialVisibility, true);
    } else {
      __privateSet(
        this,
        _initialVisibilityPassFrame,
        requestAnimationFrame(() => {
          __privateSet(this, _initialVisibilityPassFrame, void 0);
          __privateMethod(this, _TagList_instances, runVisibilityUpdate_fn).call(this);
        })
      );
    }
  }
  __privateMethod(this, _TagList_instances, syncInitialVisibilityState_fn).call(this);
};
updateVisibility_fn = function () {
  if (!this.stacked || !this.stack || !this.tags) {
    return;
  }
  const styles2 = getComputedStyle(this),
    gapValue =
      styles2.columnGap && styles2.columnGap !== 'normal' ? styles2.columnGap : styles2.gap;
  let gap = Number.parseFloat(gapValue);
  if (!Number.isFinite(gap)) {
    gap = 0;
  }
  const originalInlineSize = this.style.inlineSize;
  let sizes = [],
    totalTagsWidth = 0,
    availableWidth = 0;
  try {
    this.tags.forEach(tag => {
      tag.style.display = '';
      __privateMethod(this, _TagList_instances, restoreTagMaxInlineSize_fn).call(this, tag);
    });
    availableWidth = Math.max(
      this.getBoundingClientRect().width,
      __privateMethod(this, _TagList_instances, getMaxInlineSize_fn).call(this, styles2)
    );
    this.style.inlineSize = `${availableWidth}px`;
    sizes = this.tags.map(t => t.getBoundingClientRect().width);
    totalTagsWidth = sizes.reduce((acc, size) => acc + size, 0);
    totalTagsWidth += gap * (this.tags.length - 1);
  } finally {
    this.style.inlineSize = originalInlineSize;
  }
  if (totalTagsWidth > availableWidth + SUBPIXEL_BUFFER_PX) {
    availableWidth -= this.stackInlineSize + gap;
    for (let i = 0; i < this.tags.length; i++) {
      const isLastTag = i === this.tags.length - 1;
      if (isLastTag) {
        break;
      }
      totalTagsWidth -= sizes[i] + (isLastTag ? 0 : gap);
      this.tags[i].style.display = 'none';
      if (totalTagsWidth <= availableWidth + SUBPIXEL_BUFFER_PX) {
        break;
      }
    }
  }
  __privateMethod(this, _TagList_instances, constrainLastVisibleTag_fn).call(
    this,
    availableWidth,
    sizes,
    gap
  );
  this.tags.forEach(tag => {
    if (tag.style.display === 'none') {
      tag.tabIndex = -1;
    }
  });
  this.stackSize = this.tags.reduce(
    (acc, tag) => (tag.style.display === 'none' ? acc + 1 : acc),
    0
  );
  this.toggleAttribute('data-stacked-active', this.stackSize > 0);
  this.stack.style.display = this.stackSize === 0 ? 'none' : '';
  this.stack.classList.remove('double', 'triple');
  const stackTag = this.stack.querySelector('sl-tag');
  if (stackTag) {
    stackTag.style.display = this.stackSize === 0 ? 'none' : '';
  }
  __privateMethod(this, _TagList_instances, clearRovingTabindexCache_fn).call(this);
};
getMaxInlineSize_fn = function (styles2) {
  const maxInlineSize = Number.parseFloat(styles2.maxInlineSize);
  return Number.isFinite(maxInlineSize) ? maxInlineSize : 0;
};
constrainLastVisibleTag_fn = function (availableWidth, sizes, gap) {
  const visibleTagIndexes = this.tags
    .map((tag, index) => (tag.style.display === 'none' ? void 0 : index))
    .filter(index => index !== void 0);
  if (!visibleTagIndexes.length) {
    return;
  }
  const lastVisibleTagIndex = visibleTagIndexes.at(-1),
    usedWidth = visibleTagIndexes
      .slice(0, -1)
      .reduce((total, index) => total + sizes[index] + gap, 0),
    maxInlineSize = availableWidth - usedWidth;
  if (sizes[lastVisibleTagIndex] > maxInlineSize + SUBPIXEL_BUFFER_PX) {
    __privateMethod(this, _TagList_instances, setTagMaxInlineSize_fn).call(
      this,
      this.tags[lastVisibleTagIndex],
      maxInlineSize
    );
  }
};
clearRovingTabindexCache_fn = function () {
  __privateGet(this, _rovingTabindexController).clearElementCache();
  __privateMethod(this, _TagList_instances, syncRovingTabindexController_fn).call(this);
};
clearManagedTabindexes_fn = function () {
  this.tags.forEach(tag => {
    tag.removeAttribute('tabindex');
    tag.requestUpdate();
  });
  if (this.stackTag) {
    this.stackTag.removeAttribute('tabindex');
    this.stackTag.requestUpdate();
  }
};
syncRovingTabindexController_fn = function () {
  const hasManagedElements =
    this.keyboardNavigation && __privateGet(this, _rovingTabindexController).elements.length > 0;
  if (hasManagedElements && !__privateGet(this, _rovingTabindexManaged)) {
    __privateGet(this, _rovingTabindexController).manage();
    __privateSet(this, _rovingTabindexManaged, true);
  } else if (!hasManagedElements && __privateGet(this, _rovingTabindexManaged)) {
    __privateGet(this, _rovingTabindexController).unmanage();
    __privateSet(this, _rovingTabindexManaged, false);
  }
};
/** @internal */
TagList.styles = styles;
__decorateClass([property({ type: Boolean })], TagList.prototype, 'disabled', 2);
__decorateClass([property({ attribute: false })], TagList.prototype, 'keyboardNavigation', 2);
__decorateClass([property()], TagList.prototype, 'size', 2);
__decorateClass([query('.stack')], TagList.prototype, 'stack', 2);
__decorateClass([property({ type: Boolean, reflect: true })], TagList.prototype, 'stacked', 2);
__decorateClass([state()], TagList.prototype, 'stackSize', 2);
__decorateClass([query('sl-tag')], TagList.prototype, 'stackTag', 2);
__decorateClass([state()], TagList.prototype, 'tags', 2);
__decorateClass([property({ reflect: true })], TagList.prototype, 'variant', 2);
TagList = __decorateClass([localized()], TagList);
//# sourceMappingURL=tag-list.js.map
