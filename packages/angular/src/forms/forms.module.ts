import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import '@sl-design-system/checkbox/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/radio-group/register.js';
import '@sl-design-system/select/register.js';
import '@sl-design-system/switch/register.js';
import '@sl-design-system/text-field/register.js';
import '@sl-design-system/textarea/register.js';
import { CheckboxDirective } from './checkbox.directive';
import { CheckboxGroupDirective } from './checkbox-group.directive';
import { RadioGroupDirective } from './radio-group.directive';
import { SelectDirective } from './select.directive';
import { SwitchDirective } from './switch.directive';
import { TextareaDirective } from './textarea.directive';
import { TextFieldDirective } from './text-field.directive';

@NgModule({
  declarations: [
    CheckboxDirective,
    CheckboxGroupDirective,
    RadioGroupDirective,
    SelectDirective,
    SwitchDirective,
    TextareaDirective,
    TextFieldDirective
  ],
  exports: [
    CheckboxDirective,
    CheckboxGroupDirective,
    RadioGroupDirective,
    SelectDirective,
    SwitchDirective,
    TextareaDirective,
    TextFieldDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FormsModule {}
