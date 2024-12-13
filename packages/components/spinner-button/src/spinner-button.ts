import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Spinner } from '@sl-design-system/spinner';
import { type CSSResultGroup, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './spinner-button.scss.js';

export class SpinnerButton extends ScopedElementsMixin(Button) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-spinner': Spinner
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = [Button.styles, styles];

  /** Set this to switch to the "spinning" state. */
  @property({ type: Boolean }) spinning?: boolean;

  override renderContents(): TemplateResult {
    return html`
      <span class="initial"><slot name="initial"></slot></span>
      <span class="spinning">
        <sl-spinner></sl-spinner>
        <slot name="spinning"></slot>
      </span>
    `;
  }
}
