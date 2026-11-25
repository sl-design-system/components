import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationStore } from './notification-store.js';
import { type NotificationElement } from './notification.js';
import './register.js';

describe('sl-notification', () => {
  let el: NotificationElement;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-notification label="Saved"></sl-notification>`);
    });

    it('should have a group role named by the label', () => {
      expect(el.elementInternals.role).to.equal('group');
      expect(el.elementInternals.ariaLabel).to.equal('Saved');
    });

    it('should be focusable', () => {
      expect(el.tabIndex).to.equal(0);
    });

    it('should render the label', () => {
      expect(el.renderRoot.querySelector('[part="label"]')).to.have.trimmed.text('Saved');
    });

    it('should hide the description when there is none', () => {
      expect(el.renderRoot.querySelector('[part="description"]')).to.have.attribute('hidden');
    });

    it('should hide the actions when there are none', () => {
      expect(el.renderRoot.querySelector('[part="actions"]')).to.have.attribute('hidden');
    });

    it('should show the info icon', () => {
      expect(el.renderRoot.querySelector('sl-icon')).to.have.attribute('name', 'info');
    });

    it('should have a dismiss button', () => {
      const button = el.renderRoot.querySelector('sl-button');

      expect(button).to.exist;
      expect(button?.renderRoot.querySelector('button')).to.have.attribute(
        'aria-label',
        'Dismiss notification'
      );
    });

    it('should be timed and running', () => {
      expect(el.timeout).to.equal(6000);
      expect(el.matches(':state(timed)')).to.be.true;
      expect(el.matches(':state(running)')).to.be.true;
    });
  });

  describe('variants', () => {
    it('should show the icon of the variant', async () => {
      el = await fixture(html`<sl-notification label="Oops" variant="error"></sl-notification>`);

      expect(el.renderRoot.querySelector('sl-icon')).to.have.attribute(
        'name',
        'octagon-xmark-solid'
      );
    });

    it('should not time out for errors', async () => {
      el = await fixture(html`<sl-notification label="Oops" variant="error"></sl-notification>`);

      expect(el.timeout).to.equal(0);
      expect(el.matches(':state(timed)')).to.be.false;
    });
  });

  describe('description', () => {
    it('should render the description property', async () => {
      el = await fixture(
        html`<sl-notification label="Saved" description="All good"></sl-notification>`
      );

      const description = el.renderRoot.querySelector('[part="description"]');
      expect(description).not.to.have.attribute('hidden');
      expect(description).to.have.trimmed.text('All good');
    });

    it('should show a slotted description', async () => {
      el = await fixture(html`
        <sl-notification label="Saved"><span slot="description">All good</span></sl-notification>
      `);
      await el.updateComplete;

      expect(el.renderRoot.querySelector('[part="description"]')).not.to.have.attribute('hidden');
    });
  });

  describe('actions', () => {
    it('should render a link action', async () => {
      el = await fixture(html`
        <sl-notification .action=${{ label: 'View', href: '#view' }} label="Done"></sl-notification>
      `);

      const link = el.renderRoot.querySelector('a.action');
      expect(link).to.exist;
      expect(link).to.have.attribute('href', '#view');
      expect(link).to.have.trimmed.text('View');
    });

    it('should not time out with an action', async () => {
      el = await fixture(html`
        <sl-notification .action=${{ label: 'View', href: '#view' }} label="Done"></sl-notification>
      `);

      expect(el.timeout).to.equal(0);
    });

    it('should not time out with a slotted action', async () => {
      el = await fixture(html`
        <sl-notification label="Done"><button slot="actions">Retry</button></sl-notification>
      `);
      await el.updateComplete;

      expect(el.timeout).to.equal(0);
    });

    it('should call the handler and close when a button action is used', async () => {
      const store = new NotificationStore(),
        handler = spy(),
        notification = store.add({ label: 'Done', action: { label: 'Retry', handler } });

      el = await fixture(html`<sl-notification .notification=${notification}></sl-notification>`);

      el.renderRoot.querySelector<HTMLButtonElement>('button.action')?.click();

      expect(handler).to.have.been.calledOnceWith(notification);
      expect(notification.active).to.be.false;
      expect(notification.read).to.be.true;
    });
  });

  describe('closing', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-notification label="Saved"></sl-notification>`);
    });

    it('should close with reason user when the dismiss button is clicked', () => {
      const onClose = spy();
      el.addEventListener('sl-close', onClose);

      el.renderRoot.querySelector('sl-button')?.click();

      expect(onClose).to.have.been.calledOnce;
      expect((onClose.firstCall.args[0] as CustomEvent).detail).to.deep.equal({ reason: 'user' });
    });

    it('should close with reason user on Escape', () => {
      const onClose = spy();
      el.addEventListener('sl-close', onClose);

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      expect((onClose.firstCall.args[0] as CustomEvent).detail).to.deep.equal({ reason: 'user' });
    });

    it('should dismiss the notification of the store', async () => {
      const store = new NotificationStore(),
        notification = store.add({ label: 'Hello' });

      el.notification = notification;
      await el.updateComplete;

      el.renderRoot.querySelector('sl-button')?.click();

      expect(await notification.closed).to.equal('user');
    });
  });

  describe('timer', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should close with reason timeout', async () => {
      el = await fixture(html`<sl-notification duration="1000" label="Saved"></sl-notification>`);

      const onClose = spy();
      el.addEventListener('sl-close', onClose);

      vi.advanceTimersByTime(1000);

      expect((onClose.firstCall.args[0] as CustomEvent).detail).to.deep.equal({
        reason: 'timeout'
      });
    });

    it('should pause while hovered and restart from the full duration after', async () => {
      el = await fixture(html`<sl-notification duration="1000" label="Saved"></sl-notification>`);

      const onClose = spy(),
        onPause = spy(),
        onResume = spy();

      el.addEventListener('sl-close', onClose);
      el.addEventListener('sl-pause', onPause);
      el.addEventListener('sl-resume', onResume);

      vi.advanceTimersByTime(800);

      el.dispatchEvent(new PointerEvent('pointerenter'));
      await el.updateComplete;

      expect(el.paused).to.be.true;
      expect(el).to.have.attribute('paused');
      expect(onPause).to.have.been.calledOnce;

      vi.advanceTimersByTime(5000);
      expect(onClose).not.to.have.been.called;

      el.dispatchEvent(new PointerEvent('pointerleave'));
      await el.updateComplete;

      expect(el.paused).to.be.false;
      expect(onResume).to.have.been.calledOnce;

      vi.advanceTimersByTime(999);
      expect(onClose).not.to.have.been.called;

      vi.advanceTimersByTime(1);
      expect(onClose).to.have.been.calledOnce;
    });

    it('should not run while suspended', async () => {
      el = await fixture(html`
        <sl-notification .suspended=${true} duration="1000" label="Saved"></sl-notification>
      `);

      const onClose = spy();
      el.addEventListener('sl-close', onClose);

      vi.advanceTimersByTime(2000);

      expect(el.running).to.be.false;
      expect(onClose).not.to.have.been.called;
    });
  });
});
