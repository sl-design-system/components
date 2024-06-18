import { LocaleMixin } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './inline-message.scss.js';
// import {Locale} from "@sl-design-system/shared/src/mixins";
// import { locale } from "@sl-design-system/shared/src/mixins/locale-mixin.js";

declare global {
  interface HTMLElementTagNameMap {
    'sl-format-date': FormatDate;
  }
}

export interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  locale: string;
}

export function formatDate(date: Date, options: FormatDateOptions): string {
  const { locale, ...rest } = options;

  return new Intl.DateTimeFormat(locale, rest).format(date);
}

export type InlineMessageVariant = 'info' | 'success' | 'warning' | 'danger';

/**
 * A format date component for formatting date and time.
 *
 * @slot default - ...
 */
//@localized()
export class FormatDate extends LocaleMixin(LitElement) {
  // TODO: extends LocaleMixin?
  /** @internal */
  // static get scopedElements(): ScopedElementsMap {
  //   return {
  //     'sl-button': Button,
  //     'sl-icon': Icon
  //   };
  // }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  #date?: Date = new Date();

  /** The format for displaying the weekday. */
  @property() weekday?: 'narrow' | 'short' | 'long';

  @property() era?: 'narrow' | 'short' | 'long';

  @property() year?: '2-digit' | 'numeric';

  /** Observe the size and determine where to place the action button if present. */
  // #observer = new ResizeObserver(() => this.#onResize());

  /** Will hide the close button if set. */
  @property({ type: Boolean, reflect: true }) indismissible?: boolean;

  /** @internal If the action is missing, we need to hide the action part. */
  @property({ type: Boolean, attribute: 'no-action', reflect: true }) noAction = true;

  /** @internal If the title is missing, the content needs to be placed where the title should be. */
  @property({ type: Boolean, attribute: 'no-title', reflect: true }) noTitle = true;

  /** The variant of the inline message. */
  @property({ reflect: true }) variant: InlineMessageVariant = 'info';

  /** @internal Calculates the height of the title and wraps the button if longer than 1 line. */
  @property({ type: Boolean, attribute: 'wrap-action', reflect: true }) wrapAction?: boolean;

  /** @internal The name of the icon, depending on the variant. */
  get iconName(): string {
    switch (this.variant) {
      case 'success':
        return 'circle-check-solid';
      case 'warning':
        return 'octagon-exclamation-solid';
      case 'danger':
        return 'triangle-exclamation-solid';
      default:
        return 'info';
    }
  }

  // override connectedCallback(): void {
  //   // super.connectedCallback();
  //
  //   this.#observer.observe(this);
  // }
  //
  // override disconnectedCallback(): void {
  //   this.#observer.disconnect();
  //
  //   // super.disconnectedCallback();
  // }

  // override updated(changes: PropertyValues<this>): void {
  //   super.updated(changes);
  //
  //   if (changes.has('variant')) {
  //     this.setAttribute('role', ['danger', 'warning'].includes(this.variant) ? 'alert' : 'status');
  //   }
  // }

  override render(): TemplateResult {
    // Intl.DateTimeFormatOptions()
    // new Intl.DateTimeFormat(Locale)
    console.log('date', this.#date, 'with locales', new Intl.DateTimeFormat());
    return html`
      <div class="wrapper">
        ${this.#date}
        <slot></slot>
        ${formatDate(new Date(), { locale: 'pl', weekday: 'long', timeZoneName: 'short' })}
      </div>
    `;
  } // ${formatDate(this.#date, {locale: 'pl'})}
  // TODO: test timezone eg. UTC

  // #onActionSlotChange(event: Event & { target: HTMLSlotElement }): void {
  //   this.noAction = !event.target.assignedElements({ flatten: true }).length;
  // }
}
