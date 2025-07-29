import { faDownload, faHeart } from '@fortawesome/pro-regular-svg-icons';
import { faHeart as fasHeart } from '@fortawesome/pro-solid-svg-icons';
import '@sl-design-system/badge/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/menu/register.js';
import '@sl-design-system/toggle-button/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Card, CardOrientation } from './card.js';

type Props = Pick<Card, 'orientation'> & {
  media?: boolean;
  title?: string;
  bodyText?: string;
  fitImage?: boolean;
  imageBackdrop?: boolean;
  imageUrl?: string;
  mediaMargin?: boolean;
  subheaderContent?: boolean;
  subheaderBadge?: string;
  subheaderText?: string;
  actionButton?: boolean;
  subgrid?: boolean;
  menuButton?: boolean;
  link?: boolean;
};

type Story = StoryObj<Props>;

const orientations = ['horizontal', 'vertical'];
Icon.register(faDownload, faHeart, fasHeart);

export default {
  title: 'Layout/Card',
  tags: ['stable'],
  args: {
    title: 'Lorem Ipsum',
    bodyText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac ex et leo feugiat pellentesque. Fusce faucibus non turpis at euismod. Quisque imperdiet imperdiet dui et tincidunt. ',
    media: true,
    orientation: undefined,
    imageUrl:
      'https://images.unsplash.com/photo-1586622992874-27d98f198139?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    subheaderContent: true,
    subheaderBadge: 'new',
    actionButton: true,
    menuButton: false,
    fitImage: false,
    imageBackdrop: false,
    mediaMargin: false,
    subgrid: false,
    link: false
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: orientations
    },
    subheaderBadge: {
      control: 'text',
      if: { arg: 'subheaderContent' }
    },
    subheaderText: {
      control: 'text',
      if: { arg: 'subheaderContent' }
    }
  },
  render: ({
    media,
    title,
    bodyText,
    orientation,
    imageUrl,
    fitImage,
    imageBackdrop,
    mediaMargin,
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid,
    menuButton,
    link
  }) => {
    return html`
      <style>
        sl-card {
          --sl-card-media-size: unset;
        }
      </style>
      ${card(
        {
          media,
          title,
          bodyText,
          orientation,
          imageUrl,
          fitImage,
          imageBackdrop,
          mediaMargin,
          subheaderContent,
          subheaderBadge,
          subheaderText,
          actionButton,
          subgrid,
          menuButton,
          link
        },
        0
      )}
    `;
  }
} satisfies Meta<Props>;

const card = (
  card: {
    media?: boolean;
    title?: string;
    bodyText?: string;
    orientation?: CardOrientation;
    imageUrl?: string;
    fitImage?: boolean;
    imageBackdrop?: boolean;
    mediaMargin?: boolean;
    subheaderContent?: boolean;
    subheaderBadge?: string;
    subheaderText?: string;
    actionButton?: boolean;
    subgrid?: boolean;
    menuButton?: boolean;
    link?: boolean;
  },
  contentId: number
) => {
  return html`
    <sl-card
      orientation=${ifDefined(card.orientation)}
      ?fit-image=${card.fitImage}
      ?media-margin=${card.mediaMargin}
      ?subgrid=${card.subgrid}
      ?image-backdrop=${card.imageBackdrop}
    >
      ${card.media && card.imageUrl
        ? html`<img slot="media" src=${images[contentId]} alt="Picture of ${titles[contentId]}" />`
        : nothing}
      ${card.link
        ? html`<a href="javascript:console.log('link clicked');">${titles[contentId]}</a>`
        : html`<h2>${titles[contentId]}</h2>`}
      ${card.subheaderContent
        ? html`
            <span slot="header">
              ${card.subheaderBadge
                ? html`<sl-badge color="purple" size="lg">${card.subheaderBadge}</sl-badge>`
                : nothing}
              ${card.subheaderText}
            </span>
          `
        : nothing}
      ${card.menuButton
        ? html`
            <sl-menu-button slot="menu-button" aria-label="Card actions">
              <sl-menu-item>
                <sl-icon name="far-pen"></sl-icon>
                Rename...
              </sl-menu-item>
              <sl-menu-item>
                <sl-icon name="far-trash"></sl-icon>
                Delete...
              </sl-menu-item>
            </sl-menu-button>
          `
        : nothing}
      ${card.bodyText ? html`<p slot="body">${bodyCopy[contentId]}</p>` : nothing}
      ${card.actionButton
        ? html`
            <sl-button-bar slot="actions"
              ><sl-button variant="primary" @click=${() => console.log('action button clicked')}>
                <sl-icon name="far-download"></sl-icon> Download
              </sl-button>
            </sl-button-bar>
          `
        : nothing}
    </sl-card>
  `;
};
export const Basic: Story = {};

