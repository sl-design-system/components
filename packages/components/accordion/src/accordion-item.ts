// TODO: accordion item component
import type { TemplateResult } from 'lit-html';
import type { CSSResultGroup } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { localized } from '@lit/localize';
import { Button } from '@sl-design-system/button';
import { type EventEmitter, breakpoints, event } from '@sl-design-system/shared';
// import { EventsController } from '@sl-design-system/shared';
// import { faMinus, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { LitElement, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import styles from './accordion-item.scss.js';

// Icon.register(faMinus, faPlus); // TODO: use tokens instead

/**
 * An accordion item component.
 *
 * @slot default - ...
 * @part summary - ...
 */

@localized()
export class AccordionItem extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button
      // 'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = [breakpoints, styles];

  // /** Event controller. */
  // #events = new EventsController(this, {
  //   toggle: this.#onToggle
  //   // click: this.#onClick,
  //   // keydown: this.#onKeydown
  // });

  // /** @private */
  // @query('dialog') dialog?: HTMLDialogElement;

  // /**
  //  * Emits when the cancel has been cancelled. This happens when the user closes
  //  * the dialog using the escape key or clicks on the backdrop.
  //  */
  // @event({ name: 'sl-cancel' }) cancelEvent!: EventEmitter<void>;
  //
  // /** Emits when the dialog has been closed. */
  // @event({ name: 'sl-close' }) closeEvent!: EventEmitter<void>;

  /** The ARIA role of the dialog. */
  @property() override role: 'dialog' | 'alertdialog' = 'dialog';

  @property() summary!: string; // TODO: only text in the summary? if not add a slot for summary and then this text inside

  /** Emits when the accordion item has been toggled. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<string>;

  // TODO: add aria-expanded?, role button needed as well?

  // TODO: open attribute - same as in details element?

  /** Open... */
  @property({ reflect: true, type: Boolean }) open?: boolean;

  /** @private */
  @query('.panel') panel?: HTMLDivElement;

  // /** Whether only one accordion item can be opened at once. By default multiple accordion items can be opened. */
  // @property({ type: Boolean, reflect: true }) single?: boolean;

  override connectedCallback(): void {
    super.connectedCallback();
  }

  // TODO: add disabled to details
  // ?disabled=${this.hasAttribute('disabled')}

  override render(): TemplateResult {
    return html`
      <details @toggle=${this.onToggle} @click=${this.#onClick} ?open=${this.open}>
        <summary tabindex=${this.hasAttribute('disabled') ? -1 : 0} part="summary">
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
          <div class="panel" @animationend=${this.#closeOnAnimationend}>
            <slot @slotchange=${this.#onSlotChange}></slot>
          </div>
        </div>
      </details>
    `;
  } // details - open
  // class=${classMap({ collapsing: !this.open, panel: true })}

  // TODO: additional div wrapper for the animation?

  //   ${this.open
  //             ? html` <sl-icon name="fas-minus" class="opened"></sl-icon> `
  //             : html` <sl-icon name="fas-plus"></sl-icon> `}
  // <sl-icon name="xmark"></sl-icon>

  /*<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 147 172"
  width="24px"
  height="28px"
  class=${classMap({ opened: !!this.open })}
>
<rect class="horizontal-line" width="12.116" height="97.939" x="67.442" y="37.0305" rx="5.048" />
<rect class="vertical-line" width="12.116" height="97.939" x="67.442" y="37.0305" rx="5.048" />
  </svg>*/

  // <sl-icon name="fas-plus"></sl-icon>
  //     <sl-icon name="fas-minus"></sl-icon>

  /*<span class="icons">
  <svg
    xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="28"
  viewBox="0 0 24 28"
  fill="none"
  class=${classMap({ opened: !!this.open })}
>
<rect
  class="horizontal-line"
x="11.0103"
y="6"
width="1.97938"
height="16"
rx="0.824742"
fill="#222222"
/>
<rect class="vertical-line" x="11.0103" y="6" width="1.97938" height="16" rx="0.824742" fill="#222222" />
  </svg>
  </span>*/

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const assignedNodes = event.target.assignedNodes({ flatten: true });
    console.log(assignedNodes);
    // this.#setIconProperties(assignedNodes);
  }

  onToggle(event: ToggleEvent): void {
    console.log('event on toglle', event, event.target, this.hasAttribute('disabled'));

    this.open = event.newState === 'open';

    // TODO: this.open change on toggle
    // this.requestUpdate();
    // if (this.hasAttribute('disabled')) {
    //   event.preventDefault();
    //   event.stopPropagation();
    //   return;
    // }
    // this.toggleEvent.emit(event.newState);
    // if (this.hasAttribute('disabled')) {
    //   event.preventDefault();
    //   event.stopPropagation();
    // } else if (this.type === 'reset') {
    //   this.internals.form?.reset();
    // } else if (this.type === 'submit') {
    //   this.internals.form?.requestSubmit();
    // }

    /*    const detailsElement = event.target as HTMLElement; //(event.target as HTMLElement)?.parentElement as HTMLElement;
    // const contentElement = event.target.nextElementSibling?.querySelector('.panel'); //event.target.nextElementSibling;
    const contentElement = (event.target as HTMLElement)?.querySelector('.wrapper'); //(event.target as HTMLElement)?.nextElementSibling as HTMLElement;

    console.log(
      'event on lick - toggggle detailsElement, contentElement',
      event.target as HTMLElement,
      (event.target as HTMLElement)?.querySelector('.wrapper'),
      detailsElement,
      contentElement,
      event,
      (event.target as HTMLElement)?.nextElementSibling?.querySelector('.panel')
    );

    if (!detailsElement || !contentElement) {
      return;
    }

    // Chrome sometimes has a hiccup and gets stuck.
    if (contentElement.classList.contains('animation')) {
      // So we make sure to remove those classes manually,
      contentElement.classList.remove('animation', 'collapsing');
      // ... enforce a reflow so that collapsing may be animated again,
      // void element.offsetWidth;
      void this.offsetWidth;
      // ... and fallback to the default behaviour this time.
      return;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unsafe-argument
    // const onAnimationEnd = (cb): void => contentElement?.addEventListener('animationend', cb, { once: true });

    const onAnimationEnd = (cb: () => void): void => {
      contentElement.addEventListener('animationend', cb, { once: true });
    };

    // request an animation frame to force Safari 16 to actually perform the animation
    requestAnimationFrame(() => contentElement.classList.add('animation'));
    onAnimationEnd(() => contentElement.classList.remove('animation'));

    const isDetailsOpen = detailsElement.getAttribute('open') !== null;
    console.log('isDetailsOpen in onClick', isDetailsOpen);
    if (isDetailsOpen) {
      // prevent default collapsing and delay it until the animation has completed
      event.preventDefault();
      contentElement.classList.add('collapsing');
      onAnimationEnd(() => {
        detailsElement?.removeAttribute('open');
        contentElement.classList.remove('collapsing');
      });
    }*/
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
    // if (event.animationName !== 'slide-in-up') {
    // this.panel?.removeAttribute('open');
    if (
      /*this.open*/ this.renderRoot.querySelector('details')?.hasAttribute('open') &&
      event.animationName === 'animate-panel-2'
    ) {
      // this.panel?.classList.add('collapsing');
      this.panel?.classList.remove('animation');
      this.panel?.addEventListener(
        'animationend',
        () => {
          // this.remove();
          // this.panel?.removeAttribute('open');
          this.renderRoot.querySelector('details')?.removeAttribute('open');
          // this.panel?.classList.remove('collapsing');
          // // this.panel?.classList.remove('animation');
        },
        { once: true }
      );

      requestAnimationFrame(() => {
        // this.panel?.setAttribute('close', '');
        // this.panel?.classList.add('collapsing');
        this.panel?.classList.add('collapsing');
        // this.panel?.classList.remove('collapsing');
        // this.panel?.classList.remove('animation');
      });
    }
  }

  // #onCancel(event: Event & { target: HTMLElement }): void {
  //   event.preventDefault();
  //
  //   if (!this.disableCancel) {
  //     this.#closeDialogOnAnimationend(event.target, true);
  //   }
  // }

  #onClick(event: Event & { target: HTMLElement }): void {
    if (this.hasAttribute('disabled')) {
      event.preventDefault();
      event.stopPropagation();
      // return;
    }

    const detailsElement = event.target.parentElement;
    // const contentElement = event.target.nextElementSibling?.querySelector('.panel'); //event.target.nextElementSibling;
    const contentElement = event.target.nextElementSibling;

    console.log(
      'event on click detailsElement, contentElement',
      detailsElement,
      contentElement,
      event,
      event.target.nextElementSibling?.querySelector('.panel')
    );

    if (!detailsElement || !contentElement) {
      return;
    }

    // Chrome sometimes has a hiccup and gets stuck.
    if (contentElement.classList.contains('animation')) {
      // So we make sure to remove those classes manually,
      contentElement.classList.remove('animation', 'collapsing');
      // ... enforce a reflow so that collapsing may be animated again,
      // void element.offsetWidth;
      void this.offsetWidth;
      // ... and fallback to the default behaviour this time.
      return;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unsafe-argument
    // const onAnimationEnd = (cb): void => contentElement?.addEventListener('animationend', cb, { once: true });

    const onAnimationEnd = (cb: () => void): void => {
      contentElement.addEventListener('animationend', cb, { once: true });
    };

    // request an animation frame to force Safari 16 to actually perform the animation
    requestAnimationFrame(() => contentElement.classList.add('animation'));
    onAnimationEnd(() => contentElement.classList.remove('animation'));

    const isDetailsOpen = detailsElement.getAttribute('open') !== null;
    console.log('isDetailsOpen in onClick', isDetailsOpen);
    if (isDetailsOpen) {
      // prevent default collapsing and delay it until the animation has completed
      event.preventDefault();
      contentElement.classList.add('collapsing');
      onAnimationEnd(() => {
        detailsElement?.removeAttribute('open');
        contentElement.classList.remove('collapsing');
      });
    }

    // const rect = this.dialog!.getBoundingClientRect();
    //
    // // Check if the user clicked on the sl-dialog-close button or on the backdrop
    // if (
    //   event.target.matches('sl-button[sl-dialog-close]') ||
    //   (!this.disableCancel &&
    //     (event.clientY < rect.top ||
    //       event.clientY > rect.bottom ||
    //       event.clientX < rect.left ||
    //       event.clientX > rect.right))
    // ) {
    //   this.#closeDialogOnAnimationend(event.target, true);
    // }
    //
    // const { duration, easing } = this.#animationOptions;
    // const wrapper = event.target.nextElementSibling as HTMLElement;
    // const duration = '300ms';
    // const easing = 'cubic-bezier(0.7, -0.4, 0.4, 1.4)';
    // const animated = true;
    //
    // // The wrapper is hidden when collapsed to prevent the user
    // // from TABing into the card, so unhide it.
    // wrapper.style.display = 'block';

    // // Animate the header arrow rotating.
    // this.icon.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(90deg)' }], {
    //   direction: this.open ? 'normal' : 'reverse',
    //   duration: animated ? duration : 0,
    //   easing,
    //   fill: 'both'
    // });

    // const { height = 0 } = (contentElement as HTMLElement).getBoundingClientRect(); //this.body.getBoundingClientRect();
    //
    // const animation = wrapper.animate(
    //   [
    //     { height: `${height}px`, overflow: 'visible', opacity: '1' },
    //     { height: '0', overflow: 'hidden', opacity: '0' }
    //   ],
    //   {
    //     direction: this.open ? 'reverse' : 'normal',
    //     duration: animated ? duration : 0,
    //     easing,
    //     fill: 'none'
    //   }
    // );
    //
    // await animation.finished;
    //
    // wrapper.style.display = this.open ? 'block' : 'none';
    // wrapper.style.height = this.open ? 'auto' : '0px';
    // wrapper.style.overflow = this.open ? 'visible' : 'hidden';
  }

  // async #onAnimate(): Promise<void> {
  //   const wrapper = event.target.nextElementSibling as HTMLElement;
  //   const duration = '300ms';
  //   const easing = 'cubic-bezier(0.7, -0.4, 0.4, 1.4)';
  //   const animated = true;
  //
  //   // The wrapper is hidden when collapsed to prevent the user
  //   // from TABing into the card, so unhide it.
  //   wrapper.style.display = 'block';
  //
  //   // // Animate the header arrow rotating.
  //   // this.icon.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(90deg)' }], {
  //   //   direction: this.open ? 'normal' : 'reverse',
  //   //   duration: animated ? duration : 0,
  //   //   easing,
  //   //   fill: 'both'
  //   // });
  //
  //   const { height = 0 } = (contentElement as HTMLElement).getBoundingClientRect(); //this.body.getBoundingClientRect();
  //
  //   const animation = wrapper.animate(
  //     [
  //       { height: `${height}px`, overflow: 'visible', opacity: '1' },
  //       { height: '0', overflow: 'hidden', opacity: '0' }
  //     ],
  //     {
  //       direction: this.open ? 'reverse' : 'normal',
  //       duration: animated ? duration : 0,
  //       easing,
  //       fill: 'none'
  //     }
  //   );
  //
  //   await animation.finished;
  //
  //   wrapper.style.display = this.open ? 'block' : 'none';
  //   wrapper.style.height = this.open ? 'auto' : '0px';
  //   wrapper.style.overflow = this.open ? 'visible' : 'hidden';
  // }

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
