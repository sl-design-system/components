import { ApplicationRef, ChangeDetectorRef, Injectable, Injector, NgZone, Type, createComponent } from '@angular/core';
import { Dialog } from '@sl-design-system/dialog';
import '@sl-design-system/dialog/register.js';
import { Observable, Subject } from 'rxjs';

/**  Utility type to get all public properties from the Dialog, plus 'component' and 'data' additionally. */
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

  /** Data to pass to the component */
  data?: unknown;
}

/** Helper to assign all config properties to the dialog element */
const applyDialogProps = (dialog: Dialog, config: DialogConfig<unknown>) => {
  Object.keys(config).forEach(key => {
    if (key !== 'component' && key !== 'data' && key in dialog) {
      console.log(`Applying dialog property - ${key} =`, (config as unknown as Record<string, unknown>)[key], config);
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
  /** Dialog element reference */
  dialog: Dialog;

  /** Subject that emits when the dialog closes */
  #afterClosedSubject = new Subject<T | undefined>();

  /** Track if the subject was manually closed with a result */
  #manualClose = false;

  /** Result passed when closing the dialog */
  #result?: T;

  constructor(
    dialog: Dialog,
    private ngZone: NgZone
  ) {
    this.dialog = dialog;

    this.dialog.addEventListener('sl-close', () => {
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
    });
  }

  /** Returns an Observable that emits when the dialog closes */
  afterClosed(): Observable<T | undefined> {
    return this.#afterClosedSubject.asObservable();
  }

  /** Close the dialog with an optional result */
  close(result?: T): void {
    console.log('Closing dialog with result:', result);
    this.#manualClose = true;
    this.#result = result;
    this.dialog.close();
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
    private appRef: ApplicationRef, // TODO: check if we can use EnvironmentInjector instead?
    private injector: Injector,
    private ngZone: NgZone
  ) {}

  // TODO: what to do with public functions from the component? Should we use a wrapper component for the dialog?

  /** Opens a dialog with the given component and configuration */
  showModal<T, R = unknown>(config: DialogConfig<T>): DialogRef<R> {
    const dialogElement = document.createElement('sl-dialog');
    applyDialogProps(dialogElement, config);

    // Create dialog reference with NgZone
    const dialogRef = new DialogRef<R>(dialogElement, this.ngZone);

    this.#openedDialogs.push(dialogRef as DialogRef<unknown>);

    // Create a component and get a reference to its ChangeDetectorRef
    const componentRef = this.#createComponent<T, R>(config.component, config.data, dialogRef),
      hostElement = componentRef.location.nativeElement as HTMLElement,
      componentChangeDetector = componentRef.injector.get(ChangeDetectorRef, null);

    console.log('componentRef.location', componentRef.location);

    document.body.appendChild(dialogElement);

    // Create a temporary container to render the component
    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);
    tempDiv.appendChild(hostElement);

    // Wait for the component to render and move content, outside Angular zone to avoid change detection
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        // Move all child nodes (including slotted and non-slotted) to the dialog
        while (hostElement.firstChild) {
          console.log('hostElement.firstChild', hostElement.firstChild);
          dialogElement.appendChild(hostElement.firstChild);
        }

        // Clean up temporary container
        document.body.removeChild(tempDiv);

        dialogElement.showModal();

        this.ngZone.run(() => {
          if (componentChangeDetector) {
            console.log('componentChangeDetector', componentChangeDetector);
            componentChangeDetector.markForCheck();
          }
        });
      });
    });

    dialogElement.addEventListener('sl-close', () => {
      this.ngZone.run(() => {
        const index = this.#openedDialogs.indexOf(dialogRef as DialogRef<unknown>);
        if (index > -1) {
          this.#openedDialogs.splice(index, 1);
        }

        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
        dialogElement.parentNode?.removeChild(dialogElement);
      });
    });

    console.log('Dialog opened', dialogRef, config.component, config.data);

    return dialogRef;
  }

  /**
   * A method that closes all currently opened dialogs
   * @param result Optional result to pass to all dialogs
   */
  closeAll(result?: unknown): void {
    const dialogs = [...this.#openedDialogs];

    console.log('Closing all dialogs', dialogs.length, dialogs);

    dialogs.forEach(dialogRef => {
      dialogRef.close(result);
    });
  } // TODO: an example of closing all dialogs...

  #createComponent<T, D = unknown>(component: Type<T>, data?: unknown, dialogRef?: DialogRef<D>) {
    // Create providers for DialogRef and DIALOG_DATA
    const providers = [];

    if (dialogRef) {
      providers.push({ provide: DialogRef, useValue: dialogRef });
    }

    if (data !== undefined) {
      providers.push({ provide: 'DIALOG_DATA', useValue: data });
    }

    console.log('providers', providers);

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

    console.log('componentRef', componentRef);

    this.appRef.attachView(componentRef.hostView);

    return componentRef;
  }
}
// TODO: part styling is working without encapsulation, but not with encapsulation. Maybe we should use ::ng-deep for dialog service? Or just `ViewEncapsulation.None` should be enough?
