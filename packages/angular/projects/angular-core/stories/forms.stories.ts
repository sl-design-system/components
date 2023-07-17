import type { Meta } from '@storybook/angular';
import '@sl-design-system/label/register.js';
import '@sl-design-system/button/register.js';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  NgModel,
  ReactiveFormsModule, ValidationErrors,
  Validators
} from '@angular/forms';
import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild
} from '@angular/core';
import { moduleMetadata, StoryFn } from '@storybook/angular';
import { FormsModule as CoreFormsModule } from '../src/forms/forms.module';
import { Radio } from '@sl-design-system/radio-group';

@Component({
  selector: 'sla-input',
  styles: [`
    .example-input {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    sl-text-input {
      width: 250px;
    }
  `],
  template: `
    <div class="example-input">
      <sl-label for="input-id">My label</sl-label>
      <sl-text-input id="input-id" [value]="value" (input)="onValueChange($event.target)" required></sl-text-input>
      <div>value: <i>{{value}}</i></div>
    </div>
  `
})
export class InputComponent {
  value = '';

  onValueChange(event: any): void {
    this.value = (event as HTMLInputElement).value;
  }
}

@Component({
  selector: 'sla-textarea',
  styles: [`
    .example-textarea {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    sl-textarea {
      width: 250px;
    }
  `],
  template: `
    <div class="example-textarea">
      <sl-label for="textarea-onchange">My label</sl-label>
      <sl-textarea id="textarea-onchange" name="textarea" placeholder="Placeholder" [value]="textarea1" (input)="onTextareaValueChange($event.target)"></sl-textarea>
      <div>value: <i>{{textarea1}}</i></div>
    </div>
  `
})
export class TextareaComponent {
  textarea1 = 'textarea content';

  onTextareaValueChange(event: any): void {
    this.textarea1 = (event as HTMLTextAreaElement).value;
  }
}

@Component({
  selector: 'sla-checkbox',
  styles: [`
    .example-checkbox {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `],
  template: `
    <div class="example-checkbox">
      <sl-label for="textarea-onchange">My label</sl-label>
      <sl-checkbox id="checkbox-onchange-id" [value]="checkboxValue" (sl-change)="onCheckboxValueChange($event.target)">Checkbox</sl-checkbox>
      <div>value: <i>{{checkboxValue}}</i></div>
    </div>
  `
})
export class CheckboxComponent {
  checkboxValue = false;

  onCheckboxValueChange(event: any): void {
    this.checkboxValue = event.checked;
  }
}


