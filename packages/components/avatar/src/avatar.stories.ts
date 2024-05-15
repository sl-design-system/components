import '@sl-design-system/tooltip/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../register.js';
import { type Avatar } from './avatar.js';
import { type AvatarSize } from './models.js';

type Props = Pick<
  Avatar,
  | 'badgeText'
  | 'displayInitials'
  | 'displayName'
  | 'fallback'
  | 'href'
  | 'imageOnly'
  | 'label'
  | 'pictureUrl'
  | 'size'
  | 'status'
  | 'vertical'
> & {
  subheading?: string;
  tabIndex?: number;
};
type Story = StoryObj<Props>;

const sizes: AvatarSize[] = ['sm', 'md', 'lg', 'xl', '2xl', '3xl'];

export default {
  title: 'Components/Avatar',
  tags: ['preview'],
  args: {
    displayName: 'Rose Nylund',
    imageOnly: false,
    pictureUrl:
      'https://images.unsplash.com/photo-1699412958387-2fe86d46d394?q=80&w=188&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    size: 'md',
    subheading: ''
  },
  argTypes: {
    badgeText: {
      control: 'text'
    },
    fallback: {
      control: 'inline-radio',
      options: ['image', 'initials']
    },
    href: {
      control: 'text'
    },
    size: {
      control: 'inline-radio',
      options: sizes
    },
    status: {
      control: 'inline-radio',
      options: ['danger', 'success', 'warning', 'accent', 'neutral', 'primary']
    },
    vertical: {
      control: 'boolean'
    }
  },
  render: ({
    badgeText,
    displayInitials,
    displayName,
    fallback,
    href,
    imageOnly,
    label,
    pictureUrl,
    size,
    status,
    subheading,
    tabIndex,
    vertical
  }) => {
    return html`
      <div style="max-width:175px;">
        <sl-avatar
          .badgeText=${badgeText}
          .displayInitials=${displayInitials}
          .displayName=${displayName}
          .fallback=${fallback}
          .href=${href}
          .label=${label}
          .pictureUrl=${pictureUrl}
          .size=${size}
          .status=${status}
          ?image-only=${imageOnly}
          ?vertical=${vertical}
          tabindex=${ifDefined(tabIndex)}
          >${subheading}</sl-avatar
        >
      </div>
    `;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const Badge: Story = {
  args: {
    badgeText: '34',
    label: '{{badgeText}} unread messages'
  }
};

export const Href: Story = {
  args: {
    href: 'https://example.com',
    subheading: '30 May'
  }
};

export const ImageFallback: Story = {
  args: {
    fallback: 'image',
    pictureUrl: undefined
  }
};

export const ImageOnlyWithFocus: Story = {
  args: {
    imageOnly: true,
    size: 'xl',
    tabIndex: 0
  }
};

export const InitialsFallback: Story = {
  args: {
    fallback: 'initials',
    pictureUrl: undefined
  }
};

export const Initials: Story = {
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
    subheading: 'Ipsum adipisicing exercitation amet et anim consectetur.'
  }
};

export const Status: Story = {
  args: {
    badgeText: '34',
    status: 'accent'
  }
};

export const Subheading: Story = {
  args: {
    subheading: 'Subheading'
  }
};

export const Vertical: Story = {
  args: {
    displayName: 'Yousef van der Schaaf van Kommeren der Nederlanden',
    size: '2xl',
    vertical: true
  }
};

export const All: StoryObj = {
  render: () => {
    const sizeName = (size: string): string => {
      switch (size) {
        case 'sm':
          return 'Small';
        case 'md':
          return 'Medium';
        case 'lg':
          return 'Large';
        case 'xl':
          return 'Extra Large';
        case '2xl':
          return '2 Extra Large';
        case '3xl':
          return '3 Extra Large';
        case '4xl':
          return '4 Extra Large';
        default:
          return 'Extra Small';
      }
    };

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

        th {
          text-transform: capitalize;
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
            ${sizes.map(size => html`<th>${sizeName(size)}</th>`)}
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
            <td>Subheader</td>
            ${sizes.map(
              size => html`
                <td>
                  <sl-avatar .displayName=${users[2].name} .pictureUrl=${users[2].picture} .size=${size}
                    >Subheader</sl-avatar
                  >
                </td>
              `
            )}
          </tr>
          <tr>
            <td>Image fallback</td>
            ${sizes.map(size => html`<td><sl-avatar .displayName=${users[4].name} .size=${size}></sl-avatar></td>`)}
          </tr>
          <tr>
            <td>Initials fallback</td>
            ${sizes.map(
              size =>
                html`<td><sl-avatar .displayName=${users[3].name} .size=${size} fallback="initials"></sl-avatar></td>`
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
            <td>Status</td>
            ${sizes.map(
              size => html`
                <td>
                  <sl-avatar .displayName=${users[3].name} .size=${size} image-only status="success"></sl-avatar>
                </td>
              `
            )}
          </tr>
          <tr>
            <td>Badge</td>
            ${sizes.map(
              size => html`
                <td>
                  <sl-avatar .displayName=${users[3].name} .size=${size} image-only badge-text="34"></sl-avatar>
                </td>
              `
            )}
          </tr>
        </tbody>
      </table>
    `;
  }
};
