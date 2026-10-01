/**
 * Shared contracts for the A11 Sesame "Learning materials" run.
 *
 * These live at the run root rather than being exported by the root component, because the root
 * imports its children and the children need the model interfaces — exporting them from the root
 * would create an import cycle.
 *
 * Every field below is domain data or a stable key. No translated strings (i18n is off for this
 * run, but the rule still holds: UI literals belong in the component that renders them), and no
 * structural/presentation config — the vendor accent colours are a CSS map keyed off `PlatformId`,
 * not a model field.
 */

/** Stable vendor key. Drives the accent colour via a CSS attribute selector. */
export type PlatformId = 'bingel' | 'kampus' | 'lexia-provia';

export interface SesameUser {
  /** The user's full name, used for the avatar's initials and its accessible label. */
  displayName: string;
  /** Absolute URL of the user's picture, when the data source provides one. */
  pictureUrl?: string;
}

export interface TopBarModel {
  /** The product wordmark, e.g. `'my vanin'`. Used as image alt text or as a text fallback. */
  brandName: string;
  /** Absolute URL of the wordmark image. Left undefined here — see the run's OQ-21. */
  brandLogoUrl?: string;
  /** Identifier of the currently selected school. */
  schoolId: string;
  /** Display name of the currently selected school. */
  schoolName: string;
  /** The signed-in user. */
  user: SesameUser;
}

export interface AssignedMaterial {
  /** Stable identifier of the assigned material. */
  id: string;
  /** The material's title, as provided by the data source. */
  title: string;
  /** Where the material opens, in a new window. */
  url: string;
  /** Which vendor platform hosts the material. */
  platformId: PlatformId;
}

export interface DigitalPlatform {
  /** Stable vendor key. */
  id: PlatformId;
  /** The vendor's proper name, e.g. `'Bingel'`. */
  name: string;
  /** Absolute URL of the vendor logo. Left undefined here — see the run's OQ-21. */
  logoUrl?: string;
}

export interface AssignedMaterialsModel {
  /** The materials assigned to the signed-in user. */
  materials: AssignedMaterial[];
  /** Vendor lookup, so a material carries only a `platformId` rather than a duplicated name. */
  platforms: DigitalPlatform[];
}

export interface DigitalPlatformsModel {
  /** The vendor platforms the school is connected to. */
  platforms: DigitalPlatform[];
}

export interface FooterLink {
  /** Stable identifier of the link. */
  id: string;
  /** The link's label, owned by the CMS — data, not a UI literal. */
  label: string;
  /** Where the link points. */
  href: string;
}

export interface LanguageOption {
  /** BCP-47 language code, e.g. `'en'`. */
  code: string;
  /** The language's endonym as shown to the user, e.g. `'English - EN'`. */
  label: string;
}

export interface FooterModel {
  /** The publisher wordmark, e.g. `'Sanoma'`. */
  brandName: string;
  /** Absolute URL of the publisher logo. Left undefined here — see the run's OQ-21. */
  brandLogoUrl?: string;
  /** The legal/utility links. */
  links: FooterLink[];
  /** The languages the user can switch to. */
  languages: LanguageOption[];
  /** The active language; matches one `LanguageOption.code`. */
  currentLanguage: string;
}

export interface LearningMaterialsPageModel {
  topBar: TopBarModel;
  assignedMaterials: AssignedMaterialsModel;
  digitalPlatforms: DigitalPlatformsModel;
  footer: FooterModel;
}
