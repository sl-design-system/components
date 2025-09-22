import { render } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { type ElementPart, directive } from 'lit/directive.js';
import { Tooltip, TooltipOptions } from './tooltip.js';

/** Configuration options for the tooltip directive. */
export type TooltipDirectiveConfig = Partial<TooltipOptions> & TooltipProperties;

/** Tooltip public properties that can be set. */
type TooltipProperties = {
  position?: Tooltip['position'];
  maxWidth?: number;
};

type TooltipDirectiveParams = [content: unknown, config?: TooltipDirectiveConfig];

/** Provides a Lit directive tooltip that attaches a lazily created Tooltip instance to a host element. */
export class TooltipDirective extends AsyncDirective {
  config: TooltipDirectiveConfig = {};
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

  render(_content: unknown, _config?: TooltipDirectiveConfig): void {}

  renderContent(): void {
    render(this.content, this.tooltip as Tooltip, this.part!.options);
  }

  override update(part: ElementPart, [content, config]: TooltipDirectiveParams): void {
    this.content = content;

    if (config) {
      this.config = { ...this.config, ...config };
    }

    this.part = part;

    this.#setup();
  }

  #setup(): void {
    if (this.part!.element)
      this.tooltip ||= Tooltip.lazy(
        this.part!.element,
        tooltip => {
          if (this.isConnected) {
            this.tooltip = tooltip;
            tooltip.position = this.config.position || 'top';
            tooltip.maxWidth = this.config.maxWidth;
            this.renderContent();
          }
        },
        { ariaRelation: this.config.ariaRelation }
      );
  }
}

export const tooltip = directive(TooltipDirective);