@Component({
  selector: 'sla-reactive-form',
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    sl-label {
      margin-block-start: 0.5rem;
    }

    sl-label:first-of-type {
      margin-block-start: 0;
    }

    sl-text-input,
    sl-textarea {
      width: 50%;
    }

    sl-button {
      width: fit-content;
      margin-block-start: 0.5rem;
    }
  `],
  template: `
    <form [formGroup]="myForm" (ngSubmit)="onSubmit($event, myForm)">
      <sl-label for="name-input">Name</sl-label>
      <sl-text-input id="name-input" #myReactiveInput formControlName="name" placeholder="Your name" hint="This is a hint for the text input with your name" minlength="8" required>
      </sl-text-input>
      <sl-label for="website-input">Url (with custom validation)</sl-label>
      <sl-text-input id="website-input" #myReactiveInputUrl formControlName="website" placeholder="Your website" hint="Your website adress (should contain 'https' and 'com' parts)" minlength="8" required>
      </sl-text-input>
      <sl-label for="description-id">Description (with custom validation)</sl-label>
      <sl-textarea id="description-id" #myReactiveTextarea (input)="onInput(this.myForm.controls.description);" formControlName="description" placeholder="Add short description here" hint="This textarea should contain a short description starting with 'This is'" required>
        <div slot="value-missing">This is the custom value-missing message (for the required attribute).</div>
      </sl-textarea>
      <sl-label for="approval-id">Approval</sl-label>
      <sl-checkbox #myReactiveCheckbox id="approval-id" formControlName="approval" hint="This is a hint for the checkbox" required>Check me</sl-checkbox>
      <sl-label for="radio-group-options">Select option</sl-label>
      <sl-radio-group #myReactiveRadioGroup id="radio-group-options" formControlName="option" hint="This is a hint for the radio group"  required>
        <sl-radio value="1" formControlName="option">First option</sl-radio>
        <sl-radio value="2" formControlName="option">Second option</sl-radio>
        <sl-radio value="3" formControlName="option">Third option</sl-radio>
      </sl-radio-group>
      <sl-button type="submit" variant="primary">Submit</sl-button>
      <div>Name: {{myForm.value.name}}</div>
      <div>Description: {{myForm.value.description}}</div>
      <div>Approval: {{myForm.value.approval}}</div>
      <div>Option: {{myForm.value.option}}</div>
    </form>
  `,
})

export class ReactiveFormComponent implements AfterViewChecked, AfterContentChecked {
  myForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(8), Validators.required]),
    website: new FormControl('', [Validators.minLength(8), Validators.required, validateUrl]),
    description: new FormControl('', [Validators.required, startsWithThisIs]),
    approval: new FormControl('yes', Validators.required),
    option: new FormControl('', Validators.required)
  });

  @ViewChild('myReactiveInput', { static: true, read: ElementRef })
  myInput!: ElementRef<HTMLInputElement>;

  @ViewChild('myReactiveInputUrl', { static: true, read: ElementRef })
  myUrlInput!: ElementRef<HTMLInputElement>;

  @ViewChild('myReactiveTextarea', { static: true, read: ElementRef })
  myTextarea!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('myReactiveCheckbox', { static: true, read: ElementRef })
  myCheckbox!: ElementRef;

  @ViewChild('myReactiveRadioGroup', { static: true, read: ElementRef })
  myRadioGroup!: ElementRef;

  submitted = false;

  ngAfterViewChecked(): void {
    if (this.submitted) {
      const input = this.myInput.nativeElement.querySelector('input') as HTMLInputElement,
       urlInput = this.myUrlInput.nativeElement.querySelector('input') as HTMLInputElement;

      if (this.myForm.controls.website.errors?.['invalidUrl']) {
        urlInput.setCustomValidity('The url is invalid, please check it. It should contain "https" and ".com" parts');
      }  else {
        urlInput.setCustomValidity('');
      }

     urlInput.checkValidity();
      input.checkValidity();

      const textarea = this.myTextarea.nativeElement.querySelector('textarea') as HTMLTextAreaElement,
       otherErrors = this.myForm.controls.description.errors ? Object.keys(this.myForm.controls.description.errors).length : 0;

      if (this.myForm.controls.description.errors?.['invalidStart'] && otherErrors <= 1) {
        textarea.setCustomValidity('The description should starts with "This is"');
      } else {
        textarea.setCustomValidity('');
      }
      textarea.checkValidity();
    } else {
      this.myForm.controls.name.markAsUntouched();
      this.myForm.controls.name.markAsPristine();
      this.myForm.controls.website.markAsUntouched();
      this.myForm.controls.website.markAsPristine();
      this.myForm.controls.description.markAsUntouched();
      this.myForm.controls.description.markAsPristine();
    }
  }

  ngAfterContentChecked(): void {
    const input = this.myInput.nativeElement.querySelector('input') as HTMLInputElement,
     textarea = this.myTextarea.nativeElement.querySelector('textarea') as HTMLTextAreaElement,
     urlInput = this.myUrlInput.nativeElement.querySelector('input') as HTMLInputElement;

    if (this.submitted) {
      urlInput.checkValidity();
      input.checkValidity();
      textarea.checkValidity();
    }
  }

  onInput(target: FormControl): void {
    if (!this.submitted) {
      target.markAsUntouched();
      target.markAsPristine();
    } else {
      target.markAsTouched();
      target.markAsDirty();
      target.updateValueAndValidity();
    }
  }

  onSubmit(event: Event, form: FormGroup): void {

    event.preventDefault();

    this.submitted = true;

    this.myForm.markAllAsTouched();

    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    const input = this.myInput.nativeElement.querySelector('input') as HTMLInputElement,
     urlInput = this.myUrlInput.nativeElement.querySelector('input') as HTMLInputElement,
     textarea = this.myTextarea.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    input.checkValidity();
    urlInput.checkValidity();
    textarea.checkValidity();
    this.myCheckbox.nativeElement.internals.checkValidity();
    this.myRadioGroup.nativeElement.internals.checkValidity();

    if (this.myForm.valid) {
      alert('form submitted');
    } else {
      alert('form NOT submitted');
    }
  }
}

function validateUrl(control: AbstractControl): ValidationErrors | null {
  const otherErrors = control.errors ? Object.keys(control.errors).length : 0;
  if ((!control.value.startsWith('https') || !control.value.includes('.com')) && otherErrors <= 1) {
    return { invalidUrl: true };
  }
  return null;
}

function startsWithThisIs(control: AbstractControl): ValidationErrors | null {
  if (!control.value.startsWith('This is')) {
    return { invalidStart: true };
  }
  return null;
}

@Component({
  selector: 'sla-reactive-form-required-report',
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    sl-label {
      margin-block-start: 0.5rem;
    }

    sl-label:first-of-type {
      margin-block-start: 0;
    }

    sl-text-input,
    sl-textarea {
      width: 50%;
    }

    sl-button {
      width: fit-content;
      margin-block-start: 0.5rem;
    }
  `],
  template: `
    <form [formGroup]="myForm">
      <sl-label for="name-input">Name</sl-label>
      <sl-text-input id="name-input" #myReactiveInput formControlName="name" placeholder="Your name" hint="this is a hint for the text input" required>
      </sl-text-input>
      <sl-label for="description-id">Description</sl-label>
      <sl-textarea id="description-id" #myReactiveTextarea formControlName="description" placeholder="Add short description here" required>
      </sl-textarea>
      <sl-label for="approval-id">Approval</sl-label>
      <sl-checkbox #myReactiveCheckbox id="approval-id" formControlName="approval" required>Check me</sl-checkbox>
      <sl-label for="radio-group-options">Select option</sl-label>
      <sl-radio-group #myReactiveRadioGroup id="radio-group-options" formControlName="option" required>
        <sl-radio value="1">First option</sl-radio>
        <sl-radio value="2">Second option</sl-radio>
        <sl-radio value="3">Third option</sl-radio>
      </sl-radio-group>
    </form>
  `,
})
export class ReactiveFormRequiredReportComponent implements AfterViewChecked {
  myForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    approval: new FormControl('yes', Validators.requiredTrue),
    option: new FormControl()
  });

  @ViewChild('myReactiveInput', { static: true, read: ElementRef })
  myInput!: ElementRef<HTMLInputElement>;

  @ViewChild('myReactiveTextarea', { static: true, read: ElementRef })
  myTextarea!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('myReactiveCheckbox', { static: true, read: ElementRef })
  myCheckbox!: ElementRef;

  @ViewChild('myReactiveRadioGroup', { static: true, read: ElementRef })
  myRadioGroup!: ElementRef;

  ngAfterViewChecked(): void {
    this.myForm.markAllAsTouched();

    Object.values(this.myForm.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    const input = this.myInput.nativeElement.querySelector('input') as HTMLInputElement,
     textarea = this.myTextarea.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    input.checkValidity();
    textarea.checkValidity();
    this.myCheckbox.nativeElement.internals.checkValidity();
    this.myRadioGroup.nativeElement.internals.checkValidity();
  }
}


