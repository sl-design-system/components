import { render } from 'lit';
import { Directive, type DirectiveParameters, type ElementPart, directive } from 'lit/directive.js';
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

    Tooltip.lazy(
      this.part!.element,
      tooltip => {
        this.tooltip = tooltip;
        this.renderContent();
      },
      { context: this.part!.element.shadowRoot ?? document }
    );
  }
}

export const tooltip = directive(TooltipDirective);
