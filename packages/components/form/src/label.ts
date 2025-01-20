import { localized, msg } from '@lit/localize';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { type FormControl } from './form-control-mixin.js';
import styles from './label.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-label': Label;
  }
}

export type LabelMark = 'optional' | 'required';

export type LabelSize = 'sm' | 'md' | 'lg';

let nextUniqueId = 0;

/**
 * Label component that hooks a `<label>` element up with the input element of the form control,
 * assuming the input element is in the light DOM (same context of the label).
 */
@localized()
export class Label extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The actual form control id this label links to. */
  #formControlId?: string;

  /** The label instance in the light DOM. */
  #label?: HTMLLabelElement;

  /** Observe the form control for changes to the required attribute. */
  #observer = new MutationObserver(() => this.#update());

  /** Whether the form control is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** The DOM id of the form control this is linked to. */
  @property() for?: string;

  /** @internal The associated form control. */
  @state() formControl: (HTMLElement & FormControl & { size?: string }) | null = null;

  /** Indicates whether the label should indicate if the field is optional or required. */
  @property() mark?: LabelMark;

  /** @internal Whether this label should be marked as required. */
  @state() required?: boolean;

  /** The size of the label. */
  @property({ reflect: true }) size: LabelSize = 'md';

  override connectedCallback(): void {
    super.connectedCallback();

    // Make sure the label doesn't end up in the default slot
    if (this.parentElement?.tagName === 'SL-FORM-FIELD') {
      this.slot = 'label';
    }
  }

  override disconnectedCallback(): void {
    this.#observer.disconnect();

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('for')) {
      if (this.for) {
        this.formControl = (this.getRootNode() as Element)?.querySelector<
          HTMLElement & FormControl & { size?: string }
        >(`#${this.for}`);

        if (this.formControl instanceof LitElement) {
          // If the form control is a LitElement, wait for it to render the form control element
          void this.formControl.updateComplete.then(() => {
            this.#formControlId = this.formControl?.formControlElement?.id;

            if (this.#formControlId) {
              this.#label?.setAttribute('for', this.#formControlId);
            } else {
              this.#label?.removeAttribute('for');
            }
          });
        } else if (!this.formControl) {
          this.#formControlId = this.for;
          this.#label?.setAttribute('for', this.for);
        } else {
          console.warn(`The form control with id "${this.for}" could not be found.`);

          this.#label?.removeAttribute('for');
          this.formControl = null;
        }
      } else {
        this.#label?.removeAttribute('for');
        this.formControl = null;
      }

      console.log(
        'formControl in label',
        this.formControl,
        this.#label,
        this.for,
        'formControlId?',
        this.#formControlId
      );
    }

    if (changes.has('formControl')) {
      if (this.formControl) {
        let target: HTMLElement = this.formControl;

        if (target instanceof LitElement && this.formControl.formControlElement) {
          target = this.formControl.formControlElement;
        }

        if (typeof this.formControl.size === 'string') {
          this.size = (['sm', 'md', 'lg'].find(s => s === this.formControl!.size) as LabelSize) || 'md';
        }

        this.#observer.observe(target, { attributes: true, attributeFilter: ['disabled', 'required'] });
        this.#update();
      } else {
        this.#observer.disconnect();
        this.required = undefined;
      }
    }
  }

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotchange} style="display: none"></slot>
      <slot name="label"></slot>
      ${this.mark === 'optional' && !this.required ? html`<span class="optional">(${msg('optional')})</span>` : nothing}
      ${this.mark === 'required' && this.required ? html`<span class="required">(${msg('required')})</span>` : nothing}
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

      console.log(
        'formControl in label in onSlotChange????',
        this.formControl,
        this.#label,
        this.for,
        'formControlId?',
        this.#formControlId
      );
    }

    this.#label.id ||= `sl-label-${nextUniqueId++}`;
  }

  #update(): void {
    this.disabled = this.formControl?.disabled ?? false;
    this.required = this.formControl?.required ?? false;
  }
}
