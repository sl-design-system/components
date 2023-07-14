import type { Meta } from '@storybook/angular';
import '@sl-design-system/label/register.js';
import '@sl-design-system/button/register.js';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  NgModel,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
  AfterContentChecked,
  DoCheck,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { moduleMetadata, StoryFn } from '@storybook/angular';
import { FormsModule as CoreFormsModule } from '../src/forms/forms.module';
import { StartsWithThisIs, ValidateUrl} from "../src/forms/form-control/validators";
import {RadioDirective} from "../src/forms";
import {Radio} from "@sl-design-system/radio-group";

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

    sl-text-input,
    sl-textarea {
      width: 50%;
    }

    sl-button {
      width: fit-content;
    }
  `],
  template: `
    <form [formGroup]="myForm" (ngSubmit)="onSubmit($event, myForm)">
      <sl-label for="name-input">Name</sl-label>
      <sl-text-input id="name-input" #myReactiveInput formControlName="name" placeholder="Your name" hint="this is a hint for the text input" minlength="8" required>
      </sl-text-input>
      <sl-label for="website-input">Url (with custom validation)</sl-label>
      <sl-text-input id="website-input" #myReactiveInputUrl formControlName="website" placeholder="Your website" hint="this is a hint for the text input with your website" minlength="8" required>
      </sl-text-input>
      <sl-label for="description-id">Description</sl-label>
      <sl-textarea id="description-id" #myReactiveTextarea (input)="onInput(this.myForm.controls.description);" formControlName="description" placeholder="Add short description here" required>
        <div slot="value-missing">This is the custom value-missing message (for the required attribute).</div>
      </sl-textarea>
      <sl-label for="approval-id">Approval</sl-label>
      <sl-checkbox #myReactiveCheckbox id="approval-id" formControlName="approval" required>Check me</sl-checkbox>
      <sl-label for="radio-group-options">Select option</sl-label>
      <sl-radio-group #myReactiveRadioGroup id="radio-group-options" required>
        <sl-radio value="1" formControlName="option">First option</sl-radio>
        <sl-radio value="2" formControlName="option">Second option</sl-radio>
        <sl-radio value="3" formControlName="option">Third option</sl-radio>
      </sl-radio-group>
      <sl-button type="submit" variant="primary">Send</sl-button>
      <div>Name: {{myForm.value.name}}</div>
      <div>Description: {{myForm.value.description}}</div>
      <div>Approval: {{myForm.value.approval}}</div>
      <div>Option: {{myForm.value.option}}</div>
    </form>
  `,
})

// TODO: move validators here
export class ReactiveFormComponent implements AfterViewInit, AfterViewChecked, AfterContentChecked {
  myForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(8), Validators.required]), // , [Validators.minLength(8), Validators.required]
    website: new FormControl('', [Validators.minLength(8), Validators.required, ValidateUrl]), // , [Validators.minLength(8), Validators.required]
    description: new FormControl('', [Validators.required, StartsWithThisIs]),
    approval: new FormControl('yes', Validators.requiredTrue),
    option: new FormControl()
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

  ngAfterViewInit(): void {
    // this.myForm.form.markAsUntouched();

    // Object.values(this.myForm.controls).forEach(control => {
    //   control.markAsUntouched();
    //   control.markAsPristine();
    // });

    if (!this.submitted && !!this.myForm) {
      console.log('ngafterviewinit in form', this.myForm.controls.description);
      this.myForm.markAsUntouched();
      this.myForm.controls.name.markAsUntouched();
      this.myForm.controls.name.markAsPristine();
      this.myForm.controls.website.markAsUntouched();
      this.myForm.controls.website.markAsPristine();
      this.myForm.controls.description.markAsUntouched();
      this.myForm.controls.description.markAsPristine();
      this.myForm.controls.approval.markAsUntouched();
      this.myForm.controls.approval.markAsPristine();
      this.myForm.controls.option.markAsUntouched();
      this.myForm.controls.option.markAsPristine();

      // console.log('ngafterviewinit in form', this.myForm.form.controls, this.myForm.controls, Array.of(this.myForm.controls), this.inputWithNgmodel, this.textareaWithNgmodel);
      // this.inputWithNgmodel.control.markAsUntouched();
      // this.inputWithNgmodel.control.markAsPristine();
      // this.textareaWithNgmodel.control.markAsUntouched();
      // this.textareaWithNgmodel.control.markAsPristine();
      // this.checkboxWithNgmodel.control.markAsUntouched();
      // this.checkboxWithNgmodel.control.markAsPristine();
      // this.radioGroupWithNgmodel.control.markAsUntouched();
      // this.radioGroupWithNgmodel.control.markAsPristine();


      // console.log('ngafterviewinit in form22', this.myForm.form.controls, this.myForm.controls, Array.of(this.myForm.controls), this.inputWithNgmodel, this.textareaWithNgmodel);

      // Object.values(this.myForm.form.controls).forEach(control => {
      //   console.log('ngafterviewinit in form for each', this.myForm.form.controls, this.myForm.controls, control);
      //   control.markAsUntouched();
      //   control.markAsPristine();
      // });
    }
  }

  ngAfterViewChecked(): void {
    console.log('ngafterviewchecked in form before if', this.submitted, this.myForm, this.myForm.controls.name.errors, this.myInput.nativeElement);

    if (this.submitted) {
      // this.myForm.controls.name.che
      // const input = this.myInputRef.nativeElement.querySelector('input') as HTMLInputElement;
      // // input.reportValidity();
      // input.checkValidity();
      // // this.inputWithNgmodel.control.markAsTouched();
      // // this.inputWithNgmodel.control.markAsDirty();
      // // this.inputWithNgmodel.control.updateValueAndValidity();
      // const textarea = this.myTextareaRef.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
      // console.log('textarea...', textarea);
      // textarea.checkValidity();
      // //(this.checkboxWithNgmodel as Checkbox).checkValidity();
      // this.myCheckboxRef.nativeElement.internals.checkValidity();


      const input = this.myInput.nativeElement.querySelector('input') as HTMLInputElement;
      const urlInput = this.myUrlInput.nativeElement.querySelector('input') as HTMLInputElement;

      console.log('this.myForm.controls.name.errors?.[\'invalidUrl\']', this.myForm.controls.website.errors?.['invalidUrl'], this.myForm.controls.website.errors);

      if (this.myForm.controls.website.errors?.['invalidUrl']) { // TODO only when no other errors like built-in
        // this.myInput.nativeElement.setCustomValidity('invalid url...');
        console.log('this.myForm.controls.name.errors?.[\'invalidUrl\'] in if', this.myForm.controls.name.errors?.['invalidUrl'], this.myForm.controls.name.errors);
        urlInput.setCustomValidity('The url is invalid, please check it. It should contain "https" and ".com" parts');
      }  else {
        // this.myInput.nativeElement.setCustomValidity('');
        console.log('this.myForm.controls.name.errors?.[\'invalidUrl\'] in else', this.myForm.controls.name.errors?.['invalidUrl'], this.myForm.controls.name.errors);
        urlInput.setCustomValidity('');
      } // TODO: maybe move to on submit>? because of the delay

     urlInput.checkValidity();
      input.checkValidity();
      const textarea = this.myTextarea.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
      if (this.myForm.controls.description.errors?.['invalidStart']) {
        textarea.setCustomValidity('The description should starts with "This is"');
      } else {
        textarea.setCustomValidity('');
      }

      textarea.checkValidity();

 //     console.log('input.validationMessage in reactiveform', input.validationMessage, this.myInput.nativeElement.validity, Object.keys(this.myForm.controls.name.errors), Object.entries(this.myForm.controls.name.errors), Array.of(this.myForm.controls.name.errors as Object), this.myForm.controls.name.errors?.['invalidUrl']);

      // if (this.myForm.controls.name.errors) {
      //   const keys = Object.keys(this.myForm.controls.name.errors);
      //   console.log(keys);
      //
      //   keys.forEach((key) => {
      //     console.log(key, this.myForm.controls.name?.errors[key]);
      //   });
      // }

      // if (this.myForm.controls.name.errors?.['invalidUrl']) { // TODO only when no other errors like built-in
      //   // this.myInput.nativeElement.setCustomValidity('invalid url...');
      //   input.setCustomValidity('invalid url...');
      // } /*else {
      //   // this.myInput.nativeElement.setCustomValidity('');
      //   input.setCustomValidity('');
      // }*/ // TODO: maybe move to on submit>? because of the delay
    } else {
      // this.inputWithNgmodel.control.markAsUntouched();
      // this.inputWithNgmodel.control.markAsPristine();
      // this.textareaWithNgmodel.control.markAsUntouched();
      // this.textareaWithNgmodel.control.markAsPristine();
      // this.checkboxWithNgmodel.control.markAsUntouched();
      // this.checkboxWithNgmodel.control.markAsPristine();

      // this.myForm.controls.name.markAsUntouched();
      // this.myForm.controls.name.markAsPristine();
      // this.myForm.controls.description.markAsUntouched();
      // this.myForm.controls.description.markAsPristine();

      this.myForm.markAsUntouched();
      this.myForm.controls.name.markAsUntouched();
      this.myForm.controls.name.markAsPristine();
      this.myForm.controls.website.markAsUntouched();
      this.myForm.controls.website.markAsPristine();
      this.myForm.controls.description.markAsUntouched();
      this.myForm.controls.description.markAsPristine();
      this.myForm.controls.approval.markAsUntouched();
      this.myForm.controls.approval.markAsPristine();
      this.myForm.controls.option.markAsUntouched();
      this.myForm.controls.option.markAsPristine();
    }
  }

  ngAfterContentChecked(): void {
    const input = this.myInput.nativeElement.querySelector('input') as HTMLInputElement;
    const textarea = this.myTextarea.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    const urlInput = this.myUrlInput.nativeElement.querySelector('input') as HTMLInputElement;
  console.log('this.myForm.controls.name.errors?.[\'invalidUrl\'] in aftercontentchecked', this.myForm.controls.website.errors?.['invalidUrl']);
    if (this.submitted) {
      // if (this.myForm.controls.name.errors?.['invalidUrl']) { // TODO only when no other errors like built-in
      //   // this.myInput.nativeElement.setCustomValidity('invalid url...');
      //   // input.setCustomValidity('invalid url...');
      // } else {
      //   // this.myInput.nativeElement.setCustomValidity('');
      //   // input.setCustomValidity('');
      // }
      // if (this.myForm.controls.website.errors?.['invalidUrl']) { // TODO only when no other errors like built-in
      //   // this.myInput.nativeElement.setCustomValidity('invalid url...');
      //   console.log('this.myForm.controls.name.errors?.[\'invalidUrl\'] in if', this.myForm.controls.name.errors?.['invalidUrl'], this.myForm.controls.name.errors);
      //   urlInput.setCustomValidity('The url is invalid, please check it. It should contain "https" and ".com" parts');
      // }  else {
      //   // this.myInput.nativeElement.setCustomValidity('');
      //   console.log('this.myForm.controls.name.errors?.[\'invalidUrl\'] in else', this.myForm.controls.name.errors?.['invalidUrl'], this.myForm.controls.name.errors);
      //   urlInput.setCustomValidity('');
      // } // TODO: maybe move to on submit>? because of the delay
      urlInput.checkValidity();
      input.checkValidity();
      textarea.checkValidity();
    } //else {
    //   this.myForm.controls.name.markAsUntouched();
    //   this.myForm.controls.name.markAsPristine();
    //   this.myForm.controls.description.markAsUntouched();
    //   this.myForm.controls.description.markAsPristine();
    // }
  }

  onInput(target: FormControl): void {
    // console.log('oninput event check condition', target, !this.submitted && !!this.myForm, event, this.inputWithNgmodel.control.errors);
    console.log('oninput event check condition', target, this.myForm.controls.description);

    if (!this.submitted /*&& !!this.myForm*/) {
      console.log('oninput event inside if');
      // this.inputWithNgmodel.control.markAsUntouched();
      // this.inputWithNgmodel.control.markAsPristine();
      target.markAsUntouched();
      target.markAsPristine();
    } else {
      console.log('oninput event inside else');
      // this.inputWithNgmodel.control.markAsTouched();
      // this.inputWithNgmodel.control.markAsDirty();
      // this.inputWithNgmodel.control.updateValueAndValidity();
      target.markAsTouched();
      target.markAsDirty();
      target.updateValueAndValidity();
      // (event.target as HTMLFormElement).checkValidity();
    }
  }

  onSubmit(event: Event, form: FormGroup) {
    console.log('form on submit', form, form.valid, form.controls);
    // form.markAsTouched();
    // alert(`form submit: Name: ${form.value.name},
    //       Description: ${form.value.description},
    //       Approval: ${form.value.approval} ${form.value.approval.valid},
    //       Option: ${form.value.option},
    //       form-invalid: ${form.invalid}`);

    // form.addValidators(() => )

    event.preventDefault();

    this.submitted = true;

    this.myForm.markAllAsTouched();

    // const input = this.myInput.nativeElement.querySelector('input') as HTMLInputElement;
    // if (this.myForm.controls.name.errors?.['invalidUrl']) {
    //   input.setCustomValidity('invalid url...');
    // }

   // this.myInput.nativeElement.setCustomValidity('teeeest');

    Object.values(form.controls).forEach(control => {
      console.log('control in reactive', control);
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    const input = this.myInput.nativeElement.querySelector('input') as HTMLInputElement;
    const urlInput = this.myUrlInput.nativeElement.querySelector('input') as HTMLInputElement;
    const textarea = this.myTextarea.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    input.checkValidity();
    urlInput.checkValidity();
    textarea.checkValidity();
    this.myCheckbox.nativeElement.internals.checkValidity();
    this.myRadioGroup.nativeElement.internals.checkValidity();

    if (form.valid) {
      alert('form submitted');
    } else {
      alert('form NOT submitted');
    }
  }
}

