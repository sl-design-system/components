import type { Meta } from '@storybook/angular';
import '@sl-design-system/label/register.js';
import '@sl-design-system/button/register.js';
import {
  AbstractControl,
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
  CUSTOM_ELEMENTS_SCHEMA, EventEmitter,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  Output, ElementRef, Renderer2
} from '@angular/core';
import { moduleMetadata, StoryFn } from '@storybook/angular';
import { FormsModule as CoreFormsModule } from '../src/forms/forms.module';
import {InputDirective} from "../src/forms";
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
    <form [formGroup]="myForm" (ngSubmit)="onSubmit(myForm)">
      <sl-label for="name-input">Name</sl-label>
      <sl-text-input id="name-input" formControlName="name" placeholder="Your name" hint="this is a hint for the text input" minlength="8" required></sl-text-input>
      <sl-label for="description-id">Description</sl-label>
      <sl-textarea id="description-id" formControlName="description" placeholder="Add short description here" required>
        <div slot="value-missing">This is the custom value-missing message (for the required attribute).</div>
      </sl-textarea>
      <sl-label for="approval-id">Approval</sl-label>
      <sl-checkbox id="approval-id" formControlName="approval" required>Check me</sl-checkbox>
      <sl-label for="radio-group-options">Select option</sl-label>
      <sl-radio-group id="radio-group-options">
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
})
export class ReactiveFormComponent {
  myForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(8), Validators.required, ValidateUrl]), // , [Validators.minLength(8), Validators.required]
    description: new FormControl('Short description', Validators.required),
    approval: new FormControl(false, Validators.requiredTrue),
    option: new FormControl()
  });

  // ValidateUrl(control: AbstractControl) {
  //   if (!control.value.startsWith('https') || !control.value.includes('.io')) {
  //     return { invalidUrl: true };
  //   }
  //   return null;
  // }

  validateAllFormFields(formGroup: FormGroup) {
    console.log('validateall');//{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);
      console.log('control', control);//{3}
      if (control instanceof FormControl) {
        console.log('ifff');//{4}
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
       // control.registerOnChange();
      } /*else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }*/
    });
  }

  onSubmit(form: FormGroup) {
    console.log('form on submit', form, form.valid, form.controls);
    // form.markAsTouched();
    // alert(`form submit: Name: ${form.value.name},
    //       Description: ${form.value.description},
    //       Approval: ${form.value.approval} ${form.value.approval.valid},
    //       Option: ${form.value.option},
    //       form-invalid: ${form.invalid}`);

    // form.addValidators(() => )

    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });

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
    <form #myForm="ngForm" (ngSubmit)="onSubmit(model, myForm)">
      <sl-label for="my-value">Name</sl-label>
      <sl-text-input id="my-value" placeholder="type at least 8 characters" [(ngModel)]="model.name" (input)="onInput($event);" #inputWithNgmodel="ngModel" name="name" minlength="8" required></sl-text-input>
      {{ this.model.name }} {{ this.model.name.length }}
      <div>error message example</div>
      <div>hint example</div>
      <div *ngIf="inputWithNgmodel.hasError('required')">Field is required</div>
      <sl-label for="textarea-ngmodel-id">Description</sl-label>
      <sl-textarea id="textarea-ngmodel-id" [(ngModel)]="model.description" name="description"></sl-textarea>
      <sl-label for="checkboxWithNgmodel">Checkbox</sl-label>
      <sl-checkbox id="checkboxWithNgmodel" #checkboxWithNgmodel="ngModel" [(ngModel)]="model.approval" name="approval" required>my checkbox</sl-checkbox>
      (change)="checkboxWithNgmodel.control.markAsUntouched(); checkboxWithNgmodel.control.markAsPristine()"
      <sl-label for="radio-group">Select option</sl-label>
      <sl-radio-group id="radio-group" [(ngModel)]="model.option" name="option">
        <sl-radio value="1" (click)="onRadioValueChange($event.target)" (keydown)="onRadioValueChange($event.target)">One</sl-radio>
        <sl-radio value="2" (click)="onRadioValueChange($event.target)" (keydown)="onRadioValueChange($event.target)">Two</sl-radio>
        <sl-radio value="3" (click)="onRadioValueChange($event.target)" (keydown)="onRadioValueChange($event.target)">Three</sl-radio>
      </sl-radio-group>
      <sl-button type="submit" variant="primary">Submit</sl-button>
      <sl-button type="reset" variant="primary" (click)="myForm.reset()">Reset</sl-button>
      <div>
        Name: <i>{{model.name}}</i> valid? {{inputWithNgmodel.valid}}
        <strong>errors?</strong> {{inputWithNgmodel.control.errors | json}}
        <strong>touched?</strong> {{inputWithNgmodel.control.touched }}
        <strong>pristine?</strong> {{inputWithNgmodel.control.pristine }}
      </div>
      <div>Description: <i>{{model.description}}</i></div>
      <div>Approval: <i>{{model.approval}}</i> valid? {{checkboxWithNgmodel.valid}}</div><i>errors? {{checkboxWithNgmodel.control.errors | json}}</i>
      <div>Option: text: <i>{{model.option.text}}</i> value: <i>{{model.option.value}}</i></div>
      <div>Form submitted: {{myForm.submitted}}</div>
      <div>Form valid: {{myForm.valid}}</div>
      <div>Form validator: {{myForm.form.errors| json}}</div>
    </form>
  `
}) // TODO: after form submitted and after form control touched
// TODO: reportvalidity ?
export class TemplateFormComponent implements OnInit, /*OnChanges,*/ AfterViewInit, AfterViewChecked {
  // model = new Person(1, 'John', 'Short description of John', false, { value: null, text: '' });
  model = new Person(1, '', 'Short description of John', false, { value: null, text: '' });

  @ViewChild('myForm', { static: false }) myForm!: NgForm;

  @ViewChild('inputWithNgmodel', { static: false }) inputWithNgmodel!: NgModel;

 // @ViewChild('inputWithNgmodel') myInputRef!: ElementRef;

  @ViewChild('inputWithNgmodel', { static: true, read: ElementRef })
  myInputRef!: ElementRef<HTMLInputElement>;

  @Output() invalidEvent: EventEmitter<void> = new EventEmitter<void>();

  submitted = false;

  constructor(private renderer: Renderer2) {
  }

  ngOnInit(): void {
    // if (this.myForm.submitted) {
    //   Object.values(form.controls).forEach(control => {
    //     control.markAsTouched();
    //   })
    // }
    console.log('ngoninit in form before if', this.submitted, this.myForm);

    if (!this.submitted && !!this.myForm) {
      this.inputWithNgmodel.control.markAsUntouched();
      this.inputWithNgmodel.control.markAsPristine();
      console.log('ngoninit in form');
      Object.values(this.myForm.controls).forEach(control => {
        control.markAsUntouched();
        control.markAsPristine();
      });
    }

    // this.inputWithNgmodel?.valueChanges.subscribe(value => {
    //   console.log('inputWithNgmodel?.valueChanges.subscribe', value); // Handle the form control value changes
    // });
  }

/*  onChange(e: Event) {
    console.log('ngonchanges in form before if', this.submitted, this.myForm);

    // let whatChanged = e.target.getAttribute('ng-reflect-name');
    // let newValue = this[whatChanged];
    // console.log('onchange____checkbox', whatChanged, newValue, e.target);
    // (e.target as FormControl).markAsUntouched();
    // (e.target as FormControl).markAsPristine();
    // checkboxWithNgmodel.control.markAsUntouched(); checkboxWithNgmodel.control.markAsPristine()
    e.preventDefault();
    if (!this.submitted && !!this.myForm) {
      this.inputWithNgmodel.control.markAsUntouched();
      this.inputWithNgmodel.control.markAsPristine();
      Object.values(this.myForm.controls).forEach(control => {
        control.markAsUntouched();
        control.markAsPristine();
        //control.updateValueAndValidity();
      });
    }
  }*/

  ngAfterViewInit() {
    console.log('ngafterviewinit in form before if', this.submitted, this.myForm);

   // e.preventDefault();

    this.myForm.form.markAsUntouched();

    Object.values(this.myForm.controls).forEach(control => {
      control.markAsUntouched();
      control.markAsPristine();
    });

    if (!this.submitted && !!this.myForm) {
      console.log('ngafterviewinit in form', this.myForm.form.controls, this.myForm.controls, Array.of(this.myForm.controls), this.inputWithNgmodel);
      this.inputWithNgmodel.control.markAsUntouched();
      this.inputWithNgmodel.control.markAsPristine();
      Object.values(this.myForm.form.controls).forEach(control => {
        console.log('ngafterviewinit in form for each', this.myForm.form.controls, this.myForm.controls, control);
        control.markAsUntouched();
        control.markAsPristine();
      });
    }
  }

  ngAfterViewChecked() {
    console.log('ngafterviewchecked in form before if', this.submitted, this.myForm);

    // if (this.submitted) {
    //   Object.values(this.myForm.controls).forEach(control => {
    //     console.log('control on ngafterviewchecked after submit', control);
    //     control.markAsTouched();
    //     control.markAsDirty();
    //     control.updateValueAndValidity();
    //   });
    // }
  }

  onInput(event: Event): void {
    console.log('oninput event', event.target, this.submitted, this.myForm, !this.submitted, !this.submitted && !!this.myForm);
    console.log('oninput event check condition', !this.submitted && !!this.myForm);

    // if (!this.submitted) {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   this.inputWithNgmodel.control.markAsUntouched();
    //   this.inputWithNgmodel.control.markAsPristine();
    //   return;
    // }

   // this.inputWithNgmodel.control.updateValueAndValidity();

    // event.preventDefault();
    // event.stopPropagation();
    //
    if (!this.submitted /*&& !!this.myForm*/) {
      console.log('oninput event inside if');
      this.inputWithNgmodel.control.markAsUntouched();
      this.inputWithNgmodel.control.markAsPristine();
      Object.values(this.myForm.controls).forEach(control => {
        console.log('oninput event inside for each');
        //control.errors = {};
        control.markAsUntouched();
        control.markAsPristine();
       //control.clearValidators();
        // control.updateValueAndValidity();
      });
    } else {
      console.log('oninput event inside else');
      this.inputWithNgmodel.control.markAsTouched();
      this.inputWithNgmodel.control.markAsDirty();
      this.inputWithNgmodel.control.updateValueAndValidity();
    }
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   console.log('changes in ngonchanges', changes);
  // }

  onRadioValueChange(event: any): void {
    this.model.option.value = event.value;
    this.model.option.text = event.textContent;
  }

  validateAllFormFields(form: NgForm) {
    console.log('validateall', form.controls);//{1}

   // form.controls.name.updateValueAndValidity({ emitEvent: true });

    // Object.keys(form.controls).forEach(field =>
    // field.markAsTouched());
    // Object.keys(formGroup.controls).forEach(field => {  //{2}
    //   const control = formGroup.get(field);
    //   console.log('control', control);//{3}
    //   if (control instanceof FormControl) {
    //     console.log('ifff');//{4}
    //     control.markAsTouched({ onlySelf: true });
    //     control.markAsDirty({ onlySelf: true });
    //   } /*else if (control instanceof FormGroup) {        //{5}
    //     this.validateAllFormFields(control);            //{6}
    //   }*/
    // });
  }

  onSubmit(model: Person, form: NgForm): void {
    // alert(`form submit: Name: ${model.name},
    //       Description: ${model.description},
    //       Approval: ${model.approval},
    //       Option: ${model.option.value} ${model.option.text}`);
    // form.controls.markAsTouched();

    requestAnimationFrame(() => {

    this.submitted = true;

    // this.inputWithNgmodel.control.updateValueAndValidity();

    Object.values(form.controls).forEach(control => {
      console.log('control on submit', control);
      control.markAsTouched();
      control.markAsDirty();
      control.updateValueAndValidity();
    });

    this.inputWithNgmodel.control.markAsTouched();
    this.inputWithNgmodel.control.markAsDirty();
    this.inputWithNgmodel.control.updateValueAndValidity();

    });

    // this.onInput(this.inputWithNgmodel.control.value);

    //this.renderer.setProperty(this.myInputRef.nativeElement, 'validity', {valid: false});

    //this.invalidEvent.emit();

    //this.inputWithNgmodel.dispatchEvent(new Event('invalid'));
    // (this.inputWithNgmodel as ElementRef).nativeElement.dispatchEvent(new Event('invalid'));
    // this.myInputRef.nativeElement?.dispatchEvent(new Event('invalid'));
/*    console.log('this.myInputRef.nativeElement on submit', this.myInputRef);
    this.myInputRef.nativeElement.dispatchEvent(new Event('invalid', { bubbles: true }));*/

   // this.inputWithNgmodel.control.registerOnChange(() => {});


    // this.inputWithNgmodel.viewToModelUpdate(this.inputWithNgmodel.control.value);

    alert(`form submit: Name: ${model.name},
          Description: ${model.description},
          Approval: ${model.approval},
          Option: ${model.option.value} ${model.option.text}`);

    // this.submitted = true;

    if (form.valid) {
      alert('form submitted');
    } else {
      // this.validateAllFormFields(form); //{7}
      // Object.values(form.controls).forEach(control => {
      //   control.markAsTouched();
      // });
      // form.form.updateValueAndValidity();
      alert('form is not valid');
    }

    // if (form.valid) {
    //   alert('form is valid and would be submitted');
    // } else {
    //   alert('form is not valid and would not be submitted');
    // }
  }
}

export class Person {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public approval: boolean,
    public option: { value: null, text: '' }
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
