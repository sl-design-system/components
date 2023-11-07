import { Skeleton } from './src/skeleton.js';

customElements.define('sl-skeleton', Skeleton);

declare global {
  interface HTMLElementTagNameMap {
    'sl-skeleton': Skeleton;
  }
}
