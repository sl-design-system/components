import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ecosystemMatrixModes } from '../modes';

const typographyStyles = [
  { name: 'Display', className: 'display', sizes: ['sm', 'md', 'lg'] },
  { name: 'Heading', className: 'heading', sizes: ['sm', 'md', 'lg'] },
  { name: 'Title', className: 'title', sizes: ['sm', 'md', 'lg'] },
  { name: 'Label', className: 'label', sizes: ['sm', 'md', 'lg'] },
  { name: 'Text', className: 'text', sizes: ['sm', 'md', 'lg'] },
  { name: 'Caption', className: 'caption', sizes: ['md', 'lg'] }
];

export default {
  title: 'Stress',
  parameters: {
    chromatic: {
      modes: ecosystemMatrixModes
    }
  }
} satisfies Meta;

export const Typography: StoryObj = {
  play: async () => {
    await document.fonts.ready;
  },
  render: () => html`
    <style>
      .typography-gallery {
        display: grid;
        gap: 16px;
        width: 680px;
        max-width: 100%;
      }

      .typography-row {
        display: grid;
        grid-template-columns: 90px minmax(0, 1fr) minmax(0, 240px);
        gap: 16px;
        align-items: start;
        border-bottom: 1px solid #ccc;
        padding-bottom: 16px;
      }

      .typography-name {
        font: 12px/1.5 sans-serif;
      }

      .typography-sample {
        margin: 0;
        overflow-wrap: anywhere;
      }
    </style>
    <div class="typography-gallery">
      ${typographyStyles.flatMap(({ name, className, sizes }) =>
        sizes.map(
          size => html`
            <div class="typography-row">
              <span class="typography-name">${name} ${size}</span>
              <p class="typography-sample ${className} ${size}">Learning together</p>
              <p class="typography-sample ${className} ${size}">
                A longer example that wraps across multiple lines in a narrow space.
              </p>
            </div>
          `
        )
      )}
    </div>
  `
};
