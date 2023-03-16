import { Icon } from '@sanomalearning/slds-core/icon';
import { resolveIcon } from '../../icon-resolver.js';
import { icons as iconsMG } from './icons.js';
console.log(iconsMG);
Icon.registerResolver(name => resolveIcon(name, iconsMG));
export const setup = () => {
    Icon.registerResolver(name => resolveIcon(name, iconsMG));
    console.log('SETUP Magister in index.ts!');
};
//# sourceMappingURL=index.js.map