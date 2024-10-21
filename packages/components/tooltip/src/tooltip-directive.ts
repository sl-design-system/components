import { render } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { type DirectiveParameters, type ElementPart, directive } from 'lit/directive.js';
import { Tooltip } from './tooltip.js';

export class TooltipDirective extends AsyncDirective {
  content?: unknown;
  part?: ElementPart;
  tooltip?: Tooltip | (() => void);

  override disconnected(): void {
    if (this.tooltip instanceof HTMLElement) {
      this.tooltip.remove();
    } else if (this.tooltip) {
      this.tooltip();
    }

    this.tooltip = undefined;
  }

  override reconnected(): void {
    this.#setup();
  }

  render(_content: unknown): void {}

  renderContent(): void {
    render(this.content, this.tooltip as Tooltip, this.part!.options);
  }

  override update(part: ElementPart, [content]: DirectiveParameters<this>): void {
    this.content = content;
    this.part = part;

    this.#setup();
  }

  #setup(): void {
    if (this.part!.element)
      this.tooltip ||= Tooltip.lazy(this.part!.element, tooltip => {
        if (this.isConnected) {
          this.tooltip = tooltip;
          this.renderContent();
        }
      });
  }
}

export const tooltip = directive(TooltipDirective);
