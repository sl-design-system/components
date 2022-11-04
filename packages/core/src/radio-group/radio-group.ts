import type { CSSResultGroup, TemplateResult } from 'lit';
import type { Radio } from './radio.js';
import { FormControlMixin } from '@open-wc/form-control';
import { LitElement, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './radio-group.scss.js';

const OBSERVER_OPTIONS: MutationObserverInit = {
  attributeFilter: ['checked'],
  attributeOldValue: true,
  subtree: true
};

export class RadioGroup extends FormControlMixin(LitElement) {
  /** @private */
  static override styles: CSSResultGroup = styles;

  #onClick = (): void => {
    console.log('click', this.radios, this.radios?.[0]);

    this.radios?.[0]?.focus();
  };

  #onKeydown = (event: KeyboardEvent): void => {
    const keys = [
      'Home',
      'End',
      ...(this.orientation === 'vertical' ? ['ArrowDown', 'ArrowUp'] : ['ArrowLeft', 'ArrowRight'])
    ];

    if (!keys.includes(event.key) || !this.radios) {
      return;
    }

    const activeElement = (this.getRootNode() as Document).activeElement as Radio;

    let index = this.radios.indexOf(activeElement);
    if (index === -1) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        index += 1;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        index -= 1;
        break;
      case 'Home':
        index = 0;
        break;
      case 'End':
        index = this.radios.length - 1;
        break;
    }

    if (index < 0) {
      index = this.radios.length - 1;
    } else if (index === this.radios.length) {
      index = 0;
    }

    event.preventDefault();

    const radio = this.radios[index];
    radio.checked = true;
    radio.focus();
  };

  /** Observe the state of the radios. */
  #observer?: MutationObserver;

  /** Whether all the radio's in the group are disabled. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** The orientation of the radio's in the group. */
  @property({ type: String, reflect: true }) orientation: 'horizontal' | 'vertical' = 'vertical';

  /** The radio buttons. */
  @queryAssignedElements() radios?: Radio[];

  /** The value of the selected radio. */
  @property() value = '';

  connectedCallback(): void {
    super.connectedCallback();

    this.#observer = new MutationObserver(mutationList => {
      mutationList.forEach(mutation => {
        if (mutation.attributeName === 'checked' && mutation.oldValue === null) {
          this.#observer?.disconnect();
          this.radios?.forEach(radio => {
            if (radio !== mutation.target) {
              radio.checked = false;
            }
          });
          this.#observer?.observe(this, OBSERVER_OPTIONS);
        }
      });
    });
    this.#observer.observe(this, OBSERVER_OPTIONS);

    this.addEventListener('click', this.#onClick);
    this.addEventListener('keydown', this.#onKeydown);
  }

  disconnectedCallback(): void {
    this.#observer?.disconnect();
    this.#observer = undefined;

    this.removeEventListener('click', this.#onClick);
    this.removeEventListener('keydown', this.#onKeydown);

    super.disconnectedCallback();
  }

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
