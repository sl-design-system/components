import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Avatar } from '@sl-design-system/avatar';
import { Icon } from '@sl-design-system/icon';
import { Option, Select } from '@sl-design-system/select';
import { EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { REGISTERED_GLYPHS, iconGap } from '../icon-gap.js';
import styles from './app-bar.css' with { type: 'css' };

/** One entry in either of the app bar's two selects. */
export interface A7SelectOption {
  id: string;
  label: string;
}

/** The signed-in user, as the bar displays them. */
export interface A7UserSummary {
  name: string;
  initials: string;
}

/** Stable keys for the four quick actions. The labels live in this component, not in the model. */
export type A7QuickActionId = 'new-task' | 'give-feedback' | 'new-care-note' | 'view-island';

/** Everything the app bar renders. One cohesive object, per the data-ownership convention. */
export interface A7AppBarModel {
  classOptions: A7SelectOption[];
  selectedClassId: string;
  schoolOptions: A7SelectOption[];
  selectedSchoolId: string;
  user: A7UserSummary;
}

export type SlA7MyportalClassChangeEvent = CustomEvent<{ classId: string }>;
export type SlA7MyportalSchoolChangeEvent = CustomEvent<{ schoolId: string }>;
export type SlA7MyportalQuickActionEvent = CustomEvent<{ action: A7QuickActionId }>;
export type SlA7MyportalUserMenuToggleEvent = CustomEvent<void>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a7-myportal-class-change': SlA7MyportalClassChangeEvent;
    'sl-a7-myportal-school-change': SlA7MyportalSchoolChangeEvent;
    'sl-a7-myportal-quick-action': SlA7MyportalQuickActionEvent;
    'sl-a7-myportal-user-menu-toggle': SlA7MyportalUserMenuToggleEvent;
  }
}

/**
 * Structural config, not data: a fixed action set is structure, and this row is app-global chrome
 * rather than part of the fetched record. The conventions allow that to stay with the component
 * that renders it, provided it is called out — this is the call-out.
 *
 * Of the four glyphs, only `plus` is in the theme's 54-icon registry; the other three render as a
 * reserved `iconGap` footprint. The `glyph` field drives that choice rather than describing it.
 */
const QUICK_ACTIONS: ReadonlyArray<{ id: A7QuickActionId; label: string; glyph: string }> = [
  { id: 'new-task', label: 'New task', glyph: 'plus' },
  { id: 'give-feedback', label: 'Give Feedback', glyph: 'comment' },
  { id: 'new-care-note', label: 'New care note', glyph: 'note' },
  { id: 'view-island', label: 'View island', glyph: 'image' }
];

/**
 * The Bingel portal's top chrome: a blue bar carrying the wordmark, a class select, a school
 * select, a notifications bell and the signed-in user, above a white quick-actions row.
 *
 * Presentational — it owns no data. The page hands it one {@link A7AppBarModel} and listens for
 * the four events it emits.
 *
 * @fires sl-a7-myportal-class-change - When the user picks a different class.
 * @fires sl-a7-myportal-school-change - When the user picks a different school.
 * @fires sl-a7-myportal-quick-action - When one of the four quick actions is activated.
 * @fires sl-a7-myportal-user-menu-toggle - When the user chip is activated.
 */
export class A7AppBar extends ScopedElementsMixin(LitElement) {
  static override get scopedElements(): ScopedElementsMap {
    return { 'sl-avatar': Avatar, 'sl-icon': Icon, 'sl-option': Option, 'sl-select': Select };
  }

  static override styles: CSSResultGroup = styles;

  /** The bar's data. */
  @property({ attribute: false }) model?: A7AppBarModel;

  /** Emits when the user picks a different class. */
  @event({ name: 'sl-a7-myportal-class-change' }) classChangeEvent!: EventEmitter<SlA7MyportalClassChangeEvent>;

  /** Emits when the user picks a different school. */
  @event({ name: 'sl-a7-myportal-school-change' }) schoolChangeEvent!: EventEmitter<SlA7MyportalSchoolChangeEvent>;

  /** Emits when one of the four quick actions is activated. */
  @event({ name: 'sl-a7-myportal-quick-action' }) quickActionEvent!: EventEmitter<SlA7MyportalQuickActionEvent>;

  /** Emits when the user chip is activated. */
  @event({ name: 'sl-a7-myportal-user-menu-toggle' })
  userMenuToggleEvent!: EventEmitter<SlA7MyportalUserMenuToggleEvent>;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html``;
    }

    return html`
      <div class="brand-bar">
        <div class="brand-bar-start">
          ${iconGap(71.25, 30)}
          <sl-select
            aria-label="Class"
            class="selectbox"
            .value=${model.selectedClassId}
            @sl-change=${this.#onClassChange}
          >
            ${model.classOptions.map(
              option => html`<sl-option .value=${option.id}>${option.label}</sl-option>`
            )}
          </sl-select>
        </div>
        <div class="brand-bar-end">
          <sl-select
            aria-label="School"
            class="selectbox"
            .value=${model.selectedSchoolId}
            @sl-change=${this.#onSchoolChange}
          >
            ${model.schoolOptions.map(
              option => html`<sl-option .value=${option.id}>${option.label}</sl-option>`
            )}
          </sl-select>
          ${iconGap(21, 24)}
          <!--
            No aria-haspopup/aria-expanded here on purpose: no menu is ever rendered, so both would
            be false assertions and aria-expanded would be a literal bound to nothing. Reintroduce
            them together with the popup, bound to real state.
          -->
          <button class="user" type="button" @click=${this.#onUserMenuToggle}>
            <sl-avatar
              display-initials=${model.user.initials}
              display-name=${model.user.name}
              size="md"
            ></sl-avatar>
            <sl-icon class="user-chevron" name="chevron-down"></sl-icon>
          </button>
        </div>
      </div>
      <div class="quick-bar">
        <span class="quick-bar-label" id="quick-actions-label">Quick actions:</span>
        <ul aria-labelledby="quick-actions-label" class="quick-actions">
          ${QUICK_ACTIONS.map(
            action => html`
              <li>
                <button type="button" @click=${() => this.#onQuickAction(action.id)}>
                  ${REGISTERED_GLYPHS.has(action.glyph)
                    ? html`<sl-icon class="quick-glyph" name=${action.glyph}></sl-icon>`
                    : iconGap(16)}
                  <span>${action.label}</span>
                </button>
              </li>
            `
          )}
        </ul>
      </div>
    `;
  }

  #onClassChange(evt: Event & { target: Select }): void {
    this.classChangeEvent.emit({ classId: String(evt.target.value) });
  }

  #onSchoolChange(evt: Event & { target: Select }): void {
    this.schoolChangeEvent.emit({ schoolId: String(evt.target.value) });
  }

  #onQuickAction(action: A7QuickActionId): void {
    this.quickActionEvent.emit({ action });
  }

  #onUserMenuToggle(): void {
    this.userMenuToggleEvent.emit();
  }
}
