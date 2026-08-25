import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
export default {
  title: 'Feedback & status/Tag/Tag list',
  args: {
    count: 50,
    removable: false,
    stacked: false
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['md', 'lg']
    },
    variant: {
      control: 'inline-radio',
      options: ['neutral', 'info']
    }
  },
  render: ({ count, disabled, removable, size, stacked, tags, variant }) => {
    tags ??= () =>
      Array.from({ length: count }).map(
        (_, index) =>
          html`<sl-tag ?disabled=${disabled} ?removable=${removable}>${`Tag ${index + 1}`}</sl-tag>`
      );
    return html`
      <style>
        #storybook-root {
          max-width: calc(100vw - 2rem);
        }
      </style>
      <sl-tag-list size=${ifDefined(size)} ?stacked=${stacked} variant=${ifDefined(variant)}
        >${tags()}</sl-tag-list
      >
    `;
  }
};
export const Basic = {};
export const Info = {
  args: {
    variant: 'info'
  }
};
export const Large = {
  args: {
    size: 'lg'
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
export const Stacked = {
  args: {
    count: 20,
    stacked: true
  }
};
export const StackedOver100 = {
  args: {
    ...Stacked.args,
    count: 120
  }
};
export const StackedRemovable = {
  args: {
    ...Stacked.args,
    removable: true
  }
};
//# sourceMappingURL=tag-list.stories.js.map
