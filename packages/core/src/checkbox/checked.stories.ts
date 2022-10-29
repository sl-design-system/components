import { StoryObj } from "@storybook/web-components";
import { html } from "lit";

export default {
  title: 'Checkbox'
};

export const API: StoryObj = {
  args: {
    checked: false,
    disabled: false,
    value: '12345'
  },
  render: ({ checked, disabled, value }) => html`
    <sl-checkbox ?checked=${checked} ?disabled=${disabled} .value=${value}>Hello world</sl-checkbox>
  `
};
