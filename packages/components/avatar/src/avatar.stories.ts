import { faSchool } from '@fortawesome/pro-regular-svg-icons';
import { type BadgeSize } from '@sl-design-system/badge';
import '@sl-design-system/badge/register.js';
import { Icon } from '@sl-design-system/icon';
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
      <style>
        sl-avatar::part(tooltip) {
          max-inline-size: 200px;
        }
      </style>
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
        tabindex=${ifDefined(tabIndex)}>
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
            size=${ifDefined(size)}></sl-avatar>
          <sl-avatar
            color=${color}
            display-name=${`${color.at(0)?.toUpperCase() + color.slice(1)} bold`}
            emphasis="bold"
            shape=${ifDefined(shape)}
            size=${ifDefined(size)}></sl-avatar>
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

/** Update the badge text and live-region for a given avatar size. */
const updateStatus = (canvas: Element, size: AvatarSize, count: number): void => {
  const avatar = canvas.querySelector<HTMLElement>(`sl-avatar[size='${size}']`);

  if (!avatar) return;

  // Update the visible text node inside the badge (sm badges have no text).
  if (badgeSizes[size] !== 'sm') {
    const badge = avatar.querySelector('sl-badge'),
      textNode =
        badge &&
        [...badge.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());

    if (textNode) {
      textNode.textContent = `${count}`;
    }
  }

  // Clear first, then set after a frame so every browser (including Firefox)
  // treats it as a full content change and announces the complete text.
  const status = avatar.querySelector<HTMLSpanElement>('[role="status"]');
  if (status) {
    status.textContent = '';
    requestAnimationFrame(() => {
      status.textContent = `${count} unread messages`;
    });
  }
};

export const Sizes: Story = {
  args: {
    subheading: 'Subheading'
  },
  play: ({ canvasElement }) => {
    const previousInterval = intervalPerCanvas.get(canvasElement);

    if (previousInterval) {
      clearInterval(previousInterval);
    }

    countPerCanvas.set(canvasElement, 2);

    const interval = setInterval(() => {
      const count = (countPerCanvas.get(canvasElement) ?? 2) + 1;

      if (!canvasElement.isConnected || count > 9) {
        clearInterval(interval);
        intervalPerCanvas.delete(canvasElement);

        return;
      }

      countPerCanvas.set(canvasElement, count);

      updateStatus(canvasElement, '4xl', count);
      setTimeout(() => {
        if (canvasElement.isConnected) {
          updateStatus(canvasElement, 'sm', count);
        }
      }, 2500);
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
      Avatars with badges in all sizes. The <code>sm</code> and <code>4xl</code> badges have a
      sibling <code>&lt;span role="status"&gt;</code> with a descriptive text like "3 unread
      messages" that updates every 5&nbsp;seconds to show how dynamic content works with screen
      readers. The other badges are static and have a visually-hidden <code>span</code> inside the
      badge with the same kind of text for screen readers. See the
      <a href="https://sanomalearning.design/categories/components/avatar/accessibility/"
        >accessibility guidelines</a
      >
      for details.
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
            ?vertical=${vertical}>
            ${subheading ? html`<span>${subheading}</span>` : nothing}
            <sl-badge .size=${badgeSizes[size]} color="red" emphasis="bold" slot="badge">
              ${badgeSizes[size] === 'sm' ? nothing : '2'}
              ${size !== 'sm' && size !== '4xl'
                ? badgeSizes[size] === 'sm'
                  ? html`<span class="screen-reader-only">2 unread messages</span>`
                  : html`<span class="screen-reader-only">unread messages</span>`
                : nothing}
            </sl-badge>
            ${size === 'sm' || size === '4xl'
              ? html`
                  <span class="screen-reader-only" role="status" slot="badge">
                    2 unread messages
                  </span>
                `
              : nothing}
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
