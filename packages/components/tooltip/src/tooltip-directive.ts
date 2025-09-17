import { render } from 'lit';
import { AsyncDirective } from 'lit/async-directive.js';
import { type ElementPart, directive } from 'lit/directive.js';
import { Tooltip, TooltipOptions } from './tooltip.js';

/** Configuration options for the tooltip directive. */
export type TooltipDirectiveConfig = TooltipOptions & TooltipInstanceProps;

/** Tooltip public properties that can be set. */
type TooltipInstanceProps = {
  position?: Tooltip['position'];
  maxWidth?: number;
};

type TooltipDirectiveParams = [content: unknown, config?: TooltipDirectiveConfig];

/** Provides a Lit directive tooltip that attaches a lazily created Tooltip instance to a host element. */
export class TooltipDirective extends AsyncDirective {
  content?: unknown;
  part?: ElementPart;
  tooltip?: Tooltip | (() => void);
  config: TooltipDirectiveConfig = {};

  isTooltipProperty(property: string): boolean {
    return ['position', 'maxWidth'].includes(property);
  }

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
    const options = Object.entries(this.config).filter(([_, value]) => value !== undefined),
      instanceProps: TooltipInstanceProps = {},
      creationOptions: TooltipOptions = {};

    for (const [key, value] of options) {
      if (this.isTooltipProperty(key)) {
        (instanceProps as Record<string, unknown>)[key] = value;
      } else {
        (creationOptions as Record<string, unknown>)[key] = value;
      }
    }

    if (this.part!.element)
      this.tooltip ||= Tooltip.lazy(
        this.part!.element,
        tooltip => {
          if (this.isConnected) {
            this.tooltip = tooltip;
            this.#applyTooltipProps(this.tooltip, instanceProps);
            this.renderContent();
          }
        },
        creationOptions
      );
  }

  #applyTooltipProps(tooltip: Tooltip, props?: Partial<TooltipInstanceProps>): void {
    if (!props) {
      return;
    }

    Object.entries(props).forEach(([key, value]) => {
      try {
        (tooltip as unknown as Record<string, unknown>)[key] = value;
      } catch {
        /* ignore readonly properties */
      }
    });
  }
}

export const tooltip = directive(TooltipDirective);