@Component({
  selector: 'sla-template-form',
  styles: [`
    form {
      display: flex;
      flex-direction: column;
    }

    sl-label {
      margin-block-start: 0.5rem;
    }

    sl-label:first-of-type {
      margin-block-start: 0;
    }

    sl-text-input,
    sl-textarea {
      width: 50%;
    }

    sl-button {
      width: fit-content;
      margin-block-start: 0.5rem;
    }
  `],
  template: `
    <form #myForm="ngForm" (ngSubmit)="onSubmit($event, model, myForm)">
      <sl-label for="my-value">Name</sl-label>
      <sl-text-input id="my-value" hint="This is a hint for text input" placeholder="Type at least 8 characters" [(ngModel)]="model.name" (input)="onInput(inputWithNgmodel);" #inputWithNgmodel="ngModel" name="name" minlength="8" required>
        <div slot="value-missing">error message example when the field is required</div>
      </sl-text-input>
      <sl-label for="textarea-ngmodel-id">Description</sl-label>
      <sl-textarea id="textarea-ngmodel-id" placeholder="Type at least 8 characters" [(ngModel)]="model.description" #textareaWithNgmodel="ngModel" (input)="onInput(textareaWithNgmodel);" name="description" hint="This is a hint for textarea" minlength="8" required></sl-textarea>
      <sl-label for="checkboxWithNgmodel">Checkbox</sl-label>
      <sl-checkbox id="checkboxWithNgmodel" #checkboxWithNgmodel="ngModel" [(ngModel)]="model.approval" name="approval" hint="This is a hint for checkbox" required>my checkbox</sl-checkbox>
      <sl-label for="radio-group">Select option</sl-label>
      <sl-radio-group id="radio-group" #radioGroupWithNgmodel="ngModel" [(ngModel)]="model.option" name="option" hint="This is a hint for radio group" required>
        <sl-radio value="1" (click)="onRadioValueChange($event)" (keydown)="onRadioValueChange($event)">One</sl-radio>
        <sl-radio value="2" (click)="onRadioValueChange($event)" (keydown)="onRadioValueChange($event)">Two</sl-radio>
        <sl-radio value="3" (click)="onRadioValueChange($event)" (keydown)="onRadioValueChange($event)">Three</sl-radio>
      </sl-radio-group>
      <sl-button type="submit" variant="primary">Submit</sl-button>
      <div>Name: <i>{{model.name}}</i></div>
      <div>Description: <i>{{model.description}}</i></div>
      <div>Approval: <i>{{model.approval}}</i></div>
      <div>Option: <i>{{model.option}}</i></div>
    </form>
  `
})
export class TemplateFormComponent implements AfterViewChecked {
  model = new Person(1, '', '', 'yes', '');

