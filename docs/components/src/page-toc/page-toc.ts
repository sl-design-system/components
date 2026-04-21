import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './page-toc.css' with { type: 'css' };

interface TocEntry {
  id: string;
  text: string;
  children: TocEntry[];
}

export class PageToc extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static styles: CSSResultGroup = styles;

  /** All observed headings in document order. */
  #headings: Element[] = [];

  /** Update the active heading when scrolling. */
  #observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          this.#visibleIds.add(entry.target.id);
        } else {
          this.#visibleIds.delete(entry.target.id);
        }
      }

      // Always pick the first visible heading in document order
      const firstVisible = this.#headings.find(h => this.#visibleIds.has(h.id));
      if (firstVisible) {
        this.activeId = firstVisible.id;
      }
    },
    { rootMargin: '0px 0px -60% 0px', threshold: 0 }
  );

  /** Currently visible heading IDs. */
  #visibleIds = new Set<string>();

  /** @internal The id of the currently active heading. */
  @state() activeId?: string;

  /** @internal The grouped heading entries for the TOC. */
  @state() entries: TocEntry[] = [];

  /** @internal The title of the page, taken from the h1. */
  @state() pageTitle?: string;

  /** The selector for the main content area. */
  @property() target = 'main';

  disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('target')) {
      this.refresh();
    }
  }

  refresh(): void {
    this.#observer.disconnect();
    this.#visibleIds.clear();
    this.#headings = [];
    this.activeId = undefined;

    const target = document.querySelector<HTMLElement>(this.target ?? 'main');
    if (!target) {
      console.warn(`Target element "${this.target}" not found.`);
      return;
    }

    this.pageTitle = target.querySelector('h1')?.textContent?.trim();

    const headings = Array.from(target.querySelectorAll<HTMLElement>('doc-heading[id]')),
      entries: TocEntry[] = [];

    for (const heading of headings) {
      const entry: TocEntry = {
        id: heading.id,
        text: heading.textContent?.trim() ?? '',
        children: []
      };

      if (heading.getAttribute('level') === '3' && entries.length > 0) {
        entries[entries.length - 1].children.push(entry);
      } else {
        entries.push(entry);
      }

      this.#observer.observe(heading);
    }

    this.#headings = headings;
    this.entries = entries;
  }

  render(): TemplateResult {
    return html`
      <nav aria-labelledby="page-toc">
        <h2 id="page-toc">${this.pageTitle}</h2>
        ${this.entries.length
          ? html`
              <span class="active"></span>
              <ul>
                ${this.entries.map(
                  entry => html`
                    <li>
                      <a aria-current=${ifDefined(entry.id === this.activeId ? true : undefined)} href="#${entry.id}">
                        ${entry.text}
                      </a>

                      ${entry.children.length
                        ? html`
                            <ul>
                              ${entry.children.map(
                                child => html`
                                  <li>
                                    <a
                                      aria-current=${ifDefined(child.id === this.activeId ? true : undefined)}
                                      href="#${child.id}"
                                    >
                                      ${child.text}
                                    </a>
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
