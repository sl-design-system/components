import { nothing } from 'lit';
import {
  Directive,
  type DirectiveParameters,
  type ElementPart,
  type PartInfo,
  PartType,
  directive
} from 'lit/directive.js';
import { type PositionPopoverOptions, positionPopover, updatePopoverVisibility } from '../popover.js';

declare global {
  interface HTMLElement {
    anchorElement: Element | undefined;
  }
}

export interface AnchorDirectiveConfig extends PositionPopoverOptions {
  element?: HTMLElement;
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
    // Prevent initializing the directive multiple times
    if (this.#host) {
      return;
    }

    this.#config = config;
    this.#host = part.element as HTMLElement;
    this.#host.addEventListener('beforetoggle', (event: Event) =>
      this.#onBeforeToggle(event as ToggleEvent & { target: HTMLElement })
    );

    const rootMargin = `-${this.#config?.rootMarginTop ?? 0}px 0px 0px 0px`;
    this.observer = new IntersectionObserver(
      entries => updatePopoverVisibility(this.#host, !entries[0].isIntersecting),
      {
        threshold: 0,
        rootMargin
      }
    );
  }

  #onBeforeToggle(event: ToggleEvent & { target: HTMLElement }): void {
    if (event.newState === 'open') {
      const host = event.target;

      let anchorElement = this.#config?.element || host.anchorElement;
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
}

export const anchor = directive(AnchorDirective);
