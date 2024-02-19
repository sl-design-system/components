import type { Avatar } from './avatar.js';
import type { AvatarFallbackType, AvatarOrientation, AvatarSize, UserStatus } from './models.js';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@sl-design-system/tooltip/register.js';
import { html } from 'lit';
import '../register.js';

interface Props
  extends Pick<
    Avatar,
    'title' | 'displayName' | 'size' | 'fallback' | 'status' | 'imageOnly' | 'orientation' | 'badgeText'
  > {
  title: string;
  displayName: string;
  picture: string;
  imageOnly: boolean;
  orientation: AvatarOrientation;
  subheading: string;
  badgeText: string;
  labelText: string;
}

type Story = StoryObj<Props>;

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
    displayName: 'Rose Nylund',
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
    displayName,
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
    return html`<div style="max-width:175px;">
      <sl-avatar
        display-name=${displayName}
        .picture=${picture}
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
              <td><sl-avatar display-name=${users[0].name} .picture=${users[0].picture} .size=${size}></sl-avatar></td>
              <td>
                <sl-avatar display-name=${users[2].name} .picture=${users[2].picture} .size=${size}
                  >Subheader</sl-avatar
                >
              </td>
              <td>
                <sl-avatar
                  display-name=${users[2].name}
                  .picture="${users[2].picture}"
                  .size=${size}
                  orientation="vertical"
                  >Subheader
                </sl-avatar>
              </td>
              <td>
                <sl-avatar display-name=${users[4].name} .size=${size} fallback="image"></sl-avatar>
              </td>
              <td><sl-avatar display-name=${users[3].name} .size=${size}></sl-avatar></td>
              <td>
                <sl-avatar
                  display-name=${users[2].name}
                  .picture=${users[2].picture}
                  .size=${size}
                  image-only
                ></sl-avatar>
              </td>
              <td>
                <sl-avatar
                  display-name=${users[1].name}
                  .picture=${users[1].picture}
                  .size=${size}
                  image-only
                  status="success"
                ></sl-avatar>
              </td>
              <td>
                <sl-avatar
                  display-name=${users[0].name}
                  .picture=${users[0].picture}
                  .size=${size}
                  image-only
                  badge-text="${badgeText}"
                ></sl-avatar>
              </td>
              <td>
                <sl-avatar
                  display-name=${users[5].name}
                  .size=${size}
                  image-only
                  badge-text="${badgeText}"
                  active
                ></sl-avatar>
              </td>
            </tr>`
          )}
          </tr>
        </tbody>
      </table>`;
  }
};
