import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/text-field/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/textarea/register.js';
import { CheckboxDirective} from './checkbox/checkbox.directive';
import { InputDirective } from './input/input.directive';
import { TextareaDirective } from './textarea/textarea.directive';
import { RadioGroupDirective } from './radio-group/radio-group.directive';
import { RadioDirective } from './radio-group/radio.directive';

@NgModule({
  declarations: [
    CheckboxDirective,
    InputDirective,
    RadioGroupDirective,
    RadioDirective,
    TextareaDirective
  ],
  exports: [
    CheckboxDirective,
    InputDirective,
    RadioGroupDirective,
    RadioDirective,
    TextareaDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormsModule {}
