import { localized } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Select, SelectOption } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './paginator.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-paginator': Paginator;
  }
}

/**
 * A container that can be collapsed and expanded.
 *
 * @csspart header - The header of the panel.
 * @csspart wrapper - The wrapper around the heading.
 * @csspart body - The body of the panel.
 * @csspart inner - The inner container of the panel.
 * @csspart content - The content container of the panel.
 *
 * @slot heading - The panel's heading. Use this is the `heading` property does not suffice.
 * @slot aside - Additional content to show in the header; replaces the button bar.
 * @slot actions - The panel's actions; will slot in a button bar by default.
 * @slot default - The panel's content.
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

  // data - how to connect with data?

  /** Total items */
  @property() total?: number;

  // TODO showTotal as property?

  /** Items per page */
  @property({ type: Number, attribute: 'items-per-page' }) itemsPerPage? = 10; // or number[] ???

  /** Total items */
  @property({ type: Number, attribute: 'current-page' }) currentPage?: number = 1; // 1 by default? // or maybe activePage should be enough?

  /** @internal pages amount */ // TODO: state maybe?
  #pages: number = 1;

  /** @internal active */ // TODO: state maybe?
  @state() activePage: number = 1;

  /** @internal */
  @state() buttons: Button[] = []; // TODO: remove it?

  override connectedCallback(): void {
    super.connectedCallback();

    // if (!this.hasAttribute('tabindex')) {
    //   this.setAttribute('tabindex', '0');
    // }

    const total = this.total ?? 0;
    const itemsPerPage = this.itemsPerPage ?? 10;
    this.#pages = Math.ceil(total / itemsPerPage) || 2;

    console.log('pages in connectedCallback', this.#pages);
  }

  // TODO: updated when total or itemsperpage has changed

  override render(): TemplateResult {
    const total = this.total ?? 0;
    const itemsPerPage = this.itemsPerPage ?? 10;
    const pages = Math.ceil(total / itemsPerPage) || 2;

    return html`
      <div>
        <sl-button fill="ghost" size="md" ?disabled=${this.activePage === 1} @click=${this.#onClickPrevButton}
          >&lt; Previous</sl-button
        >
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
        <sl-button fill="ghost" size="md" ?disabled=${this.activePage === this.#pages} @click=${this.#onClickNextButton}
          >Next &gt;</sl-button
        >
        <div>Total elements: 100 ${this.total}</div>
        <div>Items per page: ${this.itemsPerPage}</div>
        ${this.total && this.itemsPerPage
          ? html`
              <div>Pages: ${Math.ceil(this.total / this.itemsPerPage)}</div>
              <div>Items left: ${this.total % this.itemsPerPage}</div>
            `
          : nothing}
      </div>
      <div>Active page: ${this.activePage}</div>
      Items per page:
      <sl-select value="3" style="inline-size: 60px;">
        <sl-select-option value="1">5</sl-select-option>
        <sl-select-option value="2">10</sl-select-option>
        <sl-select-option value="3">15</sl-select-option>
      </sl-select>
    `;
  } // <slot></slot>

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

    // this.requestUpdate();
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

    // TODO: emit page change

    // this.activePage++;
    console.log('click next AFTER', this.activePage);

    // this.requestUpdate();
  }

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
}
