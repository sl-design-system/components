import type { CSSResultGroup } from 'lit';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './skeleton.scss.js';

export type SkeletonEffect = 'none' | 'shimmer' | 'pulse' | 'sheen';

export class Skeleton extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Skeleton's effect. */
  @property({ reflect: true }) effect: SkeletonEffect = 'shimmer';

  constructor() {
    super();

    this.setAttribute('aria-busy', 'true');
  }
}
