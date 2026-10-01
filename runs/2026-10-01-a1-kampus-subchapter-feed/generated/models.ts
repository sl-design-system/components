/**
 * Shared contracts for the A1 Kampus "Subchapter feed page" run.
 *
 * Data + stable keys only — no translated strings and no structural/presentation config.
 * Each component derives its own visible labels from the stable keys defined here.
 *
 * Authored by the pipeline orchestrator rather than by a component implementer: the
 * decomposition is implemented leaves-first, so no single implementer owns a module that
 * every level imports.
 */

// ---- keys / enums -------------------------------------------------------------------

export type AppNavId = 'my-page' | 'learning-materials' | 'tests' | 'dashboard';

export type AppHeaderActionId = 'search' | 'notifications' | 'help' | 'account';

export type ToolId = 'contents' | 'edit-content' | 'assignments' | 'notes' | 'access-key';

export type FeedFilterId = 'all' | 'text' | 'exercise';

export type FeedViewMode = 'list' | 'grid';

export type FeedItemKind = 'text' | 'exercise';

/**
 * Only `self-correcting` is evidenced in the design. The remaining members are a
 * best guess — the Figma component's full variant list was never enumerated because the
 * file publishes no Code Connect mappings.
 */
export type ExerciseType = 'self-correcting' | 'open' | 'teacher-checked';

// ---- left toolbar -------------------------------------------------------------------

/** Consumed by `sl-a1-kampus-left-toolbar`, produced by `sl-subchapter-feed-page`. */
export interface ToolbarModel {
  activeToolId?: ToolId;
  badges?: Partial<Record<ToolId, number>>;
}

// ---- table of contents --------------------------------------------------------------

export interface TocEntry {
  id: string;
  label: string;
  expanded?: boolean;
  children?: TocEntry[];
}

/** Consumed by `sl-kampus-toc-sidebar`, produced by `sl-subchapter-feed-page`. */
export interface TocModel {
  entries: TocEntry[];
}

// ---- feed header --------------------------------------------------------------------

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
}

/** Totals for the whole subchapter; `all` is derived, never stored. */
export interface FeedFilterCounts {
  text: number;
  exercise: number;
}

/** Consumed by `sl-subchapter-feed-header`, produced by `sl-subchapter-feed-page`. */
export interface FeedHeaderModel {
  breadcrumbs: BreadcrumbItem[];
  /** Per-record free text, rendered directly. */
  heading: string;
  hasPrevious: boolean;
  hasNext: boolean;
  filterCounts: FeedFilterCounts;
}

// ---- feed body ----------------------------------------------------------------------

/** Consumed by `sl-theory-card`. */
export interface TheoryCardModel {
  id: string;
  title: string;
  excerpt: string;
  /** Stable key; the card resolves its own footer label from it. */
  kind: FeedItemKind;
  image?: { src: string; alt: string };
}

/** Consumed by `sl-exercise-card`. */
export interface ExerciseCardModel {
  id: string;
  title: string;
  /** Stable key; the card resolves its own eyebrow label and tile glyph from it. */
  exerciseType: ExerciseType;
  difficulty?: 0 | 1 | 2 | 3;
}

export interface FeedSection {
  id: string;
  /** The design's own content ("Teksti" / "Tehtävät") — data, rendered directly. */
  title: string;
  /** Decides theory list vs. the 2-up exercise grid. */
  kind: FeedItemKind;
  items: Array<TheoryCardModel | ExerciseCardModel>;
}

/** Consumed by `sl-subchapter-feed-list`, produced by `sl-subchapter-feed-page`. */
export interface FeedListModel {
  sections: FeedSection[];
}

// ---- root aggregate -----------------------------------------------------------------

/** Only `sl-subchapter-feed-page` imports this. */
export interface SubchapterFeedPageData {
  activeNavId: AppNavId;
  notificationCount: number;
  toolbar: ToolbarModel;
  toc: TocModel;
  currentTocId: string;
  header: FeedHeaderModel;
  feed: FeedListModel;
}
