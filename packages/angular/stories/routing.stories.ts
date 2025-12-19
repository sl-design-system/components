import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, provideRouter, withHashLocation } from '@angular/router';
import { MenuComponent } from '@sl-design-system/angular/menu';
import { TabComponent, TabGroupComponent } from '@sl-design-system/angular/tabs';
import { type Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular';

@Component({
  selector: 'sla-dashboard',
  standalone: true,
  template: '<p>Dashboard</p>'
})
export class DashboardComponent {}

@Component({
  selector: 'sla-assignments',
  standalone: true,
  template: '<p>Assignments</p>'
})
export class AssignmentsComponent {}

@Component({
  selector: 'sla-grades',
  standalone: true,
  template: '<p>Grades</p>'
})
export class GradesComponent {}

@Component({
  selector: 'sla-homework',
  standalone: true,
  template: '<p>Homework</p>'
})
export class HomeworkComponent {}

@Component({
  selector: 'sla-exams',
  standalone: true,
  template: '<p>Exams</p>'
})
export class ExamsComponent {}

@Component({
  selector: 'sla-announcements',
  standalone: true,
  template: '<p>Announcements</p>'
})
export class AnnouncementsComponent {}

@Component({
  selector: 'sla-library',
  standalone: true,
  template: '<p>Library</p>'
})
export class LibraryComponent {}

@Component({
  selector: 'sla-events',
  standalone: true,
  template: '<p>Events</p>'
})
export class EventsComponent {}

@Component({
  selector: 'sla-resurces',
  standalone: true,
  template: '<p>Resources</p>'
})
export class ResourcesComponent {}

@Component({
  selector: 'sla-profile',
  standalone: true,
  template: '<p>Profile</p>'
})
export class ProfileComponent {}

@Component({
  selector: 'sla-settings',
  standalone: true,
  template: '<p>Settings</p>'
})
export class SettingsComponent {}

@Component({
  selector: 'sla-routing',
  standalone: true,
  imports: [TabGroupComponent, TabComponent, MenuComponent, RouterLink, NgForOf, RouterOutlet],
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
    { path: '/assignments', label: 'Assignments' },
    { path: '/grades', label: 'Grades' },
    { path: '/homework', label: 'Homework' },
    { path: '/exams', label: 'Exams' },
    { path: '/announcements', label: 'Announcements' },
    { path: '/library', label: 'Library' },
    { path: '/events', label: 'Events' },
    { path: '/resources', label: 'Resources' },
    { path: '/profile', label: 'Profile' },
    { path: '/settings', label: 'Settings' }
  ];
}

export default {
  title: 'Components/Routing',
  decorators: [
    applicationConfig({
      providers: [
        provideRouter(
          [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'assignments', component: AssignmentsComponent },
            { path: 'grades', component: GradesComponent },
            { path: 'homework', component: HomeworkComponent },
            { path: 'exams', component: ExamsComponent },
            { path: 'announcements', component: AnnouncementsComponent },
            { path: 'library', component: LibraryComponent },
            { path: 'events', component: EventsComponent },
            { path: 'resources', component: ResourcesComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'settings', component: SettingsComponent }
          ],
          withHashLocation()
        )
      ]
    }),
    moduleMetadata({
      imports: [
        AssignmentsComponent,
        DashboardComponent,
        EventsComponent,
        ExamsComponent,
        GradesComponent,
        HomeworkComponent,
        LibraryComponent,
        MenuComponent,
        ProfileComponent,
        ResourcesComponent,
        RoutingComponent,
        SettingsComponent
      ]
    })
  ]
} as Meta;

export const RoutingExample: StoryFn = () => ({
  template: '<sla-routing></sla-routing>'
});
