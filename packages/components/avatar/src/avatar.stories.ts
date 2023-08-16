import type { Avatar, AvatarFallbackType, AvatarSize, UserProfile, UserStatus } from './avatar.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';

interface Props extends Pick<Avatar, 'title' | 'size' | 'fallback' | 'status' | 'imageOnly'> {
  title: string;
  firstName: string;
  lastName: string;
  picture: string;
  imageOnly: boolean;
  subheading: string;
}

type Story = StoryObj<Props>;

const users: UserProfile[] = [
  {
    name: {
      title: 'Mr',
      first: 'Yousef',
      last: 'Van der Schaaf'
    },
    picture: {
      thumbnail: 'https://randomuser.me/api/portraits/thumb/men/81.jpg'
    }
  },
  {
    name: {
      title: 'Mr',
      first: 'Chester',
      last: 'Reid'
    },
    picture: {
      thumbnail: 'https://randomuser.me/api/portraits/thumb/men/16.jpg'
    }
  },
  {
    name: {
      title: 'Ms',
      first: 'Emma',
      last: 'Henderson'
    },
    picture: {
      thumbnail: 'https://randomuser.me/api/portraits/thumb/women/18.jpg'
    }
  },
  {
    name: {
      title: 'Mr',
      first: 'Johnni',
      last: 'Sullivan'
    }
  },
  {
    name: {
      title: 'Mr',
      first: 'Gustav',
      last: 'Christensen'
    }
  },
  {
    name: {
      title: 'Ms',
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
const statuses: Array<UserStatus | undefined> = [undefined, 'online', 'offline', 'away', 'do-not-disturb'];

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
    title: 'Ms',
    firstName: 'Rose',
    lastName: 'Nylund',
    picture: 'https://randomuser.me/api/portraits/thumb/women/14.jpg',
    imageOnly: false
  },
  argTypes: {
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
    }
  },
  render: ({ title, firstName, lastName, picture, size, fallback, status, imageOnly, subheading }) => {
    let user: UserProfile = {
      name: {
        title,
        first: firstName,
        last: lastName
      }
    };
    if (picture) {
      console.log('picture');
      user = {
        ...user,
        picture: {
          thumbnail: picture
        }
      };
    }
    return html`<sl-avatar .user=${user} .size=${size} .fallback=${fallback} .status=${status} ?image-only=${imageOnly}
      >${subheading}</sl-avatar
    >`;
  }
} satisfies Meta<Props>;

export const Basic: Story = {};

export const All: StoryObj = {
  render: () => {
    setTimeout(() => document.querySelector('form')?.reportValidity());
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
        }
      </style>
      <table>
        <thead>
          <tr>
            <th>Size</th>
            <th>With avatar</th>
            <th>With initials</th>
            <th>With placeholder</th>
            <th>With subheading</th>
            <th>With status</th>
            <th>Image only</th>
          </tr>
        </thead>
        <tbody>
          ${sizes.map(
            size => html` <tr>
              <th>${sizeName(size)}</th>
              <td><sl-avatar .user=${users[2]} .size=${size}></sl-avatar></td>
              <td><sl-avatar .user=${users[3]} .size=${size}></sl-avatar></td>
              <td><sl-avatar .user=${users[4]} .size=${size} fallback="image"></sl-avatar></td>
              <td><sl-avatar .user=${users[1]} .size=${size}>Very good student</sl-avatar></td>
              <td><sl-avatar .user=${users[0]} .size=${size} status="online"></sl-avatar></td>
              <td><sl-avatar .user=${users[5]} .size=${size} image-only></sl-avatar></td>
            </tr>`
          )}
          </tr>
        </tbody>
      </table>`;
  }
};
