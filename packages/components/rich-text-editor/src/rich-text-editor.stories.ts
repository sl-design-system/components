import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import './register.js';
import { type RichTextEditor } from './rich-text-editor.js';

type Props = Pick<
  RichTextEditor,
  'disabled' | 'features' | 'maxLength' | 'placeholder' | 'readonly' | 'required' | 'value'
> & {
  footer?: string;
  hint?: string;
  label?: string;
};
type Story = StoryObj<Props>;

const lesson = `
  <h2>Photosynthesis in three steps</h2>
  <p>Plants turn <strong>light energy</strong> into chemical energy. Read <a href="https://example.com/chapter-4-2">chapter 4.2</a> before class and note <em>where</em> each step happens.</p>
  <ul>
    <li><p>Light absorption in the chlorophyll</p></li>
    <li><p>Splitting water, releasing oxygen</p></li>
    <li><p>Building glucose in the Calvin cycle</p></li>
  </ul>
  <blockquote><p>Tip: type <code>- </code> or <code>1. </code> to start a list.</p></blockquote>
`;

const checklist = `
  <h2>Before Thursday</h2>
  <p>Work through these in order. Ask in the class chat if you get stuck.</p>
  <ul data-type="task-list">
    <li data-task="a" data-checked="true"><p>Read chapter 4.2</p></li>
    <li data-task="b" data-checked="true"><p>Watch the leaf experiment video</p></li>
    <li data-task="c" data-checked="false">
      <p>Answer questions 1–5</p>
      <ul data-type="task-list">
        <li data-task="d" data-checked="false"><p>Explain where oxygen comes from</p></li>
        <li data-task="e" data-checked="false"><p>Draw the Calvin cycle</p></li>
      </ul>
    </li>
    <li data-task="f" data-checked="false"><p>Upload your answers</p></li>
  </ul>
`;

export default {
  title: 'Form/Rich text editor',
  tags: ['draft'],
  args: {
    disabled: false,
    label: 'Lesson description',
    readonly: false,
    required: false
  },
  argTypes: {
    features: { control: 'text' },
    maxLength: { control: 'number' },
    placeholder: { control: 'text' }
  },
  render: ({
    disabled,
    features,
    footer,
    hint,
    label,
    maxLength,
    placeholder,
    readonly,
    required,
    value
  }) => {
    const onClick = (event: Event & { target: HTMLElement }): void => {
      event.target.closest('sl-form')?.reportValidity();
    };

    return html`
      <style>
        sl-form {
          max-inline-size: 720px;
        }
      </style>
      <sl-form>
        <sl-form-field .hint=${hint} .label=${label}>
          <sl-rich-text-editor
            .value=${value}
            ?disabled=${disabled}
            ?readonly=${readonly}
            ?required=${required}
            features=${ifDefined(features)}
            maxlength=${ifDefined(maxLength)}
            placeholder=${ifDefined(placeholder)}>
            ${footer ? html`<span slot="footer">${footer}</span>` : ''}
          </sl-rich-text-editor>
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
    features: 'default code character-count',
    footer: 'Markdown shortcuts on · Ctrl/⌘ + K for links',
    hint: 'Students see this above the assignment.',
    maxLength: 2000,
    required: true,
    value: lesson
  }
};

export const Mobile: Story = {
  ...Basic,
  globals: {
    viewport: {
      value: 'mobile',
      isRotated: false
    }
  }
};

export const Checklist: Story = {
  args: {
    features: 'headings bold italic link bullet-list ordered-list checklist quote history',
    footer: 'Type [] to start a checklist',
    label: 'Assignment steps',
    value: checklist
  }
};

export const Placeholder: Story = {
  args: {
    label: 'Feedback for student',
    placeholder: 'Write your feedback…'
  }
};

export const Invalid: Story = {
  args: {
    hint: 'Feedback is required before you can return the work.',
    label: 'Feedback for student',
    required: true
  },
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector<RichTextEditor>('sl-rich-text-editor');

    await editor?.updateComplete;
    requestAnimationFrame(() => canvasElement.querySelector('sl-form')?.reportValidity());
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Feedback for student',
    value: '<p>Nice structure in your argument.</p>'
  }
};

export const Readonly: Story = {
  args: {
    label: 'Feedback for student',
    readonly: true,
    value: '<p>Nice structure in your argument. Next time cite a source.</p>'
  }
};

export const Minimal: Story = {
  args: {
    features: 'bold italic link history',
    label: 'Note for yourself',
    placeholder: 'Add a note…'
  }
};
