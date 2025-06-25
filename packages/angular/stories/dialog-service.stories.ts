import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  type AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  type ValidationErrors
} from '@angular/forms';
import { provideRouter, withHashLocation } from '@angular/router';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/text-area/register.js';
import '@sl-design-system/text-field/register.js';
import { type Meta, StoryFn, applicationConfig, moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../src/button/button.component';
import { DialogComponent } from '../src/dialog/dialog.component';
import { FormFieldComponent } from '../src/form/form-field.component';
import { FormComponent } from '../src/form/form.component';
import { TextAreaDirective } from '../src/forms/text-area.directive';
import { TextFieldDirective } from '../src/forms/text-field.directive';
import { DialogRef, DialogService } from '../src/services/dialog.service';
import { TextAreaComponent } from '../src/text-area/text-area.component';
import { TextFieldComponent } from '../src/text-field/text-field.component';

@Component({
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <span slot="title">{{ data.title }}</span>
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
    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
      <sl-button (click)="openBasicDialog()">Open dialog</sl-button>
      <sl-button (click)="openNonCancelableDialog()">Open dialog without close button</sl-button>
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

  openNonCancelableDialog(): void {
    const dialogRef = this.dialogService.showModal<ExampleDialogComponent, string>({
      component: ExampleDialogComponent,
      data: {
        title: 'Non-cancelable dialog title',
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
    CommonModule,
    ButtonComponent,
    FormComponent,
    FormFieldComponent,
    FormsModule,
    TextFieldComponent,
    TextAreaComponent,
    ReactiveFormsModule,
    TextAreaDirective,
    TextFieldDirective
  ],
  template: `
    <span slot="title">{{ data.title }}</span>
    <span>{{ data.details }}</span>

<!--    <div>This is a text field which is not wrapped by a form-field</div>
    <sl-text-field></sl-text-field>-->

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
    @Inject('DIALOG_DATA') public data: { title: string; details: string },
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild('form') form!: FormComponent;

  // showValidity = false;

  customUsernameValidator = (control: AbstractControl): ValidationErrors | null => {
    return control.touched && control.value !== 'admin' ? { invalidUsername: true } : null;
  };

  formGroup = new FormGroup({
    textField: new FormControl(''),
    textArea: new FormControl('')
  });

  submitForm() {
    console.log(
      'Submitting form...',
      this.formGroup.invalid,
      this.formGroup.valid,
      this.form.valid,
      this.form,
      this.form.el.valid
    );

    if (!this.form.el.valid) {
      this.form.el.reportValidity();
      // this.showValidity = this.form.el.showValidity;
    } else {
      console.log(
        'Dialog closed with result:',
        this.formGroup.controls.textField.value,
        this.formGroup.controls.textArea,
        this.form
      );
      this.dialogRef.close(this.formGroup);
    }

    console.log('Form values:', this.formGroup, this.formGroup.invalid);
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
<!--    <div>{{ formResult.textField | json }}</div>
    <div>{{ formResult.textArea | json }}</div>-->
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
      },
      closeButton: true
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
  title: 'Dialog Service',
  decorators: [
    applicationConfig({
      providers: [DialogService, provideRouter([], withHashLocation())]
    }),
    moduleMetadata({
      imports: [
        DialogComponent,
        ButtonComponent,
        CommonModule,
        DialogServiceExampleComponent,
        ExampleDialogComponent,
        DialogFormExampleComponent,
        DialogFormComponent,
        DialogFormExampleComponent,
        FormComponent,
        FormFieldComponent,
        FormsModule,
        TextFieldComponent,
        TextAreaComponent,
        ReactiveFormsModule,
        TextAreaDirective,
        TextFieldDirective
      ]
    })
  ]
} as Meta;

export const DialogServiceExample: StoryFn = () => ({
  template: '<sla-dialog-service></sla-dialog-service>'
});

export const FormInDialogExample: StoryFn = () => ({
  template: '<sla-dialog-form-example></sla-dialog-form-example>'
});

// TODO: mobile example? with mobile1 viewport?
