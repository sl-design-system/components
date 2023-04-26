import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Validator } from '../utils/index.js';
import type { Checkbox } from './checkbox.js';
import { MutationController } from '@lit-labs/observers/mutation-controller.js';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import {
  EventsController,
  RovingTabindexController,
  ValidationController,
  validationStyles
} from '../utils/controllers/index.js';
import { HintMixin, hintStyles } from '../utils/mixins/index.js';
import { requiredValidator } from '../utils/index.js';
import styles from './checkbox-group.scss.js';

export class CheckboxGroup extends HintMixin(LitElement) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static override styles: CSSResultGroup = [validationStyles, hintStyles, styles];

  /** Events controller. */
  #events = new EventsController(this, { click: this.#onClick });

  /** Observe changes to the checkboxes. */
  #mutation = new MutationController(this, {
    callback: () => {
      const value = this.boxes
        ?.map(box => (box.checked ? box.value : null))
        .filter(Boolean)
        .join(', ');

      this.#validation.validate(value);
    },
    config: { attributeFilter: ['checked'], attributeOldValue: true, subtree: true }
  });

  /** Manage the keyboard navigation. */
  #rovingTabindexController = new RovingTabindexController<Checkbox>(this, {
    focusInIndex: (elements: Checkbox[]) => elements.findIndex(el => !el.disabled),
    elements: () => this.boxes || [],
    isFocusableElement: (el: Checkbox) => !el.disabled
  });

  /** Support validation that at least 1 checkbox is required in the group. */
  #validation = new ValidationController(this, {
    validators: [requiredValidator]
  });

  /** Element internals. */
  readonly internals = this.attachInternals();

  /** The slotted checkboxes. */
  @queryAssignedElements() boxes?: Checkbox[];

  /** Custom validators. */
  @property({ attribute: false }) validators?: Validator[];

  /** Name of the form element */
  @property() name?: string;

  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  override render(): TemplateResult {
    return html`
      <div class="wrapper">
        <slot @slotchange=${this.#onSlotchange}></slot>
      </div>
      ${this.#validation.render() ? this.#validation.render() : this.renderHint()}
    `; // ${this.renderHint()} ${this.#validation.render()}
  }

  #onClick(event: Event): void {
    if (event.target === this) {
      this.#rovingTabindexController.focus();
    }
  }

  #onSlotchange(): void {
    this.#rovingTabindexController.clearElementCache();

    if (typeof this.name === 'string') {
      this.boxes?.forEach(box => {
        box.setAttribute('name', this.name as string);
      });
    }
  }
}
