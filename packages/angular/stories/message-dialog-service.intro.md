## MessageDialogService API

The **MessageDialogService** provides an API for displaying and managing message dialogs in Angular applications.

### Main Methods

#### `showModal(config): MessageDialogRef`

Opens a message dialog with a custom Angular component or a text message.

**Configuration:**
- For message dialogs with a custom Angular component:
  - `component` (required) - The component to show
  - `data` (optional) - Data to pass to the component
  - `title` (optional) - The dialog title
  - `buttons` (optional) - Buttons to show
  - `disableCancel` (optional) - Set to `true` to prevent closing with Escape or clicking outside

- For message dialogs with a text message:
  - `message` (required) - The text or HTML to show
  - `title` (optional) - The dialog title
  - `buttons` (optional) - Buttons to show
  - `disableCancel` (optional) - Set to `true` to prevent closing with Escape or clicking outside

**Returns:** a `MessageDialogRef` to control the dialog.

**Example with component:**
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
const dialogRef = this.messageDialogService.showModal({
  component: MyComponent,
  data: { name: 'John', age: 30 },
  title: 'User Details',
  buttons: [
    { text: 'Close', value: 'close' },
    { text: 'Save', value: 'save' }
  ]
});

dialogRef.afterClosed().subscribe(result => {
  console.log('Dialog closed with:', result);
});
```

**Example with message:**

```typescript
const dialogRef = this.messageDialogService.showModal({
  title: 'Warning',
  message: 'This action cannot be undone.',
  buttons: [
    { text: 'Cancel', value: 'cancel' },
    { text: 'Continue', value: 'continue' }
  ],
  disableCancel: true
});
```

---

#### `alert(message: string, title?: string): Promise<void>`

Shows an alert message with an `OK` button.

**Example:**
```typescript
await this.messageDialogService.alert('Operation completed!', 'Success');
```

---

#### `confirm(message: string, title?: string): Promise<boolean | undefined>`

Shows a confirmation dialog with `OK` and `Cancel` buttons. Returns `true` if `OK` is clicked, `false` if `Cancel` is clicked, or `undefined` if closed without clicking a button.

**Example:**
```typescript
const confirmed = await this.messageDialogService.confirm(
  'Are you sure you want to delete this item?',
  'Confirm Deletion'
);
if (confirmed) {
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
    { text: 'Save Draft', variant: 'secondary', value: 'draft' },
    { text: 'Publish', variant: 'primary', value: 'publish' }
  ]
});

if (result === 'publish') {
  this.publishContent();
}
```

---

#### `closeAll(result?: unknown): void`

Closes all open message dialogs at once.

**Parameters:**
- `result` (optional) - Value to pass to all dialogs. All `afterClosed()` subscribers will receive this value.

**Example:**
```typescript
// Close all dialogs
this.messageDialogService.closeAll();

// Close all dialogs with a value
this.messageDialogService.closeAll('cancelled');
```

---

## MessageDialogRef API
  
The `MessageDialogRef` is a handle for controlling an open message dialog.

It lets you:
- Close the dialog with `close()`
- Get notified when the dialog closes with `afterClosed()`
- Pass a value when closing

### Methods

#### `afterClosed(): Observable<T | undefined>`

Returns an Observable that emits when the dialog closes. It emits the value passed to `close()`, or `undefined` if the dialog was closed without a value.

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

Closes the dialog. You can optionally pass a value that will be sent to `afterClosed()` subscribers.

**Example:**
```typescript
// Close with a value
dialogRef.close('save');

// Close without a value
dialogRef.close();
```

---

## Injecting MessageDialogRef into Components

Components shown inside the dialog can inject `MessageDialogRef` to close themselves:

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

Configuration for opening a message dialog.

You must provide **either** a `component` **or** a `message` (not both).

#### For message dialogs with a custom Angular component:

```typescript
{
  /** The component to show */
  component: Type<T>;
  
  /** Data to pass to the component (use @Inject('MESSAGE_DIALOG_DATA') to access) */
  data?: unknown;
  
  /** The dialog title */
  title?: string;
  
  /** Buttons to show */
  buttons?: Array<MessageDialogButton>;
  
  /** Set to true to prevent closing with Escape or clicking outside */
  disableCancel?: boolean;
}
```

#### For message dialogs with a text message:

```typescript
{
  /** The text or HTML to show */
  message: string | TemplateResult;
  
  /** The dialog title */
  title?: string;
  
  /** Buttons to show */
  buttons?: Array<MessageDialogButton>;
  
  /** Set to true to prevent closing with Escape or clicking outside */
  disableCancel?: boolean;
}
```
---
