import { localized, msg, str } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button, type ButtonSize } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Popover } from '@sl-design-system/popover';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './infotip.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-infotip': Infotip;
  }
}

let nextUniqueId = 0;

/**
 * An info icon button that triggers a popover showing slotted content.
 *
 * You can use it inside the `infotip` slot of `<sl-label>`:
 *
 * ```html
 * <sl-label>
 *   Label text
 *   <sl-infotip slot="infotip">This is additional information.</sl-infotip>
 * </sl-label>
 * ```
 *
 * @slot default - The content to display inside the infotip popover.
 * @slot icon - The icon to display in the button, defaults to `circle-info`.
 *
 * @csspart button - The button element.
 * @csspart popover - The popover element.
 */
@localized()
export class Infotip extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    slotAssignment: 'manual'
  };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-popover': Popover
    };
  }

  /** The name of the element that this infotip describes. */
  @property() describes?: string;

  /** The size of the infotip button. */
  @property({ reflect: true }) size: ButtonSize = 'md';

  /** Light DOM div that holds a copy of the content; manually assigned to the default slot. */
  #contentCopy?: HTMLElement;

  /** Observes light DOM changes to sync the copy. */
  #observer?: MutationObserver;

  /** The unique ID assigned to the content copy for use with aria-describedby. */
  contentId?: string;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#contentCopy = document.createElement('div');
    this.#contentCopy.id = this.contentId = `sl-infotip-content-${nextUniqueId++}`;
    this.append(this.#contentCopy);

    this.#observer = new MutationObserver(() => this.#syncContent());
    this.#observer.observe(this, {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true
    });
  }

  override firstUpdated(): void {
    this.#syncContent();
  }

  override disconnectedCallback(): void {
    this.#observer?.disconnect();
    this.#observer = undefined;

    this.#contentCopy?.remove();
    this.#contentCopy = undefined;

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <sl-button
        @click=${this.#onClick}
        @keydown=${this.#onKeydown}
        aria-label=${this.#buttonLabel()}
        fill="ghost"
        id="trigger"
        size=${this.size}
        part="button">
        <slot name="icon">
          <sl-icon name="info"></sl-icon>
        </slot>
      </sl-button>
      <sl-popover anchor="trigger" part="popover" position="top">
        <slot></slot>
      </sl-popover>
    `;
  }

  override focus(options?: FocusOptions): void {
    const trigger = this.renderRoot.querySelector<Button>('sl-button');

    if (trigger) {
      trigger.focus(options);
      return;
    }

    super.focus(options);
  }

  toggleInfotip(): void {
    this.renderRoot.querySelector('sl-popover')?.togglePopover();
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.stopPropagation();
    }
  }

  #onClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleInfotip();
  }

  #buttonLabel(): string {
    const describes = this.describes?.trim();

    if (!describes) {
      return msg('More information', { id: 'sl.infotip.moreInformation' });
    }
    return msg(str`More information about ${describes}`, { id: 'sl.infotip.moreInformationAbout' });
  }

  #syncContent(): void {
    this.#observer?.disconnect();

    // Manually assign icon elements to the icon slot
    const icon = this.querySelector('[slot="icon"]'),
      iconSlot = this.renderRoot?.querySelector<HTMLSlotElement>('slot[name="icon"]');
    if (icon && iconSlot) {
      iconSlot.assign(icon);
    }

    // Exclude the content copy and any icon elements
    const nodes = [...this.childNodes].filter(
      node => node !== this.#contentCopy && node.nodeType !== Node.COMMENT_NODE && node !== icon
    );

    // Update the content copy with cloned content and assign to default slot
    if (this.#contentCopy) {
      this.#contentCopy.replaceChildren(...nodes.map(n => n.cloneNode(true)));

      this.renderRoot.querySelector<HTMLSlotElement>('slot:not([name])')?.assign(this.#contentCopy);
    }

    this.#observer?.observe(this, { childList: true, characterData: true, subtree: true });
  }
}
