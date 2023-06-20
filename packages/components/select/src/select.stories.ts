import type { StoryObj } from '@storybook/web-components';
import '@sl-design-system/avatar/register.js';
import '@sl-design-system/label/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/text-input/register.js';
import { html } from 'lit';
import '../register.js';

const onSubmit = (event: Event & { target: HTMLFormElement }): void => {
  const data = new FormData(event.target),
    output = (event.target.nextElementSibling || document.createElement('pre')) as HTMLOutputElement;

  event.preventDefault();
  event.target.after(output);

  output.textContent = '';
  data.forEach((value, key) => (output.textContent += `${key}: ${value.toString()}\n`));
};

export default {
  title: 'Select',
  argTypes: {
    maxOverlayHeight: {
      control: 'text'
    }
  }
};

export const API: StoryObj = {
  args: {
    maxOverlayHeight: '200px'
  },
  render: ({ maxOverlayHeight }) => html`
    <style>
      sl-select {
        width: 400px;
      }
    </style>
    <sl-button>To focus</sl-button>
    <sl-select maxOverlayHeight=${maxOverlayHeight}>
      <sl-select-option-group group-title="Happy">
        <sl-select-option>😄 Grinning Face with Smiling Eyes</sl-select-option>
        <sl-select-option selected>😂 Face with Tears of Joy</sl-select-option>
        <sl-select-option>😊 Smiling Face with Smiling Eyes</sl-select-option>
        <sl-select-option>🤩 Star-Struck</sl-select-option>
        <sl-select-option disabled>🙂 Slightly Smiling Face</sl-select-option>
        <sl-select-option>🥳 Partying Face</sl-select-option>
      </sl-select-option-group>
      <sl-select-option-group group-title="Sad">
        <sl-select-option>😒 Unamused Face</sl-select-option>
        <sl-select-option>🤧 Sneezing Face</sl-select-option>
        <sl-select-option>😓 Downcast Face with Sweat</sl-select-option>
        <sl-select-option>😡 Enraged Face</sl-select-option>
      </sl-select-option-group>
      <sl-select-option>🤖 Robot</sl-select-option>
    </sl-select>
    <sl-button>To focus</sl-button>
  `
};

export const CustomComponents: StoryObj = {
  render: () => html`
    <style>
      sl-avatar {
        margin: 0 4px;
      }
    </style>
    <sl-button>To focus</sl-button>
    <sl-select>
      <sl-select-option><sl-avatar uniqueProfileId="1"></sl-avatar></sl-select-option>
      <sl-select-option selected><sl-avatar uniqueProfileId="2"></sl-avatar></sl-select-option>
      <sl-select-option><sl-avatar uniqueProfileId="3"></sl-avatar></sl-select-option>
      <sl-select-option><sl-avatar uniqueProfileId="14"></sl-avatar></sl-select-option>
      <sl-select-option disabled><sl-avatar uniqueProfileId="bla"></sl-avatar></sl-select-option>
      <sl-select-option><sl-avatar uniqueProfileId="xxs"></sl-avatar></sl-select-option>
    </sl-select>
    <sl-button>To focus</sl-button>
  `
};

export const InForm: StoryObj = {
  render: () => html`
    <style>
      form {
        display: grid;
        gap: 1rem 0.5rem;
        grid-template-columns: auto 1fr;
      }

      sl-label:has(+ :where(sl-select)) {
        --_line-height: 32px;
      }

      sl-button-bar {
        grid-column: 1 / 3;
      }
    </style>
    <form @submit=${onSubmit}>
      <sl-label for="smiley">Smiley</sl-label>
      <sl-select id="smiley" name="smiley" required>
        <sl-select-option>😍 Option 1 </sl-select-option>
        <sl-select-option>🥸 Option 2 </sl-select-option>
        <sl-select-option>🤔 Option 3 </sl-select-option>
        <sl-select-option>😅 Option 4 </sl-select-option>
        <sl-select-option disabled>🤪 Option 5 </sl-select-option>
        <sl-select-option>🫣 Option 6 </sl-select-option>
      </sl-select>

      <sl-label for="avatar">Avatar</sl-label>
      <sl-select id="avatar" name="avatar">
        <sl-select-option value="1"><sl-avatar uniqueProfileId="1"></sl-avatar></sl-select-option>
        <sl-select-option value="2" selected><sl-avatar uniqueProfileId="2"></sl-avatar></sl-select-option>
        <sl-select-option value="3"><sl-avatar uniqueProfileId="3"></sl-avatar></sl-select-option>
        <sl-select-option value="14"><sl-avatar uniqueProfileId="14"></sl-avatar></sl-select-option>
        <sl-select-option value="bla" disabled><sl-avatar uniqueProfileId="bla"></sl-avatar></sl-select-option>
        <sl-select-option value="xxs"><sl-avatar uniqueProfileId="xxs"></sl-avatar></sl-select-option>
      </sl-select>

      <sl-label for="mood">Your mood</sl-label>
      <sl-select id="mood" name="mood">
        <sl-select-option-group group-title="Happy">
          <sl-select-option>😄 Grinning Face with Smiling Eyes</sl-select-option>
          <sl-select-option>😂 Face with Tears of Joy</sl-select-option>
          <sl-select-option>😊 Smiling Face with Smiling Eyes</sl-select-option>
          <sl-select-option>🤩 Star-Struck</sl-select-option>
          <sl-select-option disabled>🙂 Slightly Smiling Face</sl-select-option>
          <sl-select-option>🥳 Partying Face</sl-select-option>
        </sl-select-option-group>
        <sl-select-option-group group-title="Sad">
          <sl-select-option>😒 Unamused Face</sl-select-option>
          <sl-select-option>🤧 Sneezing Face</sl-select-option>
          <sl-select-option>😓 Downcast Face with Sweat</sl-select-option>
          <sl-select-option>😡 Enraged Face</sl-select-option>
        </sl-select-option-group>
        <sl-select-option>🤖 Robot</sl-select-option>
      </sl-select>

      <sl-button-bar align="end">
        <sl-button type="reset">Reset</sl-button>
        <sl-button type="submit">Submit</sl-button>
      </sl-button-bar>
    </form>
  `
};
