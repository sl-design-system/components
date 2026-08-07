import {
  type AfterViewInit,
  Directive,
  ElementRef,
  Input,
  type OnChanges,
  type OnDestroy
} from '@angular/core';
import { type Tooltip } from '@sl-design-system/tooltip';
import '@sl-design-system/tooltip/register.js';

@Directive({
  selector: '[slTooltip]',
  standalone: true
})
export class TooltipDirective implements AfterViewInit, OnChanges, OnDestroy {
  /** Whether the view has been initialized; changes before that are ignored. */
  private initialized = false;

  private tooltip?: Tooltip;

  @Input() slTooltip = '';

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngOnChanges(): void {
    if (this.initialized) {
      this.update();
    }
  }

  ngAfterViewInit(): void {
    this.initialized = true;
    this.update();
  }

  ngOnDestroy(): void {
    this.tooltip?.remove();
    this.tooltip = undefined;
  }

  /**
   * Creates the tooltip when there is text to show, updates it when it already exists and removes
   * it when the text becomes empty. An empty tooltip would otherwise give the anchor element an
   * empty accessible name or description.
   */
  private update(): void {
    const text = this.slTooltip?.trim();

    if (!text) {
      this.tooltip?.remove();
      this.tooltip = undefined;
    } else if (this.tooltip) {
      this.tooltip.textContent = text;
    } else {
      this.tooltip = document.createElement('sl-tooltip');
      this.tooltip.for = this.elRef.nativeElement.id ||= `sl-tooltip-${Math.random()
        .toString(36)
        .slice(2)}`;
      this.tooltip.textContent = text;
      this.elRef.nativeElement.after(this.tooltip);
    }
  }
}
