import { findIconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/pro-regular-svg-icons';
library.add(far);
export const resolveIcon = (name, icons) => {
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
    }
    return 'no icon found';
};
const convertToIconDefinition = (iconName) => {
    return findIconDefinition({ prefix: 'far', iconName });
};
//# sourceMappingURL=icon-resolver.js.map