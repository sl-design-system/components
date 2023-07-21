import type { CSSResultGroup } from 'lit';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './skeleton.scss.js';

export class Skeleton extends LitElement {
  static override styles: CSSResultGroup = styles;

  /** Skeleton's effect. */
  @property({ reflect: true }) effect: 'none' | 'shimmer' | 'pulse' | 'sheen' = 'shimmer';

  override firstUpdated(): void {
    this.setAttribute('aria-busy', 'true');
  }
}
