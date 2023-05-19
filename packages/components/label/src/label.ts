import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { FormControlInterface } from '@sl-design-system/shared';
import { Button } from '@sl-design-system/button';
import { Input } from '@sl-design-system/input';
import { Textarea } from '@sl-design-system/textarea';
import { property, state } from 'lit/decorators.js';
import { LitElement, html } from 'lit';
import styles from './label.scss.js';

export type LabelSize = 'sm' | 'md' | 'lg';

export class Label extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The actual form control id this label links to. */
  #formControlId?: string;

  /** The label instance in the light DOM. */
  #label?: HTMLLabelElement;

  /** Observe the form control for changes to the required attribute. */
  #observer = new MutationObserver(() => void this.#update());

  /** The DOM id of the form control this is linked to. */
  @property() for?: string;

  /** The associated form control. */
  @state() formControl: (HTMLElement & FormControlInterface) | null = null;

  /** Whether this label should be marked as optional. */
  @state() optional?: boolean;

  /** Whether this label should be marked as required. */
  @state() required?: boolean;

  /** Label size. */
  @property({ reflect: true }) size: LabelSize = 'md';

  // TODO: add no-spacing attribute

  /** The label disabled state. */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /** Maximum length (number of characters). */
  @property({ type: Boolean, attribute: 'no-padding' }) noPadding?: boolean;

  override disconnectedCallback(): void {
    this.#observer.disconnect();

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
        let target: HTMLElement = this.formControl;

        if (target instanceof Input || target instanceof Textarea) {
          target = this.formControl.querySelector('input, textarea') as HTMLElement;
        }

        if (this.formControl.hasAttribute('disabled')) {
          this.disabled = true;
        }

        this.#observer.observe(target, { attributes: true, attributeFilter: ['required'] });
        void this.#update();
      } else {
        this.#observer.disconnect();
        this.optional = this.required = undefined;
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotchange} style="display: none"></slot>
      <slot name="label"></slot>
      <slot name="icon"></slot>
      <slot name="tooltip"></slot>
      ${this.optional ? html`<span class="optional">(optional)</span>` : ''}
      ${this.required ? html`<span class="required">(required)</span>` : ''}
    `;
  }

  #onSlotchange({ target }: Event & { target: HTMLSlotElement }): void {
    const nodes = target.assignedNodes({ flatten: true });

    if (this.#label && nodes.length) {
      this.#label.innerHTML = '';
      this.#label.append(...nodes);
    } else {
      // Workaround for `??=` output missing parens around OR statement
      this.#label = this.#label ?? (this.querySelector('label[slot="label"]') || document.createElement('label'));
      this.#label.htmlFor = this.#formControlId ?? '';
      this.#label.slot = 'label';
      this.#label.append(...nodes);
      this.append(this.#label);
    }
  }

  async #update(): Promise<void> {
    // Give the component & siblings time to set the required attribute
    await this.updateComplete;

    const { form } = this.formControl || {},
      required = this.formControl?.hasAttribute('required');

    if (form) {
      const controls = Array.from(form.elements).filter(el => !(el instanceof Button));

      // Count the required form controls
      const requiredCount = controls.reduce((count, control) => {
        return count + (control.hasAttribute('required') ? 1 : 0);
      }, 0);

      /**
       * If the required form controls outnumber the optional form controls,
       * then mark the optional form controls. If the optional form controls
       * outnumber the required form controls, mark the required form controls.
       * If there is only a single form element, do nothing.
       */
      const optionalCount = controls.length - requiredCount,
        showRequired = requiredCount <= optionalCount;

      this.optional = !required && !showRequired;
      this.required = required && showRequired;
    } else {
      this.optional = false;
      this.required = required;
    }
  }
}
