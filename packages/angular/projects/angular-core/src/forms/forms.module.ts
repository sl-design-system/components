import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import '@sl-design-system/shared';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/text-input/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/textarea/register.js';
import { CheckboxDirective} from './checkbox/checkbox.directive';
import { InputDirective } from './input/input.directive';
import { TextareaDirective } from './textarea/textarea.directive';
import { RadioGroupDirective } from './radio-group/radio-group.directive';
import { RadioDirective } from './radio-group/radio.directive';
import { FormControlElementDirective } from "./form-control/form-control-element.directive";

@NgModule({
  declarations: [
    CheckboxDirective,
    FormControlElementDirective,
    InputDirective,
    TextareaDirective,
    RadioGroupDirective,
    RadioDirective
  ],
  exports: [
    CheckboxDirective,
    FormControlElementDirective,
    InputDirective,
    TextareaDirective,
    RadioGroupDirective,
    RadioDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormsModule {}
