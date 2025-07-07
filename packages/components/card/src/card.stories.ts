import { faDownload } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/badge/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/button-bar/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/icon/register.js';
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
  subheaderContent?: boolean;
  subheaderBadge?: string;
  subheaderText?: string;
  actionButton?: boolean;
  subgrid?: boolean;
};

type Story = StoryObj<Props>;

const orientations = ['horizontal', 'vertical'];
Icon.register(faDownload);

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
    fitImage: false,
    imageBackdrop: false,
    subgrid: false
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
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid
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
          subheaderContent,
          subheaderBadge,
          subheaderText,
          actionButton,
          subgrid
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
    subheaderContent?: boolean;
    subheaderBadge?: string;
    subheaderText?: string;
    actionButton?: boolean;
    subgrid?: boolean;
  },
  contentId: number
) => {
  return html`
    <sl-card
      orientation=${ifDefined(card.orientation)}
      ?fit-image=${card.fitImage}
      ?subgrid=${card.subgrid}
      ?image-backdrop=${card.imageBackdrop}
    >
      ${card.media && card.imageUrl
        ? html`<img slot="media" src=${images[contentId]} alt="Picture of ${titles[contentId]}" />`
        : nothing}
      <h2>${titles[contentId]}</h2>
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
      <p slot="body">${bodyCopy[contentId]}</p>
      ${card.actionButton
        ? html`
            <sl-button-bar slot="actions"
              ><sl-button variant="primary"> <sl-icon name="far-download"></sl-icon> Download </sl-button>
            </sl-button-bar>
          `
        : nothing}
    </sl-card>
  `;
};
export const Basic: Story = {};

const images = [
  'https://images.unsplash.com/photo-1586622992874-27d98f198139?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1586622570180-59adf1864b1b?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid
  }) => {
    const settings = {
      media,
      title,
      bodyText,
      orientation,
      imageUrl,
      fitImage,
      imageBackdrop,
      subheaderContent,
      subheaderBadge,
      subheaderText,
      actionButton,
      subgrid
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
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid
  }) => {
    const settings = {
      media,
      title,
      bodyText,
      orientation,
      imageUrl,
      fitImage,
      imageBackdrop,
      subheaderContent,
      subheaderBadge,
      subheaderText,
      actionButton,
      subgrid
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
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid
  }) => {
    const settings = {
      media,
      title,
      bodyText,
      orientation,
      imageUrl,
      fitImage,
      imageBackdrop,
      subheaderContent,
      subheaderBadge,
      subheaderText,
      actionButton,
      subgrid
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
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid
  }) => {
    const settings = {
      media,
      title,
      bodyText,
      orientation,
      imageUrl,
      fitImage,
      imageBackdrop,
      subheaderContent,
      subheaderBadge,
      subheaderText,
      actionButton,
      subgrid
    };
    return html`
      <style>
        .grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: masonry;
          --sl-card-media-size: 200px;
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
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid
  }) => {
    const settings = {
      media,
      title,
      bodyText,
      orientation,
      imageUrl,
      fitImage,
      imageBackdrop,
      subheaderContent,
      subheaderBadge,
      subheaderText,
      actionButton,
      subgrid
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
        <span>Fit image with imageBackdrop:</span><span></span>
        ${card({ ...settings, fitImage: true, imageBackdrop: true }, 1)}
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
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    subgrid
  }) => {
    const settings = {
      media,
      title,
      bodyText,
      orientation,
      imageUrl,
      fitImage,
      imageBackdrop,
      subheaderContent,
      subheaderBadge,
      subheaderText,
      actionButton,
      subgrid
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
        ${card(settings, 0)} ${card(settings, 1)}
      </div>
    `;
  }
};

