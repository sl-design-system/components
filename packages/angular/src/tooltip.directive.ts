import { type AfterViewInit, Directive, ElementRef, Input, type OnDestroy } from '@angular/core';
import { type Tooltip } from '@sl-design-system/tooltip';
import '@sl-design-system/tooltip/register.js';

type TooltipInput = string | { text: string; type?: Tooltip['type'] };

let nextUniqueId = 0;

@Directive({
  selector: '[slTooltip]',
  standalone: true
})
export class TooltipDirective implements AfterViewInit, OnDestroy {
  /** Whether the view has been initialized; changes before that are ignored. */
  private initialized = false;

  private tooltip?: Tooltip;

  private _slTooltip: TooltipInput = '';

  @Input()
  set slTooltip(value: TooltipInput) {
    this._slTooltip = value ?? '';

    if (this.initialized) {
      this.update();
    }
  }

  get slTooltip(): TooltipInput {
    return this._slTooltip;
  }

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.initialized = true;
    this.update();
  }

  ngOnDestroy(): void {
    this.removeTooltip();
  }

  /**
   * Creates the tooltip when there is text to show, updates it when it already exists and removes
   * it when the text becomes empty. An empty tooltip would otherwise give the anchor element an
   * empty accessible name or description.
   */
  private update(): void {
    const { text, type } = this.getTooltipData();

    if (!text) {
      this.removeTooltip();
      return;
    }

    const tooltip = this.tooltip ?? this.createTooltip(type);
    tooltip.textContent = text;
    tooltip.type = type;
  }

  private createTooltip(type?: Tooltip['type']): Tooltip {
    const tooltip = document.createElement('sl-tooltip');

    tooltip.for = this.getOrCreateAnchorId();
    tooltip.type = type;
    this.elRef.nativeElement.after(tooltip);

    this.tooltip = tooltip;
    return tooltip;
  }

  private removeTooltip(): void {
    this.tooltip?.remove();
    this.tooltip = undefined;
  }

  private getOrCreateAnchorId(): string {
    const element = this.elRef.nativeElement;

    // Reuse an existing id only when it uniquely points to this exact element.
    if (element.id && document.getElementById(element.id) === element) {
      return element.id;
    }

    let id = `sl-tooltip-${nextUniqueId++}`;
    while (document.getElementById(id)) {
      id = `sl-tooltip-${nextUniqueId++}`;
    }

    element.id = id;
    return id;
  }

  private getTooltipData(): { text?: string; type?: Tooltip['type'] } {
    if (typeof this._slTooltip === 'string') {
      return {
        text: this._slTooltip.trim()
      };
    }

    return {
      text: this._slTooltip.text?.trim(),
      type: this._slTooltip.type
    };
  }
}
