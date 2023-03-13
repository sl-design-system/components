import { far } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sanomalearning/slds-core/icon';
import { findIconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { icons } from './icons.js';
// 1. Register a custom IconResolver for the theme icons.
library.add(far);
Icon.registerResolver(name => {
    // 2. Get the supported icons from `icons.[json|ts]`?
    var _a;
    // 3. Return the matching `<path>`
    const iconInRegistry = (_a = Object.entries(icons).find(icon => name === icon[0])) === null || _a === void 0 ? void 0 : _a[1];
    if (iconInRegistry === null || iconInRegistry === void 0 ? void 0 : iconInRegistry.svg) {
        return iconInRegistry.svg;
    }
    else if (name) {
        const { icon: [width, height, , , path] } = convertToIconDefinition(name), paths = Array.isArray(path) ? path : [path];
        return `
        <svg viewBox="0 0 ${width} ${height}" "xmlns="http://www.w3.org/2000/svg">
          ${paths.map(p => `<path d="${p}"></path>`).join('')}
        </svg>`;
        // }
    }
    return 'unknown icon';
});
const convertToIconDefinition = (iconName) => {
    return findIconDefinition({ prefix: 'far', iconName });
};
// 4. Have `<sl-icon>` render a nice `<svg>` with the path(s)
// export const setup = (): void => {
// 1. Add typekit url to `<head>`
// 2. Add Magister icons
// 3. Load the base stylesheet/css variables
// 4. Start using the SLDS in your application
// };
//# sourceMappingURL=index.js.map