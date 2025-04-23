import { Component, importProvidersFrom, Provider } from '@angular/core';
import { type Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { AccordionComponent } from '../src/accordion/accordion.component';
import { ButtonComponent } from '../src/button/button.component';
import { TabGroupComponent } from '../src/tabs/tab-group.component';
import {provideRouter, RouterLink, RouterOutlet} from '@angular/router';
import { TabComponent } from '../src/tabs/tab.component';
import { MockLocationStrategy } from '@angular/common/testing';
import {HashLocationStrategy, LocationStrategy, NgForOf} from '@angular/common';

@Component({
  selector: 'sla-dummy',
  standalone: true,
  template: '<p>Dummy Component</p>'
})
export class DummyComponent {
  test = true;
}

@Component({
  selector: 'sla-dummy-2',
  standalone: true,
  template: '<p>Dummy Component 2</p>'
})
export class DummyComponent2 {
  test = true;
}

@Component({
  selector: 'sla-routing',
  standalone: true,
  imports: [
    TabGroupComponent,
    TabComponent,
    RouterLink,
    NgForOf,
    RouterOutlet
  ],
  template: `
    <sl-tab-group>
      <sl-tab
        *ngFor="let tab of tabs"
        [routerLink]="tab.path"
      >
        {{ tab.label }}
      </sl-tab>
      <router-outlet></router-outlet>
    </sl-tab-group>`
})
export class RoutingComponent {
  tabs = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/assignments', label: 'Assignments' },
  ];

  ngOnInit() {
    console.log('tabs in ngOnInit', this.tabs);
  }
}

// export const routes: Routes = [
//   { path: 'dashboard', component: DummyComponent },
//   { path: 'assignments', component: DummyComponent2 }
// ];

// export const WithActiveLink = Template.bind({});
// WithActiveLink.parameters = {
//   angularRouter: {active: '/location/1'}
// };

export default {
  title: 'Routing',
  decorators: [
    moduleMetadata({
      imports: [
        DummyComponent,
        DummyComponent2,
        RoutingComponent,
        // TabGroupComponent,
        // provideRouter(routes, withHashLocation()),
      ],
      providers: [
        provideRouter([
          { path: 'dashboard', component: DummyComponent },
          { path: 'assignments', component: DummyComponent2 }
        ]) as unknown as Provider
      ],
      // providers: [
      //   [provideRouter(routes, withHashLocation())],
      // ],
    }),
  ],
  // parameters: {
  //   angularRouter: {
  //     initialRoute: '/dashboard', // Set the initial route
  //     routes: [
  //       { path: 'dashboard', component: DummyComponent },
  //       { path: 'assignments', component: DummyComponent2 },
  //     ],
  //   },
  // },
} as Meta;

export const RoutingExample: StoryFn = () => ({
  template: '<sla-routing></sla-routing>',
  // parameters: {
  //   routes: [
  //     { path: 'dashboard', component: DummyComponent },
  //     { path: 'assignments', component: DummyComponent2 }
  //   ],
  // //   angularRouter: {
  // //     initialRoute: '/dashboard', // Set the initial route
  // //     routes: [
  // //       { path: 'dashboard', component: DummyComponent },
  // //       { path: 'assignments', component: DummyComponent2 },
  // //     ],
  // //   },
  // },
});
