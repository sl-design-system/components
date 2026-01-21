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

/** Configuration for opening a message dialog with the MessageDialogService. */
export interface MessageDialogServiceConfig<T, R = unknown> extends Partial<MessageDialogProps> {
  /** Component to render in a message dialog. */
  component?: Type<T>;

  /** Data to pass to the component. */
  data?: unknown;

  /** The title of the message dialog. */
  title?: string;

  /** The message to display (for non-component dialogs). */
  message?: string | TemplateResult;

  /** The buttons to display in the message dialog. */
  buttons?: Array<MessageDialogButton<R>>;

  /** Whether to disable cancel (Escape key and backdrop click). */
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
 * Provides methods to close the dialog and observe when it has been closed.
 * Allows passing an optional result value when closing the dialog, which will be emitted to subscribers.
 *
 * Example usage:
 * ```TypeScript
 * const dialogRef = messageDialogService.showModal<MyComponent, MyResultType>({ component: MyComponent, config: { title: 'Title' } });
 * dialogRef.afterClosed().subscribe(result => {
 *   // Handle the result when the dialog closes
 * });
 * dialogRef.close(resultValue);
 * ```
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

  /** Returns an Observable that emits when the dialog closes */
  afterClosed(): Observable<T | undefined> {
    return this.#afterClosedSubject.asObservable();
  }

  /** Close the dialog with an optional result. */
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

  /** A method to clean up the event listeners */
  destroy(): void {
    if (this.#internalDialog) {
      this.#internalDialog.removeEventListener('close', this.#onClose);
    }
    this.dialog.removeEventListener('sl-cancel', this.#onCancel);
  }
}

/**
 * MessageDialogService is a service for opening and managing message dialogs in Angular apps.
 * Provides methods to show message dialogs with custom components, pass data, and handle dialog lifecycle events.
 * Tracks all opened message dialogs and allows closing them programmatically.
 *
 * Example usage:
 * ```TypeScript
 * // Show with custom component
 * const dialogRef = messageDialogService.showModal({
 *   component: MyComponent,
 *   data: { someData: 'value' },
 *   config: {
 *     title: 'My Dialog',
 *     buttons: [
 *       { text: 'Cancel', fill: 'ghost' },
 *       { text: 'OK', variant: 'primary', value: 'ok' }
 *     ]
 *   }
 * });
 *
 * // Show simple alert
 * messageDialogService.alert('This is an alert!', 'Alert Title');
 *
 * // Show confirmation
 * const result = await messageDialogService.confirm('Are you sure?', 'Confirm');
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
   * Opens a message dialog with the given component and configuration.
   * Use this method when you need to render a custom Angular component inside the message dialog.
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
   * Shows an alert message to the user with an OK button by default.
   *
   * @param message - The message to display.
   * @param title - The title of the dialog.
   * @returns A promise that resolves when the dialog is closed.
   */
  async alert(message: string, title?: string): Promise<void> {
    await MessageDialog.alert(message, title);
  }

  /**
   * Shows a confirmation dialog to the user with OK and Cancel buttons by default.
   *
   * Returns a promise that resolves with `true` if the user clicks OK, `false` if the user clicks Cancel, or `undefined` if the user closes the dialog.
   *
   * @param message - The message to display.
   * @param title - The title of the dialog.
   * @returns A promise that resolves with the user's choice.
   */
  async confirm(message: string, title?: string): Promise<boolean | undefined> {
    return await MessageDialog.confirm(message, title);
  }

  /**
   * Shows a message dialog to the user with custom configuration.
   *
   * Returns a promise that resolves with the value of the button that was clicked, or `undefined` if the dialog was closed.
   *
   * @param config - The configuration for the dialog.
   * @returns A promise that resolves with the button value or undefined.
   */
  async show<T = unknown>(config: MessageDialogConfig<T>): Promise<T | undefined> {
    return await MessageDialog.show(config);
  }

  /**
   * A method that closes all currently opened message dialogs
   * @param result Optional result to pass to all dialogs
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
