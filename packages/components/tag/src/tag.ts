import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tag.scss.js';
import {EventsController} from "@sl-design-system/shared";

declare global {
  interface HTMLElementTagNameMap {
    'sl-tag': Tag;
  }
}

export type TagSize =  'md' | 'lg' ;
export type SpinnerVariant = 'accent' | 'info' | 'danger' | 'success' | 'warning';
export type TagEmphasis = 'subtle' | 'bold';

/**
 * A tag component containing label.
 *
 * ```html
 * <sl-tag></sl-tag>
 * ```
 *
 * @cssprop --sl-spinner-size - The size of the spinner, defaults to `md` if not set.
 */
export class Tag extends ScopedElementsMixin(LitElement) { // TODO: scoped with sl-icon
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    // focusin: this.#onFocusin,
    // focusout: this.#onFocusout
  });

  /** The size of the tag. Defaults to `md` with css properties if not attribute is not set. */
  @property({ reflect: true }) size?: TagSize = 'md'; // TODO: change description

  /** The spinner variant. */
  @property({ reflect: true }) variant?: SpinnerVariant;

  /** The label of the tag component. */
  @property() label?: string;

  /** Whether the tag component is disabled, when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Whether the tag component is removable. */
  @property({ type: Boolean, reflect: true }) removable?: boolean;

  /** Whether you can interact with the tag or if it is just a static, readonly display. */
  @property({ type: Boolean, reflect: true }) readonly?: boolean;

  /** The emphasis of the tag; defaults to 'subtle'. */
  @property({ reflect: true }) emphasis: TagEmphasis = 'subtle';

  // readonly?

  // removable

  // disabled

  // readonly - content can be copied, but not interacted with or changed?

  // error variant?

  // Users can move through the chips using the arrow keys and select/deselect them with space. Chips also gain focus when clicked, ensuring keyboard navigation starts at the currently focused chip.
// https://material.angular.io/components/chips/overview#keyboard-interactions
// when it's focused it can be removed by delecte keydown


  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('tabindex', '0');
    // TODO: role here? this.role = '...';

    // if (!this.hasAttribute('role')) {
    //   this.setAttribute('role', 'presentation');
    //   this.setAttribute('aria-hidden', 'true');
    // }
  }

  override render(): TemplateResult { // TODO: really that nothing is necessary? Check it :)
    return html`
      <div class="label">
        ${this.label}
      </div>
        ${(this.removable && !this.readonly)
          ? html`<button @mouseover=${this.#onMouseover} @mouseout=${this.#onMouseover} @click=${this.#onRemoveClick} class="remove-button" tabindex="-1"><sl-icon name="xmark" .size=${this.size}></sl-icon></button>`
          : nothing}
    `;
  } // TODO: aria-label for button only or for the whole component?
  // <sl-button fill="ghost"><sl-icon name="xmark"></sl-icon></sl-button>

  // TODO: only tag component needs to be focusable, not close icon

  #onClick(event: Event): void {
    console.log('target', event.target);
    console.log('readonly on click?', this.readonly);
    if (this.disabled || this.readonly) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    console.log('onclick');

    event.preventDefault();
    event.stopPropagation();
    // TODO: remove?
    // this.focus();
    // TOD: maybe selected state?

    // this.checked = !this.checked;
    // this.changeEvent.emit(this.formValue);
  }

  #onRemoveClick(event: Event) {
    if (this.disabled || this.readonly) {
      return;
    }

    console.log('target on btn remove', event, event.target);
    event.preventDefault();
    event.stopPropagation();
    this.remove(); // TODO: event on remove
  } // TODO: on delete r backspace remove as well - on keydown

  /** Since :has is not working with :host - only in Safari, this workaround is needed. */
  #onMouseover(event: MouseEvent) {
    console.log('mouseover event', event);
    if (!(event.target instanceof HTMLButtonElement)) {
      return;
    }

    if (event.type === 'mouseover') {
      this.setAttribute('close-hover', '');
    } else {
      this.removeAttribute('close-hover');
    }

  }

/*  check(el: Element): boolean { // TODO: check if overflows
    let curOverf = el.style.overflow;

    if ( !curOverf || curOverf === "visible" )
      el.style.overflow = "hidden";

    let isOverflowing = el.clientWidth < el.scrollWidth
      || el.clientHeight < el.scrollHeight;

    el.style.overflow = curOverf;

    return isOverflowing;
  }*/

} // TODO: or maybe slot instead of label?
// TODO: close button

// TODO: only close button but maybe also a place for other icons? also in front of the label?
// TODO:  Maybe tag can have an avatar like in Spectrum design system? https://spectrum.adobe.com/page/tag/

// TODO: possible states: https://m2.material.io/components/chips#input-chips


// <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-24 -24 48 48">
// <g class="slow">
// <g class="fast">
// <g transform="translate(-24, -24)">
// <path
//   fill-rule="evenodd"
// d="M24 6C14.059 6 6 14.059 6 24s8.059 18 18 18 18-8.059 18-18S33.941 6 24 6ZM0 24C0 10.745 10.745 0 24 0s24 10.745 24 24-10.745 24-24 24S0 37.255 0 24Z"
// clip-rule="evenodd"
// style="fill:var(--_color);opacity:var(--_shadow-opacity);"
// />
// <path
//   fill-rule="evenodd"
// d="M24 6C14.059 6 6 14.059 6 24a3 3 0 1 1-6 0C0 10.745 10.745 0 24 0s24 10.745 24 24a3 3 0 1 1-6 0c0-9.941-8.059-18-18-18Z"
// clip-rule="evenodd"
// style="fill:var(--_color);"
//   />
//   </g>
//   </g>
//   </g>
//   </svg>



// TODO: accessibility: https://material.angular.io/components/chips/overview#accessibility

// !!!!!!!!! TODO: dependencies !!!!!


// TODO: ellipsis when there is not enough space

// TODO: tooltip when ellipsis applied

// TODO: event on remove

// TODO: event on focus or not?
