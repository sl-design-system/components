import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { NavItem } from './nav-item.js';
import styles from './site-nav.css' with { type: 'css' };

export { NavGroup } from './nav-group.js';
export { NavItem } from './nav-item.js';

export class SiteNav extends LitElement {
  /** @internal */
  static styles: CSSResultGroup = styles;

  /** Returns all visible (not inside a collapsed parent) nav-items in DOM order. */
  #getVisibleItems(): NavItem[] {
    return Array.from(this.querySelectorAll('*'))
      .filter((el): el is NavItem => el instanceof NavItem)
      .filter(item => {
        let parent = item.parentElement;

        while (parent && parent !== this) {
          if (parent instanceof NavItem && parent.expandable && !parent.open) {
            return false;
          }
          parent = parent.parentElement;
        }

        return true;
      });
  }

  #focusItem(items: NavItem[], index: number): void {
    items.forEach((item, i) => {
      item.tabIndex = i === index ? 0 : -1;
    });
    items[index]?.focus();
  }

  #onKeyDown = (event: KeyboardEvent): void => {
    const items = this.#getVisibleItems(),
      current = items.indexOf(document.activeElement as NavItem);

    if (current === -1 && !['Home', 'End'].includes(event.key)) {
      return;
    }

    let handled = true;

    switch (event.key) {
      case 'ArrowDown':
        this.#focusItem(items, Math.min(current + 1, items.length - 1));
        break;
      case 'ArrowUp':
        this.#focusItem(items, Math.max(current - 1, 0));
        break;
      case 'ArrowRight':
        if (items[current]?.expandable && !items[current].open) {
          items[current].open = true;
        } else if (items[current]?.expandable && items[current].open) {
          // Move to first child
          const next = current + 1;
          if (next < items.length) {
            this.#focusItem(items, next);
          }
        }
        break;
      case 'ArrowLeft':
        if (items[current]?.expandable && items[current].open) {
          items[current].open = false;
        } else {
          // Move to parent nav-item
          let parent = items[current]?.parentElement;
          while (parent && parent !== this) {
            if (parent instanceof NavItem) {
              const parentIdx = items.indexOf(parent);
              if (parentIdx >= 0) {
                this.#focusItem(items, parentIdx);
              }
              break;
            }
            parent = parent.parentElement;
          }
        }
        break;
      case 'Home':
        this.#focusItem(items, 0);
        break;
      case 'End':
        this.#focusItem(items, items.length - 1);
        break;
      case 'Enter':
      case ' ':
        if (items[current]?.href) {
          window.location.href = items[current].href!;
        } else if (items[current]?.expandable) {
          items[current].open = !items[current].open;
        }
        break;
      default:
        handled = false;
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('keydown', this.#onKeyDown);

    // Set up roving tabindex after children are parsed
    requestAnimationFrame(() => this.#initTabIndex());
  }

  override disconnectedCallback(): void {
    this.removeEventListener('keydown', this.#onKeyDown);

    super.disconnectedCallback();
  }

  #initTabIndex(): void {
    const items = this.#getVisibleItems();
    items.forEach((item, i) => {
      item.tabIndex = i === 0 ? 0 : -1;
    });
  }

  override render(): TemplateResult {
    return html`
      <nav aria-label="Site navigation" role="tree">
        <slot @slotchange=${() => this.#initTabIndex()}></slot>
      </nav>
    `;
  }
}
