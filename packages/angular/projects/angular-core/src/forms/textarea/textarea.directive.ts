import {
  AfterViewChecked,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Inject,
  Injector,
  Renderer2
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {FormControlElementDirective} from "../form-control/form-control-element.directive";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'sl-textarea',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextareaDirective),
      multi: true
    }
  ]
})

export class TextareaDirective extends FormControlElementDirective /*implements ControlValueAccessor, Validator, AfterViewChecked*/ {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  // onChange: (value: any) => void = () => {};
  // // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-explicit-any
  // onTouched: () => any = () => {};
  //
  // /** Part of Validator. */
  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  // private validatorOnChange = () => {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _value: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get value(): any {
    return this._value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set value(val: any) {
    // this.elementRef.nativeElement.textarea.value = val;
     if (val !== this._value) {
      this._value = val;
      this.onChange(this._value);
      this.validatorOnChange();
     }
  }

  // /** Implemented as part of Validator. */
  // registerOnValidatorChange(fn: () => void): void {
  //   this.validatorOnChange = fn;
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  writeValue(value: any): void {
    if (value) {
      this.value = value;
      this.elementRef.nativeElement.textarea.value = value;
    }
  }

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // registerOnChange(fn: any): void {
  //   this.onChange = fn;
  // }
  //
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // registerOnTouched(fn: any): void {
  //   this.onTouched = fn;
  // }
  //
  // setDisabledState(disabled: boolean): void {
  //   this.elementRef.nativeElement.disabled = disabled;
  // }

  // validate(control: AbstractControl): ValidationErrors | null {
  //   console.log('in textarea validate control controlll', control, control.untouched);
  //
  //   if (control.untouched /*&& control.pristine*/) {
  //     console.log('in textarea validate control untouched', control);
  //     return control.errors; // TODO: return null or not causing invalid?
  //     // return null;
  //   } else {
  //     console.log('in textarea validate control  else', control);
  //     // return control.errors;
  //     return null;
  //   }
  //
  // }

  constructor(public override elementRef: ElementRef, private renderer: Renderer2, @Inject(Injector) injector: Injector) {
    super(elementRef, injector);
  }

  // ngAfterViewChecked() {
  //   console.log('ngafterviewchecked in textarea')
  //   // requestAnimationFrame(() => {
  //   // this.validatorOnChange();
  //   // });
  //    // this.validatorOnChange();
  // }

  @HostListener('input', ['$event.target.value'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listenForValueChange(value: any): void {
    this.value = value;
  }
}
