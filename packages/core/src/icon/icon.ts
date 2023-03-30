import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { IconPrefix, IconStyle } from '@fortawesome/fontawesome-common-types';
import type { IconDefinition, IconName } from '@fortawesome/fontawesome-svg-core';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import styles from './icon.scss.js';

export type IconResolver = (name: string) => string;

export interface IconLibrary {
  [key: string]: SLIconDefinition | CustomIconDefinition;
}

interface SLIconDefinition {
  value?: string;
  type?: string;
  style?: string;
  description?: string;
}
interface CustomIconDefinition extends SLIconDefinition {
  svg: string;
}

declare global {
  interface Window {
    SLDS: {
      icons: IconLibrary;
    };
  }
}
if (!window?.SLDS) {
  window['SLDS'] = {
    icons: {}
  };
}

export class Icon extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  static availableStyles: IconStyle[] = [];

  static registerIcon(icon: IconDefinition): void {
    const {
        icon: [width, height, , , path]
      } = icon,
      paths = Array.isArray(path) ? path : [path];
    const svg = `<svg viewBox="0 0 ${width} ${height}" "xmlns="http://www.w3.org/2000/svg">${paths
      .map(p => `<path d="${p}"></path>`)
      .join('')}</svg>`;
    window.SLDS.icons[`${icon.prefix}-${icon.iconName}`] = { svg };
  }

  static registerIcons(icons: IconLibrary): void {
    window.SLDS.icons = icons;
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

  get icons(): IconLibrary {
    return window.SLDS.icons;
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
      return html`${unsafeHTML(this.#resolve(this.name))}`;
    } else {
      return html`No icon name set`;
    }
  }

  #resolve(name: string): string {
    const iconInRegistry: SLIconDefinition | CustomIconDefinition | undefined = this.icons[name];

    if (this.icons && (iconInRegistry as CustomIconDefinition)?.svg) {
      return (iconInRegistry as CustomIconDefinition).svg;
    } else if (name && this.#convertToIconDefinition(name as IconName)) {
      const {
          icon: [width, height, , , path]
        } = this.#convertToIconDefinition(name as IconName),
        paths = Array.isArray(path) ? path : [path];
      // ${paths.map((p, i) => `<path d="${p}" fill="var(--fill-${getColorToken(i, style)})"></path>`).join('')}
      return `
          <svg viewBox="0 0 ${width} ${height}" "xmlns="http://www.w3.org/2000/svg">
            ${paths.map(p => `<path d="${p}"></path>`).join('')}
          </svg>`;
    }
    return '<small>not found</small>';
  }

  #convertToIconDefinition(iconName: IconName): IconDefinition {
    return findIconDefinition({ prefix: 'far', iconName });
  }
}
