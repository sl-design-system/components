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
var _announceTimeoutId,
  _breakResizeObserverLoop,
  _content,
  _lastAnnouncedContent,
  _lastAnnouncedTitle,
  _observer,
  _originalSize,
  _size,
  _title,
  _InlineMessage_instances,
  onClick_fn,
  onResize_fn,
  onContentSlotChange_fn,
  onTitleSlotChange_fn,
  announce_fn;
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { event } from '@sl-design-system/shared';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './inline-message.scss.js';
export let InlineMessage = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _InlineMessage_instances);
    /** Timeout id, to be used with `clearTimeout`. */
    __privateAdd(this, _announceTimeoutId);
    /** Timer used for breaking a possible resize observer loop. */
    __privateAdd(this, _breakResizeObserverLoop);
    /** @internal Body content that will be sent to the announcer. */
    __privateAdd(this, _content);
    /** The last announced content, used to prevent duplicate announcements. */
    __privateAdd(this, _lastAnnouncedContent);
    /** The last announced title, used to prevent duplicate announcements. */
    __privateAdd(this, _lastAnnouncedTitle);
    /** Observe the size and determine where to place the action button if present. */
    __privateAdd(
      this,
      _observer,
      new ResizeObserver(entries =>
        __privateMethod(this, _InlineMessage_instances, onResize_fn).call(this, entries[0])
      )
    );
    /** The original size, set by the user, before any automatic behavior was applied. */
    __privateAdd(this, _originalSize, 'auto');
    /** The current size. */
    __privateAdd(this, _size, 'auto');
    /** @internal Title (if visible) that will be sent to the announcer. */
    __privateAdd(this, _title);
    this.noAction = true;
    this.noTitle = true;
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }
  /** @internal The name of the icon, depending on the variant. */
  get iconName() {
    switch (this.variant) {
      case 'success':
        return 'circle-check-solid';
      case 'warning':
        return 'triangle-exclamation-solid';
      case 'danger':
        return 'octagon-xmark-solid';
      default:
        return 'info';
    }
  }
  get size() {
    return __privateGet(this, _size);
  }
  set size(size) {
    __privateSet(this, _originalSize, __privateSet(this, _size, size));
  }
  firstUpdated(changes) {
    super.firstUpdated(changes);
    __privateGet(this, _observer).observe(this.renderRoot.querySelector('[part="content"]'));
  }
  disconnectedCallback() {
    __privateGet(this, _observer).disconnect();
    if (__privateGet(this, _breakResizeObserverLoop)) {
      clearTimeout(__privateGet(this, _breakResizeObserverLoop));
      __privateSet(this, _breakResizeObserverLoop, void 0);
    }
    if (__privateGet(this, _announceTimeoutId)) {
      clearTimeout(__privateGet(this, _announceTimeoutId));
      __privateSet(this, _announceTimeoutId, void 0);
    }
    super.disconnectedCallback();
  }
  willUpdate(changes) {
    super.updated(changes);
    if (changes.has('contentOverflow') || changes.has('noTitle')) {
      if (__privateGet(this, _originalSize) === 'auto') {
        __privateSet(this, _size, this.contentOverflow || !this.noTitle ? 'lg' : 'md');
        this.requestUpdate('size');
      }
    }
  }
  render() {
    return html`
      <div part="icon">
        <slot name="icon">
          <sl-icon .name=${this.iconName} size="md"></sl-icon>
        </slot>
      </div>
      <div part="title">
        <slot
          @slotchange=${__privateMethod(this, _InlineMessage_instances, onTitleSlotChange_fn)}
          name="title"></slot>
      </div>
      <div part="content">
        <slot
          @slotchange=${__privateMethod(this, _InlineMessage_instances, onContentSlotChange_fn)}></slot>
      </div>
      ${
        this.indismissible
          ? nothing
          : html`
              <sl-button
                @click=${__privateMethod(this, _InlineMessage_instances, onClick_fn)}
                .size=${this.size === 'sm' ? 'sm' : 'md'}
                .variant=${this.variant ?? 'info'}
                aria-label=${msg('Close', { id: 'sl.common.close' })}
                fill="ghost">
                <sl-icon name="xmark"></sl-icon>
              </sl-button>
            `
      }
    `;
  }
};
_announceTimeoutId = new WeakMap();
_breakResizeObserverLoop = new WeakMap();
_content = new WeakMap();
_lastAnnouncedContent = new WeakMap();
_lastAnnouncedTitle = new WeakMap();
_observer = new WeakMap();
_originalSize = new WeakMap();
_size = new WeakMap();
_title = new WeakMap();
_InlineMessage_instances = new WeakSet();
onClick_fn = function () {
  this.dismissEvent.emit();
  this.remove();
};
onResize_fn = function (entry) {
  const lineHeight = parseInt(getComputedStyle(this).lineHeight),
    contentOverflow = entry.contentRect.height / lineHeight > 2;
  if (contentOverflow && !this.contentOverflow) {
    this.contentOverflow = contentOverflow;
    if (__privateGet(this, _breakResizeObserverLoop)) {
      clearTimeout(__privateGet(this, _breakResizeObserverLoop));
      __privateSet(
        this,
        _breakResizeObserverLoop,
        setTimeout(() => __privateSet(this, _breakResizeObserverLoop, void 0), 200)
      );
    }
  } else if (__privateGet(this, _breakResizeObserverLoop)) {
    return;
  } else {
    this.contentOverflow = contentOverflow;
    __privateSet(
      this,
      _breakResizeObserverLoop,
      setTimeout(() => __privateSet(this, _breakResizeObserverLoop, void 0), 200)
    );
  }
};
onContentSlotChange_fn = function (event2) {
  __privateSet(
    this,
    _content,
    Array.from(event2.target.assignedNodes({ flatten: true }))
      .flatMap(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return [node.textContent?.trim()];
        } else if (node.nodeType === Node.ELEMENT_NODE && !(node instanceof HTMLStyleElement)) {
          return Array.from(node.innerText.split(' ')).map(text => text.trim());
        }
        return [];
      })
      .join(' ')
  );
  __privateMethod(this, _InlineMessage_instances, announce_fn).call(this);
};
onTitleSlotChange_fn = function (event2) {
  this.noTitle = !Array.from(event2.target.assignedNodes({ flatten: true })).some(
    node => node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim()
  );
  __privateSet(
    this,
    _title,
    event2.target
      .assignedNodes({ flatten: true })
      .flatMap(node =>
        node.nodeType === Node.TEXT_NODE
          ? [node.textContent?.trim()]
          : node.nodeType === Node.ELEMENT_NODE
            ? Array.from(node.childNodes)
                .filter(child => child.nodeType === Node.TEXT_NODE)
                .map(child => child.textContent?.trim())
            : []
      )
      .join(' ')
  );
  __privateMethod(this, _InlineMessage_instances, announce_fn).call(this);
};
// Announce if needed, we don't want to have the same message announced twice
announce_fn = function () {
  if (__privateGet(this, _announceTimeoutId)) {
    clearTimeout(__privateGet(this, _announceTimeoutId));
  }
  __privateSet(
    this,
    _announceTimeoutId,
    setTimeout(() => {
      if (
        __privateGet(this, _content) !== __privateGet(this, _lastAnnouncedContent) ||
        __privateGet(this, _title) !== __privateGet(this, _lastAnnouncedTitle)
      ) {
        __privateSet(this, _lastAnnouncedContent, __privateGet(this, _content));
        __privateSet(this, _lastAnnouncedTitle, __privateGet(this, _title));
        announce(
          `${__privateGet(this, _title) ?? ''} ${__privateGet(this, _content) ?? ''}`,
          this.variant === 'danger' ? 'assertive' : 'polite'
        );
      }
      __privateSet(this, _announceTimeoutId, void 0);
    }, 50)
  );
};
/** @internal */
InlineMessage.styles = styles;
__decorateClass([state()], InlineMessage.prototype, 'contentOverflow', 2);
__decorateClass([event({ name: 'sl-dismiss' })], InlineMessage.prototype, 'dismissEvent', 2);
__decorateClass(
  [property({ type: Boolean, reflect: true })],
  InlineMessage.prototype,
  'indismissible',
  2
);
__decorateClass(
  [property({ type: Boolean, attribute: 'no-action', reflect: true })],
  InlineMessage.prototype,
  'noAction',
  2
);
__decorateClass(
  [property({ type: Boolean, attribute: 'no-title', reflect: true })],
  InlineMessage.prototype,
  'noTitle',
  2
);
__decorateClass([property({ reflect: true })], InlineMessage.prototype, 'size', 1);
__decorateClass([property({ reflect: true })], InlineMessage.prototype, 'variant', 2);
InlineMessage = __decorateClass([localized()], InlineMessage);
//# sourceMappingURL=inline-message.js.map
