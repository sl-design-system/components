## Custom Component for Message Dialog

When using `showModal()` with a custom Angular component, you can create a component that receives data through dependency injection. Here's the `CustomMessageComponent` used in the examples:

```typescript
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 1rem;">
      <h3 style="margin-top: 0;">Custom Message Content</h3>
      <p>You can <em>customize</em> the message with <strong>HTML</strong>!</p>
      <p>Message data: {{ data }}</p>
    </div>
  `
})
export class CustomMessageComponent {
  constructor(@Inject('MESSAGE_DIALOG_DATA') public data: string) {}
}
```

**Key Points:**
- Use `@Inject('MESSAGE_DIALOG_DATA')` to receive data passed via the `data` property in `showModal()`
- The component is rendered inside the message dialog's content area

**Usage Example:**
```typescript
const dialogRef = this.messageDialogService.showModal<CustomMessageComponent, string>({
  component: CustomMessageComponent,
  data: 'Your data here',
  title: 'Dialog Title',
  buttons: [
    { text: 'Cancel', value: 'cancel' },
    { text: 'OK', variant: 'primary', value: 'ok' }
  ]
});

dialogRef.afterClosed().subscribe(result => {
  console.log('Dialog closed with:', result);
});
```

