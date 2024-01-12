import { ReactiveFormsModule } from '@angular/forms';
import type { StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '../src/forms/forms.module';

export default {
  title: 'Forms/Fields/Reactive',
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [FormsModule, ReactiveFormsModule]
    })
  ]
};

export const Checkbox: StoryObj = {
  render: () => ({
    template: ``
  })
};

export const CheckboxGroup: StoryObj = {
  render: () => ({
    template: ``
  })
};

export const RadioGroup: StoryObj = {
  render: () => ({
    template: ``
  })
};

export const Select: StoryObj = {
  render: () => ({
    template: ``
  })
};

export const TextField: StoryObj = {
  render: () => ({
    template: ``
  })
};

export const Textarea: StoryObj = {
  render: () => ({
    template: ``
  })
};
