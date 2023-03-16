import type { IconDefinition, IconName } from '@fortawesome/pro-regular-svg-icons';
import { findIconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/pro-regular-svg-icons';

interface SLIconDefinition {
  value: string;
  type: string;
  description: string;
}
interface CustomIconDefinition extends SLIconDefinition {
  svg: string;
}
library.add(far);

export const resolveIcon = (
  name: string,
  icons: { [key: string]: SLIconDefinition | CustomIconDefinition }
): string => {
  // 2. Get the supported icons from `icons.[json|ts]`?
  console.log(name, icons);

  // 3. Return the matching `<path>`
  const iconInRegistry: SLIconDefinition | CustomIconDefinition = Object.entries(icons).find(
    icon => name === icon[0]
  )?.[1] as SLIconDefinition | CustomIconDefinition;

  if ((iconInRegistry as CustomIconDefinition)?.svg) {
    return (iconInRegistry as CustomIconDefinition).svg;
  } else if (name) {
    const {
        icon: [width, height, , , path]
      } = convertToIconDefinition(name as IconName),
      paths = Array.isArray(path) ? path : [path];

    return `
        <svg viewBox="0 0 ${width} ${height}" "xmlns="http://www.w3.org/2000/svg">
          ${paths.map(p => `<path d="${p}"></path>`).join('')}
        </svg>`;
  }
  return 'no icon found';
};

const convertToIconDefinition = (iconName: IconName): IconDefinition => {
  return findIconDefinition({ prefix: 'far', iconName });
};
