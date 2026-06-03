import {
  type AfterViewInit,
  Directive,
  ElementRef,
  Input,
  type OnChanges,
  type OnDestroy
} from '@angular/core';
import { Tooltip } from '@sl-design-system/tooltip';
import '@sl-design-system/tooltip/register.js';

@Directive({
  selector: '[slTooltip]',
  standalone: true
})
export class TooltipDirective implements AfterViewInit, OnChanges, OnDestroy {
  private tooltip?: Tooltip;

  @Input() slTooltip = '';

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngOnChanges(): void {
    if (this.tooltip instanceof Tooltip) {
      this.tooltip.textContent = this.slTooltip;
    }
  }

  ngAfterViewInit(): void {
    this.tooltip = document.createElement('sl-tooltip');
    this.tooltip.for =
      this.elRef.nativeElement.id ||= `sl-tooltip-${Math.random().toString(36).slice(2)}`;
    this.tooltip.textContent = this.slTooltip;
    this.elRef.nativeElement.after(this.tooltip);
  }

  ngOnDestroy(): void {
    this.tooltip?.remove();
    this.tooltip = undefined;
  }
}
