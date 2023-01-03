import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { FormControlInterface } from '@open-wc/form-control';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Input } from '../input/index.js';
import { Textarea } from '../textarea/index.js';
import styles from './label.scss.js';

export class Label extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The actual form control id this label links to. */
  #formControlId?: string;

  /** The label instance in the light DOM. */
  #label?: HTMLLabelElement;

  /** Observe the form control for changes. */
  #observer?: MutationObserver;

  /** The DOM id of the form control this is linked to. */
  @property() for?: string;

  /** The associated form control. */
  @state() formControl: (HTMLElement & FormControlInterface) | null = null;

  /** Whether this label should be marked as optional. */
  @state() optional?: boolean;

  /** Whether this label should be marked as required. */
  @state() required?: boolean;

  override disconnectedCallback(): void {
    this.#observer?.disconnect();
    this.#observer = undefined;

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('for')) {
      if (this.for) {
        this.formControl = (this.getRootNode() as Element)?.querySelector<HTMLElement & FormControlInterface>(
          `#${this.for}`
        );

        // If the form control is an <sl-input> or <sl-textarea>,
        // automatically associate the label with the <input> or
        // <textarea> in the light DOM
        if (this.formControl instanceof Input || this.formControl instanceof Textarea) {
          void this.formControl.updateComplete.then(() => {
            const input = this.formControl?.querySelector('input, textarea');

            if (input) {
              this.#formControlId = input.id;
              this.#label?.setAttribute('for', input.id);
            }
          });
        } else {
          this.#formControlId = this.for;
          this.#label?.setAttribute('for', this.for);
        }
      } else {
        this.#label?.removeAttribute('for');
        this.formControl = null;
      }
    }

    if (changes.has('formControl')) {
      if (this.formControl) {
        this.#observer = new MutationObserver(() => this.#update());
        this.#observer.observe(this.formControl, { attributes: true, attributeFilter: ['required'] });

        this.#update();
      } else {
        this.#observer?.disconnect();
        this.#observer = undefined;

        this.optional = this.required = undefined;
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotchange} style="display: none"></slot>
      <slot name="label"></slot>
      ${this.optional ? html`<span class="optional">(optional)</span>` : ''}
      ${this.required ? html`<span class="required">*</span>` : ''}
    `;
  }

  #onSlotchange({ target }: Event & { target: HTMLSlotElement }): void {
    const nodes = target.assignedNodes({ flatten: true });

    if (this.#label && nodes.length) {
      this.#label.innerHTML = '';
      this.#label.append(...nodes);
    } else {
      this.#label ??= this.querySelector('label[slot="label"]') || document.createElement('label');
      this.#label.htmlFor = this.#formControlId ?? '';
      this.#label.slot = 'label';
      this.#label.append(...nodes);
      this.append(this.#label);
    }
  }

  #update(): void {
    const { form } = this.formControl || {},
      required = this.formControl?.hasAttribute('required');

    if (form) {
      const requiredCount = Array.from(form.elements).reduce((acc, cur) => {
        return cur.hasAttribute('required') ? acc + 1 : acc;
      }, 0);

      const optionalCount = form.elements.length - requiredCount,
        showRequired = requiredCount <= optionalCount;

      this.optional = !required && !showRequired;
      this.required = required && showRequired;
    } else {
      this.optional = false;
      this.required = required;
    }
  }
}
