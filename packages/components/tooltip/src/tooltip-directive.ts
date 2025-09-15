import { render } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { type ElementPart, directive } from 'lit/directive.js';
import { Tooltip, TooltipOptions } from './tooltip.js';

type TooltipDirectiveParams = [content: unknown, options?: TooltipOptions];

export class TooltipDirective extends AsyncDirective {
  content?: unknown;
  part?: ElementPart;
  tooltip?: Tooltip | (() => void);
  options?: TooltipOptions = {};

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

  render(_content: unknown, _options?: TooltipOptions): void {}

  renderContent(): void {
    console.log(
      'Rendering tooltip content:',
      this.content,
      this.tooltip,
      this.part?.options,
      this.options,
      this.options?.ariaRelation
    );
    // render(this.content, this.tooltip as Tooltip, this.part!.options);

    const renderOptions = { ...this.part!.options, ...this.options };
    render(this.content, this.tooltip as Tooltip, renderOptions);
  }

  override update(
    part: ElementPart,
    /*[content]: DirectiveParameters<this>*/ [content, options]: TooltipDirectiveParams
  ): void {
    this.content = content;

    if (options) {
      // this.options = options;
      this.options = { ...this.options, ...options };
    }

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
