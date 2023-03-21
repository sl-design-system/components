import type { IconDefinition, IconName, IconStyle, IconPrefix } from '@fortawesome/fontawesome-common-types';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';

interface SLIconDefinition {
  value: string;
  type: string;
  description: string;
}
interface CustomIconDefinition extends SLIconDefinition {
  svg: string;
}

export const resolveIcon = (
  name: string,
  style: IconStyle,
  icons: { [key: string]: SLIconDefinition | CustomIconDefinition }
): string => {
  // 2. Get the supported icons from `icons.[json|ts]`?

  // 3. Return the matching `<path>`
  const iconInRegistry: SLIconDefinition | CustomIconDefinition = Object.entries(icons).find(
    icon => name === icon[0]
  )?.[1] as SLIconDefinition | CustomIconDefinition;

  if (icons && (iconInRegistry as CustomIconDefinition)?.svg) {
    return (iconInRegistry as CustomIconDefinition).svg;
  } else if (name && convertToIconDefinition(name as IconName, style)) {

    const {
        icon: [width, height, , , path]
      } = convertToIconDefinition(name as IconName, style),
      paths = Array.isArray(path) ? path : [path];

    return `
        <svg viewBox="0 0 ${width} ${height}" "xmlns="http://www.w3.org/2000/svg">
          ${paths.map(p => `<path d="${p}"></path>`).join('')}
        </svg>`;
  }
  return '<small>not found</small>';
};

const convertToIconDefinition = (iconName: IconName, style: IconStyle): IconDefinition => {
  return findIconDefinition({ prefix: getIconPrefixFromStyle(style), iconName });
};

const getIconPrefixFromStyle = (style: IconStyle): IconPrefix => {
  switch (style) {
    case 'solid':
        return 'fas';  
    case 'light':
        return 'fal';  
    default:
      return 'far';
  }
}
