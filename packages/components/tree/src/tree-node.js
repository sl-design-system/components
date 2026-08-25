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
var __privateMethod = (obj, member, method) => (
  __accessCheck(obj, member, 'access private method'),
  method
);
var _events, _checkboxInputId, _TreeNode_instances, onChange_fn, onClick_fn, onKeydown_fn;
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Checkbox } from '@sl-design-system/checkbox';
import { Icon } from '@sl-design-system/icon';
import { EventsController, event } from '@sl-design-system/shared';
import { Skeleton } from '@sl-design-system/skeleton';
import { Spinner } from '@sl-design-system/spinner';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { IndentGuides } from './indent-guides.js';
import styles from './tree-node.scss.js';
let nextCheckboxId = 0;
export let TreeNode = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _TreeNode_instances);
    // eslint-disable-next-line no-unused-private-class-members
    __privateAdd(
      this,
      _events,
      new EventsController(this, {
        click: __privateMethod(this, _TreeNode_instances, onClick_fn),
        keydown: __privateMethod(this, _TreeNode_instances, onKeydown_fn)
      })
    );
    __privateAdd(this, _checkboxInputId, `sl-tree-node-checkbox-${nextCheckboxId++}`);
    this.level = 0;
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button-bar': ButtonBar,
      'sl-checkbox': Checkbox,
      'sl-icon': Icon,
      'sl-indent-guides': IndentGuides,
      'sl-spinner': Spinner,
      'sl-skeleton': Skeleton
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'row');
    if (this.selectable) {
      this.setAttribute('aria-selected', Boolean(this.selected).toString());
    }
    if (!this.hasAttribute('tabindex')) {
      this.tabIndex = 0;
    }
  }
  updated(changes) {
    super.updated(changes);
    if (changes.has('expandable') || changes.has('expanded')) {
      if (this.expandable) {
        this.setAttribute('aria-expanded', Boolean(this.expanded).toString());
      } else {
        this.removeAttribute('aria-expanded');
      }
    }
    if (changes.has('indeterminate') || changes.has('selectable') || changes.has('selected')) {
      if (this.selectable) {
        this.setAttribute('aria-selected', Boolean(this.selected).toString());
      } else {
        this.removeAttribute('aria-selected');
      }
    }
  }
  /* eslint-disable slds/checkbox-has-label -- internal sl-checkbox uses slotted input + label to provide its accessible name */
  render() {
    return html`
      <sl-indent-guides
        ?last-node-in-level=${this.lastNodeInLevel}
        .level=${this.level}
        .levelGuides=${this.levelGuides}
        ?selected=${!this.multiple && this.selected}></sl-indent-guides>
      <div aria-colindex="1" role="gridcell">
        ${
          this.expandable
            ? html`
                <div class="expander">
                  <div class="expander-inner">
                    <sl-icon name="chevron-right" size="xs"></sl-icon>
                  </div>
                </div>
              `
            : nothing
        }
        <div part="wrapper">
          ${choose(
            this.type,
            [
              [
                'placeholder',
                () =>
                  html`<sl-spinner></sl-spinner>${msg('Loading', { id: 'sl.tree.loadingMessage' })}`
              ],
              [
                'skeleton',
                () => html`
                  <sl-skeleton
                    style="inline-size: ${Math.max(20, Math.random() * 60)}%"></sl-skeleton>
                `
              ]
            ],
            () =>
              this.multiple && this.selectable
                ? html`
                    <sl-checkbox
                      @sl-change=${__privateMethod(this, _TreeNode_instances, onChange_fn)}
                      ?checked=${this.selected}
                      ?indeterminate=${this.indeterminate}
                      exportparts="label"
                      part="checkbox"
                      size="sm">
                      <input
                        id=${__privateGet(this, _checkboxInputId)}
                        slot="input"
                        tabindex="-1"
                        type="checkbox" />
                      <label
                        id=${`${__privateGet(this, _checkboxInputId)}-label`}
                        for=${__privateGet(this, _checkboxInputId)}
                        slot="label"
                        ><slot></slot
                      ></label>
                    </sl-checkbox>
                  `
                : html`
                    <div part="content">
                      <slot></slot>
                    </div>
                  `
          )}
          <slot name="aside">
            <sl-button-bar fill="ghost" part="button-bar" size="sm" variant="primary">
              <slot name="actions"></slot>
            </sl-button-bar>
          </slot>
        </div>
      </div>
    `;
  }
  /* eslint-enable slds/checkbox-has-label */
  toggle(expanded = !this.expanded) {
    this.expanded = expanded;
    this.toggleEvent.emit(this.expanded);
  }
};
_events = new WeakMap();
_checkboxInputId = new WeakMap();
_TreeNode_instances = new WeakSet();
onChange_fn = function (event2) {
  event2.preventDefault();
  event2.stopPropagation();
  this.selected = event2.detail;
  this.indeterminate = false;
  this.changeEvent.emit(this.selected);
};
/**
 * If the user clicked on the wrapper part of the tree node, emit the select event. Otherwise, if
 * the node is expandable, toggle the expanded state.
 */
