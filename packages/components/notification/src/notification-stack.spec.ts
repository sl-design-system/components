import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { type NotificationStack } from './notification-stack.js';
import { NotificationStore } from './notification-store.js';
import { type NotificationElement } from './notification.js';
import './register.js';

describe('sl-notification-stack', () => {
  let el: NotificationStack, store: NotificationStore;

  const notifications = (): NotificationElement[] =>
    Array.from(el.renderRoot.querySelectorAll('sl-notification'));

  const visible = (): NotificationElement[] => notifications().filter(n => !n.hidden);

  beforeEach(async () => {
    store = new NotificationStore();
    el = await fixture(html`<sl-notification-stack .store=${store}></sl-notification-stack>`);
  });

  afterEach(() => {
    el.remove();
  });

  it('should be a manual popover', () => {
    expect(el).to.have.attribute('popover', 'manual');
  });

  it('should be a landmark region', () => {
    expect(el.elementInternals.role).to.equal('region');
    expect(el.elementInternals.ariaLabel).to.equal('Notifications');
  });

  it('should not be open without notifications', () => {
    expect(el.matches(':popover-open')).to.be.false;
    expect(el.hasNotifications).to.be.false;
  });

  it('should show a notification when one is added', async () => {
    store.add({ label: 'Saved' });
    await el.updateComplete;

    expect(el.matches(':popover-open')).to.be.true;
    expect(notifications()).to.have.length(1);
    expect(notifications()[0].label).to.equal('Saved');
  });

  it('should pile timed notifications with only the newest in front', async () => {
    store.add({ label: 'One' });
    store.add({ label: 'Two' });
    store.add({ label: 'Three' });
    await el.updateComplete;

    expect(visible().map(n => n.label)).to.deep.equal(['Three']);
    expect(el.renderRoot.querySelectorAll('.edge')).to.have.length(2);
  });

  it('should only run the timer of the front notification', async () => {
    store.add({ label: 'One' });
    store.add({ label: 'Two' });
    await el.updateComplete;

    const [back, front] = notifications();

    expect(back.suspended).to.be.true;
    expect(front.suspended).to.be.false;
  });

  it('should never pile errors or notifications with an action', async () => {
    store.add({ label: 'One' });
    store.add({ label: 'Oops', variant: 'error' });
    store.add({ label: 'Two' });
    await el.updateComplete;

    expect(visible().map(n => n.label)).to.deep.equal(['Oops', 'Two']);
  });

  it('should expand on pointer enter and stop all timers', async () => {
    store.add({ label: 'One' });
    store.add({ label: 'Two' });
    await el.updateComplete;

    el.dispatchEvent(new PointerEvent('pointerenter'));
    await el.updateComplete;

    expect(el.expanded).to.be.true;
    expect(el.matches(':state(expanded)')).to.be.true;
    expect(visible().map(n => n.label)).to.deep.equal(['One', 'Two']);
    expect(notifications().every(n => n.suspended)).to.be.true;
  });

  it('should show at most max-visible notifications with a "View all" button when expanded', async () => {
    const button = document.createElement('sl-notification-button');
    button.store = store;
    document.body.append(button);

    el.maxVisible = 2;
    ['One', 'Two', 'Three', 'Four'].forEach(label => store.add({ label }));
    el.expand();
    await el.updateComplete;

    expect(visible().map(n => n.label)).to.deep.equal(['Three', 'Four']);
    expect(el.renderRoot.querySelector('[part="more"]')).to.have.trimmed.text('2 more · View all');

    button.remove();
  });

  it('should not show a "View all" button without a notification button to open', async () => {
    el.maxVisible = 2;
    ['One', 'Two', 'Three', 'Four'].forEach(label => store.add({ label }));
    el.expand();
    await el.updateComplete;

    expect(el.renderRoot.querySelector('[part="more"]')).not.to.exist;
  });

  it('should have a single tab stop on the newest notification', async () => {
    store.add({ label: 'Oops', variant: 'error' });
    store.add({ label: 'Two' });
    await el.updateComplete;

    const [error, two] = visible();

    expect(error.tabIndex).to.equal(-1);
    expect(two.tabIndex).to.equal(0);
  });

  it('should move focus between notifications with the arrow keys', async () => {
    store.add({ label: 'Oops', variant: 'error' });
    store.add({ label: 'Two' });
    await el.updateComplete;

    const [error, two] = visible();

    two.focus();
    two.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, composed: true })
    );

    expect(el.shadowRoot?.activeElement).to.equal(error);
    expect(error.tabIndex).to.equal(0);
    expect(two.tabIndex).to.equal(-1);
  });

  it('should remove a notification once it is dismissed', async () => {
    const n = store.add({ label: 'Saved' });
    await el.updateComplete;

    n.dismiss();
    await el.updateComplete;

    // Reduced motion is on in the test runner, so it leaves without an animation
    await new Promise(resolve => setTimeout(resolve));
    await el.updateComplete;

    expect(notifications()).to.have.length(0);
    expect(el.matches(':popover-open')).to.be.false;
  });

  it('should move focus to the next notification when the focused one is closed', async () => {
    store.add({ label: 'Oops', variant: 'error' });
    store.add({ label: 'Two' });
    await el.updateComplete;

    const [error, two] = visible();

    error.focus();
    error.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(el.shadowRoot?.activeElement).to.equal(two);
  });

  describe('modal dialogs', () => {
    let dialog: HTMLDialogElement;

    beforeEach(() => {
      dialog = document.createElement('dialog');
      document.body.append(dialog);
    });

    afterEach(() => {
      dialog.remove();
    });

    it('should move into a modal dialog and stay open', async () => {
      store.add({ label: 'Saved' });
      await el.updateComplete;

      dialog.showModal();
      dialog.dispatchEvent(
        new CustomEvent('sl-modal-toggle', {
          bubbles: true,
          composed: true,
          detail: { dialog, open: true }
        })
      );

      expect(el.parentElement).to.equal(dialog);
      expect(el.matches(':popover-open')).to.be.true;
    });

    it('should move back home when the dialog closes', async () => {
      const home = el.parentElement;

      store.add({ label: 'Saved' });
      await el.updateComplete;

      dialog.showModal();
      dialog.dispatchEvent(
        new CustomEvent('sl-modal-toggle', {
          bubbles: true,
          composed: true,
          detail: { dialog, open: true }
        })
      );

      dialog.close();
      await new Promise(resolve => dialog.addEventListener('close', resolve, { once: true }));

      expect(el.parentElement).to.equal(home);
      expect(el.matches(':popover-open')).to.be.true;
    });

    it('should not follow dialogs when follow-dialogs is false', async () => {
      el.followDialogs = 'false';
      store.add({ label: 'Saved' });
      await el.updateComplete;

      dialog.showModal();
      dialog.dispatchEvent(
        new CustomEvent('sl-modal-toggle', {
          bubbles: true,
          composed: true,
          detail: { dialog, open: true }
        })
      );

      expect(el.parentElement).not.to.equal(dialog);
    });
  });
});
