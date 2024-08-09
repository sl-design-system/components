import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { type Tag, type TagEmphasis, type TagSize } from './tag.js';

type Props = Pick<Tag, 'disabled' | 'emphasis' | 'size' | 'label' | 'readonly' | 'removable'>;

type Story = StoryObj<Props>;

const sizes: TagSize[] = ['md', 'lg'];
const emphases: TagEmphasis[] = ['subtle', 'bold'];

export default {
  title: 'Components/Tag',
  tags: ['draft'],
  args: {
    disabled: false,
    emphasis: 'subtle',
    label: 'Tag label',
    readonly: false,
    removable: false,
    size: 'md'
  },
  argTypes: {
    emphasis: {
      control: 'radio',
      options: emphases
    },
    size: {
      control: 'inline-radio',
      options: sizes
    }
  },
  render: ({ disabled, emphasis, label, readonly, removable, size }) =>
    html` <sl-tag
      label=${label}
      .emphasis=${emphasis}
      ?disabled=${disabled}
      ?readonly=${readonly}
      ?removable=${removable}
      .size=${size}
    ></sl-tag>`
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Sizes: Story = {
  args: {
    label: 'Tag label',
    removable: false
  },
  argTypes: {
    size: {
      table: {
        disable: true
      }
    }
  },
  render: ({ disabled, emphasis, label, readonly, removable }) => {
    return html`
      <sl-tag
        .emphasis=${emphasis}
        ?disabled=${disabled}
        ?readonly=${readonly}
        label=${label}
        ?removable=${removable}
      ></sl-tag>
      <sl-tag
        .emphasis=${emphasis}
        ?disabled=${disabled}
        ?readonly=${readonly}
        label=${label}
        ?removable=${removable}
        size="lg"
      ></sl-tag>
    `;
  }
};

export const Overflow: Story = {
  args: {
    size: 'md',
    label: 'This is a very long label which overflows',
    emphasis: 'subtle'
  },
  argTypes: {
    removable: {
      table: {
        disable: true
      }
    }
  },
  render: ({ disabled, emphasis, label, readonly, size }) => {
    return html`
      <style>
        div {
          inline-size: 200px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      </style>
      <div>
        <sl-tag .emphasis=${emphasis} ?disabled=${disabled} ?readonly=${readonly} label=${label} .size=${size}></sl-tag>
        <sl-tag
          .emphasis=${emphasis}
          ?disabled=${disabled}
          ?readonly=${readonly}
          label=${label}
          removable
          .size=${size}
        ></sl-tag>
      </div>
    `;
  }
};

export const List: Story = {
  args: {
    size: 'md',
    label: 'Tag label',
    removable: false,
    emphasis: 'subtle'
  },
  render: ({ disabled, emphasis, label, readonly, removable, size }) => {
    const amount = Array.from({ length: 50 });
    return html`
      <sl-tag-list .emphasis=${emphasis} .size=${size}>
        ${amount.map(
          () => html`
            <sl-tag .label=${label} ?disabled=${disabled} ?removable=${removable} ?readonly=${readonly}></sl-tag>
          `
        )}
        <sl-tag
          label="I am a veeeeeeeeeeeeeeery long tag label"
          ?disabled=${disabled}
          ?removable=${removable}
          ?readonly=${readonly}
        ></sl-tag>
        <sl-tag label="I am a label" ?disabled=${disabled} ?removable=${removable} ?readonly=${readonly}></sl-tag>
        <sl-tag label="I am another label" ?disabled=${disabled} ?removable=${removable} ?readonly=${readonly}></sl-tag>
      </sl-tag-list>
    `;
  }
};

export const Stacked: Story = {
  args: {
    size: 'md',
    label: 'Tag label',
    removable: true,
    emphasis: 'subtle'
  },
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    }
  },
  render: ({ emphasis, label, readonly, removable, size }) => {
    const amount = Array.from({ length: 20 });
    return html`
      <style>
        sl-tag-list {
          margin-bottom: 24px;
        }
      </style>
      <sl-tag-list stacked .emphasis=${emphasis} .size=${size}>
        <sl-tag .emphasis=${emphasis} label="my label" ?removable=${removable} ?readonly=${readonly}></sl-tag>
        <sl-tag .emphasis=${emphasis} label="test" ?removable=${removable} ?readonly=${readonly}></sl-tag>
        <sl-tag
          .emphasis=${emphasis}
          label="This is a very long label of the tag"
          ?removable=${removable}
          ?readonly=${readonly}
        ></sl-tag>
        ${amount.map(
          (_, index) => html`
            <sl-tag .label=${label + ' ' + (index + 1)} ?removable=${removable} ?readonly=${readonly}></sl-tag>
          `
        )}
      </sl-tag-list>
    `;
  }
};

