import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import styles from './icon.scss.js';

export type IconResolver = (name: string) => string;
export type IconSize = 'sm' | 'md' | 'lg';

export class Icon extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** @private */
  static resolver: IconResolver = _ =>
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2s-6.3 25.5 4.1 33.7l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L489.3 358.2l90.5-90.5c56.5-56.5 56.5-148 0-204.5-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6 31.5 31.5 31.5 82.5 0 114l-96 96-31.9-25c24.3-53.8 13.5-118.3-29.6-161.4-52.2-52.3-134.5-56.2-191.3-11.7L38.8 5.1zM239 162c30.1-14.9 67.7-9.9 92.8 15.3 20 20 27.5 48.3 21.7 74.5L239 162zm167.6 254.4L220.9 270c-2.1 39.8 12.2 80.1 42.2 110 38.9 38.9 94.4 51 143.6 36.3zm-290-228.5-56.4 56.4c-56.5 56.5-56.5 148 0 204.5 50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5l61.8-61.8-50.6-39.9z"/></svg>';

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

  /** Icon size. */
  @property({ reflect: true }) size: IconSize = 'md';

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
