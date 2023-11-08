import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { Checkbox, CheckboxSize } from './checkbox.js';
import type { Validator } from '@sl-design-system/shared';
import { MutationController } from '@lit-labs/observers/mutation-controller.js';
import {
  EventsController,
  HintMixin,
  RovingTabindexController,
  ValidationController,
  hintStyles,
  requiredValidator,
  validationStyles
} from '@sl-design-system/shared';
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
export class CheckboxGroup extends HintMixin(LitElement) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static override styles: CSSResultGroup = [validationStyles, hintStyles, styles];

  /** Events controller. */
  #events = new EventsController(this, { click: this.#onClick });

  /**
   * Observe changes to the checkboxes.
   *
   * FIXME: This causes a warning in the console: https://github.com/lit/lit/issues/3597
   */
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

  /** @private Element internals. */
  readonly internals = this.attachInternals();

  /** @private The slotted checkboxes. */
  @queryAssignedElements() boxes?: Checkbox[];

  /** Custom validators. */
  @property({ attribute: false }) validators?: Validator[];

  /** Name of the form control */
  @property() name?: string;

  /** The size of the checkboxes in the group.
   * @type {'md' | 'lg'} */
  @property() size?: CheckboxSize;

  /**  Native form property */
  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('size')) {
      this.boxes?.forEach(box => (box.size = this.size || 'md'));
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="wrapper">
        <slot @slotchange=${this.#onSlotchange}></slot>
      </div>
      ${this.renderHint()} ${this.#validation.render()}
    `;
  }

  #onClick(event: Event): void {
    if (event.target === this) {
      this.#rovingTabindexController.focus();
    }
  }

  #onSlotchange(): void {
    this.#rovingTabindexController.clearElementCache();

    if (typeof this.name === 'string') {
      const name = this.name;

      this.boxes?.forEach(box => {
        box.name = name;

        if (this.size) {
          box.size = this.size;
        }
      });
    }
  }
}
