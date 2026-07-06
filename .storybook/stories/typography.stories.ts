import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';
import '@sl-design-system/inline-message/register.js';
import '@sl-design-system/badge/register.js';
import '@sl-design-system/popover/register.js';
import { Icon } from '../../packages/components/icon/src/icon';
import { faPlanetRinged } from '@fortawesome/pro-regular-svg-icons';
import { Popover } from '@sl-design-system/popover';

type Props = {
  doubleStory: boolean;
  earlyReaders: boolean;
  fontStretch: number;
  fontWeight: number;
  straightL: boolean;
  textRisers: boolean;
  textBox?: string;
};
type Story = StoryObj<Props>;

export default {
  title: 'Utilities/Typography',
  tags: ['stable'],
  parameters: {}
} satisfies Meta<Props>;

Icon.register(faPlanetRinged);

export const Basic: Story = {
  args: {
    earlyReaders: false,
    doubleStory: false,
    fontStretch: 100,
    fontWeight: 400,
    straightL: false,
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
  },
  render: ({ earlyReaders, doubleStory, fontStretch, fontWeight, textRisers, straightL }) => html`
    <style>
      body .container * {
        font-variation-settings:
          'wght' ${fontWeight},
          'wdth' ${fontStretch} !important;
        font-feature-settings: ${ifDefined(textRisers ? '"ss01"' : undefined)}
          ${ifDefined(earlyReaders ? '"ss02"' : undefined)}
          ${ifDefined(doubleStory ? '"ss03"' : undefined)}
          ${ifDefined(straightL ? '"ss04"' : undefined)} !important;
      }
    </style>
    <sl-inline-message variant="warning"
      >The font settings in this story overwrite the default font-variation-settings and
      font-feature-settings.</sl-inline-message
    >
    <div class="container">
      <h1 class="display lg">What are planets?</h1>
      <h2 class="heading">Basic facts about the solar system</h2>
      <p class="text">
        A planet is a large celestial body that orbits a star — in our case, the Sun. The solar
        system includes eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and
        Neptune. Each planet has a different size, temperature, and atmosphere. Children in Poland
        learn that Earth is the “błękitna planeta,” full of life. In Germany, they say: “Die Erde
        ist unser Zuhause.” And in Finland: “Maapallo on elävä planeetta.”
      </p>
      <h2 class="title">How do planets move?</h2>
      <p class="text">
        Planets travel along paths called orbits around the Sun. This movement is called a
        revolution. Earth takes about 365 days to complete one orbit. In the Netherlands, students
        learn: “De aarde draait om de zon.” In Sweden: “Jorden kretsar runt solen.” This orbital
        motion causes the changing seasons: spring, summer, autumn, and winter.
      </p>
      <p class="caption">
        PL: ą, ć, ę, ł, ń, ó, ś, ź, ż, zł; FI: ä, ö; NL: ë, ï, é, è; DE: ä, ö, ü, ß;
      </p>
      <p class="caption">SV: å, ä, ö; DA: æ, ø, å; NO: æ, ø, å</p>
      <hr />
      <p class="caption">Infant characters: a g</p>
      <p class="caption">Mirrored characters: p q, or d b</p>
      <sl-button><sl-icon name="far-planet-ringed"></sl-icon>Spin the planet!</sl-button>
    </div>
  `
};

const styleNames = ['Display', 'Heading', 'Title', 'Text', 'Label', 'Caption'];

