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
  large: string;
  medium: string;
  thumbnail: string;
}

export class Avatar extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Renders the tabs vertically instead of the default horizontal  */
  @property() uniqueProfileId = 'slds';

  get profileName(): string {
    return `${this.user?.name.first || 'John'} ${this.user?.name.last || 'Doe'}`;
  }

  override render(): TemplateResult {
    return html`
      <img
        alt="picture of ${this.profileName}"
        src=${this.user?.picture.thumbnail || 'https://ynnovate.it/wp-content/uploads/2015/06/default-avatar.png'}
      />
      <span>${this.profileName}</span>
    `;
  }

  @state() user?: UserProfile | undefined;

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    this.user = await this._getUserDetails(this.uniqueProfileId);
  }

  async _getUserDetails(id: string): Promise<UserProfile | undefined> {
    try {
      const response = await fetch(`https://randomuser.me/api/?inc=picture,name&seed=slds-${id}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const json: { results: UserProfile[]; info: unknown } = await response?.json();
      return json?.results?.[0];
    } catch (error) {
      console.warn('error loading avatar');
      return;
    }
  }
}
