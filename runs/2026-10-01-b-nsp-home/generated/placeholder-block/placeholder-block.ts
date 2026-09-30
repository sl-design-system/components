import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './placeholder-block.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-nsp-placeholder-block': PlaceholderBlock;
  }
}

/**
 * A task-list placeholder block for the NSP `home` dashboard.
 *
 * The Figma source (`Content-block`) is documented by its designer as a blueprint that must be
 * detached before use, so this is a plain styled container (no SLDS component composed) rather
 * than an instance of a shippable component. It is fully presentational and stateless: it owns
 * no data, and its default slot falls back to the literal design text so it reproduces the
 * design with no args.
 *
 * ```html
 * <sl-nsp-placeholder-block></sl-nsp-placeholder-block>
 * ```
 *
 * @slot default - The content of the placeholder's dashed inner region; falls back to "Placeholder".
 */
export class PlaceholderBlock extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  override render(): TemplateResult {
    return html`
      <div class="inner">
        <slot>Placeholder</slot>
      </div>
    `;
  }
}

// This is a standalone/top-level element for this example (used directly by the story and by
// the parent page), so it registers itself globally, guarded so re-importing doesn't throw.
if (!customElements.get('sl-nsp-placeholder-block')) {
  customElements.define('sl-nsp-placeholder-block', PlaceholderBlock);
}
