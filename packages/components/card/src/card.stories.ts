import type { Card } from './card.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/badge/register.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { html, nothing } from 'lit';
import '../register.js';

type Props = Pick<Card, 'padding' | 'orientation'> & {
  media?: boolean;
  title?: string;
  bodyText?: string;
  imageUrl?: string;
  subheaderContent?: boolean;
  subheaderBadge?: string;
  subheaderText?: string;
  actionButton?: boolean;
  actionButtonIcon?: string;
  cardIcon?: string;
};

type Story = StoryObj<Props>;

const orientations = ['horizontal', 'vertical'];

export default {
  title: 'Card',
  args: {
    title: 'Lorem Ipsum',
    bodyText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac ex et leo feugiat pellentesque. Fusce faucibus non turpis at euismod. Quisque imperdiet imperdiet dui et tincidunt. ',
    media: true,
    orientation: 'horizontal',
    imageUrl:
      'https://images.unsplash.com/photo-1586622992874-27d98f198139?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    subheaderContent: true,
    subheaderBadge: 'new',
    subheaderText: 'Written by Nils',
    actionButton: true,
    actionButtonIcon: 'ellipsis',
    cardIcon: 'pinata'
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
    },
    actionButtonIcon: {
      control: 'text',
      if: { arg: 'actionButton' }
    }
  },
  render: ({
    media,
    title,
    bodyText,
    orientation,
    imageUrl,
    subheaderContent,
    subheaderBadge,
    subheaderText,
    actionButton,
    actionButtonIcon,
    cardIcon
  }) => html`
    <sl-card .orientation=${orientation}>
      ${media && imageUrl ? html`<img slot="media" src=${imageUrl} />` : nothing}
      ${cardIcon ? html`<sl-icon .name="${cardIcon}" slot="icon"></sl-icon>` : nothing}
      <h2>${title}</h2>
      ${subheaderContent
        ? html`<span slot="header"
            >${subheaderBadge ? html`<sl-badge>${subheaderBadge}</sl-badge>` : nothing} ${subheaderText}</span
          >`
        : nothing}
      <p slot="body">${bodyText}</p>
      ${actionButton
        ? html`<sl-button icon-only slot="actions" fill="ghost"
            ><sl-icon .name="${actionButtonIcon}"></sl-icon
          ></sl-button>`
        : nothing}
    </sl-card>
  `
} satisfies Meta<Props>;

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
  `Immerse yourself in the vibrant hues of Nyhavn, Copenhagen's iconic waterfront. This picturesque scene,
  adorned with colorful facades and historic ships, invites you to explore the charm of Danish culture against
  the backdrop of serene canals.`,
  `Discover the allure of Nyhavn, Copenhagen's waterfront gem, where historic charm meets vibrant hues in every
  corner.`,
  `Copenhagen's skyline is a testament to architectural brilliance, seamlessly blending historic landmarks with 
  contemporary design. Wander through a cityscape where each building tells a unique story, creating a harmonious 
  fusion of past and present.`,
  `Delight in the enchanting allure of Copenhagen, where timeless elegance meets modern vibrancy. Explore the city's 
  rich tapestry of culture, history, and architectural beauty at every turn.`,
  `Nyhavn, the picturesque waterfront district of Copenhagen, beckons visitors with its timeless charm and vibrant atmosphere. 
  Flanked by rows of colorful townhouses dating back to the 17th century, this iconic area exudes a sense of history and character. 
  As you stroll along the cobblestone streets, the scent of freshly baked pastries mingles with the salty breeze from the harbor, 
  creating a sensory symphony that captivates all who wander here.
  Yet Nyhavn is not merely a relic of the past; it's a lively hub of activity, where locals and tourists alike gather to enjoy the 
  numerous cafes, bars, and restaurants lining the quayside. From leisurely boat tours along the picturesque canals to lively outdoor 
  concerts and events, there's always something happening in Nyhavn. Whether you're sipping a cold beer by the water's edge or admiring 
  the sunset painting the sky in hues of pink and gold, Nyhavn offers a quintessentially Danish experience that is both timeless and 
  unforgettable.`
];