const typographyStyles = (variant: string) => html`
  <div><h1 class="display lg">Display</h1></div>
  <div><h1 class="display md">Display</h1></div>
  <div class=${variant !== 'advanced' ? 'fallback' : ''}>
    <h1 class="display sm">Display</h1>
  </div>

  <div><h2 class="heading lg">Heading</h2></div>
  <div><h2 class="heading md">Heading</h2></div>
  <div class=${variant === 'early' ? 'fallback' : ''}>
    <h2 class="heading sm">Heading</h2>
  </div>

  <div><h2 class="title lg">Title</h2></div>
  <div class=${variant === 'early' ? 'fallback' : ''}><h2 class="title md">Title</h2></div>
  <div class=${variant === 'early' ? 'fallback' : ''}><h2 class="title sm">Title</h2></div>

  <div><p class="text lg">Text</p></div>
  <div><p class="text md">Text</p></div>
  <div><p class="text sm">Text</p></div>

  <div><p class="label lg">Label</p></div>
  <div><p class="label md">Label</p></div>
  <div>${variant !== 'early' ? html`<p class="label sm">Label</p>` : nothing}</div>

  <div><p class="caption lg">Caption</p></div>
  <div>${variant === 'advanced' ? html`<p class="caption md">Caption</p>` : nothing}</div>
  <div></div>
`;
export const TypographyStyles: Story = {
  args: {
    textBox: 'none'
  },
  argTypes: {
    textBox: {
      control: { type: 'radio' },
      options: ['none', 'untrimmed', 'trim-both-cap', 'trim-both-ex']
    }
  },
  render: ({ textBox }) => html`
    <style>
      .typography-grid {
        display: grid;
        grid-template-columns: repeat(4, max-content);
        grid-auto-rows: max-content;
        gap: 1rem;
        align-items: center;
      }
      .typography-grid > div {
        display: grid;
        grid-row: span ${styleNames.length * 3 + 1};
        grid-template-rows: subgrid;
      }
      sl-badge {
        align-self: center;
      }
      [data-user-group] {
        padding: 8px;
        border: 1px solid var(--sl-color-border-accent-grey-faint);
      }
      [data-user-group] > div {
        border: 1px solid var(--sl-color-border-accent-grey-plain);
        position: relative;
      }

      .fallback:before {
        content: '';
        display: block;
        height: 8px;
        width: 8px;
        border-radius: 50%;
        position: absolute;
        right: 0;
        top: 0;
        margin: 4px;
        background-color: var(--sl-color-background-accent-blue-bold);
      }
      .typography-grid:where(.untrimmed, .trim-both-cap, .trim-both-ex) > div > div > * {
        background-color: var(--sl-color-border-accent-grey-plain);
      }
      .typography-grid:where(.untrimmed, .trim-both-cap, .trim-both-ex) > div > div > * {
        background-color: var(--sl-color-background-accent-blue-subtle);
      }
      .typography-grid.trim-both-cap > div > div > * {
        text-box-trim: trim-both;
        text-box-edge: cap alphabetic;
      }
      .typography-grid.trim-both-ex > div > div > * {
        text-box-trim: trim-both;
        text-box-edge: ex alphabetic;
      }
      [data-user-group] > div {
        cursor: pointer;
      }
      [data-user-group] > div:hover {
        background-color: var(--sl-color-background-accent-grey-faint);
      }
      #style-content {
        white-space: pre-line;
      }
    </style>
    <div
      class="typography-grid ${ifDefined(textBox !== 'none' ? textBox : '')}"
      @click="${(e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const cell = target.closest('[data-user-group] > div');
        const previousAnchor = document.getElementById('clicked-cell');
        if (previousAnchor) {
          previousAnchor.removeAttribute('id');
        }
        if (cell) {
          const element = cell.querySelector('*') as HTMLElement;
          if (element) {
            const computed = window.getComputedStyle(element);
            const popover = document.getElementById('style-popover') as Popover;
            const content = document.getElementById('style-content');
            if (popover && content) {
              // Set new anchor
              cell.id = 'clicked-cell';

              // Update content
              content.textContent = `Element: ${element.tagName}.${element.className}
                  Font Family: ${computed.fontFamily}
                  Font Size: ${computed.fontSize}
                  Font Weight: ${computed.fontWeight}
                  Line Height: ${computed.lineHeight}
                  Letter Spacing: ${computed.letterSpacing}
                  Font Variation Settings: ${computed.fontVariationSettings || 'none'}
                  Font Feature Settings: ${computed.fontFeatureSettings || 'none'}`;

              popover.showPopover();
            }
          }
        }
      }}">
      <div>
        <span>size</span>

        ${styleNames.map(
          () => html`
            <sl-badge variant="info">lg</sl-badge>
            <sl-badge variant="info">md</sl-badge>
            <sl-badge variant="info">sm</sl-badge>
          `
        )}
      </div>

      <div data-user-group="early">
        <sl-badge size="lg">Early reader</sl-badge>
        ${typographyStyles('early')}
      </div>
      <div data-user-group="developing">
        <sl-badge size="lg">Developing reader</sl-badge>
        ${typographyStyles('developing')}
      </div>
      <div data-user-group="advanced">
        <sl-badge size="lg">Advanced reader</sl-badge>
        ${typographyStyles('advanced')}
      </div>
    </div>
    <sl-popover id="style-popover" position="top" anchor="clicked-cell">
      <div id="style-content">Click on any typography element to see its computed styles</div>
    </sl-popover>
  `
};
