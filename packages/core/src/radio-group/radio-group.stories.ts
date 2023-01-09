import type { RadioGroup } from './radio-group.js';
import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../button/register.js';
import './register.js';

export default {
  title: 'Radio group'
};

export const API: StoryObj = {
  args: {
    disabled: false,
    orientation: 'vertical'
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical']
    },
    value: {
      control: 'inline-radio',
      options: ['1', '2', '3']
    }
  },
  render: ({ disabled, orientation, value }) => html`
    <sl-radio-group ?disabled=${disabled} .orientation=${orientation} .value=${value}>
      <sl-radio value="1">One</sl-radio>
      <sl-radio value="2">Two</sl-radio>
      <sl-radio value="3">Three</sl-radio>
    </sl-radio-group>
  `
};

export const Disabled: StoryObj = {
  render: () => html`
    <sl-radio-group>
      <sl-radio value="1">One</sl-radio>
      <sl-radio disabled value="2">Two (disabled)</sl-radio>
      <sl-radio value="3">Three</sl-radio>
      <sl-radio disabled value="4">Four (disabled)</sl-radio>
    </sl-radio-group>
  `
};

export const Selected: StoryObj = {
  render: () => html`
    <sl-radio-group value="2">
      <sl-radio value="1">One</sl-radio>
      <sl-radio value="2">Two</sl-radio>
      <sl-radio value="3">Three</sl-radio>
    </sl-radio-group>
  `
};

export const Label: StoryObj = {
  render: () => html`
    <style>
      div {
        display: flex;
        flex-direction: column;
      }
    </style>
    <div>
      <sl-label for="radio-group">How many pets do you have?</sl-label>
      <sl-radio-group id="radio-group">
        <sl-radio value="0">None</sl-radio>
        <sl-radio value="1">One</sl-radio>
        <sl-radio value="2">Two</sl-radio>
        <sl-radio value="3">Three</sl-radio>
      </sl-radio-group>
    </div>
  `
};

export const Hint: StoryObj = {
  render: () => html`
    <style>
      div {
        display: flex;
        flex-direction: column;
      }
    </style>
    <div>
      <sl-label for="radio-group">How many pets do you have?</sl-label>
      <sl-radio-group id="radio-group" hint="Fish count as well.">
        <sl-radio value="0">None</sl-radio>
        <sl-radio value="1">One</sl-radio>
        <sl-radio value="2">Two</sl-radio>
        <sl-radio value="3">Three</sl-radio>
      </sl-radio-group>
    </div>
  `
};

export const RichLabelHint: StoryObj = {
  render: () => html`
    <style>
      div:not([slot]) {
        display: flex;
        flex-direction: column;
      }
    </style>
    <div>
      <sl-label for="radio-group">
        <label slot="label">Custom <i>label</i></label>
      </sl-label>
      <sl-radio-group id="radio-group">
        <sl-radio value="0">None</sl-radio>
        <sl-radio value="1">One</sl-radio>
        <sl-radio value="2">Two</sl-radio>
        <sl-radio value="3">Three</sl-radio>
        <div slot="hint">
          Hint is an accessible way to provide <strong>additional information</strong> that might help the user
        </div>
      </sl-radio-group>
    </div>
  `
};

export const Required: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as RadioGroup)?.reportValidity();
    };

    return html`
      <sl-radio-group required>
        <sl-radio value="1">One</sl-radio>
        <sl-radio value="2">Two</sl-radio>
        <sl-radio value="3">Three</sl-radio>
      </sl-radio-group>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};

export const CustomValidation: StoryObj = {
  render: () => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.previousElementSibling as RadioGroup)?.reportValidity();
    };

    return html`
      <sl-radio-group required>
        <sl-radio value="1">One</sl-radio>
        <sl-radio value="2">Two</sl-radio>
        <sl-radio value="3">Three</sl-radio>
        <div slot="value-missing">This is the custom value-missing message (for the required attribute).</div>
      </sl-radio-group>
      <sl-button @click=${onClick}>Validate</sl-button>
    `;
  }
};
