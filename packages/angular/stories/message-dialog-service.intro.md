## MessageDialogService API

The **MessageDialogService** provides an API for displaying and managing message dialogs in Angular applications.

### Main Methods

#### `showModal<T, R>(config: MessageDialogServiceConfig<T, R>): MessageDialogRef<R>`

Opens a message dialog with a custom Angular component or simple message content. This is the primary method for showing message dialogs.

**Parameters:**
- `config.component` - Optional Angular component to render as the message content
- `config.data` - Optional data to pass to the component (available via `MESSAGE_DIALOG_DATA` injection token)
- `config.title` - The title of the message dialog
- `config.message` - The message to display (for non-component dialogs)
- `config.buttons` - Array of button configurations with text, variant, and value
- `config.disableCancel` - If true, prevents closing via Escape key or backdrop click

**Returns:** A `MessageDialogRef` instance for controlling the dialog and observing when it closes.

**Examples:**

With custom component:
```typescript
const dialogRef = this.messageDialogService.showModal<MyComponent, string>({
  component: MyComponent,
  data: { name: 'John', age: 30 },
  title: 'User Details',
  buttons: [
    { text: 'Close', value: 'close' },
    { text: 'Save', variant: 'primary', value: 'save' }
  ]
});

dialogRef.afterClosed().subscribe(result => {
  console.log('Dialog closed with:', result);
});
```

With simple message:
```typescript
const dialogRef = this.messageDialogService.showModal({
  title: 'Warning',
  message: 'This action cannot be undone.',
  buttons: [
    { text: 'Cancel', value: 'cancel' },
    { text: 'Continue', variant: 'warning', value: 'continue' }
  ],
  disableCancel: false
});
```

---

#### `alert(message: string, title?: string): Promise<void>`

Shows a simple alert message to the user with an OK button.

**Note:** This method uses the static MessageDialog API and does not return a `MessageDialogRef`.

**Example:**
```typescript
await this.messageDialogService.alert('Operation completed successfully!', 'Success');
```

---

#### `confirm(message: string, title?: string): Promise<boolean | undefined>`

Shows a confirmation dialog with OK and Cancel buttons. Returns `true` if OK is clicked, `false` if Cancel is clicked, or `undefined` if dismissed.

**Note:** This method uses the static MessageDialog API and does not return a `MessageDialogRef`.

**Example:**
```typescript
const confirmed = await this.messageDialogService.confirm(
  'Are you sure you want to delete this item?',
  'Confirm Deletion'
);
if (confirmed) {
  // User clicked OK
  this.deleteItem();
}
```

---

#### `show<T>(config: MessageDialogConfig<T>): Promise<T | undefined>`

Shows a message dialog with custom configuration using the static MessageDialog API.

**Note:** This method uses the static MessageDialog API and does not return a `MessageDialogRef`.

**Example:**
```typescript
const result = await this.messageDialogService.show({
  title: 'Choose an option',
  message: 'Please select how you want to proceed.',
  buttons: [
    { text: 'Cancel', value: 'cancel' },
    { text: 'Save Draft', variant: 'default', value: 'draft' },
    { text: 'Publish', variant: 'primary', value: 'publish' }
  ]
});

if (result === 'publish') {
  this.publishContent();
}
```

---

#### `closeAll(result?: unknown): void`

Closes all currently opened message dialogs. This method is useful when you need to close multiple message dialogs at once, for example when navigating away from a page or when a critical error occurs.

**Parameters:**
- `result` - Optional result to pass to all dialogs. This value will be emitted to all `afterClosed()` subscribers.

**Example:**
```typescript
// Close all dialogs without passing a result
this.messageDialogService.closeAll();

// Close all dialogs with a specific result
this.messageDialogService.closeAll('cancelled');
```

---

## MessageDialogRef API

The `MessageDialogRef` class provides methods to control the dialog lifecycle and observe when it closes.

### Methods

#### `afterClosed(): Observable<T | undefined>`

Returns an Observable that emits when the dialog closes. The Observable will emit the result value passed to `close()`, or `undefined` if the dialog was dismissed without a result.

**Example:**
```typescript
dialogRef.afterClosed().subscribe(result => {
  if (result) {
    console.log('Dialog closed with result:', result);
  } else {
    console.log('Dialog was dismissed');
  }
});
```

---

#### `close(result?: T): void`

Closes the dialog with an optional result value. The result value will be emitted to all subscribers of `afterClosed()`.

**Example:**
```typescript
// Close with a specific result
dialogRef.close('save');

// Close without a result
dialogRef.close();
```

---

## Injecting MessageDialogRef into Components

Components rendered inside the dialog can inject `MessageDialogRef` to close themselves:

```typescript
import { Component } from '@angular/core';
import { MessageDialogRef } from '@sl-design-system/angular';

@Component({
  template: `
    <button (click)="save()">Save</button>
    <button (click)="cancel()">Cancel</button>
  `
})
export class MyDialogComponent {
  constructor(private dialogRef: MessageDialogRef<string>) {}

  save() {
    this.dialogRef.close('save');
  }

  cancel() {
    this.dialogRef.close('cancel');
  }
}
```

---

## Configuration Options

### MessageDialogServiceConfig

Configuration interface for opening a message dialog with the MessageDialogService.

#### For Component-based Dialogs:
```typescript
{
  component: MyComponent,      // Angular component to render
  data: { userId: 123 },       // Data to pass to the component
  title: 'Edit User',          // Dialog title
  buttons: [                   // Custom buttons
    { text: 'Cancel', value: 'cancel' },
    { text: 'Save', variant: 'primary', value: 'save' }
  ],
  disableCancel: false         // Allow Escape key and backdrop clicks
}
```

#### For Message-based Dialogs:
```typescript
{
  title: 'Warning',            // Dialog title
  message: 'Are you sure?',    // Message text
  buttons: [                   // Custom buttons
    { text: 'No', value: 'no' },
    { text: 'Yes', variant: 'primary', value: 'yes' }
  ],
  disableCancel: true          // Prevent Escape key and backdrop clicks
}
```

---
