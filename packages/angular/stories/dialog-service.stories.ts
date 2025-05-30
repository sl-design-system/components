import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/text-field/register.js';
import '@sl-design-system/text-area/register.js';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ChangeDetectorRef, ElementRef, Inject, ViewChild } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <span slot="title">{{ data.title }}</span>
    <p>{{ data.message }}</p>
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
    <span slot="title">{{ data?.title || 'User Information' }}</span>
    <span slot="subtitle">{{ data?.subtitle || 'Please fill in your details' }}</span>

    <sl-form #form>
      <sl-form-field label="Text field">
        <sl-text-field [(ngModel)]="formGroup.textField" required></sl-text-field>
      </sl-form-field>

      <sl-form-field label="Text area">
        <sl-text-area [(ngModel)]="formGroup.textArea" required></sl-text-area>
      </sl-form-field>
    </sl-form>

    <sl-button slot="primary-actions" (click)="dialogRef.close()">Cancel</sl-button>
    <sl-button slot="primary-actions" variant="primary" (click)="submitForm()">Save</sl-button>
  `,
  styles: [
    `
      sl-form {
        width: 100%;
      }

      sl-form-field {
        display: block;
        margin-bottom: 16px;
      }
    `
  ]
})
export class DialogFormComponent implements AfterViewInit {
  constructor(
    public dialogRef: DialogRef,
    @Inject('DIALOG_DATA') public data: any,
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  @ViewChild('form') form!: FormComponent;

  formGroup = {
    textField: '',
    textArea: ''
  };

  ngAfterViewInit(): void {
    // Force change detection after view init to ensure components render
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  submitForm() {
    /*setTimeout(() => {
      // const formData = {
      //   firstname: (
      //     this.dialogRef.dialogElement.querySelector('sl-text-field[name=firstname]') as unknown as TextFieldComponent
      //   )?.value,
      //   lastname: (
      //     this.dialogRef.dialogElement.querySelector('sl-text-field[name=lastname]') as unknown as TextFieldComponent
      //   )?.value,
      //   email: (
      //     this.dialogRef.dialogElement.querySelector('sl-text-field[name=email]') as unknown as TextFieldComponent
      //   )?.value,
      //   comments: (
      //     this.dialogRef.dialogElement.querySelector('sl-text-area[name=comments]') as unknown as TextAreaComponent
      //   )?.value
      // };

      console.log(
        'Form submitted with data:',
        this.dialogRef.dialogElement.querySelector('sl-text-field[name=firstname]'),
        this.elementRef.nativeElement,
        this.dialogRef.dialogElement
      );

      console.log('Form values:', this.formGroup, 'fooorm', this.form);

      this.dialogRef.close(this.form.value);
    }, 300);*/

    console.log('Form values:', this.formGroup);
    this.dialogRef.close(this.formGroup);
  }
}

@Component({
  selector: 'sla-dialog-form-example',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <h3>Dialog Service Form Example</h3>
    <p>Open a dialog with a form inside using the DialogService.</p>
    <sl-button (click)="openFormDialog()">Open Form Dialog</sl-button>

    <pre>{{ formResult | json }}</pre>
  `
})
export class DialogFormExampleComponent {
  formResult = null;

  constructor(public dialogService: DialogService) {}

  openFormDialog(): void {
    const dialogRef = this.dialogService.showModal<DialogFormComponent, any>({
      component: DialogFormComponent,
      data: {
        title: 'User Information Form',
        subtitle: 'Please enter your details below'
      },
      closeButton: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
