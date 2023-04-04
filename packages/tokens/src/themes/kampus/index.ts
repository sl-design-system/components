import { Icon } from '@sanomalearning/slds-core/icon';
import type { IconLibrary } from '@sanomalearning/slds-core/icon';
import { icons } from './icons.js';

/**
 * initializes all necessary things to load your theme,
 * like icons, ...
 */
export const setup = (): void => {
  Icon.registerIcons(icons as IconLibrary);

  console.log('SETUP Kampus in index.ts!');
};
