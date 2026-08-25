export function waitForGridToRenderData(grid) {
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
export function waitForAriaForwarding() {
  return new Promise(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  );
}
//# sourceMappingURL=utils.js.map
