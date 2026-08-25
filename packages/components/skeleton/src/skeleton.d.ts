import { type CSSResultGroup, LitElement } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-skeleton': Skeleton;
  }
}
export type SkeletonEffect = 'none' | 'shimmer' | 'pulse' | 'sheen';
export type SkeletonVariant = 'circle' | 'default';
/**
 * Skeletons are used as a temporary placeholder while content is loading to improve the user
 * experience.
 */
export declare class Skeleton extends LitElement {
  /** @internal */
  static styles: CSSResultGroup;
  /**
   * Skeleton's effect.
   *
   * @default 'shimmer'
   */
  effect?: SkeletonEffect;
  /**
   * Skeleton's variant.
   *
   * @default 'default'
   */
  variant?: SkeletonVariant;
  connectedCallback(): void;
}
