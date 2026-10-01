import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { type FooterModel } from '../types.js';
import styles from './footer.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-sesame-language-select': SlSesameLanguageSelectEvent;
  }
}

/** Emitted when the user picks a language from the footer's language selector. The detail is the chosen BCP-47 code. */
export type SlSesameLanguageSelectEvent = CustomEvent<string>;

/**
 * The footer of the "My Sesame" learning-materials page: the publisher wordmark, the legal/utility
 * links, and a language selector.
 *
 * Presentational — it renders the `model` the page gives it and emits when a language is picked;
 * it owns no data and does not localize anything else about the page.
 *
 * Scoped child of the page root: it does not register a custom element of its own.
 *
 * ```html
 * <sl-sesame-footer .model=${model}></sl-sesame-footer>
 * ```
 *
 * @fires sl-sesame-language-select - Emitted with the chosen BCP-47 code when a language is picked.
 */
export class SesameFooter extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The publisher wordmark, the legal/utility links, and the language options. */
  @property({ attribute: false }) model?: FooterModel;

  /** @internal Emitted with the chosen BCP-47 code when a language is picked. */
  @event({ name: 'sl-sesame-language-select' })
  languageSelectEvent!: EventEmitter<SlSesameLanguageSelectEvent>;

  /**
   * Whether the language menu is open.
   *
   * @internal
   */
  @property({ type: Boolean, reflect: true, attribute: 'language-menu-open' }) languageMenuOpen = false;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html``;
    }

    const currentLanguage = model.languages.find(({ code }) => code === model.currentLanguage);

    return html`
      <div class="footer">
        ${model.brandLogoUrl
          ? html`<img alt=${model.brandName} class="brand-logo" src=${model.brandLogoUrl} />`
          : html`<span class="brand">${model.brandName}</span>`}

        <nav aria-label="Footer">
          <ul class="links">
            ${model.links.map(link => html`<li><a href=${link.href}>${link.label}</a></li>`)}
          </ul>
        </nav>

        <div class="language">
          <!--
            Spec asked for <sl-menu-button> with the current language in its button slot followed
            by a "chevron-down" icon rotated to point up, but MenuButton hardcodes its own toggle
            icon (name="angle-down", no csspart exposed on it) whenever the button slot holds more
            than one element (our label + our chevron) — there is no way to suppress or retarget
            that internal icon via CSS, so using it as specified would render two chevrons (and
            the wrong glyph, since the design specifically wants the rotated "chevron-down", not
            "angle-down"). Falling back to a plain button per the spec's own escape hatch; see the
            report.
          -->
          <button
            @click=${this.#onLanguageMenuToggle}
            aria-expanded=${this.languageMenuOpen}
            aria-haspopup="menu"
            class="language-trigger"
            type="button">
            ${currentLanguage?.label ?? model.currentLanguage}
            <sl-icon aria-hidden="true" class="chevron" name="chevron-down"></sl-icon>
          </button>
          ${this.languageMenuOpen
            ? html`
                <ul class="language-menu" role="menu">
                  ${model.languages.map(
                    language => html`
                      <li role="none">
                        <button
                          @click=${() => this.#onLanguageSelect(language.code)}
                          role="menuitem"
                          type="button">
                          ${language.label}
                        </button>
                      </li>
                    `
                  )}
                </ul>
              `
            : nothing}
        </div>
      </div>
    `;
  }

  #onLanguageMenuToggle(): void {
    this.languageMenuOpen = !this.languageMenuOpen;
  }

  #onLanguageSelect(code: string): void {
    this.languageMenuOpen = false;

    this.languageSelectEvent.emit(code);
  }
}
