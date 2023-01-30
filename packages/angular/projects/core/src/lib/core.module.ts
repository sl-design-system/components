import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CoreComponent } from './core.component';
import { CheckboxDirective} from '../checkbox/checkbox.directive';
import { InputDirective } from '../input/input.directive';
import { TextareaDirective } from '../textarea/textarea.directive';
import { RadioGroupDirective } from "../radio-group/radio-group.directive";
import { RadioDirective } from "../radio-group/radio.directive";



@NgModule({
  declarations: [
    CoreComponent,
    CheckboxDirective,
    InputDirective,
    TextareaDirective,
    RadioGroupDirective,
    RadioDirective
  ],
  imports: [
  ],
  exports: [
    CoreComponent,
    CheckboxDirective,
    InputDirective,
    TextareaDirective,
    RadioGroupDirective,
    RadioDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CoreModule { }
