import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { describe, expect, it } from 'vitest';
import { EventsController } from './events.js';
class TestElement extends LitElement {
  static {
    this.properties = {
      events: { type: Object }
    };
  }
  #events;
  get events() {
    return this.#events;
  }
  set events(val) {
    this.#events = val;
    if (this.controller) {
      this.removeController(this.controller);
    }
    if (val) {
      this.controller = new EventsController(this, val);
    }
  }
  render() {
    return html`<slot></slot>`;
  }
}
try {
  customElements.define('shared-events-test', TestElement);
} catch {}
describe('EventsController', () => {
  it('should register a simple function listener', async () => {
    let clicked = false;
    const el = await fixture(html`
      <shared-events-test
        .events=${{
          click: () => {
            clicked = true;
          }
        }}></shared-events-test>
    `);
    el.click();
    expect(clicked).to.be.true;
  });
  it('should register a listener with options (capture)', async () => {
    const log = [];
    const el = await fixture(html`
      <shared-events-test
        .events=${{
          click: {
            handler: () => {
              log.push('capture');
            },
            options: { capture: true }
          }
        }}>
        <button id="child">Child</button>
      </shared-events-test>
    `);
    el.addEventListener('click', () => {
      log.push('bubble');
    });
    const child = el.querySelector('#child');
    child.click();
    expect(log).to.deep.equal(['capture', 'bubble']);
  });
  it('should unregister all listeners on disconnect', async () => {
    let clickedCount = 0;
    const el = await fixture(html`
      <shared-events-test
        .events=${{
          click: () => {
            clickedCount++;
          }
        }}></shared-events-test>
    `);
    el.click();
    expect(clickedCount).to.equal(1);
    el.remove();
    await new Promise(resolve => setTimeout(resolve, 0));
    el.click();
    expect(clickedCount).to.equal(1);
  });
});
//# sourceMappingURL=events.spec.js.map
