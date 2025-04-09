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
  headingSize?: number;
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
  title: 'Media/Icon',
  tags: ['stable'],
  args: {
    icons: Object.keys(window.SLDS?.icons)
  },
  argTypes: {
    icons: {
      table: {
        disable: true
      }
    }
  },
  decorators: [
    (story, storyProperties) => {
      storyId = storyProperties.id;
      return story();
    }
  ],
  render: ({ icons }) => {
    icons = ['info', 'star', 'chevron-right', 'home-blank'];
    return html`
      <style>
        #root-inner {
          display: grid;
          grid-template-columns: max-content 1fr;
          align-items: center;
          gap: 16px;
        }

        section {
          display: flex;
          gap: 8px;
        }
        .copyable sl-icon {
          cursor: pointer;
        }
      </style>
      ${sizes.map(
        size => html`
          <h3>${sizeName(size)}</h3>
          <section class="copyable">
            ${icons.map(
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

      <h3>Icon based on text size</h3>
      <p>
        <sl-icon name="info"></sl-icon> This icon is based on the text size and scales when text-only zoom is used. The
        minimum size of the icon however is defined by the size set on the icon (or md by default). It can never get
        smaller than the indicated size.
      </p>
    `;
  }
} satisfies Meta<Props>;

type Story = StoryObj<Props>;

export const Basic: Story = {};
export const SizeInheritance: Story = {
  args: {
    headingSize: 28
  },
  argTypes: {
    headingSize: {
      control: { type: 'range', min: 14, max: 64, step: 1 }
    }
  },
  render: ({ headingSize }) => {
    return html` <p>
        When an explicit font size is set to the parent of the icon, or if a user uses (text) zoom in the browser the
        icon will use the maximum value of either the set icon size or 1cap of the current font-size.
      </p>
      <h1 style="font-size:${headingSize}px"><sl-icon name="info"> </sl-icon> Inheritance</h1>
      <sl-button variant="primary" style="font-size:${headingSize}px">
        <sl-icon name="info"></sl-icon> Agree
      </sl-button>
      <p>
        The icons above have no explicit size set, so they will default to the height of the <code>md</code> size icon.
        When the font-size (or zoom) is increased to the point where the <code>cap</code> size (the height of the
        capitals in the font) is larger than the 16px<sup>*</sup> of the <code>md</code>-icon the icon will become
        larger, to meet the size of <code>1cap</code>.
      </p>
      <p>
        You can of course still set the size of the icon by using the size property, that will impact the minimum size
        of the icon; it will grow to be 1cap high when zommed in or when the text size increases, as you can see in the
        example below.
      </p>
      <sl-button variant="primary" style="flex-direction:column;">
        <sl-icon name="info" size="2xl"></sl-icon>Agree
      </sl-button>
      <p>
        <small>* = 16px is at time of writing the size of the <code>md</code> icon in the Sanoma Learning theme.</small>
      </p>`;
  }
};

export const All: Story = {
  render: () => {
    const icons = Object.keys(window.SLDS?.icons);

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
          grid-template-columns: repeat(auto-fill, var(--sl-size-icon-3xl));
          grid-auto-rows: var(--sl-size-icon-3xl);
          gap: 8px;
          justify-items: center;
        }
      </style>
      <section class="copyable">
        ${icons
          .filter(i => window.SLDS.icons[i].type !== 'RegisteredIcon')
          .map(i => html`<sl-icon .name=${i} size="2xl" .label=${i} title=${i}></sl-icon>`)}
      </section>
      <p>
        When switching themes while on this page it could be not all theme icons are loaded correctly, please refresh
        the page to make sure you are seeing the correct icons
      </p>
    `;
  }
};

export const AllIcons: Story = {
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
          grid-template-columns: repeat(auto-fill, var(--sl-size-icon-3xl));
          grid-auto-rows: var(--sl-size-icon-3xl);
          gap: 8px;
          justify-items: center;
        }
        .copyable sl-icon {
          cursor: pointer;
        }
      </style>
      <h2>System and custom icons:</h2>
      <p>Click on the icon to copy the name</p>
      <section class="copyable">
        ${icons
          .filter(i => window.SLDS.icons[i].type !== 'RegisteredIcon')
          .map(
            i =>
              html`<sl-icon
                .name=${i}
                size="2xl"
                .label=${i}
                title=${i}
                @click=${async () => await copyIconName(i)}
              ></sl-icon>`
          )}
      </section>
      <p>
        When switching themes while on this page it could be not all theme icons are loaded correctly, please refresh
        the page to make sure you are seeing the correct icons
      </p>
    `;
  }
};
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
      <h2>Referring to a non-existing icon:</h2>
      <p>When the icon is not yet registered, or you are using a wrong name</p>
      <section><sl-icon></sl-icon></section>
    `;
  }
};
