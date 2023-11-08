import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Checkbox, CheckboxSize } from './checkbox.js';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { msg } from '@lit/localize';
import { MutationController } from '@lit-labs/observers/mutation-controller.js';
import { Error, FormControlMixin, Hint } from '@sl-design-system/form';
import { RovingTabindexController } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements, state } from 'lit/decorators.js';
import styles from './checkbox-group.scss.js';

/**
 * Checkbox group; treat a group of checkboxes as one form input with validation, hints and errors
 *
 * @slot default - A list of `sl-checkbox` elements.
 */
export class CheckboxGroup extends FormControlMixin(ScopedElementsMixin(LitElement)) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-error': Error,
      'sl-hint': Hint
    };
  }

  /** @private */
  static override styles: CSSResultGroup = [FormControlMixin.styles, styles];

  /** Observe changes to the checkboxes. */
  #mutation = new MutationController(this, {
    callback: async () => {
      // Workaround for https://github.com/lit/lit/issues/3597
      await this.updateComplete;

      this.value = this.boxes?.map(box => !!box.checked);
    },
    config: { attributeFilter: ['checked'], attributeOldValue: true, subtree: true }
  });

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

  /** The size of the checkboxes in the group.
   * @type {'md' | 'lg'} */
  @property() size?: CheckboxSize;

  /**
   * The value for the checkbox group, for internal use.
   * @private
   */
  @state() value?: boolean[];

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'group';

    this.setFormControlElement(this);
  }

  override willUpdate(changes: PropertyValues): void {
    super.willUpdate(changes);

    if (changes.has('required') || changes.has('value')) {
      this.internals.setValidity(
        { valueMissing: this.required && !this.value?.some(v => v) },
        msg('At least one item must be checked.')
      );

      this.updateValidity();
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('disabled')) {
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
    return html`
      <div @click=${this.#onClick} class="wrapper" part="wrapper">
        <slot @slotchange=${this.#onSlotchange}></slot>
      </div>

      <sl-error></sl-error>
      <sl-hint></sl-hint>
    `;
  }

  #onClick(event: Event): void {
    if (event.target === this) {
      this.#rovingTabindexController.focus();
    }
  }

  #onSlotchange(): void {
    this.#rovingTabindexController.clearElementCache();

    this.boxes?.forEach(box => {
      box.disabled = !!this.disabled;
      box.name = this.name;

      if (this.size) {
        box.size = this.size;
      }
    });
  }
}
