import { type IconLibrary, Icon } from '@sl-design-system/icon';

/**
 * Local icon library for the a4-sesame-my-groups run.
 *
 * The framework skill's convention is `Icon.register(faBoxArchive)` with the definition imported
 * from `@fortawesome/pro-regular-svg-icons`. **That package is not installed in this checkout**
 * (no `node_modules/@fortawesome`, no registry credential), so following the convention produces
 * an unresolvable import and the story never loads. The `itslearning` theme registers only 34
 * icons, none of which cover this design's glyph set.
 *
 * So the glyphs below are inline SVG approximations of the Font Awesome 6 Pro Regular icons the
 * design uses, registered through the `IconLibrary` overload of `Icon.register`. They are
 * geometric stand-ins, not the real FA outlines — a deliberate, recorded fidelity discrepancy.
 */
const svg = (body: string): string =>
  `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;

export const runIcons = {
  'box-archive': {
    value: 'box-archive',
    type: 'FontAwesome icon',
    svg: svg(
      '<path fill="currentColor" d="M32 32h448v96H32V32zm32 128h384v288a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160zm128 64a16 16 0 0 0 0 32h128a16 16 0 0 0 0-32H192z"/>'
    )
  },
  download: {
    value: 'download',
    type: 'FontAwesome icon',
    svg: svg(
      '<path fill="currentColor" d="M240 32h32v246l84-84 23 23-123 123-123-123 23-23 84 84V32zM64 384h384v64a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32v-64z"/>'
    )
  },
  upload: {
    value: 'upload',
    type: 'FontAwesome icon',
    svg: svg(
      '<path fill="currentColor" d="M256 24l123 123-23 23-84-84v246h-32V86l-84 84-23-23L256 24zM64 384h384v64a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32v-64z"/>'
    )
  },
  plus: {
    value: 'plus',
    type: 'FontAwesome icon',
    svg: svg('<path fill="currentColor" d="M232 56h48v176h176v48H280v176h-48V280H56v-48h176V56z"/>')
  },
  'magnifying-glass': {
    value: 'magnifying-glass',
    type: 'FontAwesome icon',
    svg: svg(
      '<path fill="currentColor" d="M208 48a160 160 0 1 1 0 320 160 160 0 0 1 0-320zm0 32a128 128 0 1 0 0 256 128 128 0 0 0 0-256zm120 246l23-23 137 137-23 23-137-137z"/>'
    )
  },
  xmark: {
    value: 'xmark',
    type: 'FontAwesome icon',
    svg: svg(
      '<path fill="currentColor" d="M120 97l39 0 97 97 97-97 39 0 0 39-97 97 97 97 0 39-39 0-97-97-97 97-39 0 0-39 97-97-97-97 0-39z"/>'
    )
  },
  ellipsis: {
    value: 'ellipsis',
    type: 'FontAwesome icon',
    svg: svg(
      '<path fill="currentColor" d="M96 216a40 40 0 1 1 0 80 40 40 0 0 1 0-80zm160 0a40 40 0 1 1 0 80 40 40 0 0 1 0-80zm160 0a40 40 0 1 1 0 80 40 40 0 0 1 0-80z"/>'
    )
  },
  eye: {
    value: 'eye',
    type: 'FontAwesome icon',
    svg: svg(
      '<path fill="currentColor" d="M256 112c106 0 194 79 240 144-46 65-134 144-240 144S62 321 16 256c46-65 134-144 240-144zm0 32c-84 0-158 58-201 112 43 54 117 112 201 112s158-58 201-112c-43-54-117-112-201-112zm0 40a72 72 0 1 1 0 144 72 72 0 0 1 0-144zm0 32a40 40 0 1 0 0 80 40 40 0 0 0 0-80z"/>'
    )
  },
  trash: {
    value: 'trash',
    type: 'FontAwesome icon',
    svg: svg(
      '<path fill="currentColor" d="M192 32h128l16 32h96v32H80V64h96l16-32zM112 128h288l-18 320a32 32 0 0 1-32 30H162a32 32 0 0 1-32-30L112 128zm80 48v256h32V176h-32zm96 0v256h32V176h-32z"/>'
    )
  },
  'boxes-packing': {
    value: 'boxes-packing',
    type: 'FontAwesome icon',
    svg: svg(
      '<path fill="currentColor" d="M32 32h192v64H32V32zm16 96h160v320a32 32 0 0 1-32 32H80a32 32 0 0 1-32-32V128zm96 64a16 16 0 0 0 0 32h32a16 16 0 0 0 0-32h-32zM288 64h192v64H288V64zm16 96h160v288a32 32 0 0 1-32 32h-96a32 32 0 0 1-32-32V160z"/>'
    )
  },
  'school-flag': {
    value: 'school-flag',
    type: 'FontAwesome icon',
    svg: svg(
      '<path fill="currentColor" d="M240 16h32v40l144 40-144 40v88h-32V16zM64 224h384v224a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V224zm160 96v128h64V320h-64z"/>'
    )
  },
  gear: {
    value: 'gear',
    type: 'FontAwesome icon',
    svg: svg(
      '<path fill="currentColor" d="M256 32l32 56 64-8 8 64 56 32-32 56 32 56-56 32-8 64-64-8-32 56-32-56-64 8-8-64-56-32 32-56-32-56 56-32 8-64 64 8 32-56zm0 144a80 80 0 1 0 0 160 80 80 0 0 0 0-160z"/>'
    )
  },
  'chevron-up': {
    value: 'chevron-up',
    type: 'FontAwesome icon',
    svg: svg(
      '<path fill="currentColor" d="M256 160l176 176-23 23-153-153-153 153-23-23L256 160z"/>'
    )
  },
  globe: {
    value: 'globe',
    type: 'FontAwesome icon',
    svg: svg(
      '<path fill="currentColor" d="M256 32a224 224 0 1 1 0 448 224 224 0 0 1 0-448zm0 32c-26 0-58 31-76 88h152c-18-57-50-88-76-88zM160 184c-3 22-5 46-5 72s2 50 5 72h192c3-22 5-46 5-72s-2-50-5-72H160zm-32 0H71a192 192 0 0 0 0 144h57c-3-23-5-47-5-72s2-49 5-72zm256 0c3 23 5 47 5 72s-2 49-5 72h57a192 192 0 0 0 0-144h-57zM180 360c18 57 50 88 76 88s58-31 76-88H180z"/>'
    )
  },
  'triangle-exclamation': {
    value: 'triangle-exclamation',
    type: 'FontAwesome icon',
    svg: svg(
      '<path fill="currentColor" d="M256 32l224 416H32L256 32zm-16 144v128h32V176h-32zm0 160v32h32v-32h-32z"/>'
    )
  }
} as const;

let registered = false;

/** Registers the run's local icon glyphs once. Safe to call from every component. */
export const registerRunIcons = (): void => {
  if (registered) {
    return;
  }

  registered = true;
  Icon.register(runIcons as unknown as IconLibrary);
};
