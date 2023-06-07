import type { Meta } from '@storybook/angular';
import '@sl-design-system/label/register.js';
import '@sl-design-system/button/register.js';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { moduleMetadata, StoryFn } from '@storybook/angular';
import { FormsModule as CoreFormsModule } from '../src/forms/forms.module';

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
    <form [formGroup]="myForm" (ngSubmit)="onSubmit(myForm)">
      <sl-label for="name-input">Name</sl-label>
      <sl-text-input id="name-input" formControlName="name" placeholder="Your name" minlength="8" required></sl-text-input>
      <sl-label for="description-id">Description</sl-label>
      <sl-textarea id="description-id" formControlName="description" placeholder="Add short description here"></sl-textarea>
      <sl-label for="approval-id">Approval</sl-label>
      <sl-checkbox id="approval-id" formControlName="approval">Check me</sl-checkbox>
      <sl-label for="radio-group-options">Select option</sl-label>
      <sl-radio-group id="radio-group-options">
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
export class ReactiveFormComponent {
  myForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl('Short description'),
    approval: new FormControl(true),
    option: new FormControl()
  });

  onSubmit(form: FormGroup) {
    console.log('form on submit', form);
    alert(`form submit: Name: ${form.value.name},
          Description: ${form.value.description},
          Approval: ${form.value.approval},
          Option: ${form.value.option},
          form-invalid: ${form.invalid}`);

    // form.addValidators(() => )

    // if (form.invalid) {
    //   return;
    // }
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
    <form (ngSubmit)="onSubmit(model)">
      <sl-label for="my-value">Name</sl-label>
      <sl-text-input id="my-value" [(ngModel)]="model.name" name="name"></sl-text-input>
      <sl-label for="textarea-ngmodel-id">Description</sl-label>
      <sl-textarea id="textarea-ngmodel-id" [(ngModel)]="model.description" name="description"></sl-textarea>
      <sl-label for="checkbox-with-ngmodel">Checkbox</sl-label>
      <sl-checkbox id="checkbox-with-ngmodel" [(ngModel)]="model.approval" name="approval">my checkbox</sl-checkbox>
      <sl-label for="radio-group">Select option</sl-label>
      <sl-radio-group id="radio-group" [(ngModel)]="model.option" name="option">
        <sl-radio value="1" (click)="onRadioValueChange($event.target)" (keydown)="onRadioValueChange($event.target)">One</sl-radio>
        <sl-radio value="2" (click)="onRadioValueChange($event.target)" (keydown)="onRadioValueChange($event.target)">Two</sl-radio>
        <sl-radio value="3" (click)="onRadioValueChange($event.target)" (keydown)="onRadioValueChange($event.target)">Three</sl-radio>
      </sl-radio-group>
      <sl-button type="submit" variant="primary">Submit</sl-button>
      <div>Name: <i>{{model.name}}</i></div>
      <div>Description: <i>{{model.description}}</i></div>
      <div>Approval: <i>{{model.approval}}</i></div>
      <div>Option: text: <i>{{model.option.text}}</i> value: <i>{{model.option.value}}</i></div>
    </form>
  `
})
export class TemplateFormComponent {
  model = new Person(1, 'John', 'Short description of John', false, { value: null, text: '' });

  onRadioValueChange(event: any): void {
    this.model.option.value = event.value;
    this.model.option.text = event.textContent;
  }

  onSubmit(model: Person): void {
    alert(`form submit: Name: ${model.name},
          Description: ${model.description},
          Approval: ${model.approval},
          Option: ${model.option.value} ${model.option.text}`);
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
