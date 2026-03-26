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
    'This example demonstrates using the <strong>DialogService</strong> to programmatically open and manage dialogs in Angular applications. The service works with any Angular component as dialog content.<br/><br/>The dialog component receives data through @Inject(DIALOG_DATA), allowing you to pass configuration and content to your dialogs. Use DialogRef to control the dialog and return results when closing.<br/><br/>This example shows basic dialogs with and without close buttons. See the next example for implementing forms inside dialogs.',
  template: '<sla-dialog-service></sla-dialog-service>'
});

export const FormInDialogExample: StoryFn = () => ({
  description: 'This example demonstrates how to use a form inside a dialog opened with the DialogService.',
  template: '<sla-dialog-form-example></sla-dialog-form-example>'
});
