import { faChevronLeft, faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { localized } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Select, SelectOption } from '@sl-design-system/select';
import {Menu, MenuButton, MenuItem} from '@sl-design-system/menu';
import {type EventEmitter, event} from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import {type CSSResultGroup, LitElement, type TemplateResult, html, nothing, type PropertyValues} from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './paginator.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-paginator': Paginator;
  }
}

Icon.register(faChevronLeft, faChevronRight);

/**
 * A paginator component used when there are a lot of data that needs to be shown and cannot be shown at once, in one view/page.
 *
 * @csspart header - The header of the panel.
 *
 * @slot default - ...
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
      'sl-select': Select,
      'sl-select-option': SelectOption
    }; // TODO: update dependencies
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * Observe changes in size...
   */
  #observer = new ResizeObserver(() => this.#onResize());

  /** @internal Emits when the panel expands/collapses. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<boolean>>;

  // TODO: how many pages? 'pages' prop? or state?
  // TODO: current page (state?)
  // TODO: data?
  // TODO: elements per page?

  // TODO: total elements?

  // TODO: routing? with url change
  // TODO: emit event on page change

  // TODO: disabled?

  // TODO: role nav when links inside?

  // data - how to connect with data? make an example / story

  /** Total items */
  @property() total?: number;

  // TODO showTotal as property?

  // TODO: items per page number[]

  /** Page sizes - array of possible page sizes e.g. [5, 10, 15] */
  @property({ type: Number, attribute: 'page-sizes' }) pageSizes?: number[];

  /** Items per page. Default to the first item of pageSizes, if pageSizes is not set - default to 10. */
  @property({ type: Number, attribute: 'items-per-page' }) itemsPerPage?: number; // = 10; // or number[] ???

  /** Total items */
  @property({ type: Number, attribute: 'current-page' }) currentPage?: number = 1; // 1 by default? // or maybe activePage should be enough? // TODO: or maybe rename to defaultPage?

  /** @internal pages amount */ // TODO: state maybe?
  #pages: number = 1;

  /** @internal active */ // TODO: state maybe?
  @state() activePage: number = 1;

  /** @internal currently visible items on the current page */ // TODO: state maybe?
  @state() currentlyVisibleItems: number = 1;

  /** @internal */
  @state() buttons: Button[] = []; // TODO: remove it?

  /** When `navigation` is set, the paginator will have links instead of buttons and should be used as a navigation on the page. */
 // @property() navigation?: boolean; // TODO: links? array with links?

  /** should be used together with `navigation` property. The array should have the same width as itemsPerPage and should have the right order ???? */
 // @property() links?: string[] = []; // or maybe a function used to rendering urls?

  // /** @internal The slotted links. */
  // @queryAssignedElements() linkElements?: HTMLLinkElement[];

  /**  @internal The slotted links. */
 // @state() linkElements: HTMLLinkElement[] = []; // or add interface PaginatorItem with label in it, url and so on...

  // #hiddenLeft: Element[] = []; // TODO: separated component for pageItem?

  // #hiddenRight: Element[] = []; // TODO: separated component for pageItem?

  /** The width of the menu button; used for calculating the (in)visible pages. */
  #menuButtonWidth = 0;

  #mobileVariant: boolean = false;

  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    // if (!this.hasAttribute('tabindex')) {
    //   this.setAttribute('tabindex', '0');
    // }

    if (!this.itemsPerPage) {
      this.itemsPerPage = this.pageSizes ? this.pageSizes[0] : 10;
    }

    console.log('itemsperpage in connectedCallback', this.itemsPerPage, this.pageSizes);

    const total = this.total ?? 0;
    const itemsPerPage = this.itemsPerPage ?? 10;
    this.#pages = Math.ceil(total / itemsPerPage) || 2;

    console.log('pages in connectedCallback', this.#pages, this.activePage, itemsPerPage, total % itemsPerPage);

    if (this.activePage === this.#pages) {
      console.log('last page is active');
      this.currentlyVisibleItems = total % itemsPerPage;
    } else {
      this.currentlyVisibleItems = this.itemsPerPage;
    }

    // TODO: Calculate the max inline size of the moreButton *before* we start the observer
    this.#menuButtonWidth = await this.#getMenuButtonWidth();

    console.log('this.#menuButtonWidth', this.#menuButtonWidth);


    this.#observer.observe(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  // TODO: updated when total or itemsperpage has changed

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    console.log('changes in updated', changes);

    if (changes.has('itemsPerPage')) {
      const total = this.total ?? 0;
      const itemsPerPage = this.itemsPerPage ?? 10;
      this.#pages = Math.ceil(total / itemsPerPage) || 2;
      if (this.activePage === this.#pages) {
        const total = this.total ?? 0;
        const itemsPerPage = this.itemsPerPage ?? 10;
        console.log('last page is active');
        this.currentlyVisibleItems = total % itemsPerPage;
      } else {
        this.currentlyVisibleItems = this.itemsPerPage!;
      }
    }

    // if (changes.has('activePage')) {
    //   const pages = this.renderRoot.querySelectorAll('sl-button.page');
    //   const active = this.renderRoot.querySelector('sl-button[active]');
    //   active?.setAttribute('aria-current', 'page');
    // }
  }

  override render(): TemplateResult {
    const total = this.total ?? 0;
    const itemsPerPage = this.itemsPerPage ?? 10;
    const pages = Math.ceil(total / itemsPerPage) || 2;
    // const itemsAmountToCount = this.activePage === this.#pages ? itemsPerPage : this.currentlyVisibleItems;
    const start = this.activePage === 1 ? 1 : ((this.activePage - 1) * itemsPerPage /*itemsAmountToCount*/ /*this.currentlyVisibleItems*/) + 1;
    const end = this.activePage === this.#pages ? this.total : this.activePage * this.currentlyVisibleItems; //this.activePage === this.#pages ? undefined : Math.min(start + pageSize, total == null ? Infinity : total);

    console.log('start and end', start, end, this.renderRoot.querySelector<Select>('sl-select')?.value as number, itemsPerPage);
   // console.log('links', this.links, this.links?.length);
   // console.log('linkElements', this.linkElements, this.linkElements?.length);

    // TODO: next and previous should be wrapped by 'li' as well

    return html`
      <div style="display: none;">${start} - ${end} of ${this.total} items</div>
      <nav class="container">
        <ul>
          <sl-button class="prev" aria-label="Go to the previous page {page}" fill="ghost" size="md" ?disabled=${this.activePage === 1} @click=${this.#onClickPrevButton}
            ><sl-icon name="fas-chevron-right" size="xs"></sl-icon></sl-button>
              <div class="pages-wrapper">
                    ${Array.from({ length: pages }).map(
                      (_, index) => html`
                <sl-button
                  fill="ghost"
                  size="md"
                  class="page"
                  ?active=${this.activePage == index + 1}
                  aria-current=${ifDefined(this.activePage == index + 1 ? 'page' : undefined)}
                  @click=${this.#setActive}
                >
                  ${index + 1}
                </sl-button>
              `
                    )}
              </div>
          ${this.#mobileVariant ?
            html`
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
      `
            : nothing}
          <sl-button class="next" aria-label="Go to the next page {page}" fill="ghost" size="md" ?disabled=${this.activePage === this.#pages} @click=${this.#onClickNextButton}
            ><sl-icon name="fas-chevron-left" size="xs"></sl-icon
          ></sl-button>
        </ul>
      </nav>
      <div class="details" style="display: none;">
        <div>Total elements: ${this.total}</div>
        <div>Items per page: ${this.itemsPerPage}</div>
        ${this.total && this.itemsPerPage
          ? html`
              <div>Pages: ${Math.ceil(this.total / this.itemsPerPage)}</div>
              <div>Items left: ${this.total % this.itemsPerPage}</div>
            `
          : nothing}
        <div>Active page: ${this.activePage}</div>
        <div>Currently visible items ${this.currentlyVisibleItems}</div>
        <div class="page-sizes">
        Items per page:
        ${this.pageSizes ?
          html`
        <sl-select @change=${this.#onValueChange} .value=${this.itemsPerPage} style="inline-size: 100px;">
            ${this.pageSizes?.map(
              (size) => html`
                <sl-select-option @click=${this.#setValue} .value=${size}>${size}</sl-select-option
              `
            )}
        </sl-select>
        </div>
      </div>
      `
    : nothing}
    `;
  } // <slot></slot>

  // with links:::::
//   ${Array.isArray(this.links) && this.links.length > 0
//     ? this.links.map(( url, index, array) => html`
//                   <li>
//                     <a aria-current=${ifDefined(index === array.length - 1 ? 'page' : undefined)}
//                        class=${classMap({ page: true, active: this.activePage == index + 1 })}
//                        href=${url}>
//                       ${index + 1}
//                     </a>
//                   </li>
//                 `)
// : html`
//               <div class="pages-wrapper">
//                 ${Array.from({ length: pages }).map(
//   (_, index) => html`
//                 <sl-button
//                   fill="ghost"
//                   size="md"
//                   class="page"
//                   ?active=${this.activePage == index + 1}
//                   @click=${this.#setActive}
//                 >
//                   ${index + 1}
//                 </sl-button>
//               `
// )}
//               </div>
//             `}

  // TODO: which items should be shown on current page? st. like between 16 and 30? or not necessary for data? or just im event emit activePage * visible items?

  // TODO: sl icon for arrows?

  // TODO: select for items per page?

  // " 1–40 of 103 items" item visible on the current page from...

  /**
   * Handles `click` event on the previous button.
   */
  #onClickPrevButton() {
    // const { start: oldStart, pageSize } = this;
    // const newStart = Math.max(oldStart - pageSize, 0);
    // if (newStart !== oldStart) {
    //  // this._handleUserInitiatedChangeStart(newStart); // TODO: dispatch event
    // }
    console.log('click prev', this.activePage);
    // const { start: oldStart, pageSize, total } = this;
    // const newStart = oldStart + pageSize;
    // if (newStart < (total == null ? Infinity : total)) {
    //  // this._handleUserInitiatedChangeStart(newStart); // TODO: dispatch event
    // }

    this.activePage--;
    console.log('click prev AFTER', this.activePage);

    if (this.activePage === this.#pages) {
      console.log('last page is active');
      const total = this.total ?? 0;
      const itemsPerPage = this.itemsPerPage ?? 10;
      this.currentlyVisibleItems = total % itemsPerPage;
    } else {
      this.currentlyVisibleItems = this.itemsPerPage!;
    }

    this.#onResize();
  }

  /**
   * Handles `click` event on the next button.
   */
  #onClickNextButton() {
    console.log('click next', this.activePage);
    // const { start: oldStart, pageSize, total } = this;
    // const newStart = oldStart + pageSize;
    // if (newStart < (total == null ? Infinity : total)) {
    //  // this._handleUserInitiatedChangeStart(newStart); // TODO: dispatch event
    // }

    this.activePage++;
    console.log('click next AFTER', this.activePage);

    if (this.activePage === this.#pages) {
      console.log('last page is active');
      const total = this.total ?? 0;
      const itemsPerPage = this.itemsPerPage ?? 10;
      this.currentlyVisibleItems = total % itemsPerPage;
    } else {
      this.currentlyVisibleItems = this.itemsPerPage!;
    }

    this.#onResize();

    // this.requestUpdate();

    // TODO: update currentlyVisibleItems
  }

  #setActive(event: Event) {
    console.log('click next', this.activePage);
    // const { start: oldStart, pageSize, total } = this;
    // const newStart = oldStart + pageSize;
    // if (newStart < (total == null ? Infinity : total)) {
    //  // this._handleUserInitiatedChangeStart(newStart); // TODO: dispatch event
    // }

    // TODO: set active attribute here?

    const pages = this.renderRoot.querySelectorAll('sl-button.page');

    console.log('event', event, event.target, event.target instanceof Button, Array.prototype.indexOf.call(pages, event.target) + 1);
    console.log('buttons', this.buttons, pages, Array.prototype.indexOf.call(pages, event.target));

/*    if (event.target instanceof MenuItem) {
      console.log('event target is a menu item', event.target, event.target.innerText.trim());
      this.activePage = Number(event.target.innerText?.trim());
    } else {
      this.activePage = Array.prototype.indexOf.call(pages, event.target) + 1;
    } // TODO: make simpler, only innerText in both cases?*/

    // this.activePage = Number(event.target?.innerText?.trim());

    // this.activePage = Array.prototype.indexOf.call(pages, event.target) + 1;

    this.activePage = Number((event.target as HTMLElement).innerText?.trim());

    console.log('activePage in setActive', this.activePage, Number((event.target as HTMLElement)?.innerText?.trim()));

  //  this.requestUpdate();

    if (this.activePage === this.#pages) {
      console.log('last page is active');
      const total = this.total ?? 0;
      const itemsPerPage = this.itemsPerPage ?? 10;
      this.currentlyVisibleItems = total % itemsPerPage;
    } else {
      this.currentlyVisibleItems = this.itemsPerPage!;
    }

    console.log('this.currentlyVisibleItems in setActive', this.currentlyVisibleItems, this.activePage, this.#pages, this.activePage === this.#pages);

    // TODO: emit page change, emit active page?
    // TODO: emit currently visible items?


    // TODO: update activePage not working with class when the last one is active and then there are less pages than before

    // this.activePage++;
    console.log('click next AFTER', this.activePage);

    this.#onResize();

    // this.requestUpdate();
  }

  // TODO: #updateVisibleItems?

  // TODO: use #renderMenuButton when it's necessary and use append to add it in the shadow DOM after first and before last page when it's necessary

  /*  ${this.options?.map(
    option => html`
                    <sl-checkbox
                      @sl-change=${(event: SlChangeEvent & { target: Checkbox }) => this.#onChange(event, option)}
                      .checked=${this.value?.includes(option.value?.toString() ?? '')}
                      .value=${option.value}
                    >
                      ${option.label}
                    </sl-checkbox>
                  `
)}*/

  // renderHeading(): TemplateResult {
  //   return html`
  //     ${this.collapsible ? html`<sl-icon name="chevron-down"></sl-icon>` : nothing}
  //     <slot name="heading">${this.heading}</slot>
  //   `;
  // }

  #onResize(): void {
    const pagesWrapper = this.renderRoot.querySelector('.pages-wrapper') as HTMLDivElement;
    const container = this.renderRoot.querySelector('.container');
    const buttonPrev = this.renderRoot.querySelector('sl-button.prev') as Button;
    const buttonNext = this.renderRoot.querySelector('sl-button.next') as Button;

    // reset display to check the width
    pagesWrapper.style.display = '';
    buttonPrev.style.display = '';
    buttonNext.style.display = '';

    console.log(
      'on RESIZE - pagesWrapper',
      pagesWrapper,
      pagesWrapper?.clientWidth,
      pagesWrapper?.scrollWidth,
      (pagesWrapper as HTMLDivElement)?.offsetWidth,
      'container',
      container,
      container?.clientWidth,
      container?.scrollWidth,
      (container as HTMLElement)?.offsetWidth
    );

    const pages = this.renderRoot.querySelectorAll<Button>('sl-button.page'); // TODO: should work also for links, not only for buttons

    /**
     * First variant, when 1 is active and not enough space - last one -1 should get ellipsis - or even more
     * Second variant, when last page is active and not enough space, 2nd one should get ellipsis - or even more
     * Third variant, ellipsis on the left and on the right, after 1st and before last page. check how many items are currently visible and when the middle one is active?
     * Maybe use slice to manipulate the visible/hidden arrays?
     *
     * */

    // TODO: check whether all are visible and should, when not enough wpace and 1 selected it should hide few before last one

    // if (pagesWrapper && pagesWrapper.clientWidth < pagesWrapper.scrollWidth) {
    //   console.log('on RESIZE - not enpough space, should show ellipsis', pagesWrapper);
    // }

    // todo: check how many items should be hidden and when? and how many pages in the middle between ellipsis

    let totalPagesWidth = 0;
    let totalAmountOfPagesWidth = 0;

    const lastPage = pages.length;

    let totalWidth = 0;
    let hiddenButtons: Button[] = [];
    let hiddenButtonsLeft: Button[] = [];
    let hiddenButtonsRight: Button[] = [];

    pages.forEach(page => {
      page.style.display = '';
      totalPagesWidth += page.offsetWidth; // + gap;
    });

    const moreButton = /*document*/this.shadowRoot?.createElement('sl-menu-button') as MenuButton;
    console.log('moreButton', moreButton);
    moreButton.fill = 'ghost';
    moreButton.classList.add('more-button');
    // moreButton.innerHTML = `<sl-icon slot="button" name="ellipsis"></sl-icon>
    //         <sl-menu-item>1</sl-menu-item>
    //         <sl-menu-item>2</sl-menu-item>
    //         <sl-menu-item>...</sl-menu-item>`;// 'ellipsis';
    const icon = document.createElement('sl-icon') as Icon;
    icon.slot = 'button';
    icon.name = 'ellipsis';
    moreButton.appendChild(icon);

    const moreButtonLeft = /*document*/this.shadowRoot?.createElement('sl-menu-button') as MenuButton;
    console.log('moreButtonLeft', moreButtonLeft);
    moreButtonLeft.fill = 'ghost';
    moreButtonLeft.classList.add('more-button');
    // moreButton.innerHTML = `<sl-icon slot="button" name="ellipsis"></sl-icon>
    //         <sl-menu-item>1</sl-menu-item>
    //         <sl-menu-item>2</sl-menu-item>
    //         <sl-menu-item>...</sl-menu-item>`;// 'ellipsis';
    const iconLeft = document.createElement('sl-icon') as Icon;
    iconLeft.slot = 'button';
    iconLeft.name = 'ellipsis';
    moreButtonLeft.appendChild(iconLeft);

    const moreButtonRight = /*document*/this.shadowRoot?.createElement('sl-menu-button') as MenuButton;
    console.log('moreButtonRight', moreButtonRight);
    moreButtonRight.fill = 'ghost';
    moreButtonRight.classList.add('more-button');
    // moreButton.innerHTML = `<sl-icon slot="button" name="ellipsis"></sl-icon>
    //         <sl-menu-item>1</sl-menu-item>
    //         <sl-menu-item>2</sl-menu-item>
    //         <sl-menu-item>...</sl-menu-item>`;// 'ellipsis';
    const iconRight = document.createElement('sl-icon') as Icon;
    iconRight.slot = 'button';
    iconRight.name = 'ellipsis';
    moreButtonRight.appendChild(iconRight);

    let menuItems: Node[] = [];
    let menuItemsLeft: Node[] = [];
    let menuItemsRight: Node[] = [];

  //   const menuItem = document.createElement('sl-menu-item') as MenuItem;
  //   menuItem.innerHTML = '1';
  //  // const menuItems3 = hiddenButtons?.forEach(() => { return document.createElement('sl-menu-item') as MenuItem});
  //   const menuItems2 = hiddenButtons.map(
  //     (button) => {
  //       // Temporarily make the button visible
  //       button.style.display = 'block';
  //       const innerHTML = button.innerText;
  //       // Revert the display property back to none
  //       button.style.display = 'none';
  //       return innerHTML;
  //       // return item.className;
  //     }
  //   ) ?? [];
  // //  debugger;
  //   console.log('menuItems', menuItems, hiddenButtons, menuItems2);
    // moreButton.appendChild(menuItem);

    if (container && pages[0]) {
      const itemsPerRow = Math.floor(container?.clientWidth / pages[0].clientWidth);
      console.log('itemsPerRow', itemsPerRow, container?.clientWidth, pages[0].clientWidth);
    }

    // const moreButton = this.renderMenu();

    // TODO: how many pages can be visible (check with buttons ellipsis) - always the same amount

    // TODO: for array slice - starting point and end like 1-10 1 selected, 1 to length -1 slice from selected to length -1?


    console.log('totalPagesWidth', totalPagesWidth, 'lastPage', lastPage, 'moreButton', moreButton, container, this.activePage === lastPage - 1, this.activePage, lastPage - 1, lastPage, this.activePage === lastPage);

    // let totalWidth = 0;
    // let hiddenButtons: Button[] = [];

    // TODO: slice here below on pages:

    console.log('pages slice', Array.from(pages).slice(0, -1)); // or -1 instead of length -1 /*pages.length -1)*/

    let possiblyVisible: Button[] = [];
    let possiblyHidden: Button[] = [];

    (Array.from(pages)).forEach(button => {
      button.style.display = '';
      totalAmountOfPagesWidth += button.offsetWidth;

      if (pagesWrapper && totalAmountOfPagesWidth /*+ this.#menuButtonWidth*/ /*32*/ /*moreButtonWidth*/ > pagesWrapper.clientWidth - (2 * this.#menuButtonWidth) /*32*/ /*moreButtonWidth*/ /*moreButton.offsetWidth - 32*/ /*container && totalWidth > container.clientWidth*/) { // TODO: or pagesWrapper???
        possiblyHidden.push(button);
        console.log('possiblyHidden in if', possiblyHidden, button);
      } else {
        // ...
      } // or maybe 2 x menuButtonWidth ??
    });
    console.log('1possiblyVisible, possiblyHidden', possiblyVisible, possiblyHidden, totalPagesWidth, pagesWrapper?.clientWidth);

    possiblyVisible = Array.from(pages).filter(page => !possiblyHidden.includes(page)); //pages.length - possiblyHidden.length;

    console.log('possiblyVisible, possiblyHidden', possiblyVisible, possiblyHidden, totalPagesWidth, pagesWrapper?.clientWidth);


    // TODO: make responsive variant when possiblyVisible <= 3 ???
    // TODO: variant with select containing [5] of 10 pages

    // this.#mobileVariant ? (possiblyVisible.length <= 3) : false;

    this.#mobileVariant = possiblyVisible.length <= 4;
    if (this.#mobileVariant) {
      // hide pages when there should be mobile variant visible and dimensions are already checked
      pagesWrapper.style.display = 'none';
      buttonPrev.style.display = 'none';
      buttonNext.style.display = 'none';
    }
    this.requestUpdate();

    // TODO: possiblyVisible is not working when we switch from mobile to bigger resolution and at the beginning
    // TODO: requestAnimationFrame is needed?

    console.log('mobileVariant', this.#mobileVariant, possiblyVisible.length, possiblyVisible.length <= 3, pages);


    // (Array.from(pages).slice(0, -1)).forEach(button => {
    //   // Ensure all pages are visible initially
    //   button.style.display = 'inline-block';
    //   totalWidth += button.offsetWidth;
    //
    //   console.log('should hide buttons?', pagesWrapper && totalWidth > pagesWrapper.clientWidth);
    //
    //   if (pagesWrapper && totalWidth > pagesWrapper.clientWidth /*container && totalWidth > container.clientWidth*/) { // TODO: or pagesWrapper???
    //     button.style.display = 'none';
    //     hiddenButtons.push(button);
    //   }
    // });
    //
    const visibleButtons = pages.length - hiddenButtons.length;
    //
    console.log('Visible buttons1:', pages.length - hiddenButtons.length, pages.length, totalWidth);
    console.log(`Hidden buttons1:`, hiddenButtons?.length, hiddenButtons);
    console.log('visibleButtons and activePage - buttons1:', visibleButtons, this.activePage, 'half', Math.ceil(visibleButtons / 2),'activePage bigger than half',  this.activePage > Math.ceil(visibleButtons / 2));

/*    // if activePage bigger than half
    if (this.activePage > Math.ceil(/!*visibleButtons*!/ possiblyVisible.length / 2) && this.activePage !== lastPage) { // TODO change to not only last page applicable but last few pages
      // TODO: hide on the left and on the right
      // items before and items after from 1..active and active ...10
      let pagesToShow: Button[] = [];
      pagesToShow = possiblyVisible.filter((_, index) => index !== 0 && index !== (this.activePage - 1) && index !== (possiblyVisible.length - 1));
      const toShowAmount = Math.floor(pagesToShow.length / 2);

      console.log('pages to show', pagesToShow, Math.floor(pagesToShow.length / 2), this.activePage - 2, pages.length - this.activePage -1);
      console.log('to hide on the left', (this.activePage - 2) - Math.floor(pagesToShow.length / 2), 'to hide on the right', (pages.length - this.activePage -1) - Math.floor(pagesToShow.length / 2));
      console.log('hidden pages on the left and right', '...', Array.from(pages).slice(1, (this.activePage - 2) - Math.floor(pagesToShow.length / 2) + 1),
        'hide on the right', Array.from(pages).slice(this.activePage, this.activePage + ((pages.length - this.activePage -1) - Math.floor(pagesToShow.length / 2))),
        Array.from(pages).slice(this.activePage + (toShowAmount), -1),
        'amount', this.activePage + (toShowAmount));
      console.log('to show on the left and right',Math.floor(pagesToShow.length / 2), toShowAmount, this.activePage - toShowAmount,
        'element to show on the left plus first one, including activePage', Array.from(pages).slice(this.activePage - 1 - toShowAmount, this.activePage),
        'element to show on the right plus first one', Array.from(pages).slice(this.activePage, this.activePage + toShowAmount));
      console.log('to hide on the left', (Array.from(pages).slice(1, this.activePage)), 'possiblyVisible', possiblyVisible.length);
      console.log('to hide on the right', (Array.from(pages).slice((this.activePage + 1), -1)), 'possiblyVisible', possiblyVisible.length);

      // hide on the left
      hiddenButtonsLeft = Array.from(pages).slice(1, (this.activePage - 2) - Math.floor(pagesToShow.length / 2) + 1);//.push(button);
      menuItemsLeft = hiddenButtonsLeft.map(
        (button) => {
          const newItem = /!*document*!/this.shadowRoot?.createElement('sl-menu-item') as MenuItem;
          newItem.innerText = button.innerText.trim();
          newItem.addEventListener('click', (event) => this.#setActive(event));

          //     ?active=${this.activePage == index + 1}
          // @click=${this.#setActive}
          return newItem;
        }
      ) ?? [];
      console.log('menuItemsLeft', hiddenButtonsLeft, menuItemsLeft);
      console.log('menuItemsLeft and moreButton', menuItemsLeft, moreButtonLeft);

      hiddenButtonsLeft.forEach(button => button.style.display = 'none');

      this.renderRoot.querySelector('sl-menu-button.more-button')?.remove();
      pages[0].after(moreButtonLeft);

      // hide on the right
      hiddenButtonsRight = Array.from(pages).slice(this.activePage + (toShowAmount), -1); //Array.from(pages).slice(this.activePage, this.activePage + ((pages.length - this.activePage -1) - Math.floor(pagesToShow.length / 2)));//.push(button);
      menuItemsRight = hiddenButtonsRight.map(
        (button) => {
          const newItem = /!*document*!/this.shadowRoot?.createElement('sl-menu-item') as MenuItem;
          newItem.innerText = button.innerText.trim();
          newItem.addEventListener('click', (event) => this.#setActive(event));

          //     ?active=${this.activePage == index + 1}
          // @click=${this.#setActive}
          return newItem;
        }
      ) ?? [];
      console.log('menuItemsRight', hiddenButtonsRight, menuItemsRight);
      console.log('menuItemsRightand moreButton', menuItemsRight, moreButtonRight);

      hiddenButtonsRight.forEach(button => button.style.display = 'none');

      // this.renderRoot.querySelector('sl-menu-button.more-button')?.remove();
      pages[lastPage - 1].before(moreButtonRight);


      // TODO: make below when activePage is somewhere in the middle --- possiblyVisible.length / 2
      // TODO: first page -> hidden pages on the left (one more button) -> shown pages on the left -> this.activepage -> shown pages on the right -> hidden pages on the right (one more button) -> last page
    }*/

    // TODO: add hidden buttons to sl-menu

/*    // to measure menu button width
    const container2 = this.shadowRoot?.createElement('div');
    let moreButtonWidth = 0;
    if (container2) {
      container2.style.position = 'absolute';
      container2.style.visibility = 'hidden';
      container2.style.width = 'auto';
      // moreButton.style.display = 'block';
      // container2.appendChild(moreButton);
      this.renderRoot.appendChild(container2);

      const moreButton2 = /!*document*!/this.shadowRoot?.createElement('sl-menu-button') as MenuButton;
      moreButton2.fill = 'ghost';
      moreButton2.classList.add('more-button');
      // moreButton.innerHTML = `<sl-icon slot="button" name="ellipsis"></sl-icon>
      //         <sl-menu-item>1</sl-menu-item>
      //         <sl-menu-item>2</sl-menu-item>
      //         <sl-menu-item>...</sl-menu-item>`;// 'ellipsis';
      const icon2 = document.createElement('sl-icon') as Icon;
      icon2.slot = 'button';
      icon2.name = 'ellipsis';
      moreButton2.appendChild(icon2);

      // const element = document.createElement('div');
      // element.style.width = '100px'; // Example style
      container2.appendChild(moreButton2);

      console.log('moreButton width after remove1', moreButton2.offsetWidth, moreButton2, moreButton2.getBoundingClientRect(), container2, (container2.firstChild as HTMLElement)?.offsetWidth, this.renderRoot.querySelector('sl-menu-button')?.getBoundingClientRect(), this.renderRoot.querySelector('sl-menu-button')?.getBoundingClientRect().width);

      moreButton2.style.width = 'auto';
      moreButtonWidth = this.renderRoot.querySelector('sl-menu-button')?.getBoundingClientRect().width ?? 0; //moreButton2.offsetWidth;
      this.renderRoot.removeChild(container2); // Clean up
      console.log('moreButton width after remove', moreButtonWidth, moreButton2, moreButton2.getBoundingClientRect());
    }*/





    if (pagesWrapper && pagesWrapper.clientWidth < pagesWrapper.scrollWidth - this.#menuButtonWidth /*moreButtonWidth*/ /*moreButton.offsetWidth*/ /*container && container.clientWidth < container.scrollWidth*/) {
      console.log('on RESIZE ---- container ----- not enpough space, should show ellipsis', container);

      // if activePage bigger than half
      if (this.activePage > Math.floor(/*visibleButtons*/ possiblyVisible.length / 2) && this.activePage < (lastPage - Math.floor(/*visibleButtons*/ possiblyVisible.length / 2))) { // TODO change to not only last page applicable but last few pages
        console.log('enters first');
        // TODO: hide on the left and on the right
        // items before and items after from 1..active and active ...10
        let pagesToShow: Button[] = [];
        pagesToShow = possiblyVisible.filter((_, index) => index !== 0 && index !== (this.activePage - 1) && index !== (possiblyVisible.length - 1));
        const toShowAmount = Math.floor(pagesToShow.length / 2);

        console.log('pages to show', pagesToShow, Math.floor(pagesToShow.length / 2), this.activePage - 2, pages.length - this.activePage -1);
        console.log('to hide on the left', (this.activePage - 2) - Math.floor(pagesToShow.length / 2), 'to hide on the right', (pages.length - this.activePage -1) - Math.floor(pagesToShow.length / 2));
        console.log('hidden pages on the left and right', '...', Array.from(pages).slice(1, (this.activePage - 2) - Math.floor(pagesToShow.length / 2) + 1),
          'hide on the right', Array.from(pages).slice(this.activePage, this.activePage + ((pages.length - this.activePage -1) - Math.floor(pagesToShow.length / 2))),
          Array.from(pages).slice(this.activePage + (toShowAmount), -1),
          'amount', this.activePage + (toShowAmount));
        console.log('to show on the left and right',Math.floor(pagesToShow.length / 2), toShowAmount, this.activePage - toShowAmount,
          'element to show on the left plus first one, including activePage', Array.from(pages).slice(this.activePage - 1 - toShowAmount, this.activePage),
          'element to show on the right plus first one', Array.from(pages).slice(this.activePage, this.activePage + toShowAmount));
        console.log('to hide on the left', (Array.from(pages).slice(1, this.activePage)), 'possiblyVisible', possiblyVisible.length);
        console.log('to hide on the right', (Array.from(pages).slice((this.activePage + 1), -1)), 'possiblyVisible', possiblyVisible.length);

        // hide on the left
        hiddenButtonsLeft = Array.from(pages).slice(1, (this.activePage - 2) - Math.floor(pagesToShow.length / 2) + 1);//.push(button);
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
        console.log('menuItemsLeft', hiddenButtonsLeft, menuItemsLeft);
        console.log('menuItemsLeft and moreButton', menuItemsLeft, moreButtonLeft);

        // hiddenButtonsLeft.forEach(button => button.style.display = 'none');

        menuItemsLeft.forEach(item => moreButtonLeft.appendChild(item));


        // this.renderRoot.querySelector('sl-menu-button.more-button')?.remove();
        this.renderRoot.querySelectorAll('sl-menu-button.more-button')?.forEach(moreButton => moreButton.remove());
        pages[0].after(moreButtonLeft);

        hiddenButtonsLeft.forEach(button => button.style.display = 'none');

        // hide on the right
        hiddenButtonsRight = Array.from(pages).slice(this.activePage + (toShowAmount - 1), -1); //Array.from(pages).slice(this.activePage, this.activePage + ((pages.length - this.activePage -1) - Math.floor(pagesToShow.length / 2)));//.push(button);
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
      } else if (this.activePage === 1 || this.activePage <= Math.floor(/*visibleButtons*/ possiblyVisible.length / 2)) {
        console.log('enters second');
        (Array.from(pages).slice(0, -1)).forEach(button => {
          // Ensure all pages are visible initially
          button.style.display = '';
          totalWidth += button.offsetWidth;

          console.log('should hide buttons?', pagesWrapper && totalWidth > pagesWrapper.clientWidth, pagesWrapper.clientWidth, pagesWrapper.clientWidth - moreButton.offsetWidth,
            moreButton.offsetWidth, moreButton.clientWidth, moreButton.getBoundingClientRect().width, moreButton);

console.log('last page width', Array.from(pages)[lastPage-1].offsetWidth);

          if (pagesWrapper && totalWidth /*+ this.#menuButtonWidth *//*moreButtonWidth*/ > pagesWrapper.clientWidth - this.#menuButtonWidth - Array.from(pages)[lastPage-1].offsetWidth /*TODO: minus last page width*/ /*moreButtonWidth*/ /*moreButton.offsetWidth - 32*/ /*container && totalWidth > container.clientWidth*/) { // TODO: or pagesWrapper???
            hiddenButtons.push(button);
            menuItems = hiddenButtons.map(
              (button) => {
                const newItem = /*document*/this.shadowRoot?.createElement('sl-menu-item') as MenuItem;
                newItem.innerText = button.innerText.trim();
                newItem.addEventListener('click', (event) => this.#setActive(event));

              //     ?active=${this.activePage == index + 1}
              // @click=${this.#setActive}
                return newItem;
              }
            ) ?? [];
            console.log('menuItems2', hiddenButtons, menuItems);
            console.log('menuItems and moreButton', menuItems, moreButton);

            button.style.display = 'none';
          }
        });

        // moreButton.innerHTML = '';
        const currentMenuItems = this.renderRoot.querySelectorAll('sl-menu-item');
        console.log('menuItems to add', menuItems, currentMenuItems);
       // currentMenuItems.forEach(item => item.remove());
/*        requestAnimationFrame(() => {
          menuItems.forEach(item => moreButton.appendChild(item));
        });*/
        menuItems.forEach(item => moreButton.appendChild(item));

        const visibleButtons = pages.length - hiddenButtons.length;

        console.log('Visible buttons:', pages.length - hiddenButtons.length, pages.length, totalWidth);
        console.log(`Hidden buttons:`, hiddenButtons.length, hiddenButtons);
        console.log('visibleButtons and activePage - buttons:', visibleButtons, this.activePage, 'half', Math.ceil(visibleButtons / 2),'activePage bigger than half',  this.activePage > Math.ceil(visibleButtons / 2));


/*        // const pages = this.renderRoot.querySelectorAll('sl-button.page');
        const toHide = Array.from(pages)?.find(page => {
         // return page.textContent?.trim() === (this.activePage + 1)?.toString();
          return page.textContent?.trim() === (pages.length - 1)?.toString();
         // console.log('page', page, page.textContent?.trim(), page.textContent?.trim() === (this.activePage + 1)?.toString());
        });
        console.log('toHide', toHide);
        (toHide as HTMLElement).style.background = 'yellow';
        if (toHide) {
          this.#hiddenRight.push(toHide);
          // toHide.remove();
          // toHide.append(moreButton);
          // if (!this.renderRoot.querySelector('sl-menu-button.more-button')) {
          this.renderRoot.querySelector('sl-menu-button.more-button')?.remove();
           pages[lastPage - 1].before(moreButton);
           //  moreButton;
          // }
        }*/
        // this.renderRoot.querySelector('sl-menu-button.more-button')?.remove();
        this.renderRoot.querySelectorAll('sl-menu-button.more-button')?.forEach(moreButton => moreButton.remove());
        pages[lastPage - 1].before(moreButton);
      } else /*if (this.activePage === lastPage)*/ {
        console.log('enters third - else');

        (Array.from(pages).reverse().slice(0, -1)).forEach(button => {
          // Ensure all pages are visible initially
          button.style.display = '';
          totalWidth += button.offsetWidth;

          console.log('should hide buttons?', pagesWrapper && totalWidth > pagesWrapper.clientWidth);

          // if (pagesWrapper && totalWidth > pagesWrapper.clientWidth /*container && totalWidth > container.clientWidth*/) { // TODO: or pagesWrapper???
          //   hiddenButtons.push(button);
          //   button.style.display = 'none';
          // }

          if (pagesWrapper && totalWidth /*+ this.#menuButtonWidth*/ /*moreButtonWidth*/ > pagesWrapper.clientWidth - this.#menuButtonWidth - Array.from(pages)[0].offsetWidth /*moreButtonWidth*/ /*moreButton.offsetWidth - 32*/ /*container && totalWidth > container.clientWidth*/) { // TODO: or pagesWrapper???
            hiddenButtons.push(button);
            menuItems = hiddenButtons.map(
              (button) => {
                const newItem = /*document*/this.shadowRoot?.createElement('sl-menu-item') as MenuItem;
                newItem.innerText = button.innerText.trim();
                newItem.addEventListener('click', (event) => this.#setActive(event));

                //     ?active=${this.activePage == index + 1}
                // @click=${this.#setActive}
                return newItem;
              }
            ) ?? [];
            console.log('menuItems2', hiddenButtons, menuItems);
            console.log('menuItems and moreButton', menuItems, moreButton);

            button.style.display = 'none';
          }
        });

        const currentMenuItems = this.renderRoot.querySelectorAll('sl-menu-item');
        console.log('menuItems to add in else if', menuItems, currentMenuItems);
        // currentMenuItems.forEach(item => item.remove());
        /*        requestAnimationFrame(() => {
                  menuItems.forEach(item => moreButton.appendChild(item));
                });*/
        menuItems.reverse().forEach(item => moreButton.appendChild(item));
        console.log('moreButton in else if', moreButton);

        const visibleButtons = pages.length - hiddenButtons.length;

        console.log('Visible buttons:', pages.length - hiddenButtons.length, pages.length, totalWidth);
        console.log(`Hidden buttons:`, hiddenButtons.length, hiddenButtons);
        console.log('visibleButtons and activePage - buttons:', visibleButtons, this.activePage, 'half', Math.ceil(visibleButtons / 2),'activePage bigger than half',  this.activePage > Math.ceil(visibleButtons / 2));


        // this.renderRoot.querySelector('sl-menu-button.more-button')?.remove();
        this.renderRoot.querySelectorAll('sl-menu-button.more-button')?.forEach(moreButton => moreButton.remove());
        pages[0].after(moreButton);

/*        const toHide = Array.from(pages)?.find(page => {
          return page.textContent?.trim() === '2';
          // return page.textContent?.trim() === (pages.length - 1)?.toString();
          // console.log('page', page, page.textContent?.trim(), page.textContent?.trim() === (this.activePage + 1)?.toString());
        });
        (toHide as HTMLElement).style.background = 'yellow';
        if (toHide) {
          this.#hiddenLeft.push(toHide);
          // toHide.remove();
          // toHide.append(moreButton);
          if (!this.renderRoot.querySelector('sl-menu-button.more-button')) {
            // pages[this.activePage + 1].after(moreButton);
            pages[0].after(moreButton);
            //  moreButton;
          }
        }*/
      }
      // TODO: show and hide buttons
      // TODO: count buttons width and compare with difference: container.scrollWidth - container.clientWidth
      // console.log('difference distance::::: container.scrollWidth - container.clientWidth ::::', container.scrollWidth - container.clientWidth);
      console.log('difference distance::::: pagesWrapper.scrollWidth - pagesWrapper.clientWidth ::::', pagesWrapper.scrollWidth - pagesWrapper.clientWidth);
      // TODO: first one and last one should be always visible e.g. <1 ... 4 5 ...8>
    } else {
      pages.forEach(page => (page.style.background = ''));
      this.renderRoot.querySelector('sl-menu-button.more-button')?.remove();
    }
  }

  #onValueChange(event: Event): void {
    console.log('on value change', event, event.target);
  }

  #setValue(event: Event): void {
    console.log('on value change', event, event.target, (event.target as SelectOption).value);
    this.itemsPerPage = (event.target as SelectOption).value as number;

    // always go back to the first page when items per page has changed?
    this.activePage = 1;

    // TODO: if links, links need to be updated as well, so we need more links or less
    // what about activePage with links? the page will rerender... maybe selected or active attribute like in tabs will be fine?
    // TODO: maybe slot for links? and separately prev and nex link?
  }

  renderMenu(): TemplateResult {
    // const parts = ['header', 'filter', ...this.getParts()];

    return html`
      <sl-menu-button fill="ghost" aria-label="TODO...">
            <sl-icon slot="button" name="ellipsis"></sl-icon>
            <sl-menu-item>1</sl-menu-item>
            <sl-menu-item>2</sl-menu-item>
            <sl-menu-item>...</sl-menu-item>
          </sl-menu-button>
    `;
  }

  /** This returns the width of the menu button. */
  async #getMenuButtonWidth(): Promise<number> {
    const moreButton = /*document*/this.shadowRoot?.createElement('sl-menu-button') as MenuButton;
    console.log('moreButton', moreButton);
    moreButton.classList.add('initial');
    moreButton.fill = 'ghost';
    moreButton.classList.add('more-button');
    // moreButton.innerHTML = `<sl-icon slot="button" name="ellipsis"></sl-icon>
    //         <sl-menu-item>1</sl-menu-item>
    //         <sl-menu-item>2</sl-menu-item>
    //         <sl-menu-item>...</sl-menu-item>`;// 'ellipsis';
    const icon = this.shadowRoot?.createElement('sl-icon') as Icon;
    icon.slot = 'button';
    icon.name = 'ellipsis';
    moreButton.appendChild(icon);
    await new Promise(resolve => requestAnimationFrame(resolve));
    this.shadowRoot?.appendChild(moreButton);

    await new Promise(resolve => requestAnimationFrame(resolve));

    const width = moreButton.getBoundingClientRect()?.width;

    await new Promise(resolve => requestAnimationFrame(resolve));

    console.log('maxStackInlineSize moreButton', moreButton, moreButton.getBoundingClientRect(), moreButton.getBoundingClientRect()?.width, moreButton.parentElement);

   this.shadowRoot?.querySelector('sl-menu-button.initial')?.remove();

    await new Promise(resolve => requestAnimationFrame(resolve));

    return width;
  }
}

// TODO: compact version on mobile?

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
 *
 *
 * Do we need PaginatorItem and PaginatorLabel in it?
 *
 * */

// TODO: paginator with links will be made in a later stage
