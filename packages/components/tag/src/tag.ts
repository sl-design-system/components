import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { Tooltip } from '@sl-design-system/tooltip';
import { type CSSResultGroup, LitElement,type PropertyValues,  type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './tag.scss.js';
import {EventsController} from "@sl-design-system/shared";

declare global {
  interface HTMLElementTagNameMap {
    'sl-tag': Tag;
  }
}

export type TagSize =  'md' | 'lg' ;
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
      'sl-icon': Icon,
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, {
    click: this.#onClick,
    keydown: this.#onKeydown
    // focusin: this.#onFocusin,
    // focusout: this.#onFocusout
  });

  /** The size of the tag. Defaults to `md` with css properties if not attribute is not set. */
  @property({ reflect: true }) size?: TagSize = 'md'; // TODO: change description

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

  #overflow = false;

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
   // this.#check(this/*labelEl*/);

    return html`
      <div class="label" aria-describedby="tooltip-label">
        ${this.label}
          ${this.#overflow
      ? html`<sl-tooltip id="tooltip-label" position="top">
            ${this.label}
          </sl-tooltip>`
      : nothing}
      </div>
        ${(this.removable && !this.readonly)
          ? html`<button @mouseover=${this.#onMouseover} @mouseout=${this.#onMouseover} @click=${this.#onRemoveClick} class="remove-button" tabindex="-1"><sl-icon name="xmark" .size=${this.size}></sl-icon></button>`
          : nothing}
    `;
  } // TODO: aria-label for button only or for the whole component?
  // <sl-button fill="ghost"><sl-icon name="xmark"></sl-icon></sl-button>

  // TODO: only tag component needs to be focusable, not close icon

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    // todo removable in changes?

    // const labelEl = this.renderRoot.querySelector('.label');

   this.#check(this/*labelEl*/);
    this.requestUpdate();

    console.log('changes in first updated', changes, /*this.#check(this),*/ /*labelEl,*/ this.renderRoot);
  }

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

  #onRemoveClick(event: Event): void {
    if (this.disabled || this.readonly) {
      return;
    }

    console.log('target on btn remove', event, event.target);
    event.preventDefault();
    event.stopPropagation();
    this.remove(); // TODO: event on remove
  } // TODO: on delete r backspace remove as well - on keydown

  /** Since :has is not working with :host - only in Safari, this workaround is needed. */
  #onMouseover(event: MouseEvent): void {
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

  #onKeydown(event: KeyboardEvent): void {
    if (['Delete', 'Backspace'].includes(event.key) && this.removable) {
      this.#onRemoveClick(event);
    }
  }

  #check(el: HTMLElement): void /*boolean*/ { // TODO: check if overflows
    const labelEl = this.renderRoot.querySelector('.label') as HTMLElement;

    if (!el || !labelEl) {
      return;
    }

   // let curOverf = el.style.overflow;

  //  console.log('curOverf', curOverf, el.style);

    // if ( !curOverf || curOverf === "auto" )
    //   el.style.overflow = "hidden";

    let isOverflowing = el.clientWidth < el.scrollWidth;

    console.log('el.clientWidth < el.scrollWidth',el,  el.clientWidth < el.scrollWidth, el.clientWidth, el.scrollWidth, el.getBoundingClientRect(), isOverflowing);
    console.log('el.clientWidth < el.scrollWidth with thiiis',this,  this.clientWidth < this.scrollWidth, this.clientWidth, this.scrollWidth, this.getBoundingClientRect());

    //if ( !curOverf || curOverf === "auto" )
    if (isOverflowing) {
      // el.style.overflow = "hidden";
      labelEl.style.overflow = "hidden";
      this.#overflow = isOverflowing;
    }

   // el.style.overflow = curOverf;

    // return isOverflowing;
  }

} // TODO: or maybe slot instead of label? for now not, only text for now
// TODO: close button

// TODO: only close button but maybe also a place for other icons? also in front of the label?
// TODO:  Maybe tag can have an avatar like in Spectrum design system? https://spectrum.adobe.com/page/tag/

// TODO: possible states: https://m2.material.io/components/chips#input-chips

// TODO: accessibility: https://material.angular.io/components/chips/overview#accessibility

// !!!!!!!!! TODO: dependencies !!!!!


// TODO: ellipsis when there is not enough space

// TODO: tooltip when ellipsis applied

// TODO: event on remove

// TODO: event on focus or not?
