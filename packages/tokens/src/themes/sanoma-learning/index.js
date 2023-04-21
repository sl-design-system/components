import { Icon } from '@sanomalearning/slds-core/icon';
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
export const setup = () => {
    Icon.registerIcons(icons);
};
//# sourceMappingURL=index.js.map