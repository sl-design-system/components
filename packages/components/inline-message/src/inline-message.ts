import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './inline-message.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-dismiss': SlDismissEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-inline-message': InlineMessage;
  }
}

export type InlineMessageSize = 'auto' | 'sm' | 'md' | 'lg';

export type InlineMessageVariant = 'info' | 'success' | 'warning' | 'danger';

export type SlDismissEvent = CustomEvent<void>;

/**
 * An inline message component for displaying additional information.
 *
 * @slot default - The body of the inline-message
 * @slot icon - Icon shown on the left side of the component
 * @slot title - Title content for the inline message
 * @slot action - Optional action button
 */
@localized()
export class InlineMessage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Timer used for breaking a possible resize observer loop. */
  #breakResizeObserverLoop?: ReturnType<typeof setTimeout>;

  /** Observe the size and determine where to place the action button if present. */
  #observer = new ResizeObserver(entries => this.#onResize(entries[0]));

  /** The original size, set by the user, before any automatic behavior was applied. */
  #originalSize: InlineMessageSize = 'auto';

  /** The current size. */
  #size: InlineMessageSize = 'auto';

  /** @internal The optional slotted action button. */
  @state() actionButton?: Button;

  /** @internal If the content spans more than 2 lines, this will be true. */
  @state() contentOverflow?: boolean;

  /** @internal Emits when the inline message is dismissed. */
  @event({ name: 'sl-dismiss' }) dismissEvent!: EventEmitter<SlDismissEvent>;

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

  /**
   * If set, will remove the ability to dismiss the inline message by removing
   * the close button.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) indismissible?: boolean;

  /** @internal If the action is missing, we need to hide the action part. */
  @property({ type: Boolean, attribute: 'no-action', reflect: true }) noAction = true;

  /** @internal If the title is missing, the content needs to be placed where the title should be. */
  @property({ type: Boolean, attribute: 'no-title', reflect: true }) noTitle = true;

  get size(): InlineMessageSize {
    return this.#size;
  }

  /**
   * The size of the inline message. By default this is set to `'auto'` which means the component
   * will automatically determine the size based on the content. If the content spans more than 2
   * lines, the size will be set to `'lg'`. If a title is present, the size will be set to `'lg'`.
   * Otherwise the size will be set to `'md'`.
   * If you want to explicitly set the size the `'sm'`, `'md'`, or `'lg'`, you can do so. But beware
   * that some sizes may not work well with the content. `'sm'` and `'md'` for example are not meant
   * to be used with a title.
   * @default 'auto'
   */
  @property({ reflect: true })
  set size(size: InlineMessageSize) {
    this.#originalSize = this.#size = size;
  }

  /**
   * The variant of the inline message.
   * @default 'info'
   */
  @property({ reflect: true }) variant?: InlineMessageVariant;

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

    if (changes.has('actionButton') || changes.has('size')) {
      if (this.actionButton) {
        this.actionButton.size = this.size === 'sm' ? 'sm' : 'md';
      }
    }

    if (changes.has('actionButton') || changes.has('variant')) {
      if (this.actionButton) {
        this.actionButton.variant = this.variant ?? 'info';
      }
    }

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
      <div role=${this.variant === 'danger' ? 'alert' : 'status'}>
        <div part="title">
          <slot @slotchange=${this.#onTitleSlotChange} name="title"></slot>
        </div>
        <div part="content">
          <slot></slot>
        </div>
      </div>
      <div part="action">
        <slot @slotchange=${this.#onActionSlotChange} name="action"></slot>
      </div>
      ${this.indismissible
        ? nothing
        : html`
            <sl-button
              @click=${this.#onClick}
              .size=${this.size === 'sm' ? 'sm' : 'md'}
              .variant=${this.variant ?? 'info'}
              aria-label=${msg('Close')}
              fill="ghost"
            >
              <sl-icon name="xmark"></sl-icon>
            </sl-button>
          `}
    `;
  }

  #onActionSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.actionButton = event.target
      .assignedElements({ flatten: true })
      .find((el): el is Button => el instanceof Button);

    this.noAction = !this.actionButton;
  }

  #onClick(): void {
    this.dismissEvent.emit();
    this.remove();
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

  #onTitleSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.noTitle = !Array.from(event.target.assignedNodes({ flatten: true })).some(
      node => node.nodeType === Node.ELEMENT_NODE || node.textContent?.trim()
    );
  }
}
