var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import styles from './virtual-list.scss.js';
import { VirtualizerController } from './virtualizer-controller.js';
export class VirtualList extends LitElement {
  constructor() {
    super(...arguments);
    /** The virtualizer controller. */
    this.#virtualizer = new VirtualizerController(this, {
      count: 0,
      estimateSize: () => this.estimateSize ?? 32,
      gap: 0,
      overscan: 3,
      useScrollendEvent: true,
      useCachedMeasurements: true
    });
    this.items = [];
    this.renderInLightDom = false;
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  #virtualizer;
  connectedCallback() {
    super.connectedCallback();
    if (typeof getComputedStyle === 'function' && getComputedStyle(this).display === 'inline') {
      this.style.display = 'block';
    }
  }
  createRenderRoot() {
    return this.renderInLightDom ? this : super.createRenderRoot();
  }
  willUpdate(changes) {
    super.willUpdate(changes);
    if (
      changes.has('estimateSize') ||
      changes.has('gap') ||
      changes.has('items') ||
      changes.has('overscan') ||
      changes.has('scrollMargin')
    ) {
      this.#virtualizer.updateOptions({
        count: this.items.length,
        estimateSize: () => this.estimateSize ?? 32,
        gap: this.gap ?? 0,
        overscan: this.overscan ?? 3,
        scrollMargin: this.scrollMargin,
        useScrollendEvent: true,
        useCachedMeasurements: true
      });
    }
  }
  render() {
    const virtualizer = this.#virtualizer.instance,
      virtualItems = virtualizer.getVirtualItems(),
      containerLayoutStyles = this.renderInLightDom
        ? 'display: flex; flex-direction: column; '
        : '';
    return html`
      <div part="wrapper" style="block-size: ${virtualizer.getTotalSize()}px;">
        <div
          part="container"
          style="${containerLayoutStyles}gap: ${this.gap ?? 0}px; translate: 0px ${(virtualItems[0]?.start ?? 0) - (virtualizer.options.scrollMargin ?? 0)}px">
          ${repeat(
            virtualItems,
            virtualItem => virtualItem.key,
            virtualItem => {
              const item = this.items[virtualItem.index];
              return html`
                <div
                  part="item"
                  data-index=${virtualItem.index}
                  style=${this.renderInLightDom ? 'box-sizing: border-box; inline-size: 100%;' : nothing}
                  ${ref(virtualizer.measureElement)}>
                  ${this.renderItem ? this.renderItem(item, virtualItem.index) : item}
                </div>
              `;
            }
          )}
        </div>
      </div>
    `;
  }
  /**
   * Scroll to a specific index in the list.
   *
   * @param index - The index to scroll to
   * @param options - Scroll options
   */
  scrollToIndex(index, options) {
    this.#virtualizer.instance.scrollToIndex(index, options);
  }
  /**
   * Triggers a re-measure of item sizes and positions. Useful when a list transitions from hidden
   * to visible.
   */
  async requestLayout() {
    await this.updateComplete;
    this.#virtualizer.instance.measure();
    await new Promise(resolve => requestAnimationFrame(() => resolve()));
    this.#virtualizer.instance.measure();
  }
}
__decorateClass(
  [property({ type: Number, attribute: 'estimate-size' })],
  VirtualList.prototype,
  'estimateSize',
  2
);
__decorateClass([property({ type: Number })], VirtualList.prototype, 'gap', 2);
__decorateClass([property({ attribute: false })], VirtualList.prototype, 'items', 2);
__decorateClass([property({ type: Number })], VirtualList.prototype, 'overscan', 2);
__decorateClass(
  [property({ type: Number, attribute: 'scroll-margin' })],
  VirtualList.prototype,
  'scrollMargin',
  2
);
__decorateClass([property({ attribute: false })], VirtualList.prototype, 'renderItem', 2);
__decorateClass([property({ attribute: false })], VirtualList.prototype, 'renderInLightDom', 2);
//# sourceMappingURL=virtual-list.js.map
