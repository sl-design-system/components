import { faSchool } from '@fortawesome/pro-regular-svg-icons';
import '@sl-design-system/badge/register.js';
import { Icon } from '@sl-design-system/icon';
import '@sl-design-system/tooltip/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { type TemplateResult, html, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Avatar, type AvatarSize } from './avatar.js';

type Props = Pick<
  Avatar,
  'displayInitials' | 'displayName' | 'href' | 'imageOnly' | 'pictureUrl' | 'size' | 'vertical'
> & {
  badge?: TemplateResult;
  fallback?: TemplateResult;
  maxWidth?: string;
  subheading?: string;
  tabIndex?: number;
};
type Story = StoryObj<Props>;

const sizes: AvatarSize[] = ['sm', 'md', 'lg', 'xl', '2xl', '3xl'];

Icon.register(faSchool);

export default {
  title: 'Components/Avatar',
  tags: ['stable'],
  args: {
    displayName: 'Rose Nylund',
    imageOnly: false,
    pictureUrl:
      'https://images.unsplash.com/photo-1699412958387-2fe86d46d394?q=80&w=188&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    fallback: {
      table: {
        disable: true
      }
    },
    href: {
      control: 'text'
    },
    size: {
      control: 'inline-radio',
      options: sizes
    }
  },
  render: ({
    badge,
    displayInitials,
    displayName,
    fallback,
    href,
    imageOnly,
    maxWidth,
    pictureUrl,
    size,
    subheading,
    tabIndex,
    vertical
  }) => {
    return html`
      <sl-avatar
        .displayInitials=${displayInitials}
        .displayName=${displayName}
        .href=${href}
        .pictureUrl=${pictureUrl}
        .size=${size}
        ?image-only=${imageOnly}
        ?vertical=${vertical}
        style=${ifDefined(maxWidth ? `max-width: ${maxWidth}` : undefined)}
        tabindex=${ifDefined(tabIndex)}
      >
        ${subheading} ${badge ?? nothing} ${fallback ?? nothing}
      </sl-avatar>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Badge: Story = {
  args: {
    badge: html`<sl-badge aria-label="1 unread message" emphasis="bold" slot="badge" variant="warning">1</sl-badge>`,
    size: 'xl'
  }
};

export const FallbackContent: Story = {
  args: {
    displayName: 'Bluebell Secondary School',
    fallback: html`<sl-icon name="far-school" slot="fallback"></sl-icon>`,
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
    maxWidth: '175px',
    subheading: 'Ipsum adipisicing exercitation amet et anim consectetur.'
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
        picture: 'https://randomuser.me/api/portraits/thumb/mendfgdfgdfdfg/81.jpg'
      },
      {
        name: 'Chester Reid',
        picture: 'https://randomuser.me/api/portraits/thumb/men/19.jpg'
      },
      {
        name: 'Emma Henderson - Van Deursen',
        picture: 'https://randomuser.me/api/portraits/thumb/women/19.jpg'
      },
      {
        name: 'Johnni Sullivan'
      },
      {
        name: 'Gustav Christensen'
      },
      {
        name: 'Rose Nylund',
        picture: 'https://randomuser.me/api/portraits/thumb/women/10.jpg'
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
                <sl-badge aria-label="1 unread message" emphasis="bold" slot="badge" variant="danger">1</sl-badge>
              </sl-avatar>
            </td>
            <td>
              <sl-avatar .displayName=${users[3].name} size="xl" image-only>
                <sl-badge aria-label="1 unread message" emphasis="bold" slot="badge" variant="danger">
                  <sl-icon name="check"></sl-icon>
                </sl-badge>
              </sl-avatar>
            </td>
            <td>
              <sl-avatar .displayName=${users[3].name} size="2xl" image-only>
                <sl-badge aria-label="1 unread message" emphasis="bold" size="lg" slot="badge" variant="danger">
                  1234
                </sl-badge>
              </sl-avatar>
            </td>
            <td>
              <sl-avatar .displayName=${users[3].name} size="3xl" image-only>
                <sl-badge aria-label="1 unread message" emphasis="bold" size="lg" slot="badge" variant="danger">
                  <sl-icon name="check"></sl-icon>1
                </sl-badge>
              </sl-avatar>
            </td>
          </tr>
        </tbody>
      </table>
    `;
  }
};
