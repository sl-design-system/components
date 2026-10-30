import { msg, str } from '@lit/localize';
import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { Listbox, Option } from '@sl-design-system/listbox';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { type SlClearEvent } from '@sl-design-system/shared/events.js';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './search-field.css' with { type: 'css' };
import { matchSuggestion } from './suggestion-matching.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-search': SlSearchEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-search-field': SearchField;
  }
}

export type SlSearchEvent = CustomEvent<string>;

export type SearchFieldAutocomplete = 'off' | 'inline' | 'list' | 'both';
export type SearchFieldMatching = 'starts-with' | 'contains';

let nextSuggestionId = 0;

export type SearchFieldShape = 'rect' | 'pill';

export type SearchFieldSize = 'md' | 'lg';

/**
 * Search field component.
 *
 * @slot default - Native option elements supplying suggested search phrases.
 * @slot input - The slot for the input element
 */
export class SearchField extends TextField {
  /** @internal */
  static override styles: CSSResultGroup = [TextField.styles, styles];

  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return { ...super.scopedElements, 'sl-listbox': Listbox, 'sl-option': Option };
  }

  /** Suggestion mode. Native browser autocomplete is disabled. */
  @property() override autocomplete: SearchFieldAutocomplete = 'off';

  /** Suggested search phrases. Can be replaced when asynchronous suggestions arrive. */
  @property({ attribute: false }) suggestions?: string[];

  /** How suggested phrases are matched against the typed words. */
  @property() matching: SearchFieldMatching = 'starts-with';

  /** Minimum number of non-space characters before suggesting phrases. */
  @property({ type: Number, attribute: 'suggestion-threshold' }) suggestionThreshold = 3;

  /** Whether the suggestions cover following content or take up space. */
  @property({ reflect: true, attribute: 'suggestion-placement' }) suggestionPlacement:
    | 'overlay'
    | 'flow' = 'overlay';

  /** Whether suggestions are being fetched. Ordinary searching remains available. */
  @property({ type: Boolean }) loading = false;

  /** Whether suggestions could not be fetched. Ordinary searching remains available. */
  @property({ type: Boolean }) unavailable = false;

  @state() private suggestionOpen = false;

  #listbox?: Listbox;
  #message?: HTMLDivElement;
  #inlineAnnouncement?: HTMLDivElement;
  #options: Option[] = [];
  #activeIndex = -1;
  @state() private inlineValue?: string;
  #composing = false;
  #suggestionsDirty = true;
  #sourceObserver = new MutationObserver(records => {
    if (
      records.some(
        record =>
          record.target instanceof HTMLOptionElement ||
          record.target.parentElement instanceof HTMLOptionElement ||
          [...record.addedNodes, ...record.removedNodes].some(
            node => node instanceof HTMLOptionElement
          )
      )
    ) {
      this.#suggestionsDirty = true;
      this.requestUpdate();
    }
  });

  /** @internal Debounce timer for search events */
  #debounceTimer?: ReturnType<typeof setTimeout>;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    keydown: this.#onKeyDown,
    focusout: this.#onFocusOut,
    focusin: this.#onFocusIn,
    select: () => {
      if (
        this.input.selectionStart !== this.value?.length ||
        this.input.selectionEnd !== this.value?.length
      )
        this.#discardInline();
    },
    scroll: { handler: () => this.requestUpdate(), options: true },
    compositionstart: () => {
      this.#composing = true;
      this.#discardInline();
      this.#clearDebounceTimer();
    },
    compositionend: () => {
      this.#composing = false;
      this.input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    },
    pointerdown: (event: PointerEvent) => {
      if (event.target === this.input) this.#discardInline();
    }
  });

  /** @internal Emits when the user clears the field. */
  @event({ name: 'sl-clear' }) clearEvent!: EventEmitter<SlClearEvent>;

  /** @internal Emits when the user presses enter. */
  @event({ name: 'sl-search' }) searchEvent!: EventEmitter<SlSearchEvent>;

  /** The shape of the search field. */
  @property({ reflect: true }) override shape?: SearchFieldShape;

  /** The size of the search field. */
  @property({ reflect: true }) override size?: SearchFieldSize;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.#inlineAnnouncement) {
      this.#inlineAnnouncement = document.createElement('div');
      this.#inlineAnnouncement.id = `sl-search-inline-${nextSuggestionId++}`;
      this.#inlineAnnouncement.slot = 'inline-announcement';
      this.#inlineAnnouncement.setAttribute('role', 'status');
      this.#inlineAnnouncement.setAttribute('aria-live', 'polite');
      this.#inlineAnnouncement.setAttribute('aria-atomic', 'true');
      this.append(this.#inlineAnnouncement);
    }

    this.#sourceObserver.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['label', 'value', 'disabled']
    });

    // This is a workaround, because :has is not working in Safari and Firefox with :host element as it works in Chrome
    const style = document.createElement('style');
    style.innerHTML = `
       sl-search-field:has(input:hover):not(:focus-within) {
          --_bg-opacity: var(--sl-opacity-interactive-plain-hover);
       }
      `;
    this.prepend(style);
  }

  override disconnectedCallback(): void {
    this.#clearDebounceTimer();
    this.#sourceObserver.disconnect();
    this.#closeSuggestions();

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <div class="field" part="field">${super.render()}</div>
      <slot name="suggestions" class="suggestions"></slot>
      <slot name="inline-announcement" class="inline-announcement"></slot>
      <slot
        @slotchange=${() => {
          this.#suggestionsDirty = true;
          this.requestUpdate();
        }}
        hidden></slot>
    `;
  }

  override renderInputSlot(): TemplateResult {
    return html`
      <div class="input-wrapper">
        ${super.renderInputSlot()}
        ${
          this.inlineValue
            ? html`
                <span
                  aria-hidden="true"
                  class="inline-completion"
                  style=${`transform: translate(${-this.input.scrollLeft}px, -50%)`}>
                  <span class="inline-prefix">${this.value}</span
                  ><span class="inline-suffix"
                    >${this.inlineValue.slice(this.value?.length ?? 0)}</span
                  >
                </span>
              `
            : nothing
        }
      </div>
    `;
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);
    if (this.disabled || this.readonly || this.autocomplete === 'off') this.suggestionOpen = false;
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);
    if (
      this.#suggestionsDirty ||
      [
        'value',
        'autocomplete',
        'suggestions',
        'matching',
        'suggestionThreshold',
        'loading',
        'unavailable',
        'suggestionOpen',
        'disabled',
        'readonly'
      ].some(key => changes.has(key as keyof SearchField))
    ) {
      this.#suggestionsDirty = false;
      this.#renderSuggestions();
    }
    this.#updateSuggestionText();
  }

  protected override updateInputElement(input: HTMLInputElement): void {
    super.updateInputElement(input);
    input.autocomplete = 'off';
    input.setAttribute('role', 'searchbox');
    input.setAttribute(
      'aria-autocomplete',
      this.autocomplete === 'off' ? 'none' : this.autocomplete
    );
  }

  protected override onKeydown(event: KeyboardEvent): void {
    if (!this.#composing && !event.isComposing) super.onKeydown(event);
  }

  #getSuggestions(): string[] {
    return (
      this.suggestions ??
      Array.from(this.querySelectorAll('option'))
        .filter(option => !option.disabled)
        .map(option => option.label)
    );
  }

  #renderSuggestions(): void {
    this.#discardInline();
    const query = this.value ?? '',
      eligible =
        this.suggestionOpen &&
        !this.#composing &&
        !this.disabled &&
        !this.readonly &&
        this.autocomplete !== 'off' &&
        Array.from(query.normalize('NFC').replace(/\s/g, '')).length >=
          Math.max(1, this.suggestionThreshold),
      phrases =
        eligible && !this.loading && !this.unavailable
          ? this.#getSuggestions().filter(label => {
              const match = matchSuggestion(label, query);
              return match && (this.matching === 'contains' || match.prefix);
            })
          : [],
      showList = eligible && (this.autocomplete === 'list' || this.autocomplete === 'both');

    if (!this.#listbox) {
      this.#listbox = this.shadowRoot!.createElement('sl-listbox');
      this.#listbox.id = `sl-search-suggestions-${nextSuggestionId++}`;
      this.#listbox.slot = 'suggestions';
      this.#listbox.addEventListener('focus', () =>
        this.#setActive(Math.max(0, this.#activeIndex))
      );
      this.#listbox.addEventListener('keydown', event => this.#onListKeyDown(event));
      this.append(this.#listbox);
      this.#message = document.createElement('div');
      this.#message.slot = 'suggestions';
      this.#message.setAttribute('role', 'status');
      this.append(this.#message);
    }

    const listFocused = this.#listbox.matches(':focus'),
      activeValue: unknown = this.#options[this.#activeIndex]?.value;
    this.#options = showList
      ? phrases.map(label => {
          const option = this.shadowRoot!.createElement('sl-option'),
            { start, end } = matchSuggestion(label, query)!;
          option.id = `${this.#listbox!.id}-${nextSuggestionId++}`;
          option.value = label;
          const before = label.slice(0, start),
            match = label.slice(start, end),
            after = label.slice(end);
          const strong = document.createElement('strong');
          strong.textContent = this.matching === 'contains' ? match : after;
          const phrase = document.createElement('span');
          if (this.matching === 'contains') phrase.append(before, strong, after);
          else phrase.append(match, strong);
          option.append(phrase);
          option.addEventListener('pointerdown', event => event.preventDefault());
          option.addEventListener('click', () => this.#acceptSuggestion(label));
          return option;
        })
      : [];
    this.#listbox.replaceChildren(...this.#options);
    if (listFocused && !this.#options.length) this.input.focus();
    this.#listbox.hidden = !showList || !phrases.length;
    this.#listbox.tabIndex = showList && phrases.length ? 0 : -1;
    this.#activeIndex = -1;
    this.#listbox.removeAttribute('aria-activedescendant');
    if (listFocused && this.#options.length)
      this.#setActive(
        Math.max(
          0,
          this.#options.findIndex(option => option.value === activeValue)
        )
      );
    this.#message!.hidden = !showList || !!phrases.length;
    if (showList && phrases.length) this.input.setAttribute('aria-controls', this.#listbox.id);
    else this.input.removeAttribute('aria-controls');

    if (
      eligible &&
      !this.#composing &&
      (this.autocomplete === 'inline' || this.autocomplete === 'both') &&
      this.input.matches(':focus') &&
      query === query.trim() &&
      this.input.selectionStart === query.length &&
      this.input.selectionEnd === query.length
    ) {
      const completion = phrases.find(label => {
        const match = matchSuggestion(label, query)!;
        return match.prefix && match.complete && match.end < label.length;
      });
      if (completion) {
        this.inlineValue = query + completion.slice(matchSuggestion(completion, query)!.end);
      }
    }
  }

  #updateSuggestionText(): void {
    if (this.#inlineAnnouncement) {
      const announcement = this.inlineValue
        ? msg(str`Suggested completion: ${this.inlineValue}. Press Right Arrow or End to accept.`, {
            id: 'sl.searchField.inlineCompletion'
          })
        : '';
      if (this.#inlineAnnouncement.textContent !== announcement)
        this.#inlineAnnouncement.textContent = announcement;
      const descriptions = new Set(
        (this.input.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean)
      );
      if (announcement) descriptions.add(this.#inlineAnnouncement.id);
      else descriptions.delete(this.#inlineAnnouncement.id);
      if (descriptions.size)
        this.input.setAttribute('aria-describedby', [...descriptions].join(' '));
      else this.input.removeAttribute('aria-describedby');
    }
    this.#listbox?.setAttribute(
      'aria-label',
      msg('Suggested searches', { id: 'sl.searchField.suggestions' })
    );
    if (this.#message) {
      this.#message.textContent = this.#message.hidden
        ? ''
        : this.loading
          ? msg('Finding suggestions…', { id: 'sl.searchField.loading' })
          : this.unavailable
            ? msg('Suggestions unavailable', { id: 'sl.searchField.unavailable' })
            : msg('No suggested searches', { id: 'sl.searchField.empty' });
    }
  }

  #discardInline(): void {
    this.inlineValue = undefined;
  }

  #closeSuggestions(): void {
    this.#discardInline();
    this.suggestionOpen = false;
  }

  #onFocusIn(event: FocusEvent): void {
    if (
      event.target === this.input &&
      this.autocomplete !== 'off' &&
      !this.disabled &&
      !this.readonly &&
      !this.suggestionOpen
    )
      this.suggestionOpen = true;
  }

  #onFocusOut(event: FocusEvent): void {
    if (
      !event.relatedTarget ||
      (!this.contains(event.relatedTarget as Node) &&
        !this.renderRoot.contains(event.relatedTarget as Node))
    ) {
      this.#closeSuggestions();
    }
  }

  #setActive(index: number): void {
    if (!this.#options.length) return;
    this.#activeIndex = (index + this.#options.length) % this.#options.length;
    this.#options.forEach((option, i) => {
      option.toggleAttribute('current', i === this.#activeIndex);
      option.selected = i === this.#activeIndex;
      option.setAttribute('aria-selected', String(i === this.#activeIndex));
    });
    this.#listbox!.setAttribute('aria-activedescendant', this.#options[this.#activeIndex].id);
    this.#options[this.#activeIndex].scrollIntoView({ block: 'nearest' });
  }

  #onListKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.input.focus();
      this.#closeSuggestions();
    } else if (event.key === 'Enter' && this.#activeIndex >= 0) {
      event.preventDefault();
      event.stopPropagation();
      this.#acceptSuggestion(this.#options[this.#activeIndex].value as string);
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      this.#setActive(
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? this.#options.length - 1
            : this.#activeIndex + (event.key === 'ArrowDown' ? 1 : -1)
      );
    }
  }

  #acceptSuggestion(label: string): void {
    this.#clearDebounceTimer();
    this.#discardInline();
    this.input.value = label;
    this.value = label;
    this.rawValue = label;
    this.changeEvent.emit(label);
    this.updateState({ dirty: true });
    this.updateValidity();
    this.input.focus();
    this.#closeSuggestions();
    this.searchEvent.emit(label);
  }

  override renderPrefix(): TemplateResult {
    return html`
      <slot name="prefix">
        <sl-icon name="search"></sl-icon>
      </slot>
    `;
  }

  override renderSuffix(): TemplateResult | typeof nothing {
    return this.value && !this.disabled && !this.readonly
      ? html`
          <button
            @click=${this.#onClick}
            @keydown=${this.#onClearButtonKeydown}
            aria-label=${msg('Clear text', { id: 'sl.searchField.clearText' })}>
            <sl-icon name="circle-xmark"></sl-icon>
            <sl-icon name="circle-xmark-solid"></sl-icon>
          </button>
        `
      : nothing;
  }

  /** Clears the value in the input element. */
  clear(): void {
    this.#closeSuggestions();
    this.value = '';
    this.input.value = '';
    this.rawValue = '';
    this.#clearDebounceTimer();
    this.searchEvent.emit('');
    this.clearEvent.emit();
  }

  #onClick(): void {
    this.#clearAndFocusInput();
  }

  #onClearButtonKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();

      this.#clearAndFocusInput();

      return;
    }

    if (event.key !== 'Enter') {
      return;
    }

    event.stopPropagation();
  }

  protected override onInput(event: Event & { target: HTMLInputElement }): void {
    this.inlineValue = undefined;
    super.onInput(event);
    if (this.#composing) return;
    this.suggestionOpen = this.autocomplete !== 'off';
    this.#suggestionsDirty = true;
    this.requestUpdate();
    this.#startDebounceTimer();
  }

  #onKeyDown(event: KeyboardEvent): void {
    if (this.disabled || this.#composing || event.isComposing || event.target !== this.input) {
      return;
    }

    if (
      this.inlineValue &&
      this.input.selectionStart === this.value?.length &&
      this.input.selectionEnd === this.value?.length &&
      !event.shiftKey &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      (event.key === 'ArrowRight' || event.key === 'End')
    ) {
      event.preventDefault();
      const completion = this.inlineValue;
      this.#discardInline();
      this.input.value = completion;
      this.input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
      return;
    }
    if (
      [
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End',
        'PageUp',
        'PageDown',
        'Tab',
        'Delete',
        'Backspace'
      ].includes(event.key)
    )
      this.#discardInline();
    if (['ArrowDown', 'ArrowUp'].includes(event.key) && this.#listbox && !this.#listbox.hidden) {
      event.preventDefault();
      this.#discardInline();
      this.#listbox.focus();
      this.#setActive(event.key === 'ArrowDown' ? 0 : this.#options.length - 1);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();

      this.#closeSuggestions();

      // Cancel debounced search and emit immediately
      this.#clearDebounceTimer();
      this.searchEvent.emit(this.value?.toString() ?? '');
    } else if (event.key === 'Escape') {
      event.preventDefault();

      if (this.suggestionOpen || this.inlineValue) this.#closeSuggestions();
      else this.clear();
    }
  }

  #clearAndFocusInput(): void {
    this.clear();
    this.input.focus();
  }

  #startDebounceTimer(): void {
    this.#clearDebounceTimer();

    this.#debounceTimer = setTimeout(() => {
      const value = this.value?.toString() ?? '';

      // Emit search event with current value; if empty, also emit clear event
      if (value.trim() !== '') {
        this.searchEvent.emit(value);
      } else {
        this.searchEvent.emit('');
        this.clearEvent.emit();
      }
    }, 300);
  }

  #clearDebounceTimer(): void {
    if (this.#debounceTimer !== undefined) {
      clearTimeout(this.#debounceTimer);
      this.#debounceTimer = undefined;
    }
  }
}
