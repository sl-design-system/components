import { type Grid } from './grid.js';

export function waitForGridToRenderData(grid: Grid): Promise<void> {
  return new Promise(resolve => {
    const checkForTd = () => {
      if (grid.renderRoot.querySelector('td')) {
        resolve();
      } else {
        setTimeout(checkForTd, 10);
      }
    };

    checkForTd();
  });
}
