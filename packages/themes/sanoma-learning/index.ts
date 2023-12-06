import type { IconLibrary } from '@sl-design-system/icon';
import { Icon } from '@sl-design-system/icon';
import type { ConfigSettings } from '@sl-design-system/shared';
import { Config } from '@sl-design-system/shared';
import { icons } from './icons.js';

// export const setup = (): void => {
// 1. Add typekit url to `<head>`
// 2. Add theme icons
// 3. Load the base stylesheet/css variables
// 4. Start using the SLDS in your application
// };

/**
 * initializes all necessary things to load your theme,
 * like icons, ...
 */
export const setup = (): void => {
  const config: ConfigSettings = {
    avatar: {
      shape: 'circle',
      badgeGapWidth: 2
    }
  };

  Icon.registerIcons(icons as IconLibrary);
  Config.setConfig(config);
};
