import { faSchool } from '@fortawesome/pro-regular-svg-icons';
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

const colors: AvatarColor[] = ['blue', 'green', 'grey', 'orange', 'purple', 'red', 'teal', 'yellow'],
  sizes: AvatarSize[] = ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];

Icon.register(faSchool);

export default {
  title: 'Media/Avatar',
  tags: ['stable'],
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

export const Badge: Story = {
  args: {
    badge: () => html`
      <sl-badge aria-label="1 unread message" emphasis="bold" slot="badge" variant="warning">1</sl-badge>
    `,
    size: 'xl'
  }
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
    displayName: 'Yousef van der Schaaf van Kommeren der Nederlanden',
    maxWidth: '300px',
    subheading: 'Ipsum adipisicing exercitation amet et anim consectetur.'
  }
};

export const Square: Story = {
  args: {
    shape: 'square'
  }
};

export const Subheading: Story = {
  args: {
    size: 'lg',
    subheading: 'Subheading'
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

export const All: StoryObj = {
  render: () => {
    const users: Array<{ name: string; picture?: string }> = [
      {
        name: 'Yousef van der Schaaf',
        picture: '/images/avatar-0.jpg'
      },
      {
        name: 'Chester Reid',
        picture: '/images/avatar-1.jpg'
      },
      {
        name: 'Emma Henderson - Van Deursen',
        picture: '/images/avatar-2.jpg'
      },
      {
        name: 'Johnni Sullivan'
      },
      {
        name: 'Gustav Christensen'
      },
      {
        name: 'Rose Nylund',
        picture: '/images/avatar-3.jpg'
      }
    ];

    return html`
      <style>
        table {
          border-collapse: collapse;
          margin-bottom: 24px;
        }

        th,
        td {
          padding: 4px 8px;
          vertical-align: middle;
          --max-width: 100px;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th></th>
            ${sizes.map(size => html`<th>${size}</th>`)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Basic</td>
            ${sizes.map(
              size => html`
                <td>
                  <sl-avatar .displayName=${users[0].name} .pictureUrl=${users[0].picture} .size=${size}></sl-avatar>
                </td>
              `
            )}
          </tr>
          <tr>
            <td>Subheading</td>
            ${sizes.map(
              size => html`
                <td>
                  <sl-avatar .displayName=${users[2].name} .pictureUrl=${users[2].picture} .size=${size}
                    >Subheading</sl-avatar
                  >
                </td>
              `
            )}
          </tr>
          <tr>
            <td>Fallback content</td>
            ${sizes.map(
              size => html`
                <td>
                  <sl-avatar .displayName=${users[4].name} .size=${size}>
                    <sl-icon name="check" slot="fallback"></sl-icon>
                  </sl-avatar>
                </td>
              `
            )}
          </tr>
          <tr>
            <td>Link</td>
            ${sizes.map(
              size => html`
                <td>
                  <sl-avatar .displayName=${users[3].name} .size=${size} href="https://example.com"></sl-avatar>
                </td>
              `
            )}
          </tr>
          <tr>
            <td>Image only</td>
            ${sizes.map(
              size => html`
                <td>
                  <sl-avatar
                    .displayName=${users[3].name}
                    .pictureUrl=${users[1].picture}
                    .size=${size}
                    image-only
                  ></sl-avatar>
                </td>
              `
            )}
          </tr>
          <tr>
            <td>Badge</td>
            <td>
              <sl-avatar .displayName=${users[3].name} size="sm" image-only>
                <sl-badge
                  aria-label="1 unread message"
                  emphasis="bold"
                  size="sm"
                  slot="badge"
                  variant="danger"
                ></sl-badge>
              </sl-avatar>
            </td>
            <td>
              <sl-avatar .displayName=${users[3].name} size="md" image-only>
                <sl-badge
                  aria-label="1 unread message"
                  emphasis="bold"
                  size="sm"
                  slot="badge"
                  variant="danger"
                ></sl-badge>
              </sl-avatar>
            </td>
            <td>
              <sl-avatar .displayName=${users[3].name} size="lg" image-only>
                <sl-badge aria-label="1 unread message" emphasis="bold" slot="badge" variant="danger">2</sl-badge>
              </sl-avatar>
            </td>
            <td>
              <sl-avatar .displayName=${users[3].name} size="xl" image-only>
                <sl-badge aria-label="1 unread message" emphasis="bold" slot="badge" variant="danger">2</sl-badge>
              </sl-avatar>
            </td>
            <td>
              <sl-avatar .displayName=${users[3].name} size="2xl" image-only>
                <sl-badge aria-label="1 unread message" emphasis="bold" size="lg" slot="badge" variant="danger">
                  2
                </sl-badge>
              </sl-avatar>
            </td>
            <td>
              <sl-avatar .displayName=${users[3].name} size="3xl" image-only>
                <sl-badge aria-label="1 unread message" emphasis="bold" size="lg" slot="badge" variant="danger">
                  2
                </sl-badge>
              </sl-avatar>
            </td>
            <td>
              <sl-avatar .displayName=${users[3].name} size="4xl" image-only>
                <sl-badge aria-label="1 unread message" emphasis="bold" size="lg" slot="badge" variant="danger">
                  2
                </sl-badge>
              </sl-avatar>
            </td>
          </tr>
        </tbody>
      </table>
    `;
  }
};
