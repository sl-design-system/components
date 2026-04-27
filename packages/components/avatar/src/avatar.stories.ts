import { faSchool } from '@fortawesome/pro-regular-svg-icons';
import { type BadgeSize } from '@sl-design-system/badge';
import '@sl-design-system/badge/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/tooltip/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components-vite';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Avatar, type AvatarColor, type AvatarSize } from './avatar.js';

type Props = Pick<
  Avatar,
  | 'color'
  | 'displayInitials'
  | 'displayName'
  | 'emphasis'
  | 'href'
  | 'imageOnly'
  | 'pictureUrl'
  | 'shape'
  | 'size'
  | 'vertical'
> & {
  badge?(): TemplateResult;
  fallback?(): TemplateResult;
  maxWidth?: string;
  subheading?: string;
  tabIndex?: number;
};
type Story = StoryObj<Props>;

const colors: AvatarColor[] = [
    'blue',
    'green',
    'grey',
    'orange',
    'purple',
    'red',
    'teal',
    'yellow'
  ],
  sizes: AvatarSize[] = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

Icon.register(faSchool);

export default {
  title: 'Media/Avatar',
  args: {
    displayName: 'Rose Nylund',
    imageOnly: false,
    pictureUrl: '/images/avatar-1.jpg',
    size: 'md',
    subheading: '',
    vertical: false
  },
  argTypes: {
    badge: {
      table: {
        disable: true
      }
    },
    color: {
      control: 'radio',
      options: colors
    },
    emphasis: {
      control: 'inline-radio',
      options: ['subtle', 'bold']
    },
    fallback: {
      table: {
        disable: true
      }
    },
    href: {
      control: 'text'
    },
    shape: {
      control: 'inline-radio',
      options: ['circle', 'square']
    },
    size: {
      control: 'inline-radio',
      options: sizes
    }
  },
  render: ({
    badge,
    color,
    displayInitials,
    displayName,
    emphasis,
    fallback,
    href,
    imageOnly,
    maxWidth,
    pictureUrl,
    shape,
    size,
    subheading,
    tabIndex,
    vertical
  }) => {
    return html`
      <sl-avatar
        .displayName=${displayName}
        ?image-only=${imageOnly}
        ?vertical=${vertical}
        color=${ifDefined(color)}
        display-initials=${ifDefined(displayInitials)}
        emphasis=${ifDefined(emphasis)}
        href=${ifDefined(href)}
        picture-url=${ifDefined(pictureUrl)}
        shape=${ifDefined(shape)}
        size=${ifDefined(size)}
        style=${ifDefined(maxWidth ? `max-width: ${maxWidth}` : undefined)}
        tabindex=${ifDefined(tabIndex)}
      >
        ${subheading} ${badge?.() ?? nothing} ${fallback?.() ?? nothing}
      </sl-avatar>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Colors: Story = {
  argTypes: {
    ...[
      'color',
      'displayName',
      'displayInitials',
      'emphasis',
      'href',
      'imageOnly',
      'pictureUrl',
      'subheading',
      'vertical'
    ].reduce((acc, prop) => ({ ...acc, [prop]: { table: { disable: true } } }), {})
  },
  render: ({ shape, size }) => html`
    <div style="display: inline-grid; grid-template-columns: auto auto; gap: 1rem">
      ${colors.map(
        color => html`
          <sl-avatar
            color=${color}
            display-name=${`${color.at(0)?.toUpperCase() + color.slice(1)} subtle`}
            shape=${ifDefined(shape)}
            size=${ifDefined(size)}
          ></sl-avatar>
          <sl-avatar
            color=${color}
            display-name=${`${color.at(0)?.toUpperCase() + color.slice(1)} bold`}
            emphasis="bold"
            shape=${ifDefined(shape)}
            size=${ifDefined(size)}
          ></sl-avatar>
        `
      )}
    </div>
  `
};

export const FallbackContent: Story = {
  args: {
    displayName: 'Bluebell Secondary School',
    fallback: () => html`<sl-icon name="far-school" slot="fallback"></sl-icon>`,
    pictureUrl: undefined,
    size: 'xl',
    subheading: '1432 students'
  }
};

export const Href: Story = {
  args: {
    href: 'https://example.com',
    size: 'lg',
    subheading: '30 May'
  }
};

export const ImageOnlyWithFocus: Story = {
  args: {
    imageOnly: true,
    size: 'xl',
    tabIndex: 0
  }
};

export const ImplicitInitials: Story = {
  args: {
    pictureUrl: undefined,
    size: 'xl'
  }
};

export const CustomInitials: Story = {
  args: {
    displayInitials: 'SLDS',
    displayName: 'SL Design System',
    pictureUrl: undefined,
    size: 'xl'
  }
};

export const Overflow: Story = {
  args: {
    displayName:
      'If the display name does not fit, it will be truncated and a tooltip will automatically be added',
    maxWidth: '300px',
    size: 'lg',
    subheading: 'Ipsum adipisicing exercitation amet et anim consectetur.'
  }
};

const badgeSizes: Record<AvatarSize, BadgeSize> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
  xl: 'md',
  '2xl': 'md',
  '3xl': 'lg',
  '4xl': 'lg'
};

const countPerCanvas = new WeakMap<Element, number>(),
  intervalPerCanvas = new WeakMap<Element, ReturnType<typeof setInterval>>();

export const Sizes: Story = {
  args: {
    subheading: 'Subheading'
  },
  play: ({ canvasElement }) => {
    const previousInterval = intervalPerCanvas.get(canvasElement);

    if (previousInterval) {
      clearInterval(previousInterval);
      intervalPerCanvas.delete(canvasElement);
    }

    countPerCanvas.set(canvasElement, 2);
    const maxCount = 30;

    const dynamicSizes: AvatarSize[] = ['sm', '4xl'];

    const interval = setInterval(() => {
      const count = (countPerCanvas.get(canvasElement) ?? 2) + 1;

      if (!canvasElement.isConnected || count > maxCount) {
        clearInterval(interval);
        intervalPerCanvas.delete(canvasElement);

        return;
      }

      countPerCanvas.set(canvasElement, count);

      dynamicSizes.forEach(size => {
        const avatar = canvasElement.querySelector<HTMLElement>(`sl-avatar[size='${size}']`),
          badge = avatar?.querySelector('sl-badge');

        if (!badge) return;

        // For sm badges there is no visible text, so update the sr-only span
        // with the full message. For 4xl badges update the visible text node.
        if (size === 'sm') {
          const srSpan = badge.querySelector('.screen-reader-only');
          if (srSpan) {
            srSpan.textContent = `${count} unread messages`;
          }
        } else {
          const textNode = [...badge.childNodes].find(
            n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()
          );

          if (textNode) {
            textNode.textContent = `${count}`;
          }
        }
      });
    }, 5000);

    intervalPerCanvas.set(canvasElement, interval);
  },
  render: ({
    color,
    displayInitials,
    emphasis,
    href,
    pictureUrl,
    shape,
    subheading,
    vertical
  }) => html`
    <style>
      .screen-reader-only {
        block-size: 1px;
        border: 0;
        clip-path: inset(50%);
        inline-size: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        white-space: nowrap;
      }
    </style>
    <p>
      Avatars with badges in all available sizes. The <code>sm</code> and <code>4xl</code> badges
      use <code>role="status"</code> with a visually-hidden <code>span</code> providing context for
      screen readers; their count updates every 5 seconds to simulate dynamic content. See the
      <a href="https://sanomalearning.design/categories/components/avatar/accessibility/"
        >accessibility guidelines</a
      >
      for details on badge usage in avatar.
    </p>
    <div style="display: flex; flex-direction: column; gap: 1rem">
      ${sizes.map(
        size => html`
          <sl-avatar
            display-name=${`Size: ${size}`}
            color=${ifDefined(color)}
            display-initials=${ifDefined(displayInitials)}
            emphasis=${ifDefined(emphasis)}
            href=${ifDefined(href)}
            picture-url=${ifDefined(pictureUrl)}
            shape=${ifDefined(shape)}
            size=${size}
            ?vertical=${vertical}
          >
            ${subheading ? html`<span>${subheading}</span>` : nothing}
            <sl-badge
              .size=${badgeSizes[size]}
              color="red"
              emphasis="bold"
              role=${ifDefined(size === 'sm' || size === '4xl' ? 'status' : undefined)}
              slot="badge"
            >
              ${badgeSizes[size] === 'sm' ? nothing : '2'}
              ${size === 'sm'
                ? html`<span class="screen-reader-only">2 unread messages</span>`
                : size === '4xl'
                  ? html`<span class="screen-reader-only">unread messages</span>`
                  : nothing}
            </sl-badge>
          </sl-avatar>
        `
      )}
    </div>
  `
};

export const Square: Story = {
  args: {
    shape: 'square'
  }
};

export const Vertical: Story = {
  args: {
    displayName: 'Yousef van der Schaaf van Kommeren der Nederlanden',
    maxWidth: '175px',
    size: '2xl',
    vertical: true
  }
};
