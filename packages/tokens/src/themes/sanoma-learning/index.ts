import { Icon } from '@sanomalearning/slds-core/icon';
import { faStar } from '@fortawesome/pro-regular-svg-icons';

Icon.registerResolver(name => {
  console.log('resolver', { name });

  if (name === 'star') {
    const {
        icon: [width, height, , , path]
      } = faStar,
      paths = Array.isArray(path) ? path : [path];

    return `
      <svg viewBox="0 0 ${width} ${height}" "xmlns="http://www.w3.org/2000/svg">
        ${paths.map(p => `<path d="${p}"></path>`).join('')}
      </svg>`;
  }

  return 'Hello world';
});

export const setup = (): void => {
  console.log('SETUP!');
};