// export const FlexboxFullWidthResponsive: Story = {
//   render: () => html`
//     <style>
//       #root-inner > div {
//         gap: 16px;
//         margin-bottom: 24px;
//         width: 100%;
//       }
//       div.flex {
//         align-items: flex-start;
//         display: flex;
//         flex-wrap: wrap;
//       }
//     </style>
//     <h1>In flexbox, full width, responsive cards</h1>
//     <pre>
//       flex-direction:column;
//       --sl-card-horizontal-breakpoint:500px;
//       --sl-card-text-width:70fr;
//       --sl-card-media-width:30fr;
//     </pre
//     >
//     <div
//       class="flex"
//       style="flex-direction:column; --sl-card-horizontal-breakpoint:500px; --sl-card-text-width:70fr; --sl-card-media-width:30fr;"
//     >
//       <sl-card responsive style="--sl-card-media-aspect-ratio:16/9;">
//         <iframe
//           width="560px"
//           height="315px"
//           slot="media"
//           src="https://www.youtube-nocookie.com/embed/LkHztUGllkc?si=2rc92T2iTKBbSQK4&amp;controls=0"
//           title="YouTube video player"
//           frameborder="0"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//           allowfullscreen
//         ></iframe>
//         <h2>${titles[0]}</h2>
//         <h3 slot="header">Sub header</h3>
//         <p slot="body"><em>aspectratio:16/9</em> - ${bodyCopy[0]}</p>
//         <sl-button aria-label="Actions" icon-only slot="actions" fill="ghost">
//           <sl-icon name="ellipsis"></sl-icon>
//         </sl-button>
//       </sl-card>

//       <sl-card responsive style="--sl-card-media-aspect-ratio:1/1;" padding>
//         <img slot="media" src=${images[1]} />
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body"><em>Padding, aspect-ratio:1/1</em> - ${bodyCopy[1]}</p>
//         <sl-button aria-label="Toggle visibility" icon-only slot="actions" fill="ghost">
//           <sl-icon name="eye"></sl-icon>
//         </sl-button>
//       </sl-card>

//       <sl-card responsive media-position="end" height="flex">
//         <img slot="media" src=${images[2]} />
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body"><em>mediaPosition: end, height:flex</em> - ${bodyCopy[4]}</p>
//         <sl-button aria-label="Toggle visibility" icon-only slot="actions" fill="ghost">
//           <sl-icon name="eye"></sl-icon>
//         </sl-button>
//       </sl-card>

//       <sl-card responsive padding media-position="end" style="--sl-card-media-aspect-ratio:1/1;">
//         <sl-icon name="pinata" slot="icon"></sl-icon>
//         <img slot="media" src=${images[3]} />
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body"><em>icon:pinata, padding, mediaPosition:end, aspectratio:1/1</em> - ${bodyCopy[1]}</p>
//         <sl-button aria-label="Toggle visibility" icon-only slot="actions" fill="ghost">
//           <sl-icon name="eye"></sl-icon>
//         </sl-button>
//       </sl-card>
//     </div>
//   `
// };

// export const FlexHeightFullWidthImageWidth: Story = {
//   render: () => html`
//     <h1>Flex height, full width, image width is set</h1>
//     <sl-card height="flex" style="--sl-card-image-width:200px">
//       <img slot="media" src=${images[2]} />
//       <h2>${titles[1]}</h2>
//       <span slot="header"><sl-badge>new</sl-badge></span>
//       <p slot="body"><em>imageWidth:200px, height:flex</em> - ${bodyCopy[4]}</p>
//       <sl-button aria-label="Toggle visibility" icon-only slot="actions" fill="ghost">
//         <sl-icon name="eye"></sl-icon>
//       </sl-button>
//     </sl-card>
//   `
// };

// export const GridFixedRowHeight: Story = {
//   render: () => html`
//     <style>
//       #root-inner > div {
//         gap: 16px;
//         margin-bottom: 24px;
//         width: 100%;
//       }
//       div.grid {
//         display: grid;
//         grid-auto-rows: 240px;
//         grid-template-columns: repeat(var(--cols, 2), 1fr);
//       }
//     </style>
//     <h1>In grid, fixed row height (all cards have 'excplicit-height')</h1>
//     <div class="grid">
//       <sl-card explicit-height>
//         <img slot="media" src=${images[0]} />
//         <h2>${titles[0]}</h2>
//         <h3 slot="header">Sub header</h3>
//         <p slot="body">${bodyCopy[0]}</p>
//         <sl-button aria-label="Actions" icon-only slot="actions" fill="ghost">
//           <sl-icon name="ellipsis"></sl-icon>
//         </sl-button>
//       </sl-card>

