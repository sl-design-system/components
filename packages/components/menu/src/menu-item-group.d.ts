import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-menu-item-group': MenuItemGroup;
  }
}
/**
 * A group of menu items, use this if you want to group menu items in a menu with other menu items.
 *
 * @slot default - The menu items within a group.
 * @slot header - The header of the group.
 */
export declare class MenuItemGroup extends LitElement {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  /** The optional heading for the group. */
  heading?: string;
  /** Determines whether if and how many menu items can be selected within this group. */
  selects?: 'single' | 'multiple';
  connectedCallback(): void;
  protected update(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
