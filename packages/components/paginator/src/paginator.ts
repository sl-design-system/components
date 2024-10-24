import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Menu, MenuButton, MenuItem } from '@sl-design-system/menu';
import { Select, SelectOption } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PaginatorPage } from './paginator-page.js';
import styles from './paginator.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-page-change': SlChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-paginator': Paginator;
  }
}

// export type SlPageChangeEvent = CustomEvent<number>;

export type VisiblePagesSize = 'xs' | 'sm' | 'md' | 'lg';

/**
 * A paginator component used when there is a lot of data that needs to be shown and cannot be shown at once, in one view/page.
 * Can be used separately or together with page size component and/or items counter component.
 */
@localized()
export class Paginator extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-menu-button': MenuButton,
      'sl-menu': Menu,
      'sl-menu-item': MenuItem,
      'sl-paginator-page': PaginatorPage,
      'sl-select': Select,
      'sl-select-option': SelectOption
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Active page. */
  #activePage = 1;

  /** @internal To check whether it's a first update. */
  #initialLoad = true;

  /** @internal Whether there is a mobile (compact) variant with `sl-select` instead of `pages` visible or not. */
  #mobileVariant = false;

  /** @internal Pages amount. */
  #pages = 1;

  /** Observe changes in size of the container. */
  #observer = new ResizeObserver(() => {
    requestAnimationFrame(() => this.#update());
  });

  get activePage(): number {
    return this.#activePage;
  }

  /** Currently active page. */
  @property({ attribute: 'active-page' })
  set activePage(value: number) {
    this.#activePage = value;
    this.pageChangeEvent.emit(this.#activePage);
  }

  /** @internal Currently visible items on the current page. */
  @state() currentlyVisibleItems = 1;

  /** @internal Hidden pages on the left, after the first page in the overflow version. */
  @state() hiddenPagesLeft: HTMLLIElement[] = [];

  /** @internal Hidden pages on the right, before the last page in the overflow version. */
  @state() hiddenPagesRight: HTMLLIElement[] = [];

  /** Items per page. Default to the first item of pageSizes, if pageSizes is not set - default to 10. */
  @property({ type: Number, attribute: 'items-per-page' }) itemsPerPage?: number;

  /** @internal Emits when the page has been selected/changed. */
  @event({ name: 'sl-page-change' }) pageChangeEvent!: EventEmitter<SlChangeEvent<number>>; //EventEmitter<SlPageChangeEvent>; //EventEmitter<SlChangeEvent<number>>;

  /** Page sizes - array of possible page sizes e.g. [5, 10, 15]. */
  @property({ type: Number, attribute: 'page-sizes' }) pageSizes?: number[];

  /** Total amount of items. */
  @property() total = 1;

  /** Amount of possibly visible pages in the paginator at once. */
  @property() size?: VisiblePagesSize;

  /** @internal The value of visible pages amount, depending on the size. */
  get visiblePageAmount(): number {
    switch (this.size) {
      case 'xs':
        return 6;
      case 'sm':
        return 7;
      case 'md':
        return 9;
      case 'lg':
        return 11;
      default:
        return 11;
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();

    // if (!this.itemsPerPage) {
    //   this.itemsPerPage = this.pageSizes ? this.pageSizes[0] : 10;
    // }

    this.itemsPerPage ||= this.pageSizes?.[0] || 10;

    // const itemsPerPage = this.itemsPerPage ?? 10;
    this.#pages = Math.ceil(this.total / this.itemsPerPage);

    // if (this.activePage < 1) {
    //   this.activePage = 1;
    // } else if (this.activePage > this.#pages) {
    //   this.activePage = this.#pages;
    // }

    this.#setCurrentlyVisibleItems();

    requestAnimationFrame(() => {
      this.#observer.observe(this);

      // const selectWrapper = this.renderRoot.querySelector<HTMLDivElement>('.select-wrapper');

      // if (!this.#mobileVariant && selectWrapper) {
      //   selectWrapper.style.display = 'none';
      // }
    });
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('itemsPerPage')) {
      const itemsPerPage = this.itemsPerPage ?? 10;
      this.#pages = Math.ceil(this.total / itemsPerPage);

      this.#setCurrentlyVisibleItems();

      if (!this.#initialLoad) {
        /** Always go back to the first page when items per page has changed, but not for the first time. */
        this.activePage = 1;
      }

      requestAnimationFrame(() => {
        this.#update();
      });
    }

    if (changes.has('activePage')) {
      if (this.activePage < 1) {
        this.activePage = 1;
      } else if (this.activePage > this.#pages) {
        this.activePage = this.#pages;
      }

      this.#setCurrentlyVisibleItems();

      requestAnimationFrame(() => {
        this.#update();
      });
    }

    if (changes.has('size')) {
      // if (this.activePage < 1) {
      //   this.activePage = 1;
      // } else if (this.activePage > this.#pages) {
      //   this.activePage = this.#pages;
      // }
      //
      // this.#setCurrentlyVisibleItems();

      requestAnimationFrame(() => {
        this.#update();
      });
    }

    if (changes.has('total')) {
      const itemsPerPage = this.itemsPerPage ?? 10;
      this.#pages = Math.ceil(this.total / itemsPerPage) || 1;

      if (!this.#initialLoad) {
        /** Always go back to the first page when the total amount of items has changed, but not for the first time. */
        this.activePage = 1;
      }

      requestAnimationFrame(() => {
        this.#update();
      });
    }

    this.#initialLoad = false;
  }

  override render(): TemplateResult {
    console.log('visiblePageSize', this.size);
    return html`
      <nav class="container">
        <sl-button
          class="prev"
          aria-label=${msg(str`Go to the previous page (${this.activePage - 1})`)}
          fill="ghost"
          size="lg"
          ?disabled=${this.activePage === 1}
          @click=${this.#onPrevious}
        >
          <sl-icon name="caret-left-solid"></sl-icon>
        </sl-button>
        <ul class="pages-wrapper">
          <li class="page">
            <sl-paginator-page
              fill="ghost"
              size="lg"
              class="page"
              ?active=${this.activePage == 1}
              aria-current=${ifDefined(this.activePage == 1 ? 'page' : undefined)}
              @click=${this.#setActive}
              >1</sl-paginator-page
            >
            <sl-menu-button class="more-button" fill="ghost" size="lg" aria-label=${msg('Select page number')}>
              <sl-icon name="ellipsis-down" slot="button"></sl-icon>

              <sl-menu-item>Item 1</sl-menu-item>
              <sl-menu-item>Item 2</sl-menu-item>
            </sl-menu-button>
            ${this.hiddenPagesLeft
              ? html`
                  <sl-menu-button class="more-button" fill="ghost" size="lg" aria-label=${msg('Select page number')}>
                    <sl-icon name="ellipsis-down" slot="button"></sl-icon>

                    ${this.hiddenPagesLeft.map(
                      page => html`
                        <sl-menu-item @click=${this.#setActive} aria-label=${msg(str`${page.innerText.trim()}, page`)}
                          >${page.innerText.trim()}</sl-menu-item
                        >
                      `
                    )}
                  </sl-menu-button>
                `
              : nothing}
          </li>
          ${Array.from({ length: this.#pages })
            .slice(1, this.#pages - 1)
            .map(
              (_, index) => html`
                <li class="page">
                  <sl-paginator-page
                    fill="ghost"
                    size="lg"
                    class="page"
                    ?active=${this.activePage == index + 2}
                    aria-current=${ifDefined(this.activePage == index + 2 ? 'page' : undefined)}
                    @click=${this.#setActive}
                  >
                    ${index + 2}
                  </sl-paginator-page>
                </li>
              `
            )}
          <li class="page">
            <sl-paginator-page
              fill="ghost"
              size="lg"
              class="page"
              ?active=${this.activePage == this.#pages}
              aria-current=${ifDefined(this.activePage == this.#pages ? 'page' : undefined)}
              @click=${this.#setActive}
              >${this.#pages}</sl-paginator-page
            >
          </li>
        </ul>
        <div class="select-wrapper">
          <sl-select
            size="lg"
            @sl-change=${this.#setActive}
            value=${this.activePage}
            aria-label=${`${msg(str`${this.activePage}, page`)}`}
          >
            ${Array.from({ length: this.#pages })?.map(
              (_, index) => html`
                <sl-select-option
                  @click=${this.#setActive}
                  .value=${index + 1}
                  aria-label=${`${msg(str`${index + 1}, page`)}`}
                >
                  ${index + 1}
                </sl-select-option>
              `
            )}
          </sl-select>
          <span>of ${this.#pages} pages</span>
        </div>
        <sl-button
          class="next"
          aria-label=${msg(str`Go to the next page (${this.activePage + 1})`)}
          fill="ghost"
          size="lg"
          ?disabled=${this.activePage === this.#pages}
          @click=${this.#onNext}
        >
          <sl-icon name="caret-right-solid"></sl-icon>
        </sl-button>
      </nav>
      <!-- We want this to be read every time the active page changes. -->
      <span id="live" aria-live="polite" aria-atomic="true">
        ${msg(str`Currently active page ${this.activePage} of ${this.#pages} pages`)}
      </span>
    `;
  }

  /** Handles `click` event on the previous button. */
  #onPrevious() {
    this.activePage--;
    this.#setCurrentlyVisibleItems();
    this.#update();
  }

  /** Handles `click` event on the next button. */
  #onNext() {
    this.activePage++;
    this.#setCurrentlyVisibleItems();
    this.#update();
  }

  #setActive(event: Event) {
    const target = event.target as Select | PaginatorPage;

    if (target instanceof Select) {
      this.activePage = Number(target.value);
    } else {
      this.activePage = Number(target.innerText?.trim());
    }

    this.#setCurrentlyVisibleItems();
    this.#update();
  }

  #update(): void {
    // const buttonPrev = this.renderRoot.querySelector('sl-button.prev') as Button,
    //   buttonNext = this.renderRoot.querySelector('sl-button.next') as Button,
    const gap = parseInt(getComputedStyle(this).getPropertyValue('--sl-space-paginator-gap') || '0'),
      pages = this.renderRoot.querySelectorAll<HTMLLIElement>('li.page'),
      pagesWrapper = this.renderRoot.querySelector('.pages-wrapper') as HTMLElement,
      // selectWrapper = this.renderRoot.querySelector('.select-wrapper') as HTMLDivElement,
      // container = this.renderRoot.querySelector('.container') as HTMLDivElement,
      lastPage = pages.length;

    // --sl-space-paginator-gap
    // parseInt(getComputedStyle(this).getPropertyValue('--_gap') || '0')

    console.log('gap', gap);

    // this.removeAttribute('mobile');

    let totalAmountOfPagesWidth = 0,
      [hiddenButtons, hiddenButtonsLeft, hiddenButtonsRight, possiblyVisible, possiblyHidden]: HTMLLIElement[][] =
        Array.from({ length: 5 }, () => []),
      [menuItems, menuItemsLeft, menuItemsRight]: Node[][] = Array.from({ length: 3 }, () => []);

    const [moreButton, moreButtonLeft, moreButtonRight] = Array.from({ length: 3 }, () => this.#createMenuButton());

    /** Reset display to check the width. */
    // pagesWrapper.style.display = '';
    //  buttonPrev.style.display = '';
    // buttonNext.style.display = '';
    //  selectWrapper.style.display = 'none';
    // container.removeAttribute('mobile');
    this.removeAttribute('mobile');

    pages.forEach(page => {
      page.style.display = '';
    });

    /** Reset mobile variant. */
    this.#mobileVariant = false;
    this.requestUpdate();

    Array.from(pages).forEach(button => {
      totalAmountOfPagesWidth += button.getBoundingClientRect().width + gap;

      if (pagesWrapper && totalAmountOfPagesWidth > pagesWrapper.getBoundingClientRect().width - 2 * gap) {
        possiblyHidden.push(button);
      } else {
        possiblyHidden = [];
      }
    });

    possiblyVisible = Array.from(pages).filter(page => !possiblyHidden.includes(page));

    console.log('1-possiblyvisible, possiblyhidden', possiblyVisible, possiblyHidden);

    if (possiblyVisible.length > this.visiblePageAmount /*11*/) {
      possiblyVisible = Array.from(possiblyVisible).slice(0, this.visiblePageAmount /*11*/);
    }

    console.log('2-possiblyvisible, possiblyhidden', possiblyVisible, possiblyHidden, this.#pages);

    /** Overflow variant. */
    if (
      (pagesWrapper && pagesWrapper.clientWidth < pagesWrapper.scrollWidth) ||
      this.#pages > this.visiblePageAmount /*11*/
    ) {
      /** Mobile (compact) version with sl-select instead of sl-paginator-pages,
       * when possibly visible pages amount is smaller than 6
       * (when possibly visible pages > 6 it works fine with basic variant with pages, also with the overflow version).
       * */
      this.#mobileVariant = possiblyVisible.length <= 6;
      if (this.#mobileVariant) {
        /** Hide pages when there should be a mobile (compact) variant visible and dimensions are already checked. */
        // this.#setCompactVariant();
        this.setAttribute('mobile', '');
        this.requestUpdate();
        return;
      }

      /**  A variant when activePage is bigger than half of possibly visible pages and smaller than last pages;
       *   pages before and pages after active page, from 1...active and active ... 10
       *   first page -> hidden pages on the left (one more button) -> shown pages on the left -> active page
       *   -> shown pages on the right -> hidden pages on the right (one more button) -> last page
       *   e.g.  1 ... 7 [8] 9 10 ... 20
       */
      if (
        this.activePage > Math.floor(possiblyVisible.length / 2) &&
        this.activePage <= lastPage - Math.floor(possiblyVisible.length / 2)
      ) {
        /** Possibly visible pages minus 3 - minus first, active page and last page. */
        const pagesToShow = possiblyVisible.length - 3,
          evenAmount = possiblyVisible.length % 2 === 0,
          toShowAmount = Math.floor(pagesToShow / 2);

        /** Hide pages on the left side of the active page, between first page and active page. */
        hiddenButtonsLeft = Array.from(pages).slice(1, this.activePage - toShowAmount);
        this.hiddenPagesLeft = Array.from(pages).slice(1, this.activePage - toShowAmount);
        console.log('this.hiddenPagesLeft', this.hiddenPagesLeft);
        menuItemsLeft = this.#createMenuItems(hiddenButtonsLeft);
        menuItemsLeft.forEach(item => moreButtonLeft.querySelector('sl-menu-button')?.appendChild(item));

        // TODO: hiddenPagesLeft and huddenPagesRight

        /** Remove unnecessary, existing menu buttons. */
        this.renderRoot.querySelectorAll('li.more-button')?.forEach(moreButton => moreButton.remove());

        moreButtonLeft.setAttribute('aria-label', `${msg('Select page number')}`);
        pages[0].after(moreButtonLeft);
        hiddenButtonsLeft.forEach(button => (button.style.display = 'none'));

        /** Hide pages on the right side of the active page, between active page and last page. */
        hiddenButtonsRight = Array.from(pages).slice(this.activePage + (toShowAmount - (evenAmount ? 0 : 1)), -1);
        menuItemsRight = this.#createMenuItems(hiddenButtonsRight);
        menuItemsRight.forEach(item => moreButtonRight.querySelector('sl-menu-button')?.appendChild(item));
        moreButtonRight.setAttribute('aria-label', `${msg('Select page number')}`);
        hiddenButtonsRight.forEach(button => (button.style.display = 'none'));
        pages[lastPage - 1].before(moreButtonRight);
      } else if (this.activePage <= Math.floor(possiblyVisible.length / 2)) {
        /**  A variant when the first page is active or the active page is smaller than the half of possibly visible pages;
         *   e.g. [1] 2 3 4 5 6...20
         *   */
        const toShowAmount = possiblyVisible.length - 2;
        /** minus last page and space for menu button */
        hiddenButtons = Array.from(pages).slice(toShowAmount, -1);
        menuItems = this.#createMenuItems(hiddenButtons);
        menuItems.forEach(item => moreButton.querySelector('sl-menu-button')?.appendChild(item));
        moreButton.setAttribute('aria-label', `${msg('Select page number')}`);

        /** remove unnecessary, existing menu buttons */
        this.renderRoot.querySelectorAll('li.more-button')?.forEach(moreButton => moreButton.remove());
        pages[lastPage - 1].before(moreButton);
        hiddenButtons.forEach(button => (button.style.display = 'none'));
      } else {
        /** A variant with last pages set as active page, e.g. 1... 15 16 17 18 19 [20] */
        const toShowAmount = possiblyVisible.length - 2;
        /** Minus first page and space for menu button. */
        hiddenButtons = Array.from(pages).reverse().slice(toShowAmount, -1);
        menuItems = this.#createMenuItems(hiddenButtons);
        menuItems.reverse().forEach(item => moreButton.querySelector('sl-menu-button')?.appendChild(item));
        moreButton.setAttribute('aria-label', `${msg('Select page number')}`);

        /** Remove unnecessary, existing menu buttons. */
        this.renderRoot.querySelectorAll('li.more-button')?.forEach(moreButton => moreButton.remove());
        pages[0].after(moreButton);
        hiddenButtons.forEach(button => (button.style.display = 'none'));
      }
    } else {
      pages.forEach(page => (page.style.background = ''));
      /** Remove unnecessary, existing menu buttons. */
      this.renderRoot.querySelectorAll('li.more-button')?.forEach(moreButton => moreButton.remove());
    }
  }

  #setCurrentlyVisibleItems(): void {
    if (!this.itemsPerPage || !this.#pages) {
      return;
    }

    if (this.activePage === this.#pages) {
      const itemsOnLastPage = this.total % this.itemsPerPage;
      this.currentlyVisibleItems = itemsOnLastPage === 0 ? this.itemsPerPage : itemsOnLastPage;
    } else {
      this.currentlyVisibleItems = this.itemsPerPage;
    }
  }

  #createMenuButton(): HTMLLIElement {
    const listButtonElement = this.shadowRoot?.createElement('li') as HTMLLIElement;
    listButtonElement.classList.add('more-button');
    const moreButton = this.shadowRoot?.createElement('sl-menu-button') as MenuButton;
    moreButton.fill = 'ghost';
    moreButton.size = 'lg';

    const icon = this.shadowRoot?.createElement('sl-icon') as Icon;
    icon.slot = 'button';
    icon.name = 'ellipsis-down';

    moreButton.appendChild(icon);
    listButtonElement.appendChild(moreButton);

    return listButtonElement;
  }

  #createMenuItems(hiddenPages: HTMLLIElement[]): MenuItem[] {
    return (
      hiddenPages.map(button => {
        const newItem = this.shadowRoot?.createElement('sl-menu-item') as MenuItem;
        newItem.innerText = button.innerText.trim();
        newItem.setAttribute('aria-label', `${msg(str`${button.innerText.trim()}, page`)}`);
        newItem.addEventListener('click', event => this.#setActive(event));
        return newItem;
      }) ?? []
    );
  }

  // #setCompactVariant(): void {
  //   const buttonPrev = this.renderRoot.querySelector('sl-button.prev') as Button,
  //     buttonNext = this.renderRoot.querySelector('sl-button.next') as Button,
  //     pagesWrapper = this.renderRoot.querySelector('.pages-wrapper') as HTMLElement,
  //     selectWrapper = this.renderRoot.querySelector('.select-wrapper') as HTMLDivElement,
  //     container = this.renderRoot.querySelector('.container') as HTMLDivElement;
  //
  //   // pagesWrapper.style.display = 'none';
  //   // buttonPrev.style.display = 'none';
  //   // buttonNext.style.display = 'none';
  //   // selectWrapper.style.display = '';
  //   // container.setAttribute('mobile', '');
  //   this.setAttribute('mobile', '');
  //   this.requestUpdate();
  // }
}
