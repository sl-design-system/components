import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type Editor } from './editor.js';

type Props = Pick<Editor, 'disabled' | 'value'> & { hint?: string; label?: string };
type Story = StoryObj<Props>;

export default {
  title: 'Form/Editor',
  tags: ['draft'],
  args: {
    disabled: false,
    label: 'Label'
  },
  render: ({ disabled, hint, label, value }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          <sl-editor ?disabled=${disabled} .value=${value}></sl-editor>
        </sl-form-field>
        <sl-button-bar>
          <sl-button @click=${onClick}>Report validity</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {
  args: {
    value: `
      <h1>Rich Text Editor</h1>
      <p>This component is a <em>rich text editor</em> based on the <a href="https://prosemirror.net/" target="_blank">ProseMirror</a> library.</p>
      <p>It has support for the following editor actions:</p>
      <ul>
        <li><p>Typography: <strong>bold</strong>, <em>italic</em>, <u>underline</u> and <del>strikethrough</del></p></li>
        <li><p>Format: paragraph, quotation and headings</p></li>
        <li><p>Alignment: left, right or center</p></li>
        <li><p>Lists: ordered or unordered</p></li>
        <li><p>Indentation: indent and outdent</p></li>
        <li><p>Insert links</p></li>
      </ul>
    `
  }
};

export const Disabled: Story = {
  args: {
    ...Basic.args,
    disabled: true
  }
};
