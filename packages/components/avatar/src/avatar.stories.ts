import type { AvatarSize, UserProfile } from './avatar.js';
import type { StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../register.js';

type Story = StoryObj;

export default {
  title: 'Avatar'
};

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
  }
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

export const Basic: Story = {
  render: () =>
    html`
      <style>
        section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
      </style>
      <section>
        <sl-avatar .user=${users[0]}></sl-avatar>
        <sl-avatar .user=${users[1]}></sl-avatar>
        <sl-avatar .user=${users[2]} size="3xl"></sl-avatar>
        <sl-avatar .user=${users[3]}></sl-avatar>
        <sl-avatar .user=${users[4]} fallback="image"></sl-avatar>
      </section>
    `
};

const sizes: AvatarSize[] = ['sm', 'md', 'lg', 'xl', '2xl', '3xl'];
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
        thead td {
          text-align: center;
        }

        tbody td:nth-of-type(4n + 5) {
          border-right: 2px solid #dedede;
          padding-right: 24px;
        }
        tbody td:nth-of-type(4n + 2):not(:first-of-type) {
          padding-left: 24px;
        }
        tbody td:last-of-type {
          border: none;
        }

        sl-error {
          display: none;
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
            </tr>`
          )}
          </tr>
        </tbody>
      </table>`;
  }
};