@Component({
  selector: 'sla-reactive-form-required-report',
  styles: [`
    form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    sl-text-input,
    sl-textarea {
      width: 50%;
    }

    sl-button {
      width: fit-content;
    }
  `],
  template: `
    <form [formGroup]="myForm">
      <sl-label for="name-input">Name</sl-label>
      <sl-text-input id="name-input" #myReactiveInput formControlName="name" placeholder="Your name" hint="this is a hint for the text input" required>
      </sl-text-input>
      <sl-label for="description-id">Description</sl-label>
      <sl-textarea id="description-id" #myReactiveTextarea formControlName="description" placeholder="Add short description here" required>
        <div slot="value-missing">This is the custom value-missing message (for the required attribute).</div>
      </sl-textarea>
      <sl-label for="approval-id">Approval</sl-label>
      <sl-checkbox #myReactiveCheckbox id="approval-id" formControlName="approval" required>Check me</sl-checkbox>
      <sl-label for="radio-group-options">Select option</sl-label>
      <sl-radio-group #myReactiveRadioGroup id="radio-group-options" required>
        <sl-radio value="1" formControlName="option">First option</sl-radio>
        <sl-radio value="2" formControlName="option">Second option</sl-radio>
        <sl-radio value="3" formControlName="option">Third option</sl-radio>
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
      console.log('control in reactive', control);
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    const input = this.myInput.nativeElement.querySelector('input') as HTMLInputElement;
    const textarea = this.myTextarea.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    input.reportValidity();
    textarea.reportValidity();
    this.myCheckbox.nativeElement.internals.reportValidity();
    this.myRadioGroup.nativeElement.internals.reportValidity();
  }
}


@Component({
  selector: 'sla-template-form',
  styles: [`
    form {
      display: flex;
      flex-direction: column;
    }

    sl-text-input,
    sl-textarea {
      width: 50%;
    }

    sl-button {
      width: fit-content;
    }
  `],
  template: `
    <form #myForm="ngForm" (ngSubmit)="onSubmit($event, model, myForm)">
      <sl-label for="my-value">Name</sl-label>
      <sl-text-input id="my-value" hint="this is a hint" placeholder="type at least 8 characters" [(ngModel)]="model.name" (input)="onInput(inputWithNgmodel);" #inputWithNgmodel="ngModel" name="name" minlength="8" required>
        <div slot="value-missing">error message example when the field is required</div>
      </sl-text-input>
      <sl-label for="textarea-ngmodel-id">Description</sl-label>
      <sl-textarea id="textarea-ngmodel-id" [(ngModel)]="model.description" #textareaWithNgmodel="ngModel" (input)="onInput(textareaWithNgmodel);" name="description" minlength="8" required></sl-textarea>
      <sl-label for="checkboxWithNgmodel">Checkbox</sl-label>
      <sl-checkbox id="checkboxWithNgmodel" #checkboxWithNgmodel="ngModel" [(ngModel)]="model.approval" name="approval" (sl-change)="onChange(checkboxWithNgmodel)" required>my checkbox</sl-checkbox>
      <sl-label for="radio-group">Select option</sl-label>
      <sl-radio-group id="radio-group" #radioGroupWithNgmodel="ngModel" [(ngModel)]="model.option" name="option" required>
        <sl-radio value="1" (click)="onRadioValueChange($event.target)" (keydown)="onRadioValueChange($event.target)">One</sl-radio>
        <sl-radio value="2" (click)="onRadioValueChange($event.target)" (keydown)="onRadioValueChange($event.target)">Two</sl-radio>
        <sl-radio value="3" (click)="onRadioValueChange($event.target)" (keydown)="onRadioValueChange($event.target)">Three</sl-radio>
      </sl-radio-group>
      <sl-button type="submit" variant="primary">Submit</sl-button>
      <div>
        Name: <i>{{model.name}}</i> valid? {{inputWithNgmodel.valid}}
        <strong>errors?</strong> {{inputWithNgmodel.control.errors | json}}
        <strong>touched?</strong> {{inputWithNgmodel.control.touched }}
        <strong>pristine?</strong> {{inputWithNgmodel.control.pristine }}
      </div>
      <div>Description: <i>{{model.description}}</i>
        valid? {{textareaWithNgmodel.valid}}
        <strong>errors?</strong> {{textareaWithNgmodel.control.errors | json}}
        <strong>touched?</strong> {{textareaWithNgmodel.control.touched }}
        <strong>pristine?</strong> {{textareaWithNgmodel.control.pristine }}
      </div>
      <div>Approval: <i>{{model.approval}}</i> valid? {{checkboxWithNgmodel.valid}}</div><i>errors? {{checkboxWithNgmodel.control.errors | json}}</i>
<!--      <strong>touched?</strong> {{checkboxWithNgmodel.control.touched }}-->
<!--      <strong>pristine?</strong> {{checkboxWithNgmodel.control.pristine }}-->
<!--      <div>Option: value: <i>{{model.option}}</i></div>-->
<!--      <div>Form submitted: {{myForm.submitted}}</div>-->
<!--      <div>Form valid: {{myForm.valid}}</div>-->
<!--      <div>Form validator: {{myForm.form.errors| json}}</div>-->
    </form>
  `
})
export class TemplateFormComponent implements AfterViewInit, AfterViewChecked, AfterContentChecked {
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

  ngAfterViewInit(): void {
    // this.myForm.form.markAsUntouched();

    // Object.values(this.myForm.controls).forEach(control => {
    //   control.markAsUntouched();
    //   control.markAsPristine();
    // });

    if (!this.submitted && !!this.myForm) {
      this.myForm.form.markAsUntouched();
      console.log('ngafterviewinit in form', this.myForm.form.controls, this.myForm.controls, Array.of(this.myForm.controls), this.inputWithNgmodel, this.textareaWithNgmodel);
      this.inputWithNgmodel.control.markAsUntouched();
      this.inputWithNgmodel.control.markAsPristine();
      this.textareaWithNgmodel.control.markAsUntouched();
      this.textareaWithNgmodel.control.markAsPristine();
      this.checkboxWithNgmodel.control.markAsUntouched();
      this.checkboxWithNgmodel.control.markAsPristine();
      this.radioGroupWithNgmodel.control.markAsUntouched();
      this.radioGroupWithNgmodel.control.markAsPristine();
      console.log('ngafterviewinit in form22', this.myForm.form.controls, this.myForm.controls, Array.of(this.myForm.controls), this.inputWithNgmodel, this.textareaWithNgmodel);

      // Object.values(this.myForm.form.controls).forEach(control => {
      //   console.log('ngafterviewinit in form for each', this.myForm.form.controls, this.myForm.controls, control);
      //   control.markAsUntouched();
      //   control.markAsPristine();
      // });
    }
  }

  ngAfterViewChecked(): void {
    console.log('ngafterviewchecked in form before if', this.submitted, this.myForm, this.inputWithNgmodel.errors, this.radioGroupWithNgmodel.errors);

      if (this.submitted) {
        const input = this.myInputRef.nativeElement.querySelector('input') as HTMLInputElement;
        // input.reportValidity();
        input.checkValidity();
        // this.inputWithNgmodel.control.markAsTouched();
        // this.inputWithNgmodel.control.markAsDirty();
        // this.inputWithNgmodel.control.updateValueAndValidity();
        const textarea = this.myTextareaRef.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
        console.log('textarea...', textarea);
        textarea.checkValidity();
        //(this.checkboxWithNgmodel as Checkbox).checkValidity();
        // this.myCheckboxRef.nativeElement.internals.checkValidity();
        //this.myRadioGroupRef.nativeElement.internals.checkValidity();
      } else {
        this.inputWithNgmodel.control.markAsUntouched();
        this.inputWithNgmodel.control.markAsPristine();
        this.textareaWithNgmodel.control.markAsUntouched();
        this.textareaWithNgmodel.control.markAsPristine();
        this.checkboxWithNgmodel.control.markAsUntouched();
        this.checkboxWithNgmodel.control.markAsPristine();
        this.radioGroupWithNgmodel.control.markAsUntouched();
        this.radioGroupWithNgmodel.control.markAsPristine();
      }
  }

  ngAfterContentChecked(): void {
    if (this.submitted) {
      const input = this.myInputRef.nativeElement.querySelector('input') as HTMLInputElement;
      // input.reportValidity();
      input.checkValidity();
    }
  }

  onInput(target: NgModel): void {
    console.log('oninput event check condition', target, !this.submitted && !!this.myForm, event, this.inputWithNgmodel.control.errors);

    if (!this.submitted /*&& !!this.myForm*/) {
      console.log('oninput event inside if');
      // this.inputWithNgmodel.control.markAsUntouched();
      // this.inputWithNgmodel.control.markAsPristine();
      target.control.markAsUntouched();
      target.control.markAsPristine();
    } else {
      console.log('oninput event inside else');
      // this.inputWithNgmodel.control.markAsTouched();
      // this.inputWithNgmodel.control.markAsDirty();
      // this.inputWithNgmodel.control.updateValueAndValidity();
      target.control.markAsTouched();
      target.control.markAsDirty();
      target.control.updateValueAndValidity();
      // (event.target as HTMLFormElement).checkValidity();
    }
  }

  onChange(target: NgModel): void {
    console.log('onChange event check condition', target, !this.submitted && !!this.myForm, event, this.inputWithNgmodel.control.errors);

    // if (!this.submitted /*&& !!this.myForm*/) {
    //   console.log('onChange event inside if');
    //   // this.inputWithNgmodel.control.markAsUntouched();
    //   // this.inputWithNgmodel.control.markAsPristine();
    //   target.control.markAsUntouched();
    //   target.control.markAsPristine();
    // } else {
    //   console.log('onChange event inside else');
    //   // this.inputWithNgmodel.control.markAsTouched();
    //   // this.inputWithNgmodel.control.markAsDirty();
    //   // this.inputWithNgmodel.control.updateValueAndValidity();
    //   // if (this.myCheckboxRef.nativeElement.checked) {
    //     target.control.markAsTouched();
    //     target.control.markAsDirty();
    //     target.control.updateValueAndValidity();
    //   // }
    // }
  }

  onRadioValueChange(event: any): void {
    this.model.option = event.value;
  }

  onSubmit(event: Event, model: Person, form: NgForm): void {
    console.log('on submit submitted', form.submitted, event);
    console.log('this.myForm.form.validator', this.myForm.form.validator, this.inputWithNgmodel.control.validator, this.model.name);

    event.preventDefault();

    this.submitted = true;

    this.myForm.form.markAllAsTouched();

    //this.onInput();
    const input = this.myInputRef.nativeElement.querySelector('input') as HTMLInputElement;

/*    Object.values(form.controls).forEach(control => {
      console.log('control on submit', control);
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
      console.log('control on submit-2', control);
    });*/

    // const oldValue = this.inputWithNgmodel.control.value;
    // this.inputWithNgmodel.control.setValue('');
    // this.inputWithNgmodel.control.setValue(oldValue);


    this.inputWithNgmodel.control.markAsTouched();
    this.inputWithNgmodel.control.markAsDirty();
    this.inputWithNgmodel.control.updateValueAndValidity();
    input.checkValidity();
    // this.inputWithNgmodel.control.updateValueAndValidity({ onlySelf: true, emitEvent: true });

    this.textareaWithNgmodel.control.markAsTouched();
    this.textareaWithNgmodel.control.markAsDirty();
    this.textareaWithNgmodel.control.updateValueAndValidity();

    this.checkboxWithNgmodel.control.markAllAsTouched();
    this.checkboxWithNgmodel.control.markAsDirty();
    this.checkboxWithNgmodel.control.updateValueAndValidity();
    this.myCheckboxRef.nativeElement.internals.checkValidity();


    this.radioGroupWithNgmodel.control.markAllAsTouched();
    this.radioGroupWithNgmodel.control.markAsDirty();
    this.radioGroupWithNgmodel.control.updateValueAndValidity();
    this.myRadioGroupRef.nativeElement.internals.checkValidity();

    // input.reportValidity();

   // input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

    // input.dispatchEvent(new Event('invalid', { bubbles: true, cancelable: true }));
    // input.dispatchEvent(new Event('sl-submit', { bubbles: true, cancelable: true }));
    //console.log('input.validity onsubmit', input.validity);

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

    sl-text-input,
    sl-textarea {
      width: 50%;
    }

    sl-button {
      width: fit-content;
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

  ngAfterViewChecked() {
    this.myForm.form.markAllAsTouched();
    Object.values(this.myForm.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    const input = this.myInputRef.nativeElement.querySelector('input') as HTMLInputElement;
    const textarea = this.myTextareaRef.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    input.reportValidity();
    textarea.reportValidity();
    this.myCheckboxRef.nativeElement.internals.reportValidity();
    this.myRadioGroupRef.nativeElement.internals.reportValidity();
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
