import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/input/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/textarea/register.js';
import { CheckboxDirective} from './checkbox/checkbox.directive.js';
import { InputDirective } from './input/input.directive.js';
import { TextareaDirective } from './textarea/textarea.directive.js';
import { RadioGroupDirective } from './radio-group/radio-group.directive.js';
import { RadioDirective } from './radio-group/radio.directive.js';

@NgModule({
  declarations: [
    CheckboxDirective,
    InputDirective,
    TextareaDirective,
    RadioGroupDirective,
    RadioDirective
  ],
  exports: [
    CheckboxDirective,
    InputDirective,
    TextareaDirective,
    RadioGroupDirective,
    RadioDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormsModule {}