//       <sl-card style="--sl-card-media-aspect-ratio:1/1;" padding media-position="end" explicit-height>
//         <img slot="media" src=${images[1]} />
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body"><em>aspect-ratio:1/1, padding, mediaPosition:end</em> - ${bodyCopy[1]}</p>
//       </sl-card>
//       <sl-card style="--sl-card-text-width:7fr; --sl-card-media-width:3fr;" explicit-height>
//         <img slot="media" src=${images[2]} />
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body"><em>text/card-ratio:7/3</em> - ${bodyCopy[1]}</p>
//       </sl-card>
//       <sl-card style="--sl-card-media-aspect-ratio:2/1;" padding media-position="end" explicit-height>
//         <sl-icon name="pinata" slot="icon"></sl-icon>
//         <img slot="media" src=${images[3]} />
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body"><em>icon:pinata, aspectratio:2/1, padding, mediaPosition:end</em> - ${bodyCopy[1]}</p>
//         <sl-button aria-label="Toggle visibility" icon-only slot="actions" fill="ghost">
//           <sl-icon name="eye"></sl-icon>
//         </sl-button>
//       </sl-card>
//     </div>
//   `
// };

// export const GridFixedRowHeightStretched: Story = {
//   render: ({ fitImage }) => html`
//     <style>
//       #root-inner > div {
//         gap: 16px;
//         margin-bottom: 24px;
//         width: 100%;
//       }
//       div.grid {
//         display: grid;
//         grid-auto-rows: 240px;
//         grid-template-columns: repeat(var(--cols, 2), 1fr);
//       }
//     </style>
//     <h1>In grid, fixed row height (all cards have 'excplicit-height')</h1>
//     <pre>
//     --sl-card-stretch-image:100%
//     </pre
//     >
//     <div class="grid" style="--sl-card-stretch-image:100%">
//       <sl-card explicit-height ?fit-image=${fitImage}>
//         <img slot="media" src=${images[0]} />
//         <h2>${titles[0]}</h2>
//         <span slot="header">Sub header</span>
//         <p slot="body">${bodyCopy[0]}</p>
//         <sl-button slot="actions"> <sl-icon name="far-download"></sl-icon> Download </sl-button>
//       </sl-card>
//       <sl-card
//         style="--sl-card-media-aspect-ratio:1/1;"
//         padding
//         media-position="end"
//         explicit-height
//         ?fit-image=${fitImage}
//       >
//         <img slot="media" src=${images[1]} />
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body"><em>aspectratio:1/1, padding, mediaPosition:end</em> - ${bodyCopy[1]}</p>
//       </sl-card>
//       <sl-card style="--sl-card-text-width:70fr; --sl-card-media-width:30fr;" explicit-height ?fit-image=${fitImage}>
//         <img slot="media" src=${images[2]} />
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body"><em>text/card-ratio:7/3</em> - ${bodyCopy[1]}</p>
//       </sl-card>
//       <sl-card
//         style="--sl-card-media-aspect-ratio:2/1;"
//         padding
//         media-position="end"
//         explicit-height
//         ?fit-image=${fitImage}
//       >
//         <sl-icon name="pinata" slot="icon"></sl-icon>
//         <img slot="media" src=${images[3]} />
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body"><em>padding, media: end, aspectratio: 2/1</em> - ${bodyCopy[1]}</p>
//         <sl-button slot="actions"> <sl-icon name="far-download"></sl-icon> Download </sl-button>
//       </sl-card>
//     </div>
//   `
// };

// export const GridFixedRowHeight3Columns: Story = {
//   render: () => html`
//     <style>
//       #root-inner > div {
//         gap: 16px;
//         margin-bottom: 24px;
//         width: 100%;
//       }
//       div.grid {
//         display: grid;
//         grid-auto-rows: 240px;
//         grid-template-columns: repeat(var(--cols, 2), 1fr);
//       }
//     </style>
//     <h1>In grid, fixed row height, 3 columns</h1>
//     <div class="grid" style="--cols: 3">
//       <sl-card explicit-height>
//         <img slot="media" src=${images[0]} />
//         <h2>${titles[0]}</h2>
//         <h3 slot="header">Sub header</h3>
//         <p slot="body">${bodyCopy[0]}</p>
//         <sl-button aria-label="Actions" icon-only slot="actions" fill="ghost">
//           <sl-icon name="ellipsis"></sl-icon>
//         </sl-button>
//       </sl-card>

