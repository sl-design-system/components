import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './label.scss.js';

export class Label extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The label instance in the light DOM. */
  #label?: HTMLLabelElement;

  /** Observe the form control for changes. */
  #observer?: MutationObserver;

  /** The DOM id of the form control this is linked to. */
  @property() for?: string;

  /** The associated form control. */
  @state() formControl: HTMLElement | null = null;

  /** Whether the associated form control is required. */
  @state() required?: boolean;

  override updated(changes: PropertyValues<this>): void {
    if (changes.has('for')) {
      if (this.for) {
        this.#label?.setAttribute('for', this.for);
        this.formControl = (this.getRootNode() as Element)?.querySelector(`#${this.for}`);
      } else {
        this.#label?.removeAttribute('for');
        this.formControl = null;
      }
    }
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('formControl')) {
      if (this.formControl) {
        this.#observer = new MutationObserver(() => this.#update());
        this.#observer.observe(this.formControl, { attributes: true, attributeFilter: ['required'] });

        this.#update();
      } else {
        this.#observer?.disconnect();
        this.#observer = undefined;

        this.required = undefined;
      }
    }
  }

  override disconnectedCallback(): void {
    this.#observer?.disconnect();
    this.#observer = undefined;

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <slot @slotchange=${this.#onSlotchange} style="display: none"></slot>
      <slot name="label"></slot>
      ${this.required ? html`<span class="required">*</span>` : ''}
    `;
  }

  #onSlotchange({ target }: Event & { target: HTMLSlotElement }): void {
    const nodes = target.assignedNodes({ flatten: true });

    this.#label ??= document.createElement('label');
    this.#label.htmlFor = this.for ?? '';
    this.#label.slot = 'label';
    this.#label.append(...nodes);
    this.append(this.#label);
  }

  #update(): void {
    this.required = this.formControl?.hasAttribute('required');
  }
}
