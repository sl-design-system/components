import { Icon, type IconLibrary } from '@sl-design-system/icon';
import { icons } from './icons.js';

/**
 * initializes all necessary things to load your theme,
 * like icons, ...
 */
export const setup = (): void => {
  console.log('register Icons');
  Icon.register(icons as IconLibrary);
};
