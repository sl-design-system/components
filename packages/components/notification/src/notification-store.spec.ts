import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { Notification, NotificationStore, getTimeout } from './notification-store.js';

describe('NotificationStore', () => {
  let store: NotificationStore;

  beforeEach(() => {
    store = new NotificationStore();
  });

  it('should be empty by default', () => {
    expect(store.all).to.deep.equal([]);
    expect(store.active).to.deep.equal([]);
    expect(store.unreadCount).to.equal(0);
    expect(store.limit).to.equal(50);
  });

  it('should add a notification', () => {
    const n = store.add({ label: 'Hello' });

    expect(n).to.be.instanceOf(Notification);
    expect(n.label).to.equal('Hello');
    expect(n.variant).to.equal('info');
    expect(n.duration).to.equal('auto');
    expect(n.active).to.be.true;
    expect(n.read).to.be.false;
    expect(store.all).to.deep.equal([n]);
    expect(store.unreadCount).to.equal(1);
  });

  it('should keep the history newest first and the active ones oldest first', () => {
    const a = store.add({ label: 'A' }),
      b = store.add({ label: 'B' });

    expect(store.all).to.deep.equal([b, a]);
    expect(store.active).to.deep.equal([a, b]);
  });

  it('should emit add and change events', () => {
    const onAdd = spy(),
      onChange = spy();

    store.addEventListener('add', onAdd);
    store.addEventListener('change', onChange);

    const n = store.add({ label: 'Hello' });

    expect(onAdd).to.have.been.calledOnce;
    expect((onAdd.firstCall.args[0] as CustomEvent).detail).to.equal(n);
    expect(onChange).to.have.been.called;
  });

  it('should find a notification by id', () => {
    const n = store.add({ label: 'Hello' });

    expect(store.get(n.id)).to.equal(n);
    expect(store.get('nope')).to.be.undefined;
  });

  it('should remove a single notification', async () => {
    const a = store.add({ label: 'A' }),
      b = store.add({ label: 'B' });

    store.remove(a);

    expect(store.all).to.deep.equal([b]);
    expect(a.active).to.be.false;
    expect(await a.closed).to.equal('api');
  });

  it('should remove notifications by array or predicate', () => {
    const a = store.add({ label: 'A', group: 'sync' }),
      b = store.add({ label: 'B', group: 'sync' }),
      c = store.add({ label: 'C' });

    store.remove([a]);
    expect(store.all).to.deep.equal([c, b]);

    store.remove(n => n.group === 'sync');
    expect(store.all).to.deep.equal([c]);
  });

  it('should mark all as read', () => {
    store.add({ label: 'A' });
    store.add({ label: 'B' });

    store.markAllRead();

    expect(store.unreadCount).to.equal(0);
  });

  it('should clear', () => {
    store.add({ label: 'A' });
    store.clear();

    expect(store.all).to.deep.equal([]);
  });

  it('should drop the oldest notifications that are no longer active beyond the limit', () => {
    const a = store.add({ label: 'A' }),
      b = store.add({ label: 'B' }),
      c = store.add({ label: 'C' });

    a.dismiss();
    store.limit = 2;

    expect(store.all).to.deep.equal([c, b]);
  });

  it('should never drop active notifications', () => {
    const a = store.add({ label: 'A' }),
      b = store.add({ label: 'B' });

    store.limit = 1;

    expect(store.all).to.deep.equal([b, a]);
  });
});

describe('Notification', () => {
  let store: NotificationStore;

  beforeEach(() => {
    store = new NotificationStore();
  });

  it('should mark as read when dismissed by the user', async () => {
    const n = store.add({ label: 'A', variant: 'warning' });

    n.dismiss('user');

    expect(n.active).to.be.false;
    expect(n.read).to.be.true;
    expect(await n.closed).to.equal('user');
  });

  it('should mark info and success as read after a timeout', () => {
    const info = store.add({ label: 'A' }),
      success = store.add({ label: 'B', variant: 'success' });

    info.dismiss('timeout');
    success.dismiss('timeout');

    expect(info.read).to.be.true;
    expect(success.read).to.be.true;
  });

  it('should leave warnings, errors and notifications with an action unread after a timeout', () => {
    const warning = store.add({ label: 'A', variant: 'warning' }),
      error = store.add({ label: 'B', variant: 'error' }),
      action = store.add({ label: 'C', action: { label: 'View', href: '#' } });

    [warning, error, action].forEach(n => n.dismiss('timeout'));

    expect(warning.read).to.be.false;
    expect(error.read).to.be.false;
    expect(action.read).to.be.false;
  });

  it('should leave the read state alone when dismissed by the api', () => {
    const n = store.add({ label: 'A' });

    n.dismiss();

    expect(n.read).to.be.false;
  });

  it('should only dismiss once', async () => {
    const n = store.add({ label: 'A' });

    n.dismiss('user');
    n.dismiss('timeout');

    expect(await n.closed).to.equal('user');
  });

  it('should mark as read', () => {
    const n = store.add({ label: 'A' });

    n.markRead();

    expect(n.read).to.be.true;
    expect(store.unreadCount).to.equal(0);
  });

  it('should use the default store for the static methods', () => {
    const n = Notification.add({ label: 'Default' });

    expect(Notification.all).to.include(n);
    expect(Notification.get(n.id)).to.equal(n);

    Notification.remove(n);

    expect(Notification.all).not.to.include(n);
  });
});

describe('getTimeout', () => {
  it('should be between 6 and 15 seconds by default', () => {
    expect(getTimeout({ label: 'Saved' })).to.equal(6000);
    expect(getTimeout({ label: Array.from({ length: 100 }, () => 'word').join(' ') })).to.equal(
      15000
    );
  });

  it('should be 2 seconds plus 300ms per word', () => {
    const label = Array.from({ length: 20 }, () => 'word').join(' ');

    expect(getTimeout({ label })).to.equal(8000);
  });

  it('should count the words of the description too', () => {
    const description = Array.from({ length: 19 }, () => 'word').join(' ');

    expect(getTimeout({ label: 'Saved', description })).to.equal(8000);
  });

  it('should use an explicit duration', () => {
    expect(getTimeout({ label: 'Saved', duration: 3000 })).to.equal(3000);
    expect(getTimeout({ label: 'Saved', duration: 0 })).to.equal(0);
  });

  it('should never time out for errors or with an action', () => {
    expect(getTimeout({ label: 'Saved', variant: 'error', duration: 3000 })).to.equal(0);
    expect(getTimeout({ label: 'Saved', action: { label: 'View' } })).to.equal(0);
  });
});
