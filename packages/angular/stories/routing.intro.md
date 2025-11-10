
The routing has been set up as follows:
```typescript
providers: [
  provideRouter(
    [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'assignments', component: AssignmentsComponent },
      { path: 'grades', component: GradesComponent },
      { path: 'homework', component: HomeworkComponent },
      ...
    ],
    withHashLocation()
  )
]
```
