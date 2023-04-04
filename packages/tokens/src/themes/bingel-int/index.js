import { Icon } from '@sanomalearning/slds-core/icon';
import { icons } from './icons.js';
/**
 * initializes all necessary things to load your theme,
 * like icons, ...
 */
export const setup = () => {
    Icon.registerIcons(icons);
    console.log('SETUP Bingel Int in index.ts!');
};
//# sourceMappingURL=index.js.map