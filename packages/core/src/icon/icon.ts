import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { IconPrefix, IconStyle } from '@fortawesome/fontawesome-common-types';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import styles from './icon.scss.js';

export type IconResolver = (name: string, style: IconStyle) => string;

export class Icon extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  static availableStyles: IconStyle[] = [];

  /** @private */
  static resolver: IconResolver = _ => 'No resolver';

  // static registerIcon(name: string, icon: string): void {
  //   console.log('registerIcon', { name, icon });
  // }

  static registerResolver(resolver: IconResolver): void {
    console.log('registerResolver', resolver);
    Icon.resolver = resolver;
    this.resolver = resolver;
  }

  static registerLibraries(styles: IconStyle[]): void {
    Icon.availableStyles = styles;
    this.availableStyles = styles;
    console.log('registerLibraries', styles);
    // await Promise.all(
    //   styles.map(async style => {
    //     console.log('load icons, style:', style);
    //     // FIX ME: what type can i make "module" so this works??
    //     return import(`@fortawesome/pro-${style}-svg-icons/index.js`).then(module => {
    //       console.log(`module is loaded`, module);
    //       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    //       library.add(module[this.getIconPrefixFromStyle(style)]);
    //     });
    //   })
    // );
  }

  static getIconPrefixFromStyle(style: IconStyle): IconPrefix {
    switch (style) {
      case 'solid':
        return 'fas';
      case 'light':
        return 'fal';
      case 'thin':
        return 'fat';
      case 'duotone':
        return 'fad';
      default:
        return 'far';
    }
  }

  /**
   * Describes the icon for assistive devices. If not present, the icon is considered
   * to be purely presentational.
   */
  @property() label?: string;
  @property() iconStyle: IconStyle = 'regular';

  /** The name of the icon to show. */
  @property() name?: string;

  /* make sure the requested style is supported */
  get validatedIconStyle(): IconStyle {
    console.log('validatedIconStyle', Icon.availableStyles);
    const isAvailable = Icon.availableStyles.some(available => this.iconStyle === available);
    if (!isAvailable) {
      console.warn('The requested FontAwesome style is not available, falling back to regular');
    }
    return isAvailable ? this.iconStyle : 'regular';
  }

  constructor() {
    super();
    console.log('Icon constructor', Icon.availableStyles);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    console.log('Icon connectedCallback');
  }

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
      console.log('render', this.name);
      return html`${unsafeHTML(Icon.resolver(this.name, this.validatedIconStyle))}`;
    } else {
      return html`No icon name set`;
    }
  }
}
