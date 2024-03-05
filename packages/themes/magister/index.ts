import type { IconLibrary } from '@sl-design-system/icon';
import { Icon } from '@sl-design-system/icon';
import { icons } from './icons.js';

/**
 * initializes all necessary things to load your theme,
 * like icons, ...
 */
export const setup = (): void => {
  Icon.register(icons as IconLibrary);
};
