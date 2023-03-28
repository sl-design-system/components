import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';
export const resolveIcon = (name, style, icons) => {
    // 2. Get the supported icons from `icons.[json|ts]`?
    console.log('resolveIcon', { name, style, icons });
    // 3. Return the matching `<path>`
    const iconInRegistry = Object.entries(icons).find(icon => name === icon[0])?.[1];
    console.log(icons);
    if (icons && iconInRegistry?.svg) {
        return iconInRegistry.svg;
    }
    else if (name && convertToIconDefinition(name, style)) {
        const { icon: [width, height, , , path] } = convertToIconDefinition(name, style), paths = Array.isArray(path) ? path : [path];
        return `
        <svg viewBox="0 0 ${width} ${height}" "xmlns="http://www.w3.org/2000/svg">
          ${paths.map((p, i) => `<path d="${p}" fill="var(--fill-${getColorToken(i, style)})"></path>`).join('')}
        </svg>`;
    }
    return '<small>not found</small>';
};
const convertToIconDefinition = (iconName, style) => {
    return findIconDefinition({ prefix: getIconPrefixFromStyle(style), iconName });
};
const getColorToken = (pathCounter, style) => {
    return pathCounter === 0 && style === 'duotone' ? 'accent' : 'default';
};
const getIconPrefixFromStyle = (style) => {
    switch (style) {
        case 'solid':
            return 'fas';
        case 'light':
            return 'fal';
        case 'thin':
            return 'fat';
        case 'duotone':
            return 'fad';
        default:
            return 'far';
    }
};
//# sourceMappingURL=icon-resolver.js.map