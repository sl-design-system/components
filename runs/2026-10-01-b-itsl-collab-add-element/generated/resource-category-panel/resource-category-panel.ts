import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { Panel } from '@sl-design-system/panel';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property } from 'lit/decorators.js';
import styles from './resource-category-panel.css' with { type: 'css' };

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-resource-category-select': SlResourceCategorySelectEvent;
  }
}

/**
 * The four visible file-type categories this run renders, plus the hidden Google Docs/Slides/
 * Sheets variants that exist as hidden sibling nodes in the Figma frame (kept in the union so the
 * type is future-proof; the mock data below only ever populates the four visible ids).
 */
export type ResourceCategoryId =
  | 'xlsx'
  | 'pptx'
  | 'docx'
  | 'page'
  | 'google-doc'
  | 'google-slides'
  | 'google-sheets';

/** One category tile: a file-type illustration (see below), a bold title and a description. */
export interface ResourceCategory {
  id: ResourceCategoryId;
  label: string;
  description: string;
  href?: string;
}

/** The data this component renders: the panel's list of category tiles. */
export interface ResourcePanelModel {
  categories: ResourceCategory[];
}

export type SlResourceCategorySelectEvent = CustomEvent<{ categoryId: ResourceCategoryId }>;

/**
 * The "Resources" panel: a bordered, titled panel holding a wrapped grid of category links,
 * one per resource type a folder can hold (Excel, PowerPoint, Word, Page, ...).
 *
 * Each category's file-type illustration is a multi-colour stack of 8-11 Figma vector paths -
 * structurally incompatible with `sl-icon`'s monochrome rendering, not registered in the
 * itslearning theme's `icons.ts`, and not obtainable through this pipeline (no asset-export
 * step). A neutral 48x48 placeholder square stands in for it instead, preserving the tile's box
 * metrics so only the illustration itself is a (recorded) discrepancy.
 *
 * This is a presentational component: the root owns and passes in the category list.
 *
 * ```html
 * <sl-resource-category-panel .model=${model}></sl-resource-category-panel>
 * ```
 *
 * @fires sl-resource-category-select - Emitted when a category link is activated.
 */
export class ResourceCategoryPanel extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-panel': Panel
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The categories to render in the panel. */
  @property({ attribute: false }) model?: ResourcePanelModel;

  /** @internal Emits when a category link is activated. */
  @event({ name: 'sl-resource-category-select' })
  categorySelectEvent!: EventEmitter<SlResourceCategorySelectEvent>;

  override render(): TemplateResult {
    const categories = this.model?.categories ?? [];

    return html`
      <sl-panel>
        <h2 slot="heading">Resources</h2>
        <ul>
          ${categories.map(category => this.#renderCategory(category))}
        </ul>
      </sl-panel>
    `;
  }

  #renderCategory(category: ResourceCategory): TemplateResult {
    return html`
      <li>
        <a @click=${() => this.#onCategoryClick(category.id)} href=${ifDefined(category.href)}>
          <span aria-hidden="true" class="icon"></span>
          <span class="title">${category.label}</span>
          <span class="description">${category.description}</span>
        </a>
      </li>
    `;
  }

  #onCategoryClick(categoryId: ResourceCategoryId): void {
    this.categorySelectEvent.emit({ categoryId });
  }
}