const images = [
  'https://images.unsplash.com/photo-1586622992874-27d98f198139?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1586622570180-59adf1864b1b?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1499689496495-5bdf4421b725?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
];

const titles = [
  'Captivating Nyhavn Moments',
  'Nyhavn Splendor',
  'Architectural Elegance in Copenhagen',
  'Enchanting Copenhagen'
];

const bodyCopy = [
  html`
    Immerse yourself in the vibrant hues of Nyhavn, Copenhagen's iconic waterfront. This picturesque scene, adorned with
    colorful facades and historic ships, invites you to explore the charm of Danish culture against the backdrop of
    serene canals.
  `,
  html`
    Discover the allure of Nyhavn, Copenhagen's waterfront gem, where historic charm meets vibrant hues in every corner.
  `,
  html`
    Copenhagen's skyline is a testament to architectural brilliance, seamlessly blending historic landmarks with
    contemporary design. Wander through a cityscape where each building tells a unique story, creating a harmonious
    fusion of past and present.
  `,
  html`
    Delight in the enchanting allure of Copenhagen, where timeless elegance meets modern vibrancy. Explore the city's
    rich tapestry of culture, history, and architectural beauty at every turn.
  `,
  html`
    Nyhavn, the picturesque waterfront district of Copenhagen, beckons visitors with its timeless charm and vibrant
    atmosphere. Flanked by rows of colorful townhouses dating back to the 17th century, this iconic area exudes a sense
    of history and character. As you stroll along the cobblestone streets, the scent of freshly
    <a href="https://junothebakery.com/" target="_blank">baked pastries</a> mingles with the salty breeze from the
    harbor, creating a sensory symphony that captivates all who wander here. Yet Nyhavn is not merely a relic of the
    past; it's a lively hub of activity, where locals and tourists alike gather to enjoy the numerous cafes, bars, and
    restaurants lining the quayside. From leisurely boat tours along the picturesque canals to lively outdoor concerts
    and events, there's always something happening in Nyhavn. Whether you're sipping a cold beer by the water's edge or
    admiring the sunset painting the sky in hues of pink and gold, Nyhavn offers a quintessentially Danish experience
    that is both timeless and unforgettable.
  `
];

export const SubGridHorizontal: Story = {
  args: {
    fitImage: true,
    subgrid: true
  },

  render: ({
    media,
    title,
    bodyText,
    orientation,
    imageUrl,
    fitImage,
    imageBackdrop,
    mediaMargin,
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid,
    menuButton,
    link
  }) => {
    const settings = {
      media,
      title,
      bodyText,
      orientation,
      imageUrl,
      fitImage,
      imageBackdrop,
      mediaMargin,
      subheaderContent,
      subheaderBadge,
      subheaderText,
      actionButton,
      subgrid,
      menuButton,
      link
    };
    return html`
      <style>
        .grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(2, 200px 1fr);
          grid-auto-rows: max-content 5lh max-content;
        }
        .grid.no-buttons {
          grid-auto-rows: max-content max-content;
        }
      </style>
      <p>
        This grid has 4 columns, because the horizontal cards span 2 columns each it will show 2 cards per row.<br />
        Hiding the media will result in 4 cards per row, but this will look odd, because the cards columns are set to
        200px and 1fr alternating.
      </p>
      <p>
        The rows are set to <code>max-content 5lh max-content</code> and <code>max-content max-content</code> with and
        without action buttons respectively
      </p>
      <div class="grid${!actionButton ? ' no-buttons' : ''}">
        ${card(settings, 1)} ${card(settings, 2)} ${card(settings, 0)} ${card(settings, 3)}
      </div>
    `;
  }
};

