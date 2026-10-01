import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { registerRunIcons } from '../run-icons.js';
import styles from './my-groups-app-footer.css' with { type: 'css' };

registerRunIcons();

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-my-groups-language-select': SlMyGroupsLanguageSelectEvent;
  }
}

export type SlMyGroupsLanguageSelectEvent = CustomEvent<{ language: string }>;

/** A single legal link in the footer's link row. */
interface LegalLink {
  id: string;
  label: string;
  href: string;
}

/**
 * The legal link row. This is *structure*, not data: the set of links and their order is fixed
 * by the application shell, so it is a constant here rather than an input the parent passes in.
 */
const LEGAL_LINKS: readonly LegalLink[] = [
  { id: 'privacy-policy', label: 'Privacy Policy', href: '#' },
  { id: 'terms-and-conditions', label: 'Terms & Conditions', href: '#' },
  { id: 'contact', label: 'Contact', href: '#' },
  { id: 'cookies', label: 'Cookies', href: '#' },
  { id: 'disclaimer', label: 'Disclaimer', href: '#' }
];

/** Maps a language code onto the label the selector shows for it. Structural, not data. */
const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English - EN'
};

/**
 * The application footer: the brand wordmark, the row of legal links and the language selector.
 *
 * This is a presentational component — it renders the language code it is given and emits when
 * the language selector is activated; it owns no data and shows no language list itself (the
 * root decides what happens next).
 *
 * The host is a neutral element on purpose: the `contentinfo` landmark belongs to the host
 * application that embeds this page, so neither `<footer>` nor `role="contentinfo"` is used here.
 *
 * ```html
 * <sl-my-groups-app-footer language="en"></sl-my-groups-app-footer>
 * ```
 *
 * @fires sl-my-groups-language-select - Emitted when the language selector is activated.
 */
export class MyGroupsAppFooter extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The code of the currently selected interface language.
   *
   * @default 'en'
   */
  @property() language?: string;

  /** Emits when the language selector is activated. */
  @event({ name: 'sl-my-groups-language-select' })
  languageSelectEvent!: EventEmitter<SlMyGroupsLanguageSelectEvent>;

  override render(): TemplateResult {
    const language = this.language ?? 'en',
      languageLabel = LANGUAGE_LABELS[language] ?? language.toUpperCase();

    return html`
      <div class="footer">
        <!--
          logo asset placeholder — the design's footer wordmark (Figma 2:70479) is a bitmap
          behind an expiring Figma asset URL and this example has no asset pipeline, so the
          wordmark is reproduced as text styled to the logo's box.
        -->
        <div class="wordmark">van in</div>

        <nav aria-label="Legal">
          <ul>
            ${LEGAL_LINKS.map(link => html`<li><a href=${link.href}>${link.label}</a></li>`)}
          </ul>
        </nav>

        <!--
          No aria-expanded: no listbox opens yet, and a state that can never become true
          misinforms assistive technology. It comes back with the picker.
        -->
        <sl-button
          @click=${this.#onLanguageClick}
          aria-haspopup="listbox"
          class="language"
          fill="link">
          <sl-icon name="globe"></sl-icon>
          ${languageLabel}
          <sl-icon name="chevron-up"></sl-icon>
        </sl-button>
      </div>
    `;
  }

  #onLanguageClick(): void {
    this.languageSelectEvent.emit({ language: this.language ?? 'en' });
  }
}
