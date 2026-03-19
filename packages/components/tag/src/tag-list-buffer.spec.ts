import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { describe, expect, it } from 'vitest';
import '../register.js';
import { type TagList } from './tag-list.js';

const listStyles = 'gap: 0px; padding: 0; margin: 0; border: none;';
const tagStyles = 'inline-size: 100px; margin: 0; padding: 0; border: none; box-sizing: border-box;';

describe('sl-tag-list - sub-pixel buffer', () => {
  let el: TagList;

  it('should not collapse when contents exceed container width by less than 0.5px', async () => {
    // We create a scenario where we can precisely control the width.
    // Note: Browser rendering of fractional pixels can be inconsistent,
    // but the logic in tag-list.ts uses getBoundingClientRect().width.

    el = await fixture(html`
      <sl-tag-list stacked style=${listStyles}>
        <sl-tag style=${tagStyles}>Tag 1</sl-tag>
        <sl-tag style=${tagStyles}>Tag 2</sl-tag>
      </sl-tag-list>
    `);

    // Total tags width = 100 + 100 = 200px (gap is 0)
    // We set the container width to 199.7px (diff = 0.3px, which is < 0.5px)
    el.style.inlineSize = '199.7px';

    // Give it plenty of time for ResizeObserver + 200ms timeout
    await new Promise(resolve => setTimeout(resolve, 500));

    const stack = el.renderRoot.querySelector('.stack') as HTMLElement;

    expect(stack.style.display).to.equal('none');
  });

  it('should collapse when contents exceed container width by more than 0.5px', async () => {
    el = await fixture(html`
      <sl-tag-list stacked style=${listStyles}>
        <sl-tag style=${tagStyles}>Tag 1</sl-tag>
        <sl-tag style=${tagStyles}>Tag 2</sl-tag>
      </sl-tag-list>
    `);

    // Total = 200px. Container = 199.4px (diff = 0.6px > 0.5px)
    el.style.inlineSize = '199.4px';

    await new Promise(resolve => setTimeout(resolve, 500));

    const stack = el.renderRoot.querySelector('.stack') as HTMLElement;

    expect(stack.style.display).to.not.equal('none');
  });
});
