import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter, withHashLocation } from '@angular/router';
import { DialogRef, DialogService } from '@sl-design-system/angular';
import { ButtonComponent } from '@sl-design-system/angular/button';
import { DialogComponent } from '@sl-design-system/angular/dialog';
import { FormComponent, FormFieldComponent } from '@sl-design-system/angular/form';
import { TextAreaDirective, TextFieldDirective } from '@sl-design-system/angular/forms';
import { TextAreaComponent } from '@sl-design-system/angular/text-area';
import { TextFieldComponent } from '@sl-design-system/angular/text-field';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/text-area/register.js';
import '@sl-design-system/text-field/register.js';
import { type Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular';

@Component({
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  template: `
    <style>
      h2 {
        font-size: inherit;
        font-weight: inherit;
        margin: 0;
      }
    </style>
    <h2 slot="title">{{ data.title }}</h2>
    <p>{{ data.message }}</p>
    <div>Example content.</div>
    <sl-button (click)="dialogRef.close('cancelled')" slot="primary-actions">Cancel</sl-button>
    <sl-button (click)="dialogRef.close('confirmed')" slot="primary-actions" variant="primary">Confirm</sl-button>
  `
})
export class ExampleDialogComponent {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject('DIALOG_DATA') public data: { title: string; message: string }
  ) {}
}

@Component({
  selector: 'sla-dialog-service',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  template: `
    <h3>Dialog Service examples</h3>
    <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
      <sl-button (click)="openBasicDialog()">Open dialog</sl-button>
      <sl-button (click)="openNonCancellableDialog()">Open dialog without close button</sl-button>
    </div>
  `
})
export class DialogServiceExampleComponent {
  lastResult: string | undefined;

  constructor(private dialogService: DialogService) {}

  openBasicDialog(): void {
    const dialogRef = this.dialogService.showModal<ExampleDialogComponent, string>({
      component: ExampleDialogComponent,
      data: {
        title: 'Dialog title',
        message: 'This is a dialog with close button.'
      },
      closeButton: true
    });

    dialogRef.afterClosed().subscribe((result: string | undefined) => {
      this.lastResult = result;
      console.log('Dialog closed with result:', result);
    });
  }

  openNonCancellableDialog(): void {
    const dialogRef = this.dialogService.showModal<ExampleDialogComponent, string>({
      component: ExampleDialogComponent,
      data: {
        title: 'Non-cancellable dialog title',
        message: 'This dialog cannot be closed by clicking the backdrop or pressing Escape.'
      },
      disableCancel: true,
      closeButton: false
    });

    dialogRef.afterClosed().subscribe(result => {
      this.lastResult = result;
      console.log('Dialog closed with result:', result);
    });
  }
}

@Component({
  selector: 'sla-dialog-form',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    ButtonComponent,
    CommonModule,
    FormComponent,
    FormFieldComponent,
    FormsModule,
    ReactiveFormsModule,
    TextAreaComponent,
    TextAreaDirective,
    TextFieldComponent,
    TextFieldDirective
  ],
  template: `
    <style>
      h2 {
        font-size: inherit;
        font-weight: inherit;
        margin: 0;
      }
    </style>
    <h2 slot="title">{{ data.title }}</h2>
    <span>{{ data.details }}</span>
    <sl-form #form>
      <sl-form-field label="Text field">
        <sl-text-field [(ngModel)]="formGroup.textField" required></sl-text-field>
      </sl-form-field>
      <sl-form-field label="Text area">
        <sl-text-area [(ngModel)]="formGroup.textArea"></sl-text-area>
      </sl-form-field>
    </sl-form>
    <sl-button slot="primary-actions" (click)="dialogRef.close()">Cancel</sl-button>
    <sl-button slot="primary-actions" variant="primary" (click)="submitForm()">Save</sl-button>
  `,
  styles: [
    `
      sl-form {
        padding-block: var(--sl-size-100);
      }

      sl-dialog::part(body) {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
    `
  ]
})
export class DialogFormComponent {
  constructor(
    public dialogRef: DialogRef,
    @Inject('DIALOG_DATA') public data: { title: string; details: string }
  ) {}

  @ViewChild('form') form!: FormComponent;

  formGroup = new FormGroup({
    textField: new FormControl(''),
    textArea: new FormControl('')
  });

  submitForm() {
    if (!this.form.el.valid) {
      this.form.el.reportValidity();
    } else {
      this.dialogRef.close(this.formGroup);
    }
  }
}

interface DialogFormResult {
  textField: string;
  textArea: string;
}

