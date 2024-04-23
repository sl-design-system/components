import { type AfterViewInit, Directive, ElementRef, Input, type OnChanges, type OnDestroy } from '@angular/core';
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
    if (this.tooltip) {
      this.tooltip.textContent = this.slTooltip;
    }
  }

  ngAfterViewInit(): void {
    Tooltip.lazy(this.elRef.nativeElement, tooltip => {
      this.tooltip = tooltip;
      tooltip.textContent = this.slTooltip;
    });
  }

  ngOnDestroy(): void {
    this.tooltip?.remove();
    this.tooltip = undefined;
  }
}
