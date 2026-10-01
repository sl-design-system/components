import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './page-header.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a6-page-header-overflow': SlA6PageHeaderOverflowEvent;
  }
}

/** One crumb in the breadcrumb trail. */
export interface BreadcrumbLink {
  id: string;
  label: string;
  href: string;
}

/** The kind of resource this page is about; selects the leading glyph. */
export type ResourceKind =
  | 'shared-folder'
  | 'folder'
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'page';

/** The data this component renders; owned/fetched by the page. */
export interface PageHeaderModel {
  breadcrumbs: BreadcrumbLink[];
  heading: string;
  resourceKind: ResourceKind;
}

export type SlA6PageHeaderOverflowEvent = CustomEvent<void>;

/**
 * Which registered icon name carries each resource kind. Structure, not data: the model carries
 * the stable `resourceKind` key and this component owns the mapping.
 *
 * Every value is `null`. The itslearning theme registers 54 icons and **none of them is a folder,
 * file or document glyph** — Figma's `shared-folders`, `docx`, `xlsx` and `pptx` are all absent,
 * and the latter three are multi-colour brand marks that `sl-icon` could not paint anyway (it
 * fills a single `var(--sl-icon-fill-default)`). The leading 32px box is still rendered, empty
 * and `aria-hidden`, so the title's x-offset and the 12px gap survive. The map exists in this
 * shape so that registering one icon later is a one-line change.
 */
const RESOURCE_KIND_ICON: Record<ResourceKind, string | null> = {
  'shared-folder': null,
  folder: null,
  document: null,
  spreadsheet: null,
  presentation: null,
  page: null
};

/**
 * Figma `PageHeader` `4200:13797`, 1148 x 117 — the breadcrumb trail, the resource glyph, the
 * page title and an actions region.
 *
 * Presentational — the page owns the `model`.
 *
 * **`sl-breadcrumbs` is deliberately not used, for a structural reason rather than a cosmetic
 * one.** `packages/components/breadcrumbs/src/breadcrumbs.ts` sets a module-private
 * `COLLAPSE_THRESHOLD = 3` with no property override, so this design's **five** crumbs would
 * collapse to an ellipsis popover plus the last three — the trail would not be the trail. On top
 * of that its separator is a hardcoded `breadcrumb-separator` (a forward slash, where the design
 * draws `chevron-right`), it emits no trailing separator after the last crumb, and it forces
 * `color: var(--sl-color-link-muted-idle) !important` — which resolves to `#757575` in this
 * theme, where the design is `#333333`. None of that is reachable through its public API, and
 * reaching past the public API is not allowed here, so the trail is plain markup.
 *
 * The design also contradicts Figma's own Breadcrumb annotation ("when used inside PageHeader do
 * not show current location!"): it renders all five crumbs *and* a trailing chevron. The pixels
 * win, and the last crumb keeps `aria-current="page"` so the semantics survive too.
 *
 * ```html
 * <sl-a6-page-header .model=${model}></sl-a6-page-header>
 * ```
 *
 * @slot actions - The header's action region. Defaults to an overflow button that fires
 *   `sl-a6-page-header-overflow`; fill it to replace that button entirely. Figma's own PageHeader
 *   models this as an "Actions slot", and it is what lets this component serve frames whose
 *   header carries named buttons instead.
 * @fires sl-a6-page-header-overflow - Emitted when the default overflow button is activated.
 */
export class A6PageHeader extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The breadcrumb trail, the heading and the resource kind. */
  @property({ attribute: false }) model?: PageHeaderModel;

  /** @internal Emits when the default overflow button is activated. */
  @event({ name: 'sl-a6-page-header-overflow' })
  overflowEvent!: EventEmitter<SlA6PageHeaderOverflowEvent>;

  override render(): TemplateResult {
    const model = this.model,
      crumbs = model?.breadcrumbs ?? [],
      iconName = model ? RESOURCE_KIND_ICON[model.resourceKind] : null;

    return html`
      <nav aria-label="Breadcrumb" class="breadcrumbs">
        <ol>
          ${crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;

            return html`
              <li>
                ${index > 0
                  ? html`<span aria-hidden="true" class="separator">
                      <sl-icon name="chevron-right"></sl-icon>
                    </span>`
                  : nothing}
                <a aria-current=${isLast ? 'page' : nothing} href=${crumb.href}>${crumb.label}</a>
                ${isLast
                  ? html`<span aria-hidden="true" class="separator">
                      <sl-icon name="chevron-right"></sl-icon>
                    </span>`
                  : nothing}
              </li>
            `;
          })}
        </ol>
      </nav>
      <div class="title-row">
        <span aria-hidden="true" class="resource-icon">
          ${iconName ? html`<sl-icon name=${iconName}></sl-icon>` : nothing}
        </span>
        <div class="title">
          <h1>${model?.heading ?? ''}</h1>
        </div>
        <div class="actions">
          <slot name="actions">
            <sl-button
              @click=${this.#onOverflowClick}
              aria-label="More actions"
              fill="outline"
              class="overflow">
              <sl-icon name="ellipsis" size="xl"></sl-icon>
            </sl-button>
          </slot>
        </div>
      </div>
    `;
  }

  #onOverflowClick(): void {
    this.overflowEvent.emit();
  }
}
