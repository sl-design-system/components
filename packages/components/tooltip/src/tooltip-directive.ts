import type { DirectiveParameters, ElementPart } from 'lit/directive.js';
import { Directive, directive } from 'lit/directive.js';
import { render } from 'lit';
import { Tooltip } from './tooltip.js';

export class TooltipDirective extends Directive {
  content?: unknown;
  didSetupLazy = false;
  part?: ElementPart;
  tooltip?: Tooltip;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  render(_content: unknown): void {}

  renderContent(): void {
    render(this.content, this.tooltip!, this.part!.options);
  }

  override update(part: ElementPart, [content]: DirectiveParameters<this>): void {
    this.content = content;
    this.part = part;

    if (!this.didSetupLazy) {
      this.setupLazy();
    }

    if (this.tooltip) {
      this.renderContent();
    }
  }

  /** @ignore */
  setupLazy(): void {
    this.didSetupLazy = true;

    Tooltip.lazy(this.part!.element, (tooltip: Tooltip) => {
      this.tooltip = tooltip;
      this.renderContent();
    });
  }
}

export const tooltip = directive(TooltipDirective);
