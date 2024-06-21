import {
  faBurgerSoda,
  faCarBuilding,
  faClock,
  faFaceLaugh,
  faFlag,
  faFutbol,
  faLightbulb,
  faRabbit,
  faSymbols,
  faUser
} from '@fortawesome/pro-regular-svg-icons';
import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { SearchField } from '@sl-design-system/search-field';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlChangeEvent, type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { Tab, TabGroup } from '@sl-design-system/tabs';
import { type CompactEmoji, type GroupMessage, type MessagesDataset } from 'emojibase';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import styles from './emoji-browser.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-emoji-browser': EmojiBrowser;
  }
}

Icon.register(
  faBurgerSoda,
  faCarBuilding,
  faClock,
  faFaceLaugh,
  faFlag,
  faFutbol,
  faLightbulb,
  faRabbit,
  faSymbols,
  faUser
);

const GROUP_ICONS: Record<number, string> = {
  0: 'far-face-laugh',
  1: 'far-user',
  3: 'far-rabbit',
  4: 'far-burger-soda',
  5: 'far-car-building',
  6: 'far-futbol',
  7: 'far-lightbulb',
  8: 'far-symbols',
  9: 'far-flag'
};

@localized()
export class EmojiBrowser extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-search-field': SearchField,
      'sl-tab': Tab,
      'sl-tab-group': TabGroup
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
  @state() groupedEmojis: Record<number, CompactEmoji[] | undefined> = {};

  /** @internal The emoji groups. */
  @state() groups: GroupMessage[] = [];

  /**
   * The locale for this component.
   * TODO: Use the LocaleMixin.
   */
  @property() locale?: string;

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
      <sl-tab-group>
        ${this.frequentlyUsedEmojis?.length
          ? html`
              <sl-tab @click=${this.#onTabClick} id="group-frequently-used">
                <sl-icon name="far-clock" slot="icon"></sl-icon>
              </sl-tab>
            `
          : nothing}
        ${this.groups.map(
          group => html`
            <sl-tab @click=${this.#onTabClick} .id=${`group-${group.key}`}>
              <sl-icon .name=${GROUP_ICONS[group.order]} slot="icon"></sl-icon>
            </sl-tab>
          `
        )}
      </sl-tab-group>

      <div @scroll=${this.#onScroll} part="wrapper">
        <sl-search-field
          @sl-change=${this.#onChange}
          @sl-clear=${this.#onClear}
          .placeholder=${msg('Search')}
          .value=${this.query}
        ></sl-search-field>

        ${this.filteredEmojis.length
          ? this.renderEmojis(this.filteredEmojis)
          : html`
              ${this.frequentlyUsedEmojis?.length
                ? html`
                    <h1 id="frequently-used">${msg('Frequently Used')}</h1>
                    ${this.renderEmojis(this.frequentlyUsedEmojis)}
                  `
                : nothing}
              ${repeat(
                this.groups,
                group => group.key,
                group => html`
                  <h1 .id=${group.key}>${group.message}</h1>
                  ${this.renderEmojis(this.groupedEmojis[group.order])}
                `
              )}
            `}
      </div>
    `;
  }

  renderEmojis(emojis?: CompactEmoji[]): TemplateResult | typeof nothing {
    if (!emojis) {
      return nothing;
    }

    return html`
      <ul class="emojis">
        ${repeat(
          emojis,
          emoji => emoji.unicode,
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

  #onScroll(event: Event & { target: HTMLElement }): void {
    const headings = Array.from(this.renderRoot.querySelectorAll('h1')).reverse(),
      { clientHeight, offsetTop, scrollHeight, scrollTop } = event.target;

    if (Math.abs(scrollHeight - clientHeight - scrollTop) <= 1) {
      this.renderRoot.querySelector(`sl-tab#group-${this.groups.at(-1)?.key}`)?.setAttribute('selected', '');
    } else {
      const activeHeading = headings.find(h => h.offsetTop - scrollTop <= offsetTop);

      if (activeHeading) {
        this.renderRoot.querySelector(`#group-${activeHeading.id}`)?.setAttribute('selected', '');
      } else {
        this.renderRoot.querySelector('sl-tab[selected]')?.removeAttribute('selected');
      }
    }
  }

  #onTabClick(event: Event & { target: HTMLElement }): void {
    const tab = event.target.closest('sl-tab'),
      key = tab?.id.split('group-').at(1);

    if (key) {
      this.renderRoot.querySelector(`h1#${key}`)?.scrollIntoView();
    }
  }

  async #loadEmojis(): Promise<void> {
    this.emojis = await this.#loadEmojiData();
    this.emojis = this.emojis.filter(emoji => typeof emoji.group === 'number' && emoji.group !== 2);
    this.groupedEmojis = Object.groupBy(this.emojis, ({ group }) => group ?? -1);

    const messages = await this.#loadEmojiMessages();
    this.groups = messages.groups.filter(group => typeof group.order === 'number' && group.key !== 'component');
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
