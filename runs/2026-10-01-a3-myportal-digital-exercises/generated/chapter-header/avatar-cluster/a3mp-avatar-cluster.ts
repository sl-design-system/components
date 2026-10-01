import '@sl-design-system/avatar/register.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './a3mp-avatar-cluster.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-a3mp-avatar-cluster': A3mpAvatarCluster;
  }
}

/** One person shown as a circle in the stack. */
export interface ClusterMember {
  /** Two-letter initials rendered in the circle, e.g. `'DK'`. */
  initials: string;
  /** The member's full name, used for the avatar's accessible label. */
  displayName: string;
}

/** The data this component renders; owned by the page and passed down through the chapter header. */
export interface AvatarClusterModel {
  /** Stable key for the cluster, e.g. `'co-authors'`. */
  id: string;
  /** The avatars to stack, left to right. */
  members: ClusterMember[];
  /** When greater than 0, a trailing `+N` circle is rendered after the members. */
  overflowCount: number;
  /** The names line, as drawn, e.g. `'Jan Valeero, Daniele King'`. */
  summary: string;
  /** The role line below it, as drawn, e.g. `'Co-authors (2)'`. */
  roleLabel: string;
}

/**
 * An overlapping stack of member avatars with an optional `+N` overflow circle, followed by a
 * two-line name/role block. Purely presentational: it emits nothing and owns no data.
 *
 * ```html
 * <sl-a3mp-avatar-cluster .model=${cluster}></sl-a3mp-avatar-cluster>
 * ```
 */
export class A3mpAvatarCluster extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The cluster to render.
   *
   * @default undefined
   */
  @property({ attribute: false }) model?: AvatarClusterModel;

  override render(): TemplateResult {
    const members = this.model?.members ?? [],
      overflow = this.model?.overflowCount ?? 0;

    return html`
      <div class="cluster">
        <ul class="stack">
          ${members.map(
            member => html`
              <li>
                <sl-avatar
                  display-initials=${member.initials}
                  display-name=${member.displayName}
                  image-only
                  size="lg">
                </sl-avatar>
              </li>
            `
          )}
          ${overflow > 0
            ? html`
                <li>
                  <span aria-label="and ${overflow} more" class="overflow" role="img">
                    +${overflow}
                  </span>
                </li>
              `
            : nothing}
        </ul>
        <div class="text">
          <span class="summary">${this.model?.summary}</span>
          <span class="role">${this.model?.roleLabel}</span>
        </div>
      </div>
    `;
  }
}

// Guarded global registration. A type-only import of this module registers nothing, so the page
// imports it bare (`import './a3mp-avatar-cluster.js';`) for this side effect.
if (!customElements.get('sl-a3mp-avatar-cluster')) {
  customElements.define('sl-a3mp-avatar-cluster', A3mpAvatarCluster);
}
