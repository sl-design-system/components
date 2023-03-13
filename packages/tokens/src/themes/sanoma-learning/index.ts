import type { IconDefinition, IconName } from '@fortawesome/pro-regular-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sanomalearning/slds-core/icon';
import { findIconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { icons } from './icons.js';

interface SLIconDefinition {
  value: string;
  type: string;
  description: string;
}
interface CustomIconDefinition extends SLIconDefinition {
  svg: string;
}
// 1. Register a custom IconResolver for the theme icons.

library.add(far);
Icon.registerResolver(name => {
  // 2. Get the supported icons from `icons.[json|ts]`?

  // 3. Return the matching `<path>`
  const iconInRegistry: SLIconDefinition | CustomIconDefinition | undefined | string = Object.entries(icons).find(
    icon => name === icon[0]
  )?.[1];

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
    // }
  }
  return 'unknown icon';
});

const convertToIconDefinition = (iconName: IconName): IconDefinition => {
  return findIconDefinition({ prefix: 'far', iconName });
};

// 4. Have `<sl-icon>` render a nice `<svg>` with the path(s)

// export const setup = (): void => {
// 1. Add typekit url to `<head>`
// 2. Add Magister icons
// 3. Load the base stylesheet/css variables
// 4. Start using the SLDS in your application
// };
