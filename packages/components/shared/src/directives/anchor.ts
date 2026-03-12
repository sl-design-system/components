import { nothing } from 'lit';
import {
  Directive,
  type DirectiveParameters,
  type ElementPart,
  type PartInfo,
  PartType,
  directive
} from 'lit/directive.js';
import { Ref } from 'lit/directives/ref.js';
import { type PositionPopoverOptions, positionPopover } from '../popover.js';

declare global {
  interface HTMLElement {
    anchorElement: Element | undefined;
  }
}

export interface AnchorDirectiveConfig extends PositionPopoverOptions {
  element?: Element | Ref<Element>;

  /**
   * Setting this to true will cause the directive to do nothing if CSS anchor positioning
   * is supported in the browser. It will then use CSS anchor positioning to position the
   * element. In older browsers it will still use floating-ui to position the element.
   */
  supportCSSAnchorPositioning?: boolean;
}

export class AnchorDirective extends Directive {
  #cleanup?: () => void;
  #config?: AnchorDirectiveConfig;
  #host?: HTMLElement;
  observer?: IntersectionObserver;

  constructor(partInfo: PartInfo) {
    super(partInfo);

    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('The `anchor` directive must be used on the element itself');
    }
  }

  render(_config?: AnchorDirectiveConfig): typeof nothing {
    return nothing;
  }

  override update(part: ElementPart, [config = {}]: DirectiveParameters<this>): void {
    // Do nothing if CSS anchor positioning is supported or if the directive is already initialized on this element
    if ((config.supportCSSAnchorPositioning && 'anchorName' in document.documentElement.style) || this.#host) {
      return;
    }

    this.#config = config;
    this.#host = part.element as HTMLElement;
    this.#host.addEventListener('beforetoggle', (event: Event) =>
      this.#onBeforeToggle(event as ToggleEvent & { target: HTMLElement })
    );

    this.observer?.disconnect();
    this.observer = new IntersectionObserver(entries => this.#onIntersect(entries[0]), {
      threshold: 0,
      rootMargin: `-${this.#config?.rootMarginTop ?? 0}px 0px 0px 0px`
    });
  }

  #onBeforeToggle(event: ToggleEvent & { target: HTMLElement }): void {
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
          (host.getRootNode() as HTMLElement)?.querySelector(`#${host.getAttribute('anchor') ?? ''}`) || undefined;
      }

      if (anchorElement) {
        this.observer?.observe(anchorElement);
        this.#cleanup = positionPopover(host, anchorElement, this.#config);
      }
    } else if (this.#cleanup) {
      this.#cleanup();
      this.observer?.disconnect();
      this.#cleanup = undefined;
    }
  }

  #onIntersect(entry: IntersectionObserverEntry): void {
    if (!entry.isIntersecting) {
      this.#host?.hidePopover();
    }
  }
}

export const anchor = directive(AnchorDirective);