@Component({
  selector: 'sla-dialog-form-example',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <h3>Dialog Service with form example</h3>
    <p>Open a dialog with a form inside using the DialogService.</p>
    <sl-button (click)="openFormDialog()">Open Form Dialog</sl-button>
  `
})
export class DialogFormExampleComponent {
  formResult: DialogFormResult = {
    textField: '',
    textArea: ''
  };

  constructor(public dialogService: DialogService) {}

  openFormDialog(): void {
    const dialogRef = this.dialogService.showModal<DialogFormComponent, DialogFormResult>({
      component: DialogFormComponent,
      data: {
        title: 'Form in a dialog',
        details: 'This is a short description of the form dialog.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Form dialog closed with result:', result);
        this.formResult = result;
      }
    });
  }
}

export default {
  title: 'Components/Dialog Service',
  tags: ['draft'],
  decorators: [
    applicationConfig({
      providers: [DialogService, provideRouter([], withHashLocation())]
    }),
    moduleMetadata({
      imports: [
        ButtonComponent,
        CommonModule,
        DialogComponent,
        DialogFormComponent,
        DialogFormExampleComponent,
        DialogServiceExampleComponent,
        ExampleDialogComponent,
        FormComponent,
        FormFieldComponent,
        FormsModule,
        ReactiveFormsModule,
        TextAreaComponent,
        TextAreaDirective,
        TextFieldComponent,
        TextFieldDirective
      ]
    })
  ]
} as Meta;

export const DialogServiceExample: StoryFn = () => ({
  description:
    '<p>The <strong>DialogService</strong> provides a way to programmatically open and manage dialogs in Angular applications.</p>' +
    '<h4>Key Features:</h4>' +
    '<ul>' +
    '<li><strong>showModal()</strong> - Opens a dialog with a custom Angular component</li>' +
    '<li><strong>closeAll()</strong> - Closes all currently open dialogs</li>' +
    '<li><strong>DialogRef</strong> - Handle to control individual dialogs and observe when they close</li>' +
    "<li><strong>Data injection</strong> - Pass data to dialog components using <code>@Inject('DIALOG_DATA')</code></li>" +
    '</ul>' +
    '<h4>DialogService Methods:</h4>' +
    '<p><strong>showModal&lt;T, R&gt;(config: DialogConfig&lt;T&gt;): DialogRef&lt;R&gt;</strong></p>' +
    '<p>Opens a dialog with the specified component and configuration. Returns a <code>DialogRef</code> that can be used to interact with the dialog.</p>' +
    '<p><strong>Parameters:</strong></p>' +
    '<ul>' +
    '<li><code>config.component</code> - The Angular component to render in the dialog</li>' +
    "<li><code>config.data</code> - Optional data to pass to the component (accessible via <code>@Inject('DIALOG_DATA')</code>)</li>" +
    '<li><code>config.closeButton</code> - Whether to show a close button (default: false)</li>' +
    '<li><code>config.disableCancel</code> - If true, prevents closing via Escape key or backdrop click (default: false)</li>' +
    '</ul>' +
    '<p><strong>closeAll(result?: unknown): void</strong></p>' +
    '<p>Closes all currently opened dialogs. Optionally pass a result value that will be emitted to all <code>afterClosed()</code> subscribers.</p>' +
    '<p><strong>Example:</strong></p>' +
    "<pre><code>// Close all dialogs without a result\nthis.dialogService.closeAll();\n\n// Close all with a specific result\nthis.dialogService.closeAll('cancelled');</code></pre>" +
    '<h4>DialogRef API:</h4>' +
    '<p>The <code>DialogRef</code> returned by <code>showModal()</code> provides methods to control the dialog:</p>' +
    '<ul>' +
    '<li><strong>afterClosed(): Observable&lt;R | undefined&gt;</strong> - Returns an Observable that emits when the dialog closes with the result value</li>' +
    '<li><strong>close(result?: R): void</strong> - Closes the dialog with an optional result value</li>' +
    '</ul>' +
    '<h4>Passing Data to Dialog Components:</h4>' +
    "<p>Use <code>@Inject('DIALOG_DATA')</code> in your component constructor to receive data passed via the <code>data</code> property:</p>" +
    "<pre><code>constructor(\n  public dialogRef: DialogRef&lt;string&gt;,\n  @Inject('DIALOG_DATA') public data: { title: string; message: string }\n) {}</code></pre>" +
    '<h4>Usage Examples:</h4>' +
    '<p>See the examples below for basic dialogs and non-cancellable dialogs. The next example shows how to use forms inside dialogs.</p>',
  template: '<sla-dialog-service></sla-dialog-service>'
});

export const FormInDialogExample: StoryFn = () => ({
  description:
    '<p>This example demonstrates how to use a form inside a dialog opened with the DialogService.</p>' +
    '<h4>Key Points:</h4>' +
    '<ul>' +
    '<li>Use <code>@ViewChild</code> to access the form component</li>' +
    '<li>Call <code>form.el.reportValidity()</code> to trigger validation messages</li>' +
    '<li>Close the dialog with form data using <code>dialogRef.close(data)</code></li>' +
    '<li>Handle the result in <code>afterClosed()</code> subscription</li>' +
    '</ul>' +
    '<h4>Form Validation:</h4>' +
    '<p>Before closing the dialog, check if the form is valid:</p>' +
    '<pre><code>if (!this.form.el.valid) {\n  this.form.el.reportValidity();\n} else {\n  this.dialogRef.close(this.formData);\n}</code></pre>' +
    '<h4>Styling Dialog Content:</h4>' +
    '<p>You can style dialog parts using <code>::part()</code> selectors:</p>' +
    '<pre><code>sl-dialog::part(body) {\n  display: flex;\n  flex-direction: column;\n  gap: 0.2rem;\n}</code></pre>' +
    '<p><strong>Note:</strong> Use <code>ViewEncapsulation.None</code> in the component to allow styling web component parts.</p>',
  template: '<sla-dialog-form-example></sla-dialog-form-example>'
});
