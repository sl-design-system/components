import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  NgZone,
  type OnChanges,
  type OnInit,
  SimpleChanges,
  inject
} from '@angular/core';

@Directive({
  standalone: true
})
export class CePassthrough<T extends HTMLElement> implements OnInit, OnChanges {
  static eventMap: Record<string, string> = {} as const;

  private cdRef = inject(ChangeDetectorRef);
  protected zone = inject(NgZone);
  public readonly el = this.elRef.nativeElement;

  constructor(public readonly elRef: ElementRef<T>) {
    this.cdRef.detach();
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      const eventNameMap = (this.constructor as typeof CePassthrough).eventMap,
        element = this.elRef.nativeElement;

      const reEmitEvent = (emitterName: string) => (e: Event) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (this as any)[emitterName].emit(e);
      };

      for (const eventName of Object.keys(eventNameMap)) {
        element.addEventListener(eventName as keyof HTMLElementEventMap, reEmitEvent(eventNameMap[eventName]));
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.zone.runOutsideAngular(() => {
      for (const changedProp of Object.keys(changes)) {
        if (!(changedProp in this.elRef.nativeElement)) {
          continue;
        }

        const currentValue = changes[changedProp].currentValue as T[keyof T];
        this.elRef.nativeElement[changedProp as keyof T] = currentValue;
      }
    });
  }
}
