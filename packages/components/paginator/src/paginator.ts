import { faChevronLeft, faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { localized } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Select, SelectOption } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
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
 * A container that can be collapsed and expanded.
 *
 * @csspart header - The header of the panel.
 * @csspart wrapper - The wrapper around the heading.
 * @csspart body - The body of the panel.
 * @csspart inner - The inner container of the panel.
 * @csspart content - The content container of the panel.
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
      'sl-select': Select,
      'sl-select-option': SelectOption
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * Observe changes in size, so we can check whether we need to show tooltips
   * for truncated links.
   */
  #observer = new ResizeObserver(() => this.#onResize());

  /** Indicates whether the panel is collapsed or expanded . */
  @property({ type: Boolean, reflect: true }) collapsed?: boolean;

  /** Indicates whether the panel can be collapsed. */
  @property({ type: Boolean, reflect: true }) collapsible?: boolean;

  /**
   * The heading shown in the header. Use this property if your heading is a string. If you need
   * more flexibility, such as an icon or other elements, use the `heading` slot.
   */
  @property() heading?: string;

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
  @property() navigation?: boolean; // TODO: links? array with links?

  /** should be used together with `navigation` property. The array should have the same width as itemsPerPage and should have the right order ???? */
  @property() links?: string[] = []; // or maybe a function used to rendering urls?

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
    // debugger;
    console.log('start and end', start, end, this.renderRoot.querySelector<Select>('sl-select')?.value as number, itemsPerPage);
    console.log('links', this.links, this.links?.length);

    return html`
      ${start} - ${end} of ${this.total} items
      <nav class="container">
        <ul>
          next and previous should be wrapped by 'li' as well
          <sl-button fill="ghost" size="md" ?disabled=${this.activePage === 1} @click=${this.#onClickPrevButton}
            ><sl-icon name="fas-chevron-right" size="xs"></sl-icon> Previous</sl-button
          >
          ${Array.isArray(this.links) && this.links.length > 0
            ? this.links.map(( url, index, array) => html`
                  <li>
                    <a aria-current=${ifDefined(index === array.length - 1 ? 'page' : undefined)}
                       class=${classMap({ page: true, active: this.activePage == index + 1 })}
                       href=${url}>
                      ${index + 1}
                    </a>
                  </li>
                `)
            : html`
              <div class="pages-wrapper">
                ${Array.from({ length: pages }).map(
                  (_, index) => html`
                <sl-button
                  fill="ghost"
                  size="md"
                  class=${classMap({ page: true, active: this.activePage == index + 1 })}
                  @click=${this.#setActive}
                >
                  ${index + 1}
                </sl-button>
              `
                )}
              </div>
            `}
          <sl-button fill="ghost" size="md" ?disabled=${this.activePage === this.#pages} @click=${this.#onClickNextButton}
            >Next <sl-icon name="fas-chevron-left" size="xs"></sl-icon
          ></sl-button>
        </ul>
      </nav>
      <div class="details">
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

  // /**
  //  * Toggle's the collapsed state of the panel. This only does something if the panel is collapsible.
  //  * @param force - Whether to force the panel to be collapsed or expanded.
  //  */
  // toggle(force = !this.collapsed): void {
  //   this.collapsed = force;
  //   this.toggleEvent.emit(this.collapsed);
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

    // if (pagesWrapper && pagesWrapper.clientWidth < pagesWrapper.scrollWidth) {
    //   console.log('on RESIZE - not enpough space, should show ellipsis', pagesWrapper);
    // }

    if (container && container.clientWidth < container.scrollWidth) {
      console.log('on RESIZE ---- container ----- not enpough space, should show ellipsis', container);
      if (this.activePage === 1) {
        const pages = this.renderRoot.querySelectorAll('sl-button.page');
        const toHide = Array.from(pages)?.find(page => {
         return page.textContent?.trim() === (this.activePage + 1)?.toString();
         // console.log('page', page, page.textContent?.trim(), page.textContent?.trim() === (this.activePage + 1)?.toString());
        });
        console.log('toHide', toHide);
        (toHide as HTMLElement).style.background = 'yellow';
      }
      // TODO: show and hide buttons
      // TODO: count buttons width and compare with difference: container.scrollWidth - container.clientWidth
      console.log('difference distance::::: container.scrollWidth - container.clientWidth ::::', container.scrollWidth - container.clientWidth);
      // TODO: first one and last one should be always visible e.g. <1 ... 4 5 ...8>
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
  }
}

// TODO: compct version on mobile?

// TODO: visible amount out of (total) 1-15 of 50

// TODO: nav -> ul -> li -> a href? or button - depending whether it is a navigation or not?

// TODO: what to do when we have less pages than in the select selected? so always show all when there are less when the smaller value in select?
// TODO: how to set active link? maybe parameter?
