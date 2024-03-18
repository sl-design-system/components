import { ChangeDetectorRef, Directive, ElementRef, NgZone, SimpleChanges, inject } from '@angular/core';

@Directive({
  standalone: true
})
export class CePassthrough<T extends HTMLElement> {
  protected zone = inject(NgZone);
  private cdRef = inject(ChangeDetectorRef);
  public el = this.elRef.nativeElement;

  constructor(public elRef: ElementRef<T>) {
    this.cdRef.detach();
  }

  static eventMap: Record<string, string> = {} as const;

  ngOnChanges(changes: SimpleChanges) {
    this.zone.runOutsideAngular(() => {
      for (const changedProp of Object.keys(changes)) {
        if (!(changedProp in this.elRef.nativeElement)) {
          continue;
        }
        const currentValue = changes[changedProp].currentValue;
        (this.elRef.nativeElement as any)[changedProp] = currentValue;
      }
    });
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      const eventNameMap = (this.constructor as typeof CePassthrough).eventMap;
      const eventNames = Object.keys(eventNameMap);
      const element = this.elRef.nativeElement as HTMLElement;

      const reEmitEvent = (emitterName: string) => (e: Event) => {
        (this as any)[emitterName].emit(e);
      };

      for (const eventName of eventNames) {
        element.addEventListener(eventName as keyof HTMLElementEventMap, reEmitEvent(eventNameMap[eventName]));
      }
    });
  }
}