  @ViewChild('myForm', { static: false }) myForm!: NgForm;

  @ViewChild('inputWithNgmodel', { static: false }) inputWithNgmodel!: NgModel;

  @ViewChild('textareaWithNgmodel', { static: false }) textareaWithNgmodel!: NgModel;

  @ViewChild('checkboxWithNgmodel', { static: false }) checkboxWithNgmodel!: NgModel;

  @ViewChild('radioGroupWithNgmodel', { static: false }) radioGroupWithNgmodel!: NgModel;

  @ViewChild('inputWithNgmodel', { static: true, read: ElementRef })
  myInputRef!: ElementRef<HTMLInputElement>;

  @ViewChild('textareaWithNgmodel', { static: true, read: ElementRef })
  myTextareaRef!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('checkboxWithNgmodel', { static: true, read: ElementRef })
  myCheckboxRef!: ElementRef;

  @ViewChild('radioGroupWithNgmodel', { static: true, read: ElementRef })
  myRadioGroupRef!: ElementRef;

  submitted = false;

  ngAfterViewChecked(): void {
      if (this.submitted) {
        const input = this.myInputRef.nativeElement.querySelector('input') as HTMLInputElement,
         textarea = this.myTextareaRef.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
        input.checkValidity();
        textarea.checkValidity();
      } else {
        this.inputWithNgmodel.control.markAsUntouched();
        this.inputWithNgmodel.control.markAsPristine();
        this.textareaWithNgmodel.control.markAsUntouched();
        this.textareaWithNgmodel.control.markAsPristine();
      }
  }

  onInput(target: NgModel): void {
    if (!this.submitted) {
      target.control.markAsUntouched();
      target.control.markAsPristine();
    } else {
      target.control.markAsTouched();
      target.control.markAsDirty();
      target.control.updateValueAndValidity();
    }
  }

  onRadioValueChange(event: Event): void {
    this.model.option = (event.target as Radio).value as string | undefined;
  }

