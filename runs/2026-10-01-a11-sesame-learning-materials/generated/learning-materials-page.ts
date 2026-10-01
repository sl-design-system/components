import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import {
  SesameAssignedMaterials,
  type SlSesameAssignLicenseEvent,
  type SlSesameMaterialsSearchEvent
} from './assigned-materials/assigned-materials.js';
import { SesameDigitalPlatforms } from './digital-platforms/digital-platforms.js';
import { SesameFooter, type SlSesameLanguageSelectEvent } from './footer/footer.js';
import { MOCK_PAGE } from './mock-data.js';
import {
  SesameTopBar,
  type SlSesameMenuToggleEvent,
  type SlSesameProfileSelectEvent,
  type SlSesameSchoolSwitchEvent
} from './top-bar/top-bar.js';
import { type LearningMaterialsPageModel } from './types.js';
import styles from './learning-materials-page.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-sesame-learning-materials-page': LearningMaterialsPage;
  }
}

/**
 * The "My Sesame" learning-materials page: a school's assigned digital-learning-platform
 * licenses. A branded top bar with an active-school switcher sits above a searchable,
 * colour-coded list of the signed-in user's assigned materials (with a self-assign CTA), a
 * summary of the digital platforms the school is connected to, and a footer with legal links and
 * a language selector.
 *
 * This is the run's root and its **sole data owner** — it holds the full page model (mocked here
 * via `MOCK_PAGE`; see that module for where the real fetch would go, e.g.
 * `GET /api/schools/{schoolId}/licenses`) and hands each presentational child exactly the slice of
 * it that child renders. It composes its four children through a scoped element registry and is
 * the only element in this run that registers globally.
 *
 * It renders the design with no configuration:
 *
 * ```html
 * <sl-sesame-learning-materials-page></sl-sesame-learning-materials-page>
 * ```
 */
export class LearningMaterialsPage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-sesame-assigned-materials': SesameAssignedMaterials,
      'sl-sesame-digital-platforms': SesameDigitalPlatforms,
      'sl-sesame-footer': SesameFooter,
      'sl-sesame-top-bar': SesameTopBar
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The page's data: the top bar, the assigned materials, the connected digital platforms, and
   * the footer. Defaults to the design's own mock content, so this renders the design with zero
   * configuration.
   *
   * @default MOCK_PAGE
   */
  @property({ attribute: false }) model: LearningMaterialsPageModel = MOCK_PAGE;

  override render(): TemplateResult {
    const { assignedMaterials, digitalPlatforms, footer, topBar } = this.model;

    return html`
      <!--
        A neutral wrapper on purpose: the "main" landmark belongs to the application that embeds
        this page, so neither the main element nor role="main" is used here.
      -->
      <div class="page">
        <sl-sesame-top-bar
          @sl-sesame-menu-toggle=${this.#onMenuToggle}
          @sl-sesame-profile-select=${this.#onProfileSelect}
          @sl-sesame-school-switch=${this.#onSchoolSwitch}
          .model=${topBar}></sl-sesame-top-bar>

        <sl-sesame-assigned-materials
          @sl-sesame-assign-license=${this.#onAssignLicense}
          @sl-sesame-materials-search=${this.#onMaterialsSearch}
          .model=${assignedMaterials}></sl-sesame-assigned-materials>

        <!--
          sl-sesame-digital-platforms renders no inline gutter of its own (only its cards pad
          their interior) - see learning-materials-page.css for why the gutter is added via this
          wrapper rather than by padding the custom element directly.
        -->
        <div class="digital-platforms">
          <sl-sesame-digital-platforms .model=${digitalPlatforms}></sl-sesame-digital-platforms>
        </div>

        <sl-sesame-footer
          @sl-sesame-language-select=${this.#onLanguageSelect}
          .model=${footer}></sl-sesame-footer>
      </div>
    `;
  }

  // The handlers below are no-ops: in a real app they would drive routing (school switch,
  // profile/account menu), a mobile nav drawer (menu toggle), a server-side search request
  // (materials search), and a language/locale switch (language select) — none of which this
  // mocked example owns. They're wired here so the page compiles against the exact contract its
  // children emit, and so a host app has an obvious seam to replace each `console.log` with real
  // behaviour.

  #onSchoolSwitch({ detail: schoolId }: SlSesameSchoolSwitchEvent): void {
    console.log('sl-sesame-school-switch', schoolId);
  }

  #onMenuToggle({ detail: open }: SlSesameMenuToggleEvent): void {
    console.log('sl-sesame-menu-toggle', open);
  }

  #onProfileSelect(_event: SlSesameProfileSelectEvent): void {
    console.log('sl-sesame-profile-select');
  }

  #onAssignLicense(_event: SlSesameAssignLicenseEvent): void {
    console.log('sl-sesame-assign-license');
  }

  #onMaterialsSearch({ detail: query }: SlSesameMaterialsSearchEvent): void {
    console.log('sl-sesame-materials-search', query);
  }

  #onLanguageSelect({ detail: code }: SlSesameLanguageSelectEvent): void {
    console.log('sl-sesame-language-select', code);
  }
}

// This is the run's top-level element, so — unlike its scoped children, which never call
// `customElements.define` — it registers itself globally, guarded so a re-import cannot throw.
if (!customElements.get('sl-sesame-learning-materials-page')) {
  customElements.define('sl-sesame-learning-materials-page', LearningMaterialsPage);
}
