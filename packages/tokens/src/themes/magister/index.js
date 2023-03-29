import { Icon } from '@sanomalearning/slds-core/icon';
import { icons } from './icons.js';
// Icon.registerLibraries(['regular', 'solid']).catch(() => {
//   console.warn('could not load icons');
// });
export const setup = () => {
    Icon.registerIcons(icons);
    console.log('SETUP Magister in index.ts!');
};
//# sourceMappingURL=index.js.map