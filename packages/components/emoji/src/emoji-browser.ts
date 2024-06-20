import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { SearchField } from '@sl-design-system/search-field';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlChangeEvent, type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CompactEmoji, type MessagesDataset } from 'emojibase';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
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

  /** @internal The filtered emojis based on the `query` value. */
  @state() filteredEmojis: CompactEmoji[] = [];

  /** Frequently used emojis, separated by spaces. */
  @property({ attribute: 'frequently-used' }) frequentlyUsed?: string;

  /** @internals The frequently used emojis. */
  @state() frequentlyUsedEmojis: CompactEmoji[] = [];

  /** @internal The emojis, grouped by group. */
  @state() groups: Record<number, CompactEmoji[] | undefined> = {};

  /**
   * The locale for this component.
   * TODO: Use the LocaleMixin.
   */
  @property() locale?: string;

  /** @internal The emoji groups. */
  @state() messages?: MessagesDataset;

  /** The query string to filter emojis. */
  @property() query?: string;

  /** @internal Emits when the user selects an emoji. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<CompactEmoji>>;

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('frequentlyUsed') || changes.has('emojis')) {
      this.frequentlyUsedEmojis = this.frequentlyUsed
        ?.split(' ')
        .map(unicode => this.emojis.find(emoji => emoji.unicode === unicode)!)
        .filter(Boolean) as CompactEmoji[];
    }

    if (changes.has('locale')) {
      void this.#loadEmojis();
    }

    if (changes.has('query') || changes.has('emojis')) {
      const query = this.query?.toLowerCase();

      if (query) {
        this.filteredEmojis = this.emojis.filter(e => e.label.includes(query) || e.tags?.some(t => t.includes(query)));
      } else {
        this.filteredEmojis = [];
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-search-field
        @sl-change=${this.#onChange}
        @sl-clear=${this.#onClear}
        .placeholder=${msg('Search')}
        .value=${this.query}
      ></sl-search-field>

      ${this.filteredEmojis.length
        ? this.renderEmojis(this.filteredEmojis)
        : html`
            <ol class="groups">
              ${this.frequentlyUsedEmojis?.length
                ? html`
                    <li class="group">
                      <h1>${msg('Frequently Used')}</h1>
                      ${this.renderEmojis(this.frequentlyUsedEmojis)}
                    </li>
                  `
                : nothing}
              ${this.messages?.groups
                .filter(({ order }) => typeof order === 'number')
                .map(
                  group => html`
                    <li class="group">
                      <h1>${group.message}</h1>
                      ${this.renderEmojis(this.groups[group.order])}
                    </li>
                  `
                )}
            </ol>
          `}
    `;
  }

  renderEmojis(emojis?: CompactEmoji[]): TemplateResult | typeof nothing {
    if (!emojis) {
      return nothing;
    }

    return html`
      <ul class="emojis">
        ${emojis.map(
          emoji => html`
            <li class="emoji">
              <sl-button @click=${() => this.#onClick(emoji)} aria-label=${emoji.label} fill="ghost">
                ${emoji.unicode}
              </sl-button>
            </li>
          `
        )}
      </ul>
    `;
  }

  #onChange({ detail: query }: SlChangeEvent<string>): void {
    this.query = query;
  }

  #onClear(): void {
    this.query = '';
  }

  #onClick(emoji: CompactEmoji): void {
    this.selectEvent.emit(emoji);
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
