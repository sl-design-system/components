import {
  Directive,
  type DirectiveParameters,
  type ElementPart,
  type PartInfo,
  PartType,
  directive
} from 'lit/directive.js';
import { nothing } from 'lit';
import { type PositionPopoverOptions, positionPopover } from '../popover.js';

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
    this.#config = config;
    this.#host = part.element as HTMLElement;
    this.#host.addEventListener('beforetoggle', (event: Event) =>
      this.#onBeforeToggle(event as ToggleEvent & { target: HTMLElement })
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
        this.#cleanup = positionPopover(host, anchorElement, this.#config);
      }
    } else if (this.#cleanup) {
      this.#cleanup();
      this.#cleanup = undefined;
    }
  }
}

export const anchor = directive(AnchorDirective);
