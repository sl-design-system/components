import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { SearchField, type SlSearchEvent } from '@sl-design-system/search-field';
import { type CompactEmoji, type MessagesDataset } from 'emojibase';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './emoji-browser.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-emoji-browser': EmojiBrowser;
  }
}

@localized()
export class EmojiBrowser extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-search-field': SearchField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The base URL where the emoji data can be found. */
  @property({ attribute: 'base-url' }) baseUrl = '';

  /** @internal The emoji data. */
  @state() emojis: CompactEmoji[] = [];

  /** @internal The emojis, grouped by group. */
  @state() groups: Record<number, CompactEmoji[] | undefined> = {};

  /**
   * The locale for this component.
   * TODO: Use the LocaleMixin.
   */
  @property() locale?: string;

  /** @internal The emoji groups. */
  @state() messages?: MessagesDataset;

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('locale')) {
      void this.#loadEmojis();
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-search-field
        @sl-clear=${this.#onClear}
        @sl-search=${this.#onSearch}
        .placeholder=${msg('Search')}
      ></sl-search-field>

      <ol class="groups">
        ${this.messages?.groups
          .filter(({ order }) => typeof order === 'number')
          .map(
            group => html`
              <li class="group">
                <h1>${group.message}</h1>
                <ul class="emojis">
                  ${this.groups?.[group.order]?.map(
                    emoji => html`
                      <li class="emoji">
                        <sl-button @click=${() => this.#onClick(emoji)} aria-label=${emoji.label} fill="ghost">
                          ${emoji.unicode}
                        </sl-button>
                      </li>
                    `
                  )}
                </ul>
              </li>
            `
          )}
      </ol>
    `;
  }

  #onClear(): void {
    console.log('clear');
  }

  #onClick(emoji: CompactEmoji): void {
    console.log('click', emoji);
  }

  #onSearch({ detail: query }: SlSearchEvent): void {
    console.log('search', query);
  }

  async #loadEmojis(): Promise<void> {
    this.emojis = await this.#loadEmojiData();
    this.messages = await this.#loadEmojiMessages();

    this.groups = Object.groupBy(this.emojis, ({ group }) => group ?? -1);
    console.log(this.groups);
  }

  async #loadEmojiData(): Promise<CompactEmoji[]> {
    const response = await fetch(`${this.baseUrl}/${this.locale}/compact.json`);

    if (response.ok) {
      const emojis = (await response.json()) as CompactEmoji[];

      return emojis;
    } else {
      throw new Error(`Failed to load emoji data: ${response.statusText}`);
    }
  }

  async #loadEmojiMessages(): Promise<MessagesDataset> {
    const response = await fetch(`${this.baseUrl}/${this.locale}/messages.json`);

    if (response.ok) {
      const messages = (await response.json()) as MessagesDataset;

      return messages;
    } else {
      throw new Error(`Failed to load emoji data: ${response.statusText}`);
    }
  }
}
