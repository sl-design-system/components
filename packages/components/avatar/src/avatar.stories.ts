import '@sl-design-system/tooltip/register.js';
import { type Meta, type StoryObj } from '@storybook/web-components';
import { html } from 'lit';
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
};
type Story = StoryObj<Props>;

const sizes: AvatarSize[] = ['sm', 'md', 'lg', 'xl', '2xl', '3xl'];

export default {
  title: 'Components/Avatar',
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
    href: 'https://example.com'
  }
};

export const ImageFallback: Story = {
  args: {
    fallback: 'image',
    pictureUrl: undefined
  }
};

export const ImageOnly: Story = {
  args: {
    imageOnly: true
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
    pictureUrl: undefined
  }
};

export const Overflow: Story = {
  args: {
    displayName: 'Yousef van der Schaaf van Kommeren der Nederlanden'
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
    size: 'xl',
    vertical: true
  }
};

export const All: StoryObj = {
  render: ({ badgeText }) => {
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
            size => html`
              <tr>
                <th>${sizeName(size)}</th>
                <td>
                  <sl-avatar display-name=${users[0].name} .pictureUrl=${users[0].picture} .size=${size}></sl-avatar>
                </td>
                <td>
                  <sl-avatar display-name=${users[2].name} .pictureUrl=${users[2].picture} .size=${size}
                    >Subheader</sl-avatar
                  >
                </td>
                <td>
                  <sl-avatar
                    display-name=${users[2].name}
                    .pictureUrl=${users[2].picture}
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
                    .pictureUrl=${users[2].picture}
                    .size=${size}
                    image-only
                  ></sl-avatar>
                </td>
                <td>
                  <sl-avatar
                    display-name=${users[1].name}
                    .pictureUrl=${users[1].picture}
                    .size=${size}
                    image-only
                    status="success"
                  ></sl-avatar>
                </td>
                <td>
                  <sl-avatar
                    display-name=${users[0].name}
                    .pictureUrl=${users[0].picture}
                    .size=${size}
                    image-only
                    badge-text=${badgeText}
                  ></sl-avatar>
                </td>
                <td>
                  <sl-avatar
                    display-name=${users[5].name}
                    .size=${size}
                    image-only
                    badge-text=${badgeText}
                    active
                  ></sl-avatar>
                </td>
              </tr>
            `
          )}
        </tr>
      </tbody>
    </table>
    `;
  }
};
