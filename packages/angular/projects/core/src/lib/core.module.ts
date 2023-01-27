import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CoreComponent } from './core.component';
import { CheckboxDirective } from "../checkbox/checkbox.directive";
import { InputDirective } from './input.directive';



@NgModule({
  declarations: [
    CoreComponent,
    CheckboxDirective,
    InputDirective
  ],
  imports: [
  ],
  exports: [
    CoreComponent,
    CheckboxDirective,
    InputDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CoreModule { }
