import { Button } from './button';

customElements.define('sl-button', Button);

declare global {
  interface HTMLElementTagNameMap {
    'sl-button': Button;
  }
}
