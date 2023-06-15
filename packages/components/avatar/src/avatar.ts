import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './avatar.scss.js';

export interface UserProfile {
  name: UserProfileName;
  picture: UserProfilePicture;
}
export interface UserProfileName {
  first: string;
  last: string;
  title: string;
}
export interface UserProfilePicture {
  thumbnail: string;
}

export class Avatar extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  @property() uniqueProfileId = 0;

  @state() user?: UserProfile;

  @property() users: UserProfile[] = [
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
        title: 'Mr',
        first: 'Johnni',
        last: 'Sullivan'
      },
      picture: {
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/89.jpg'
      }
    },
    {
      name: {
        title: 'Mr',
        first: 'Gustav',
        last: 'Christensen'
      },
      picture: {
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/51.jpg'
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
    }
  ];

  get profileName(): string {
    return `${this.user?.name.first || 'John'} ${this.user?.name.last || 'Doe'}`;
  }

  override render(): TemplateResult {
    return html`
      <img
        alt="picture of ${this.profileName}"
        .src=${this.user?.picture.thumbnail || 'https://ynnovate.it/wp-content/uploads/2015/06/default-avatar.png'}
      />
      <span>${this.profileName}</span>
    `;
  }

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    if (this.users[this.uniqueProfileId]) {
      this.user = this.users[this.uniqueProfileId];
    } else {
      console.warn('Error loading user details');
    }
  }
}
