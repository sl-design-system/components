var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if ((decorator = decorators[i]))
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { MenuButton } from '@sl-design-system/menu';
import { ToggleButton } from '@sl-design-system/toggle-button';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './card.scss.js';
const interactiveSelector = [
  'a',
  'button',
  'input',
  'select',
  'textarea',
  '[role="button"]',
  '[slot="actions"]',
  '[slot="menu-button"]',
  'sl-button',
  'sl-menu-button',
  'sl-toggle-button'
].join(',');
export class Card extends ScopedElementsMixin(LitElement) {
  constructor() {
    super(...arguments);
    /** Observe the card width. */
    this.#resizeObserver = new ResizeObserver(() => {
      this.#setOrientation();
      this.#setLineClamp();
    });
    this.orientation = 'horizontal';
    this.#onClick = event => {
      if (!this.#titleLink || this.#shouldIgnoreClick(event)) {
        return;
      }
      this.#titleLink.click();
    };
  }
  static {
    /** @internal */
    this.styles = styles;
  }
  #resizeObserver;
  /** @internal The link in the title slot that receives card clicks. */
  #titleLink;
  connectedCallback() {
    super.connectedCallback();
    this.#setOrientation();
    this.#setGridSpan();
    this.addEventListener('click', this.#onClick);
    this.#resizeObserver?.observe(this);
  }
  disconnectedCallback() {
    this.removeEventListener('click', this.#onClick);
    this.#resizeObserver?.disconnect();
    super.disconnectedCallback();
  }
  updated(changes) {
    super.updated(changes);
    if (this.subgrid) {
      this.#setGridSpan();
    }
    if (changes.has('orientation')) {
      this.#setOrientation();
    }
    if (changes.has('imageBackdrop')) {
      this.#setBackdrop();
    }
    if (changes.has('subgrid')) {
      this.#setMedia();
    }
  }
  render() {
    return html`
      <figure><slot name="media" @slotchange=${this.#setMedia}></slot></figure>
      <div class="content">
        <div class="header">
          <slot class="title" @slotchange=${this.#setTitle}></slot>
          <slot name="header"></slot>
        </div>
        <slot name="menu-button" @slotchange=${this.#setMenuButton}></slot>
        <slot name="body" @slotchange=${this.#setLineClamp}></slot>
        <slot name="actions" @slotchange=${this.#setActions}></slot>
      </div>
    `;
  }
  #setOrientation() {
    if (!this.media || this.media.length === 0) {
      return;
    }
    const breakpoint =
      parseInt(window.getComputedStyle(this).getPropertyValue('--sl-card-horizontal-breakpoint')) ||
      0;
    this.classList.remove('sl-horizontal');
    if (
      this.orientation === 'horizontal' &&
      (this.getBoundingClientRect().width > breakpoint || breakpoint === 0)
    ) {
      this.classList.add('sl-horizontal');
    }
    requestAnimationFrame(() => {
      this.#setGridSpan();
      this.#setMedia();
    });
  }
  #setMedia() {
    this.classList.remove('sl-has-media');
    this.classList.remove('sl-media-explicit-size');
    if (!this.media || this.media.length === 0) {
      return;
    }
    if (
      this.subgrid ||
      window.getComputedStyle(this).getPropertyValue('--sl-card-media-size') ||
      this.classList.contains('sl-horizontal')
    ) {
      this.classList.add('sl-media-explicit-size');
    }
    this.classList.add('sl-has-media');
    if (this.imageBackdrop) {
      this.#setBackdrop();
    }
  }
  #setBackdrop() {
    if (!this.media || this.media.length === 0 || !this.fitImage || !this.imageBackdrop) {
      this.shadowRoot?.querySelector('.backdrop')?.remove();
      return;
    }
    const media = this.media[0];
    if (this.shadowRoot?.querySelector('.backdrop')) {
      this.shadowRoot
        .querySelector('.backdrop')
        ?.setAttribute('href', media.getAttribute('href') || '');
    } else {
      const backdrop = this.shadowRoot?.querySelector('figure');
      if (!backdrop) {
        return;
      }
      const backdropClone = media.cloneNode(true);
      backdropClone.classList.add('backdrop');
      backdrop.appendChild(backdropClone);
    }
  }
  #setLineClamp() {
    const article = this.renderRoot.querySelector('slot[name="body"]');
    if (!article || article.assignedNodes({ flatten: true }).length === 0) {
      this.classList.remove('sl-has-article');
      article?.style.removeProperty('--_line-clamp');
      this.#setGridSpan();
      return;
    }
    this.classList.add('sl-has-article');
    article.style.removeProperty('--_line-clamp');
    const lineHeight = getComputedStyle(article).lineHeight;
    const lineHeightFont =
      !lineHeight || lineHeight === 'normal'
        ? parseInt(getComputedStyle(article).fontSize) * 1.2
        : parseInt(lineHeight);
    const lines = Math.floor(article.getBoundingClientRect().height / lineHeightFont);
    if (!isNaN(lines) && lines > 0) {
      article.style.setProperty('--_line-clamp', lines.toString());
    }
    this.#setGridSpan();
  }
  #setActions() {
    this.#setGridSpan();
    if (!this.shadowRoot) {
      return;
    }
    const actions = this.shadowRoot.querySelector('slot[name="actions"]');
    if (!actions || actions.assignedNodes({ flatten: true }).length === 0) {
      this.classList.remove('sl-has-actions');
    } else {
      this.classList.add('sl-has-actions');
    }
  }
  #setGridSpan() {
    let verticalElements = 1;
    let horizontalElements = 1;
    if (!this.shadowRoot) {
      return;
    }
    const article = this.shadowRoot.querySelector('slot[name="body"]');
    if (article && article.assignedNodes({ flatten: true }).length > 0) {
      verticalElements++;
    }
    const actions = this.shadowRoot.querySelector('slot[name="actions"]');
    if (actions && actions.assignedNodes({ flatten: true }).length > 0) {
      verticalElements++;
    }
    if (!this.classList.contains('sl-horizontal') && this.media && this.media.length > 0) {
      verticalElements++;
    }
    if (this.classList.contains('sl-horizontal') && this.media && this.media.length > 0) {
      horizontalElements++;
    }
    this.style.setProperty('--_vertical-elements', verticalElements.toString());
    this.style.setProperty('--_horizontal-elements', horizontalElements.toString());
  }
  #setTitle() {
    if (!this.shadowRoot) {
      return;
    }
    const title = this.shadowRoot.querySelector('slot.title');
    this.#titleLink = title
      ?.assignedElements({ flatten: true })
      .find(el => el instanceof HTMLAnchorElement);
    this.classList.toggle('sl-has-link', !!this.#titleLink);
  }
  #setMenuButton() {
    if (!this.shadowRoot) {
      return;
    }
    const menu = this.shadowRoot.querySelector('slot[name="menu-button"]');
    if (!menu || menu.assignedNodes({ flatten: true }).length === 0) {
      this.classList.remove('sl-has-menu-button');
    } else {
      const menuButton = menu.assignedNodes({ flatten: true })[0];
      if (menuButton instanceof MenuButton) {
        this.classList.add('sl-has-menu-button');
        menuButton.fill = 'ghost';
        menuButton.size = 'md';
      } else if (menuButton instanceof ToggleButton) {
        this.classList.add('sl-has-menu-button');
        menuButton.size = 'md';
      }
    }
  }
  #onClick;
  #shouldIgnoreClick(event) {
    return event.composedPath().some(el => {
      if (el === this.#titleLink) {
        return true;
      }
      if (el instanceof HTMLSlotElement) {
        return ['actions', 'menu-button'].includes(el.name) || el.classList.contains('title');
      }
      return el instanceof Element && el.matches(interactiveSelector);
    });
  }
}
__decorateClass([queryAssignedElements({ slot: 'media' })], Card.prototype, 'media', 2);
__decorateClass(
  [property({ reflect: true, attribute: 'fit-image', type: Boolean })],
  Card.prototype,
  'fitImage',
  2
);
__decorateClass(
  [property({ reflect: true, attribute: 'media-margin', type: Boolean })],
  Card.prototype,
  'mediaMargin',
  2
);
__decorateClass(
  [property({ reflect: true, attribute: 'image-backdrop', type: Boolean })],
  Card.prototype,
  'imageBackdrop',
  2
);
__decorateClass([property({ type: Boolean })], Card.prototype, 'subgrid', 2);
__decorateClass([property({ reflect: true })], Card.prototype, 'orientation', 2);
//# sourceMappingURL=card.js.map
