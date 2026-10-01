import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { type DigitalPlatformsModel } from '../types.js';
import styles from './digital-platforms.css' with { type: 'css' };

/**
 * Presentational summary of the digital-learning-platform vendors a school is connected to.
 *
 * Renders as a scoped child of the Learning materials page root — it does not register a custom
 * element; the root component imports the class directly.
 *
 * ```html
 * <sl-sesame-digital-platforms .model=${model}></sl-sesame-digital-platforms>
 * ```
 */
export class SesameDigitalPlatforms extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The vendor platforms the school is connected to. */
  @property({ attribute: false }) model?: DigitalPlatformsModel;

  override render(): TemplateResult {
    return html`
      <section aria-labelledby="heading">
        <h2 id="heading">Digital platforms</h2>
        <ul>
          ${this.model?.platforms.map(
            platform => html`
              <li data-platform=${platform.id}>
                ${platform.logoUrl
                  ? html`<img src=${platform.logoUrl} alt=${platform.name} />`
                  : nothing}
                <span class="name">${platform.name}</span>
              </li>
            `
          )}
        </ul>
      </section>
    `;
  }
}
