import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { FormControlMixin } from '@open-wc/form-control';
import { LitElement, html } from 'lit';
import { property, queryAssignedNodes } from 'lit/decorators.js';
import { RovingTabindexController } from '../utils/controllers/roving-tabindex.js';
import { Radio } from './radio.js';
import styles from './radio-group.scss.js';

const OBSERVER_OPTIONS: MutationObserverInit = {
  attributeFilter: ['checked'],
  attributeOldValue: true,
  subtree: true
};

export class RadioGroup extends FormControlMixin(LitElement) {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Observe the state of the radios. */
  #observer?: MutationObserver;

  #rovingTabindexController = new RovingTabindexController<Radio>(this, {
    focusInIndex: (elements: Radio[]) => {
      return elements.findIndex(el => {
        return this.selected ? !el.disabled && el.value === this.selected : !el.disabled;
      });
    },
    elementEnterAction: (el: Radio) => {
      this.selected = el.value;
    },
    elements: () => this.buttons,
    isFocusableElement: (el: Radio) => !el.disabled
  });

  get buttons(): Radio[] {
    return this.defaultNodes?.filter((node): node is Radio => node instanceof Radio) || [];
  }

  /** The assigned nodes. */
  @queryAssignedNodes() defaultNodes?: Node[];

  /** Whether all the radio's in the group are disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** The orientation of the radio's in the group. */
  @property({ type: String, reflect: true }) orientation: 'horizontal' | 'vertical' = 'vertical';

  /** The value of the selected radio. */
  @property() selected = '';

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'radiogroup';

    this.#observer = new MutationObserver(mutationList => {
      mutationList.forEach(mutation => {
        if (mutation.attributeName === 'checked' && mutation.oldValue === null) {
          this.selected = (mutation.target as Radio).value;

          this.#updateSelected(this.selected);
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

    if (changes.has('selected')) {
      this.#updateSelected(this.selected);
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${() => this.#rovingTabindexController.clearElementCache()}></slot>`;
  }

  override focus(): void {
    this.#rovingTabindexController.focus();
  }

  #updateSelected(value: string): void {
    this.#observer?.disconnect();

    this.buttons?.forEach(button => {
      button.checked = button.value === value;
    });

    this.#observer?.observe(this, OBSERVER_OPTIONS);
  }
}
