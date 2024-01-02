import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Checkbox, CheckboxSize } from './checkbox.js';
import { msg } from '@lit/localize';
import { FormControlMixin } from '@sl-design-system/form';
import { EventsController, RovingTabindexController } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements, state } from 'lit/decorators.js';
import styles from './checkbox-group.scss.js';

/**
 * Checkbox group; treat a group of checkboxes as one form input with validation, hints and errors
 *
 * @slot default - A list of `sl-checkbox` elements.
 */
export class CheckboxGroup extends FormControlMixin(LitElement) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  #events = new EventsController(this, { click: this.#onClick });

  /** Observe changes to the checkboxes. */
  #observer = new MutationObserver(() => (this.value = this.boxes?.map(box => !!box.checked)));

  /** Manage the keyboard navigation. */
  #rovingTabindexController = new RovingTabindexController<Checkbox>(this, {
    focusInIndex: (elements: Checkbox[]) => elements.findIndex(el => !el.disabled),
    elements: () => this.boxes || [],
    isFocusableElement: (el: Checkbox) => !el.disabled
  });

  /** @private */
  readonly internals = this.attachInternals();

  /** @private The slotted checkboxes. */
  @queryAssignedElements() boxes?: Checkbox[];

  /** Whether the group is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** At least one checkbox in the group must be checked if true. */
  @property({ type: Boolean, reflect: true }) required?: boolean;

  /** The size of the checkboxes in the group. */
  @property() size?: CheckboxSize;

  /** @private The value for the checkbox group, for internal use. */
  @state() value?: boolean[];

  override connectedCallback(): void {
    super.connectedCallback();

    this.#observer.observe(this, { attributeFilter: ['checked'], attributeOldValue: true, subtree: true });

    this.internals.role = 'group';
    this.setFormControlElement(this);
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues): void {
    super.willUpdate(changes);

    if (changes.has('required') || changes.has('value')) {
      this.internals.setValidity(
        { valueMissing: this.required && !this.value?.some(v => v) },
        msg('At least one option must be checked.')
      );

      this.updateValidity();
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('disabled') && typeof this.disabled === 'boolean') {
      this.boxes?.forEach(box => (box.disabled = !!this.disabled));
    }

    if (changes.has('name')) {
      if (this.name) {
        this.boxes?.forEach(box => box.setAttribute('name', this.name!));
      } else {
        this.boxes?.forEach(box => box.removeAttribute('name'));
      }
    }

    if (changes.has('required')) {
      this.internals.ariaRequired = this.required ? 'true' : 'false';
    }

    if (changes.has('size')) {
      this.boxes?.forEach(box => (box.size = this.size || 'md'));
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange} @sl-validate=${this.#onValidate}></slot>`;
  }

  override reportValidity(): boolean {
    this.boxes?.forEach(box => box.reportValidity());

    return super.reportValidity();
  }

  #onClick(event: Event): void {
    if (event.target === this) {
      this.#rovingTabindexController.focus();
    }
  }

  #onSlotchange(): void {
    this.#rovingTabindexController.clearElementCache();

    this.value = this.boxes?.map(box => !!box.checked);

    this.boxes?.forEach(box => {
      box.name = this.name;

      if (typeof this.disabled === 'boolean') {
        box.disabled = !!this.disabled;
      }

      if (this.size) {
        box.size = this.size;
      }
    });
  }

  #onValidate(event: Event): void {
    // Stop the validate events from the checkboxes in the group from bubbling up any further
    event.preventDefault();
    event.stopPropagation();
  }
}
