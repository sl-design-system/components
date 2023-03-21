import type { IconStyle } from '@fortawesome/fontawesome-svg-core';
import { Icon } from '@sanomalearning/slds-core/icon';
import { resolveIcon } from '../../icon-resolver.js';

// Icon.registerResolver(name => resolveIcon(name, iconsMG));
Icon.registerResolver((name: string, style: IconStyle) => resolveIcon(name, style, {}));

Icon.registerLibraries(['regular', 'solid']).catch(() => {
  console.warn('could not load icons');
});

export const setup = async (): Promise<void> => {
  // await Icon.registerLibraries(['regular', 'solid']);
  // Icon.registerResolver((name: string, style: IconStyle) => resolveIcon(name, style, {}));
  // Icon.registerResolver(name => resolveIcon(name, iconsMG));
  console.log('SETUP Magister in index.ts!');
};
