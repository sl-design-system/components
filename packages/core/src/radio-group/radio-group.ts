import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { IElementInternals } from 'element-internals-polyfill';
import type { FormControlValue } from '../utils/form-control/index.js';
import { LitElement, html } from 'lit';
import { property, queryAssignedNodes } from 'lit/decorators.js';
import { FormControlMixin, requiredValidator, validationStyles } from '../utils/form-control/index.js';
import { EventsController, RovingTabindexController } from '../utils/controllers/index.js';
import { Radio } from './radio.js';
import styles from './radio-group.scss.js';

const OBSERVER_OPTIONS: MutationObserverInit = {
  attributeFilter: ['checked'],
  attributeOldValue: true,
  subtree: true
};

export class RadioGroup extends FormControlMixin(LitElement) {
  /** @private */
  static formAssociated = true;

  /** @private */
  static formControlValidators = [requiredValidator];

  /** @private */
  static override styles: CSSResultGroup = [validationStyles, styles];

  /** Event controller. */
  #events = new EventsController(this);

  #rovingTabindexController = new RovingTabindexController<Radio>(this, {
    focusInIndex: (elements: Radio[]) => {
      return elements.findIndex(el => {
        return this.value ? !el.disabled && el.value === this.value : !el.disabled;
      });
    },
    elementEnterAction: (el: Radio) => {
      this.value = el.value;
    },
    elements: () => this.buttons,
    isFocusableElement: (el: Radio) => !el.disabled
  });

  /** Observe the state of the radios. */
  #observer?: MutationObserver;

  /** Element internals. */
  readonly internals = this.attachInternals() as ElementInternals & IElementInternals;

  /** The assigned nodes. */
  @queryAssignedNodes() defaultNodes?: Node[];

  /** The orientation of the radio's in the group. */
  @property({ type: String, reflect: true }) orientation: 'horizontal' | 'vertical' = 'vertical';

  get buttons(): Radio[] {
    return this.defaultNodes?.filter((node): node is Radio => node instanceof Radio) || [];
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.setFormControlElement(this);
    this.internals.role = 'radiogroup';

    this.#events.listen(this, 'click', this.#onClick);
    this.#events.listen(this, 'focusout', this.#onFocusout);

    this.#observer = new MutationObserver(mutationList => {
      mutationList.forEach(mutation => {
        if (mutation.attributeName === 'checked' && mutation.oldValue === null) {
          this.#updateSelected((mutation.target as Radio).value);
        }
      });
    });
    this.#observer.observe(this, OBSERVER_OPTIONS);
  }

  override disconnectedCallback(): void {
    this.#observer?.disconnect();
    this.#observer = undefined;

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('value')) {
      this.#updateSelected(this.value);
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="wrapper">
        <slot @slotchange=${() => this.#rovingTabindexController.clearElementCache()}></slot>
      </div>
      ${this.renderHint()} ${this.renderValidation()}
    `;
  }

  override focus(): void {
    this.#rovingTabindexController.focus();
  }

  #onClick(event: Event): void {
    event.preventDefault();

    this.focus();
  }

  #onFocusout(event: FocusEvent): void {
    if (event.relatedTarget && !this.buttons.includes(event.relatedTarget as Radio)) {
      // This component is weird in that it doesn't actually contain the form controls
      // Those are the `<sl-radio>` custom elements in the light DOM.
      // So for the validation to work properly, we simulate the blur event here.
      this.dispatchEvent(new Event('blur'));
    }
  }

  #updateSelected(value: FormControlValue | null): void {
    this.#observer?.disconnect();

    this.buttons?.forEach(button => {
      button.checked = button.value === value;
    });

    this.#observer?.observe(this, OBSERVER_OPTIONS);
  }
}
