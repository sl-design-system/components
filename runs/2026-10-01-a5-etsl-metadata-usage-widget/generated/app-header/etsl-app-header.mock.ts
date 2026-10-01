import { type AppHeaderModel } from './etsl-app-header.js';

/**
 * The header content exactly as the Figma frame renders it. In a real app this slice comes from
 * the route + the signed-in session; the page root owns the fetch and hands this subset down.
 */
export const appHeaderMock: AppHeaderModel = {
  pageTitle: 'Functional management',
  projectName: 'Projects',
  user: { displayName: 'Jesse Vermeer', initials: 'JV' }
};
