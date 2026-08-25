import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
export default {
  title: 'Feedback & status/Tag/Tag',
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            selector: 'sl-tag:not([disabled])'
          }
        ]
      }
    }
  },
  args: {
    disabled: false,
    label: 'Tag label',
    removable: false
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    },
    variant: {
      control: 'inline-radio',
      options: ['default', 'info']
    }
  },
  render: ({ disabled, label, maxWidth, removable, size, variant }) => html`
    <sl-tag
      ?disabled=${disabled}
      ?removable=${removable}
      size=${ifDefined(size)}
      style=${ifDefined(maxWidth ? `max-inline-size: ${maxWidth}` : void 0)}
      variant=${ifDefined(variant)}>
      ${label}
    </sl-tag>
  `
};
export const Basic = {};
export const Info = {
  args: {
    variant: 'info'
  }
};
export const Overflow = {
  args: {
    label: 'This is a very long label which overflows',
    maxWidth: '200px'
  }
};
export const OverflowRemovable = {
  args: {
    ...Overflow.args,
    removable: true
  }
};
export const Removable = {
  args: {
    removable: true
  }
};
export const InfoRemovable = {
  args: {
    removable: true,
    variant: 'info'
  }
};
export const RemovableDisabled = {
  args: {
    disabled: true,
    removable: true
  }
};
//# sourceMappingURL=tag.stories.js.map