export const SubGridVertical: Story = {
  args: {
    orientation: 'vertical',
    subgrid: true,
    subheaderContent: false
  },

  render: ({
    media,
    title,
    bodyText,
    orientation,
    imageUrl,
    fitImage,
    imageBackdrop,
    mediaMargin,
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid,
    menuButton,
    link
  }) => {
    const settings = {
      media,
      title,
      bodyText,
      orientation,
      imageUrl,
      fitImage,
      imageBackdrop,
      mediaMargin,
      subheaderContent,
      subheaderBadge,
      subheaderText,
      actionButton,
      subgrid,
      menuButton,
      link
    };
    return html`
      <style>
        .grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 200px max-content 4lh max-content;
        }
        .grid.no-buttons {
          grid-auto-rows: 200px max-content max-content;
        }
      </style>
      <p>
        This grid has 3 columns, the rows are set to <code>200px max-content 4lh max-content</code> and
        <code>200px max-content max-content</code> with and without action buttons respectively
      </p>
      <div class=${!actionButton ? 'grid no-buttons' : 'grid'}>
        ${card(settings, 1)} ${card(settings, 2)} ${card(settings, 0)} ${card(settings, 3)}
      </div>
    `;
  }
};

export const SubGridNoMedia: Story = {
  args: {
    orientation: 'vertical',
    subgrid: true,
    subheaderContent: true,
    media: false
  },

  render: ({
    media,
    title,
    bodyText,
    orientation,
    imageUrl,
    fitImage,
    imageBackdrop,
    mediaMargin,
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid,
    menuButton,
    link
  }) => {
    const settings = {
      media,
      title,
      bodyText,
      orientation,
      imageUrl,
      fitImage,
      imageBackdrop,
      mediaMargin,
      subheaderContent,
      subheaderBadge,
      subheaderText,
      actionButton,
      subgrid,
      menuButton,
      link
    };
    return html`
      <style>
        .grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: max-content 4lh max-content;
        }
        .grid.no-buttons {
          grid-auto-rows: max-content max-content;
        }
      </style>
      <div class=${!actionButton ? 'grid no-buttons' : 'grid'}>
        ${card(settings, 1)} ${card(settings, 2)} ${card(settings, 0)} ${card(settings, 3)}
      </div>
    `;
  }
};

export const Masonry: Story = {
  args: {
    orientation: 'vertical'
  },

  render: ({
    media,
    title,
    bodyText,
    orientation,
    imageUrl,
    fitImage,
    imageBackdrop,
    mediaMargin,
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid,
    menuButton,
    link
  }) => {
    const settings = {
      media,
      title,
      bodyText,
      orientation,
      imageUrl,
      fitImage,
      imageBackdrop,
      mediaMargin,
      subheaderContent,
      subheaderBadge,
      subheaderText,
      actionButton,
      subgrid,
      menuButton,
      link
    };
    return html`
      <style>
        .grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: masonry;
        }
      </style>
      <p>
        This grid has 3 columns, the rows are set to <code>masonry</code> (although this is
        <a href="https://caniuse.com/mdn-css_properties_grid-template-rows_masonry" target="_blank"
          >not supported in all browsers yet</a
        >). <br />
        The cards will grow as big as the text needs them to be. The height of the header might change, causing the
        body-texts not to alight within a row. When it is important they align, use subgrid.<br />
      </p>
      <div class=${!actionButton ? 'grid no-buttons' : 'grid'}>
        ${card(settings, 1)} ${card(settings, 2)} ${card(settings, 0)} ${card(settings, 3)} ${card(settings, 0)}
        ${card(settings, 1)} ${card(settings, 2)} ${card(settings, 3)}
      </div>
    `;
  }
};

