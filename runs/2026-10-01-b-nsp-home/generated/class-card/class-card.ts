import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Badge } from '@sl-design-system/badge';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './class-card.css' with { type: 'css' };

// The design's `users`, `circle-info` and `image` glyphs are not in this theme's own icons.ts,
// so they are left out and recorded as Stage 4 discrepancies. `@fortawesome/*` is not installed
// (it is a render blocker, not just a type error) and drawing replacements is not allowed.

declare global {
  interface HTMLElementTagNameMap {
    'sl-nsp-class-card': ClassCard;
  }
}

/** The data this component renders: a single class's identity, roster size and method status. */
export interface ClassCardModel {
  id: string;
  name: string;
  studentCount: number;
  hasMethod: boolean;
  thumbnailUrl?: string;
}

/**
 * Structural constant, not domain data: lets this presentational component's story render with
 * no args, per the design's first card ("5B English"). The data-owning `sl-nsp-home-page` passes
 * a real `model` for each of the five cards; it never relies on this default.
 */
const DEFAULT_MODEL: ClassCardModel = {
  id: '5b-english',
  name: '5B English',
  studentCount: 15,
  hasMethod: false
};

/**
 * A class tile for the NSP teacher dashboard's "Classes" panel: a media thumbnail (or a grey
 * placeholder), the class name, a student-count badge, and — only when the class has no teaching
 * method assigned yet — a "No method added" status row.
 *
 * This is a presentational, non-interactive component: the design shows no link/hover/focus
 * state, so it renders no anchor and emits no events. The data-owning page passes it a `model`;
 * it never fetches anything itself.
 *
 * ```html
 * <sl-nsp-class-card .model=${model}></sl-nsp-class-card>
 * ```
 *
 * @slot media - The class's thumbnail image. Falls back to a grey placeholder block.
 */
export class ClassCard extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-badge': Badge,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The class this card renders: its identity, roster size and method status. */
  @property({ attribute: false }) model?: ClassCardModel = DEFAULT_MODEL;

  override render(): TemplateResult {
    const { name, studentCount, hasMethod } = this.model ?? DEFAULT_MODEL,
      studentsLabel = studentCount === 1 ? '1 student' : `${studentCount} students`;

    return html`
      <article aria-labelledby="title">
        <slot class="media" name="media">
          <!-- Design shows a Font Awesome image glyph here. The sanoma-pro theme does not
               register one, so per the batch runbook it is left out and recorded as a Stage 4
               discrepancy rather than substituted or hand-drawn. -->
        </slot>
        <div class="body">
          <h3 id="title">${name}</h3>
          <sl-badge color="yellow" emphasis="subtle" size="lg">
            <!-- Design shows a users glyph here; not in the theme icon set. Left out, recorded. -->
            ${studentsLabel}
          </sl-badge>
          ${hasMethod
            ? nothing
            : html`
                <div class="status">
                  <!-- Design shows a circle-info glyph here; not in the theme icon set. Left out, recorded. -->
                  <span>No method added</span>
                </div>
              `}
        </div>
      </article>
    `;
  }
}

// This is the top-level element for this component, so - unlike its scoped `sl-badge`/`sl-icon`
// children above - it registers itself globally, guarded so re-importing this module doesn't
// throw (it's rendered standalone here and also composed by the sibling `sl-nsp-home-page`).
if (!customElements.get('sl-nsp-class-card')) {
  customElements.define('sl-nsp-class-card', ClassCard);
}
