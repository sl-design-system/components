import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { SearchField, type SlSearchEvent } from '@sl-design-system/search-field';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { type AssignedMaterial, type AssignedMaterialsModel, type DigitalPlatform } from '../types.js';
import styles from './assigned-materials.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-sesame-assign-license': SlSesameAssignLicenseEvent;
    'sl-sesame-materials-search': SlSesameMaterialsSearchEvent;
  }
}

/** Emitted when the user activates the "Assign a license to myself" CTA. */
export type SlSesameAssignLicenseEvent = CustomEvent<void>;

/**
 * Emitted when the user searches. Re-emits `sl-search-field`'s own `sl-search` event (fired on
 * Enter, or debounced while typing) with the raw query string, so a host app can switch this
 * section to server-side search without touching this component.
 */
export type SlSesameMaterialsSearchEvent = CustomEvent<string>;

/**
 * The "Learning materials" section of the Sesame learning-materials page: the "assign a license"
 * CTA, a search field, and the teal-backed list of the signed-in user's assigned materials, each
 * colour-coded by its vendor platform.
 *
 * This is a presentational component: it receives its `model` from the data-owning page root and
 * never fetches anything itself. It filters `model.materials` locally by the search query (title,
 * case-insensitive) so its story renders a working filter with no extra wiring, and it re-emits
 * the query via `sl-sesame-materials-search` so a host app can replace the local filtering with a
 * server-side search without changing this component.
 *
 * Scoped child of the page root — it does not register a global custom element itself.
 *
 * ```html
 * <sl-sesame-assigned-materials .model=${model}></sl-sesame-assigned-materials>
 * ```
 *
 * @fires sl-sesame-assign-license - Emitted when the user activates the "Assign a license to myself" button.
 * @fires sl-sesame-materials-search - Emitted when the user searches, with the current query.
 */
export class SesameAssignedMaterials extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon,
      'sl-search-field': SearchField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The signed-in user's assigned materials, and the vendor lookup used to render each platform tag. */
  @property({ attribute: false }) model?: AssignedMaterialsModel;

  /** @internal Local UI state: the current search query, used to filter `model.materials` by title. */
  @state() private query = '';

  /** Emits when the user activates the "Assign a license to myself" button. */
  @event({ name: 'sl-sesame-assign-license' }) assignLicenseEvent!: EventEmitter<SlSesameAssignLicenseEvent>;

  /** Emits when the user searches, with the current query. */
  @event({ name: 'sl-sesame-materials-search' })
  materialsSearchEvent!: EventEmitter<SlSesameMaterialsSearchEvent>;

  override render(): TemplateResult {
    const materials = this.#filteredMaterials();

    return html`
      <section aria-labelledby="heading">
        <h1 id="heading">Learning materials</h1>

        <sl-button fill="solid" shape="pill" size="md" @click=${this.#onAssignLicense}>
          <sl-icon aria-hidden="true" name="plus"></sl-icon>
          Assign a license to myself
        </sl-button>

        <sl-search-field
          aria-label="Search by product name"
          placeholder="Search by product name"
          shape="rect"
          size="md"
          @sl-search=${this.#onSearch}
        ></sl-search-field>

        <div class="band">
          <ul>
            ${materials.map(material => this.#renderMaterial(material))}
          </ul>
        </div>
      </section>
    `;
  }

  #renderMaterial(material: AssignedMaterial): TemplateResult {
    const platform = this.model?.platforms.find(candidate => candidate.id === material.platformId);

    return html`
      <li data-platform=${material.platformId}>
        <a class="title" href=${material.url} target="_blank" rel="noopener noreferrer">
          <span class="title-text">${material.title}</span>
          <sl-icon name="square-arrow-up-right" aria-hidden="true"></sl-icon>
          <span class="visually-hidden">(opens in a new window)</span>
        </a>
        <div class="platform-row">
          <span class="platform-label">Platform</span>
          ${platform ? this.#renderPlatformTag(platform) : nothing}
        </div>
      </li>
    `;
  }

  #renderPlatformTag(platform: DigitalPlatform): TemplateResult {
    // `logoUrl` is undefined in the current data source (see the run's mock-data comment), so
    // this renders text only — no `<img>`. A data source that provides `logoUrl` would add one
    // here, ahead of the name, with a 6px gap (see assigned-materials.css).
    return html`<span class="platform-tag">${platform.name}</span>`;
  }

  #filteredMaterials(): AssignedMaterial[] {
    const materials = this.model?.materials ?? [];

    if (!this.query) {
      return materials;
    }

    const query = this.query.toLowerCase();

    return materials.filter(material => material.title.toLowerCase().includes(query));
  }

  #onAssignLicense(): void {
    this.assignLicenseEvent.emit();
  }

  #onSearch(event: SlSearchEvent): void {
    this.query = event.detail;
    this.materialsSearchEvent.emit(event.detail);
  }
}
