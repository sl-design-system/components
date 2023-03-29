import { Icon } from '@sanomalearning/slds-core/icon';
import type { IconLibrary } from '@sanomalearning/slds-core/icon';
import { icons } from './icons.js';

// Icon.registerLibraries(['regular', 'solid']).catch(() => {
//   console.warn('could not load icons');
// });

export const setup = (): void => {
  Icon.registerIcons(icons as IconLibrary);

  console.log('SETUP Magister in index.ts!');
};
