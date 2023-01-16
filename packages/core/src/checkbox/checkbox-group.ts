import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Checkbox } from './checkbox.js';
import { LitElement, html } from 'lit';
import { queryAssignedElements } from 'lit/decorators.js';
import { RovingTabindexController } from '../utils/controllers/index.js';
import { HintMixin } from '../utils/form-control/index.js';
import styles from './checkbox-group.scss.js';

export class CheckboxGroup extends HintMixin(LitElement) {
  /** @private */
  static override styles: CSSResultGroup = styles;

  #rovingTabindexController = new RovingTabindexController<Checkbox>(this, {
    focusInIndex: (elements: Checkbox[]) => {
      return elements.findIndex(el => !el.disabled);
    },
    elements: () => this.boxes || [],
    isFocusableElement: (el: Checkbox) => !el.disabled
  });

  /** The slotted checkboxes. */
  @queryAssignedElements() boxes?: Checkbox[];

  override render(): TemplateResult {
    return html`
      <div class="wrapper">
        <slot @slotchange=${() => this.#rovingTabindexController.clearElementCache()}></slot>
      </div>
      ${this.renderHint()}
    `;
  }
}
