import { localized } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './callout.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-callout': Callout;
  }
}

export type CalloutSize = 'auto' | 'md' | 'lg'; // no small size for callouts // TODO: what about 'auto'? Is is still needed?

export type CalloutVariant = 'info' | 'success' | 'warning' | 'danger'; // TODO: in Figma: 'positive', 'caution' and 'negative', should be renamed here as well?

/**
 * A callout component for displaying additional information. Meant to be used with actions and should not be dynamically shown as the inline-message.
 *
 * @slot default - The body of the callout
 * @slot icon - Icon shown on the left side of the component
 * @slot title - Title content for the callout
 */
@localized()
export class Callout extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  } // TODO: can be used with actions buttons...

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Timer used for breaking a possible resize observer loop. */
  #breakResizeObserverLoop?: ReturnType<typeof setTimeout>;

  /** Observe the size and determine where to place the action button if present. */
  #observer = new ResizeObserver(entries => this.#onResize(entries[0]));

  /** The original size, set by the user, before any automatic behavior was applied. */
  #originalSize: CalloutSize = 'auto';

  /** The current size. */
  #size: CalloutSize = 'auto';

  // /** @internal Title (if visible) that will be sent to the announcer. */
  // #title?: string;

  /** @internal If the content spans more than 2 lines, this will be true. */
  @state() contentOverflow?: boolean;

  /** @internal The name of the icon, depending on the variant. */
  get iconName(): string {
    switch (this.variant) {
      case 'success':
        return 'circle-check-solid';
      case 'warning':
        return 'octagon-exclamation-solid';
      case 'danger':
        return 'diamond-exclamation-solid';
      default:
        return 'info';
    }
  }

  // /**
  //  * If set, will remove the ability to dismiss the inline message by removing
  //  * the close button.
  //  * @default false
  //  */
  // @property({ type: Boolean, reflect: true }) indismissible?: boolean;

  /** @internal If the action is missing, we need to hide the action part. */
  @property({ type: Boolean, attribute: 'no-action', reflect: true }) noAction = true;

  /** @internal If the title is missing, the content needs to be placed where the title should be. */
  @property({ type: Boolean, attribute: 'no-title', reflect: true }) noTitle = true;

  get size(): CalloutSize {
    return this.#size;
  }

  /**
   * The size of the inline message. By default, this is set to `'auto'` which means the component
   * will automatically determine the size based on the content. If the content spans more than 2
   * lines, the size will be set to `'lg'`. If a title is present, the size will be set to `'lg'`.
   * Otherwise, the size will be set to `'md'`.
   * If you want to explicitly set the size the `'sm'`, `'md'`, or `'lg'`, you can do so. But beware
   * that some sizes may not work well with the content. `'sm'` and `'md'` for example are not meant
   * to be used with a title.
   * @default 'auto'
   */
  @property({ reflect: true })
  set size(size: CalloutSize) {
    this.#originalSize = this.#size = size;
  }

  /**
   * The variant of the callout.
   * @default 'info'
   */
  @property({ reflect: true }) variant?: CalloutVariant;

  override firstUpdated(changes: PropertyValues): void {
    super.firstUpdated(changes);

    this.#observer.observe(this.renderRoot.querySelector('[part="content"]')!);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    if (this.#breakResizeObserverLoop) {
      clearTimeout(this.#breakResizeObserverLoop);
      this.#breakResizeObserverLoop = undefined;
    }

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('contentOverflow') || changes.has('noTitle')) {
      if (this.#originalSize === 'auto') {
        this.#size = this.contentOverflow || !this.noTitle ? 'lg' : 'md';
        this.requestUpdate('size');
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <div part="icon">
        <slot name="icon">
          <sl-icon .name=${this.iconName} size="md"></sl-icon>
        </slot>
      </div>
      <div part="title">
        <slot @slotchange=${this.#onTitleSlotChange} name="title"></slot>
      </div>
      <div part="content">
        <slot @slotchange=${this.#onContentSlotChange}></slot>
      </div>
    `;
  }

  #onResize(entry: ResizeObserverEntry): void {
    const lineHeight = parseInt(getComputedStyle(this).lineHeight),
      contentOverflow = entry.contentRect.height / lineHeight > 2;

    if (contentOverflow && !this.contentOverflow) {
      this.contentOverflow = contentOverflow;

      // Reset the timeout, so it always ends with the `lg` size
      if (this.#breakResizeObserverLoop) {
        clearTimeout(this.#breakResizeObserverLoop);

        this.#breakResizeObserverLoop = setTimeout(() => (this.#breakResizeObserverLoop = undefined), 200);
      }
    } else if (this.#breakResizeObserverLoop) {
      return;
    } else {
      this.contentOverflow = contentOverflow;

      // Break the loop if it keeps switching between sizes; workaround is to
      // just wait a little bit before updating the size again.
      this.#breakResizeObserverLoop = setTimeout(() => (this.#breakResizeObserverLoop = undefined), 200);
    }
  }

  #onContentSlotChange(event: Event & { target: HTMLSlotElement }): void {
    console.log('content slot changed', event.target.assignedNodes({ flatten: true }));

    // this.#content = Array.from(event.target.assignedNodes({ flatten: true }))
    //   .flatMap(node => {
    //     if (node.nodeType === Node.TEXT_NODE) {
    //       return [node.textContent?.trim()];
    //     } else if (node.nodeType === Node.ELEMENT_NODE && !(node instanceof HTMLStyleElement)) {
    //       return Array.from((node as HTMLElement).innerText.split(' ')).map(text => text.trim());
    //     }
    //     return [];
    //   })
    //   .join(' ');

    // this.#announce();
  }

  #onTitleSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.noTitle = !Array.from(event.target.assignedNodes({ flatten: true })).some(
      node => node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim()
    );

    // this.#title = event.target
    //   .assignedNodes({ flatten: true })
    //   .flatMap(node =>
    //     node.nodeType === Node.TEXT_NODE
    //       ? [node.textContent?.trim()]
    //       : node.nodeType === Node.ELEMENT_NODE
    //         ? Array.from(node.childNodes)
    //             .filter(child => child.nodeType === Node.TEXT_NODE)
    //             .map(child => child.textContent?.trim())
    //         : []
    //   )
    //   .join(' ');

    // this.#announce();
  }
}