onClick_fn = function (event2) {
  const wrapper = this.renderRoot.querySelector('[part="wrapper"]');
  const insideWrapper = !!event2
    .composedPath()
    .filter(el => el instanceof HTMLElement)
    .find(el => el === wrapper);
  if (insideWrapper && this.selectable) {
    event2.preventDefault();
    this.selected = !this.selected;
    this.indeterminate = false;
    if (this.multiple) {
      this.changeEvent.emit(this.selected);
    } else {
      this.selectEvent.emit(this.node);
    }
  } else if (this.expandable) {
    this.toggle();
  }
};
/** See https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction */
onKeydown_fn = function (event2) {
  if (event2.key === 'Enter' || event2.key === ' ') {
    event2.preventDefault();
    if (!this.selectable) {
      return;
    }
    this.selected = !this.selected;
    this.indeterminate = false;
    if (this.multiple) {
      this.changeEvent.emit(this.selected);
    } else {
      this.selectEvent.emit(this.node);
    }
  } else if (event2.key === 'ArrowLeft') {
    if (this.expanded) {
      event2.preventDefault();
      event2.stopPropagation();
      this.toggle();
    } else if (this.level === 0) {
      event2.preventDefault();
    }
  } else if (event2.key === 'ArrowRight') {
    if (this.expandable && !this.expanded) {
      event2.preventDefault();
      this.toggle();
    } else if (!this.expandable) {
      event2.preventDefault();
    }
  }
};
/** @internal */
TreeNode.styles = styles;
__decorateClass([event({ name: 'sl-change' })], TreeNode.prototype, 'changeEvent', 2);
__decorateClass([property({ type: Boolean, reflect: true })], TreeNode.prototype, 'disabled', 2);
__decorateClass([property({ type: Boolean })], TreeNode.prototype, 'expandable', 2);
__decorateClass([property({ type: Boolean })], TreeNode.prototype, 'expanded', 2);
__decorateClass([property({ type: Boolean })], TreeNode.prototype, 'indeterminate', 2);
__decorateClass(
  [property({ type: Boolean, attribute: 'last-node-in-level' })],
  TreeNode.prototype,
  'lastNodeInLevel',
  2
);
__decorateClass([property({ type: Number })], TreeNode.prototype, 'level', 2);
__decorateClass(
  [property({ type: Array, attribute: 'level-guides' })],
  TreeNode.prototype,
  'levelGuides',
  2
);
__decorateClass([property({ type: Boolean, reflect: true })], TreeNode.prototype, 'multiple', 2);
__decorateClass([property({ attribute: false })], TreeNode.prototype, 'node', 2);
__decorateClass([property({ type: Boolean })], TreeNode.prototype, 'selectable', 2);
__decorateClass([property({ type: Boolean })], TreeNode.prototype, 'selected', 2);
__decorateClass([event({ name: 'sl-select' })], TreeNode.prototype, 'selectEvent', 2);
__decorateClass([event({ name: 'sl-toggle' })], TreeNode.prototype, 'toggleEvent', 2);
__decorateClass([property()], TreeNode.prototype, 'type', 2);
TreeNode = __decorateClass([localized()], TreeNode);
//# sourceMappingURL=tree-node.js.map
