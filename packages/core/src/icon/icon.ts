import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import styles from './icon.scss.js';

export type IconResolver = (name: string) => string;

export class Icon extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** @private */
  static resolver: IconResolver = _ => 'No icon found';

  static registerIcon(name: string, icon: string): void {
    console.log('registerIcon', { name, icon });
  }

  static registerResolver(resolver: IconResolver): void {
    this.resolver = resolver;
    console.log('registerResolver', resolver);
  }

  /**
   * Describes the icon for assistive devices. If not present, the icon is considered
   * to be purely presentational.
   */
  @property() label?: string;

  /** The name of the icon to show. */
  @property() name?: string;

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('label')) {
      if (this.label) {
        this.setAttribute('role', 'img');
        this.setAttribute('aria-label', this.label);
        this.removeAttribute('aria-hidden');
      } else {
        this.removeAttribute('role');
        this.removeAttribute('aria-label');
        this.setAttribute('aria-hidden', 'true');
      }
    }
  }

  override render(): TemplateResult {
    if (this.name) {
      return html`${unsafeHTML(Icon.resolver(this.name))}`;
    } else {
      return html`No icon name set`;
    }
  }
}
