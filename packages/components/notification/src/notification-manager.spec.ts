import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { type NotificationButton } from './notification-button.js';
import { type NotificationList } from './notification-list.js';
import { type NotificationManager } from './notification-manager.js';
import { NotificationStore } from './notification-store.js';
import './register.js';

describe('sl-notification-button', () => {
  let el: NotificationButton, store: NotificationStore;

  beforeEach(async () => {
    store = new NotificationStore();
    el = await fixture(html`<sl-notification-button .store=${store}></sl-notification-button>`);
  });

  it('should not show a badge without unread notifications', () => {
    expect(el.renderRoot.querySelector('sl-badge')).not.to.exist;
    expect(
      el.renderRoot.querySelector('sl-button')?.renderRoot.querySelector('button')
    ).to.have.attribute('aria-label', 'Notifications');
  });

  it('should show the unread count', async () => {
    store.add({ label: 'One' });
    store.add({ label: 'Two' });
    await el.updateComplete;

    expect(el.count).to.equal(2);
    expect(el.renderRoot.querySelector('sl-badge')).to.have.trimmed.text('2');
    expect(el.renderRoot.querySelector('sl-badge')).to.have.attribute('aria-hidden', 'true');
    expect(
      el.renderRoot.querySelector('sl-button')?.renderRoot.querySelector('button')
    ).to.have.attribute('aria-label', 'Notifications, 2 unread');
  });

  it('should cap the count at max-count', async () => {
    el.maxCount = 2;
    ['One', 'Two', 'Three'].forEach(label => store.add({ label }));
    await el.updateComplete;

    expect(el.renderRoot.querySelector('sl-badge')).to.have.trimmed.text('2+');
    expect(
      el.renderRoot.querySelector('sl-button')?.renderRoot.querySelector('button')
    ).to.have.attribute('aria-label', 'Notifications, more than 2 unread');
  });

  it('should update when notifications are read', async () => {
    const n = store.add({ label: 'One' });
    await el.updateComplete;

    n.markRead();
    await el.updateComplete;

    expect(el.count).to.equal(0);
    expect(el.renderRoot.querySelector('sl-badge')).not.to.exist;
  });
});

