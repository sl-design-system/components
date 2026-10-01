import {
  type DigitalPlatform,
  type LearningMaterialsPageModel
} from './types.js';

/**
 * The design's actual content, transcribed from the Figma reference screenshot
 * (`.implement-design/a11-sesame-learning-materials/screenshot.png`, node `116:19049`).
 *
 * In a real app this would be:
 *   GET /api/schools/{schoolId}/licenses -> LearningMaterialsPageModel
 *
 * `logoUrl` / `brandLogoUrl` are deliberately left undefined on every record. The pipeline has no
 * asset-export step, so the Figma asset URLs 404; rendering a broken-image glyph would corrupt the
 * visual comparison more than omitting the image does. Recorded as a Stage 4 discrepancy.
 */

const BINGEL: DigitalPlatform = { id: 'bingel', name: 'Bingel' };
const KAMPUS: DigitalPlatform = { id: 'kampus', name: 'Kampus' };
const LEXIA_PROVIA: DigitalPlatform = { id: 'lexia-provia', name: 'Lexia Provia' };

export const MOCK_PAGE: LearningMaterialsPageModel = {
  topBar: {
    brandName: 'my vanin',
    schoolId: 'bogaerts-international',
    schoolName: 'Bogaerts International School',
    user: { displayName: 'Anna Mertens' }
  },
  assignedMaterials: {
    platforms: [BINGEL, KAMPUS, LEXIA_PROVIA],
    materials: [
      {
        id: 'alles-klar-aktuell-1',
        title: 'Alles Klar! Aktuell 1',
        url: 'https://bingel.be/alles-klar-aktuell-1',
        platformId: 'bingel'
      },
      {
        id: 'alles-klar-modullar-1',
        title: 'Alles Klar! Modullar 1',
        url: 'https://bingel.be/alles-klar-modullar-1',
        platformId: 'bingel'
      },
      {
        id: 'buckle-up-1',
        title: 'Buckle Up! 1',
        url: 'https://kampus.be/buckle-up-1',
        platformId: 'kampus'
      },
      {
        id: 'buckle-up-2',
        title: 'Buckle Up! 2',
        url: 'https://kampus.be/buckle-up-2',
        platformId: 'kampus'
      },
      {
        id: 'buckle-up-3',
        title: 'Buckle Up! 3',
        url: 'https://kampus.be/buckle-up-3',
        platformId: 'kampus'
      },
      {
        id: 'stay-on-track',
        title: 'Stay ON TRACK',
        url: 'https://lexiaprovia.be/stay-on-track',
        platformId: 'lexia-provia'
      },
      {
        id: 'get-on-track',
        title: 'Get ON TRACK',
        url: 'https://lexiaprovia.be/get-on-track',
        platformId: 'lexia-provia'
      }
    ]
  },
  digitalPlatforms: {
    // Screenshot order: Bingel, Lexia Provia, Kampus — deliberately not the lookup order above.
    platforms: [BINGEL, LEXIA_PROVIA, KAMPUS]
  },
  footer: {
    brandName: 'Sanoma',
    currentLanguage: 'en',
    languages: [
      { code: 'en', label: 'English - EN' },
      { code: 'nl', label: 'Nederlands - NL' },
      { code: 'fr', label: 'Français - FR' }
    ],
    links: [
      { id: 'privacy', label: 'Privacy Policy', href: '/privacy-policy' },
      { id: 'terms', label: 'Terms & Conditions', href: '/terms-and-conditions' },
      { id: 'contact', label: 'Contact', href: '/contact' },
      { id: 'cookies', label: 'Cookies', href: '/cookies' },
      { id: 'disclaimer', label: 'Disclaimer', href: '/disclaimer' }
    ]
  }
};
