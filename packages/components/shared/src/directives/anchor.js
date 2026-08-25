import { nothing } from 'lit';
import { Directive, PartType, directive } from 'lit/directive.js';
import { positionPopover } from '../popover.js';
export class AnchorDirective extends Directive {
  #cleanup;
  #config;
  #host;
  constructor(partInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('The `anchor` directive must be used on the element itself');
    }
  }
  render(_config) {
    return nothing;
  }
  update(part, [config = {}]) {
    if (
      (config.supportCSSAnchorPositioning && 'anchorName' in document.documentElement.style) ||
      this.#host
    ) {
      return;
    }
    this.#config = config;
    this.#host = part.element;
    this.#host.addEventListener('beforetoggle', event => this.#onBeforeToggle(event));
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(entries => this.#onIntersect(entries[0]), {
      threshold: 0,
      rootMargin: `-${this.#config?.rootMarginTop ?? 0}px 0px 0px 0px`
    });
  }
  #onBeforeToggle(event) {
    if (event.newState === 'open') {
      const host = event.target;
      let anchorElement = host.anchorElement;
      if (this.#config?.element instanceof Element) {
        anchorElement = this.#config.element;
      } else if (this.#config?.element) {
        anchorElement = this.#config.element.value;
      }
      if (!anchorElement && host.hasAttribute('anchor')) {
        anchorElement =
          host.getRootNode()?.querySelector(`#${host.getAttribute('anchor') ?? ''}`) || void 0;
      }
      if (anchorElement) {
        this.observer?.observe(anchorElement);
        this.#cleanup = positionPopover(host, anchorElement, this.#config);
      }
    } else if (this.#cleanup) {
      this.#cleanup();
      this.observer?.disconnect();
      this.#cleanup = void 0;
    }
  }
  #onIntersect(entry) {
    if (!entry.isIntersecting) {
      this.#host?.hidePopover();
    }
  }
}
export const anchor = directive(AnchorDirective);
//# sourceMappingURL=anchor.js.map
