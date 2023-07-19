import { Skeleton } from './src/skeleton';

customElements.define('sl-skeleton', Skeleton);

declare global {
  interface HTMLElementTagNameMap {
    'sl-skeleton': Skeleton;
  }
}