  onSubmit(event: Event, model: Person, form: NgForm): void {
    event.preventDefault();

    this.submitted = true;

    this.myForm.form.markAllAsTouched();

    Object.values(this.myForm.form.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    this.myCheckboxRef.nativeElement.internals.checkValidity();
    this.myRadioGroupRef.nativeElement.internals.checkValidity();


    alert(`form submit: Name: ${model.name},
          Description: ${model.description},
          Approval: ${model.approval},
          Option: ${model.option}`);

    if (form.valid) {
      alert('form submitted');
    } else {
      alert('form is not valid');
    }
  }
}

@Component({
  selector: 'sla-template-form-required-report',
  styles: [`
    form {
      display: flex;
      flex-direction: column;
    }

    sl-label {
      margin-block-start: 0.5rem;
    }

    sl-label:first-of-type {
      margin-block-start: 0;
    }

    sl-text-input,
    sl-textarea {
      width: 50%;
    }

    sl-button {
      width: fit-content;
      margin-block-start: 0.5rem;
    }
  `],
  template: `
    <form #myForm="ngForm">
      <sl-label for="my-value">Name</sl-label>
      <sl-text-input id="my-value" hint="this is a hint" placeholder="Please write a name" [(ngModel)]="model.name" #inputWithNgmodel="ngModel" name="name" required>
        <div slot="value-missing">This is a custom error message example when the field is required</div>
      </sl-text-input>
      <sl-label for="textarea-ngmodel-id">Description</sl-label>
      <sl-textarea id="textarea-ngmodel-id" hint="This is a hint for the description" placeholder="Please write a short description" [(ngModel)]="model.description" #textareaWithNgmodel="ngModel" name="description" required></sl-textarea>
      <sl-label for="checkboxWithNgmodel">Checkbox</sl-label>
      <sl-checkbox id="checkboxWithNgmodel" #checkboxWithNgmodel="ngModel" [(ngModel)]="model.approval" name="approval" required>my checkbox</sl-checkbox>
      <sl-label for="radio-group">Select option</sl-label>
      <sl-radio-group id="radio-group" #radioGroupWithNgmodel="ngModel" [(ngModel)]="model.option" name="option" required>
        <sl-radio value="1" (click)="onRadioValueChange($event)" (keydown)="onRadioValueChange($event)">One</sl-radio>
        <sl-radio value="2" (click)="onRadioValueChange($event)" (keydown)="onRadioValueChange($event)">Two</sl-radio>
        <sl-radio value="3" (click)="onRadioValueChange($event)" (keydown)="onRadioValueChange($event)">Three</sl-radio>
      </sl-radio-group>
    </form>
  `
})
export class TemplateFormRequiredReportComponent implements AfterViewChecked {
  model = new Person(1, '', '', 'yes', '');

  @ViewChild('myForm', { static: false }) myForm!: NgForm;

  @ViewChild('inputWithNgmodel', { static: true, read: ElementRef })
  myInputRef!: ElementRef<HTMLInputElement>;

  @ViewChild('textareaWithNgmodel', { static: true, read: ElementRef })
  myTextareaRef!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('checkboxWithNgmodel', { static: true, read: ElementRef })
  myCheckboxRef!: ElementRef;

  @ViewChild('radioGroupWithNgmodel', { static: true, read: ElementRef })
  myRadioGroupRef!: ElementRef;

  ngAfterViewChecked(): void {
    this.myForm.form.markAllAsTouched();

    Object.values(this.myForm.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    const input = this.myInputRef.nativeElement.querySelector('input') as HTMLInputElement,
     textarea = this.myTextareaRef.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    input.checkValidity();
    textarea.checkValidity();
    this.myCheckboxRef.nativeElement.internals.checkValidity();
    this.myRadioGroupRef.nativeElement.internals.checkValidity();
  }

  onRadioValueChange(event: Event): void {
    this.model.option = (event.target as Radio).value as string | undefined;
  }
}

export class Person {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public approval: string,
    public option: string | undefined
  ) { }
}

export default {
  title: 'Forms',
  decorators: [
    moduleMetadata({
      declarations: [CheckboxComponent, InputComponent, ReactiveFormComponent, ReactiveFormRequiredReportComponent, TemplateFormComponent, TemplateFormRequiredReportComponent, TextareaComponent],
      imports: [CoreFormsModule, FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }),
  ],
  args: {
  }
} as Meta;

export const Input: StoryFn = () => ({
  template: `<sla-input></sla-input>`,
});

export const Textarea: StoryFn = () => ({
  template: `<sla-textarea></sla-textarea>`,
});

export const Checkbox: StoryFn = () => ({
  template: `<sla-checkbox></sla-checkbox>`,
});

export const ReactiveForm: StoryFn = () => ({
  template: `<sla-reactive-form></sla-reactive-form>`,
});

export const ReactiveFormRequiredReport: StoryFn = () => ({
  template: `<sla-reactive-form-required-report></sla-reactive-form-required-report>`,
});

export const TemplateDrivenForm: StoryFn = () => ({
  template: `<sla-template-form></sla-template-form>`,
});

export const TemplateDrivenFormRequiredReport: StoryFn = () => ({
  template: `<sla-template-form-required-report></sla-template-form-required-report>`,
});
