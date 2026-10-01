import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Avatar, type AvatarColor } from '@sl-design-system/avatar';
import { Button } from '@sl-design-system/button';
import { EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { iconGap } from '../icon-gap.js';
import styles from './material-header.css' with { type: 'css' };

/** The avatar accent colours this design uses, narrowed from the design system's own union. */
export type A7AvatarAccentColor = Extract<AvatarColor, 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal'>;

/** Stable keys for the three contributor roles. Labels are built in this component. */
export type A7ContributorRole = 'administrator' | 'co-author' | 'own-copy';

/** One named person in a contributor group. `name` is per-record free text and renders directly. */
export interface A7ContributorPerson {
  name: string;
  initials: string;
  color: A7AvatarAccentColor;
}

/** A role plus the people in it. `totalCount` may exceed `people.length` — the rest are "+N". */
export interface A7ContributorGroup {
  id: string;
  role: A7ContributorRole;
  people: A7ContributorPerson[];
  totalCount: number;
}

/** Everything the material header renders. */
export interface A7MaterialHeaderModel {
  title: string;
  publisher: string;
  edition: string;
  contributorGroups: A7ContributorGroup[];
}

export type SlA7MyportalDigiboardActionEvent = CustomEvent<void>;
export type SlA7MyportalMaterialEditEvent = CustomEvent<void>;

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-a7-myportal-digiboard-action': SlA7MyportalDigiboardActionEvent;
    'sl-a7-myportal-material-edit': SlA7MyportalMaterialEditEvent;
  }
}

/**
 * The header card for one teaching material: cover, title and imprint, two actions, and the three
 * contributor groups below a rule.
 *
 * Presentational. Role labels and the two button labels are built here from the model's stable
 * keys, so no translated string travels in the data.
 *
 * The cover image, like every other asset in this design, cannot be exported by this pipeline —
 * the Figma asset URLs expire and there is no export step. The cover therefore renders as a real
 * bordered box of the drawn size: border, radius and footprint are faithful and only the
 * photograph is absent.
 *
 * @fires sl-a7-myportal-digiboard-action - When the Digiboardware action is activated.
 * @fires sl-a7-myportal-material-edit - When the Edit action is activated.
 */
export class A7MaterialHeader extends ScopedElementsMixin(LitElement) {
  static override get scopedElements(): ScopedElementsMap {
    return { 'sl-avatar': Avatar, 'sl-button': Button };
  }

  static override styles: CSSResultGroup = styles;

  /** The material's header data. */
  @property({ attribute: false }) model?: A7MaterialHeaderModel;

  /** Emits when the Digiboardware action is activated. */
  @event({ name: 'sl-a7-myportal-digiboard-action' })
  digiboardActionEvent!: EventEmitter<SlA7MyportalDigiboardActionEvent>;

  /** Emits when the Edit action is activated. */
  @event({ name: 'sl-a7-myportal-material-edit' })
  materialEditEvent!: EventEmitter<SlA7MyportalMaterialEditEvent>;

  override render(): TemplateResult {
    const model = this.model;

    if (!model) {
      return html``;
    }

    return html`
      <section aria-labelledby="material-title">
        <div class="top">
          <div class="cover"></div>
          <div class="detail">
            <div class="headline">
              <div class="text">
                <h1 id="material-title">${model.title}</h1>
                <div class="imprint">
                  <span>${model.publisher}</span>
                  <span>${model.edition}</span>
                </div>
              </div>
              <div class="actions">
                <sl-button fill="solid" variant="primary" @click=${this.#onDigiboard}>
                  ${iconGap(16)}
                  Digiboardware
                </sl-button>
                <sl-button fill="outline" @click=${this.#onEdit}>
                  Edit
                  ${iconGap(16)}
                </sl-button>
              </div>
            </div>
            <div class="contributors">
              ${model.contributorGroups.map(group => this.#renderGroup(group))}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  #renderGroup(group: A7ContributorGroup): TemplateResult {
    const overflow = group.totalCount - group.people.length;

    return html`
      <div class="group">
        <!-- Decorative: the names and role are announced by .group-text just below. -->
        <ul aria-hidden="true" class="stack">
          ${group.people.map(
            person => html`
              <li>
                <sl-avatar
                  color=${person.color}
                  display-initials=${person.initials}
                  display-name=${person.name}
                  emphasis="bold"
                  image-only
                  size="lg"
                ></sl-avatar>
              </li>
            `
          )}
          ${overflow > 0
            ? html`
                <li>
                  <sl-avatar
                    color="blue"
                    display-initials="+${overflow}"
                    display-name="and ${overflow} others"
                    emphasis="bold"
                    image-only
                    size="lg"
                  ></sl-avatar>
                </li>
              `
            : null}
        </ul>
        <div class="group-text">
          <span class="names">${this.#names(group)}</span>
          <span class="role">${this.#roleLabel(group)}</span>
        </div>
      </div>
    `;
  }

  /** Builds the names line, appending "and N others" when the group is larger than it names. */
  #names(group: A7ContributorGroup): string {
    const named = group.people.map(person => person.name).join(', '),
      overflow = group.totalCount - group.people.length;

    return overflow > 0 ? `${named} and ${overflow} others` : named;
  }

  /**
   * Builds the role label from the stable key. A literal per branch — the same discipline `msg()`
   * would require if i18n were on for this run, so turning it on later is a local change.
   */
  #roleLabel(group: A7ContributorGroup): string {
    switch (group.role) {
      case 'administrator':
        return 'Administrator';
      case 'co-author':
        return `Co-authors (${group.totalCount})`;
      case 'own-copy':
        return `With own copy (${group.totalCount})`;
    }
  }

  #onDigiboard(): void {
    this.digiboardActionEvent.emit();
  }

  #onEdit(): void {
    this.materialEditEvent.emit();
  }
}