export const MediaOptions: Story = {
  render: ({
    media,
    title,
    bodyText,
    orientation,
    imageUrl,
    fitImage,
    imageBackdrop,
    mediaMargin,
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid,
    menuButton,
    link
  }) => {
    const settings = {
      media,
      title,
      bodyText,
      orientation,
      imageUrl,
      fitImage,
      imageBackdrop,
      mediaMargin,
      subheaderContent,
      subheaderBadge,
      subheaderText,
      actionButton,
      subgrid,
      menuButton,
      link
    };

    return html`
      <style>
        .grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(2, 1fr);
        }
        sl-card:nth-of-type(3) {
          --sl-card-image-backdrop: #b9d7dd;
        }
        sl-card:nth-of-type(4) {
          --sl-card-image-backdrop: linear-gradient(to bottom, #f1923f, #d4d9e1);
        }
      </style>
      <div class="grid${!actionButton ? ' no-buttons' : ''}">
        <span>Default (image is cropped to fit):</span><span>Fit image with default background-color:</span>
        ${card(settings, 0)} ${card({ ...settings, fitImage: true }, 1)}
        <span>Fit image with background-color set with <code>--sl-card-image-backdrop</code>:</span
        ><span>Fit image with background set to gradient with <code>--sl-card-image-backdrop</code>:</span>
        ${card({ ...settings, fitImage: true }, 2)} ${card({ ...settings, fitImage: true }, 3)}
        <span>Fit image with imageBackdrop:</span><span>With media-margin</span>
        ${card({ ...settings, fitImage: true, imageBackdrop: true }, 1)} ${card({ ...settings, mediaMargin: true }, 0)}
      </div>
    `;
  }
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical'
  },

  render: ({
    media,
    title,
    bodyText,
    orientation,
    imageUrl,
    fitImage,
    imageBackdrop,
    mediaMargin,
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid,
    menuButton,
    link
  }) => {
    const settings = {
      media,
      title,
      bodyText,
      orientation,
      imageUrl,
      fitImage,
      imageBackdrop,
      mediaMargin,
      subheaderContent,
      subheaderBadge,
      subheaderText,
      actionButton,
      subgrid,
      menuButton,
      link
    };

    return html`
      <style>
        .grid {
          align-items: start;
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(2, 1fr);
        }
        sl-card:nth-of-type(2) {
          --sl-card-media-size: 200px;
        }
      </style>
      <div class="grid">
        <span>No height of media is set, either with subgrid or <code>--sl-card-media-size</code></span>
        <span>Media height is set to 200px with <code>--sl-card-media-size</code></span>
        ${card(settings, 0)} ${card(settings, 0)}
      </div>
    `;
  }
};

export const Responsive: Story = {
  args: {
    subheaderContent: false
  },

  render: ({
    media,
    title,
    bodyText,
    orientation,
    imageUrl,
    fitImage,
    imageBackdrop,
    mediaMargin,
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid,
    menuButton,
    link
  }) => {
    const settings = {
      media,
      title,
      bodyText,
      orientation,
      imageUrl,
      fitImage,
      imageBackdrop,
      mediaMargin,
      subheaderContent,
      subheaderBadge,
      subheaderText,
      actionButton,
      subgrid,
      menuButton,
      link
    };
    return html`
      <style>
        .grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));

          --sl-card-horizontal-breakpoint: 500px;
        }
        .grid:nth-of-type(2) {
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        }
        @media (max-width: 500px) {
          .grid:nth-of-type(2) {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 350px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
        sl-card:not(.sl-horizontal) {
          /** this way we only limit the height, not the width when the card is horizontal  */
          --sl-card-media-size: 200px;
        }
      </style>
      <p>
        This grid has the template columns set to <code>repeat(auto-fit, minmax(400px, 1fr))</code>, which means it will
        show as many cards as will fit in the available space, with a minimum width of 400px per card.<br />
        The cards will switch to horizontal layout when the column is wider than 500px. This will cause a lot of
        "switching" between horizontal and vertical layout when the viewport is resized, this exact example is not
        recommended for production use.<br />
      </p>
      <div class="grid">${card(settings, 1)} ${card(settings, 2)} ${card(settings, 0)} ${card(settings, 3)}</div>
      <p>
        This grid has the template columns set to <code>repeat(auto-fit, minmax(400px, 1fr))</code>, which means it will
        show as many cards as will fit in the available space, with a minimum width of 400px per card.<br />
        The cards will switch to horizontal layout when the column is wider than 500px. This will cause a lot of
        "switching" between horizontal and vertical layout when the viewport is resized, this exact example is not
        recommended for production use.<br />
      </p>
      <div class="grid">${card(settings, 1)} ${card(settings, 2)} ${card(settings, 0)} ${card(settings, 3)}</div>
    `;
  }
};

