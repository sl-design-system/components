import { Avatar } from './avatar.js';

customElements.define('sl-avatar', Avatar);

declare global {
  interface HTMLElementTagNameMap {
    'sl-avatar': Avatar;
  }
}
