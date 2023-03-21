import { Icon } from '@sanomalearning/slds-core/icon';
import { resolveIcon } from '../../icon-resolver.js';

// Icon.registerResolver(name => resolveIcon(name, iconsMG));
Icon.registerResolver(name => resolveIcon(name, {}));
export const setup = (): void => {
  // Icon.registerResolver(name => resolveIcon(name, iconsMG));
  console.log('SETUP Magister in index.ts!');
};
