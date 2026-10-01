import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './class-nav.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a2-class-nav-navigate': SlA2ClassNavNavigateEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-a2-class-nav': ClassNav;
  }
}

/** The stable key of one of the four class section links. */
export type ClassSection = 'overview' | 'method' | 'lessons' | 'participants';

/** The data this component renders; owned and passed in by the page. */
export interface ClassNavModel {
  className: string;
  activeSection: ClassSection;
}

/** Emitted when one of the four class section links is activated. */
export type SlA2ClassNavNavigateEvent = CustomEvent<{ section: ClassSection }>;

interface ClassNavSectionLink {
  section: ClassSection;
  href: string;
  label: string;
}

/**
 * Structural/presentation config owned by this component, not a model field — the design's four
 * class sections never vary per class. Hrefs aren't specified by the design; these are
 * placeholder in-app routes, flagged in the implementation report.
 */
const CLASS_NAV_SECTIONS: ClassNavSectionLink[] = [
  { section: 'overview', href: 'overview', label: 'Overview' },
  { section: 'method', href: 'method', label: 'Method' },
  { section: 'lessons', href: 'lessons', label: 'Lessons' },
  { section: 'participants', href: 'participants', label: 'Participants' }
];

/**
 * The 48px secondary (class) navigation bar: the class name and its four section links, one of
 * which is active. Presentational — the page passes in its `model` and handles the emitted
 * navigate event.
 *
 * ```html
 * <sl-a2-class-nav
 *   .model=${{ className: '5A English', activeSection: 'participants' }}
 * ></sl-a2-class-nav>
 * ```
 *
 * @slot trailing - Extra trailing content rendered after the section links.
 *
 * @fires sl-a2-class-nav-navigate - Emitted when one of the four section links is activated.
 */
export class ClassNav extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when one of the four section links is activated. */
  @event({ name: 'sl-a2-class-nav-navigate' }) navigateEvent!: EventEmitter<SlA2ClassNavNavigateEvent>;

  /**
   * The class name and active section this nav bar renders; passed in by the page that owns
   * the data.
   *
   * @default null
   */
  @property({ attribute: false }) model: ClassNavModel | null = null;

  override render(): TemplateResult {
    if (!this.model) {
      return html``;
    }

    const { className, activeSection } = this.model;

    return html`
      <nav aria-label="Class sections">
        <span class="class-name">${className}</span>
        <ul class="sections">
          ${CLASS_NAV_SECTIONS.map(link => {
            const active = link.section === activeSection;

            return html`
              <li>
                <a
                  href=${link.href}
                  aria-current=${ifDefined(active ? 'page' : undefined)}
                  @click=${(e: MouseEvent) => this.#onLinkClick(e, link)}
                >
                  ${link.label}
                </a>
              </li>
            `;
          })}
        </ul>
        <slot name="trailing"></slot>
      </nav>
    `;
  }

  #onLinkClick(e: MouseEvent, link: ClassNavSectionLink): void {
    e.preventDefault();
    this.navigateEvent.emit({ section: link.section });
  }
}

// Guarded global registration — see the note in `global-nav.ts`. Omitting this is invisible to
// `tsc` and renders nothing at all.
if (!customElements.get('sl-a2-class-nav')) {
  customElements.define('sl-a2-class-nav', ClassNav);
}
