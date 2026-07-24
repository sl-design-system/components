import { localized, msg, str } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import {
  type EventEmitter,
  ObserveAttributesMixin,
  event,
  getCharacterPluralSuffix,
  getPluralCategory
} from '@sl-design-system/shared';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
import { property } from 'lit/decorators.js';
import styles from './text-area.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-text-area': TextArea;
  }
}

export type TextAreaSize = 'md' | 'lg';

export type ResizeType = 'none' | 'vertical' | 'auto';

export type WrapType = 'soft' | 'hard';

type TextAreaCountState = 'default' | 'caution' | 'danger';

let nextUniqueId = 0;

/**
 * Multi line text area component.
 *
 * Internal: Slot count-description - internal only, not intended for consumer use. This slot
 * projects a visually-hidden `<span>` that mirrors the character count text into the composed tree.
 * It must be slotted (rather than left as an unslotted light DOM node) because browsers and screen
 * readers only follow `aria-describedby` ID references to elements that are part of the
 * composed/rendered tree. An unslotted element is invisible to the accessibility layer and the
 * count therefore stops being announced when the textarea is focused.
 *
 * @slot textarea - The slot for the textarea element.
 */
@localized()
export class TextArea extends ObserveAttributesMixin(
  FormControlMixin(ScopedElementsMixin(LitElement)),
  ['aria-describedby', 'aria-disabled', 'aria-label', 'aria-labelledby', 'aria-required']
) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** ID used to connect the character count to the textarea via aria-describedby. */
  #countId = `sl-text-area-count-${nextUniqueId++}`;

  /**
   * True when we have called `textarea.setCustomValidity(countMessage)`. Used to guard the clearing
   * call in `updateInternalValidity()` so we never unconditionally wipe a custom error set by a
   * user.
   */
  #countValiditySet = false;

  /** Keep count aria-describedby linkage resilient to external textarea attribute changes. */
  #describedByObserver = new MutationObserver(() => {
    const countDescriptionId = this.#getCountDescriptionId(),
      describedBy = this.textarea?.getAttribute('aria-describedby') ?? '';

    if (describedBy === this.#lastObservedDescribedBy) {
      return;
    }

    this.#lastObservedDescribedBy = describedBy;

    const hasCountDescription = describedBy.split(/\s+/).includes(countDescriptionId),
      shouldHaveCountDescription = this.#isCountVisible();

    if (hasCountDescription !== shouldHaveCountDescription || shouldHaveCountDescription) {
      this.#syncCountAriaDescription();
    }
  });

  /** True when the value is over the character limit and sets validation state. */
  #isOverLimitState = false;

  /** Last observed aria-describedby value to avoid redundant observer work. */
  #lastObservedDescribedBy = '';

  /** Observe the textarea width. */
  #observer = new ResizeObserver(() => {
    // Workaround for "ResizeObserver loop completed with undelivered notifications."
    requestAnimationFrame(() => this.#setSize());
  });

  /** The last count state, used to announce only when state changes. */
  #previousCountState?: TextAreaCountState;

  /** Whether the showCount overflow message may be shown (after reportValidity was called). */
  #showCountMessage = false;

  /** Snapshot of external show-validity before showCount temporarily forces invalid styling. */
  #showValidityBeforeCount?: string | null;

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<string>>;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** The textarea in the light DOM. */
  textarea!: HTMLTextAreaElement;

  /**
   * Specifies which type of data the browser can use to pre-fill the textarea.
   *
   * NOTE: Declare the type this way so it is backwards compatible with 4.9.5, which we still use in
   * `@sl-design-system/angular`.
   */
  @property() autocomplete?: typeof HTMLTextAreaElement.prototype.autocomplete;

  /** Whether the textarea is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /**
   * Maximum length (number of characters). Not recommended from a UX perspective, because it blocks
   * additional typing once the limit is reached and can cut off pasted text. Prefer `showCount` to
   * allow users to type or paste beyond the limit and then revise input.
   */
  @property({ type: Number, attribute: 'maxlength' }) maxLength?: number;

  /** Minimum length (number of characters). Not recommended from a UX perspective. */
  @property({ type: Number, attribute: 'minlength' }) minLength?: number;

  /** Placeholder text in the textarea. */
  @property() placeholder?: string;

  /** Whether you can interact with the textarea or if it is just a static, readonly display. */
  @property({ type: Boolean }) readonly?: boolean;

  /** Whether the textarea is a required field. */
  @property({ type: Boolean }) override required?: boolean;

  /** The way the textarea can be resized. */
  @property({ reflect: true }) resize: ResizeType = 'vertical';

  /**
   * The number of rows the textarea should have. For resize auto and vertical, this will determine
   * the _minimum_ height of the textarea. If not set, the component defaults to 3 rows.
   */
  @property({ type: Number }) rows?: number;

  /**
   * The maximum number of characters allowed (soft limit). When set, a character counter appears
   * below the textarea showing how many characters remain. When 90% of the limit is reached the
   * counter turns caution (orange). When the limit is exceeded it turns to a danger state, shows
   * how many characters are over the limit, and marks the textarea as invalid. Exceeding the limit
   * does not block input, the user can still type or paste more text and then edit it down.
   *
   * Please don't combine `showCount` with `maxLength`, as it will cause the textarea to block input
   * when the limit is reached. Use `showCount` alone to allow typing beyond the limit and show a
   * warning.
   */
  @property({ type: Number, attribute: 'show-count' }) showCount?: number;

  /** When set will cause the control to show it is valid after reportValidity is called. */
  @property({ type: Boolean, attribute: 'show-valid' }) override showValid?: boolean;

  /**
   * The size of the textarea.
   *
   * @default md
   */
  @property({ reflect: true }) size?: TextAreaSize;

  /** The value for the textarea. */
  @property() override value: string = '';

  /** The way text should be wrapped during form submission. */
  @property() wrap: WrapType = 'soft';

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.textarea) {
      this.textarea =
        this.querySelector<HTMLTextAreaElement>('textarea[slot="textarea"]') ||
        document.createElement('textarea');
      this.textarea.slot = 'textarea';
      this.#syncTextarea(this.textarea);

      if (!this.textarea.parentElement) {
        this.append(this.textarea);
      }
    }

    this.#attachTextareaListeners(this.textarea);
    this.#observer.observe(this.textarea);
    this.#lastObservedDescribedBy = this.textarea.getAttribute('aria-describedby') ?? '';
    this.#describedByObserver.observe(this.textarea, {
      attributes: true,
      attributeFilter: ['aria-describedby']
    });
    this.setFormControlElement(this.textarea);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();
    this.#describedByObserver.disconnect();
    this.#detachTextareaListeners(this.textarea);

    this.querySelector<HTMLSpanElement>(`#${this.#getCountDescriptionId()}`)?.remove();
    this.#countValiditySet = false;
    this.#previousCountState = undefined;

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    // valueChangedProgrammatically: Lit property changed but textarea DOM value hasn't been
    // synced yet (user input goes through #onInput which keeps them in sync, so a mismatch
    // here means a programmatic assignment via the `value` property).
    const valueChangedProgrammatically =
      changes.has('value') && this.value !== this.textarea?.value;

    if (valueChangedProgrammatically && this.textarea) {
      this.textarea.value = this.value?.toString() || '';
    }

    if (valueChangedProgrammatically || changes.has('showCount')) {
      this.#syncCountValidity();
      // updateValidity() mutates showValidity and must be called from willUpdate, not updated.
      this.updateValidity();

      if (changes.has('showCount')) {
        this.#previousCountState = undefined;
      } else if (valueChangedProgrammatically && this.showCount !== undefined) {
        this.#previousCountState = this.#getCountState();
      }
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    const props: Array<keyof TextArea> = [
      'autocomplete',
      'disabled',
      'maxLength',
      'minLength',
      'placeholder',
      'readonly',
      'resize',
      'required',
      'rows',
      'wrap'
    ];

    if (props.some(prop => changes.has(prop))) {
      this.#syncTextarea(this.textarea);
    }

    const valueChangedProgrammatically = changes.has('value') && this.value !== this.textarea.value;

    if (valueChangedProgrammatically) {
      this.textarea.value = this.value?.toString() || '';
    }

    const changed = this.#syncCountAriaDescription();

    // Only schedule a deferred re-sync when the linkage changed structurally (element created or
    // removed, or the ID list changed). Avoids redundant DOM work on every keystroke.
    if (changed) {
      requestAnimationFrame(() => {
        if (this.isConnected) {
          this.#syncCountAriaDescription();
        }
      });
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="field">
        <slot @input=${this.#onInput} @slotchange=${this.#onSlotchange} name="textarea"></slot>
        <slot name="suffix">
          ${this.showValidity === 'valid'
            ? html`<sl-icon class="valid" name="circle-check-solid"></sl-icon>`
            : nothing}
        </slot>
      </div>
      ${this.#isCountVisible()
        ? html`
            <span class="count" count-state=${this.#getCountState()} id=${this.#countId}>
              ${this.#getCountText()}
            </span>
          `
        : nothing}
      <slot name="count-description"></slot>
    `;
  }

  override focus(): void {
    this.textarea.focus();
  }

  override reportValidity(): boolean {
    this.#showCountMessage = true;

    if (this.#isOverLimitState || this.validity.valueMissing) {
      this.requestUpdate();
    }

    return super.reportValidity();
  }

  override getLocalizedValidationMessage(): string {
    if (this.validity.tooShort) {
      const length = this.value.length;

      return msg(
        str`Please enter at least ${this.minLength} character${getCharacterPluralSuffix(
          this.minLength ?? 0
        )} (you currently have ${length} character${getCharacterPluralSuffix(length)}).`,
        { id: 'sl.common.validation.tooShort' }
      );
    }

    if (this.validity.customError) {
      // For showCount overflow we only want visual invalid state until reportValidity() is called.
      if (this.#isOverLimitState && !this.#showCountMessage) {
        return '';
      }

      return this.validationMessage;
    }

    return super.getLocalizedValidationMessage();
  }

  /**
   * Sets or clears the character count custom validity error. Only clears the error if we set it
   * ourselves, so we never accidentally overwrite a custom error set by the user.
   */
  override updateInternalValidity(): void {
    if (this.#isOverLimitState) {
      // Preserve consumer-provided custom errors when showCount did not set the current one.
      if (this.textarea.validity.customError && !this.#countValiditySet) {
        return;
      }

      const showCountLimit = this.#getShowCountLimit();

      if (showCountLimit === undefined) {
        return;
      }

      const over = this.value.length - showCountLimit;
      let validationMessage: string;

      switch (getPluralCategory(over)) {
        case 'one':
          validationMessage = msg(str`Please remove at least ${over} character.`, {
            id: 'sl.textArea.validation.tooLong_one'
          });
          break;
        case 'few':
          validationMessage = msg(str`Please remove at least ${over} characters.`, {
            id: 'sl.textArea.validation.tooLong_few'
          });
          break;
        default:
          validationMessage = msg(str`Please remove at least ${over} characters.`, {
            id: 'sl.textArea.validation.tooLong_other'
          });
          break;
      }

      this.textarea.setCustomValidity(validationMessage);
      this.#countValiditySet = true;
    } else if (this.#countValiditySet) {
      // Clear only if we set the count error. Do not clear a custom error set by the consumer.
      this.textarea.setCustomValidity('');
      this.#countValiditySet = false;
    }
  }

  /** Attaches focus and blur listeners to the current textarea. */
  #attachTextareaListeners(textarea: HTMLTextAreaElement): void {
    textarea.addEventListener('blur', this.#onTextareaBlur);
    textarea.addEventListener('focus', this.#onTextareaFocus);
  }

  /** Removes focus and blur listeners from the given textarea. */
  #detachTextareaListeners(textarea?: HTMLTextAreaElement): void {
    textarea?.removeEventListener('blur', this.#onTextareaBlur);
    textarea?.removeEventListener('focus', this.#onTextareaFocus);
  }

  /** Returns the ID used for the hidden count description element. */
  #getCountDescriptionId(): string {
    return `${this.#countId}-description`;
  }

  /** Returns the current count state for the visible counter. */
  #getCountState(): TextAreaCountState {
    const showCountLimit = this.#getShowCountLimit();

    if (showCountLimit === undefined) {
      return 'default';
    }

    const remaining = showCountLimit - this.value.length;

    if (remaining < 0) {
      return 'danger';
    } else if (remaining <= showCountLimit * 0.1) {
      // Caution when 10% or fewer characters remain (90%+ used).
      return 'caution';
    }

    return 'default';
  }

  /** Returns the active soft count limit, or `undefined` when count is disabled. */
  #getShowCountLimit(): number | undefined {
    const limit = Number(this.showCount);
    return Number.isFinite(limit) && limit > 0 ? Math.trunc(limit) : undefined;
  }

  /** Returns whether the character count should currently be shown. */
  #isCountVisible(): boolean {
    const showCountLimit = this.#getShowCountLimit();

    return (
      showCountLimit !== undefined &&
      !(this.#isOverLimitState && this.#showCountMessage) &&
      !(this.#showCountMessage && this.validity.valueMissing)
    );
  }

  /** Stable focus handler for attaching/removing listeners. */
  #onTextareaFocus = (): void => {
    this.focusEvent.emit();
  };

  /** Stable blur handler for attaching/removing listeners. */
  #onTextareaBlur = (): void => this.#onBlur();

  /**
   * Keeps the hidden description span and aria-describedby in sync with the visible character
   * count. Returns `true` when the describedby linkage changed structurally (element created or
   * removed, or the ID list changed), so callers can decide whether a deferred re-sync is needed.
   */
  #syncCountAriaDescription(): boolean {
    const { textarea } = this;

    if (!textarea) {
      return false;
    }

    const countDescriptionId = this.#getCountDescriptionId();

    let countDescriptionElement: HTMLSpanElement | undefined =
      this.querySelector<HTMLSpanElement>(`#${countDescriptionId}`) ?? undefined;

    let structuralChange = false;

    // Keep a visually-hidden light DOM span in sync with the visible count.
    if (this.#isCountVisible()) {
      if (!countDescriptionElement) {
        countDescriptionElement = document.createElement('span');
        countDescriptionElement.id = countDescriptionId;
        countDescriptionElement.slot = 'count-description';
        countDescriptionElement.className = 'visually-hidden';
        this.append(countDescriptionElement);
        structuralChange = true;
      }

      countDescriptionElement.textContent = this.#getCountText();
    } else {
      if (countDescriptionElement) {
        countDescriptionElement.remove();
        countDescriptionElement = undefined;
        structuralChange = true;
      }
    }

    // Build the new aria-describedby list, keeping any external IDs and replacing our own.
    const externalIds = (textarea.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter(id => Boolean(id) && id !== this.#countId && id !== countDescriptionId);

    const nextIds = countDescriptionElement ? [...externalIds, countDescriptionId] : externalIds,
      nextDescribedBy = nextIds.join(' ');

    const describedByRefCapable = textarea as HTMLTextAreaElement & {
      ariaDescribedByElements?: Element[] | null;
    };

    if (describedByRefCapable.ariaDescribedByElements !== undefined) {
      const externalRefs = (describedByRefCapable.ariaDescribedByElements ?? []).filter(
          el => el.id !== countDescriptionId
        ),
        nextRefs = countDescriptionElement
          ? [...externalRefs, countDescriptionElement]
          : externalRefs;

      this.#trySetAriaDescribedByElements(describedByRefCapable, nextRefs);
    }

    // Mirror to string attribute as fallback.
    if (nextDescribedBy.length > 0) {
      if (textarea.getAttribute('aria-describedby') !== nextDescribedBy) {
        textarea.setAttribute('aria-describedby', nextDescribedBy);
        this.#lastObservedDescribedBy = nextDescribedBy;
        structuralChange = true;
      }
    } else if (textarea.hasAttribute('aria-describedby')) {
      textarea.removeAttribute('aria-describedby');
      this.#lastObservedDescribedBy = '';
      structuralChange = true;
    }

    return structuralChange;
  }

  /** Updates `ariaDescribedByElements` with a fallback to same root references when needed. */
  #trySetAriaDescribedByElements(
    target: HTMLTextAreaElement & { ariaDescribedByElements?: Element[] | null },
    refs: Element[]
  ): void {
    const controlRoot = target.getRootNode(),
      // Try with all refs first, then fall back to same-root refs only.
      candidates = [
        refs,
        refs.filter(el => {
          const root = el.getRootNode();

          return root === controlRoot || root === document;
        })
      ];

    for (const list of candidates) {
      try {
        target.ariaDescribedByElements = list.length > 0 ? list : null;

        return;
      } catch {
        // Try next candidate set.
      }
    }
  }

  /** Returns the localized counter text for the current value and soft limit. */
  #getCountText(): string {
    const showCountLimit = this.#getShowCountLimit();

    if (showCountLimit === undefined) {
      return '';
    }

    const remaining = showCountLimit - this.value.length;

    if (remaining < 0) {
      const over = -remaining;

      switch (getPluralCategory(over)) {
        case 'one':
          return msg(str`${over} character too many`, {
            id: 'sl.textArea.charCountTooMany_one'
          });
        case 'few':
          return msg(str`${over} characters too many`, {
            id: 'sl.textArea.charCountTooMany_few'
          });
        default:
          return msg(str`${over} characters too many`, {
            id: 'sl.textArea.charCountTooMany_other'
          });
      }
    }

    switch (getPluralCategory(remaining)) {
      case 'one':
        return msg(str`${remaining} character remaining`, {
          id: 'sl.textArea.charCountRemaining_one'
        });
      case 'few':
        return msg(str`${remaining} characters remaining`, {
          id: 'sl.textArea.charCountRemaining_few'
        });
      default:
        return msg(str`${remaining} characters remaining`, {
          id: 'sl.textArea.charCountRemaining_other'
        });
    }
  }

  #onBlur(): void {
    this.blurEvent.emit();
    this.updateState({ touched: true });
  }

  #onInput({ target }: Event & { target: HTMLTextAreaElement }): void {
    this.value = target.value;
    this.updateState({ dirty: true });

    this.#syncCountValidity();

    this.updateValidity();
    this.#setSize();
    this.changeEvent.emit(this.value);

    if (this.showCount !== undefined) {
      const currentCountState = this.#getCountState();

      // Announce only on state transitions (default/caution/danger).
      if (
        this.#previousCountState !== undefined &&
        currentCountState !== this.#previousCountState
      ) {
        announce(this.#getCountText(), 'polite');
      }

      this.#previousCountState = currentCountState;
    }
  }

  /** Updates the soft limit validity state based on the current value. */
  #syncCountValidity(): void {
    const showCountLimit = this.#getShowCountLimit();

    if (showCountLimit === undefined) {
      if (this.#isOverLimitState) {
        this.#setOverLimitVisualState(false);
      }

      this.#showCountMessage = false;
      this.#previousCountState = undefined;

      return;
    }

    this.#setOverLimitVisualState(this.value.length > showCountLimit);
  }

  /** Applies or restores the temporary `show-validity` state used for soft-limit overflow. */
  #setOverLimitVisualState(isOverLimit: boolean): void {
    if (isOverLimit) {
      // Show visual invalid state immediately, but do not force reporting yet.
      if (!this.#isOverLimitState) {
        this.#showValidityBeforeCount = this.getAttribute('show-validity');
      }

      this.setAttribute('show-validity', 'invalid');
      this.#isOverLimitState = true;

      return;
    }

    if (this.#isOverLimitState) {
      if (this.#showValidityBeforeCount === null) {
        this.removeAttribute('show-validity');
      } else if (this.#showValidityBeforeCount !== undefined) {
        this.setAttribute('show-validity', this.#showValidityBeforeCount);
      }

      this.#showValidityBeforeCount = undefined;
      this.#isOverLimitState = false;
    }
  }

  /** Handles a newly slotted textarea and wires it up to the component state. */
  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      textarea = elements.find(
        (el): el is HTMLTextAreaElement => el instanceof HTMLTextAreaElement
      );

    // Handle the scenario where a custom textarea is being slotted after `connectedCallback`
    if (textarea) {
      const previousTextarea = this.textarea;

      if (previousTextarea) {
        this.#detachTextareaListeners(previousTextarea);
      }

      if (previousTextarea && previousTextarea !== textarea) {
        this.#observer.unobserve(previousTextarea);
      }

      this.textarea = textarea;
      this.#attachTextareaListeners(this.textarea);
      this.#syncTextarea(this.textarea);
      this.textarea.value = this.value?.toString() || '';
      this.#observer.observe(this.textarea);
      this.#describedByObserver.disconnect();
      this.#lastObservedDescribedBy = this.textarea.getAttribute('aria-describedby') ?? '';
      this.#describedByObserver.observe(this.textarea, {
        attributes: true,
        attributeFilter: ['aria-describedby']
      });

      // Keep showCount custom validity/state in sync when swapping textarea elements.
      // Reset the count-validity tracking flag so updateInternalValidity() starts fresh
      // on the new textarea instance (it has no count error set yet).
      this.#countValiditySet = false;
      this.#syncCountValidity();
      this.updateValidity();
      this.#syncCountAriaDescription();

      this.setFormControlElement(this.textarea);
    }
  }

  /** Applies the resize mode to the textarea. */
  #setSize(): void {
    if (this.resize === 'auto') {
      this.textarea.style.height = 'auto';
      this.textarea.style.height = `${this.textarea.scrollHeight}px`;
      this.textarea.style.resize = 'none';
    } else if (this.resize === 'vertical') {
      (this.textarea.style.height as string | undefined) = undefined;
    } else {
      this.textarea.style.removeProperty('height');
    }
  }

  /** Syncs the managed textarea with the component properties. */
  #syncTextarea(textarea: HTMLTextAreaElement): void {
    textarea.autocomplete = this.autocomplete || 'off';
    textarea.autofocus = this.autofocus;
    textarea.disabled = !!this.disabled;
    textarea.id ||= `sl-text-area-${nextUniqueId++}`;
    textarea.placeholder = this.placeholder ?? '';
    textarea.readOnly = !!this.readonly;
    textarea.required = !!this.required;
    textarea.rows = this.rows && this.rows > 0 ? this.rows : 3;
    textarea.style.resize = this.resize ?? 'vertical';
    textarea.wrap = this.wrap ?? 'soft';

    textarea.style.setProperty('--_sl-text-area-rows', textarea.rows?.toString());

    this.setAttributesTarget(textarea);

    if (typeof this.maxLength === 'number') {
      textarea.setAttribute('maxlength', this.maxLength.toString());
    } else {
      textarea.removeAttribute('maxlength');
    }

    if (typeof this.minLength === 'number') {
      textarea.setAttribute('minlength', this.minLength.toString());
    } else {
      textarea.removeAttribute('minlength');
    }

    this.#setSize();
  }
}
