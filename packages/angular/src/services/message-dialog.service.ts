import {
  ApplicationRef,
  ChangeDetectorRef,
  ComponentRef,
  Injectable,
  Injector,
  NgZone,
  Type,
  createComponent
} from '@angular/core';
import { MessageDialog, type MessageDialogButton, type MessageDialogConfig } from '@sl-design-system/message-dialog';
import '@sl-design-system/message-dialog/register.js';
import { type TemplateResult } from 'lit';
import { Observable, Subject } from 'rxjs';

/**  Utility type to get all public properties from the MessageDialog, plus 'component' and 'data' properties additionally. */
type MessageDialogProps = Omit<
  {
    [K in keyof MessageDialog as MessageDialog[K] extends (...args: unknown[]) => unknown
      ? never
      : K]: MessageDialog[K];
  },
  'component' | 'data'
>;

/**
 * Configuration interface for opening a message dialog with the MessageDialogService.
 *
 * This interface defines all the options you can pass to `MessageDialogService.showModal()`.
 *
 * ## Configuration Options
 *
 * ### For Component-based Dialogs:
 * ```typescript
 * {
 *   component: MyComponent,      // Angular component to render
 *   data: { userId: 123 },       // Data to pass to the component
 *   title: 'Edit User',          // Dialog title
 *   buttons: [                   // Custom buttons
 *     { text: 'Cancel', value: 'cancel' },
 *     { text: 'Save', variant: 'primary', value: 'save' }
 *   ],
 *   disableCancel: false         // Allow Escape key and backdrop clicks
 * }
 * ```
 *
 * ### For Message-based Dialogs:
 * ```typescript
 * {
 *   title: 'Warning',            // Dialog title
 *   message: 'Are you sure?',    // Message text
 *   buttons: [                   // Custom buttons
 *     { text: 'No', value: 'no' },
 *     { text: 'Yes', variant: 'primary', value: 'yes' }
 *   ],
 *   disableCancel: true          // Prevent Escape key and backdrop clicks
 * }
 * ```
 *
 * @template T - The type of the component (if using a component)
 * @template R - The type of the result value returned when the dialog closes
 */
export interface MessageDialogServiceConfig<T, R = unknown> extends Partial<MessageDialogProps> {
  /** Angular component to render in the message dialog's content area. */
  component?: Type<T>;

  /** Data to pass to the component via the `MESSAGE_DIALOG_DATA` injection token. */
  data?: unknown;

  /** The title displayed at the top of the message dialog. */
  title?: string;

  /** The message text to display (for non-component dialogs). Can be a string or Lit TemplateResult. */
  message?: string | TemplateResult;

  /** Array of button configurations. Each button can have text, variant, and a value that will be returned when clicked. */
  buttons?: Array<MessageDialogButton<R>>;

  /** If true, prevents the dialog from being closed via Escape key or backdrop clicks. Default is false. */
  disableCancel?: boolean;
}

/** Helper to assign all config properties to the message dialog element */
const applyMessageDialogProps = (dialog: MessageDialog, config: MessageDialogServiceConfig<unknown>): void => {
  Object.keys(config).forEach(key => {
    if (key !== 'component' && key !== 'data' && key in dialog) {
      (dialog as unknown as Record<string, unknown>)[key] = (config as unknown as Record<string, unknown>)[key];
    }
  });
};

