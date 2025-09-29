import { EventEmitter } from '@sl-design-system/shared';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { Announcer, SlAnnounceEvent } from './announcer.js';

describe('sl-announcer', () => {
  let el: Announcer;

  beforeEach(async () => {
    el = await fixture(html`<sl-announcer></sl-announcer>`);
  });

  it('should render correctly', () => {
    const containers = el.shadowRoot?.querySelectorAll('ul');
    expect(containers?.length).to.equal(2);
  });

  it('should handle sl-announce event', () => {
    const liveEvent = new EventEmitter<SlAnnounceEvent>(document.body, 'sl-announce');
    liveEvent.emit({ message: 'This is sent with an event' });

    const polite = el.shadowRoot?.querySelector('[aria-live="polite"]');

    expect(polite?.textContent).to.equal('This is sent with an event');
  });

  it('should handle sl-announce event with urgency assertive', () => {
    const liveEvent = new EventEmitter<SlAnnounceEvent>(document.body, 'sl-announce');
    liveEvent.emit({ message: 'This is sent with an event', urgency: 'assertive' });

    const polite = el.shadowRoot?.querySelector('[aria-live="assertive"]');

    expect(polite?.textContent).to.equal('This is sent with an event');
  });

  it('should remove the announcement after 500 ms', async () => {
    const liveEvent = new EventEmitter<SlAnnounceEvent>(document.body, 'sl-announce');
    liveEvent.emit({ message: 'This is sent with an event' });

    const polite = el.shadowRoot?.querySelector('[aria-live="polite"]');

    expect(polite?.textContent).to.equal('This is sent with an event');

    await new Promise(resolve => setTimeout(resolve, 600));
    expect(polite?.textContent).to.equal('');
  });
});
