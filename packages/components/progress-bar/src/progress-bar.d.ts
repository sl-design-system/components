import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-progress-bar': ProgressBar;
  }
}
export type ProgressVariant = 'success' | 'warning' | 'error';
export type ProgressColor = 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal' | 'yellow';
declare const ProgressBar_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * Progress bar component that can be used to communicate process status.
 *
 * ```html
 *  <sl-progress-bar label="Downloading file">
 *     <span>40% of 100%</span>
 *  </sl-button-bar>
 * ```
 *
 * @slot default - A place for helper text like e.g. `20% of 100%`.
 */
export declare class ProgressBar extends ProgressBar_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** Whether the progress bar has the indeterminate state. */
  indeterminate: boolean;
  /** Label describing the value of the progress bar. */
  label?: string;
  /** The variant of the progress bar. */
  variant?: ProgressVariant;
  /** The color of the progress bar. */
  color?: ProgressColor;
  /** Progress value (from 0...100). */
  value: number;
  private shouldAnnounce;
  /** @internal The name of the icon, depending on the variant. */
  get iconName(): string;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