export const StackedOver100: Story = {
  args: {
    size: 'md',
    label: 'Tag label',
    removable: false,
    emphasis: 'subtle'
  },
  argTypes: {
    disabled: {
      table: {
        disable: true
      }
    }
  },
  render: ({ emphasis, label, readonly, removable, size }) => {
    const amount = Array.from({ length: 120 });
    return html`
      <style>
        sl-tag-list {
          margin-bottom: 24px;
        }
      </style>
      <sl-tag-list stacked .emphasis=${emphasis} .size=${size}>
        ${amount.map(
          (_, index) => html`
            <sl-tag .label=${label + ' ' + (index + 1)} ?removable=${removable} ?readonly=${readonly}></sl-tag>
          `
        )}
      </sl-tag-list>
    `;
  }
};

export const All: Story = {
  argTypes: {
    emphasis: {
      table: {
        disable: true
      }
    },
    label: {
      table: {
        disable: true
      }
    },
    removable: {
      table: {
        disable: true
      }
    },
    size: {
      table: {
        disable: true
      }
    }
  },
  render: () => {
    return html`
      <style>
        .tag-examples {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
        }
      </style>

      <h2>Subtle</h2>
      <div class="tag-examples">
        <sl-tag label="label" size="md"></sl-tag>
        <sl-tag label="Removable" removable size="md"></sl-tag>
        <sl-tag label="Disabled" size="md" disabled></sl-tag>
        <sl-tag label="Disabled removable" removable size="md" disabled></sl-tag>
        <sl-tag label="Readonly" size="md" readonly></sl-tag>

        <sl-tag label="label lg" size="lg"></sl-tag>
        <sl-tag label="Removable lg" removable size="lg"></sl-tag>
        <sl-tag label="Disabled lg" size="lg" disabled></sl-tag>
        <sl-tag label="Disabled removable lg" removable size="lg" disabled></sl-tag>
        <sl-tag label="Readonly lg" size="lg" readonly></sl-tag>
      </div>

      <h2>Bold</h2>
      <div class="tag-examples">
        <sl-tag emphasis="bold" label="label" size="md"></sl-tag>
        <sl-tag emphasis="bold" label="Removable" removable size="md"></sl-tag>
        <sl-tag emphasis="bold" label="Disabled" size="md" disabled></sl-tag>
        <sl-tag emphasis="bold" label="Disabled removable" removable size="md" disabled></sl-tag>
        <sl-tag emphasis="bold" label="Readonly" size="md" readonly></sl-tag>

        <sl-tag emphasis="bold" label="label" size="lg"></sl-tag>
        <sl-tag emphasis="bold" label="Removable lg" removable size="lg"></sl-tag>
        <sl-tag emphasis="bold" label="Disabled lg" size="lg" disabled></sl-tag>
        <sl-tag emphasis="bold" label="Disabled removable lg" removable size="lg" disabled></sl-tag>
        <sl-tag emphasis="bold" label="Readonly lg" size="lg" readonly></sl-tag>
      </div>
    `;
  }
};
