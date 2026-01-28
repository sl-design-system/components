import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';

declare global {
  interface HTMLElementTagNameMap {
    'sl-breadcrumb-item': BreadcrumbItem;
  }
}

/**
 * A breadcrumb item component - part of the breadcrumbs component.
 * This component can be used when you can't use an anchor tag with an href attribute but still need to handle click events.
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
  static override styles: CSSResultGroup = [];

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