export const All: Story = {
  render: () => html`<style>
      #root-inner > div {
        gap: 16px;
        margin-bottom: 24px;
        width: 100%;
      }
      div.flex {
        align-items: flex-start;
        display: flex;
        flex-wrap: wrap;
      }
      div.grid {
        display: grid;
        grid-auto-rows: 240px;
        grid-template-columns: repeat(var(--cols, 2), 1fr);
      }
    </style>
    <h1>In flexbox, full width, responsive cards</h1>
    <pre>
      flex-direction:column;
      --sl-card-horizontal-breakpoint:500px; 
      --sl-card-text-width:70fr;
      --sl-card-media-width:30fr;
    </pre
    >
    <div
      class="flex"
      style="flex-direction:column; --sl-card-horizontal-breakpoint:500px; --sl-card-text-width:70fr; --sl-card-media-width:30fr;"
    >
      <sl-card responsive style="--sl-card-media-aspect-ratio:16/9;">
        <iframe
          width="560px"
          height="315px"
          slot="media"
          src="https://www.youtube-nocookie.com/embed/LkHztUGllkc?si=2rc92T2iTKBbSQK4&amp;controls=0"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
        <h2>${titles[0]}</h2>
        <h3 slot="header">Sub header</h3>
        <p slot="body"><em>aspectratio:16/9</em> - ${bodyCopy[0]}</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="ellipsis"></sl-icon></sl-button>
      </sl-card>

      <sl-card responsive style="--sl-card-media-aspect-ratio:1/1;" padding>
        <img slot="media" src="${images[1]}" />
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body"><em>Padding, aspect-ratio:1/1</em> - ${bodyCopy[1]}</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="eye"></sl-icon></sl-button>
      </sl-card>

      <sl-card responsive media-position="end" height="flex">
        <img slot="media" src="${images[2]}" />
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body"><em>mediaPosition: end, height:flex</em> - ${bodyCopy[4]}</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="eye"></sl-icon></sl-button>
      </sl-card>

      <sl-card responsive padding media-position="end" style="--sl-card-media-aspect-ratio:1/1;">
        <sl-icon name="pinata" slot="icon"></sl-icon>
        <img slot="media" src="${images[3]}" />
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body"><em>icon:pinata, padding, mediaPosition:end, aspectratio:1/1</em> - ${bodyCopy[1]}</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="eye"></sl-icon></sl-button>
      </sl-card>
    </div>

    <hr />
    <h1>Flex height, full width, image width is set</h1>
    <sl-card height="flex" style="--sl-card-image-width:200px">
      <img slot="media" src="${images[2]}" />
      <h2>${titles[1]}</h2>
      <span slot="header"><sl-badge>new</sl-badge></span>
      <p slot="body"><em>imageWidth:200px, height:flex</em> - ${bodyCopy[4]}</p>
      <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="eye"></sl-icon></sl-button>
    </sl-card>

    <hr />
    <h1>In grid, fixed row height (all cards have 'excplicit-height')</h1>
    <div class="grid">
      <sl-card explicit-height>
        <img slot="media" src="${images[0]}" />
        <h2>${titles[0]}</h2>
        <h3 slot="header">Sub header</h3>
        <p slot="body">${bodyCopy[0]}</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="ellipsis"></sl-icon></sl-button>
      </sl-card>

      <sl-card style="--sl-card-media-aspect-ratio:1/1;" padding media-position="end" explicit-height>
        <img slot="media" src="${images[1]}" />
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body"><em>aspect-ratio:1/1, padding, mediaPosition:end</em> - ${bodyCopy[1]}</p>
      </sl-card>
      <sl-card style="--sl-card-text-width:7fr; --sl-card-media-width:3fr;" explicit-height>
        <img slot="media" src="${images[2]}" />
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body"><em>text/card-ratio:7/3</em> - ${bodyCopy[1]}</p>
      </sl-card>
      <sl-card style="--sl-card-media-aspect-ratio:2/1;" padding media-position="end" explicit-height>
        <sl-icon name="pinata" slot="icon"></sl-icon>
        <img slot="media" src="${images[3]}" />
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body"><em>icon:pinata, aspectratio:2/1, padding, mediaPosition:end</em> - ${bodyCopy[1]}</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="eye"></sl-icon></sl-button>
      </sl-card>
    </div>
    <hr />
    <h1>In grid, fixed row height (all cards have 'excplicit-height')</h1>
    <pre>
    --sl-card-stretch-image:100%
    </pre
    >
    <div class="grid" style="--sl-card-stretch-image:100%">
      <sl-card explicit-height>
        <img slot="media" src="${images[0]}" />
        <h2>${titles[0]}</h2>
        <h3 slot="header">Sub header</h3>
        <p slot="body">${bodyCopy[0]}</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="ellipsis"></sl-icon></sl-button>
      </sl-card>
      <sl-card style="--sl-card-media-aspect-ratio:1/1;" padding media-position="end" explicit-height>
        <img slot="media" src="${images[1]}" />
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body"><em>aspectratio:1/1, padding, mediaPosition:end</em> - ${bodyCopy[1]}</p>
      </sl-card>
      <sl-card style="--sl-card-text-width:70fr; --sl-card-media-width:30fr;" explicit-height>
        <img slot="media" src="${images[2]}" />
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body"><em>text/card-ratio:7/3</em> - ${bodyCopy[1]}</p>
      </sl-card>
      <sl-card style="--sl-card-media-aspect-ratio:2/1;" padding media-position="end" explicit-height>
        <sl-icon name="pinata" slot="icon"></sl-icon>
        <img slot="media" src="${images[3]}" />
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body"><em>padding, media: end, aspectratio: 2/1</em> - ${bodyCopy[1]}</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="eye"></sl-icon></sl-button>
      </sl-card>
    </div>

    <hr />
    <h1>In grid, fixed row height, 3 columns</h1>
    <div class="grid" style="--cols: 3">
      <sl-card explicit-height>
        <img slot="media" src="${images[0]}" />
        <h2>${titles[0]}</h2>
        <h3 slot="header">Sub header</h3>
        <p slot="body">${bodyCopy[0]}</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="ellipsis"></sl-icon></sl-button>
      </sl-card>

      <sl-card style="--sl-card-media-aspect-ratio:1/1;" padding explicit-height>
        <img slot="media" src="${images[1]}" />
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body"><em>padding, aspect ratio 1/1</em> - ${bodyCopy[1]}</p>
      </sl-card>
      <sl-card media-position="end" explicit-height>
        <img slot="media" src="${images[2]}" />
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body"><em>media-position: end</em> - ${bodyCopy[1]}</p>
      </sl-card>
      <sl-card padding media-position="end" explicit-height>
        <sl-icon name="pinata" slot="icon"></sl-icon>
        <img slot="media" src="${images[3]}" />
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body"><em>icon:pinata, padding mediaposition:end</em> - ${bodyCopy[1]}</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="eye"></sl-icon></sl-button>
      </sl-card>
    </div>

    <hr />
    <h1>Vertical, in flexbox rows, max width of 300px</h1>
    <pre>
      --sl-card-media-aspect-ratio:1/1;
    </pre
    >
    <div class="flex">
      <sl-card style="max-width: 300px" orientation="vertical" padding>
        <img slot="media" src="${images[0]}" />
        <h2>${titles[0]}</h2>
        <h3 slot="header">Sub header</h3>
        <p slot="body"><em>padding</em> - ${bodyCopy[0]}</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="ellipsis"></sl-icon></sl-button>
      </sl-card>

      <sl-card style="max-width: 300px;" orientation="vertical">
        <sl-icon name="pinata" slot="icon"></sl-icon>
        <img slot="media" src="${images[1]}" />
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body"><em>icon:pinata</em> - ${bodyCopy[1]}</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="eye"></sl-icon></sl-button>
      </sl-card>
      <sl-card style="max-width: 300px;" orientation="vertical">
        <sl-icon name="pinata" slot="icon"></sl-icon>
        <img slot="media" src="${images[1]}" />
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body"><em>icon:pinata</em> - ${bodyCopy[1]}</p>
      </sl-card>
      <sl-card style="max-width: 300px" orientation="vertical">
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body">${bodyCopy[1]}</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="eye"></sl-icon></sl-button>
      </sl-card>
      <sl-card style="max-width: 300px" orientation="vertical">
        <sl-icon name="pinata" slot="icon"></sl-icon>
        <h2>${titles[1]}</h2>
        <span slot="header"><sl-badge>new</sl-badge></span>
        <p slot="body"><em>icon:pinata</em> - ${bodyCopy[1]}</p>
        <sl-button icon-only slot="actions" fill="ghost"><sl-icon name="eye"></sl-icon></sl-button>
      </sl-card>
    </div>`
};
