import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type EllipsizeText } from './ellipsize-text.js';

describe('sl-ellipsize-text', () => {
  let el: EllipsizeText;

  beforeEach(async () => {
    el = await fixture(
      html`<sl-ellipsize-text>This is a long text that should be truncated</sl-ellipsize-text>`
    );
  });

  it('should render a slot with the text', () => {
    const slot = el.renderRoot.querySelector('slot');

    expect(slot).to.exist;
    expect(
      slot
        ?.assignedNodes()
        .map(node => node.textContent?.trim())
        .join('')
    ).to.equal('This is a long text that should be truncated');
  });

  it('should not have a tooltip by default', () => {
    expect(el.renderRoot.querySelector('sl-tooltip')).not.to.exist;
  });

  it('should have a tooltip when there is not enough space', async () => {
    el.style.width = '100px';

    // Wait for the resize observer to trigger
    await new Promise(resolve => setTimeout(resolve, 50));

    const slot = el.renderRoot.querySelector('slot'),
      tooltip = el.renderRoot.querySelector('sl-tooltip');

    expect(tooltip).to.exist;
    expect(tooltip).to.have.trimmed.text('This is a long text that should be truncated');
    expect(slot?.ariaDescribedByElements).to.include(tooltip);
  });
});
