import { faCaretLeft, faCaretRight } from '@fortawesome/pro-solid-svg-icons';
import { localized } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Select, SelectOption } from '@sl-design-system/select';
import {Menu, MenuButton, MenuItem} from '@sl-design-system/menu';
import {type EventEmitter, event} from '@sl-design-system/shared';
import {type CSSResultGroup, LitElement, type TemplateResult, html, type PropertyValues} from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './paginator.scss.js';
import { Page } from './page.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-page-change': SlPageChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-paginator': Paginator;
  }
}

Icon.register(faCaretLeft, faCaretRight);

export type SlPageChangeEvent = CustomEvent<number>;

/**
 * A paginator component used when there are a lot of data that needs to be shown and cannot be shown at once, in one view/page.
 *
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
      'sl-page': Page,
      'sl-select': Select,
      'sl-select-option': SelectOption
    }; // TODO: update dependencies
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * Observe changes in size of the container.
   */
  #observer = new ResizeObserver(() => {requestAnimationFrame(() => this.#update())});

  /** Active page. */
  #activePage = 1;

  get activePage(): number {
    return this.#activePage;
  }

  /** Currently active page. */
  @property()
  set activePage(value: number) {
    this.#activePage = value;
    this.pageChangeEvent.emit(this.#activePage);
  }

  /** @internal Emits when the page has been selected/changed. */
  @event({ name: 'sl-page-change' }) pageChangeEvent!: EventEmitter<SlPageChangeEvent>;

  /** Total amount of items */
  @property() total?: number;

  /** Page sizes - array of possible page sizes e.g. [5, 10, 15] */
  @property({ type: Number, attribute: 'page-sizes' }) pageSizes?: number[];

  /** Items per page. Default to the first item of pageSizes, if pageSizes is not set - default to 10. */
  @property({ type: Number, attribute: 'items-per-page' }) itemsPerPage?: number;

  /** @internal pages amount */
  #pages: number = 1;

  /** @internal currently visible items on the current page */
  @state() currentlyVisibleItems: number = 1;

  /** @internal The width of the menu button; used for calculating the (in)visible pages. */
  #menuButtonWidth = 0;

  /** @internal Whether there is a mobile variant with `sl-select` instead of `pages` visible or not. */
  #mobileVariant: boolean = false;

  /** @internal To check whether it's a first update. */
  #firstUpdate = true;

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    /**  Calculate the max inline size of the moreButton *before* we start the observer */
    this.#menuButtonWidth = await this.#getMenuButtonWidth();

    if (!this.itemsPerPage) {
      this.itemsPerPage = this.pageSizes ? this.pageSizes[0] : 10;
    }

    const total = this.total ?? 0;
    const itemsPerPage = this.itemsPerPage ?? 10;
    this.#pages = Math.ceil(total / itemsPerPage) || 1;

    if (this.activePage < 1) {
      this.activePage = 1;
    } else if (this.activePage > this.#pages) {
      this.activePage = this.#pages;
    }

    this.#setCurrentlyVisibleItems();

     requestAnimationFrame(() => {
      this.#observer.observe(this);

      const selectWrapper = this.renderRoot.querySelector<HTMLDivElement>('.select-wrapper');

      if (!this.#mobileVariant && selectWrapper) {
        selectWrapper.style.display = 'none';
      }
     });
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('itemsPerPage')) {
      const total = this.total ?? 0;
      const itemsPerPage = this.itemsPerPage ?? 10;
      this.#pages = Math.ceil(total / itemsPerPage) || 1;

      this.#setCurrentlyVisibleItems();

      if (!this.#firstUpdate) {
        /**  always go back to the first page when items per page has changed, but not for the first time */
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

      this.#update();
    }

    if (changes.has('total')) {
      const total = this.total ?? 0;
      const itemsPerPage = this.itemsPerPage ?? 10;
      this.#pages = Math.ceil(total / itemsPerPage) || 1;

      if (!this.#firstUpdate) {
        /** always go back to the first page when the total amount of items has changed, but not for the first time */
        this.activePage = 1;
      }

      requestAnimationFrame(() => {
        this.#update();
      });
    }

    this.#firstUpdate = false;
  }

  override render(): TemplateResult {
    const total = this.total ?? 0;
    const itemsPerPage = this.itemsPerPage ?? 10;
    const pages = Math.ceil(total / itemsPerPage) || 2;

    // TODO: next and previous should be wrapped by 'li' as well

    return html`
      <nav class="container">
        <ul>
          <sl-button class="prev" icon-only aria-label="Go to the previous page {page}" fill="ghost" size="lg" ?disabled=${this.activePage === 1} @click=${this.#onClickPrevButton}>
            <sl-icon name="fas-caret-left" size="xs"></sl-icon>
          </sl-button>
              <div class="pages-wrapper">
                    ${Array.from({ length: pages }).map(
                      (_, index) => html`
                <sl-page
                  fill="ghost"
                  size="lg"
                  class="page"
                  ?active=${this.activePage == index + 1}
                  aria-current=${ifDefined(this.activePage == index + 1 ? 'page' : undefined)}
                  @click=${this.#setActive}
                >
                  ${index + 1}
                </sl-page>
              `
                    )}
              </div>
          <div class="select-wrapper">
            <sl-select size="lg" @change=${this.#setActive} .value=${this.activePage}>
              ${Array.from({ length: pages })?.map(
                (_, index) => html`
                <sl-select-option @click=${this.#setActive} .value=${index + 1}>${index + 1}</sl-select-option
              `
              )}
            </sl-select>
            <span>of ${pages} pages [msg]</span>
          </div>
          <sl-button class="next" aria-label="Go to the next page {page}" fill="ghost" size="lg" ?disabled=${this.activePage === this.#pages} @click=${this.#onClickNextButton}
            ><sl-icon name="fas-caret-right" size="xs"></sl-icon
          ></sl-button>
        </ul>
      </nav>
    `;
  }

  /**
   * Handles `click` event on the previous button.
   */
  #onClickPrevButton() {
    this.activePage--;

    this.pageChangeEvent.emit(this.activePage); // TODO: maybe in the setter is enough

    this.#setCurrentlyVisibleItems();

    this.#update();
  }

  /**
   * Handles `click` event on the next button.
   */
  #onClickNextButton() {
    this.activePage++;

    this.pageChangeEvent.emit(this.activePage);

    this.#setCurrentlyVisibleItems();

    this.#update(); // TODO: maybe move to activePage setter?
  }

  #setActive(event: Event) {
    const target = event.target as HTMLElement;
    this.activePage = Number(target.innerText?.trim());

    this.pageChangeEvent.emit(this.activePage);

    this.#setCurrentlyVisibleItems();

    this.#update();
  }

  #update(): void {
    const buttonPrev = this.renderRoot.querySelector('sl-button.prev') as Button,
     buttonNext = this.renderRoot.querySelector('sl-button.next') as Button,
     gap = parseInt(getComputedStyle(this).getPropertyValue('--_gap') || '0'),
     pages = this.renderRoot.querySelectorAll<Page>('sl-page.page'),
     pagesWrapper = this.renderRoot.querySelector('.pages-wrapper') as HTMLDivElement,
     selectWrapper = this.renderRoot.querySelector('.select-wrapper') as HTMLDivElement,
     ulElement = this.renderRoot.querySelector('ul') as HTMLUListElement,
     lastPage = pages.length;

    let [totalPagesWidth, totalAmountOfPagesWidth, totalWidth] = [0, 0, 0],
       [hiddenButtons, hiddenButtonsLeft, hiddenButtonsRight, possiblyVisible, possiblyHidden]: Page[][] = Array.from({ length: 5 }, () => []),
       [menuItems, menuItemsLeft, menuItemsRight]: Node[][] = Array.from({ length: 3 }, () => []);

    const [moreButton, moreButtonLeft, moreButtonRight] = Array.from({ length: 3 }, () => this.#createMenuButton());

    /** reset display to check the width */
    pagesWrapper.style.display = '';
    buttonPrev.style.display = '';
    buttonNext.style.display = '';
    selectWrapper.style.display = 'none';
    ulElement.removeAttribute('mobile');
    this.requestUpdate();

    pages.forEach(page => {
      page.style.display = '';
      totalPagesWidth += page.offsetWidth + gap;
    });

    /** reset mobile variant */
    this.#mobileVariant = false;
    this.requestUpdate(); // TODO: is it necessary? perhaps yes?

    (Array.from(pages)).forEach(button => {
      /** reset display to check the width */
      button.style.display = '';
      this.requestUpdate();

      totalAmountOfPagesWidth += button.getBoundingClientRect().width + gap;

      if (pagesWrapper && totalAmountOfPagesWidth > pagesWrapper.getBoundingClientRect().width) {
        possiblyHidden.push(button);
      } else {
        possiblyHidden = [];
      }
    });

    possiblyVisible = Array.from(pages).filter(page => !possiblyHidden.includes(page));

    /** overflow variant */
    if (pagesWrapper && pagesWrapper.clientWidth < pagesWrapper.scrollWidth) {

      /** mobile (compact) version with sl-select instead of pages,
       * when possibly visible pages amount is smaller than 6 (when possibly visible pages > 6 it works fine with basic variant with pages, also with the overflow version).
       * */
      this.#mobileVariant = possiblyVisible.length <= 6;
      if (this.#mobileVariant) {
        /** hide pages when there should be a mobile (compact) variant visible and dimensions are already checked */
        pagesWrapper.style.display = 'none';
        buttonPrev.style.display = 'none';
        buttonNext.style.display = 'none';
        selectWrapper.style.display = '';
        ulElement.setAttribute('mobile', '');
        this.requestUpdate();
        return;
      }

      /** if activePage is bigger than half of possibly visible pages and smaller than last pages,
      *   pages before and pages after active page, from 1..active and active ...10
      *   first page -> hidden pages on the left (one more button) -> shown pages on the left -> active page -> shown pages on the right -> hidden pages on the right (one more button) -> last page
      *   e.g.  1 ... 7 [8] 9 10 ... 20
      */
      if ((this.activePage) > Math.floor(possiblyVisible.length / 2) && (this.activePage) <= (lastPage - Math.floor(possiblyVisible.length / 2))) {
        let pagesToShow: number;
        /** possibly visible pages minus 3 - minus first, active page and last page */
        pagesToShow = possiblyVisible.length - 3;
        const evenAmount = possiblyVisible.length % 2 === 0;
        const toShowAmount = Math.floor(pagesToShow/ 2);

        /** hide pages on the left side of the active page, between first page and active page */
        hiddenButtonsLeft = Array.from(pages).slice(1, this.activePage - toShowAmount);
        menuItemsLeft = this.#createMenuItems(hiddenButtonsLeft);

        menuItemsLeft.forEach(item => moreButtonLeft.appendChild(item));

        /** remove unnecessary, existing menu buttons */
        this.renderRoot.querySelectorAll('sl-menu-button.more-button')?.forEach(moreButton => moreButton.remove());

        pages[0].after(moreButtonLeft);

        hiddenButtonsLeft.forEach(button => button.style.display = 'none');

        /** hide pages on the right side of the active page, between active page and last page */
        hiddenButtonsRight = Array.from(pages).slice(this.activePage + (toShowAmount - (evenAmount ? 0 : 1)), -1);
        menuItemsRight = this.#createMenuItems(hiddenButtonsRight);

        menuItemsRight.forEach(item => moreButtonRight.appendChild(item));

        hiddenButtonsRight.forEach(button => button.style.display = 'none');

        pages[lastPage - 1].before(moreButtonRight);
      } else if (this.activePage <= Math.floor(possiblyVisible.length / 2)) {
        /**  A variant when the first page is active or the active page is smaller than the half of possibly visible pages
         *   e.g. [1] 2 3 4 5 6...20
         *   */
        (Array.from(pages).slice(0, -1)).forEach(button => {
          /** Ensure all pages are visible initially */
          button.style.display = '';
          totalWidth += button.offsetWidth + gap;

          if (pagesWrapper && totalWidth > pagesWrapper.clientWidth - this.#menuButtonWidth - Array.from(pages)[lastPage-1].offsetWidth - 2 * gap) {
            hiddenButtons.push(button);
            menuItems = this.#createMenuItems(hiddenButtons);

            button.style.display = 'none';
          }
        });

        menuItems.forEach(item => moreButton.appendChild(item));

        /** remove unnecessary, existing menu buttons */
        this.renderRoot.querySelectorAll('sl-menu-button.more-button')?.forEach(moreButton => moreButton.remove());
        pages[lastPage - 1].before(moreButton);
      } else {
        /** a variant with last pages, e.g. 1... 15 16 17 18 19 [20] */
        (Array.from(pages).reverse().slice(0, -1)).forEach(button => {
          /** Ensure all pages are visible initially */
          button.style.display = '';
          totalWidth += button.offsetWidth + gap;

          if (pagesWrapper && totalWidth > pagesWrapper.clientWidth - this.#menuButtonWidth - Array.from(pages)[0].offsetWidth - 2 * gap) {
            hiddenButtons.push(button);
            menuItems = this.#createMenuItems(hiddenButtons);

            button.style.display = 'none';
          }
        });

        menuItems.reverse().forEach(item => moreButton.appendChild(item));

        /** remove unnecessary, existing menu buttons */
        this.renderRoot.querySelectorAll('sl-menu-button.more-button')?.forEach(moreButton => moreButton.remove());
        pages[0].after(moreButton);
      }
    } else {
      pages.forEach(page => (page.style.background = ''));
      /** remove unnecessary, existing menu buttons */
      this.renderRoot.querySelectorAll('sl-menu-button.more-button')?.forEach(moreButton => moreButton.remove());
    }
  }

  /** This returns the width of the menu button. */
  async #getMenuButtonWidth(): Promise<number> {
    const moreButton = this.shadowRoot?.createElement('sl-menu-button') as MenuButton;
    moreButton.classList.add('initial');
    moreButton.fill = 'ghost';
    moreButton.size = 'lg';

    const icon = this.shadowRoot?.createElement('sl-icon') as Icon;
    icon.slot = 'button';
    icon.name = 'ellipsis';

    moreButton.appendChild(icon);

    await new Promise(resolve => requestAnimationFrame(resolve));

    this.shadowRoot?.appendChild(moreButton);

    await new Promise(resolve => requestAnimationFrame(resolve));

    const width = moreButton.getBoundingClientRect()?.width;

    await new Promise(resolve => requestAnimationFrame(resolve));

    this.shadowRoot?.querySelector('sl-menu-button.initial')?.remove();

    await new Promise(resolve => requestAnimationFrame(resolve));

    return width;
  }

  #setCurrentlyVisibleItems(): void {
    if (!this.itemsPerPage || !this.#pages) {
      return;
    }

    if (this.activePage === this.#pages) {
      const total = this.total ?? 0;
      const itemsOnLastPage = total % this.itemsPerPage;
      this.currentlyVisibleItems = itemsOnLastPage === 0 ? this.itemsPerPage : itemsOnLastPage;
    } else {
      this.currentlyVisibleItems = this.itemsPerPage!;
    }
  }

  #createMenuButton(): MenuButton {
    const moreButton = this.shadowRoot?.createElement('sl-menu-button') as MenuButton;
    moreButton.fill = 'ghost';
    moreButton.size = 'lg';
    moreButton.classList.add('more-button');

    const icon = this.shadowRoot?.createElement('sl-icon') as Icon;
    icon.slot = 'button';
    icon.name = 'ellipsis-down';

    moreButton.appendChild(icon);

    return moreButton;
  }

  #createMenuItems(hiddenPages: Page[]): MenuItem[] {
    return hiddenPages.map(
      (button) => {
        const newItem = this.shadowRoot?.createElement('sl-menu-item') as MenuItem;
        newItem.innerText = button.innerText.trim();
        newItem.addEventListener('click', (event) => this.#setActive(event));
        return newItem;
      }
    ) ?? [];
  }
}

// TODO: nav -> ul -> li -> a href? or button - depending whether it is a navigation or not?


/**
 * ACCESSIBILITY:::
 *
 *
 * buttons:
 *
 *
 * */

