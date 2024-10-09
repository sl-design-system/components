import { type AfterViewInit, Directive, ElementRef, Input, type OnChanges, type OnDestroy } from '@angular/core';
import { Tooltip } from '@sl-design-system/tooltip';
import '@sl-design-system/tooltip/register.js';

@Directive({
  selector: '[slTooltip]',
  standalone: true
})
export class TooltipDirective implements AfterViewInit, OnChanges, OnDestroy {
  private tooltip?: Tooltip | (() => void);

  @Input() slTooltip = '';

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngOnChanges(): void {
    if (this.tooltip instanceof Tooltip) {
      this.tooltip.textContent = this.slTooltip;
    }
  }

  ngAfterViewInit(): void {
    this.tooltip = Tooltip.lazy(this.elRef.nativeElement, tooltip => {
      this.tooltip = tooltip;
      tooltip.textContent = this.slTooltip;
    });
  }

  ngOnDestroy(): void {
    if (this.tooltip instanceof Tooltip) {
      this.tooltip?.remove();
      this.tooltip = undefined;
    } else if (this.tooltip) {
      this.tooltip();
      this.tooltip = undefined;
    }
  }
}
