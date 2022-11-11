import type { Middleware, MiddlewareArguments } from '@floating-ui/dom';

export const topLayer = (): Middleware => ({
  name: 'topLayer',
  async fn(middlewareArguments: MiddlewareArguments) {
    const {
      x,
      y,
      elements: { reference, floating }
    } = middlewareArguments;
    let onTopLayer = false;
    const diffCoords = {
      x: 0,
      y: 0
    };
    try {
      onTopLayer = onTopLayer || floating.matches(':open');
      // eslint-disable-next-line no-empty
    } catch (e) {}
    try {
      onTopLayer = onTopLayer || floating.matches(':modal');
      // eslint-disable-next-line no-empty
    } catch (e) {}

    if (onTopLayer) {
      const rect = reference.getBoundingClientRect();
      diffCoords.x = rect.x;
      diffCoords.y = rect.y;
    }

    return {
      x: x + diffCoords.x,
      y: y + diffCoords.y,
      data: diffCoords
    };
  }
});
