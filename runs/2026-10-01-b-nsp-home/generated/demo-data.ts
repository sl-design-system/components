import { type ClassCardModel } from './class-card/class-card.js';
import { type TopNavModel } from './top-nav/top-nav.js';

/**
 * Demo data for the NSP `home` teacher dashboard, owned by the root `sl-nsp-home-page`.
 *
 * In a real app this would come from an endpoint (e.g. `GET /api/classes`) fetched by the page
 * component — this pipeline has no network/fetch step, so these are typed mocks standing in for
 * that call, in the exact order the design shows the five class cards.
 */
export const DEFAULT_CLASSES: ClassCardModel[] = [
  { id: '5b-english', name: '5B English', studentCount: 15, hasMethod: false },
  { id: '5a-english', name: '5A English', studentCount: 21, hasMethod: false },
  { id: '5c-english', name: '5C English', studentCount: 2, hasMethod: true },
  { id: '6a-english', name: '6A English', studentCount: 2, hasMethod: true },
  { id: '6b-english', name: '6B English', studentCount: 2, hasMethod: true }
];

/**
 * The signed-in teacher and top-nav state. In a real app this would come from an endpoint
 * (e.g. `GET /api/me`) fetched by the page component — no network call happens here.
 *
 * `avatarUrl` is intentionally left `undefined`: this pipeline has no asset-export step, so any
 * mock image URL would 404; `<sl-avatar>` falls back to rendering the user's initials.
 */
export const DEFAULT_NAV: TopNavModel = {
  user: { name: 'Lynn Smith' },
  activeLinkId: 'home'
};
