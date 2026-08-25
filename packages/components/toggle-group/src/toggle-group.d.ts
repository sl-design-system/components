import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-toggle-group': ToggleGroup;
  }
}
export type ToggleGroupFill = 'outline' | 'solid';
export type ToggleGroupShape = 'pill' | 'rect';
export type ToggleGroupSize = 'sm' | 'md' | 'lg';
/**
 * A component for visually grouping toggle buttons together. By default, this component ensures
 * that only one button in the group is active at a time. This behavior can be disabled by setting
 * the `multiple` property.
 *
 * @slot default - The default slot for toggle buttons.
 * For toggle group there is a possibility to use toggle buttons with text only.
 */
export declare class ToggleGroup extends LitElement {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  /**
   * If set, will disable all buttons in the group.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * By default, only a single toggle button inside the group can be active. This means that the
   * group will automatically deactivate the other buttons when one is toggled.
   *
   * When set to true multiple buttons can be active at the same time. In this case the group does
   * nothing when a button is toggled. Use this mode if you want to handle the toggling of buttons
   * yourself.
   *
   * @default false
   */
  multiple?: boolean;
  /**
   * Determines the size of all buttons in the group.
   *
   * @default 'md'
   */
  size?: ToggleGroupSize;
  /**
   * The shape of the group.
   *
   * @default 'rect'
   */
  shape?: ToggleGroupShape;
  /**
   * The fill of the group.
   *
   * @default 'solid'
   */
  fill?: ToggleGroupFill;
  connectedCallback(): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
