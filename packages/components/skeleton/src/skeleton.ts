import type { CSSResultGroup } from 'lit';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './skeleton.scss.js';

export type SkeletonEffect = 'none' | 'shimmer' | 'pulse' | 'sheen';

export type SkeletonVariant = 'circle' | 'default';

export class Skeleton extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Skeleton's effect.
   *  @type {'none' | 'shimmer' | 'pulse' | 'sheen'}
   * */
  @property({ reflect: true }) effect: SkeletonEffect = 'shimmer';

  /** Skeleton's variant.
   *  @type {'circle' | 'default'}
   * */
  @property({ reflect: true }) variant: SkeletonVariant = 'default';

  constructor() {
    super();

    this.setAttribute('aria-busy', 'true');
  }
}
