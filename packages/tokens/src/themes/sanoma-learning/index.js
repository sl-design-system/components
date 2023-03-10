import { far } from '@fortawesome/pro-regular-svg-icons';
import { Icon } from '@sanomalearning/slds-core/icon';
import { findIconDefinition, library } from '@fortawesome/fontawesome-svg-core';
// 1. Register a custom IconResolver for the theme icons.
Icon.registerResolver(name => {
    library.add(far);
    // 2. Get the supported icons from `icons.[json|ts]`?
    // 3. Return the matching `<path>`
    // if (name === 'star') {
    const { icon: [width, height, , , path] } = convertToIconDefinition(name), paths = Array.isArray(path) ? path : [path];
    return `
      <svg viewBox="0 0 ${width} ${height}" "xmlns="http://www.w3.org/2000/svg">
        ${paths.map(p => `<path d="${p}"></path>`).join('')}
      </svg>`;
    // }
    // return 'Hello world';
});
const convertToIconDefinition = (iconName) => {
    console.log(iconName, findIconDefinition({ prefix: 'far', iconName: 'glasses' }));
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