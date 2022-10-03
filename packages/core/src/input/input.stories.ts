import { Story } from '@storybook/web-components';
import { html } from 'lit';
import '../button-bar/register.js';
import './register.js';

export default {
  title: 'Input'
};

export const API: Story = {
  args: {
    fill: 'solid',
    size: 'md',
    text: 'Button',
    variant: 'primary'
  },
  render: ({ /*fill, size, text, variant*/ }) => html`
    <form>
        <label id="input-1" for="input-2">label</label>
          <sl-input id="input-2" placeholder="placeholder"></sl-input>
    </form>
  `
};

export const InputTest: Story = {
  render: () => html`
    <form>
      <label for="test1">label</label>
      <sl-input id="test1"></sl-input>
    </form>
  `
};

export const InputTest3: Story = {
  render: () => html`
    <form id="formId">
      <label for="test3">label 3</label>
      <sl-input id="test3" placeholder="placeholder"></sl-input>
    </form>
  `
};

export const InputTest4: Story = {
  render: () => html`
    <form id="formId4">
      <label id="test4" for="test5">label 4</label>
      <sl-input id="test5" placeholder="placeholder"></sl-input>
    </form>
    <label for="my-input">Label</label>
    <input id="my-input">
    <label for='label_for'>Enter search text </label>
    <input type='text' id='label_for'>
  `
};

export const Test: Story = {
  render: () => html`
    <form id="formId5">
      <label for="my-input5">Label in form</label>
      <sl-input id="my-input5"
                custom-error-display
                type="text"
                required
                minlength="5"
                data-tooShort="Type at least 5 characters"
                data-valueMissing="This field is required">
      </sl-input>
      <div class="error-message"></div>
      <!--<button type="submit" onClick="noRefCheck(){}">Send</button>-->
    </form>
    <label for="my-input6">Label</label>
    <sl-input id="my-input6"></sl-input>
  `
  // onclick="withPreventDefault({action : onClick})"
};

/*const withPreventDefault = ({action}: { action: any }) => (e: Event) => {
  e.preventDefault();
  return action(e);
};*/
