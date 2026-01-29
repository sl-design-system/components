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

/** Base configuration shared by both message dialog types. */
interface MessageDialogServiceConfigBase<R = unknown> {
  /** The message dialog title. */
  title?: string;

  /** Array of button configurations. */
  buttons?: Array<MessageDialogButton<R>>;

  /** Set to true to prevent closing with Escape or clicking outside. */
  disableCancel?: boolean;
}

/** Configuration for a message dialog with an Angular component. */
export interface MessageDialogServiceComponentConfig<T, R = unknown> extends MessageDialogServiceConfigBase<R> {
  /** The component to show. */
  component: Type<T>;

  /** Data to pass to the component. Access with @Inject('MESSAGE_DIALOG_DATA'). */
  data?: unknown;
}

/** Configuration for a message dialog with a text message. */
export interface MessageDialogServiceMessageConfig<R = unknown> extends MessageDialogServiceConfigBase<R> {
  /** The message to show. */
  message: string | TemplateResult;
}

/**
 * Configuration for opening a message dialog.
 * You must provide either `component` or `message`.
 */
export type MessageDialogServiceConfig<T = unknown, R = unknown> =
  | MessageDialogServiceComponentConfig<T, R>
  | MessageDialogServiceMessageConfig<R>;

/**
 * MessageDialogRef is a handle for controlling an open message dialog.
 *
 * Use it to close the dialog and get notified when it closes.
 *
 * Example:
 * ```typescript
 * const dialogRef = this.messageDialogService.showModal({
 *   component: MyComponent,
 *   title: 'Edit User'
 * });
 *
 * // Get notified when the dialog closes
 * dialogRef.afterClosed().subscribe(result => {
 *   if (result === 'save') {
 *     console.log('User saved');
 *   }
 * });
 *
 * // Close after 5 seconds
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

  /** Message dialog element reference. */
  dialog: MessageDialog;

  constructor(
    dialog: MessageDialog,
    private ngZone: NgZone
  ) {
    this.dialog = dialog;
  }

  /** Returns an Observable that emits when the dialog closes. */
  afterClosed(): Observable<T | undefined> {
    return this.#afterClosedSubject.asObservable();
  }

  /**
   * Closes the dialog. You can pass a value to send to subscribers.
   */
  close(result?: T): void {
    this.#manualClose = true;
    this.#result = result;

    // Wait for the dialog to be ready before closing it
    void this.dialog.updateComplete.then(() => {
      this.dialog.close();
    });
  }

  /** @internal Set the result value. */
  setResult(result: T): void {
    this.#manualClose = true;
    this.#result = result;
  }

  /**
   * @internal
   * Send the result to subscribers after the dialog closes.
   */
  emitClose(): void {
    this.ngZone.run(() => {
      if (this.#manualClose) {
        this.#afterClosedSubject.next(this.#result);
      } else {
        this.#afterClosedSubject.next(undefined);
      }
      this.#afterClosedSubject.complete();
    });
  }

  /**
   * @internal
   * Send undefined to subscribers when the dialog is cancelled.
   */
  emitCancel(): void {
    this.ngZone.run(() => {
      this.#afterClosedSubject.next(undefined);
      this.#afterClosedSubject.complete();
    });
  }
}

