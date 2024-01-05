import type { Avatar } from './avatar.js';
import type { AvatarFallbackType, AvatarOrientation, AvatarSize, UserProfile, UserStatus } from './models.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/tooltip/register.js';
import { html } from 'lit';
import '../register.js';

interface Props
  extends Pick<Avatar, 'title' | 'size' | 'fallback' | 'status' | 'imageOnly' | 'orientation' | 'badgeText'> {
  title: string;
  firstName: string;
  lastName: string;
  picture: string;
  imageOnly: boolean;
  orientation: AvatarOrientation;
  subheading: string;
  badgeText: string;
  labelText: string;
}

type Story = StoryObj<Props>;

const users: UserProfile[] = [
  {
    name: {
      first: 'Yousef',
      prefix: 'van der',
      last: 'Schaaf'
    },
    picture: {
      thumbnail: 'https://randomuser.me/api/portraits/thumb/mendfgdfgdfdfg/81.jpg'
    }
  },
  {
    name: {
      first: 'Chester',
      last: 'Reid'
    },
    picture: {
      thumbnail: 'https://randomuser.me/api/portraits/thumb/men/19.jpg'
    }
  },
  {
    name: {
      first: 'Emma',
      last: 'Henderson - Van Deursen'
    },
    picture: {
      thumbnail: 'https://randomuser.me/api/portraits/thumb/women/19.jpg'
    }
  },
  {
    name: {
      first: 'Johnni',
      last: 'Sullivan'
    }
  },
  {
    name: {
      first: 'Gustav',
      last: 'Christensen'
    }
  },
  {
    name: {
      first: 'Rose',
      last: 'Nylund'
    },
    picture: {
      thumbnail: 'https://randomuser.me/api/portraits/thumb/women/10.jpg'
    }
  }
];
const sizes: AvatarSize[] = ['sm', 'md', 'lg', 'xl', '2xl', '3xl'];
const fallbacks: AvatarFallbackType[] = ['image', 'initials'];
const orientations: AvatarOrientation[] = ['horizontal', 'vertical'];
const statuses: Array<UserStatus | undefined> = [
  undefined,
  'danger',
  'success',
  'warning',
  'accent',
  'neutral',
  'primary'
];

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

export default {
  title: 'Avatar',
  args: {
    firstName: 'Rose',
    lastName: 'Nylund',
    picture:
      'https://images.unsplash.com/photo-1699412958387-2fe86d46d394?q=80&w=188&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageOnly: false,
    badgeText: '34',
    size: 'md',
    fallback: 'initials',
    labelText: '{{badgeText}} unread messages'
  },
  argTypes: {
    subheading: {
      control: 'text',
      defaultValue: null
    },
    badgeText: {
      control: 'text',
      defaultValue: null
    },
    size: {
      control: 'inline-radio',
      options: sizes
    },
    fallback: {
      control: 'inline-radio',
      options: fallbacks
    },
    status: {
      control: 'inline-radio',
      options: statuses
    },
    imageOnly: {
      control: 'boolean'
    },
    orientation: {
      control: 'inline-radio',
      options: orientations
    }
  },
  render: ({
    firstName,
    lastName,
    picture,
    size,
    fallback,
    status,
    imageOnly,
    subheading,
    orientation,
    badgeText,
    labelText
  }) => {
    let user: UserProfile = {
      name: {
        first: firstName,
        last: lastName
      }
    };
    if (picture) {
      user = {
        ...user,
        picture: {
          thumbnail: picture
        }
      };
    }
    return html`<div style="max-width:175px;">
      <sl-avatar
        .user=${user}
        .size=${size}
        .fallback=${fallback}
        .status=${status}
        ?image-only=${imageOnly}
        badge-text=${badgeText}
        label=${labelText}
        .orientation=${orientation}
        >${subheading}</sl-avatar
      >
    </div>`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const All: StoryObj = {
  render: ({ badgeText }) => {
    return html` <style>
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
          vertical-align: top;
          --max-width: 100px;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th>Size</th>
            <th>With name</th>
            <th>With subheader</th>
            <th>Vertical</th>
            <th>With placeholder</th>
            <th>With initials</th>
            <th>Image only</th>
            <th>empty badge</th>
            <th>number badge</th>
            <th>active</th>
          </tr>
        </thead>
        <tbody>
          ${sizes.map(
            size => html` <tr>
              <th>${sizeName(size)}</th>
              <td><sl-avatar .user=${users[0]} .size=${size}></sl-avatar></td>
              <td><sl-avatar .user=${users[2]} .size=${size}>Subheader</sl-avatar></td>
              <td>
                <sl-avatar .user=${users[2]} .size=${size} orientation="vertical">Subheader </sl-avatar>
              </td>
              <td><sl-avatar .user=${users[4]} .size=${size} image-only fallback="image"></sl-avatar></td>
              <td><sl-avatar .user=${users[3]} .size=${size} image-only></sl-avatar></td>
              <td><sl-avatar .user=${users[2]} .size=${size} image-only></sl-avatar></td>
              <td><sl-avatar .user=${users[1]} .size=${size} image-only status="online"></sl-avatar></td>
              <td>
                <sl-avatar .user=${users[0]} .size=${size} image-only badge-text="${badgeText}"></sl-avatar>
              </td>
              <td>
                <sl-avatar .user=${users[5]} .size=${size} image-only badge-text="${badgeText}" active></sl-avatar>
              </td>
            </tr>`
          )}
          </tr>
        </tbody>
      </table>`;
  }
};
