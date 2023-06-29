import type { DirectiveParameters, ElementPart, PartInfo } from 'lit/directive.js';
import { Directive, PartType, directive } from 'lit/directive.js';
import { nothing } from 'lit';
import { type PopoverPosition, positionPopover } from '../popover.js';

declare global {
  interface HTMLElement {
    anchorElement: Element | undefined;
  }
}

export interface AnchorDirectiveConfig {
  arrow?: string | HTMLElement;
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
    this.host.addEventListener('beforetoggle', () => this.#onBeforeToggle());

    // Reset element to top left to prevent layout interference
    // See https://floating-ui.com/docs/computePosition#initial-layout
    this.host.style.insetBlockStart = '0px';
    this.host.style.insetInlineStart = '0px';
  }

  #onBeforeToggle(): void {
    const anchorElement =
      this.config?.element ??
      this.host?.anchorElement ??
      (this.host?.getRootNode() as HTMLElement)?.querySelector(`#${this.host?.getAttribute('anchor') ?? ''}`);

    if (anchorElement) {
      positionPopover(this.host!, anchorElement, {
        arrow: this.config?.arrow,
        position: this.config?.position
      });
    }
  }
}

export const anchor = directive(AnchorDirective);