/**
 * Service for showing message dialogs.
 *
 * Use it to show message dialogs with custom components or simple messages.
 * You can pass data, handle when dialogs close, and use custom buttons.
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
   * Opens a message dialog.
   *
   * @param config - Message dialog configuration
   * @returns A MessageDialogRef to control the dialog
   */
  showModal<T, R>(config: MessageDialogServiceConfig<T, R>): MessageDialogRef<R> {
    const dialog = document.createElement('sl-message-dialog') as MessageDialog<R>,
      dialogRef = new MessageDialogRef<R>(dialog, this.ngZone);

    let componentRef: ComponentRef<T> | undefined;

    if ('component' in config) {
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
    config: MessageDialogServiceComponentConfig<T, R>
  ): void {
    const hostElement = componentRef.location.nativeElement as HTMLElement;

    // Create the dialog config - pass button values but don't use them to set result
    dialog.config = this.#createDialogConfig<R>(config, '', dialogRef, false);

    this.#openedDialogs.push(dialogRef as MessageDialogRef<unknown>);

    document.body.appendChild(dialog);

    // Render and show dialog
    this.ngZone.runOutsideAngular(() => {
      void dialog.updateComplete.then(() => {
        // Move component content into the message dialog
        // MessageDialog renders the message inside a <p> element by default.
        // We replace it with a <div> to avoid invalid HTML when the component contains block-level elements.
        const messageElement = dialog.shadowRoot?.querySelector('p');

        if (messageElement && hostElement.firstChild) {
          const container = document.createElement('div');
          while (hostElement.firstChild) {
            container.appendChild(hostElement.firstChild);
          }
          messageElement.replaceWith(container);
        }

        // Set up button click listeners to capture result
        this.#setupButtonClickListeners(dialog, dialogRef, config);

        dialog.showModal();

        this.ngZone.run(() => {
          componentRef.injector.get(ChangeDetectorRef, null)?.markForCheck();
        });

        this.#setupCleanupListeners(dialog, dialogRef, componentRef);
      });
    });
  }

  #setupMessageDialog<R>(
    dialog: MessageDialog<R>,
    dialogRef: MessageDialogRef<R>,
    config: MessageDialogServiceMessageConfig<R>
  ): void {
    // Create the dialog config - pass button values but don't use them to set result
    dialog.config = this.#createDialogConfig<R>(config, config.message, dialogRef, false);

    this.#openedDialogs.push(dialogRef as MessageDialogRef<unknown>);

    document.body.appendChild(dialog);

    this.ngZone.runOutsideAngular(() => {
      void dialog.updateComplete.then(() => {
        // Set up button click listeners to capture result
        this.#setupButtonClickListeners(dialog, dialogRef, config);

        dialog.showModal();
        this.#setupCleanupListeners(dialog, dialogRef, undefined);
      });
    });
  }

  /**
   * Set up click listeners on buttons to capture the result before the dialog closes.
   */
  #setupButtonClickListeners<R>(
    dialog: MessageDialog<R>,
    dialogRef: MessageDialogRef<R>,
    config: MessageDialogServiceConfigBase<R>
  ): void {
    const buttons = dialog.shadowRoot?.querySelectorAll('sl-button'),
      configButtons = config.buttons;

    if (buttons && configButtons) {
      buttons.forEach((buttonElement, index) => {
        const configButton = configButtons[index];

        if (configButton && configButton.value !== undefined) {
          buttonElement.addEventListener(
            'click',
            () => {
              dialogRef.setResult(configButton.value as R);
            },
            { once: true, capture: true }
          );
        }
      });
    }
  }

  #createDialogConfig<R>(
    config: MessageDialogServiceConfigBase<R>,
    message: string | TemplateResult,
    dialogRef: MessageDialogRef<R>,
    includeValueInAction = true
  ): MessageDialogConfig<R> {
    const { title, buttons, disableCancel } = config;

    return {
      title,
      message,
      buttons: buttons?.map(button => ({
        ...button,
        action: () => {
          // Only set result in action if explicitly requested
          if (includeValueInAction && button.value !== undefined) {
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
      internalDialog.addEventListener(
        'close',
        async () => {
          // Wait until all animations have finished before cleaning up
          await Promise.allSettled(internalDialog.getAnimations({ subtree: true }).map(a => a.finished));

          // Emit the result to subscribers
          dialogRef.emitClose();

          // Clean up after animations complete
          this.#cleanup(dialogRef, componentRef, dialog);
        },
        { once: true }
      );
    }

    dialog.addEventListener(
      'sl-cancel',
      async () => {
        // Wait until all animations have finished before emitting cancel
        const internalDialogElement = dialog.shadowRoot?.querySelector('dialog');
        if (internalDialogElement) {
          await Promise.allSettled(internalDialogElement.getAnimations({ subtree: true }).map(a => a.finished));
        }

        dialogRef.emitCancel();
      },
      { once: true }
    );
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
   * This method can be useful when you need to close multiple message dialogs at once.
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
    });
  }

  #createComponent<T, D = unknown>(component: Type<T>, data?: unknown, dialogRef?: MessageDialogRef<D>) {
    // Create providers for MessageDialogRef and MESSAGE_DIALOG_DATA
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

      // If dialog is not in the list, it's already been cleaned up
      if (index === -1) {
        return;
      }

      // Remove from opened dialogs list
      this.#openedDialogs.splice(index, 1);

      // Clean up component if it exists
      if (componentRef) {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
      }

      // Remove dialog from DOM if it's still there
      if (dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
      }
    });
  }
}
