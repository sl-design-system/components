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

let nextUniqueId = 0;

/**
 * Multi line text area component.
 *
 * @slot textarea - The slot for the textarea element
 * @slot count-description - **@internal** — Not intended for consumer use. This slot projects a
 *   visually-hidden `<span>` that mirrors the character-count text into the composed tree.
 *   It must be slotted (rather than left as an unslotted light-DOM node) because browsers and
 *   screen readers only follow `aria-describedby` ID references to elements that are part of the
 *   composed/rendered tree. An unslotted element is invisible to the accessibility layer and the
 *   count therefore stops being announced when the textarea is focused.
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

  /** Observe the textarea width. */
  #observer = new ResizeObserver(() => {
    // Workaround for "ResizeObserver loop completed with undelivered notifications."
    requestAnimationFrame(() => this.#setSize());
  });

  /** Keep count aria-describedby linkage resilient to external textarea attribute changes. */
  #describedByObserver = new MutationObserver(() => {
    const countDescriptionId = `${this.#countId}-description`,
      describedBy = this.textarea?.getAttribute('aria-describedby') ?? '',
      hasCountDescription = describedBy.split(/\s+/).includes(countDescriptionId),
      shouldHaveCountDescription = this.#isCountVisible();

    // Only re-sync when an external mutation caused a mismatch; avoid self-triggered loops.
    if (hasCountDescription !== shouldHaveCountDescription) {
      this.#syncCountAriaDescription();
    }
  });

  /** The last count state, used to announce only when state changes. */
  #previousCountState?: 'default' | 'caution' | 'danger';

  /** True when the value is over the character limit and sets validation state. */
  #isOverLimitState = false;

  /**
   * True when we have called `textarea.setCustomValidity(countMessage)`. Used to guard the clearing
   * call in `updateInternalValidity()` so we never unconditionally wipe a consumer-set custom
   * error.
   */
  #countValiditySet = false;

  /** Whether the showCount overflow message may be shown (after reportValidity was called). */
  #showCountMessage = false;

  /** ID used to connect the character count to the textarea via aria-describedby. */
  #countId = `sl-text-area-count-${nextUniqueId++}`;

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
   * The maximum number of characters allowed. When set, a character counter appears below the
   * textarea showing how many characters remain. When 90% of the limit is reached the counter turns
   * caution (orange). When the limit is exceeded it turns to a danger state, shows how many
   * characters are over the limit, and marks the textarea as invalid. Exceeding the limit does not
   * block input, the user can still type or paste more text and then edit it down.
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

    this.#observer.observe(this.textarea);
    this.#describedByObserver.observe(this.textarea, {
      attributes: true,
      attributeFilter: ['aria-describedby']
    });
    this.setFormControlElement(this.textarea);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();
    this.#describedByObserver.disconnect();

    this.querySelector<HTMLSpanElement>(`#${this.#countId}-description`)?.remove();
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

    this.#syncCountAriaDescription();

    requestAnimationFrame(() => this.#syncCountAriaDescription());
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
      <!-- ↑ @internal: projects the visually-hidden aria-describedby span into the composed tree
           so screen readers announce the character count when the textarea is focused. -->
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
   * Sets or clears the count-overflow custom validity on the textarea, integrated into the
   * `updateValidity()` flow so that `sl-validate` fires **after** this runs, giving consumers a
   * chance to re-assert their own custom error without it being silently overwritten.
   *
   * The `#countValiditySet` guard ensures we never unconditionally clear a consumer-set error: we
   * only call `setCustomValidity('')` when we previously set a count error ourselves.
   */
  override updateInternalValidity(): void {
    if (this.#isOverLimitState) {
      const over = this.value.length - (this.showCount ?? 0);
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
      // Only clear when WE set the count error; never wipe a consumer-set custom error.
      this.textarea.setCustomValidity('');
      this.#countValiditySet = false;
    }
  }

  #getCountState(): 'default' | 'caution' | 'danger' {
    const remaining = (this.showCount ?? 0) - this.value.length;

    if (remaining < 0) {
      return 'danger';
    } else if (remaining <= (this.showCount ?? 0) * 0.1) {
      return 'caution';
    }

    return 'default';
  }

  #isCountVisible(): boolean {
    return (
      this.showCount !== undefined &&
      !(this.#isOverLimitState && this.#showCountMessage) &&
      !(this.#showCountMessage && this.validity.valueMissing)
    );
  }

  #syncCountAriaDescription(): void {
    const { textarea } = this;

    if (!textarea) {
      return;
    }

    const countDescriptionId = `${this.#countId}-description`;

    let countDescriptionElement: HTMLSpanElement | undefined =
      this.querySelector<HTMLSpanElement>(`#${countDescriptionId}`) ?? undefined;

    // Keep a hidden light-DOM description element in sync with the visible count.
    if (this.#isCountVisible()) {
      if (!countDescriptionElement) {
        countDescriptionElement = document.createElement('span');
        countDescriptionElement.id = countDescriptionId;
        // Must use slot="count-description" so this element is projected into the shadow tree and
        // remains reachable by the accessibility layer via aria-describedby. Without slotting,
        // the element exists in light DOM but is ignored by browsers/screen readers for IDREF lookups.
        countDescriptionElement.slot = 'count-description';
        // Visually hidden but kept in the accessibility tree.
        countDescriptionElement.style.cssText =
          'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
        this.append(countDescriptionElement);
      }

      countDescriptionElement.textContent = this.#getCountText();
    } else {
      countDescriptionElement?.remove();
      countDescriptionElement = undefined;
    }

    // Preserve external described-by IDs, excluding our own count IDs.
    const externalIds = (textarea.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter(id => Boolean(id) && id !== this.#countId && id !== countDescriptionId);

    // Compute the target `aria-describedby` ID list.
    const nextIds = countDescriptionElement ? [...externalIds, countDescriptionId] : externalIds,
      nextDescribedBy = nextIds.join(' ');

    // Set element refs first when supported; some engines may clear the string attribute.
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

      const applyRefs = (refs: Element[]): void => {
        describedByRefCapable.ariaDescribedByElements = refs.length > 0 ? refs : null;
      };

      try {
        applyRefs(nextRefs);
      } catch {
        // Fallback for engines that reject mixed-root refs.
        const controlRoot = textarea.getRootNode(),
          safeRefs = nextRefs.filter(el => {
            const root = el.getRootNode();

            return root === controlRoot || root === document;
          });

        try {
          applyRefs(safeRefs);
        } catch {
          // no-op
        }
      }
    }

    // Mirror IDs to string attribute (fallback path and post-ref restoration).
    if (nextDescribedBy.length > 0) {
      if (textarea.getAttribute('aria-describedby') !== nextDescribedBy) {
        textarea.setAttribute('aria-describedby', nextDescribedBy);
      }
    } else if (textarea.hasAttribute('aria-describedby')) {
      textarea.removeAttribute('aria-describedby');
    }
  }

  #getCountText(): string {
    const remaining = (this.showCount ?? 0) - this.value.length;

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

  #syncCountValidity(): void {
    if (this.showCount === undefined) {
      if (this.#isOverLimitState) {
        this.removeAttribute('show-validity');
        this.#isOverLimitState = false;
      }

      this.#showCountMessage = false;
      this.#previousCountState = undefined;

      return;
    }

    if (this.value.length > this.showCount) {
      // Show visual invalid state immediately, but do not force reporting yet.
      this.setAttribute('show-validity', 'invalid');
      this.#isOverLimitState = true;
    } else if (this.#isOverLimitState) {
      this.removeAttribute('show-validity');
      this.#isOverLimitState = false;
    }
  }

  #onSlotchange(event: Event & { target: HTMLSlotElement }): void {
    const elements = event.target.assignedElements({ flatten: true }),
      textarea = elements.find(
        (el): el is HTMLTextAreaElement => el instanceof HTMLTextAreaElement
      );

    // Handle the scenario where a custom textarea is being slotted after `connectedCallback`
    if (textarea) {
      const previousTextarea = this.textarea;

      if (previousTextarea && previousTextarea !== textarea) {
        this.#observer.unobserve(previousTextarea);
      }

      this.textarea = textarea;
      this.textarea.addEventListener('blur', () => this.#onBlur());
      this.textarea.addEventListener('focus', () => this.focusEvent.emit());
      this.#syncTextarea(this.textarea);
      this.textarea.value = this.value?.toString() || '';
      this.#observer.observe(this.textarea);
      this.#describedByObserver.disconnect();
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
