import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { InlineMessage } from './inline-message.js';

describe('sl-inline-message', () => {
  let el: InlineMessage;

  beforeEach(async () => {
    el = await fixture(html`
      <sl-inline-message>
        <span slot="title">Inline message title</span>
      </sl-inline-message>
    `);
  });

  it('should render correctly', () => {
    expect(el).shadowDom.to.equalSnapshot();
  });

  it('should be dismissible', () => {
    expect(el.indismissible).not.to.be.true;
  });

  it('should have the info variant', () => {
    expect(el).to.have.attribute('variant', 'info');
    expect(el.variant).to.equal('info');
  });

  it('should have success variant when set', async () => {
    el.variant = 'success';
    await el.updateComplete;

    expect(el).to.have.attribute('variant', 'success');
  });

  it('should have a close button', () => {
    const button = el.renderRoot.querySelector('sl-button');

    expect(button).to.exist;
    expect(button).to.contain('sl-icon[name="xmark"]');
  });

  it('should not have a close button when indismissible', async () => {
    el.indismissible = true;
    await el.updateComplete;

    expect(el.renderRoot.querySelector('sl-button')).not.to.exist;
  });

  it('should remove itself when the close button is clicked', async () => {
    const removeSpy = spy(el, 'remove');

    el.renderRoot.querySelector('sl-button')?.click();

    // Wait for the next frame
    await el.updateComplete;

    // Dispatch the animationend event
    el.renderRoot.querySelector('.wrapper')?.dispatchEvent(new AnimationEvent('animationend'));

    expect(removeSpy).to.have.been.calledOnce;
  });

  it('should emit an sl-dismiss event after clicking the close button', async () => {
    const onDismiss = spy();

    el.addEventListener('sl-dismiss', onDismiss);
    el.renderRoot.querySelector('sl-button')?.click();

    // Wait for the next frame
    await el.updateComplete;

    // Dispatch the animationend event
    el.renderRoot.querySelector('.wrapper')?.dispatchEvent(new AnimationEvent('animationend'));

    expect(onDismiss).to.have.been.calledOnce;
  });
});
