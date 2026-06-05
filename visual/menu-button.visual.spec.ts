import { takeSnapshot } from '@chromatic-com/vitest';
import { render } from 'lit';
import { describe, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import * as stories from '../packages/components/menu/src/menu-button.stories.ts';

const meta = stories.default,
  basic = stories.Basic;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type MenuButtonElement = HTMLElement & {
  updateComplete?: Promise<unknown>;
  renderRoot?: ShadowRoot;
};

const mountBasicStory = () => {
  const args = { ...meta.args, ...basic.args };

  if (!meta.render) {
    throw new Error('Expected menu-button stories default export to include a render function.');
  }

  render(meta.render(args), document.body);
};

const getTrigger = async () => {
  await customElements.whenDefined('sl-menu-button');

  const menuButton = document.querySelector('sl-menu-button') as MenuButtonElement | null;
  if (!menuButton) {
    throw new Error('Expected sl-menu-button to be rendered.');
  }

  if (menuButton.updateComplete) {
    await menuButton.updateComplete;
  }

  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

  const trigger =
    menuButton.renderRoot?.querySelector('sl-button') ??
    menuButton.shadowRoot?.querySelector('sl-button');

  if (!trigger) {
    throw new Error('Expected sl-menu-button to render an sl-button trigger.');
  }

  return trigger as HTMLElement;
};

describe('menu-button visual', () => {
  it('story + extra interactions', async () => {
    mountBasicStory();
    const trigger = await getTrigger();
    trigger.click();

    await sleep(50);
    await takeSnapshot('basic-open');

    await userEvent.keyboard('{Escape}');
    await sleep(50);
    await takeSnapshot('basic-closed-after-escape');
  });
});
