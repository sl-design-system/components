import { library } from '@fortawesome/fontawesome-svg-core';
import { Icon } from '@sanomalearning/slds-core/icon';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fat } from '@fortawesome/pro-thin-svg-icons';
import { resolveIcon } from '../../icon-resolver.js';
import { icons } from './icons.js';
// export const setup = (): void => {
// 1. Add typekit url to `<head>`
// 2. Add theme icons
// 3. Load the base stylesheet/css variables
// 4. Start using the SLDS in your application
// };
// Icon.registerResolver(name => resolveIcon(name, icons));
// Icon.registerResolver((name: string, style: IconStyle) => resolveIcon(name, style, icons));
// Icon.registerResolver((name: string, style: IconStyle) => resolveIcon(name, style, icons));
export const setup = () => {
    // Icon.registerResolver(name => resolveIcon(name, icons));
    Icon.registerLibraries(['regular', 'solid', 'thin', 'duotone', 'light']);
    library.add(far, fat);
    Icon.registerResolver((name, style) => resolveIcon(name, style, icons));
    console.log('SETUP Sanoma Learning in index.ts!');
};
//# sourceMappingURL=index.js.map