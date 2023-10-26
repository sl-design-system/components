import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Checkbox } from './checkbox.js';
import { msg } from '@lit/localize';
import { MutationController } from '@lit-labs/observers/mutation-controller.js';
import { FormControlMixin, HintMixin, RovingTabindexController, hintStyles } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './checkbox-group.scss.js';

/**
 * Checkbox group; treat a group of checkboxes as one form input with valitation, hints and errors
 *
 * ```html
 *   <sl-checkbox-group>
 *     <sl-checkbox>Option 1</sl-checkbox>
 *     <sl-checkbox>Option 2</sl-checkbox>
 *     <sl-checkbox>Option 3</sl-checkbox>
 *   </sl-checkbox-group>
 * ```
 *
 * @slot default - A list of `sl-checkbox` elements.
 */
export class CheckboxGroup extends FormControlMixin(HintMixin(LitElement)) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static override styles: CSSResultGroup = [hintStyles, styles];

  /** Observe changes to the checkboxes. */
  #mutation = new MutationController(this, {
    callback: async () => {
      // Workaround for https://github.com/lit/lit/issues/3597
      await this.updateComplete;

      const someChecked = this.boxes?.some(box => !!box.checked);

      this.internals.setValidity(
        { valueMissing: this.required && !someChecked },
        msg('At least one item must be checked.')
      );

      this.requestUpdate();
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

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'group';

    this.setFormControlElement(this);
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('disabled')) {
      this.boxes?.forEach(box => (box.disabled = this.disabled));
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
  }

  override render(): TemplateResult {
    return html`
      <div @click=${this.#onClick} class="wrapper" part="wrapper">
        <slot @slotchange=${this.#onSlotchange}></slot>
      </div>

      <div class="error" part="error">${this.renderErrorSlot()}</div>
      <div class="hint" part="hint">${this.renderHintSlot()}</div>
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
      box.disabled = this.disabled;

      if (this.name) {
        box.name = this.name;
      }
    });
  }
}
