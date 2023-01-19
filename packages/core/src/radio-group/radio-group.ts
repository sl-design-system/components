import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { FormControlMixin } from '@open-wc/form-control';
import { LitElement, html } from 'lit';
import { property, queryAssignedNodes } from 'lit/decorators.js';
import { EventsController, RovingTabindexController } from '../utils/controllers/index.js';
import { HintMixin } from '../utils/form-control/index.js';
import { Radio } from './radio.js';
import styles from './radio-group.scss.js';

const OBSERVER_OPTIONS: MutationObserverInit = {
  attributeFilter: ['checked'],
  attributeOldValue: true,
  subtree: true
};

export class RadioGroup extends FormControlMixin(HintMixin(LitElement)) {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
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

  /** The assigned nodes. */
  @queryAssignedNodes() defaultNodes?: Node[];

  /** The orientation of the radio's in the group. */
  @property({ type: String, reflect: true }) orientation: 'horizontal' | 'vertical' = 'vertical';

  /** The value of the selected radio. */
  @property() value?: string;

  get buttons(): Radio[] {
    return this.defaultNodes?.filter((node): node is Radio => node instanceof Radio) || [];
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'radiogroup';

    this.#events.listen(this, 'click', this.#onClick);

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
      ${this.renderHint()}
    `;
  }

  override focus(): void {
    this.#rovingTabindexController.focus();
  }

  #onClick(event: Event): void {
    event.preventDefault();

    this.focus();
  }

  #updateSelected(value?: string): void {
    this.#observer?.disconnect();

    this.buttons?.forEach(button => {
      button.checked = button.value === value;
    });

    this.#observer?.observe(this, OBSERVER_OPTIONS);
  }
}
