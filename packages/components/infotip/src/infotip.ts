import { localized, msg, str } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { type ButtonSize } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { Popover } from '@sl-design-system/popover';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './infotip.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-infotip': Infotip;
  }
}

let nextUniqueId = 0;

/**
 * An info icon button that triggers a popover showing slotted content.
 *
 * @slot - The content to display inside the infotip popover.
 * @slot icon - The icon to display in the button, defaults to `circle-info`.
 *
 * @csspart button - The button element.
 * @csspart popover - The popover element.
 */
@localized()
export class Infotip extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-popover': Popover
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
    slotAssignment: 'manual'
  };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Light DOM div that holds a copy of the content; manually assigned to the default slot. */
  #contentCopy?: HTMLElement;

  /** Observes light DOM changes to sync the copy. */
  #observer?: MutationObserver;

  /** The unique ID assigned to the content copy for use with aria-describedby. */
  contentId?: string;

  /** The name of the element that this infotip describes. */
  @property() describes?: string;

  /** The size of the infotip button. */
  @property({ reflect: true }) size: ButtonSize = 'md';

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
      <button
        aria-label=${this.#buttonLabel()}
        command="toggle-popover"
        commandfor="popover"
        id="trigger"
        part="button">
        <slot name="icon">
          <sl-icon name="info"></sl-icon>
        </slot>
      </button>
      <sl-popover id="popover" part="popover">
        <slot></slot>
      </sl-popover>
    `;
  }

  #buttonLabel(): string {
    const describes = this.describes?.trim();

    if (!describes) {
      return msg('More information', { id: 'sl.infotip.moreInformation' });
    }

    return msg(str`More information about ${describes}`, { id: 'sl.infotip.moreInformationAbout' });
  }

  /**
   * Renders a copy of the light DOM content in the popover, rather than the content itself.
   *
   * The infotip describes another element, which points at the content using `aria-describedby`
   * (see `sl-form-field`, which adds `contentId` to the `aria-describedby` of its control). That
   * only resolves ids in the same tree as the element using it, so the content has to be an element
   * with an id here in the light DOM; inside the shadow root it would be out of reach. Cloning
   * leaves the nodes the consumer wrote untouched, so a framework that keeps rendering into this
   * element does not lose track of them, and manual slot assignment renders only the copy, so the
   * content is not exposed to assistive technology twice.
   */
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