/**
 * MessageDialogRef is a handle for interacting with an opened message dialog instance.
 *
 * This class provides methods to control the dialog lifecycle and observe when it closes.
 * It's returned by `MessageDialogService.showModal()` and allows you to:
 * - Close the dialog programmatically with `close()`
 * - Subscribe to dialog close events with `afterClosed()`
 * - Pass a result value when closing that will be emitted to subscribers
 *
 * ## Basic Usage
 *
 * ```typescript
 * const dialogRef = this.messageDialogService.showModal<MyComponent, string>({
 *   component: MyComponent,
 *   title: 'Edit User'
 * });
 *
 * // Subscribe to close events
 * dialogRef.afterClosed().subscribe(result => {
 *   if (result === 'save') {
 *     console.log('User saved changes');
 *   } else if (result === 'cancel') {
 *     console.log('User cancelled');
 *   } else {
 *     console.log('Dialog was dismissed');
 *   }
 * });
 *
 * // Close the dialog programmatically after 5 seconds
 * setTimeout(() => {
 *   dialogRef.close('timeout');
 * }, 5000);
 * ```
 *
 * ## Closing from Inside a Component
 *
 * Components rendered inside the dialog can inject `MessageDialogRef` to close themselves:
 *
 * ```typescript
 * import { Component } from '@angular/core';
 * import { MessageDialogRef } from '@sl-design-system/angular';
 *
 * @Component({
 *   template: `
 *     <button (click)="save()">Save</button>
 *     <button (click)="cancel()">Cancel</button>
 *   `
 * })
 * export class MyDialogComponent {
 *   constructor(private dialogRef: MessageDialogRef<string>) {}
 *
 *   save() {
 *     this.dialogRef.close('save');
 *   }
 *
 *   cancel() {
 *     this.dialogRef.close('cancel');
 *   }
 * }
 * ```
 *
 * @template T - The type of the result value that can be passed when closing the dialog
 */
export class MessageDialogRef<T = unknown> {
  /** Subject that emits when the dialog closes. */
  #afterClosedSubject = new Subject<T | undefined>();

  /** Track if the subject (dialog) was manually closed with a result. */
  #manualClose = false;

  /** Result passed when closing the dialog. */
  #result?: T;

  /**
   * Callback function type for handling the dialog close event.
   * This property holds a reference to a function that is invoked when the dialog emits the `sl-close` event.
   * It is used internally to notify subscribers and perform cleanup when the dialog is closed, either by user action or programmatically.
   */
  #onClose: () => void;

  /**
   * Callback function type for handling the dialog cancel event.
   * This property holds a reference to a function that is invoked when the dialog emits the `sl-cancel` event.
   * It is used internally to notify subscribers when the dialog is cancelled.
   */
  #onCancel: () => void;

  /** Message dialog element reference. */
  dialog: MessageDialog;

  /** Internal dialog element reference (for event listening). */
  #internalDialog?: HTMLDialogElement;

  constructor(
    dialog: MessageDialog,
    private ngZone: NgZone
  ) {
    this.dialog = dialog;

    this.#onClose = () => {
      requestAnimationFrame(() => {
        this.ngZone.run(() => {
          if (this.#manualClose) {
            this.#afterClosedSubject.next(this.#result);
          } else {
            this.#afterClosedSubject.next(undefined);
          }
          this.#afterClosedSubject.complete();
        });
      });
    };

    this.#onCancel = () => {
      requestAnimationFrame(() => {
        this.ngZone.run(() => {
          this.#afterClosedSubject.next(undefined);
          this.#afterClosedSubject.complete();
        });
      });
    };

    // Wait for the component to be ready and get the internal dialog element
    void this.dialog.updateComplete.then(() => {
      this.#internalDialog = this.dialog.shadowRoot?.querySelector('dialog') ?? undefined;
      if (this.#internalDialog) {
        // Listen to native 'close' event from the internal dialog element
        this.#internalDialog.addEventListener('close', this.#onClose);
      }
    });

    // Listen to sl-cancel event from the custom element
    this.dialog.addEventListener('sl-cancel', this.#onCancel);
  }

  /**
   * Returns an Observable that emits when the dialog closes.
   *
   * The Observable will emit the result value passed to `close()`, or `undefined` if the dialog
   * was dismissed without a result (e.g., via Escape key or backdrop click).
   *
   * The Observable completes immediately after emitting the result.
   *
   * Example usage:
   * ```typescript
   * dialogRef.afterClosed().subscribe(result => {
   *   if (result) {
   *     console.log('Dialog closed with result:', result);
   *   } else {
   *     console.log('Dialog was dismissed');
   *   }
   * });
   * ```
   *
   * @returns An Observable that emits the dialog result when it closes
   */
  afterClosed(): Observable<T | undefined> {
    return this.#afterClosedSubject.asObservable();
  }

  /**
   * Closes the dialog with an optional result value.
   *
   * The result value will be emitted to all subscribers of `afterClosed()`.
   * If no result is provided, `undefined` will be emitted.
   *
   * Example usage:
   * ```typescript
   * // Close with a specific result
   * dialogRef.close('save');
   *
   * // Close without a result
   * dialogRef.close();
   * ```
   *
   * @param result - Optional result value to pass to subscribers
   */
  close(result?: T): void {
    this.#manualClose = true;
    this.#result = result;
    this.dialog.close();
  }

  /** Set the result value (used internally by the service). */
  setResult(result: T): void {
    this.#manualClose = true;
    this.#result = result;
  }

  /** A method to clean up the event listeners. */
  destroy(): void {
    if (this.#internalDialog) {
      this.#internalDialog.removeEventListener('close', this.#onClose);
    }
    this.dialog.removeEventListener('sl-cancel', this.#onCancel);
  }
}

