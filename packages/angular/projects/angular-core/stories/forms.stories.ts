import type { Meta } from '@storybook/angular';
import '@sl-design-system/label/register.js';
import '@sl-design-system/button/register.js';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgForm, NgModel,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  ViewChild,
  Output,
  ElementRef
} from '@angular/core';
import { moduleMetadata, StoryFn } from '@storybook/angular';
import { FormsModule as CoreFormsModule } from '../src/forms/forms.module';
import {ValidateUrl} from "../src/forms/form-control/validators";

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
  `], // novalidate
  template: `
    <form [formGroup]="myForm" (ngSubmit)="onSubmit($event, myForm)">
      <sl-label for="name-input">Name</sl-label>
      <sl-text-input id="name-input" #myReactiveInput formControlName="name" placeholder="Your name" hint="this is a hint for the text input" minlength="8" required>
        <div slot="custom-error">custom error message</div>
      </sl-text-input>
      <div *ngIf="myForm.controls.name.errors?.['invalidUrl']">test invalidUrl</div>
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
      <sl-button type="submit" variant="primary">Send</sl-button>
      <div>Name: {{myForm.value.name}} {{myForm.controls.name.valid}}</div>
      <div>Description: {{myForm.value.description}} {{myForm.controls.description.valid}}</div>
      <div>Approval: {{myForm.value.approval}} {{myForm.controls.approval.valid}}</div>
      <div>Option: {{myForm.value.option}} {{myForm.controls.option.valid}}</div>
      <div>Form valid? {{myForm.valid}}</div>
      <div>Form validator: {{myForm.controls.name.errors | json}}</div>
      <div>Form touched: {{myForm.touched | json}} {{myForm.controls.name.touched}}</div>
    </form>
  `,
}) // TODO use slot customError for invalidurl example?
export class ReactiveFormComponent implements AfterViewChecked {
  myForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(8), Validators.required, ValidateUrl]), // , [Validators.minLength(8), Validators.required]
    description: new FormControl('', Validators.required),
    approval: new FormControl('yes', Validators.requiredTrue),
    option: new FormControl()
  });

  // ValidateUrl(control: AbstractControl) {
  //   if (!control.value.startsWith('https') || !control.value.includes('.io')) {
  //     return { invalidUrl: true };
  //   }
  //   return null;
  // }

  @ViewChild('myReactiveInput', { static: true, read: ElementRef })
  myInput!: ElementRef<HTMLInputElement>;

  @ViewChild('myReactiveTextarea', { static: true, read: ElementRef })
  myTextarea!: ElementRef<HTMLTextAreaElement>;

  @ViewChild('myReactiveCheckbox', { static: true, read: ElementRef })
  myCheckbox!: ElementRef;

  @ViewChild('myReactiveRadioGroup', { static: true, read: ElementRef })
  myRadioGroup!: ElementRef;

  submitted = false;

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
      input.checkValidity();
      const textarea = this.myTextarea.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
      textarea.checkValidity();

      console.log('input.validationMessage in reactiveform', input.validationMessage, this.myInput.nativeElement.validity, this.myForm.controls.name.errors, this.myForm.controls.name.errors?.['invalidUrl']);

      if (this.myForm.controls.name.errors?.['invalidUrl']) { // TODO only when no other errors like built-in
        // this.myInput.nativeElement.setCustomValidity('invalid url...');
        input.setCustomValidity('invalid url...');
      } else {
        // this.myInput.nativeElement.setCustomValidity('');
        input.setCustomValidity('');
      }
    } else {
      // this.inputWithNgmodel.control.markAsUntouched();
      // this.inputWithNgmodel.control.markAsPristine();
      // this.textareaWithNgmodel.control.markAsUntouched();
      // this.textareaWithNgmodel.control.markAsPristine();
      // this.checkboxWithNgmodel.control.markAsUntouched();
      // this.checkboxWithNgmodel.control.markAsPristine();

      this.myForm.controls.name.markAsUntouched();
      this.myForm.controls.name.markAsPristine();
    }
  }

  // validateAllFormFields(formGroup: FormGroup) {
  //   console.log('validateall');//{1}
  //   Object.keys(formGroup.controls).forEach(field => {  //{2}
  //     const control = formGroup.get(field);
  //     console.log('control', control);//{3}
  //     if (control instanceof FormControl) {
  //       console.log('ifff');//{4}
  //       control.markAsTouched({ onlySelf: true });
  //       control.markAsDirty({ onlySelf: true });
  //      // control.registerOnChange();
  //     } /*else if (control instanceof FormGroup) {        //{5}
  //       this.validateAllFormFields(control);            //{6}
  //     }*/
  //   });
  // }

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

   // this.myInput.nativeElement.setCustomValidity('teeeest');

    Object.values(form.controls).forEach(control => {
      console.log('control in reactive', control);
      control.markAsTouched();
      control.updateValueAndValidity();
    });

    this.myCheckbox.nativeElement.internals.checkValidity();

    this.myRadioGroup.nativeElement.internals.checkValidity();

    // if (form.invalid) {
    //   return;
    // }
    if (form.valid) {
      alert('form submitted');
    } else {
      alert('form NOT submitted');
      // this.myForm.controls.name.markAsTouched();
      // this.myForm.markAllAsTouched();
     // this.validateAllFormFields(form); //{7}
    }
  }
}


@Component({
  selector: 'sla-template-form',
  // changeDetection: ChangeDetectionStrategy.OnPush,
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
      <!--{{ this.model.name }} {{ this.model.name.length }}-->
      <!--<div slot="value-missing">error message example</div>-->
      <!--<div>hint example</div>-->
      <!--<div *ngIf="inputWithNgmodel.formDirective">Field is required {{inputWithNgmodel.control | json}}</div>-->
      <!--<div *ngIf="inputWithNgmodel.hasError('required')">Field is required</div>-->
      <sl-label for="textarea-ngmodel-id">Description</sl-label>
      <sl-textarea id="textarea-ngmodel-id" [(ngModel)]="model.description" #textareaWithNgmodel="ngModel" (input)="onInput(textareaWithNgmodel);" name="description" minlength="8" required></sl-textarea>
      <sl-label for="checkboxWithNgmodel">Checkbox</sl-label>
      <sl-checkbox id="checkboxWithNgmodel" #checkboxWithNgmodel="ngModel" [(ngModel)]="model.approval" name="approval" (sl-change)="onChange(checkboxWithNgmodel)" required>my checkbox</sl-checkbox>
      (sl-change)="checkboxWithNgmodel.control.markAsUntouched(); checkboxWithNgmodel.control.markAsPristine()"
      <sl-label for="radio-group">Select option</sl-label>
      <sl-radio-group id="radio-group" #radioGroupWithNgmodel="ngModel" [(ngModel)]="model.option" name="option" required>
        <sl-radio value="1" (click)="onRadioValueChange($event.target)" (keydown)="onRadioValueChange($event.target)">One</sl-radio>
        <sl-radio value="2" (click)="onRadioValueChange($event.target)" (keydown)="onRadioValueChange($event.target)">Two</sl-radio>
        <sl-radio value="3" (click)="onRadioValueChange($event.target)" (keydown)="onRadioValueChange($event.target)">Three</sl-radio>
      </sl-radio-group>
      <sl-button type="submit" variant="primary">Submit</sl-button>
      <!--<sl-button type="reset" variant="primary" (click)="myForm.reset()">Reset</sl-button>-->
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
  // TODO: with custom validation
}) // TODO: after form submitted and after form control touched
// TODO slotted hint
export class TemplateFormComponent implements /*OnInit,*/ /*OnChanges,*/ AfterViewInit, AfterViewChecked/*, AfterContentChecked*/ {
  // model = new Person(1, 'John', 'Short description of John', false, { value: null, text: '' });
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

  // @Output() invalidEvent: EventEmitter<void> = new EventEmitter<void>();

  submitted = false;

  // ngOnInit(): void {
  //   console.log('ngoninit in form before if', this.submitted, this.myForm);
  //   if (!this.submitted && !!this.myForm) {
  //     this.inputWithNgmodel.control.markAsUntouched();
  //     this.inputWithNgmodel.control.markAsPristine();
  //     console.log('ngoninit in form');
  //     Object.values(this.myForm.controls).forEach(control => {
  //       control.markAsUntouched();
  //       control.markAsPristine();
  //     });
  //   }
  // }

  ngAfterViewInit() {
    //console.log('ngafterviewinit in form before if', this.submitted, this.myForm);

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

  ngAfterViewChecked() {
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
    console.log('event on radio change', event);
    this.model.option = event.value;
    // this.model.option.text = event.textContent;
  }

  onSubmit(event: Event, model: Person, form: NgForm): void {
    console.log('on submit submitted', form.submitted, event);
    console.log('this.myForm.form.validator', this.myForm.form.validator, this.inputWithNgmodel.control.validator, this.model.name);

    event.preventDefault();

    this.submitted = true;

    this.myForm.form.markAllAsTouched();

    //this.onInput();
   // const input = this.myInputRef.nativeElement.querySelector('input') as HTMLInputElement;

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
    // this.myRadioGroupRef.nativeElement.checkValidity();
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

// TODO: validation required report form story example

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
      declarations: [CheckboxComponent, InputComponent, ReactiveFormComponent, TemplateFormComponent, TextareaComponent],
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

export const TemplateDrivenForm: StoryFn = () => ({
  template: `<sla-template-form></sla-template-form>`,
});
