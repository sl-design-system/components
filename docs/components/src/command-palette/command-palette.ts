import { faArrowTurnDownLeft, faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import styles from './command-palette.css' with { type: 'css' };

Icon.register(faArrowTurnDownLeft, faMagnifyingGlass);

/** A single command shown in the palette. */
export interface Command {
  /** Unique identifier, also used as the DOM id of the option. */
  id: string;

  /** The text shown for the command. */
  label: string;

  /** Optional icon name (e.g. `far-file-lines`) shown before the label. */
  icon?: string;

  /** Optional extra terms used when filtering, in addition to the label. */
  keywords?: string[];

  /** Optional URL navigated to when the command is selected. */
  url?: string;
}

/** Fired when a command is selected. */
export type DocCommandSelectEvent = CustomEvent<Command>;

/**
 * A visually lightweight command palette modal. Type to filter a list of commands, navigate with
 * the arrow keys and select with Enter. A legend with keyboard hints is shown at the bottom.
 *
 * @fires doc-command-select - Fired with the selected command.
 */
export class CommandPalette extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static styles: CSSResultGroup = styles;

  @query('dialog') dialog?: HTMLDialogElement;

  @query('input') input?: HTMLInputElement;

  /** The commands available in the palette. */
  @property({ type: Array }) commands: Command[] = [];

  /** Index of the currently highlighted command, or -1 if none. */
  @state() activeIndex = -1;

  /** The current query string. */
  @state() query = '';

  override connectedCallback(): void {
    super.connectedCallback();

    document.addEventListener('keydown', this.#onKeydown);
  }

  override disconnectedCallback(): void {
    document.removeEventListener('keydown', this.#onKeydown);

    super.disconnectedCallback();
  }

  render(): TemplateResult {
    const results = this.#filter();

    return html`
      <dialog
        @click=${this.#onBackdropClick}
        @keydown=${this.#onDialogKeydown}
        aria-label="Command palette">
        <div class="search" role="presentation">
          <sl-icon name="far-magnifying-glass"></sl-icon>
          <!-- eslint-disable-next-line lit-a11y/aria-activedescendant-has-tabindex -->
          <input
            @input=${this.#onInput}
            .value=${this.query}
            aria-activedescendant=${this.activeIndex >= 0 && results[this.activeIndex]
              ? `command-${results[this.activeIndex].id}`
              : nothing}
            aria-autocomplete="list"
            aria-controls="command-list"
            aria-expanded="true"
            aria-label="Type a command or search"
            autocomplete="off"
            placeholder="Type a command or search…"
            role="combobox"
            spellcheck="false"
            type="text" />
        </div>

        ${this.#renderResults(results)}

        <footer>
          <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
          <span>
            <kbd><sl-icon name="far-arrow-turn-down-left"></sl-icon></kbd> to select
          </span>
          <span><kbd>esc</kbd> to close</span>
        </footer>
      </dialog>
    `;
  }

  #renderResults(results: Command[]): TemplateResult {
    if (results.length === 0) {
      return html`
        <p class="message">No results found${this.query ? html`for “${this.query}”` : nothing}.</p>
      `;
    }

    return html`
      <ul class="results" role="listbox" id="command-list" aria-label="Commands">
        ${results.map(
          (command, index) => html`
            <li
              id="command-${command.id}"
              role="option"
              class=${index === this.activeIndex ? 'active' : nothing}
              aria-selected=${index === this.activeIndex || nothing}
              @click=${() => this.#select(command)}
              @pointermove=${() => (this.activeIndex = index)}>
              ${command.icon ? html`<sl-icon name=${command.icon}></sl-icon>` : nothing}
              <span class="label">${command.label}</span>
            </li>
          `
        )}
      </ul>
    `;
  }

  /** Opens the palette and focuses the input. */
  show(): void {
    this.dialog?.showModal();
    this.query = '';
    this.activeIndex = this.commands.length > 0 ? 0 : -1;

    requestAnimationFrame(() => this.input?.focus());
  }

  /** Closes the palette. */
  close(): void {
    this.dialog?.close();
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
      this.close();
      return;
    }

    const results = this.#filter();

    if (results.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = this.activeIndex < results.length - 1 ? this.activeIndex + 1 : 0;
      this.#scrollActiveIntoView();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = this.activeIndex > 0 ? this.activeIndex - 1 : results.length - 1;
      this.#scrollActiveIntoView();
    } else if (event.key === 'Enter' && this.activeIndex >= 0) {
      event.preventDefault();

      const command = results[this.activeIndex];
      if (command) {
        this.#select(command);
      }
    }
  }

  #onInput(event: Event): void {
    this.query = (event.target as HTMLInputElement).value;
    this.activeIndex = this.#filter().length > 0 ? 0 : -1;
  }

  #onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      this.show();
    }
  };

  /** Filters the commands by the current query. */
  #filter(): Command[] {
    const query = this.query.trim().toLowerCase();

    if (!query) {
      return this.commands;
    }

    return this.commands.filter(command => {
      const haystack = [command.label, ...(command.keywords ?? [])].join(' ').toLowerCase();

      return haystack.includes(query);
    });
  }

  #select(command: Command): void {
    this.close();

    this.dispatchEvent(
      new CustomEvent<Command>('doc-command-select', {
        bubbles: true,
        composed: true,
        detail: command
      })
    );

    if (command.url) {
      window.location.href = command.url;
    }
  }

  #scrollActiveIntoView(): void {
    const items = this.renderRoot.querySelectorAll('.results li');

    items[this.activeIndex]?.scrollIntoView({ block: 'nearest' });
  }
}
