var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __typeError = msg2 => {
  throw TypeError(msg2);
};
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __accessCheck = (obj, member, msg2) => member.has(obj) || __typeError('Cannot ' + msg2);
var __privateAdd = (obj, member, value) =>
  member.has(obj)
    ? __typeError('Cannot add the same private member more than once')
    : member instanceof WeakSet
      ? member.add(obj)
      : member.set(obj, value);
var __privateMethod = (obj, member, method) => (
  __accessCheck(obj, member, 'access private method'),
  method
);
var _EmojiBrowser_instances, onChange_fn, onClear_fn, onClick_fn, onScroll_fn, onTabClick_fn;
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
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { SearchField } from '@sl-design-system/search-field';
import { event } from '@sl-design-system/shared';
import { Tab, TabGroup } from '@sl-design-system/tabs';
import { LitElement, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { repeat } from 'lit/directives/repeat.js';
import styles from './emoji-browser.scss.js';
import { EmojiService } from './emoji-service.js';
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
const GROUP_ICONS = {
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
export let EmojiBrowser = class extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    __privateAdd(this, _EmojiBrowser_instances);
    this.baseUrl = '';
    this.filteredEmojis = [];
    this.frequentlyUsedEmojis = [];
  }
  /** @internal */
  static get scopedElements() {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-search-field': SearchField,
      'sl-tab': Tab,
      'sl-tab-group': TabGroup
    };
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.baseUrl) {
      this.service = new EmojiService(this.baseUrl);
    } else {
      throw new Error(
        'The `baseUrl` property is required when using the sl-emoji-browser component.'
      );
    }
  }
  async willUpdate(changes) {
    super.willUpdate(changes);
    if (changes.has('frequentlyUsed')) {
      const emojis = await this.service?.getEmojis(this.locale);
      this.frequentlyUsedEmojis = this.frequentlyUsed
        ?.split(' ')
        .map(unicode => emojis?.find(emoji => emoji.unicode === unicode))
        .filter(Boolean);
    }
    if (changes.has('locale')) {
      this.emojis = await this.service?.getGroupedEmojis(this.locale);
    }
    if (changes.has('query')) {
      if (this.query) {
        this.filteredEmojis = (await this.service?.findEmojis(this.locale, this.query)) ?? [];
      } else {
        this.filteredEmojis = [];
      }
    }
  }
  render() {
    return html`
      <sl-tab-group>
        ${
          this.frequentlyUsedEmojis?.length
            ? html`
                <sl-tab
                  @click=${__privateMethod(this, _EmojiBrowser_instances, onTabClick_fn)}
                  id="group-frequently-used">
                  <sl-icon name="far-clock" slot="icon"></sl-icon>
                </sl-tab>
              `
            : nothing
        }
        ${map(
          this.emojis?.keys(),
          group => html`
            <sl-tab
              @click=${__privateMethod(this, _EmojiBrowser_instances, onTabClick_fn)}
              .id=${`group-${group.key}`}>
              <sl-icon .name=${GROUP_ICONS[group.order]} slot="icon"></sl-icon>
            </sl-tab>
          `
        )}
      </sl-tab-group>

      <div @scroll=${__privateMethod(this, _EmojiBrowser_instances, onScroll_fn)} part="wrapper">
        <sl-search-field
          @sl-change=${__privateMethod(this, _EmojiBrowser_instances, onChange_fn)}
          @sl-clear=${__privateMethod(this, _EmojiBrowser_instances, onClear_fn)}
          .placeholder=${msg('Search', { id: 'sl.emojiBrowser.search' })}
          .value=${this.query}></sl-search-field>

        ${
          this.filteredEmojis.length
            ? this.renderEmojis(this.filteredEmojis)
            : html`
                ${
                  this.frequentlyUsedEmojis?.length
                    ? html`
                        <div id="frequently-used" class="heading">
                          ${msg('Frequently Used', { id: 'sl.emojiBrowser.frequentlyUsed' })}
                        </div>
                        ${this.renderEmojis(this.frequentlyUsedEmojis)}
                      `
                    : nothing
                }
                ${map(
                  this.emojis?.entries(),
                  ([group, emojis]) => html`
                    <div .id=${group.key} class="heading">${group.message}</div>
                    ${this.renderEmojis(emojis)}
                  `
                )}
              `
        }
      </div>
    `;
  }
  renderEmojis(emojis) {
    return html`
      <ul class="emojis">
        ${repeat(
          emojis,
          emoji => emoji.unicode,
          emoji => html`
            <li class="emoji">
              <sl-button
                @click=${() => __privateMethod(this, _EmojiBrowser_instances, onClick_fn).call(this, emoji)}
                aria-label=${emoji.label}
                fill="ghost">
                ${emoji.unicode}
              </sl-button>
            </li>
          `
        )}
      </ul>
    `;
  }
};
_EmojiBrowser_instances = new WeakSet();
onChange_fn = function ({ detail: query }) {
  this.query = query;
};
onClear_fn = function () {
  this.query = '';
};
onClick_fn = function (emoji) {
  this.selectEvent.emit(emoji);
};
onScroll_fn = function (event2) {
  const headings = Array.from(this.renderRoot.querySelectorAll('.heading')).reverse(),
    { clientHeight, offsetTop, scrollHeight, scrollTop } = event2.target;
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
};
onTabClick_fn = function (event2) {
  const tab = event2.target.closest('sl-tab'),
    key = tab?.id.split('group-').at(1);
  if (key) {
    this.renderRoot.querySelector(`#${key}`)?.scrollIntoView();
  }
};
/** @internal */
EmojiBrowser.styles = styles;
__decorateClass([property({ attribute: 'base-url' })], EmojiBrowser.prototype, 'baseUrl', 2);
__decorateClass([state()], EmojiBrowser.prototype, 'filteredEmojis', 2);
__decorateClass(
  [property({ attribute: 'frequently-used' })],
  EmojiBrowser.prototype,
  'frequentlyUsed',
  2
);
__decorateClass([state()], EmojiBrowser.prototype, 'frequentlyUsedEmojis', 2);
__decorateClass([state()], EmojiBrowser.prototype, 'emojis', 2);
__decorateClass([property()], EmojiBrowser.prototype, 'locale', 2);
__decorateClass([property()], EmojiBrowser.prototype, 'query', 2);
__decorateClass([event({ name: 'sl-select' })], EmojiBrowser.prototype, 'selectEvent', 2);
EmojiBrowser = __decorateClass([localized()], EmojiBrowser);
//# sourceMappingURL=emoji-browser.js.map
