/**
 * The design's own content, transcribed from the Figma reference (Finnish, verbatim).
 *
 * In a real application this would come from
 * `GET /api/subchapters/{subchapterId}/feed` — the page component would fetch it on
 * connect. Here it is a static mock so the story renders the design with zero arguments.
 */
import { type SubchapterFeedPageData } from './models.js';

export const SUBCHAPTER_FEED_PAGE_DATA: SubchapterFeedPageData = {
  activeNavId: 'learning-materials',
  notificationCount: 3,

  toolbar: {
    activeToolId: 'contents',
    badges: { 'edit-content': 4, assignments: 1 }
  },

  toc: {
    entries: [
      { id: 'start-page', label: 'Start page' },
      {
        id: 'mina-kieli-ja-kulttuuri',
        label: 'Minä, kieli ja kulttuuri',
        expanded: true,
        children: [
          { id: 'jakson-tavoitteet', label: 'Jakson tavoitteet' },
          { id: 'subchapter-1', label: '1. Kieli, kulttuuri ja identiteetti' },
          { id: 'subchapter-2', label: '2. Maailman kielet' },
          { id: 'subchapter-3', label: '3. Suomen sukukielet' },
          { id: 'subchapter-4', label: '4. Monikielinen Suomi' },
          { id: 'subchapter-5', label: '5. Suomen kielen ominaispiirteet' },
          { id: 'subchapter-6', label: '6. Puhekielen vaihtelu' },
          { id: 'oma-kappale', label: 'Open oma kappale' }
        ]
      },
      { id: 'kielitieto', label: 'Kielitieto' },
      { id: 'lukutaito', label: 'Lukutaito' }
    ]
  },

  currentTocId: 'subchapter-1',

  header: {
    breadcrumbs: [
      { id: 'start-page', label: 'Start page', href: '#' },
      { id: 'kielitieto', label: 'Kielitieto', href: '#' },
      { id: 'subchapter-1', label: 'Kieli, kulttuuri ja identiteetti' }
    ],
    heading: '1.  Kieli, kulttuuri ja identiteetti',
    hasPrevious: true,
    hasNext: true,
    filterCounts: { text: 11, exercise: 26 }
  },

  feed: {
    sections: [
      {
        id: 'teksti',
        title: 'Teksti',
        kind: 'text',
        items: [
          {
            id: 'theory-1',
            title: 'Kieli, kulttuuri ja identiteetti',
            excerpt:
              'A in sit etiam integer nisl habitant a cras viverra himenaeos a ipsum tortor integer bibendum suspendisse urna tortor tempus vestibulum ac a nascet…',
            kind: 'text',
            // The pipeline has no asset-export step, so this 404s in the harness by design.
            image: { src: '/assets/theory-1.jpg', alt: 'Riippumatto metsässä' }
          }
        ]
      },
      {
        id: 'tehtavat',
        title: 'Tehtävät',
        kind: 'exercise',
        items: [
          { id: 'exercise-1', title: '1.7 Vastaa kysymyksiin', exerciseType: 'self-correcting', difficulty: 2 },
          { id: 'exercise-2', title: '1.7 Vastaa kysymyksiin', exerciseType: 'self-correcting', difficulty: 2 },
          { id: 'exercise-3', title: '1.7 Vastaa kysymyksiin', exerciseType: 'self-correcting', difficulty: 2 },
          { id: 'exercise-4', title: '1.7 Vastaa kysymyksiin', exerciseType: 'self-correcting', difficulty: 2 }
        ]
      },
      {
        id: 'teksti-2',
        title: 'Teksti',
        kind: 'text',
        items: [
          {
            id: 'theory-2',
            title: 'Kieli, kulttuuri ja identiteetti',
            excerpt:
              'A in sit etiam integer nisl habitant a cras viverra himenaeos a ipsum tortor integer bibendum suspendisse urna tortor tempus vestibulum ac a nascet…',
            kind: 'text',
            image: { src: '/assets/theory-2.jpg', alt: 'Riippumatto metsässä' }
          },
          {
            id: 'theory-3',
            title: 'Kieli, kulttuuri ja identiteetti',
            excerpt:
              'A in sit etiam integer nisl habitant a cras viverra himenaeos a ipsum tortor integer bibendum suspendisse urna tortor tempus vestibulum ac a nascet…',
            kind: 'text',
            image: { src: '/assets/theory-3.jpg', alt: 'Riippumatto metsässä' }
          }
        ]
      },
      {
        id: 'tehtavat-2',
        title: 'Tehtävät',
        kind: 'exercise',
        items: [
          { id: 'exercise-5', title: '1.7 Vastaa kysymyksiin', exerciseType: 'self-correcting', difficulty: 2 },
          { id: 'exercise-6', title: '1.7 Vastaa kysymyksiin', exerciseType: 'self-correcting', difficulty: 2 },
          { id: 'exercise-7', title: '1.7 Vastaa kysymyksiin', exerciseType: 'self-correcting', difficulty: 2 },
          { id: 'exercise-8', title: '1.7 Vastaa kysymyksiin', exerciseType: 'self-correcting', difficulty: 2 }
        ]
      }
    ]
  }
};