//       <sl-card style="--sl-card-media-aspect-ratio:1/1;" padding explicit-height>
//         <img slot="media" src=${images[1]} />
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body"><em>padding, aspect ratio 1/1</em> - ${bodyCopy[1]}</p>
//       </sl-card>
//       <sl-card media-position="end" explicit-height>
//         <img slot="media" src=${images[2]} />
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body"><em>media-position: end</em> - ${bodyCopy[1]}</p>
//       </sl-card>
//       <sl-card padding media-position="end" explicit-height>
//         <sl-icon name="pinata" slot="icon"></sl-icon>
//         <img slot="media" src=${images[3]} />
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body"><em>icon:pinata, padding mediaposition:end</em> - ${bodyCopy[1]}</p>
//         <sl-button aria-label="Toggle visibility" icon-only slot="actions" fill="ghost">
//           <sl-icon name="eye"></sl-icon>
//         </sl-button>
//       </sl-card>
//     </div>
//   `
// };

// export const Vertical: Story = {
//   render: () => html`
//     <style>
//       #root-inner > div {
//         gap: 16px;
//         margin-bottom: 24px;
//         width: 100%;
//       }
//       div.flex {
//         align-items: flex-start;
//         display: flex;
//         flex-wrap: wrap;
//       }
//     </style>
//     <h1>Vertical, in flexbox rows, max width of 300px</h1>

//     <div class="flex">
//       <sl-card style="max-width: 300px" orientation="vertical" padding>
//         <img slot="media" src=${images[0]} />
//         <h2>${titles[0]}</h2>
//         <h3 slot="header">Sub header</h3>
//         <p slot="body"><em>padding</em> - ${bodyCopy[0]}</p>
//         <sl-button aria-label="Actions" icon-only slot="actions" fill="ghost">
//           <sl-icon name="ellipsis"></sl-icon>
//         </sl-button>
//       </sl-card>

//       <sl-card style="max-width: 300px;" orientation="vertical">
//         <sl-icon name="pinata" slot="icon"></sl-icon>
//         <img slot="media" src=${images[1]} />
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body"><em>icon:pinata</em> - ${bodyCopy[1]}</p>
//         <sl-button aria-label="Toggle visibility" icon-only slot="actions" fill="ghost">
//           <sl-icon name="eye"></sl-icon>
//         </sl-button>
//       </sl-card>
//       <sl-card style="max-width: 300px;" orientation="vertical">
//         <sl-icon name="pinata" slot="icon"></sl-icon>
//         <img slot="media" src=${images[1]} />
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body"><em>icon:pinata</em> - ${bodyCopy[1]}</p>
//       </sl-card>
//       <sl-card style="max-width: 300px" orientation="vertical">
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body">${bodyCopy[1]}</p>
//         <sl-button aria-label="Toggle visibility" icon-only slot="actions" fill="ghost">
//           <sl-icon name="eye"></sl-icon>
//         </sl-button>
//       </sl-card>
//       <sl-card style="max-width: 300px" orientation="vertical">
//         <sl-icon name="pinata" slot="icon"></sl-icon>
//         <h2>${titles[1]}</h2>
//         <span slot="header"><sl-badge>new</sl-badge></span>
//         <p slot="body"><em>icon:pinata</em> - ${bodyCopy[1]}</p>
//         <sl-button aria-label="Toggle visibility" icon-only slot="actions" fill="ghost">
//           <sl-icon name="eye"></sl-icon>
//         </sl-button>
//       </sl-card>
//     </div>
//   `
// };

export const All: Story = {
  render: () => html`
    <style>
      #root-inner > div {
        gap: 16px;
        margin-bottom: 24px;
        width: 100%;
        display: flex;
        flex-direction: column;
      }
    </style>
    <div>
      <sl-card style="--sl-card-media-aspect-ratio:1/1;" padding>
        <img slot="media" src=${images[1]} />
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body">${bodyCopy[1]}</p>
        <sl-button slot="actions"> <sl-icon name="far-download"></sl-icon> Download </sl-button>
      </sl-card>

      <sl-card style="--sl-card-media-aspect-ratio:1/1; max-width: 300px;" orientation="vertical">
        <img slot="media" src=${images[1]} />
        <h2>${titles[1]}</h2>
        <p slot="body">${bodyCopy[1]}</p>
      </sl-card>
    </div>
  `
};
