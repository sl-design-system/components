import { Component } from '@angular/core';
import { type Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { AccordionComponent } from '../src/accordion/accordion.component';
import { ButtonComponent } from '../src/button/button.component';
import { TabGroupComponent } from '../src/tabs/tab-group.component';
import { RouterLink, RouterOutlet, provideRouter } from '@angular/router';
import { TabComponent } from '../src/tabs/tab.component';
import { MockLocationStrategy } from '@angular/common/testing';
import { LocationStrategy } from '@angular/common';
import { Routes } from '@angular/router';

@Component({
  selector: 'sla-routing',
  standalone: true,
  imports: [
    TabGroupComponent,
    TabComponent,
    RouterLink,
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
    </sl-tab-group>
    <router-outlet></router-outlet>`
})
export class RoutingComponent {
  tabs = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/assignments', label: 'Assignments' },
    { path: '/grades', label: 'Grades' },
    { path: '/schedule', label: 'Schedule' },
    { path: '/resources', label: 'Resources' },
    { path: '/announcements', label: 'Announcements' },
    { path: '/profile', label: 'Profile' },
    { path: '/settings', label: 'Settings' },
    { path: '/support', label: 'Support' }
  ];
}

@Component({
  selector: 'sla-dummy',
  standalone: true,
  template: '<p>Dummy Component</p>'
})
export class DummyComponent {
  test = true;
}

export const appRoutes: Routes = [
  { path: 'dashboard', component: DummyComponent },
  { path: 'assignments', component: DummyComponent }
];

export default {
  title: 'Routing',
  decorators: [
    moduleMetadata({
      imports: [
        DummyComponent,
        RoutingComponent,
        TabGroupComponent
      ],
      providers: [
        provideRouter(appRoutes)
      ]
    })
  ]
} as Meta;

export const RoutingExample: StoryFn = () => ({
  template: '<sla-routing></sla-routing>'
});
