import { faNarwhal as fadNarwhal } from '@fortawesome/pro-duotone-svg-icons';
import { faPinata as falPinata } from '@fortawesome/pro-light-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { faPinata as fasPinata } from '@fortawesome/pro-solid-svg-icons';
import { faPinata as fatPinata } from '@fortawesome/pro-thin-svg-icons';
import Events from '@storybook/core-events';
import { addons } from '@storybook/preview-api';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';
import { Icon, type IconSize } from './icon.js';

interface Props extends Pick<Icon, 'label' | 'name' | 'size'> {
  icons: string[];
}

const sizeName = (size: string): string => {
  switch (size) {
    case 'xs':
      return 'Extra Small';
    case 'sm':
      return 'Small';
    case 'md':
      return 'Medium';
    case 'lg':
      return 'Large';
    case 'xl':
      return 'Extra Large';
    case '2xl':
      return '2 Extra Large';
    case '3xl':
      return '3 Extra Large';
    case '4xl':
      return '4 Extra Large';
    default:
      return '2 Extra Small';
  }
};

const sizes: IconSize[] = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
let storyId: string;

const copyIconName = async (name: string): Promise<void> => {
  await navigator.clipboard.writeText(name);
};

export default {
  title: 'In progress/Icon',
  args: {
    icons: Object.keys(window.SLDS?.icons)
  },
  decorators: [
    (story, storyProperties) => {
      storyId = storyProperties.id;
      return story();
    }
  ],
  argTypes: {
    icons: {
      control: {
        type: null
      }
    }
  },
  render: ({ icons }) => {
    if (icons.length === 0) {
      setTimeout(() => {
        addons.getChannel().emit(Events.UPDATE_STORY_ARGS, {
          storyId,
          updatedArgs: { icons: Object.keys(window.SLDS.icons) }
        });
      }, 200);
    }
    return html`
      <style>
        section {
          display: grid;
          grid-auto-columns: var(--sl-size-icon-4xl);
          gap: 8px;
          grid-auto-flow: column;
          justify-items: center;
        }
        .copyable sl-icon {
          cursor: pointer;
        }
      </style>
      <h2>System and custom icons:</h2>
      <small>Click on the icon to copy the name</small>
      ${sizes.map(
        size => html`
          <h3>${sizeName(size)}</h3>
          <section class="copyable">
            ${icons
              .filter(i => window.SLDS.icons[i].type !== 'RegisteredIcon')
              .map(
                i =>
                  html`<sl-icon
                    .name=${i}
                    .size=${size}
                    .label=${i}
                    title=${i}
                    @click=${async () => await copyIconName(i)}
                  ></sl-icon>`
              )}
          </section>
        `
      )}
      <h2>Referring to a non-existing icon:</h2>
      <section><sl-icon></sl-icon></section>
    `;
  }
} satisfies Meta<Props>;

type Story = StoryObj<Props>;

export const Basic: Story = {};
export const RegisterAdditionalIcons: Story = {
  render: () => {
    // load the entire FA library of a certain variant:
    Icon.register(...Object.values(far));

    // load a single icon:
    Icon.register(fatPinata);
    Icon.register(fatPinata);

    // load multiple icons at once:
    Icon.register(falPinata, fasPinata, fadNarwhal);

    return html`
      <style>
        section {
          display: flex;
          gap: 8px;
        }
      </style>
      <h2>Icons added directly from FontAwesome:</h2>
      <section>
        <sl-icon name="fas-pinata"></sl-icon>
        <sl-icon name="far-pinata"></sl-icon>
        <sl-icon name="fal-pinata"></sl-icon>
        <sl-icon name="fat-pinata"></sl-icon>
        <sl-icon name="far-narwhal"></sl-icon>
        <sl-icon name="fad-narwhal"></sl-icon>
      </section>
    `;
  }
};
