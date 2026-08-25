import { type FormControlShowValidity } from '@sl-design-system/form';
import { type Infotip } from '@sl-design-system/infotip';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-radio': Radio;
  }
}
export type RadioButtonSize = 'md' | 'lg';
/**
 * A radio button with 2 states; unchecked and checked.
 *
 * @csspart svg - The svg element that contains the radio button circle.
 * @csspart box - The box element that contains the radio button background and border.
 * @csspart wrapper - The wrapper element that carries the radio role.
 * @csspart label - The label of the radio button.
 *
 * @slot default - Text label of the radio button. Technically there are no limits what can be put here; text, images, icons etc.
 * @slot infotip - The slot for the infotip element
 */
export declare class Radio<T = any> extends LitElement {
  #private;
  /** @internal */
  static shadowRootOptions: ShadowRootInit;
  /** @internal */
  static styles: CSSResultGroup;
  /** Whether the radio button is checked. */
  checked?: boolean;
  /** Whether this radio button is disabled. */
  disabled?: boolean;
  /** Indicates if the radio button shows it is (in)valid. */
  showValidity: FormControlShowValidity;
  infotip?: Infotip;
  /** @internal The wrapper element that carries the radio role. */
  private wrapper;
  /**
   * The size of the radio button.
   *
   * @default md
   */
  size?: RadioButtonSize;
  /** The value for this radio button. */
  value?: T;
  get tabIndex(): number;
  set tabIndex(value: number);
  connectedCallback(): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  firstUpdated(): void;
  focus(): void;
  blur(): void;
}