describe('sl-notification-list', () => {
  let el: NotificationList, store: NotificationStore;

  const rows = (): HTMLElement[] =>
    Array.from(el.renderRoot.querySelectorAll<HTMLElement>('[part~="row"]'));

  beforeEach(() => {
    store = new NotificationStore();
  });

  it('should show an empty state without unread notifications', async () => {
    el = await fixture(html`<sl-notification-list .store=${store}></sl-notification-list>`);

    expect(el.renderRoot.querySelector('[part="empty"]')).to.exist;
    expect(el.renderRoot.querySelector('[part="more"]')).not.to.exist;
  });

  it('should show the unread notifications, newest first', async () => {
    store.add({ label: 'One' });
    store.add({ label: 'Two' });

    el = await fixture(html`<sl-notification-list .store=${store}></sl-notification-list>`);

    expect(
      rows().map(r => r.querySelector('.label')?.textContent?.replace(/\s+/g, ' ').trim())
    ).to.deep.equal(['Unread: Two', 'Unread: One']);
  });

  it('should load read notifications a page at a time', async () => {
    ['One', 'Two', 'Three'].forEach(label => store.add({ label }).markRead());
    store.add({ label: 'New' });

    el = await fixture(
      html`<sl-notification-list .store=${store} page-size="2"></sl-notification-list>`
    );

    expect(rows()).to.have.length(1);

    el.renderRoot.querySelector<HTMLElement>('[part="more"] sl-button')?.click();
    await el.updateComplete;

    expect(el.renderRoot.querySelector('[part="earlier"]')).to.exist;
    expect(rows()).to.have.length(3);
    expect(el.shadowRoot?.activeElement).to.equal(rows()[1]);

    el.renderRoot.querySelector<HTMLElement>('[part="more"] sl-button')?.click();
    await el.updateComplete;

    expect(rows()).to.have.length(4);
    expect(el.renderRoot.querySelector('[part="more"]')).not.to.exist;
    expect(el.renderRoot.querySelector('[part="end"]')).to.exist;
  });

  it('should keep rows in place when they are marked as read', async () => {
    store.add({ label: 'One' });
    store.add({ label: 'Two' });

    el = await fixture(html`<sl-notification-list .store=${store}></sl-notification-list>`);

    el.markAllRead();
    await el.updateComplete;

    expect(rows()).to.have.length(2);
    expect(rows().some(r => r.classList.contains('unread'))).to.be.false;
  });

  it('should mark a row as read when clicked', async () => {
    const n = store.add({ label: 'One' });

    el = await fixture(html`<sl-notification-list .store=${store}></sl-notification-list>`);

    rows()[0].click();

    expect(n.read).to.be.true;
  });

  it('should be a single tab stop with arrow key navigation', async () => {
    ['One', 'Two', 'Three'].forEach(label => store.add({ label }));

    el = await fixture(html`<sl-notification-list .store=${store}></sl-notification-list>`);

    expect(rows().map(r => r.tabIndex)).to.deep.equal([0, -1, -1]);

    rows()[0].focus();
    rows()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    await el.updateComplete;

    expect(el.shadowRoot?.activeElement).to.equal(rows()[2]);
    expect(rows().map(r => r.tabIndex)).to.deep.equal([-1, -1, 0]);

    rows()[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    await el.updateComplete;

    expect(el.shadowRoot?.activeElement).to.equal(rows()[1]);
  });

  it('should describe rows with an action', async () => {
    const n = store.add({ label: 'Oops', variant: 'error', action: { label: 'View', href: '#' } });

    el = await fixture(html`<sl-notification-list .store=${store}></sl-notification-list>`);

    expect(rows()[0]).to.have.attribute('aria-describedby', `${n.id}-hint`);
    expect(el.renderRoot.querySelector(`#${n.id}-hint`)).to.have.trimmed.text('Has action: View');
  });
});

describe('sl-notification-manager', () => {
  let el: NotificationManager, store: NotificationStore;

  beforeEach(async () => {
    store = new NotificationStore();
    store.add({ label: 'One' });

    el = await fixture(html`<sl-notification-manager .store=${store}></sl-notification-manager>`);
  });

  afterEach(() => {
    el.hide();
  });

  it('should be closed by default', () => {
    expect(el.open).not.to.be.true;
    expect(el.dialog?.matches(':popover-open')).to.be.false;
    expect(el.dialog?.open).to.be.false;
  });

  it('should open as a popover on a wide screen', async () => {
    const onOpen = spy();
    el.addEventListener('sl-open', onOpen);

    await el.show();

    expect(el.open).to.be.true;
    expect(el).to.have.attribute('open');
    expect(el.mode).to.equal('popover');
    expect(el.dialog?.matches(':popover-open')).to.be.true;
    expect(onOpen).to.have.been.calledOnce;
  });

  it('should focus the heading when opened', async () => {
    await el.show();

    expect(el.shadowRoot?.activeElement).to.equal(el.renderRoot.querySelector('h2'));
  });

  it('should open as a modal drawer below drawer-below', async () => {
    el.drawerBelow = 4000;
    await el.show();

    expect(el.mode).to.equal('drawer');
    expect(el.dialog?.open).to.be.true;
    expect(el.dialog?.matches(':modal')).to.be.true;
    expect(el.renderRoot.querySelector('sl-button.close')).to.exist;
  });

  it('should close and emit sl-close', async () => {
    const onClose = spy();
    el.addEventListener('sl-close', onClose);

    await el.show();
    el.hide();
    await new Promise(resolve => setTimeout(resolve));

    expect(el.open).to.be.false;
    expect(onClose).to.have.been.calledOnce;
  });

  it('should mark all as read', async () => {
    await el.show();

    el.renderRoot.querySelector<HTMLElement>('[part="header"] sl-button')?.click();

    expect(store.unreadCount).to.equal(0);
  });
});
