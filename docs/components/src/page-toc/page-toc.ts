import { faBarsStaggered } from '@fortawesome/pro-regular-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './page-toc.css' with { type: 'css' };

interface TocEntry {
  id: string;
  text: string;
  children: TocEntry[];
}

Icon.register(faBarsStaggered);

export class PageToc extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static styles: CSSResultGroup = styles;

  /** @internal The grouped heading entries for the TOC. */
  @state() entries: TocEntry[] = [];

  /** @internal The id of the currently active heading. */
  @state() activeId?: string;

  /** The selector for the main content area. */
  @property() target = 'main';

  #observer?: IntersectionObserver;

  connectedCallback(): void {
    super.connectedCallback();

    this.#observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeId = entry.target.id;
          }
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 1.0 }
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#observer?.disconnect();
    this.#observer = undefined;
  }

  willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('target')) {
      this.#observer?.disconnect();

      const target = document.querySelector<HTMLElement>(this.target ?? 'main');
      if (!target) {
        console.warn(`Target element "${this.target}" not found.`);
        return;
      }

      const headings = Array.from(target.querySelectorAll('h2[id], h3[id]')),
        entries: TocEntry[] = [];

      for (const heading of headings) {
        const entry: TocEntry = {
          id: heading.id,
          text: heading.textContent?.replace(/^#\s*/, '').trim() ?? '',
          children: []
        };

        if (heading.tagName === 'H3' && entries.length > 0) {
          entries[entries.length - 1].children.push(entry);
        } else {
          entries.push(entry);
        }

        this.#observer?.observe(heading);
      }

      this.entries = entries;
    }
  }

  render(): TemplateResult {
    return html`
      <nav aria-labelledby="page-toc">
        <h2 id="page-toc">
          <sl-icon name="far-bars-staggered"></sl-icon>
          On this page
        </h2>
        ${this.entries.length
          ? html`
              <ul>
                ${this.entries.map(
                  entry => html`
                    <li>
                      <a href="#${entry.id}" class=${entry.id === this.activeId ? 'active' : ''}>${entry.text}</a>
                      ${entry.children.length
                        ? html`
                            <ul>
                              ${entry.children.map(
                                child => html`
                                  <li>
                                    <a href="#${child.id}" class=${child.id === this.activeId ? 'active' : ''}
                                      >${child.text}</a
                                    >
                                  </li>
                                `
                              )}
                            </ul>
                          `
                        : nothing}
                    </li>
                  `
                )}
              </ul>
            `
          : nothing}
      </nav>
    `;
  }
}
