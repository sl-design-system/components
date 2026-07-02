import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import { Icon } from '../../packages/components/icon/src/icon';
import { faPlanetRinged } from '@fortawesome/pro-regular-svg-icons';

type Props = {
  doubleStory: boolean;
  earlyReaders: boolean;
  fontStretch: number;
  fontWeight: number;
  textRisers: boolean;
};
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Typography',
  tags: ['stable'],
  parameters: {},
  args: {
    earlyReaders: false,
    doubleStory: false,
    fontStretch: 100,
    fontWeight: 400,
    textRisers: false
  },
  argTypes: {
    fontStretch: {
      control: {
        type: 'range',
        min: 75,
        max: 125,
        step: 1
      }
    },
    fontWeight: {
      control: {
        type: 'range',
        min: 125,
        max: 950,
        step: 1
      }
    }
  }
} satisfies Meta<Props>;

Icon.register(faPlanetRinged);

export const Basic: Story = {
  render: ({ earlyReaders, doubleStory, fontStretch, fontWeight, textRisers }) => html`
    <style>
      body {
        /* font-family: the-message-var, sans-serif; */
        font-stretch: ${fontStretch}%;
        font-weight: ${fontWeight};
        font-feature-settings: ${ifDefined(earlyReaders ? '"ss02"' : undefined)}
          ${ifDefined(doubleStory ? '"ss03"' : undefined)}
          ${ifDefined(textRisers ? '"ss01"' : undefined)};
      }
    </style>
    <h1>What are planets?</h1>
    <h2>Basic facts about the solar system</h2>
    <p>
      A planet is a large celestial body that orbits a star — in our case, the Sun. The solar system
      includes eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.
      Each planet has a different size, temperature, and atmosphere. Children in Poland learn that
      Earth is the “błękitna planeta,” full of life. In Germany, they say: “Die Erde ist unser
      Zuhause.” And in Finland: “Maapallo on elävä planeetta.”
    </p>
    <h2>How do planets move?</h2>
    <p>
      Planets travel along paths called orbits around the Sun. This movement is called a revolution.
      Earth takes about 365 days to complete one orbit. In the Netherlands, students learn: “De
      aarde draait om de zon.” In Sweden: “Jorden kretsar runt solen.” This orbital motion causes
      the changing seasons: spring, summer, autumn, and winter.
    </p>
    <p>PL: ą, ć, ę, ł, ń, ó, ś, ź, ż, zł; FI: ä, ö; NL: ë, ï, é, è; DE: ä, ö, ü, ß;</p>
    <p>SV: å, ä, ö; DA: æ, ø, å; NO: æ, ø, å</p>
    <hr />
    <p>Infant characters: a g</p>
    <p>Mirrored characters: p q, or d b</p>
    <sl-button><sl-icon name="far-planet-ringed"></sl-icon>Spin the planet!</sl-button>
  `
};
