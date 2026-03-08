import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { describe, expect, it } from 'vitest';
import { type EventRegistration, EventsController } from './events.js';

class TestElement extends LitElement {
  static override properties = {
    events: { type: Object }
  };

  #events?: EventRegistration;
  get events() {
    return this.#events;
  }
  set events(val: EventRegistration | undefined) {
    this.#events = val;
    if (this.controller) {
      this.removeController(this.controller);
    }
    if (val) {
      this.controller = new EventsController(this, val);
    }
  }

  controller?: EventsController;

  override render() {
    return html`<slot></slot>`;
  }
}

customElements.define('shared-events-test', TestElement);

describe('EventsController', () => {
  it('should register a simple function listener', async () => {
    let clicked = false;
    const el = await fixture<TestElement>(html`
      <shared-events-test
        .events=${{
          click: () => {
            clicked = true;
          }
        }}
      ></shared-events-test>
    `);

    el.click();
    expect(clicked).to.be.true;
  });

  it('should register a listener with options (capture)', async () => {
    const log: string[] = [];
    const el = await fixture<TestElement>(html`
      <shared-events-test
        .events=${{
          click: {
            handler: () => {
              log.push('capture');
            },
            options: { capture: true }
          }
        }}
      >
        <button id="child">Child</button>
      </shared-events-test>
    `);

    el.addEventListener('click', () => {
      log.push('bubble');
    });

    const child = el.querySelector('#child') as HTMLElement;
    child.click();

    expect(log).to.deep.equal(['capture', 'bubble']);
  });

  it('should unregister all listeners on disconnect', async () => {
    let clickedCount = 0;
    const el = await fixture<TestElement>(html`
      <shared-events-test
        .events=${{
          click: () => {
            clickedCount++;
          }
        }}
      ></shared-events-test>
    `);

    el.click();
    expect(clickedCount).to.equal(1);

    el.remove();
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for disconnectedCallback

    el.click();
    expect(clickedCount).to.equal(1);
  });
});
