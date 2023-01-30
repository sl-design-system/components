// import '@sanomalearning/slds-core/dist/components/checkbox/register.js';
import '@sanomalearning/slds-core/checkbox/register.js';
// import '@sanomalearning/slds-core/checkbox-group/register.js';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import '@sanomalearning/slds-core/label/register.js';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
