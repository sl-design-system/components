import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../register.js';
import { type Editor } from './editor.js';

type Props = Pick<Editor, 'disabled' | 'toolbar' | 'value'> & { hint?: string; label?: string };
type Story = StoryObj<Props>;

export default {
  title: 'Form/Editor',
  tags: [/*'!dev',*/ 'draft'],
  args: {
    disabled: false,
    label: 'Label',
    toolbar: true
  },
  argTypes: {
    toolbar: { control: 'boolean' }
  },
  parameters: {
    // Disables Chromatic's snapshotting on a story level
    chromatic: { disableSnapshot: true }
  },
  render: ({ disabled, hint, label, toolbar, value }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          <sl-editor ?disabled=${disabled} .toolbar=${toolbar} .value=${value}></sl-editor>
        </sl-form-field>
        <sl-button-bar>
          <sl-button @click=${onClick}>Report validity</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
} satisfies Meta<Props>;

const richContent = `
  <h1>Rich Text Editor</h1>
  <p>This component is a <em>rich text editor</em> based on the <a href="https://prosemirror.net/" target="_blank">ProseMirror</a> library.</p>
  <p>It has support for the following editor actions:</p>
  <ul>
    <li><p>Typography: <strong>bold</strong>, <em>italic</em>, <u>underline</u> and <del>strikethrough</del></p></li>
    <li><p>Format: paragraph, quotation and headings</p></li>
    <li><p>Lists: ordered or unordered</p></li>
    <li><p>Inline code: <code>const x = 1;</code></p></li>
    <li><p>History: undo and redo</p></li>
  </ul>
`;

export const Basic: Story = {
  args: {
    value: richContent
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};

export const NoToolbar: Story = {
  args: {
    ...Basic.args,
    toolbar: false
  }
};

export const Empty: Story = {
  args: {
    toolbar: true
  }
};
