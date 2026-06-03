import { takeSnapshot } from '@chromatic-com/vitest';
import { render } from 'lit';
import { describe, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import * as stories from '../packages/components/menu/src/menu-button.stories.ts';

const meta = stories.default,
  basic = stories.Basic;

const mountBasicStory = () => {
  const args = { ...meta.args, ...basic.args };

  if (!meta.render) {
    throw new Error('Expected menu-button stories default export to include a render function.');
  }

  render(meta.render(args), document.body);
};

describe('menu-button visual', () => {
  it('story + extra interactions', async () => {
    mountBasicStory();

    const trigger = document
      .querySelector('sl-menu-button')
      ?.shadowRoot?.querySelector('sl-button');
    if (!trigger) {
      throw new Error('Expected sl-menu-button to render an sl-button trigger in its shadowRoot.');
    }
    trigger.click();
    await new Promise(r => setTimeout(r, 50));
    await takeSnapshot('basic-open');

    await userEvent.keyboard('{Escape}');
    await new Promise(r => setTimeout(r, 50));
    await takeSnapshot('basic-closed-after-escape');
  });
});