export const Actions: Story = {
  args: {
    actionButton: false,
    menuButton: false
  },
  render: ({
    media,
    title,
    bodyText,
    orientation,
    imageUrl,
    fitImage,
    imageBackdrop,
    mediaMargin,
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid,
    menuButton,
    link
  }) => {
    const settings = {
      media,
      title,
      bodyText,
      orientation,
      imageUrl,
      fitImage,
      imageBackdrop,
      mediaMargin,
      subheaderContent,
      subheaderBadge,
      subheaderText,
      actionButton,
      subgrid,
      menuButton,
      link
    };

    return html`
      <style>
        .grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(2, 1fr);
        }
      </style>
      <div class="grid">
        <span>Without any actions</span><span>With action button</span>
        ${card(settings, 0)} ${card({ ...settings, actionButton: true }, 1)}
        <span>With menu:</span>
        <span>With link, whole card clickable:</span>
        ${card({ ...settings, menuButton: true }, 2)} ${card({ ...settings, link: true }, 3)}
      </div>
    `;
  }
};

export const RealWorldExamples: Story = {
  render: () => {
    return html`
      <style>
        div {
          display: grid;
          gap: 16px;
          margin-bottom: 24px;
          width: 100%;
        }
        .max {
          grid-template-columns: repeat(auto-fill, 300px);
          --sl-card-media-size: 200px;
        }
        .npm {
          grid-template-columns: repeat(auto-fill, 200px);
          grid-auto-rows: 260px 1fr max-content;
          --sl-card-media-size: 260px;
        }
        .npm2 {
          grid-template-columns: repeat(auto-fit, 500px);
          grid-auto-rows: 300px;
          --sl-card-media-size: 230px;
        }

        .npm2 sl-card {
          --sl-card-image-backdrop: var(--sl-color-palette-primary-100);
          background-color: var(--sl-color-palette-primary-100);
        }
      </style>
      <h1>Max, chapter tile</h1>
      <div class="max">
        <sl-card orientation="vertical">
          <img
            slot="media"
            src="/images/card-max-1.png"
            alt="Een baby oerang oetan die wordt vastgehouden door hun moeder"
          />
          <a href="javascript:void(0);">Wat is biologie?</a>
          <span slot="header"
            ><sl-badge size="lg">Thema 1</sl-badge> <sl-badge size="lg" color="green">last activity</sl-badge></span
          >
        </sl-card>
        <sl-card orientation="vertical">
          <img slot="media" src="/images/card-max-2.png" alt="Glaskikker, van onderen gezien" />
          <a href="javascript:void(0);">Organen en cellen</a>
          <span slot="header"><sl-badge size="lg">Thema 3</sl-badge></span>
        </sl-card>
      </div>
      <h1>NPM, My books</h1>
      <div class="npm">
        <sl-card orientation="vertical" subgrid>
          <img slot="media" src="/images/card-npm-1.jpg" alt="" />
          <a href="javascript:void(0);">L'aventura più grande</a>
          <span slot="header">
            <sl-badge size="md" color="blue">Partial assets</sl-badge>
            <sl-badge size="md" color="green">update</sl-badge>
          </span>
          <sl-toggle-button slot="menu-button" aria-label="Favorite" shape="pill">
            <sl-icon name="far-heart" slot="default"></sl-icon>
            <sl-icon name="fas-heart" slot="pressed"></sl-icon>
          </sl-toggle-button>
          <sl-button-bar slot="actions"
            ><sl-button
              variant="primary"
              fill="outline"
              @click=${() => console.log('action button clicked')}
              style="flex-grow: 1"
            >
              <sl-icon name="ellipsis"></sl-icon> More options
            </sl-button>
          </sl-button-bar>
        </sl-card>
        <sl-card orientation="vertical" subgrid>
          <img slot="media" src="/images/card-npm-2.jpg" alt="" />
          <a href="javascript:void(0);">Gli snodi della storia</a>
          <span slot="header">
            <sl-badge size="md">Partial assets</sl-badge>
          </span>
          <sl-toggle-button slot="menu-button" aria-label="Favorite" shape="pill">
            <sl-icon name="far-heart" slot="default"></sl-icon>
            <sl-icon name="fas-heart" slot="pressed"></sl-icon>
          </sl-toggle-button>
          <sl-button-bar slot="actions"
            ><sl-button
              variant="primary"
              fill="outline"
              @click=${() => console.log('action button clicked')}
              style="flex-grow: 1"
              ><sl-icon name="ellipsis"></sl-icon> More options
            </sl-button>
          </sl-button-bar>
        </sl-card>
      </div>

      <h1>NPM, My books v2</h1>
      <div class="npm2">
        <sl-card fit-image>
          <img slot="media" src="/images/card-npm-1.jpg" alt="" />
          <h2>L'aventura più grande</h2>
          <p slot="body">Linda Cavadini, Loretta De Martin, Agnese Pianigiani</p>
          <sl-button-bar slot="actions"
            ><sl-button variant="inverted" @click=${() => console.log('action button clicked')} style="flex-grow: 1">
              Open 12 volumes
            </sl-button>
          </sl-button-bar>
        </sl-card>
        <sl-card fit-image>
          <img slot="media" src="/images/card-npm-2.jpg" alt="" />
          <h2>Gli snodi della storia</h2>
          <p slot="body">Giovanni Borgognone, Dino Carpanetto</p>
          <sl-button-bar slot="actions"
            ><sl-button variant="inverted" @click=${() => console.log('action button clicked')} style="flex-grow: 1">
              Open 9 volumes
            </sl-button>
          </sl-button-bar>
        </sl-card>
      </div>
    `;
  }
};

