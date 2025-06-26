import { ApplicationRef, ChangeDetectorRef, Injectable, Injector, NgZone, Type, createComponent } from '@angular/core';
import { Dialog } from '@sl-design-system/dialog';
import '@sl-design-system/dialog/register.js';
import { Observable, Subject } from 'rxjs';

/**  Utility type to get all public properties from the Dialog, plus 'component' and 'data' properties additionally. */
type DialogProps = Omit<
  {
    [K in keyof Dialog as Dialog[K] extends (...args: unknown[]) => unknown ? never : K]: Dialog[K];
  },
  'component' | 'data'
>;

/** Configuration for opening a dialog with the DialogService. */
export interface DialogConfig<T> extends Partial<DialogProps> {
  /** Component to render in a dialog. */
  component: Type<T>;

  /** Data to pass to the component. */
  data?: unknown;
}

/** Helper to assign all config properties to the dialog element */
const applyDialogProps = (dialog: Dialog, config: DialogConfig<unknown>): void => {
  Object.keys(config).forEach(key => {
    if (key !== 'component' && key !== 'data' && key in dialog) {
      (dialog as unknown as Record<string, unknown>)[key] = (config as unknown as Record<string, unknown>)[key];
    }
  });
};

/**
 * DialogRef is a handle for interacting with an opened dialog instance.
 *
 * Provides methods to close the dialog and observe when it has been closed.
 * Allows passing an optional result value when closing the dialog, which will be emitted to subscribers.
 *
 * Example usage:
 * ```TypeScript
 * const dialogRef = dialogService.showModal<MyComponent, MyResultType>({ component: MyComponent });
 * dialogRef.afterClosed().subscribe(result => {
 *   // Handle the result when the dialog closes
 * });
 * dialogRef.close(resultValue);
 * ```
 */
export class DialogRef<T = unknown> {
  /** Dialog element reference. */
  dialog: Dialog;

  /** Subject that emits when the dialog closes. */
  #afterClosedSubject = new Subject<T | undefined>();

  /** Track if the subject (dialog) was manually closed with a result. */
  #manualClose = false;

  /** Result passed when closing the dialog. */
  #result?: T;

  #slCloseHandler: () => void;

  constructor(
    dialog: Dialog,
    private ngZone: NgZone
  ) {
    this.dialog = dialog;

    this.#slCloseHandler = () => {
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

    this.dialog.addEventListener('sl-close', this.#slCloseHandler);
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

  /** A method to clean up the event listener */
  destroy(): void {
    this.dialog.removeEventListener('sl-close', this.#slCloseHandler);
  }
}

/**
 * DialogService is a service for opening and managing dialogs in Angular apps.
 * Provides methods to show dialogs with custom components, pass data, and handle dialog lifecycle events.
 * Tracks all opened dialogs and allows closing them programmatically.
 */
@Injectable({
  providedIn: 'root'
})
export class DialogService {
  /** Track all opened dialog references, can be used to close all dialogs. */
  #openedDialogs: Array<DialogRef<unknown>> = [];

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private ngZone: NgZone
  ) {}

  /** Opens a dialog with the given component and configuration */
  showModal<T, R = unknown>(config: DialogConfig<T>): DialogRef<R> {
    const dialog = document.createElement('sl-dialog');
    applyDialogProps(dialog, config);

    const dialogRef = new DialogRef<R>(dialog, this.ngZone);

    this.#openedDialogs.push(dialogRef as DialogRef<unknown>);

    // Create a component and get a reference to its ChangeDetectorRef
    const componentRef = this.#createComponent<T, R>(config.component, config.data, dialogRef),
      hostElement = componentRef.location.nativeElement as HTMLElement,
      componentChangeDetector = componentRef.injector.get(ChangeDetectorRef, null);

    document.body.appendChild(dialog);

    // Create a temporary container to render the component
    const temporaryContainer = document.createElement('div');
    document.body.appendChild(temporaryContainer);
    temporaryContainer.appendChild(hostElement);

    // Wait for the component to render and move content, outside Angular zone to avoid change detection
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        // Move all child nodes (including slotted and non-slotted) to the dialog
        while (hostElement.firstChild) {
          dialog.appendChild(hostElement.firstChild);
        }

        // Clean up temporary container
        document.body.removeChild(temporaryContainer);

        dialog.showModal();

        this.ngZone.run(() => {
          if (componentChangeDetector) {
            componentChangeDetector.markForCheck();
          }
        });
      });
    });

    dialog.addEventListener('sl-close', () => {
      this.ngZone.run(() => {
        const index = this.#openedDialogs.indexOf(dialogRef as DialogRef<unknown>);
        if (index > -1) {
          this.#openedDialogs.splice(index, 1);
        }

        dialogRef.destroy();

        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
        dialog.parentNode?.removeChild(dialog);
      });
    });

    return dialogRef;
  }

  /**
   * A method that closes all currently opened dialogs
   * @param result Optional result to pass to all dialogs
   */
  closeAll(result?: unknown): void {
    const dialogs = [...this.#openedDialogs];

    dialogs.forEach(dialogRef => {
      dialogRef.close(result);
      dialogRef.destroy();
    });
  }

  #createComponent<T, D = unknown>(component: Type<T>, data?: unknown, dialogRef?: DialogRef<D>) {
    // Create providers for DialogRef and DIALOG_DATA
    const providers = [];

    if (dialogRef) {
      providers.push({ provide: DialogRef, useValue: dialogRef });
    }

    if (data !== undefined) {
      providers.push({ provide: 'DIALOG_DATA', useValue: data });
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
}
