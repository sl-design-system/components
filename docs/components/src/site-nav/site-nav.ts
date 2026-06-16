import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { type PageToc } from '../page-toc/page-toc.js';
import { NavGroup } from './nav-group.js';
import { NavItem } from './nav-item.js';
import styles from './site-nav.css' with { type: 'css' };

const insideStorybook = location.pathname.startsWith('/iframe.html');

export class SiteNav extends LitElement {
  /** @internal */
  static styles: CSSResultGroup = styles;

  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener('keydown', this.#onKeydown);

    navigation.addEventListener('navigate', this.#onNavigate);

    // Set up roving tabindex after children are parsed
    requestAnimationFrame(() => this.#initTabIndex());
  }

  override disconnectedCallback(): void {
    navigation.removeEventListener('navigate', this.#onNavigate);
    this.removeEventListener('keydown', this.#onKeydown);

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <nav aria-label="Site navigation" role="tree">
        <slot @slotchange=${() => this.#initTabIndex()}></slot>
      </nav>
    `;
  }

  #onKeydown = (event: KeyboardEvent): void => {
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

  #onNavigate = (event: NavigateEvent): void => {
    // Return early if the event can't be intercepted or is a download request
    if (!event.canIntercept || event.downloadRequest !== null) {
      return;
    }

    // Return early if the navigation is just a hash change on the same page
    if (!insideStorybook && event.hashChange) {
      return;
    }

    // Capture old active item before removing
    const oldActiveItem = this.querySelector<NavItem>('doc-nav-item[active]');

    // Remove the active state from the currently active item, if any
    oldActiveItem?.removeAttribute('active');

    // Determine the active nav-item: either the clicked one or the one matching the destination URL
    const rootNode = event.sourceElement?.getRootNode(),
      clickedItem = rootNode instanceof ShadowRoot ? rootNode.host : null,
      destinationPath = new URL(event.destination.url).pathname.replace(/\/$/, ''),
      activeItem =
        clickedItem ??
        Array.from(this.querySelectorAll<NavItem>('doc-nav-item')).find(
          item =>
            item.href &&
            new URL(item.href, location.href).pathname.replace(/\/$/, '') === destinationPath
        ) ??
        null;

    activeItem?.setAttribute('active', '');

    // In Storybook, just update the URL and let Storybook handle the rest
    if (insideStorybook) {
      return;
    }

    event.intercept({
      handler: async () => {
        await this.#updateNavTree(oldActiveItem, activeItem);

        const response = await fetch(new URL(event.destination.url)),
          text = await response.text(),
          doc = new DOMParser().parseFromString(text, 'text/html'),
          newContent = doc.querySelector('main.content'),
          currentContent = document.querySelector('main.content');

        if (newContent && currentContent) {
          document.title = doc.title;
          currentContent.innerHTML = newContent.innerHTML;

          document.querySelector<PageToc>('doc-page-toc')?.refresh();
        }
      }
    });
  };

  async #updateNavTree(oldActiveItem: NavItem | null, activeItem: Element | null): Promise<void> {
    const newAncestors = new Set<Element>();
    let p: Element | null = activeItem?.parentElement ?? null;
    while (p) {
      newAncestors.add(p);
      p = p.parentElement;
    }

    let oldParent: Element | null = oldActiveItem?.parentElement ?? null;
    while (oldParent) {
      if (!newAncestors.has(oldParent)) {
        if (oldParent instanceof NavItem && oldParent.expandable) {
          oldParent.open = false;
        } else if (oldParent instanceof NavGroup && oldParent.collapsible) {
          oldParent.collapsed = true;
        }
      }
      oldParent = oldParent.parentElement;
    }

    // If the active item is itself an expandable category, expand it as well so
    // navigating to a category page also reveals its children.
    if (activeItem instanceof NavItem && activeItem.expandable) {
      activeItem.open = true;
    }

    let parent: Element | null = activeItem?.parentElement ?? null;
    while (parent) {
      if (parent instanceof NavItem && parent.expandable) {
        parent.open = true;
      } else if (parent instanceof NavGroup) {
        parent.collapsed = false;
      }
      parent = parent.parentElement;
    }

    await Promise.resolve();
    activeItem?.scrollIntoView({ block: 'nearest' });
  }

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

  #initTabIndex(): void {
    const items = this.#getVisibleItems();
    items.forEach((item, i) => {
      item.tabIndex = i === 0 ? 0 : -1;
    });
  }
}
