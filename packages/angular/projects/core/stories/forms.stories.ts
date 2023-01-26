/*
<sl-label for="checkbox">Checkbox</sl-label>
  <sl-checkbox id="checkbox" name="checkbox" value="checkbox">Checkbox</sl-checkbox>*/


//import { moduleMetadata } from '@storybook/angular';
import type { Meta, StoryObj } from '@storybook/angular';
//import { CommonModule } from '@angular/common';

// import { Checkbox } from '@sanomalearning/slds-core/checkbox';
import {CheckboxDirective} from '../src/checkbox/checkbox.directive';
//import { html } from 'lit';
//import '../label/register.js';
//import './register.js';

export default {
  title: 'Checkbox',
  component: CheckboxDirective,
};

export const API: StoryObj = {
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
    text: 'Toggle me',
    value: '12345'
  },
/*  render: ({ checked, disabled, indeterminate, text, value }) => html`
    <sl-checkbox ?checked=${checked} ?disabled=${disabled} .indeterminate=${indeterminate} .value=${value}
      >${text}</sl-checkbox
    >
  `*/
};

export const Indeterminate: StoryObj = {
  args: {
    indeterminate: true
},
  // render: () => html`<sl-checkbox indeterminate>Indeterminate</sl-checkbox>`
};

/*export const NoText: StoryObj = {
  render: () => html`<sl-checkbox aria-label="Hello world"></sl-checkbox>`
};

export const Overflow: StoryObj = {
  render: () => html`
    <sl-checkbox
      >Elit consectetur duis nisi id veniam id deserunt cupidatat. Consectetur consectetur consequat ea proident nulla
      consectetur anim incididunt esse magna eu. In est cupidatat ea veniam exercitation irure ullamco nisi proident
      enim.</sl-checkbox
    >
  `
};*/

