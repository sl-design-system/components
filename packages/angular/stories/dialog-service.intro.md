## DialogService API

The **DialogService** provides an API for programmatically opening and managing dialogs in Angular applications.

### Main Methods


#### `showModal<T, R>(config: DialogConfig<T>): DialogRef<R>`

Opens a dialog with a custom Angular component. 

**Configuration:**
- `component` (required) - The Angular component class to render.
- `data` (optional) - Data to pass to the component via `@Inject('DIALOG_DATA')`.

For general dialog configuration options like `closeButton`, `disableCancel`, etc., see the [Dialog API documentation](https://sanomalearning.design/categories/components/dialog/code/).

**Returns:** `DialogRef<R>` - A reference to control the dialog and observe when it closes.

**Example:**

```typescript
// Define your dialog component
@Component({
  selector: 'app-user-dialog',
  template: `
    <h2 slot="title">User Details</h2>
    <p>User ID: {{ data.userId }}</p>
    <sl-button slot="primary-actions" (click)="dialogRef.close('saved')">Save</sl-button>
    <sl-button slot="primary-actions" (click)="dialogRef.close('cancelled')">Cancel</sl-button>
  `
})
class MyComponent {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject('DIALOG_DATA') public data: { userId: number }
  ) {}
}

// Open the dialog
const dialogRef = this.dialogService.showModal<MyComponent, string>({
  component: MyComponent,
  data: { userId: 123 },
  closeButton: true,
  disableCancel: false
});

dialogRef.afterClosed().subscribe(result => {
  console.log('Dialog closed with:', result);
});
```

---

#### `closeAll(result?: unknown): void`

Closes all currently opened dialogs at once. This is useful when you need to close multiple dialogs simultaneously.

**Parameters:**
- `result` - Optional result value to pass to all dialogs. This value will be emitted to all `afterClosed()` subscribers.

**Example:**

```typescript
// Close all dialogs without a result
this.dialogService.closeAll();

// Close all dialogs with a specific result
this.dialogService.closeAll('cancelled');
```

---

## DialogRef API

The `DialogRef` returned by `showModal()` provides methods to control an individual dialog and observe its lifecycle.

### Methods

#### `afterClosed(): Observable<R | undefined>`

Returns an Observable that emits when the dialog closes. The Observable emits the result value passed to `close()`, or `undefined` if the dialog was dismissed without a result.

**Returns:** An Observable that completes immediately after emitting the result.

**Example:**

```typescript
dialogRef.afterClosed().subscribe(result => {
  if (result) {
    console.log('Dialog closed with result:', result);
    this.handleResult(result);
  } else {
    console.log('Dialog was dismissed');
  }
});
```

---

#### `close(result?: R): void`

Closes the dialog with an optional result value. The result will be emitted to all `afterClosed()` subscribers.

**Parameters:**
- `result` - Optional result value to pass to subscribers

**Example:**

```typescript
// In the dialog component:
@Component({ /* ... */ })
export class MyDialogComponent {
  constructor(public dialogRef: DialogRef<string>) {}
  
  save() {
    this.dialogRef.close('saved');
  }
  
  cancel() {
    this.dialogRef.close('cancelled');
  }
}
```

---

## Injecting Data into Dialog Components

Dialog components can receive data through dependency injection using the `'DIALOG_DATA'` token.

### Basic Data Injection

```typescript
import { Component, Inject } from '@angular/core';
import { DialogRef } from '@sl-design-system/angular';

@Component({
  template: `
    <h2 slot="title">{{ data.title }}</h2>
    <p>{{ data.message }}</p>
    <sl-button (click)="dialogRef.close('ok')" slot="primary-actions">OK</sl-button>
  `
})
export class MyDialogComponent {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject('DIALOG_DATA') public data: { title: string; message: string }
  ) {}
}
```

### Opening the Dialog with Data

```typescript
this.dialogService.showModal<MyDialogComponent, string>({
  component: MyDialogComponent,
  data: {
    title: 'Confirmation',
    message: 'Are you sure you want to continue?'
  }
});
```

---

## Configuration Options

### DialogConfig

```typescript
interface DialogConfig<T> extends Partial<DialogProps> {
  /** Angular component to render in the dialog */
  component: Type<T>;
  
  /** Data to pass to the component via @Inject('DIALOG_DATA') */
  data?: unknown;
}
```

The `DialogConfig` extends `Partial<DialogProps>`, which includes all public properties from the Dialog component such as `closeButton`, `disableCancel` etc. Please check the [Dialog API documentation](https://sanomalearning.design/categories/components/dialog/code/) for all available configuration options.

---
