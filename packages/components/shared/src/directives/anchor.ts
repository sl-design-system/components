import type { DirectiveParameters, ElementPart, PartInfo } from 'lit/directive.js';
import type { PopoverPosition } from '../popover.js';
import { Directive, PartType, directive } from 'lit/directive.js';
import { nothing } from 'lit';

declare global {
  interface HTMLElement {
    anchorElement: Element | undefined;
  }
}

export interface AnchorDirectiveConfig {
  element?: HTMLElement;
  position?: PopoverPosition;
}

export class AnchorDirective extends Directive {
  config?: AnchorDirectiveConfig;
  host?: HTMLElement;

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
    this.config = { position: 'top', ...config };
    this.host = part.element as HTMLElement;
    this.host.addEventListener('beforetoggle', event => this.#onBeforeToggle(event as ToggleEvent));
  }

  #onBeforeToggle(event: ToggleEvent): void {
    const anchorElement =
      this.config?.element ??
      this.host?.anchorElement ??
      (this.host?.getRootNode() as HTMLElement)?.querySelector(this.host?.getAttribute('anchor') ?? '');

    console.log('beforetoggle', event, anchorElement);
  }
}

export const anchor = directive(AnchorDirective);
