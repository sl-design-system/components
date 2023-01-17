import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Checkbox } from './checkbox.js';
import { LitElement, html } from 'lit';
import { queryAssignedElements } from 'lit/decorators.js';
import { EventsController, RovingTabindexController } from '../utils/controllers/index.js';
import { HintMixin, ValidationMixin, requiredValidator, validationStyles } from '../utils/form-control/index.js';
import styles from './checkbox-group.scss.js';

export class CheckboxGroup extends ValidationMixin(HintMixin(LitElement)) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static formControlValidators = [requiredValidator];

  /** @private */
  static override styles: CSSResultGroup = [validationStyles, styles];

  /** Events controller. */
  #events = new EventsController(this);

  #rovingTabindexController = new RovingTabindexController<Checkbox>(this, {
    focusInIndex: (elements: Checkbox[]) => elements.findIndex(el => !el.disabled),
    elements: () => this.boxes || [],
    isFocusableElement: (el: Checkbox) => !el.disabled
  });

  /** Element internals. */
  readonly internals = this.attachInternals();

  /** The slotted checkboxes. */
  @queryAssignedElements() boxes?: Checkbox[];

  override connectedCallback(): void {
    super.connectedCallback();

    this.setValidationHost(this);

    this.#events.listen(this, 'click', this.#onClick);
  }

  override render(): TemplateResult {
    return html`
      <div class="wrapper">
        <slot @slotchange=${() => this.#rovingTabindexController.clearElementCache()}></slot>
      </div>
      ${this.renderHint()} ${this.renderValidation()}
    `;
  }

  #onClick(event: Event): void {
    if (event.target === this) {
      this.#rovingTabindexController.focus();
    }
  }
}
