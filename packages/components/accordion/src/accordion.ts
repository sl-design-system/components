import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
// import type { AccordionItem } from './accordion-item.js';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './accordion.scss.js';
import { AccordionItem } from './accordion-item.js';

/**
 * An accordion component....
 *
 * ```html
 *   <sl-accordionn>...</sl-accordion>
 * ```
 *
 * @slot default - Text label of the button. Optionally an <code>sl-icon</code> can be added
 */
export class Accordion extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-accordion-item': AccordionItem
    };
  }

  /** @private */
  static formAssociated = true;

  /** @private */
  static override styles: CSSResultGroup = styles;

  // /** Event controller. */
  // #events = new EventsController(this, {
  //   toggle: this.#onToggle
  //   // click: this.#onClick,
  //   // keydown: this.#onKeydown
  // });

  /** The original tabIndex before disabled. */
  private originalTabIndex = 0;

  /** Whether the button is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean; // will we need disabled element here?

  // /**
  //  * The fill of the button.
  //  */
  // @property({ reflect: true }) fill: ButtonFill = 'solid';
  //
  // /**
  //  * The size of the button.
  //  */
  // @property({ reflect: true }) size: ButtonSize = 'md';

  // /**
  //  * The type of the button. Can be used to mimic the functionality of submit and reset buttons in native HTML buttons.
  //  */
  // @property() type: ButtonType = 'button';

  // /**
  //  * The variant of the button.
  //  */
  // @property({ reflect: true }) variant: ButtonVariant = 'default';

  // @property() summary!: string; // TODO: only text in the summary? if not add a slot for summary and then this text inside

  /** Whether only one accordion item can be opened at once. By default, multiple accordion items can be opened. */
  @property({ type: Boolean, reflect: true }) single?: boolean;

  // TODO: add property summary and open attribute

  // /** The slotted accordion items. */
  // @queryAssignedElements({ slot: 'items' }) items?: AccordionItem[];

  /** @private The slotted accordion items. */
  @queryAssignedElements() items!: AccordionItem[];

  override connectedCallback(): void {
    super.connectedCallback();

    // if (!this.hasAttribute('tabindex')) {
    //   this.tabIndex = 0;
    // }

    // this.items.forEach(item => item.addEventListener('toggle', () => this.#onToggle));
  }

  override disconnectedCallback(): void {
    // this.items.forEach(item =>
    //   item.renderRoot.querySelector('details')?.removeEventListener('click', () => this.#onClick)
    // );

    super.disconnectedCallback();
  }

  /** @private */
  // formDisabledCallback(disabled: boolean): void {
  //   if (disabled) {
  //     this.originalTabIndex = this.tabIndex;
  //   }
  //
  //   this.tabIndex = disabled ? -1 : this.originalTabIndex;
  // }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    // if (changes.has('size')) {
    //   this.#setIconProperties(Array.from(this.childNodes));
    // }
  }

  override render(): TemplateResult {
    console.log('items', this.items);

    return html` <div class="wrapper">
      <slot @sl-toggle=${this.#onToggle} @click=${this.#onClick}></slot>
    </div>`;
  } // <slot @slotchange=${this.#onSlotChange}></slot>
  // TODO: onclick on details needed?

  override firstUpdated(): void {
    console.log('items in firstUpdated', this.items, this.single, this.items[0]);

    // this.items.forEach(item => {
    //   item.renderRoot.querySelector('details')?.addEventListener('click', () => this.#onClick);
    //   console.log(
    //     "item.renderRoot.querySelector('details')",
    //     item.renderRoot as HTMLElement,
    //     this.renderRoot.querySelector<HTMLElement>('details')
    //   );
    // }); // 'toggle'
    console.log(
      'this.items[0].firstChild',
      this.items[0].firstChild,
      this.items[0].renderRoot,
      this.items[0].renderRoot.children[0],
      (this.items[0].renderRoot as HTMLElement).firstElementChild,
      (this.items[0].renderRoot as HTMLElement).querySelector('details')
    );
  }

  /*<details>
<summary>${this.summary}</summary>
<div class="panel">
  <slot @slotchange=${this.#onSlotChange}></slot>
</div>
</details>*/

  /*<details>
<summary>${this.summary}</summary>
<div class="panel">
  <slot @slotchange=${this.#onSlotChange}></slot>
</div>
</details>*/

  #onToggle(/*event: Event*/ event: CustomEvent<string> & { target: AccordionItem }): void {
    console.log('event on toggle in main component', event, event.target, this.single, event.currentTarget);
    // event.preventDefault();
    // event.stopPropagation();

    /*    if (!this.single /!*|| event.defaultPrevented*!/) {
      // No toggling when `multiple` or the user prevents it.
      return;
    }

    this.items.forEach(item => {
      console.log('item in event', item, event.target, item === event.target);
      if (item !== event.target) {
        console.log(
          'event on toggle in main component in itemmm',
          event,
          event.target,
          this.single,
          item,
          event.target.localName,
          item.renderRoot.querySelector('details')
        );
        // Close all the items that didn't dispatch the event.
        // item.toggleEvent('closed');
        // item.toggleEvent.emit('closed');
        item.renderRoot.querySelector('details')?.removeAttribute('open');
        // requestAnimationFrame(() => item.renderRoot.querySelector('details')?.removeAttribute('open'));
        // event.target.renderRoot.querySelector('details')?.setAttribute('open', '');
        // item.onToggle;
      }
    });*/

    // event.target.renderRoot.querySelector('details')?.setAttribute('open', '');

    // resolve();
    // if (this.hasAttribute('disabled')) {
    //   event.preventDefault();
    //   event.stopPropagation();
    // } else if (this.type === 'reset') {
    //   this.internals.form?.reset();
    // } else if (this.type === 'submit') {
    //   this.internals.form?.requestSubmit();
    // }
  }

  #onClick(event: Event): void {
    console.log('event onClick in main component', event, event.target, this.single, event.currentTarget);
    // this.items.forEach(item => {
    //   // item.addEventListener('click', () => this.#onClick);
    //   console.log('item in onClick', item);
    // });

    if (!this.single /*|| event.defaultPrevented*/) {
      // No toggling when `multiple` or the user prevents it.
      return;
    }

    this.items.forEach(item => {
      if (item !== event.target) {
        console.log('item in onClick', item);
        item.renderRoot.querySelector('details')?.removeAttribute('open');
      }
    });
    // if (this.hasAttribute('disabled')) {
    //   event.preventDefault();
    //   event.stopPropagation();
    // } else if (this.type === 'reset') {
    //   this.internals.form?.reset();
    // } else if (this.type === 'submit') {
    //   this.internals.form?.requestSubmit();
    // }
  }

  // #onKeydown(event: KeyboardEvent): void {
  //   if (event.key === 'Enter' || event.key === ' ') {
  //     this.click();
  //
  //     event.preventDefault();
  //     event.stopPropagation();
  //   }
  // }

  // #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
  //   // const assignedNodes = event.target.assignedNodes({ flatten: true });
  //   // this.#setIconProperties(assignedNodes);
  // }

  // #hasOnlyIconAsChild(el: HTMLElement): boolean {
  //   return (
  //     (el.textContent || '').trim().length === 0 && el.children.length === 1 && el.children[0].nodeName === 'SL-ICON'
  //   );
  // }

  // #setIconProperties(assignedNodes: Node[]): void {
  //   const filteredNodes = assignedNodes.filter(node => {
  //     return node.nodeType === Node.ELEMENT_NODE || (node.textContent && node.textContent.trim().length > 0);
  //   });
  //
  //   let hasIcon = false;
  //
  //   filteredNodes.forEach(node => {
  //     const el = node as HTMLElement;
  //     if (el.nodeName === 'SL-ICON') {
  //       el.setAttribute('size', this.size);
  //     } else if (this.#hasOnlyIconAsChild(el)) {
  //       (el.children[0] as HTMLElement).setAttribute('size', this.size);
  //     }
  //   });
  //
  //   if (filteredNodes.length === 1) {
  //     const el = filteredNodes[0] as HTMLElement;
  //     // This button is icon-only if it only contains an icon.
  //     hasIcon = el.nodeName === 'SL-ICON' || this.#hasOnlyIconAsChild(el);
  //   }
  //
  //   this.toggleAttribute('icon-only', hasIcon);
  // }
}
