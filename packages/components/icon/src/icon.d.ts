import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { type IconDefinition, type IconLibrary } from './models.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-icon': Icon;
  }
  interface Window {
    SLDS: {
      icons: IconLibrary;
    };
  }
}
export type IconSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
/**
 * An icon that uses either FontAwesome custom svg's straight from Figma.
 *
 * ```html
 * <sl-icon name="unicorn"></sl-icon>
 * ```
 *
 * @cssprop --sl-icon-fill-accent - Accent color, only used for multicolor icons
 * @cssprop --sl-icon-fill-default - Default fill color
 * @cssprop --sl-icon-size - The size of the icon, defaults to md
 */
export declare class Icon extends LitElement {
  #private;
  /** @internal */
  static styles: CSSResultGroup;
  private iconNotDef;
  private iconLoading;
  /**
   * Add icon(s) to the icon registry
   *
   * @param {IconDefinition | IconDefinition[]} icons One or more IconDefinition that have been
   *   imported from FontAwesome
   */
  static register(...icons: IconDefinition[]): void;
  /**
   * Store all icons from the IconLibrary of the theme (icons.json) in the icon registry for easy
   * access. Is run in the setup method of each theme.
   *
   * @param {IconLibrary} icons The IconLibrary of the theme
   */
  static register(icons: IconLibrary): void;
  private static getColorToken;
  /**
   * The label of the icon; Describes the icon for assistive devices. If not present, the icon is
   * considered to be purely presentational.
   */
  label?: string;
  /**
   * The name of the icon; either the name from Font Awesome or the name of the custom icon in
   * Figma.
   */
  name?: string;
  /**
   * The minumum size of the icon.
   *
   * @type {'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'}
   */
  size?: IconSize;
  /** @internal */
  iconHTML?: string;
  /** @internal */
  sldsLibrary?: {
    icons: IconLibrary;
  };
  connectedCallback(): Promise<void>;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