export const All: Story = {
  args: {
    subheaderContent: false,
    actionButton: false
  },
  render: ({
    media,
    title,
    bodyText,
    orientation,
    imageUrl,
    fitImage,
    imageBackdrop,
    mediaMargin,
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid,
    menuButton,
    link
  }) => {
    const settings = {
      media,
      title,
      bodyText,
      orientation,
      imageUrl,
      fitImage,
      imageBackdrop,
      mediaMargin,
      subheaderContent,
      subheaderBadge,
      subheaderText,
      actionButton,
      subgrid,
      menuButton,
      link
    };
    const vsettings = { ...settings, orientation: 'vertical' as CardOrientation };

    return html`
      <style>
        .horizontal {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          margin-bottom: 24px;
          width: 100%;
        }
        .vertical {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          margin-bottom: 24px;
          width: 100%;
        }
      </style>
      <div class="horizontal">
        ${card(settings, 1)} ${card({ ...settings, subheaderContent: true, subheaderBadge: 'new', fitImage: true }, 1)}
        ${card({ ...settings, actionButton: true, fitImage: true, imageBackdrop: true }, 1)}
        ${card({ ...settings, menuButton: true }, 1)} ${card({ ...settings, media: false }, 1)}
        ${card(
          { ...settings, bodyText: undefined, subheaderContent: true, subheaderBadge: 'new', actionButton: true },
          1
        )}
      </div>
      <div class="vertical">
        ${card(vsettings, 2)}
        ${card({ ...vsettings, subheaderContent: true, subheaderBadge: 'new', fitImage: true }, 2)}
        ${card({ ...vsettings, actionButton: true, fitImage: true, imageBackdrop: true }, 2)}
        ${card({ ...vsettings, menuButton: true }, 2)} ${card({ ...vsettings, media: false }, 2)}
        ${card(
          { ...vsettings, bodyText: undefined, subheaderContent: true, subheaderBadge: 'new', actionButton: true },
          2
        )}
      </div>
    `;
  }
};
