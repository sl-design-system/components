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
import { classMap } from 'lit/directives/class-map.js';
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
  // TODO: size md and lg?
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

  #hiddenLeft: Element[] = []; // TODO: separated component for pageItem?

  #hiddenRight: Element[] = []; // TODO: separated component for pageItem?

  override connectedCallback(): void {
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
          <sl-button aria-label="Go to the previous page {page}" fill="ghost" size="md" ?disabled=${this.activePage === 1} @click=${this.#onClickPrevButton}
            ><sl-icon name="fas-chevron-right" size="xs"></sl-icon></sl-button
          >
              <div class="pages-wrapper">
                ${Array.from({ length: pages }).map(
                  (_, index) => html`
                <sl-button
                  fill="ghost"
                  size="md"
                  class="page"
                  ?active=${this.activePage == index + 1}
                  @click=${this.#setActive}
                >
                  ${index + 1}
                </sl-button>
              `
                )}
                <sl-menu-button fill="ghost" aria-label="TODO...">
                  <sl-icon slot="button" name="ellipsis"></sl-icon>
                  <sl-menu-item>1</sl-menu-item>
                  <sl-menu-item>2</sl-menu-item>
                  <sl-menu-item>...</sl-menu-item>
                </sl-menu-button>
              </div>
          <slot></slot>
          <sl-button aria-label="Go to the next page {page}" fill="ghost" size="md" ?disabled=${this.activePage === this.#pages} @click=${this.#onClickNextButton}
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

  // TODO: if this.navigation? then links inside instead of buttons

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

    const pages = this.renderRoot.querySelectorAll('sl-button.page');

    console.log('event', event, event.target, event.target instanceof Button);
    console.log('buttons', this.buttons, pages, Array.prototype.indexOf.call(pages, event.target));

    this.activePage = Array.prototype.indexOf.call(pages, event.target) + 1;

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

    // TODO: emit page change
    // TODO: emit currently visible items?


    // TODO: update activePage not working with class when the last one is active and then there are less pages than before

    // this.activePage++;
    console.log('click next AFTER', this.activePage);

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
    const pagesWrapper = this.renderRoot.querySelector('.pages-wrapper');
    const container = this.renderRoot.querySelector('.container');

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

    const lastPage = pages.length;

    let totalWidth = 0;
    let hiddenButtons: Button[] = [];

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

    let menuItems: Node[] = [];

    const menuItem = document.createElement('sl-menu-item') as MenuItem;
    menuItem.innerHTML = '1';
    const menuItems3 = hiddenButtons?.forEach(() => { return document.createElement('sl-menu-item') as MenuItem});
    const menuItems2 = hiddenButtons.map(
      (button) => {
        // Temporarily make the button visible
        button.style.display = 'block';
        const innerHTML = button.innerText;
        // Revert the display property back to none
        button.style.display = 'none';
        return innerHTML;
        // return item.className;
      }
    ) ?? [];
  //  debugger;
    console.log('menuItems', menuItems, hiddenButtons, menuItems2);
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

    // TODO: add hidden buttons to sl-menu


    if (pagesWrapper && pagesWrapper.clientWidth < pagesWrapper.scrollWidth - moreButton.offsetWidth /*container && container.clientWidth < container.scrollWidth*/) {
      console.log('on RESIZE ---- container ----- not enpough space, should show ellipsis', container);
      if (this.activePage === 1 || this.activePage === 2) {

        (Array.from(pages).slice(0, -1)).forEach(button => {
          // Ensure all pages are visible initially
          button.style.display = 'inline-block';
          totalWidth += button.offsetWidth;

          console.log('should hide buttons?', pagesWrapper && totalWidth > pagesWrapper.clientWidth);

          if (pagesWrapper && totalWidth > pagesWrapper.clientWidth - moreButton.offsetWidth /*container && totalWidth > container.clientWidth*/) { // TODO: or pagesWrapper???
            hiddenButtons.push(button);

            const menuItems1 = hiddenButtons?.forEach(() => { return document.createElement('sl-menu-item') as MenuItem});
            const menuItems2 = hiddenButtons.map(
              (button) => {
                // Temporarily make the button visible
                // button.style.display = 'block';
                // const innerHTML = button.innerText;
                // // Revert the display property back to none
                // button.style.display = 'none';
                // return innerHTML;
                // return item.className;
                // const newItem = document.createElement('sl-menu-item') as MenuItem;
                // newItem.innerText = button.innerText.trim();
                return button.innerText.trim();
              }
            ) ?? [];
            menuItems = hiddenButtons.map(
              (button) => {
                // Temporarily make the button visible
                // button.style.display = 'block';
                // const innerHTML = button.innerText;
                // // Revert the display property back to none
                // button.style.display = 'none';
                // return innerHTML;
                // return item.className;
                const newItem = document.createElement('sl-menu-item') as MenuItem;
                newItem.innerText = button.innerText.trim();
                return newItem;
              }
            ) ?? [];
            //  debugger;
            console.log('menuItems2', menuItems1, hiddenButtons, menuItems, menuItems2);
           // moreButton.appendChild(menuItems);
           // menuItems.forEach(item => moreButton.appendChild(item));

           // menuItems.forEach(item => moreButton.appendChild(item));
            console.log('menuItems and moreButton', menuItems, moreButton);

            button.style.display = 'none';
          }
        });

        // moreButton.innerHTML = '';
        menuItems.forEach(item => moreButton.appendChild(item));

        const visibleButtons = pages.length - hiddenButtons.length;

        console.log('Visible buttons:', pages.length - hiddenButtons.length, pages.length, totalWidth);
        console.log(`Hidden buttons:`, hiddenButtons.length, hiddenButtons);
        console.log('visibleButtons and activePage - buttons:', visibleButtons, this.activePage, 'half', Math.ceil(visibleButtons / 2),'activePage bigger than half',  this.activePage > Math.ceil(visibleButtons / 2));


        // const pages = this.renderRoot.querySelectorAll('sl-button.page');
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
          if (!this.renderRoot.querySelector('sl-menu-button.more-button')) {
           pages[lastPage - 1].before(moreButton);
           //  moreButton;
          }
        }
      } else if (this.activePage === lastPage) {


        (Array.from(pages).reverse().slice(0, -1)).forEach(button => {
          // Ensure all pages are visible initially
          button.style.display = 'inline-block';
          totalWidth += button.offsetWidth;

          console.log('should hide buttons?', pagesWrapper && totalWidth > pagesWrapper.clientWidth);

          if (pagesWrapper && totalWidth > pagesWrapper.clientWidth /*container && totalWidth > container.clientWidth*/) { // TODO: or pagesWrapper???
            hiddenButtons.push(button);
            button.style.display = 'none';
          }
        });

        const visibleButtons = pages.length - hiddenButtons.length;

        console.log('Visible buttons:', pages.length - hiddenButtons.length, pages.length, totalWidth);
        console.log(`Hidden buttons:`, hiddenButtons.length, hiddenButtons);
        console.log('visibleButtons and activePage - buttons:', visibleButtons, this.activePage, 'half', Math.ceil(visibleButtons / 2),'activePage bigger than half',  this.activePage > Math.ceil(visibleButtons / 2));


        const toHide = Array.from(pages)?.find(page => {
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
        }
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
