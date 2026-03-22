import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { SearchField } from '@sl-design-system/search-field';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { query, state } from 'lit/decorators.js';
import styles from './search.css' with { type: 'css' };

Icon.register(faMagnifyingGlass);

export class Search extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-search-field': SearchField
    };
  }

  /** @internal */
  static styles: CSSResultGroup = styles;

  #onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      this.#open();
    }
  };

  @query('dialog') dialog?: HTMLDialogElement;

  @state() activeIndex = -1;

  override connectedCallback(): void {
    super.connectedCallback();

    document.addEventListener('keydown', this.#onKeydown);
  }

  override disconnectedCallback(): void {
    document.removeEventListener('keydown', this.#onKeydown);

    super.disconnectedCallback();
  }

  render(): TemplateResult {
    const isMac = navigator.platform.includes('Mac');

    return html`
      <button @click=${this.#open} type="button">
        <sl-icon name="far-magnifying-glass"></sl-icon>
        <span>Search</span>
        <kbd>${isMac ? '⌘' : 'Ctrl+'}K</kbd>
      </button>

      <dialog @click=${this.#onBackdropClick} @keydown=${this.#onDialogKeydown} aria-label="Search documentation">
        <div class="container">
          <!-- eslint-disable-next-line lit-a11y/aria-activedescendant-has-tabindex -->
          <sl-search-field
            aria-label="Search documentation"
            aria-activedescendant=${this.activeIndex >= 0 ? `result-${this.activeIndex}` : nothing}
            aria-controls="search-results"
            placeholder="Search documentation..."
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
          ></sl-search-field>

          <ul class="results" role="listbox" id="search-results" aria-label="Search results">
            <li
              id="result-0"
              role="option"
              class=${this.activeIndex === 0 ? 'active' : nothing}
              aria-selected=${this.activeIndex === 0 || nothing}
            >
              <sl-icon name="far-magnifying-glass"></sl-icon>
              <div class="result-content">
                <span class="result-title">Button</span>
                <span class="result-description">Buttons represent actions that are available to the user.</span>
                <span class="result-path">docs/components/button</span>
              </div>
            </li>
            <li
              id="result-1"
              role="option"
              class=${this.activeIndex === 1 ? 'active' : nothing}
              aria-selected=${this.activeIndex === 1 || nothing}
            >
              <sl-icon name="far-magnifying-glass"></sl-icon>
              <div class="result-content">
                <span class="result-title">Dialog</span>
                <span class="result-description">
                  Dialogs, sometimes called "modals", appear above the page content.
                </span>
                <span class="result-path">docs/components/dialog</span>
              </div>
            </li>
            <li
              id="result-2"
              role="option"
              class=${this.activeIndex === 2 ? 'active' : nothing}
              aria-selected=${this.activeIndex === 2 || nothing}
            >
              <sl-icon name="far-magnifying-glass"></sl-icon>
              <div class="result-content">
                <span class="result-title">Drawer</span>
                <span class="result-description">Drawers slide in from a container to expose additional options.</span>
                <span class="result-path">docs/components/drawer</span>
              </div>
            </li>
            <li
              id="result-3"
              role="option"
              class=${this.activeIndex === 3 ? 'active' : nothing}
              aria-selected=${this.activeIndex === 3 || nothing}
            >
              <sl-icon name="far-magnifying-glass"></sl-icon>
              <div class="result-content">
                <span class="result-title">Visual Tests</span>
                <span class="result-description">A page to visually test component styles against native styles.</span>
                <span class="result-path">docs/resources/visual-tests</span>
              </div>
            </li>
          </ul>
        </div>
      </dialog>
    `;
  }

  #open(): void {
    this.dialog?.showModal();
    this.activeIndex = -1;

    requestAnimationFrame(() => {
      this.renderRoot.querySelector<HTMLElement>('sl-search-field')?.focus();
    });
  }

  #onBackdropClick(event: MouseEvent): void {
    const dialog = this.dialog;

    if (!dialog || dialog !== event.composedPath()[0]) {
      return;
    }

    const rect = dialog.getBoundingClientRect();

    if (
      event.clientY < rect.top ||
      event.clientY > rect.bottom ||
      event.clientX < rect.left ||
      event.clientX > rect.right
    ) {
      dialog.close();
    }
  }

  #onDialogKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.dialog?.close();
      return;
    }

    const items = this.renderRoot.querySelectorAll('.results li');

    if (!items.length) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = this.activeIndex < items.length - 1 ? this.activeIndex + 1 : 0;
      items[this.activeIndex]?.scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = this.activeIndex > 0 ? this.activeIndex - 1 : items.length - 1;
      items[this.activeIndex]?.scrollIntoView({ block: 'nearest' });
    } else if ((event.key === 'Enter' || event.key === ' ') && this.activeIndex >= 0) {
      event.preventDefault();
      items[this.activeIndex]?.dispatchEvent(new Event('click', { bubbles: true }));
    }
  }
}
