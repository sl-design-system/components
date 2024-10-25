import { Icon, type IconLibrary } from '@sl-design-system/icon';
import { icons } from './icons.js';

/** Setup the theme. */
export const setup = (): void => {
  Icon.register(icons as IconLibrary);
};
