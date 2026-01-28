## MessageDialogService API

The **MessageDialogService** provides an API for displaying and managing message dialogs in Angular applications.

### Main Methods

#### `showModal<T, R>(config: MessageDialogServiceConfig<T>): MessageDialogRef<R>`

Opens a message dialog with a custom Angular component or simple message content.

**Configuration:**
- `component` (optional) - Angular component to render as the message content
- `data` (optional) - Data to pass to the component via `@Inject('MESSAGE_DIALOG_DATA')`
- `message` (optional) - Simple text or HTML message (use instead of `component` for basic message dialogs)
- `title` (optional) - The title of the message dialog
- `buttons` (optional) - Array of button configurations
- `disableCancel` (optional) - If true, prevents closing via Escape key or backdrop click

**Returns:** a `MessageDialogRef<R>` to control the dialog and observe when it closes.

**Example with Component:**

```typescript
// Define your dialog component
@Component({
  selector: 'app-user-details',
  template: `
    <p>Name: {{ data.name }}</p>
    <p>Age: {{ data.age }}</p>
  `
})
class MyComponent {
  constructor(@Inject('MESSAGE_DIALOG_DATA') public data: { name: string; age: number }) {}
}

// Open the dialog
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

**Example with Message:**

```typescript
const dialogRef = this.messageDialogService.showModal({
  title: 'Warning',
  message: 'This action cannot be undone.',
  buttons: [
    { text: 'Cancel', value: 'cancel' },
    { text: 'Continue', variant: 'warning', value: 'continue' }
  ],
  disableCancel: true
});
```

---

#### `alert(message: string, title?: string): Promise<void>`

Shows a simple alert message to the user with an `OK` button.

This method uses the static MessageDialog API and does not return a `MessageDialogRef`.

**Example:**
```typescript
await this.messageDialogService.alert('Operation completed successfully!', 'Success');
```

---

#### `confirm(message: string, title?: string): Promise<boolean | undefined>`

Shows a confirmation dialog with `OK` and `Cancel` buttons. Returns `true` if `OK` is clicked, `false` if `Cancel` is clicked, or `undefined` if dismissed.

This method uses the static MessageDialog API and does not return a `MessageDialogRef`.

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

This method uses the static MessageDialog API and does not return a `MessageDialogRef`.

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

Closes all currently opened message dialogs.

This method is useful when you need to close multiple message dialogs at once, for example when navigating away from a page or when a critical error occurs that should dismiss all open dialogs.

**Parameters:**
- `result` (optional) - Result to pass to all dialogs. This value will be emitted to all `afterClosed()` subscribers.

**Example:**
```typescript
// Close all dialogs without passing a result
this.messageDialogService.closeAll();

// Close all dialogs with a specific result
this.messageDialogService.closeAll('cancelled');
```

---

## MessageDialogRef API
  
The `MessageDialogRef` is a handle for interacting with an opened message dialog instance.

Provides methods to control the dialog and observe when it closes.
It's returned by `MessageDialogService.showModal()` and allows to:
- Close the dialog programmatically with `close()`,
- Subscribe to dialog close events with `afterClosed()`,
- Pass a result value when closing that will be emitted to subscribers.

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

```typescript
interface MessageDialogServiceConfig<T> extends Partial<MessageDialogProps> {
  /** Component to render in the message dialog */
  component?: Type<T>;
  
  /** Data to pass to the component */
  data?: unknown;
  
  /** The message to display (for non-component dialogs) */
  message?: string | TemplateResult;
  
  /** The title of the message dialog */
  title?: string;
  
  /** Array of button configurations */
  buttons?: Array<MessageDialogButton<unknown>>;
  
  /** If true, prevents closing via Escape key or backdrop click */
  disableCancel?: boolean;
}
```

The `MessageDialogServiceConfig` extends `Partial<MessageDialogProps>`, which includes all public properties from the MessageDialog component. The most commonly used properties (`message`, `title`, `buttons`, `disableCancel`) are explicitly listed above for type safety.

---
