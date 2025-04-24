import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, provideRouter, withHashLocation } from '@angular/router';
import { type Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular';
import { TabGroupComponent } from '../src/tabs/tab-group.component';
import { TabComponent } from '../src/tabs/tab.component';

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
  imports: [TabGroupComponent, TabComponent, RouterLink, NgForOf, RouterOutlet],
  template: `
    <sl-tab-group>
      <sl-tab *ngFor="let tab of tabs" [routerLink]="tab.path">
        {{ tab.label }}
      </sl-tab>
      <router-outlet></router-outlet>
    </sl-tab-group>
  `
})
export class RoutingComponent {
  tabs = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/assignments', label: 'Assignments' }
  ];
}

export default {
  title: 'Routing',
  decorators: [
    applicationConfig({
      providers: [
        provideRouter(
          [
            { path: 'dashboard', component: DummyComponent },
            { path: 'assignments', component: DummyComponent2 }
          ],
          withHashLocation()
        )
      ]
    }),
    moduleMetadata({
      imports: [DummyComponent, DummyComponent2, RoutingComponent]
    })
  ]
} as Meta;

export const RoutingExample: StoryFn = () => ({
  template: '<sla-routing></sla-routing>'
});
