import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import {CheckboxDirective} from "../../../core/src/public-api";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // CheckboxDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
