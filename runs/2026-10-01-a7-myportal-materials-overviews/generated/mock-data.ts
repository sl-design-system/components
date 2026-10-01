import { type A7AppBarModel } from './app-bar/app-bar.js';
import { type A7FilePanelModel } from './file-panel/file-panel.js';
import { type A7MaterialHeaderModel } from './material-header/material-header.js';
import { type A7MaterialTreeModel } from './material-tree/material-tree.js';
import { type A7NavRailItemId } from './nav-rail/nav-rail.js';

/**
 * The page model, exactly as the design draws it.
 *
 * In a real application this comes from the back end — roughly
 * `GET /api/materials/{materialId}/sections/{sectionId}` for the header, tree and files, and the
 * session for the app bar. It is a literal here because the point of this example is to render the
 * design with no configuration.
 *
 * Text is reproduced verbatim, including `Presenation_2025.ppt`, which is misspelled in the design.
 * The design is the ground truth for a pixel comparison, so correcting it would be a divergence.
 */

const APP_BAR: A7AppBarModel = {
  classOptions: [
    { id: '4a', label: '4A' },
    { id: '4b', label: '4B' },
    { id: '5a', label: '5A' }
  ],
  schoolOptions: [
    { id: 'bs-1234', label: 'Basisschool 1234' },
    { id: 'bs-5678', label: 'Basisschool 5678' }
  ],
  selectedClassId: '4a',
  selectedSchoolId: 'bs-1234',
  user: { initials: 'AN', name: 'Anna Nowak' }
};

const MATERIAL_HEADER: A7MaterialHeaderModel = {
  contributorGroups: [
    {
      id: 'admin',
      people: [{ color: 'green', initials: 'DK', name: 'Daniele King' }],
      role: 'administrator',
      totalCount: 1
    },
    {
      id: 'co-authors',
      people: [
        { color: 'blue', initials: 'JV', name: 'Jan Valeero' },
        { color: 'green', initials: 'DK', name: 'Daniele King' }
      ],
      role: 'co-author',
      totalCount: 2
    },
    {
      id: 'own-copy',
      people: [
        { color: 'blue', initials: 'JV', name: 'Jan Valeero' },
        { color: 'green', initials: 'DK', name: 'Daniele King' },
        { color: 'orange', initials: 'KW', name: 'Karl Watson' }
      ],
      role: 'own-copy',
      totalCount: 5
    }
  ],
  edition: 'LO-J4',
  publisher: 'Uitgeverij VAN IN',
  title: 'Reken Maar! 4'
};

const TREE: A7MaterialTreeModel = {
  sections: [
    {
      expanded: true,
      icon: 'books',
      id: 'materials',
      items: [
        { count: 12, id: 'manuals', label: 'Manuals' },
        { count: 8, id: 'overviews', label: 'Overviews' },
        { count: 12, id: 'goals', label: 'Goals' },
        { count: 12, id: 'correction-keys', label: 'Correction Keys' },
        { count: 12, id: 'parent-presentations', label: 'Parent Presentations' },
        { count: 4, id: 'diploma', label: 'End of School Year Diploma' },
        { count: 1, id: 'extra-materials', label: 'Extra Materials' },
        { count: 1, id: 'clock-go', label: 'Clock Reading for GO!' },
        { count: 1, id: 'clock-zill', label: 'Clock Reading for ZILL' },
        { count: 1, id: 'zill-no-diff', label: 'For ZILL Schools Without Differentiation Module' },
        { count: 1, id: 'continue-reken-maar', label: 'Continue with "Reken Maar!"' },
        { count: 1, id: 'technology-guide', label: 'Technology Guide' },
        { count: 1, id: 'my-materials', label: 'My Materials' }
      ],
      label: 'Materials'
    },
    { expanded: false, icon: 'files', id: 'tests', items: [], label: 'Tests' },
    { expanded: false, icon: 'book', id: 'chapter-1', items: [], label: 'Chapter 1' },
    { expanded: false, icon: 'book', id: 'chapter-2', items: [], label: 'Chapter 2' },
    { expanded: false, icon: 'book', id: 'chapter-3', items: [], label: 'Chapter 3' },
    { count: 4, expanded: false, icon: 'book', id: 'chapter-4', items: [], label: 'Chapter 4' },
    { count: 4, expanded: false, icon: 'book', id: 'chapter-5', items: [], label: 'Chapter 5' },
    { count: 4, expanded: false, icon: 'book', id: 'chapter-6', items: [], label: 'Chapter 6' },
    { count: 4, expanded: false, icon: 'book', id: 'chapter-7', items: [], label: 'Chapter 7' },
    { count: 4, expanded: false, icon: 'book', id: 'chapter-8', items: [], label: 'Chapter 8' },
    { count: 4, expanded: false, icon: 'book', id: 'chapter-9', items: [], label: 'Chapter 9' },
    { count: 4, expanded: false, icon: 'book', id: 'chapter-10', items: [], label: 'Chapter 10' }
  ]
};

const FILE_PANEL: A7FilePanelModel = {
  files: [
    { fileType: 'text', id: 'f1', name: 'Annual-Report-2024.format', size: '1.2 MB' },
    { fileType: 'ppt', id: 'f2', name: 'Presenation_2025.ppt', size: '20.1 MB' },
    { fileType: 'mp4', id: 'f3', name: 'Introduction-Video2025.mp4', size: '1.1 GB' },
    { fileType: 'pdf', id: 'f4', name: 'Annual-Report-2024.pdf', size: '20.1 MB' },
    { fileType: 'invoice-dollar', id: 'f5', name: 'file-invoice-dollar.rtf', size: '2.9 MB' },
    { fileType: 'doc', id: 'f6', name: 'file-name.doc', size: '181 KB' },
    { fileType: 'word', id: 'f7', name: 'file-name.word', size: '800 KB' },
    { fileType: 'word', id: 'f8', name: 'file-name.word', size: '800 KB' }
  ],
  heading: 'Overviews'
};

/** The whole page as drawn. */
export const MOCK_PAGE: {
  activeNavItem: A7NavRailItemId;
  activeTreeItemId: string;
  appBar: A7AppBarModel;
  breadcrumb: string;
  filePanel: A7FilePanelModel;
  materialHeader: A7MaterialHeaderModel;
  tree: A7MaterialTreeModel;
} = {
  activeNavItem: 'home',
  activeTreeItemId: 'overviews',
  appBar: APP_BAR,
  breadcrumb: 'Reken Maar! 4',
  filePanel: FILE_PANEL,
  materialHeader: MATERIAL_HEADER,
  tree: TREE
};

/** The shape of {@link MOCK_PAGE}, so the root can accept an override of the same type. */
export type A7PageModel = typeof MOCK_PAGE;
