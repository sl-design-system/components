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
  #observer = new ResizeObserver(() => {requestAnimationFrame(() => this.#onResize())});

  #activePage = 1;

  get activePage(): number {
    return this.#activePage;
  }

  /** Currently active page. */
  @property()
  set activePage(value: number) {
    // console.log('value in setter activePage', value);
    // this.#activePage = value ?? 1;
    console.log('value in set activePage', value);

    // const oldValue = this.#activePage;
    this.#activePage = value; // ?? 1;
    this.pageChangeEvent.emit(this.#activePage);
    // this.requestUpdate('activePage', oldValue);
    console.log('value in setter activePage', value, this.#activePage);
  }

  /** @internal Emits when the page has been selected/changed. */
  @event({ name: 'sl-page-change' }) pageChangeEvent!: EventEmitter<SlPageChangeEvent>;

  // TODO: elements per page?

  // TODO: disabled?

  /** Total amount of items */
  @property() total?: number;

  /** Page sizes - array of possible page sizes e.g. [5, 10, 15] */
  @property({ type: Number, attribute: 'page-sizes' }) pageSizes?: number[];

  /** Items per page. Default to the first item of pageSizes, if pageSizes is not set - default to 10. */
  @property({ type: Number, attribute: 'items-per-page' }) itemsPerPage?: number;

  /** @internal pages amount */ // TODO: state maybe?
  #pages: number = 1;

  /** @internal currently visible items on the current page */
  @state() currentlyVisibleItems: number = 1;

  /** The width of the menu button; used for calculating the (in)visible pages. */
  #menuButtonWidth = 0;

  /** Whether there is a mobile variant with `sl-select` instead of `pages` visible or not. */
  #mobileVariant: boolean = false;

  /** To check whether it's a first update. */
  #firstUpdate = true;

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    // Calculate the max inline size of the moreButton *before* we start the observer
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

    console.log('pages in connectedCallback', this.#pages, this.activePage, itemsPerPage, total % itemsPerPage);

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

    console.log('changes in updated', changes, this.activePage);

    if (changes.has('itemsPerPage')) {
      const total = this.total ?? 0;
      const itemsPerPage = this.itemsPerPage ?? 10;
      this.#pages = Math.ceil(total / itemsPerPage) || 2;

      this.#setCurrentlyVisibleItems();

      if (!this.#firstUpdate) {
        // always go back to the first page when items per page has changed, but not for the first time
        this.activePage = 1;
      }

      requestAnimationFrame(() => {
        this.#onResize();
      });

      // TODO: on resize is not working? still mobilevariant when it should not be?
    }

    if (changes.has('activePage')) {
      console.log('this.activePage-1', this.activePage);
      if (this.activePage < 1) {
        this.activePage = 1;
      } else if (this.activePage > this.#pages) {
        this.activePage = this.#pages;
      }

      this.#setCurrentlyVisibleItems();

      this.#onResize();
      console.log('this.activePage-2', this.activePage);
    }

    if (changes.has('total')) {
      if (!this.#firstUpdate) {
        // always go back to the first page when the total amount of items has changed, but not for the first time
        this.activePage = 1;
      }

      requestAnimationFrame(() => {
        this.#onResize();
        // this.requestUpdate();
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
          <sl-button class="prev" aria-label="Go to the previous page {page}" fill="ghost" size="lg" ?disabled=${this.activePage === 1} @click=${this.#onClickPrevButton}
            ><sl-icon name="fas-caret-left" size="xs"></sl-icon></sl-button>
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
            <sl-select @change=${this.#setActive} .value=${this.activePage} style="inline-size: 100px;">
              ${Array.from({ length: pages })?.map(
                (_, index) => html`
                <sl-select-option @click=${this.#setActive} .value=${index + 1}>${index + 1}</sl-select-option
              `
              )}
            </sl-select>
            of ${pages} pages [msg]
          </div>
          <sl-button class="next" aria-label="Go to the next page {page}" fill="ghost" size="lg" ?disabled=${this.activePage === this.#pages} @click=${this.#onClickNextButton}
            ><sl-icon name="fas-caret-right" size="xs"></sl-icon
          ></sl-button>
        </ul>
      </nav>
    `;
  }

  // TODO: which items should be shown on current page? st. like between 16 and 30? or not necessary for data? or just im event emit activePage * visible items?

  // TODO: select for items per page?

  /**
   * Handles `click` event on the previous button.
   */
  #onClickPrevButton() {
    this.activePage--;

    this.pageChangeEvent.emit(this.activePage);

    this.#setCurrentlyVisibleItems();

    this.#onResize();
  }

  /**
   * Handles `click` event on the next button.
   */
  #onClickNextButton() {
    this.activePage++;

    this.pageChangeEvent.emit(this.activePage);

    this.#setCurrentlyVisibleItems();

    this.#onResize(); // TODO: maybe move to activePage setter?
  }

  #setActive(event: Event) {
    const target = event.target as HTMLElement;
    this.activePage = Number(target.innerText?.trim());

    this.pageChangeEvent.emit(this.activePage);

    this.#setCurrentlyVisibleItems();

    this.#onResize();
  }

  #onResize(): void { // TODO: rename to #onChange ???
    const pagesWrapper = this.renderRoot.querySelector('.pages-wrapper') as HTMLDivElement;
    const container = this.renderRoot.querySelector('.container');
    const buttonPrev = this.renderRoot.querySelector('sl-button.prev') as Button;
    const buttonNext = this.renderRoot.querySelector('sl-button.next') as Button;
    const selectWrapper = this.renderRoot.querySelector('.select-wrapper') as HTMLDivElement;
    const ulElement = this.renderRoot.querySelector('ul') as HTMLUListElement;

    // reset display to check the width
    pagesWrapper.style.display = '';
    buttonPrev.style.display = '';
    buttonNext.style.display = '';
    selectWrapper.style.display = 'none';
    ulElement.removeAttribute('mobile');
    this.requestUpdate();

    console.log(
      'on RESIZE - pagesWrapper',
      pagesWrapper.getBoundingClientRect().width,
      pagesWrapper && pagesWrapper.clientWidth - this.#menuButtonWidth < pagesWrapper.scrollWidth,
      pagesWrapper && pagesWrapper.clientWidth < pagesWrapper.scrollWidth - this.#menuButtonWidth,
      pagesWrapper.clientWidth < pagesWrapper.scrollWidth - this.#menuButtonWidth,
      pagesWrapper.clientWidth < pagesWrapper.scrollWidth,
      pagesWrapper,
      pagesWrapper?.clientWidth,
      pagesWrapper?.scrollWidth,
      pagesWrapper.scrollWidth - this.#menuButtonWidth,
      (pagesWrapper as HTMLDivElement)?.offsetWidth,
      'container',
      container,
      container?.clientWidth,
      container?.scrollWidth,
      (container as HTMLElement)?.offsetWidth,
      'this.#menuButtonWidth',
      this.#menuButtonWidth,
      pagesWrapper.getBoundingClientRect(),
      'selectWrapper',
      selectWrapper,
      selectWrapper.clientWidth,
      this.#menuButtonWidth
    );

    const pages = this.renderRoot.querySelectorAll<Page>('sl-page.page'); //this.renderRoot.querySelectorAll<Button>('sl-button.page'); // TODO: should work also for links, not only for buttons

    /**
     * First variant, when 1 is active and not enough space - last one -1 should get ellipsis - or even more
     * Second variant, when last page is active and not enough space, 2nd one should get ellipsis - or even more
     * Third variant, ellipsis on the left and on the right, after 1st and before last page. check how many items are currently visible and when the middle one is active?
     * Maybe use slice to manipulate the visible/hidden arrays?
     *
     * */

    let totalPagesWidth = 0;
    let totalAmountOfPagesWidth = 0;

    const lastPage = pages.length;

    let totalWidth = 0;
    let hiddenButtons: Page[] = [];
    let hiddenButtonsLeft: Page[] = [];
    let hiddenButtonsRight: Page[] = [];

    pages.forEach(page => {
      page.style.display = '';
      totalPagesWidth += page.offsetWidth; // + gap;
    });

    const moreButton = this.shadowRoot?.createElement('sl-menu-button') as MenuButton;
    console.log('moreButton', moreButton);
    moreButton.fill = 'ghost';
    moreButton.size = 'lg';
    moreButton.classList.add('more-button');
    const icon = this.shadowRoot?.createElement('sl-icon') as Icon;
    icon.slot = 'button';
    icon.name = 'ellipsis-down';
    moreButton.appendChild(icon);

    const moreButtonLeft = this.shadowRoot?.createElement('sl-menu-button') as MenuButton;
    console.log('moreButtonLeft', moreButtonLeft);
    moreButtonLeft.fill = 'ghost';
    moreButtonLeft.size = 'lg';
    moreButtonLeft.classList.add('more-button');
    const iconLeft = this.shadowRoot?.createElement('sl-icon') as Icon;
    iconLeft.slot = 'button';
    iconLeft.name = 'ellipsis-down';
    moreButtonLeft.appendChild(iconLeft);

    const moreButtonRight = this.shadowRoot?.createElement('sl-menu-button') as MenuButton;
    console.log('moreButtonRight', moreButtonRight);
    moreButtonRight.fill = 'ghost';
    moreButtonRight.size = 'lg';
    moreButtonRight.classList.add('more-button');
    const iconRight = this.shadowRoot?.createElement('sl-icon') as Icon;
    iconRight.slot = 'button';
    iconRight.name = 'ellipsis-down';
    moreButtonRight.appendChild(iconRight);

    let menuItems: Node[] = [];
    let menuItemsLeft: Node[] = [];
    let menuItemsRight: Node[] = [];

    // reset mobile variant
    this.#mobileVariant = false; // or maybe getter/setter?
    this.requestUpdate(); // TODO: is it necessary? perhaps yes?


    // if (container && pages[0]) {
    //   const itemsPerRow = Math.floor(container?.clientWidth / pages[0].clientWidth);
    //   console.log('itemsPerRow', itemsPerRow, container?.clientWidth, pages[0].clientWidth);
    // }

    console.log('totalPagesWidth', totalPagesWidth, 'lastPage', lastPage, 'moreButton', moreButton, container, this.activePage === lastPage - 1, this.activePage, lastPage - 1, lastPage, this.activePage === lastPage);


    let possiblyVisible: Page[] = [];
    let possiblyHidden: Page[] = [];

    // reset display to check the width
    pagesWrapper.style.display = '';
    buttonPrev.style.display = '';
    buttonNext.style.display = '';
    selectWrapper.style.display = 'none';
    ulElement.removeAttribute('mobile');

    this.requestUpdate();


    (Array.from(pages)).forEach(button => {
      // reset display to check the width
      pagesWrapper.style.display = '';
      buttonPrev.style.display = '';
      buttonNext.style.display = '';
      selectWrapper.style.display = 'none';
      ulElement.removeAttribute('mobile');

      button.style.display = '';

      this.requestUpdate();

      totalAmountOfPagesWidth += button.getBoundingClientRect().width; //button.offsetWidth;

      console.log('Comparison value:', pagesWrapper.clientWidth - (2 * this.#menuButtonWidth), totalAmountOfPagesWidth, 'pagesWrapper.clientWidth', pagesWrapper.clientWidth, pagesWrapper && totalAmountOfPagesWidth /*+ this.#menuButtonWidth*/ /*32*/ /*moreButtonWidth*/ > pagesWrapper.clientWidth, pagesWrapper.getBoundingClientRect().width, 'button.offsetWidth', button.getBoundingClientRect().width);


      console.log('pagesWrapper in checking possiblyvisible and hidden', pagesWrapper, pagesWrapper && pagesWrapper.clientWidth < pagesWrapper.scrollWidth - this.#menuButtonWidth);

      if (pagesWrapper && totalAmountOfPagesWidth /*+ this.#menuButtonWidth*/ /*32*/ /*moreButtonWidth*/ > pagesWrapper.getBoundingClientRect().width /*pagesWrapper.clientWidth*/ /*- (2 * this.#menuButtonWidth) *//*32*/ /*moreButtonWidth*/ /*moreButton.offsetWidth - 32*/ /*container && totalWidth > container.clientWidth*/) { // TODO: or pagesWrapper???
        possiblyHidden.push(button);
        console.log('possiblyHidden in if', possiblyHidden, button, totalAmountOfPagesWidth, totalPagesWidth, 'pagesWrapper.clientWidth', pagesWrapper.clientWidth, pagesWrapper.clientWidth - (2 * this.#menuButtonWidth), pagesWrapper);
      } else {
        possiblyHidden = [];
        // ...
      } // or maybe 2 x menuButtonWidth ??
    });
    console.log('1possiblyVisible, possiblyHidden', possiblyVisible, possiblyHidden, Array.from(pages), totalPagesWidth, pagesWrapper?.clientWidth);

    possiblyVisible = Array.from(pages).filter(page => !possiblyHidden.includes(page)); //pages.length - possiblyHidden.length;

    console.log('possiblyVisible, possiblyHidden', possiblyVisible, possiblyHidden, Array.from(pages), totalPagesWidth, pagesWrapper?.clientWidth);

    console.log('pagesWrapper in checking possiblyvisible and hidden AFTER', pagesWrapper, pagesWrapper && pagesWrapper.clientWidth < pagesWrapper.scrollWidth - this.#menuButtonWidth, pagesWrapper.scrollWidth);

    // console.log('mobileVariant', this.#mobileVariant, possiblyVisible.length, possiblyVisible.length <= 3, pages);
    // console.log('Visible buttons1:', pages.length - hiddenButtons.length, pages.length, totalWidth);
    // console.log(`Hidden buttons1:`, hiddenButtons?.length, hiddenButtons);

    console.log('should show ellipsis?',
      pagesWrapper && pagesWrapper.clientWidth < pagesWrapper.scrollWidth - this.#menuButtonWidth,
      pagesWrapper && pagesWrapper.getBoundingClientRect().width < pagesWrapper.scrollWidth - this.#menuButtonWidth,
      'pagesWrapper.clientWidth', pagesWrapper.clientWidth,
      'pagesWrapper.getBoundingClientRect().width', pagesWrapper.getBoundingClientRect().width,
      'pagesWrapper.scrollWidth', pagesWrapper.scrollWidth
      )


// TODO: maybe use getBoundingClientRect.width??? instead clientWidth like for checking possiblyVisible and possiblyHidden amount
    // overflow variant
    if (pagesWrapper && pagesWrapper.clientWidth < pagesWrapper.scrollWidth /*- this.#menuButtonWidth*/ /*moreButtonWidth*/ /*moreButton.offsetWidth*/ /*container && container.clientWidth < container.scrollWidth*/) {
      console.log('on RESIZE ---- container ----- not enpough space, should show ellipsis', container, possiblyVisible.length, possiblyVisible.length <= 4);

      // mobile version
      this.#mobileVariant = possiblyVisible.length <= 6; //3; //4;
      if (this.#mobileVariant) {
        // hide pages when there should be mobile variant visible and dimensions are already checked
        pagesWrapper.style.display = 'none';
        buttonPrev.style.display = 'none';
        buttonNext.style.display = 'none';
        selectWrapper.style.display = '';
        ulElement.setAttribute('mobile', '');
        // TODO: maybe select-wrapper display block?
        this.requestUpdate();
        return;
      }

      console.log('mobileVariant after setting mobile', this.#mobileVariant, possiblyVisible.length, possiblyVisible.length <= 3, pages);


      // if activePage bigger than half of possibly visible pages and smaller than last pages
      // e.g.  1 ... 7 [8] 9 10 ... 20
      if ((this.activePage) > Math.floor(/*visibleButtons*/ possiblyVisible.length / 2) && (this.activePage) <= (lastPage - Math.floor(/*visibleButtons*/ possiblyVisible.length / 2))) { // TODO change to not only last page applicable but last few pages
        console.log('enters first');
        // TODO: hide on the left and on the right
        // items before and items after from 1..active and active ...10
        let pagesToShow: number; //: Page[] = [];
        pagesToShow = possiblyVisible.length - 3; // TODO: 3 because minus first, activepage and last page, //possiblyVisible.filter((_, index) => index !== 0 && index !== (this.activePage - 1) && index !== (possiblyVisible.length - 1));
        const evenAmount = /*pagesToShow*/possiblyVisible.length % 2 === 0;
        const toShowAmount = Math.floor(pagesToShow/*.length *// 2); // ceil?

        console.log('toShowAmount and possiblyVisible', toShowAmount, possiblyVisible, evenAmount);

        // TODO: add proper descriptio0ns and variables for items like toHide toShowItemsLeft etc.
        console.log('pages to show', pagesToShow, Math.floor(pagesToShow/*.length*/ / 2), this.activePage - 2, pages.length - this.activePage -1);
        console.log('to hide on the left', (this.activePage - 2) - Math.floor(pagesToShow/*.length*/ / 2), 'to hide on the right', (pages.length - this.activePage -1) - Math.floor(pagesToShow/*.length*/ / 2));
        console.log('hidden pages on the left and right', '...', Array.from(pages).slice(1, (this.activePage - 2) - Math.floor(pagesToShow/*.length*/ / 2) + 1),
          'hide on the right', Array.from(pages).slice(this.activePage, this.activePage + ((pages.length - this.activePage -1) - Math.floor(pagesToShow/*.length*/ / 2))),
          Array.from(pages).slice(this.activePage + (toShowAmount), -1),
          'amount', this.activePage + (toShowAmount));
        console.log('to show on the left and right',Math.floor(pagesToShow/*.length*/ / 2), toShowAmount, this.activePage - toShowAmount,
          'element to show on the left plus first one, including activePage', Array.from(pages).slice(this.activePage - 1 - toShowAmount, this.activePage),
          'element to show on the right plus first one', Array.from(pages).slice(this.activePage, this.activePage + toShowAmount));
        console.log('to hide on the left', (Array.from(pages).slice(1, this.activePage)), 'possiblyVisible', possiblyVisible.length);
        console.log('to hide on the right', (Array.from(pages).slice((this.activePage + 1), -1)), 'possiblyVisible', possiblyVisible.length);


        // TODO: minus first and last page?

        // hide on the left
        hiddenButtonsLeft = Array.from(pages).slice(1, (this.activePage) - Math.floor(pagesToShow/*.length*/ / 2));//.push(button);
        menuItemsLeft = hiddenButtonsLeft.map(
          (button) => {
            const newItem = /*document*/this.shadowRoot?.createElement('sl-menu-item') as MenuItem;
            newItem.innerText = button.innerText.trim();
            newItem.addEventListener('click', (event) => this.#setActive(event));

            //     ?active=${this.activePage == index + 1}
            // @click=${this.#setActive}
            return newItem;
          }
        ) ?? [];
        // moreButtonLeft.size = 'lg';
        // moreButtonLeft.setAttribute('size', 'lg');
        console.log('menuItemsLeft', hiddenButtonsLeft, menuItemsLeft);
        console.log('menuItemsLeft and moreButton', menuItemsLeft, moreButtonLeft);

        // hiddenButtonsLeft.forEach(button => button.style.display = 'none');

        menuItemsLeft.forEach(item => moreButtonLeft.appendChild(item));


        // this.renderRoot.querySelector('sl-menu-button.more-button')?.remove();
        this.renderRoot.querySelectorAll('sl-menu-button.more-button')?.forEach(moreButton => moreButton.remove());
        pages[0].after(moreButtonLeft);

        hiddenButtonsLeft.forEach(button => button.style.display = 'none');

        // hide on the right
        hiddenButtonsRight = Array.from(pages).slice(this.activePage + (toShowAmount - (evenAmount ? 0 : 1) /*1*/), -1); //Array.from(pages).slice(this.activePage, this.activePage + ((pages.length - this.activePage -1) - Math.floor(pagesToShow.length / 2)));//.push(button);
        menuItemsRight = hiddenButtonsRight.map(
          (button) => {
            const newItem = /*document*/this.shadowRoot?.createElement('sl-menu-item') as MenuItem;
            newItem.innerText = button.innerText.trim();
            newItem.addEventListener('click', (event) => this.#setActive(event));

            //     ?active=${this.activePage == index + 1}
            // @click=${this.#setActive}
            return newItem;
          }
        ) ?? [];
        console.log('menuItemsRight', hiddenButtonsRight, menuItemsRight);
        console.log('menuItemsRightand moreButton', menuItemsRight, moreButtonRight);

        menuItemsRight.forEach(item => moreButtonRight.appendChild(item));

        hiddenButtonsRight.forEach(button => button.style.display = 'none');

        // this.renderRoot.querySelector('sl-menu-button.more-button')?.remove();
        pages[lastPage - 1].before(moreButtonRight);

        // TODO: make below when activePage is somewhere in the middle --- possiblyVisible.length / 2
        // TODO: first page -> hidden pages on the left (one more button) -> shown pages on the left -> this.activepage -> shown pages on the right -> hidden pages on the right (one more button) -> last page
      } else if (this.activePage === 1 || (this.activePage) <= Math.floor(/*visibleButtons*/ possiblyVisible.length / 2)) {
        // a variant when the first page is active or the active page is smaller than the half of possibly visible pages
        // e.g. [1] 2 3 4 5 6...20
        console.log('enters second');
        (Array.from(pages).slice(0, -1)).forEach(button => {
          // Ensure all pages are visible initially
          button.style.display = '';
          totalWidth += button.offsetWidth;

          console.log('should hide buttons?', pagesWrapper && totalWidth > pagesWrapper.clientWidth, pagesWrapper.clientWidth, pagesWrapper.clientWidth - moreButton.offsetWidth,
            moreButton.offsetWidth, moreButton.clientWidth, moreButton.getBoundingClientRect().width, moreButton);

// console.log('last page width', Array.from(pages)[lastPage-1].offsetWidth);

          if (pagesWrapper && totalWidth /*+ this.#menuButtonWidth *//*moreButtonWidth*/ > pagesWrapper.clientWidth - this.#menuButtonWidth - Array.from(pages)[lastPage-1].offsetWidth /*TODO: minus last page width*/ /*moreButtonWidth*/ /*moreButton.offsetWidth - 32*/ /*container && totalWidth > container.clientWidth*/) { // TODO: or pagesWrapper???
            hiddenButtons.push(button);
            menuItems = hiddenButtons.map(
              (button) => {
                const newItem = this.shadowRoot?.createElement('sl-menu-item') as MenuItem;
                newItem.innerText = button.innerText.trim();
                newItem.addEventListener('click', (event) => this.#setActive(event));
                return newItem;
              }
            ) ?? [];
            // console.log('menuItems2', hiddenButtons, menuItems);
            // console.log('menuItems and moreButton', menuItems, moreButton);

            button.style.display = 'none';
          }
        });

        // moreButton.innerHTML = '';
        const currentMenuItems = this.renderRoot.querySelectorAll('sl-menu-item');
        console.log('menuItems to add', menuItems, currentMenuItems);
        menuItems.forEach(item => moreButton.appendChild(item));

        console.log('Visible buttons:', pages.length - hiddenButtons.length, pages.length, totalWidth);
        console.log(`Hidden buttons:`, hiddenButtons.length, hiddenButtons);

        // remove unnecessary, existing menu buttons
        this.renderRoot.querySelectorAll('sl-menu-button.more-button')?.forEach(moreButton => moreButton.remove());
        pages[lastPage - 1].before(moreButton);
      } else {
        // a variant with last pages, e.g. 1... 15 16 17 18 19 [20]
        console.log('enters third - else');

        (Array.from(pages).reverse().slice(0, -1)).forEach(button => {
          // Ensure all pages are visible initially
          button.style.display = '';
          totalWidth += button.offsetWidth;
          // TODO: maybe request update necessary?

          if (pagesWrapper && totalWidth /*+ this.#menuButtonWidth*/ /*moreButtonWidth*/ > pagesWrapper.clientWidth - this.#menuButtonWidth - Array.from(pages)[0].offsetWidth /*moreButtonWidth*/ /*moreButton.offsetWidth - 32*/ /*container && totalWidth > container.clientWidth*/) { // TODO: or pagesWrapper???
            hiddenButtons.push(button);
            menuItems = hiddenButtons.map(
              (button) => {
                const newItem = /*document*/this.shadowRoot?.createElement('sl-menu-item') as MenuItem;
                newItem.innerText = button.innerText.trim();
                newItem.addEventListener('click', (event) => this.#setActive(event));
                return newItem;
              }
            ) ?? [];

            button.style.display = 'none';
          }
        });

        menuItems.reverse().forEach(item => moreButton.appendChild(item));

        console.log('Visible buttons:', pages.length - hiddenButtons.length, pages.length, totalWidth);
        console.log(`Hidden buttons:`, hiddenButtons.length, hiddenButtons);

        // remove unnecessary, existing menu buttons
        this.renderRoot.querySelectorAll('sl-menu-button.more-button')?.forEach(moreButton => moreButton.remove());
        pages[0].after(moreButton);
      }
      // TODO: show and hide buttons
      // TODO: count buttons width and compare with difference: container.scrollWidth - container.clientWidth
      console.log('difference distance::::: pagesWrapper.scrollWidth - pagesWrapper.clientWidth ::::', pagesWrapper.scrollWidth - pagesWrapper.clientWidth);
    } else {
      pages.forEach(page => (page.style.background = ''));
      // remove unnecessary, existing menu buttons
      this.renderRoot.querySelector('sl-menu-button.more-button')?.remove();
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
      // const itemsPerPage = this.itemsPerPage ?? 10;
      console.log('last page is active');
      const itemsOnLastPage = total % this.itemsPerPage;
      this.currentlyVisibleItems = itemsOnLastPage === 0 ? this.itemsPerPage : itemsOnLastPage;
    } else {
      this.currentlyVisibleItems = this.itemsPerPage!;
    }
  }
}

// TODO: nav -> ul -> li -> a href? or button - depending whether it is a navigation or not?

// TODO: what to do when we have less pages than in the select selected? so always show all when there are less when the smaller value in select?
// TODO: how to set active link? maybe parameter? links should be slotted?
// TODO: when links... next and previous should be also a link, not a button

// TODO: maybe hide pagination when there is only one page? https://element-plus.org/en-US/component/pagination#hide-pagination-when-there-is-only-one-page


/**
 * ACCESSIBILITY:::
 *
 * links:
 * https://www.conductor.com/academy/pagination/
 *
 * buttons:
 *
 *
 * */

// TODO: take into account in the calculation the padding added to the pages-wrapper - due to the clipping focus-ring added


// TODO: a method with adding menu button?
