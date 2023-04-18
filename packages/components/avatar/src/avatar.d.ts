import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement } from 'lit';
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
export declare class Avatar extends LitElement {
    /** @private */
    static styles: CSSResultGroup;
    /** Renders the tabs vertically instead of the default horizontal  */
    uniqueProfileId: string;
    user?: UserProfile;
    get profileName(): string;
    render(): TemplateResult;
    connectedCallback(): Promise<void>;
    _getUserDetails(id: string): Promise<UserProfile>;
}
