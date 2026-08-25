import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-tab': Tab;
  }
}
/**
 * A tab component - part of the tab group component.
 *
 * ```html
 * <sl-tab>
 *   <sl-icon slot="icon" name="star" size="md"></sl-icon>
 *   Tab label
 *   <span slot="subtitle">Tab subtitle</span>
 *   <sl-badge slot="badge" size="lg" variant="danger">4</sl-badge>
 * </sl-tab>
 * ```
 *
 * @slot default - A place for the tab group content.
 * @slot icon - Icon shown on the left side of the component.
 * @slot badge - A place for badge component.
 * @slot subtitle - Subtitle of the tab, containing additional information.
 */
export declare class Tab extends LitElement {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  /** Whether the tab item is disabled. */
  disabled?: boolean;
  /**
   * When set, it will render the tab contents in a link tag. Use this when you want to render the
   * tab contents using a router and to make the tab navigable by URL.
   */
  href?: string;
  /**
   * Indicates if this tab is selected.
   *
   * @default false
   */
  selected?: boolean;
  connectedCallback(): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  /** @internal */
  renderContent(): TemplateResult;
}
