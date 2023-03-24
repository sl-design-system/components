import { Icon } from '@sanomalearning/slds-core/icon';
import { resolveIcon } from '../../icon-resolver.js';
import { icons } from './icons.js';
// export const setup = (): void => {
// 1. Add typekit url to `<head>`
// 2. Add Magister icons
// 3. Load the base stylesheet/css variables
// 4. Start using the SLDS in your application
// };
// Icon.registerResolver(name => resolveIcon(name, icons));
Icon.registerResolver((name, style) => resolveIcon(name, style, icons));
Icon.registerLibraries(['regular', 'solid', 'thin', 'duotone', 'light']).catch(() => {
    console.warn('could not load icons');
});
export const setup = () => {
    // Icon.registerResolver(name => resolveIcon(name, icons));
    console.log('SETUP Sanoma Learning in index.ts!');
};
//# sourceMappingURL=index.js.map