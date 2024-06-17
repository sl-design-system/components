import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';

interface Props {
  value: string;
}

type Story = StoryObj<Props>;

export default {
  title: 'Form/Editor',
  tags: ['draft'],
  render: ({ value }) => {
    return html`<sl-editor .value=${value}></sl-editor>`;
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
