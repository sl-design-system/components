import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ClassCodeCard } from './class-code-card/class-code-card.js';
import { ClassNav, type ClassNavModel } from './class-nav/class-nav.js';
import { type ClassOverviewModel, loadClassOverview } from './fixtures/class-overview.fixture.js';
import { GlobalNav } from './global-nav/global-nav.js';
import { StudentsPanel } from './students-panel/students-panel.js';
import styles from './class-overview-page.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-a2-class-overview-page': ClassOverviewPage;
  }
}

/**
 * The NSP "class overview" page — a teacher-facing class detail / participants screen.
 *
 * This is the root, data-owning component. It holds one `ClassOverviewModel` and hands each child
 * its own slice as a cohesive model object; no child fetches anything. When no `model` is supplied
 * it loads the fixture, so the page renders the whole 1280×1003 design with no arguments.
 *
 * ```html
 * <sl-a2-class-overview-page></sl-a2-class-overview-page>
 * ```
 *
 * Every tag in this run is prefixed `sl-a2-`. The sibling run `b-nsp-home` is a different frame of
 * **the same Figma file** and minted `sl-nsp-top-nav` from the same `Navigation` component; because
 * the house style registers guarded (`if (!customElements.get(...))`), a shared tag would not throw
 * — the first module loaded would silently win and the second frame would render the other run's
 * element wearing its own attribute names. The prefix is what prevents that.
 */
export class ClassOverviewPage extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      // Each child also registers itself globally, but that is not enough: ScopedElementsMixin
      // gives this host its own registry, and a tag missing from this map is NOT resolved against
      // the global one — it renders as an inert unknown element with no shadow root.
      'sl-a2-class-code-card': ClassCodeCard,
      'sl-a2-class-nav': ClassNav,
      'sl-a2-global-nav': GlobalNav,
      'sl-a2-students-panel': StudentsPanel
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The class whose overview is shown. Used only when `model` is not supplied. */
  @property({ reflect: true, attribute: 'class-id' }) classId = '';

  /** The whole page's data. Falls back to the fixture so the story renders with no args. */
  @property({ attribute: false }) model: ClassOverviewModel | null = null;

  override render(): TemplateResult {
    const model = this.model ?? loadClassOverview(this.classId),
      classNav: ClassNavModel = {
        activeSection: model.activeSection,
        className: model.className
      };

    return html`
      <sl-a2-global-nav .user=${model.user}></sl-a2-global-nav>
      <sl-a2-class-nav .model=${classNav}></sl-a2-class-nav>
      <div class="content">
        <sl-a2-class-code-card code=${model.classCode}></sl-a2-class-code-card>
        <sl-a2-students-panel .model=${{ students: model.students }}></sl-a2-students-panel>
      </div>
    `;
  }
}

// The top-level element for this run's page, so — unlike its scoped children above — it registers
// itself globally, guarded so re-importing the module doesn't throw.
if (!customElements.get('sl-a2-class-overview-page')) {
  customElements.define('sl-a2-class-overview-page', ClassOverviewPage);
}
