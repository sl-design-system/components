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
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { repeat } from 'lit/directives/repeat.js';
import styles from './emoji-browser.scss.js';
import { type Emoji, type EmojiGroup, EmojiService, type SupportedLocale } from './emoji-service.js';

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

  /** @internal The filtered emojis based on the `query` value. */
  @state() filteredEmojis: Emoji[] = [];

  /** Frequently used emojis, separated by spaces. */
  @property({ attribute: 'frequently-used' }) frequentlyUsed?: string;

  /** @internals The frequently used emojis. */
  @state() frequentlyUsedEmojis: Emoji[] = [];

  /** @internal The emojis, grouped by group. */
  @state() emojis?: Map<EmojiGroup, Emoji[]>;

  /**
   * The locale for this component.
   * TODO: Use the LocaleMixin.
   */
  @property() locale?: string;

  /** The query string to filter emojis. */
  @property() query?: string;

  /** @internal Emits when the user selects an emoji. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<Emoji>>;

  /** @internal Service for getting the data. */
  service?: EmojiService;

  override connectedCallback(): void {
    super.connectedCallback();

    if (this.baseUrl) {
      this.service = new EmojiService(this.baseUrl);
    } else {
      throw new Error('The `baseUrl` property is required when using the sl-emoji-browser component.');
    }
  }

  override async willUpdate(changes: PropertyValues<this>): Promise<void> {
    super.willUpdate(changes);

    if (changes.has('frequentlyUsed')) {
      const emojis = await this.service?.getEmojis(this.locale as SupportedLocale);

      this.frequentlyUsedEmojis = this.frequentlyUsed
        ?.split(' ')
        .map(unicode => emojis?.find(emoji => emoji.unicode === unicode))
        .filter(Boolean) as Emoji[];
    }

    if (changes.has('locale')) {
      this.emojis = await this.service?.getGroupedEmojis(this.locale as SupportedLocale);
    }

    if (changes.has('query')) {
      if (this.query) {
        this.filteredEmojis = (await this.service?.findEmojis(this.locale as SupportedLocale, this.query)) ?? [];
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
        ${map(
          this.emojis?.keys(),
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
                    <div id="frequently-used" class="heading">${msg('Frequently Used')}</div>
                    ${this.renderEmojis(this.frequentlyUsedEmojis)}
                  `
                : nothing}
              ${map(
                this.emojis?.entries(),
                ([group, emojis]) => html`
                  <div .id=${group.key} class="heading">${group.message}</div>
                  ${this.renderEmojis(emojis)}
                `
              )}
            `}
      </div>
    `;
  }

  renderEmojis(emojis: Emoji[]): TemplateResult | typeof nothing {
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

  #onClick(emoji: Emoji): void {
    this.selectEvent.emit(emoji);
  }

  #onScroll(event: Event & { target: HTMLElement }): void {
    const headings = Array.from(this.renderRoot.querySelectorAll<HTMLElement>('.heading')).reverse(),
      { clientHeight, offsetTop, scrollHeight, scrollTop } = event.target;

    if (Math.abs(scrollHeight - clientHeight - scrollTop) <= 1) {
      const group = Array.from(this.emojis?.keys() ?? []).at(-1);

      this.renderRoot.querySelector(`sl-tab#group-${group?.key}`)?.setAttribute('selected', '');
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
      this.renderRoot.querySelector(`#${key}`)?.scrollIntoView();
    }
  }
}
