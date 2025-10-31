import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import '@sl-design-system/form/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Upload } from './upload.js';

type Props = Pick<Upload, 'accept' | 'disabled' | 'dragDrop' | 'maxSize' | 'multiple' | 'required' | 'size'>;
type Story = StoryObj<Props>;

export default {
  title: 'Form/Upload',
  tags: ['stable'],
  args: {
    disabled: false,
    dragDrop: true,
    multiple: false,
    required: false
  },
  argTypes: {
    accept: {
      control: 'text',
      description: 'Accepted file types (e.g., "image/*,.pdf")'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the upload is disabled'
    },
    dragDrop: {
      control: 'boolean',
      description: 'Whether drag-and-drop is enabled'
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in bytes'
    },
    multiple: {
      control: 'boolean',
      description: 'Whether multiple files can be selected'
    },
    required: {
      control: 'boolean',
      description: 'Whether the upload is required'
    },
    size: {
      control: 'inline-radio',
      options: ['md', 'lg'],
      description: 'The size of the upload component'
    }
  },
  render: ({ accept, disabled, dragDrop, maxSize, multiple, required, size }) => html`
    <sl-upload
      ?disabled=${disabled}
      ?drag-drop=${dragDrop}
      ?multiple=${multiple}
      ?required=${required}
      accept=${ifDefined(accept)}
      max-size=${ifDefined(maxSize)}
      size=${ifDefined(size)}
    ></sl-upload>
  `
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Multiple: Story = {
  args: {
    multiple: true
  }
};

export const AcceptImagesOnly: Story = {
  args: {
    accept: 'image/*'
  }
};

export const AcceptSpecificExtensions: Story = {
  args: {
    accept: '.pdf,.doc,.docx'
  }
};

export const MaxSize: Story = {
  args: {
    maxSize: 1024 * 1024 * 5, // 5MB
    multiple: true
  }
};

export const LargeSize: Story = {
  args: {
    size: 'lg'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Required: Story = {
  args: {
    required: true
  }
};

export const NoDragDrop: Story = {
  args: {
    dragDrop: false
  }
};

export const CustomContent: Story = {
  render: ({ accept, disabled, dragDrop, maxSize, multiple, required, size }) => html`
    <sl-upload
      ?disabled=${disabled}
      ?drag-drop=${dragDrop}
      ?multiple=${multiple}
      ?required=${required}
      accept=${ifDefined(accept)}
      max-size=${ifDefined(maxSize)}
      size=${ifDefined(size)}
    >
      <div style="text-align: center; padding: 2rem;">
        <h3 style="margin: 0 0 0.5rem;">Drop your files here</h3>
        <p style="margin: 0; color: var(--sl-color-text-subtle);">or click to browse</p>
      </div>
    </sl-upload>
  `
};

export const InForm: Story = {
  args: {
    required: true,
    multiple: true
  },
  render: ({ accept, disabled, dragDrop, maxSize, multiple, required, size }) => {
    const onSubmit = (event: Event): void => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const upload = form.querySelector('sl-upload') as Upload;
      console.log('Form submitted with files:', upload.files);
      alert(`Uploaded ${upload.files.length} file(s)`);
    };

    return html`
      <sl-form @submit=${onSubmit}>
        <sl-form-field label="Upload files" hint="Select one or more files to upload">
          <sl-upload
            name="files"
            ?disabled=${disabled}
            ?drag-drop=${dragDrop}
            ?multiple=${multiple}
            ?required=${required}
            accept=${ifDefined(accept)}
            max-size=${ifDefined(maxSize)}
            size=${ifDefined(size)}
          ></sl-upload>
        </sl-form-field>

        <sl-button-bar>
          <sl-button type="submit" variant="primary">Submit</sl-button>
          <sl-button type="reset">Reset</sl-button>
        </sl-button-bar>
      </sl-form>
    `;
  }
};

export const All: StoryObj = {
  render: () => {
    const stories: Array<[string, () => TemplateResult]> = [
      ['Basic', () => html`<sl-upload></sl-upload>`],
      ['Multiple', () => html`<sl-upload multiple></sl-upload>`],
      ['Accept Images Only', () => html`<sl-upload accept="image/*"></sl-upload>`],
      ['Large Size', () => html`<sl-upload size="lg"></sl-upload>`],
      ['Disabled', () => html`<sl-upload disabled></sl-upload>`],
      ['Required', () => html`<sl-upload required></sl-upload>`]
    ];

    return html`
      <style>
        .story-grid {
          display: grid;
          gap: 2rem;
        }
        .story-item h3 {
          margin: 0 0 1rem;
          font-size: 1rem;
          font-weight: 600;
        }
      </style>
      <div class="story-grid">
        ${stories.map(
          ([title, story]) => html`
            <div class="story-item">
              <h3>${title}</h3>
              ${story()}
            </div>
          `
        )}
      </div>
    `;
  }
};
