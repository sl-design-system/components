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
export interface MessageDialogServiceConfig<T> extends Partial<MessageDialogProps> {
  /** Component to render in the message dialog. */
  component?: Type<T>;

  /** Data to pass to the component. */
  data?: unknown;
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
 * Provides methods to control the dialog and observe when it closes.
 * It's returned by `MessageDialogService.showModal()` and allows to:
 * - Close the dialog programmatically with `close()`,
 * - Subscribe to dialog close events with `afterClosed()`,
 * - Pass a result value when closing that will be emitted to subscribers.
 *
 * Example usage:
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
        console.log('internal dialog', this.#internalDialog);
        // Listen to native 'close' event from the internal dialog element
        this.#internalDialog.addEventListener('close', this.#onClose);
      }
    });

    this.dialog.addEventListener('sl-cancel', this.#onCancel);
  }

  /** Returns an Observable that emits when the dialog closes. */
  afterClosed(): Observable<T | undefined> {
    return this.#afterClosedSubject.asObservable();
  }

  /**
   * Closes the dialog with an optional result value.
   * The result value will be emitted to all subscribers of `afterClosed()`.
   * If no result is provided, `undefined` will be emitted.
   */
  close(result?: T): void {
    this.#manualClose = true;
    this.#result = result;
    this.dialog.close();
  }

  /** @internal Set the result value (used internally by the service). */
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
 * MessageDialogService is a service for displaying and managing message dialogs in Angular applications.
 * Provides methods to show message dialogs with custom components or simple messages,
 * pass data, and handle dialog lifecycle events.
 * Supports alert, confirm, and custom button configurations.
 * Tracks all opened dialogs and allows closing them programmatically.
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

  /** Opens a message dialog with the given component or message and configuration. */
  showModal<T, R = unknown>(config: MessageDialogServiceConfig<T>): MessageDialogRef<R> {
    const dialog = document.createElement('sl-message-dialog') as MessageDialog<R>,
      dialogRef = new MessageDialogRef<R>(dialog, this.ngZone);

    let componentRef: ComponentRef<T> | undefined;

    if (config.component) {
      componentRef = this.#createComponent<T, R>(config.component, config.data, dialogRef);
      this.#setupComponentDialog(dialog, dialogRef, componentRef, config);
    } else {
      this.#setupMessageDialog(dialog, dialogRef, config);
    }

    return dialogRef;
  }

  #setupComponentDialog<T, R>(
    dialog: MessageDialog<R>,
    dialogRef: MessageDialogRef<R>,
    componentRef: ComponentRef<T>,
    config: MessageDialogServiceConfig<T>
  ): void {
    const hostElement = componentRef.location.nativeElement as HTMLElement;

    dialog.config = this.#createDialogConfig<R>(config, '', dialogRef);

    applyMessageDialogProps(dialog, config);

    this.#openedDialogs.push(dialogRef as MessageDialogRef<unknown>);

    document.body.appendChild(dialog);

    // Render and show dialog
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        void dialog.updateComplete.then(() => {
          // Move component content into message dialog
          const messageElement = dialog.shadowRoot?.querySelector('p');

          if (messageElement && hostElement.firstChild) {
            messageElement.innerHTML = '';

            while (hostElement.firstChild) {
              messageElement.appendChild(hostElement.firstChild);
            }
          }

          dialog.showModal();

          this.ngZone.run(() => {
            componentRef.injector.get(ChangeDetectorRef, null)?.markForCheck();
          });

          this.#setupCleanupListeners(dialog, dialogRef, componentRef);
        });
      });
    });

    dialog.addEventListener('sl-cancel', () => {
      this.#cleanup(dialogRef, componentRef, dialog);
    });
  }

  #setupMessageDialog<R>(
    dialog: MessageDialog<R>,
    dialogRef: MessageDialogRef<R>,
    config: MessageDialogServiceConfig<unknown>
  ): void {
    const messageConfig = config as { message?: string | TemplateResult };

    dialog.config = this.#createDialogConfig<R>(config, messageConfig.message || '', dialogRef);

    applyMessageDialogProps(dialog, config);

    this.#openedDialogs.push(dialogRef as MessageDialogRef<unknown>);

    document.body.appendChild(dialog);

    this.ngZone.runOutsideAngular(() => {
      void dialog.updateComplete.then(() => {
        dialog.showModal();
        this.#setupCleanupListeners(dialog, dialogRef, undefined);
      });
    });

    dialog.addEventListener('sl-cancel', () => {
      this.#cleanup(dialogRef, undefined, dialog);
    });
  }

  #createDialogConfig<R>(
    config: MessageDialogServiceConfig<unknown>,
    message: string | TemplateResult,
    dialogRef: MessageDialogRef<R>
  ): MessageDialogConfig<R> {
    const { title, buttons, disableCancel } = config as {
      title?: string;
      buttons?: Array<MessageDialogButton<R>>;
      disableCancel?: boolean;
    };

    return {
      title,
      message,
      buttons: buttons?.map(button => ({
        ...button,
        action: () => {
          if (button.value !== undefined) {
            dialogRef.setResult(button.value);
          }
          button.action?.();
        }
      })),
      disableCancel
    };
  }

  #setupCleanupListeners<T, R>(
    dialog: MessageDialog,
    dialogRef: MessageDialogRef<R>,
    componentRef: ComponentRef<T> | undefined
  ): void {
    const internalDialog = dialog.shadowRoot?.querySelector('dialog');

    if (internalDialog) {
      internalDialog.addEventListener('close', () => this.#cleanup(dialogRef, componentRef, dialog), { once: true });
    }
  }

  /**
   * Shows a simple alert message to the user with an `OK` button.
   *
   * This is a method that wraps the static `MessageDialog.alert()` method.
   * The dialog will automatically close when the user clicks OK or presses Escape.
   *
   * This method uses the static MessageDialog API and does not return a `MessageDialogRef`.
   * If you need more control over the dialog lifecycle, use `showModal()` instead.
   */
  async alert(message: string, title?: string): Promise<void> {
    await MessageDialog.alert(message, title);
  }

  /**
   * Shows a confirmation dialog with `OK` and `Cancel` buttons.
   *
   * This is a method that wraps the static `MessageDialog.confirm()` method.
   * The dialog returns `true` if the user clicks OK, `false` if they click Cancel,
   * or `undefined` if they close the dialog using Escape or backdrop click.
   *
   * This method uses the static MessageDialog API and does not return a `MessageDialogRef`.
   * If you need more control over the dialog lifecycle, use `showModal()` instead.
   */
  async confirm(message: string, title?: string): Promise<boolean | undefined> {
    return await MessageDialog.confirm(message, title);
  }

  /**
   * Shows a message dialog with custom configuration using the static MessageDialog API.
   *
   * This is a method that wraps the static `MessageDialog.show()` method.
   * It allows you to create custom message dialogs with multiple buttons and custom actions.
   *
   * This method uses the static MessageDialog API and does not return a `MessageDialogRef`.
   * If you need more control over the dialog lifecycle or want to use Angular components, use `showModal()` instead.
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
   * Example:
   * ```typescript
   * // Close all dialogs without passing a result
   * messageDialogService.closeAll();
   *
   * // Close all dialogs with a specific result
   * messageDialogService.closeAll('cancelled');
   * ```
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