/**
 * MessageDialogService provides a comprehensive API for displaying and managing message dialogs in Angular applications.
 *
 * This service offers multiple methods for showing message dialogs:
 * - **`showModal()`** - Opens a message dialog with a custom Angular component or simple message
 * - **`alert()`** - Shows a simple alert message with an OK button (static method wrapper)
 * - **`confirm()`** - Shows a confirmation dialog with OK and Cancel buttons (static method wrapper)
 * - **`show()`** - Shows a message dialog with custom configuration (static method wrapper)
 * - **`closeAll()`** - Closes all currently opened message dialogs
 *
 * ## Key Features
 * - Support for custom Angular components as message content
 * - Data injection into custom components via `MESSAGE_DIALOG_DATA` token
 * - Dialog lifecycle management with `MessageDialogRef`
 * - Observable-based result handling via `afterClosed()`
 * - Multiple button configurations with custom actions
 * - Control over cancel behavior (Escape key and backdrop clicks)
 *
 * ## Basic Usage Examples
 *
 * ### Simple Alert
 * ```typescript
 * await this.messageDialogService.alert('Operation completed successfully!', 'Success');
 * ```
 *
 * ### Confirmation Dialog
 * ```typescript
 * const confirmed = await this.messageDialogService.confirm(
 *   'Are you sure you want to delete this item?',
 *   'Confirm Deletion'
 * );
 * if (confirmed) {
 *   // User clicked OK
 * }
 * ```
 *
 * ### Custom Component Dialog
 * ```typescript
 * const dialogRef = this.messageDialogService.showModal<MyComponent, string>({
 *   component: MyComponent,
 *   data: { userId: 123, userName: 'John' },
 *   title: 'Edit User',
 *   buttons: [
 *     { text: 'Cancel', value: 'cancel' },
 *     { text: 'Save', variant: 'primary', value: 'save' }
 *   ],
 *   disableCancel: false
 * });
 *
 * dialogRef.afterClosed().subscribe(result => {
 *   if (result === 'save') {
 *     // Handle save action
 *   }
 * });
 * ```
 *
 * ### Simple Message Dialog
 * ```typescript
 * const dialogRef = this.messageDialogService.showModal({
 *   title: 'Important Notice',
 *   message: 'Please review the terms and conditions.',
 *   buttons: [
 *     { text: 'OK', variant: 'primary', value: 'ok' }
 *   ]
 * });
 * ```
 *
 * ### Non-Cancellable Dialog
 * ```typescript
 * const dialogRef = this.messageDialogService.showModal({
 *   title: 'Processing',
 *   message: 'Please wait while we process your request...',
 *   buttons: [{ text: 'OK', variant: 'primary', value: 'ok' }],
 *   disableCancel: true // Prevents Escape key and backdrop clicks
 * });
 * ```
 *
 * ## Injecting Data into Custom Components
 *
 * Custom components can receive data through dependency injection:
 *
 * ```typescript
 * import { Component, Inject } from '@angular/core';
 *
 * @Component({
 *   template: `<p>User ID: {{ data.userId }}</p>`
 * })
 * export class MyComponent {
 *   constructor(@Inject('MESSAGE_DIALOG_DATA') public data: any) {}
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class MessageDialogService {
  /** Track all opened message dialog references, can be used to close all dialogs. */
  #openedDialogs: Array<MessageDialogRef<unknown>> = [];

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private ngZone: NgZone
  ) {}

  /**
   * Opens a message dialog with a custom Angular component or simple message content.
   *
   * This is the primary method for showing message dialogs. It supports both simple text messages
   * and complex Angular components with data injection.
   *
   * ## With Custom Component
   *
   * When using a custom component, the component will be rendered inside the message dialog's content area.
   * You can pass data to the component via the `data` property, which will be available through
   * the `MESSAGE_DIALOG_DATA` injection token.
   *
   * ```typescript
   * const dialogRef = this.messageDialogService.showModal<MyComponent, string>({
   *   component: MyComponent,
   *   data: { name: 'John', age: 30 },
   *   title: 'User Details',
   *   buttons: [
   *     { text: 'Close', value: 'close' },
   *     { text: 'Save', variant: 'primary', value: 'save' }
   *   ]
   * });
   *
   * dialogRef.afterClosed().subscribe(result => {
   *   console.log('Dialog closed with:', result);
   * });
   * ```
   *
   * ## With Simple Message
   *
   * For simple text messages, omit the `component` property and use the `message` property instead:
   *
   * ```typescript
   * const dialogRef = this.messageDialogService.showModal({
   *   title: 'Warning',
   *   message: 'This action cannot be undone.',
   *   buttons: [
   *     { text: 'Cancel', value: 'cancel' },
   *     { text: 'Continue', variant: 'warning', value: 'continue' }
   *   ],
   *   disableCancel: false
   * });
   * ```
   *
   * @template T - The type of the component to render (if using a component)
   * @template R - The type of the result value returned when the dialog closes
   * @param config - Configuration object for the message dialog
   * @param config.component - Optional Angular component to render as the message content
   * @param config.data - Optional data to pass to the component (available via `MESSAGE_DIALOG_DATA` injection token)
   * @param config.title - The title of the message dialog
   * @param config.message - The message to display (for non-component dialogs)
   * @param config.buttons - Array of button configurations with text, variant, and value
   * @param config.disableCancel - If true, prevents closing via Escape key or backdrop click
   * @returns A `MessageDialogRef` instance that can be used to interact with the dialog and observe when it closes
   */
  showModal<T, R = unknown>(config: MessageDialogServiceConfig<T, R>): MessageDialogRef<R> {
    const dialog = document.createElement('sl-message-dialog') as MessageDialog<R>;

    // Create message from component if provided
    let message: string | TemplateResult = '';
    let componentRef: ComponentRef<T> | undefined = undefined;

    if (config.component) {
      const dialogRef = new MessageDialogRef<R>(dialog, this.ngZone);
      componentRef = this.#createComponent<T, R>(config.component, config.data, dialogRef);
      const hostElement = componentRef.location.nativeElement as HTMLElement;

      // We'll set the message to be the rendered component
      // For now, we'll use a placeholder and update after render
      message = '';

      // Set up the dialog config
      const dialogConfig: MessageDialogConfig<R> = {
        title: config.title,
        message,
        buttons: config.buttons?.map(button => ({
          ...button,
          action: () => {
            // Store the button value BEFORE the dialog closes
            // The button action is called before the dialog's close event fires
            if (button.value !== undefined) {
              dialogRef.setResult(button.value);
            }
            // Call the original action if provided
            button.action?.();
          }
        })),
        disableCancel: config.disableCancel
      };

      dialog.config = dialogConfig;
      applyMessageDialogProps(dialog, config);

      this.#openedDialogs.push(dialogRef as MessageDialogRef<unknown>);

      document.body.appendChild(dialog);

      // Wait for the component to render and move content
      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          // Find the <p> element in the message dialog and replace its content with the component
          void dialog.updateComplete.then(() => {
            const messageElement = dialog.shadowRoot?.querySelector('p');
            if (messageElement && hostElement.firstChild) {
              messageElement.innerHTML = '';
              while (hostElement.firstChild) {
                messageElement.appendChild(hostElement.firstChild);
              }
            }

            dialog.showModal();

            this.ngZone.run(() => {
              const componentChangeDetector = componentRef?.injector.get(ChangeDetectorRef, null);
              if (componentChangeDetector) {
                componentChangeDetector.markForCheck();
              }
            });

            // Set up cleanup when dialog closes
            // We need to listen to the internal dialog element's close event
            const internalDialog = dialog.shadowRoot?.querySelector('dialog');
            if (internalDialog) {
              const cleanupHandler = () => {
                this.#cleanup(dialogRef, componentRef, dialog);
                internalDialog.removeEventListener('close', cleanupHandler);
              };
              internalDialog.addEventListener('close', cleanupHandler);
            }
          });
        });
      });

      dialog.addEventListener('sl-cancel', () => {
        this.#cleanup(dialogRef, componentRef, dialog);
      });

      return dialogRef;
    } else {
      // If no component, just use the config as-is
      const dialogConfig: MessageDialogConfig<R> = {
        title: config.title,
        message: config.message || '',
        buttons: config.buttons,
        disableCancel: config.disableCancel
      };

      dialog.config = dialogConfig;
      applyMessageDialogProps(dialog, config);

      const dialogRef = new MessageDialogRef<R>(dialog, this.ngZone);
      this.#openedDialogs.push(dialogRef as MessageDialogRef<unknown>);

      document.body.appendChild(dialog);

      this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          void dialog.updateComplete.then(() => {
            dialog.showModal();

            // Set up cleanup when dialog closes
            const internalDialog = dialog.shadowRoot?.querySelector('dialog');
            if (internalDialog) {
              const cleanupHandler = () => {
                this.#cleanup(dialogRef, undefined, dialog);
                internalDialog.removeEventListener('close', cleanupHandler);
              };
              internalDialog.addEventListener('close', cleanupHandler);
            }
          });
        });
      });

      dialog.addEventListener('sl-cancel', () => {
        this.#cleanup(dialogRef, undefined, dialog);
      });

      return dialogRef;
    }
  }

  /**
   * Shows a simple alert message to the user with an OK button.
   *
   * This is a convenience method that wraps the static `MessageDialog.alert()` method.
   * The dialog will automatically close when the user clicks OK or presses Escape.
   *
   * **Note:** This method uses the static MessageDialog API and does not return a `MessageDialogRef`.
   * If you need more control over the dialog lifecycle, use `showModal()` instead.
   *
   * Example usage:
   * ```typescript
   * // Simple alert
   * await this.messageDialogService.alert('Operation completed successfully!');
   *
   * // Alert with custom title
   * await this.messageDialogService.alert('Your changes have been saved.', 'Success');
   *
   * // Wait for user to dismiss alert
   * await this.messageDialogService.alert('Please check your email.', 'Verification Required');
   * console.log('User dismissed the alert');
   * ```
   *
   * @param message - The message to display in the alert dialog
   * @param title - Optional title for the alert dialog
   * @returns A promise that resolves when the dialog is closed
   */
  async alert(message: string, title?: string): Promise<void> {
    await MessageDialog.alert(message, title);
  }

  /**
   * Shows a confirmation dialog with OK and Cancel buttons.
   *
   * This is a convenience method that wraps the static `MessageDialog.confirm()` method.
   * The dialog returns `true` if the user clicks OK, `false` if they click Cancel,
   * or `undefined` if they close the dialog using Escape or backdrop click.
   *
   * **Note:** This method uses the static MessageDialog API and does not return a `MessageDialogRef`.
   * If you need more control over the dialog lifecycle, use `showModal()` instead.
   *
   * Example usage:
   * ```typescript
   * // Simple confirmation
   * const confirmed = await this.messageDialogService.confirm(
   *   'Are you sure you want to proceed?'
   * );
   * if (confirmed) {
   *   // User clicked OK
   *   this.proceedWithAction();
   * }
   *
   * // Confirmation with custom title
   * const result = await this.messageDialogService.confirm(
   *   'This will permanently delete the item.',
   *   'Confirm Deletion'
   * );
   * if (result === true) {
   *   this.deleteItem();
   * } else if (result === false) {
   *   console.log('User clicked Cancel');
   * } else {
   *   console.log('User closed dialog without choosing');
   * }
   * ```
   *
   * @param message - The confirmation message to display
   * @param title - Optional title for the confirmation dialog
   * @returns A promise that resolves with `true` if OK is clicked, `false` if Cancel is clicked, or `undefined` if the dialog is dismissed
   */
  async confirm(message: string, title?: string): Promise<boolean | undefined> {
    return await MessageDialog.confirm(message, title);
  }

  /**
   * Shows a message dialog with custom configuration using the static MessageDialog API.
   *
   * This is a convenience method that wraps the static `MessageDialog.show()` method.
   * It allows you to create custom message dialogs with multiple buttons and custom actions.
   *
   * **Note:** This method uses the static MessageDialog API and does not return a `MessageDialogRef`.
   * If you need more control over the dialog lifecycle or want to use Angular components, use `showModal()` instead.
   *
   * Example usage:
   * ```typescript
   * // Dialog with custom buttons
   * const result = await this.messageDialogService.show({
   *   title: 'Choose an option',
   *   message: 'Please select how you want to proceed.',
   *   buttons: [
   *     { text: 'Cancel', value: 'cancel' },
   *     { text: 'Save Draft', variant: 'default', value: 'draft' },
   *     { text: 'Publish', variant: 'primary', value: 'publish' }
   *   ]
   * });
   *
   * if (result === 'publish') {
   *   this.publishContent();
   * } else if (result === 'draft') {
   *   this.saveDraft();
   * }
   *
   * // Non-cancellable dialog
   * const choice = await this.messageDialogService.show({
   *   title: 'Important Decision',
   *   message: 'You must make a choice to continue.',
   *   buttons: [
   *     { text: 'Option A', value: 'a' },
   *     { text: 'Option B', value: 'b' }
   *   ],
   *   disableCancel: true
   * });
   * ```
   *
   * @template T - The type of the button value returned when a button is clicked
   * @param config - Configuration object for the message dialog
   * @param config.title - The title of the dialog
   * @param config.message - The message to display
   * @param config.buttons - Array of button configurations with text, variant, and value
   * @param config.disableCancel - If true, prevents closing via Escape key or backdrop click
   * @returns A promise that resolves with the value of the clicked button, or `undefined` if the dialog is dismissed
   */
  async show<T = unknown>(config: MessageDialogConfig<T>): Promise<T | undefined> {
    return await MessageDialog.show(config);
  }

  /**
   * Closes all currently opened message dialogs.
   *
   * This method is useful when you need to close multiple message dialogs at once, for example when navigating
   * away from a page or when a critical error occurs that should dismiss all open dialogs.
   *
   * Example usage:
   * ```typescript
   * // Close all dialogs without passing a result
   * messageDialogService.closeAll();
   *
   * // Close all dialogs with a specific result
   * messageDialogService.closeAll('cancelled');
   * ```
   *
   * @param result - Optional result to pass to all dialogs. This value will be emitted to all `afterClosed()` subscribers.
   */
  closeAll(result?: unknown): void {
    const dialogs = [...this.#openedDialogs];

    dialogs.forEach(dialogRef => {
      dialogRef.close(result);
      dialogRef.destroy();
    });
  }

  #createComponent<T, D = unknown>(component: Type<T>, data?: unknown, dialogRef?: MessageDialogRef<D>) {
    // Create providers for MessageDialogRef and DIALOG_DATA
    const providers = [];

    if (dialogRef) {
      providers.push({ provide: MessageDialogRef, useValue: dialogRef });
    }

    if (data !== undefined) {
      providers.push({ provide: 'MESSAGE_DIALOG_DATA', useValue: data });
    }

    const injector =
      providers.length > 0
        ? Injector.create({
            providers,
            parent: this.injector
          })
        : this.injector;

    console.log('providers:', providers);

    const componentRef = createComponent(component, {
      environmentInjector: this.appRef.injector,
      elementInjector: injector
    });

    this.appRef.attachView(componentRef.hostView);

    return componentRef;
  }

  #cleanup<T, R>(
    dialogRef: MessageDialogRef<R>,
    componentRef: ComponentRef<T> | undefined,
    dialog: MessageDialog
  ): void {
    this.ngZone.run(() => {
      const index = this.#openedDialogs.indexOf(dialogRef as MessageDialogRef<unknown>);
      if (index > -1) {
        this.#openedDialogs.splice(index, 1);
      }

      dialogRef.destroy();

      if (componentRef) {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
      }

      dialog.parentNode?.removeChild(dialog);
    });
  }
}
