import { afterEach, describe, expect, it } from 'vitest';
import { positionPopover } from './popover.js';

describe('positionPopover', () => {
  const elements: Element[] = [];

  afterEach(() => {
    for (const element of elements.splice(0)) {
      element.remove();
    }
  });

  it('should not apply a pending positioning result after cleanup', async () => {
    const anchor = document.createElement('button'),
      popover = document.createElement('div');

    anchor.style.cssText = 'position: fixed; top: 100px; left: 100px';
    popover.style.cssText = 'position: fixed; width: 100px; height: 100px';
    document.body.append(anchor, popover);
    elements.push(anchor, popover);

    const cleanup = positionPopover(popover, anchor, { position: 'right', viewportMargin: 8 });
    cleanup();

    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    expect(popover).not.to.have.attribute('actual-placement');
    expect(popover.style.maxBlockSize).to.equal('');
    expect(popover.style.maxInlineSize).to.equal('');
    expect(popover.style.minBlockSize).to.equal('');
  });

  it('should convert the physical x coordinate to a logical inset in RTL', async () => {
    const anchor = document.createElement('button'),
      popover = document.createElement('div');

    anchor.style.cssText = 'position: fixed; top: 100px; right: 8px';
    popover.dir = 'rtl';
    popover.style.cssText = 'position: fixed; width: 100px; height: 100px';
    document.body.append(anchor, popover);
    elements.push(anchor, popover);

    const cleanup = positionPopover(popover, anchor, {
      position: 'bottom-start',
      viewportMargin: 8
    });

    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    expect(
      document.documentElement.clientWidth - popover.getBoundingClientRect().right
    ).to.be.closeTo(8, 1);

    cleanup();
  });
});
