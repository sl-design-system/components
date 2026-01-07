import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LitElement, type TemplateResult, html } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'sl-breadcrumb-item': BreadcrumbItem;
  }
}

/**
 * A breadcrumb item component - part of the breadcrumbs component.
 * This component can be used when you can't use an anchor tag but need to bind click events to a different tag.
 * This component will not be visible but will be referred to by the breadcrumbs component that delegates the
 * click on the link inside the breadcrumbs component to this component.
 *
 * ```html
 *   <sl-breadcrumb-item>
 *     Breadcrumb label
 *   </sl-breadcrumb-item>
 * ```
 *
 * @slot default - The content to display inside the breadcrumb item.
 */
export class BreadcrumbItem extends ScopedElementsMixin(LitElement) {
  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotChange}></slot>`;
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const hasContent = event.target.assignedNodes({ flatten: true }).some(node => !!node.textContent?.trim());

    this.toggleAttribute('has-content', hasContent);
  }
}
