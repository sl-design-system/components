import '@sl-design-system/breadcrumbs/register.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
// Bare imports for their side effect only: each child module's own guarded
// `customElements.define` runs when the module body executes. This run does NOT use
// `ScopedElementsMixin` (a scoped registry silently renders a tag missing from its map as an inert
// unknown element with no shadow root, which emptied an earlier run's page), and a type-only
// import (`import { type X } from './x.js'`) is erased and registers nothing — as is a value
// import whose binding is only ever used in a type position.
import './app-bar/a3mp-app-bar.js';
import './chapter-header/a3mp-chapter-header-card.js';
import './chapter-nav/a3mp-chapter-nav-column.js';
import './exercises-panel/a3mp-exercises-panel.js';
import './quick-actions-bar/a3mp-quick-actions-bar.js';
import './side-nav/a3mp-side-nav.js';
import { type SlA3mpChapterToggleEvent, type SlA3mpToolSelectEvent } from './chapter-nav/chapter-nav-item/a3mp-chapter-nav-item.js';
import { type SlA3mpExerciseAddToggleEvent } from './exercises-panel/exercise-list-item/a3mp-exercise-list-item.js';
import { type SlA3mpNavSelectEvent } from './side-nav/a3mp-side-nav.js';
import { DEFAULT_PAGE_DATA, type DigitalExercisesPageData } from './demo-data.js';
import styles from './a3mp-digital-exercises-page.css' with { type: 'css' };

declare global {
  interface HTMLElementTagNameMap {
    'sl-a3mp-digital-exercises-page': A3mpDigitalExercisesPage;
  }
}

/**
 * The Bingel "Chapter / Digital Exercises / Exercises" screen: app bar, quick-actions strip, a
 * 240px primary nav column, and a content area with breadcrumbs, the book header card, the chapter
 * navigation and the exercises panel.
 *
 * This is the data owner — it holds the page data and passes each child the slice it renders. In a
 * real application `data` would come from a fetch; here it defaults to the design's own content so
 * the story renders the frame with no arguments.
 *
 * ```html
 * <sl-a3mp-digital-exercises-page></sl-a3mp-digital-exercises-page>
 * ```
 */
