import { Component, importProvidersFrom } from '@angular/core';
import { type Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { AccordionComponent } from '../src/accordion/accordion.component';
import { ButtonComponent } from '../src/button/button.component';
import { TabGroupComponent } from '../src/tabs/tab-group.component';
import {RouterLink, RouterOutlet, provideRouter, withHashLocation} from '@angular/router';
import { TabComponent } from '../src/tabs/tab.component';
import { MockLocationStrategy } from '@angular/common/testing';
import {HashLocationStrategy, LocationStrategy, NgForOf} from '@angular/common';
import { Routes } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
// import { withAngularRouter } from 'storybook-addon-angular-router';

@Component({
  selector: 'sla-routing',
  standalone: true,
  imports: [
    TabGroupComponent,
    TabComponent,
    RouterLink,
    RouterOutlet,
    NgForOf
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
    // { path: '/grades', label: 'Grades' },
    // { path: '/schedule', label: 'Schedule' },
    // { path: '/resources', label: 'Resources' },
    // { path: '/announcements', label: 'Announcements' },
    // { path: '/profile', label: 'Profile' },
    // { path: '/settings', label: 'Settings' },
    // { path: '/support', label: 'Support' }
  ];

  ngOnInit() {
    console.log('tabs in ngOnInit', this.tabs);
  }
}

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

export const routes: Routes = [
  { path: 'dashboard', component: DummyComponent },
  { path: 'assignments', component: DummyComponent2 }
];

export default {
  title: 'Routing',
  decorators: [
    // withAngularRouter,
    moduleMetadata({
      imports: [
        DummyComponent,
        DummyComponent2,
        RoutingComponent,
        TabGroupComponent,
        // provideRouter(routes, withHashLocation()),
      ],
      // providers: [
      //   [provideRouter(routes, withHashLocation())],
      // ],
    }),
  ],
} as Meta;

export const RoutingExample: StoryFn = () => ({
  template: '<sla-routing></sla-routing>',
  parameters: {
    angularRouter: {
      initialRoute: '/dashboard', // Set the initial route
      routes: [
        { path: 'dashboard', component: DummyComponent },
        { path: 'assignments', component: DummyComponent2 },
      ],
    },
  },
});
//
//
// // import { Component } from '@angular/core';
// // import { provideRouter, RouterOutlet } from '@angular/router';
// // import { bootstrapApplication } from '@angular/platform-browser';
// //
// // @Component({
// //   selector: 'app-route1',
// //   standalone: true,
// //   template: `<p>Route 1 Content</p>`,
// // })
// // export class Route1Component {}
// //
// // @Component({
// //   selector: 'app-route2',
// //   standalone: true,
// //   template: `<p>Route 2 Content</p>`,
// // })
// // export class Route2Component {}
// //
// // @Component({
// //   selector: 'app-tabs',
// //   standalone: true,
// //   imports: [RouterOutlet],
// //   template: `
// //     <mat-tab-group>
// //       <mat-tab label="Tab 1">
// //         <a routerLink="/route1">Go to Route 1</a>
// //       </mat-tab>
// //       <mat-tab label="Tab 2">
// //         <a routerLink="/route2">Go to Route 2</a>
// //       </mat-tab>
// //     </mat-tab-group>
// //     <router-outlet></router-outlet>
// //   `,
// // })
// // export class TabsComponent {}
// //
// // const routes = [
// //   { path: 'route1', component: Route1Component },
// //   { path: 'route2', component: Route2Component },
// //   { path: '', redirectTo: '/route1', pathMatch: 'full' }
// // ];
// //
// // bootstrapApplication(TabsComponent, {
// //   providers: [provideRouter(routes)],
// // });


// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { provideRouter, RouterModule } from '@angular/router';
// import { applicationConfig, Meta, StoryObj } from '@storybook/angular';
// import { provideLocationMocks } from '@angular/common/testing';
//
// import {
//   provideStoryInitialUrl,
//   initialUrlFromArgs,
// } from '@marklb/storybook-angular-initial-url';
//
// @Component({
//   template: `
//     <div>
//       <a routerLink="/content-1">Content 1</a>
//       <a routerLink="/content-2">Content 2</a>
//       <a routerLink="/content-3">Content 3</a>
//       <a routerLink="../other">Content 3</a>
//     </div>
//     <div>
//       <router-outlet></router-outlet>
//     </div>
//   `,
//   standalone: true,
//   imports: [CommonModule, RouterModule],
// })
// class MyPageComponent {}
//
// @Component({
//   template: `Content Page 1`,
//   standalone: true,
// })
// class ContentOneComponent {}
//
// @Component({
//   template: `Content Page 2`,
//   standalone: true,
// })
// class ContentTwoComponent {}
//
// @Component({
//   template: `Content Page 3`,
//   standalone: true,
// })
// class ContentThreeComponent {}
//
// @Component({
//   template: `Dashboard`,
//   standalone: true,
// })
// class DashboardComponent {}
//
// interface ExtraArgs {
//   initialUrl?: string
// }
//
// type StoryComponent = MyPageComponent & ExtraArgs
//
// const meta: Meta<StoryComponent> = {
//   title: 'MyPageComponent',
//   component: MyPageComponent,
//   tags: ['autodocs'],
//   decorators: [
//     applicationConfig({
//       providers: [
//         provideLocationMocks(),
//         provideRouter([
//           { path: '', component: DashboardComponent },
//           { path: 'content-1', component: ContentOneComponent },
//           { path: 'content-2', component: ContentTwoComponent },
//           { path: 'content-3', component: ContentThreeComponent },
//         ]),
//         // provideStoryInitialUrl('content-1'),
//       ],
//     }),
//   ],
//   parameters: {
//     layout: 'fullscreen',
//   },
// };
//
// export default meta;
// type Story = StoryObj<StoryComponent>;
//
// export const Basic: Story = {};
//
// export const WithInitialUrl: Story = {
//   decorators: [
//     applicationConfig({
//       providers: [provideStoryInitialUrl('content-2')],
//     }),
//   ],
// };
//
// export const WithInitialUrlArg: Story = {
//   argTypes: {
//     initialUrl: {
//       control: {
//         type: 'select',
//       },
//       options: ['/content-1', '/content-2', '/content-3'],
//     },
//   },
//   args: {
//     initialUrl: '/content-3',
//   },
//   decorators: [initialUrlFromArgs()],
// };
//
// export const ArgChangeRerender: Story = {
//   argTypes: {
//     ...WithInitialUrlArg.argTypes,
//   },
//   args: {
//     ...WithInitialUrlArg.args,
//   },
//   decorators: [initialUrlFromArgs({ rerender: true })],
// };


// importProvidersFrom({
//   ngModule: class {
//     static ɵmod = {
//       type: this,
//       bootstrap: [],
//       declarations: [],
//       imports: [],
//       exports: [],
//     };
//   }
// }),
