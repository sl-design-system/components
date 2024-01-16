import type { Card } from './card.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit';
import '../register.js';

type Props = Pick<Card, 'padding' | 'orientation'> & {
  media?: boolean;
  title?: string;
  bodyText?: string;
  imageUrl?: string;
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
      'https://images.unsplash.com/photo-1586622992874-27d98f198139?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: orientations
    }
  },
  render: ({ media, title, bodyText, orientation, imageUrl }) => html`
    <sl-card .orientation=${orientation}>
      ${media ? html`<img slot="media" .src="${imageUrl}" />` : nothing}

      <h2>${title}</h2>
      <p slot="body">${bodyText}</p>
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
  rich tapestry of culture, history, and architectural beauty at every turn.`
];

export const All: Story = {
  render: () => html`<style>
      div.flex {
        align-items: flex-start;
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        width: 100%;
        border: 1px solid cornflowerblue;
      }
    </style>
    Flex:
    <div class="flex">
      <sl-card responsive style="flex:1 1 30%">
        <img slot="media" src="${images[0]}" />
        <h2>${titles[0]}</h2>
        <p slot="body">Responsive, flex-size - ${bodyCopy[0]}</p>
      </sl-card>

      <sl-card style="max-width: 300px" orientation="vertical">
        <img slot="media" src="${images[1]}" />
        <h2>${titles[1]}</h2>
        <p slot="body">vertical - max-width${bodyCopy[1]}</p>
      </sl-card>
    </div>

    <sl-card>
      <img slot="media" src="${images[2]}" />
      <h2>${titles[2]}</h2>
      <p slot="body">${bodyCopy[2]}</p>
    </sl-card>
    <sl-card responsive>
      <img slot="media" src="${images[3]}" />
      <h2>${titles[3]}</h2>
      <p slot="body">responsive - ${bodyCopy[3]}</p>
    </sl-card>`
};