export class A3mpDigitalExercisesPage extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * The page's content. Defaults to the design's own data.
   *
   * @default DEFAULT_PAGE_DATA
   */
  @property({ attribute: false }) data: DigitalExercisesPageData = DEFAULT_PAGE_DATA;

  /**
   * The live copy the page actually renders. `data` is the input; this is the working state the
   * page mutates as the user interacts, so the controls below are not merely decorative.
   *
   * @internal
   */
  @state() private working?: DigitalExercisesPageData;

  override willUpdate(changed: Map<string, unknown>): void {
    // A new `data` input replaces the working copy; interaction then mutates only the copy.
    if (changed.has('data') || !this.working) {
      this.working = this.data;
    }
  }

  override render(): TemplateResult {
    const data = this.working ?? this.data;

    return html`
      <!-- No <main>, no role="main", no page-level <header>/role="banner": the host application
           owns those landmarks. Each region names itself with its own <nav>/<section> label. -->
      <sl-a3mp-app-bar
        .model=${data.appBar}
        @sl-a3mp-app-bar-action=${this.#onAppBarAction}>
      </sl-a3mp-app-bar>
      <sl-a3mp-quick-actions-bar
        .model=${data.quickActions}
        @sl-a3mp-quick-action=${this.#onQuickAction}>
      </sl-a3mp-quick-actions-bar>
      <div class="body">
        <sl-a3mp-side-nav
          .model=${data.sideNav}
          @sl-a3mp-nav-select=${this.#onNavSelect}>
        </sl-a3mp-side-nav>
        <div class="content">
          <!-- sl-breadcrumbs renders its own home link, and that link carries the
               'home-blank' icon the design draws. 'home-blank' is one of the 34 names bingel-int
               registers, so suppressing it with 'no-home' and hand-rolling a plain anchor - as
               this run first did - dropped a glyph that was available. Only the trailing crumb is
               slotted. NOTE: no backticks inside a template-literal comment; they terminate the
               literal. -->
          <sl-breadcrumbs home-url="#home">
            ${data.breadcrumbs
              .filter(crumb => crumb.id !== 'home')
              .map(crumb => html`<span aria-current="page">${crumb.label}</span>`)}
          </sl-breadcrumbs>
          <sl-a3mp-chapter-header
            .model=${data.chapterHeader}
            @sl-a3mp-chapter-header-action=${this.#onChapterHeaderAction}>
          </sl-a3mp-chapter-header>
          <div class="columns">
            <sl-a3mp-chapter-nav
              .model=${data.chapterNav}
              @sl-a3mp-chapter-toggle=${this.#onChapterToggle}
              @sl-a3mp-search-change=${this.#onSearchChange}
              @sl-a3mp-tool-select=${this.#onToolSelect}>
            </sl-a3mp-chapter-nav>
            <sl-a3mp-exercises-panel
              .model=${data.exercisesPanel}
              @sl-a3mp-exercise-add-toggle=${this.#onExerciseAddToggle}
              @sl-a3mp-exercise-view=${this.#onExerciseView}
              @sl-a3mp-level-change=${this.#onLevelChange}>
            </sl-a3mp-exercises-panel>
          </div>
        </div>
      </div>
    `;
  }

  /** Moves the primary-navigation selection. */
  #onNavSelect(event: SlA3mpNavSelectEvent): void {
    const data = this.working ?? this.data;

    if (event.detail.itemId === 'collapse') {
      // A real app would collapse the rail to its icon-only width here. The design draws only the
      // expanded state, so this run does not invent the collapsed one.
      return;
    }

    this.working = {
      ...data,
      sideNav: {
        ...data.sideNav,
        items: data.sideNav.items.map(item => ({
          ...item,
          selected: item.id === event.detail.itemId
        }))
      }
    };
  }

  /** Expands or collapses one chapter row. */
  #onChapterToggle(event: SlA3mpChapterToggleEvent): void {
    const data = this.working ?? this.data;

    this.working = {
      ...data,
      chapterNav: {
        ...data.chapterNav,
        chapters: data.chapterNav.chapters.map(chapter =>
          chapter.id === event.detail.chapterId
            ? { ...chapter, expanded: event.detail.expanded }
            : chapter
        )
      }
    };
  }

  /** Moves the selected tool leaf, which is unique across the whole navigation. */
  #onToolSelect(event: SlA3mpToolSelectEvent): void {
    const data = this.working ?? this.data;

    this.working = {
      ...data,
      chapterNav: {
        ...data.chapterNav,
        chapters: data.chapterNav.chapters.map(chapter => ({
          ...chapter,
          leaves: chapter.leaves.map(leaf => ({
            ...leaf,
            selected: chapter.id === event.detail.chapterId && leaf.id === event.detail.leafId
          }))
        }))
      }
    };
  }

  /** Flips one exercise between added and not added. */
  #onExerciseAddToggle(event: SlA3mpExerciseAddToggleEvent): void {
    const data = this.working ?? this.data;

    this.working = {
      ...data,
      exercisesPanel: {
        ...data.exercisesPanel,
        exercises: data.exercisesPanel.exercises.map(exercise =>
          exercise.id === event.detail.exerciseId
            ? { ...exercise, added: event.detail.added }
            : exercise
        )
      }
    };
  }

  /** Changes the exercises-level filter. */
  #onLevelChange(event: CustomEvent<{ levelId: string }>): void {
    const data = this.working ?? this.data;

    if (!event.detail.levelId) {
      return;
    }

    this.working = {
      ...data,
      exercisesPanel: { ...data.exercisesPanel, selectedLevelId: event.detail.levelId }
    };
  }

  // The four below have no visible state in this design, so they are deliberate no-ops that
  // document what a real application would do rather than silently dropping the event.

  /** A real app would open the exercise preview dialog. */
  #onExerciseView(_event: CustomEvent<{ exerciseId: string }>): void {
    // Intentionally empty — the design draws no preview surface.
  }

  /** A real app would filter the chapter list by the search term. */
  #onSearchChange(_event: CustomEvent<{ value: string }>): void {
    // Intentionally empty — the design draws no filtered state.
  }

  /** A real app would route to the quick action's target. */
  #onQuickAction(_event: CustomEvent<{ actionId: string }>): void {
    // Intentionally empty — each action navigates away from this screen.
  }

  /** A real app would launch the Digiboardware player or follow the secondary action's link. */
  #onChapterHeaderAction(_event: CustomEvent<{ actionId: string }>): void {
    // Intentionally empty — both actions navigate away from this screen.
  }

  /** A real app would open the class/school switcher or the account menu. */
  #onAppBarAction(_event: CustomEvent<{ actionId: string }>): void {
    // Intentionally empty — the design draws none of these menus open.
  }
}

// Guarded global registration.
if (!customElements.get('sl-a3mp-digital-exercises-page')) {
  customElements.define('sl-a3mp-digital-exercises-page', A3mpDigitalExercisesPage);
}
