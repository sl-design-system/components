import { ApplicationRef, ChangeDetectorRef, Injectable, Injector, NgZone, Type, createComponent } from '@angular/core';
import { Dialog } from '@sl-design-system/dialog';
import '@sl-design-system/dialog/register.js';
import { Observable, Subject } from 'rxjs';

/**
 * Configuration for opening a dialog with the DialogService.
 */
export interface DialogConfig<T> {
  /** Component to render in a dialog. */
  component: Type<T>;

  /** Data to pass to the component */
  data?: unknown;

  /** Whether to show a close button in the dialog header */
  closeButton?: boolean;

  /** Dialog role (default: 'dialog') */
  dialogRole?: 'dialog' | 'alertdialog';

  /** Whether to disable cancellation of the dialog */
  disableCancel?: boolean;
} // TODO: maybe some properties in the DialogConfig should be automatically generated from the Dialog component (like component wrappers)? (except component and data?)

export class DialogRef<T = unknown> {
  /** Dialog element reference */
  dialogElement: Dialog;

  /** Subject that emits when the dialog closes */
  #afterClosedSubject = new Subject<T | undefined>();

  /** Track if the subject was manually closed with a result */
  #manualClose = false;

  /** Result passed when closing the dialog */
  #result?: T;

  constructor(
    dialogElement: Dialog,
    private ngZone: NgZone
  ) {
    this.dialogElement = dialogElement;

    this.dialogElement.addEventListener('sl-close', () => {
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
    this.#manualClose = true;
    this.#result = result;
    this.dialogElement.close();
  }
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  /** Track all open dialog references, can be used to close all dilogs. */
  #openDialogs: DialogRef<unknown>[] = [];

  constructor(
    private appRef: ApplicationRef, // TODO: check if we can use EnvironmentInjector instead?
    private injector: Injector,
    private ngZone: NgZone
  ) {}

  /**
   * Opens a dialog with the given component and configuration
   */
  showModal<T, R = unknown>(config: DialogConfig<T>): DialogRef<R> {
    const dialogElement = document.createElement('sl-dialog');

    // Keep the dialog completely hidden until fully ready
    dialogElement.style.visibility = 'hidden';
    dialogElement.style.opacity = '0';
    dialogElement.style.transition = 'none';

    if (config.closeButton !== undefined) dialogElement.closeButton = config.closeButton;
    if (config.dialogRole) dialogElement.dialogRole = config.dialogRole;
    if (config.disableCancel !== undefined) dialogElement.disableCancel = config.disableCancel;

    // Create dialog reference with NgZone
    const dialogRef = new DialogRef<R>(dialogElement, this.ngZone);

    this.#openDialogs.push(dialogRef as DialogRef<unknown>);

    // Create a component and get a reference to its ChangeDetectorRef
    const componentRef = this.#createComponent<T, R>(config.component, config.data, dialogRef);
    const hostElement = componentRef.location.nativeElement as HTMLElement;
    const componentChangeDetector = componentRef.injector.get(ChangeDetectorRef, null);

    console.log('componentRef.location', componentRef.location);

    // Add dialog to the DOM first, while hidden
    document.body.appendChild(dialogElement);
    dialogElement.inert = false;

    // Create a temporary container to render the component
    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);
    tempDiv.appendChild(hostElement);

    // Wait for the component to render and move content, outside Angular zone to avoid change detection
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        // Move all child nodes (including slotted and non-slotted) to the dialog
        // TODO: bug here in the console?
        while (hostElement.firstChild) { // TODO: partially working... not working when text-field is not wrapper in form-field for example
          console.log('hostElement.firstChild', hostElement.firstChild);

          dialogElement.appendChild(hostElement.firstChild);
        }

        // Move all slotted elements
        const slottedElements = hostElement.querySelectorAll('[slot]');
        slottedElements.forEach((element: Element) => dialogElement.appendChild(element));

        console.log('Slotted elements:', slottedElements);

        // Move non-slotted elements
        const nonSlottedElements = Array.from(hostElement.childNodes).filter(
          (node): node is ChildNode => !(node instanceof Element) || !node.hasAttribute('slot')
        );

        nonSlottedElements.forEach(node => dialogElement.appendChild(node));

        // Clean up temporary container
        document.body.removeChild(tempDiv);

        dialogElement.getBoundingClientRect();

        // Call showModal while still invisible to position the dialog
        dialogElement.showModal();

        // Force another layout calculation after showModal
        dialogElement.getBoundingClientRect();

        // Wait for the next animation frame to ensure the dialog is positioned
      //  requestAnimationFrame(() => {
          dialogElement.style.transition = 'opacity 0.15s ease';

          // Small additional delay to ensure all internal dialog positioning is complete
         // setTimeout(() => {
            dialogElement.style.visibility = 'visible';
            dialogElement.style.opacity = '1';

            this.ngZone.run(() => {
              if (componentChangeDetector) {
                console.log('componentChangeDetector', componentChangeDetector);
                componentChangeDetector.markForCheck();
              }
            });
         // }, 50);
       // });
      });
    });

    dialogElement.addEventListener('sl-close', () => {
      this.ngZone.run(() => {
        const index = this.#openDialogs.indexOf(dialogRef as DialogRef<unknown>);
        if (index > -1) {
          this.#openDialogs.splice(index, 1);
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
   * A method that closes all currently open dialogs
   * @param result Optional result to pass to all dialogs
   */
  closeAll(result?: unknown): void {
    const dialogs = [...this.#openDialogs];

    console.log('Closing all dialogs', dialogs.length, dialogs);

    dialogs.forEach(dialogRef => {
      dialogRef.close(result);
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

// TODO: dialog mobile still have close button? should not?
// TODO: check whether styling eg part="dialog" max-inline-size will work with the dialog service? if not, improve it...
