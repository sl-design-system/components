import type { TemplateResult } from 'lit-html';
import type { CSSResultGroup } from 'lit';
import { localized } from '@lit/localize';
import { type EventEmitter, breakpoints, event } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './accordion-item.scss.js';

let nextUniqueId = 0;

/**
 * An accordion item component.
 *
 * @slot default - Body content for the accordion
 * @part summary - Header element of the accordion-item
 */

@localized()
export class AccordionItem extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = [breakpoints, styles];

  /**
   * Unique ID for each accordion item component.
   */
  #accordionItemId = `sl-accordion-item-${nextUniqueId++}`;

  /**
   * Unique ID for each accordion item component content.
   */
  #accordionItemContentId = `sl-accordion-item-content-${nextUniqueId++}`;

  /** A text shown in the header - as a title of the accordion item. */
  @property() summary!: string;

  /** Whether the element is disabled. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Emits when the accordion item has been toggled. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<string>;

  // TODO: open attribute - same as in details element?

  /** Whether the details element is opened. */
  @property({ reflect: true, type: Boolean }) open?: boolean;

  /** @private */
  @query('.panel') panel?: HTMLDivElement;

  override render(): TemplateResult {
    return html`
      <details @toggle=${this.onToggle} @click=${this.#onClick} ?open=${this.open}>
        <summary
          id=${this.#accordionItemId}
          aria-controls=${this.#accordionItemContentId}
          aria-disabled=${this.disabled ? 'true' : 'false'}
          aria-expanded=${this.open ? 'true' : 'false'}
          tabindex=${this.disabled ? -1 : 0}
          part="summary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="28"
            viewBox="0 0 24 28"
            fill="none"
            class=${classMap({ opened: !!this.open })}
          >
            <rect class="horizontal-line" x="11.0103" y="6" width="1.97938" height="16" rx="0.824742" fill="#222222" />
            <rect class="vertical-line" x="11.0103" y="6" width="1.97938" height="16" rx="0.824742" fill="#222222" />
          </svg>
          ${this.summary}
        </summary>
        <div class="wrapper">
          <div id=${this.#accordionItemContentId} class="panel" role="region" aria-labelledby=${this.#accordionItemId}>
            <slot></slot>
          </div>
        </div>
      </details>
    `;
  }

  // <div class="panel" @animationend=${this.#closeOnAnimationend}>

  onToggle(event: ToggleEvent): void {
    console.log('event on toglle', event, event.target, this.hasAttribute('disabled'));

    this.open = event.newState === 'open';

    // TODO: this.open change on toggle
    // TODO: emit sl-toggle when toggle because it does not bubble
    this.toggleEvent.emit(event.newState);
  }

  #closeOnAnimationend(event: AnimationEvent): void {
    console.log(
      'event closeOnAnimationend',
      event.animationName,
      event,
      this.open,
      this.renderRoot,
      this.renderRoot.querySelector('details'),
      this.renderRoot.querySelector('details')?.hasAttribute('open')
    );
    // // if (event.animationName !== 'slide-in-up') {
    // // this.panel?.removeAttribute('open');
    // if (
    //   /*this.open*/ this.renderRoot.querySelector('details')?.hasAttribute('open') &&
    //   event.animationName === 'animate-panel-2'
    // ) {
    //   // this.panel?.classList.add('collapsing');
    //   this.panel?.classList.remove('animation');
    //   this.panel?.addEventListener(
    //     'animationend',
    //     () => {
    //       // this.remove();
    //       // this.panel?.removeAttribute('open');
    //       this.renderRoot.querySelector('details')?.removeAttribute('open');
    //       // this.panel?.classList.remove('collapsing');
    //       // // this.panel?.classList.remove('animation');
    //     },
    //     { once: true }
    //   );
    //
    //   requestAnimationFrame(() => {
    //     // this.panel?.setAttribute('close', '');
    //     // this.panel?.classList.add('collapsing');
    //     this.panel?.classList.add('collapsing');
    //     // this.panel?.classList.remove('collapsing');
    //     // this.panel?.classList.remove('animation');
    //   });
    // }
  }

  #onClick(event: Event & { target: HTMLElement }): void {
    if (this.disabled || event.defaultPrevented) {
      // No toggling when `disabled` or the user prevents it.
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const detailsElement = event.target.parentElement;
    // const contentElement = event.target.nextElementSibling?.querySelector('.panel'); //event.target.nextElementSibling;
    const contentElement = event.target.nextElementSibling;

    console.log(
      'event on click detailsElement, contentElement',
      detailsElement,
      contentElement,
      event,
      event.target.nextElementSibling?.querySelector('.panel'),
      this.hasAttribute('disabled')
    );

    if (!detailsElement || !contentElement) {
      return;
    }
    // TODO: emit event on click or on toggle better?

    // Chrome sometimes has a hiccup and gets stuck.
    /*    if (contentElement.classList.contains('animation')) {
      // So we make sure to remove those classes manually,
      contentElement.classList.remove('animation', 'collapsing');
      // ... enforce a reflow so that collapsing may be animated again,
      // void element.offsetWidth;
      void this.offsetWidth;
      // ... and fallback to the default behaviour this time.
      return;
    }*/
    // const onAnimationEnd = (cb): void => contentElement?.addEventListener('animationend', cb, { once: true });

    const onAnimationEnd = (cb: () => void): void => {
      contentElement.addEventListener('animationend', cb, { once: true });
    };

    requestAnimationFrame(() => contentElement.classList.add('opening'));
    onAnimationEnd(() => contentElement.classList.remove('opening'));

    const isDetailsOpen = detailsElement.getAttribute('open') !== null;
    console.log('isDetailsOpen in onClick', isDetailsOpen);
    if (isDetailsOpen) {
      // prevent default collapsing and delay it until the animation has completed
      event.preventDefault();
      contentElement.classList.add('closing');
      onAnimationEnd(() => {
        detailsElement?.removeAttribute('open');
        contentElement.classList.remove('closing');
      });
    }
  }

  // #onClose(): void {
  //   // Reenable scrolling after the dialog has closed
  //   document.documentElement.style.overflow = '';
  //
  //   this.inert = true;
  //   this.closeEvent.emit();
  // }
  //
  // #onCloseClick(event: PointerEvent & { target: HTMLElement }): void {
  //   event.preventDefault();
  //   event.stopPropagation();
  //
  //   this.#closeDialogOnAnimationend(event.target as HTMLElement);
  // }

  // #closeDialogOnAnimationend(target?: HTMLElement, emitCancelEvent = false): void {
  //   this.dialog?.addEventListener(
  //     'animationend',
  //     () => {
  //       this.dialog?.removeAttribute('closing');
  //
  //       if (emitCancelEvent) {
  //         this.cancelEvent.emit();
  //       }
  //
  //       if (target?.matches('sl-button[sl-dialog-close]')) {
  //         this.dialog?.close(target?.getAttribute('sl-dialog-close') || '');
  //       } else {
  //         this.dialog?.close();
  //       }
  //     },
  //     { once: true }
  //   );
  //
  //   /**
  //    * Set the closing attribute, this triggers the closing animation.
  //    *
  //    * FIXME: We can replace this using `@starting-style` once this is available in all
  //    * browsers. See https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
  //    */
  //   requestAnimationFrame(() => this.dialog?.setAttribute('closing', ''));
  // }
}
