import { type CSSResultGroup, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './skeleton.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-skeleton': Skeleton;
  }
}

export type SkeletonEffect = 'none' | 'shimmer' | 'pulse' | 'sheen';
export type SkeletonVariant = 'circle' | 'default';

/**
 * Skeletons are used as a temporary placeholder while content is loading to improve the user experience.
 */
export class Skeleton extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * Skeleton's effect.
   * @default 'shimmer'
   */
  @property({ reflect: true }) effect?: SkeletonEffect;

  /**
   * Skeleton's variant.
   * @default 'default'
   */
  @property({ reflect: true }) variant?: SkeletonVariant;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('aria-busy', 'true');
  }
}
