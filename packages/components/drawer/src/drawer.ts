import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './drawer.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-drawer': Drawer;
  }
}

export type DrawerAttachment = 'right' | 'left' | 'top' | 'bottom';

/**
 * A drawer component for displaying UI at the side of the screen.
 *
 * @cssprop --sl-drawer-max-inline-size - The maximum inline size of the drawer
 * @slot default - Body content for the drawer
 * @slot header - Header content for the drawer
 * @slot title - The title of the drawer
 */
@localized()
export class Drawer extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal The popover element */
  @query('[popover]') popoverElement!: HTMLElement;

  /** The side of the screen where the drawer is attached */
  @property() attachment?: DrawerAttachment;

  override connectedCallback(): void {
    super.connectedCallback();

    this.inert = true;
  }

  override render(): TemplateResult {
    return html`
      <div
        @beforetoggle=${this.#onBeforeToggle}
        @toggle=${this.#onToggle}
        aria-labelledby="title"
        class=${ifDefined(this.attachment)}
        part="popover"
        popover
      >
        <div part="content">
          <div part="header">
            <sl-button-bar reverse>
              <sl-button @click=${this.#onClick} aria-label=${msg('Close the drawer')} fill="ghost">
                <sl-icon name="xmark"></sl-icon>
              </sl-button>
              <slot name="actions"></slot>
            </sl-button-bar>
            <slot name="title" id="title"></slot>
          </div>
          <slot></slot>
        </div>
      </div>
    `;
  }

  hide(): void {
    this.popoverElement?.hidePopover();
  }

  show(): void {
    this.popoverElement?.showPopover();
  }

  toggle(): void {
    this.popoverElement?.togglePopover();
  }

  #onBeforeToggle(event: ToggleEvent): void {
    if (event.newState === 'closed') {
      document.documentElement.style.overflow = '';
      this.inert = true;
    } else {
      document.documentElement.style.overflow = 'hidden';
      this.inert = false;
    }
  }

  #onClick(): void {
    this.hide();
  }

  #onToggle(event: ToggleEvent): void {
    console.log('toggle', event);
  }
}
