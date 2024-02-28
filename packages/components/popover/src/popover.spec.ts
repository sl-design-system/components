import { expect, fixture } from '@open-wc/testing';
import type { Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import '../register.js';
import { Popover } from './popover.js';

describe('sl-popover', () => {
  let el: HTMLElement;
  let button: Button;
  let popover: Popover;

  const onClick = (event: Event & { target: HTMLElement }): void => {
    (event.target.nextElementSibling as HTMLElement).togglePopover();
  };

  const showPopoverElement = async () => {
    const clickEvent = new Event('click');
    button?.dispatchEvent(clickEvent);
    await popover.updateComplete;
    return new Promise(resolve => setTimeout(resolve));
  }

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <sl-button id="anchor" variant="primary" @click=${onClick}>Toggle popover</sl-button>
          <sl-popover anchor="anchor">
            <header>Please confirm</header>
            <section>
              Are you sure you want to continue?
            </section>
            <footer>
              <sl-button size="sm" autofocus>Cancel</sl-button>
              <sl-button size="sm" variant="primary">Confirm</sl-button>
            </footer>
          </sl-popover>
        </div>
      `);
      button = el.querySelector('sl-button') as Button;
      popover = el.querySelector('sl-popover') as Popover;
    });

    it('should render correctly', () => {
      expect(popover).shadowDom.to.equalSnapshot();
    });

    it('should set popover attribute if not already set', () => {
      expect(popover).to.have.attribute('popover');
    });

    // FIXME: Don't test a custom element using its constructor
    it.skip('should set id attribute if not already set', async () => {
      const element = new Popover();

      expect(element.hasAttribute('id')).to.be.true;
    });

    it('should not show the popover by default', () => {
      expect(popover.matches(':popover-open')).to.be.false;
    });

    it('should show the popover after togglePopover was called', async () => {
      await showPopoverElement();

      expect(popover?.matches(':popover-open')).to.be.true;
    });

    // FIXME: This probably fails due to limited space and the flip() middleware
    it.skip('should have an actual placement bottom by default', async () => {
      await showPopoverElement();

      expect(popover).to.have.attribute('actual-placement', 'bottom');
    });
  });

  describe('Closing popover', () => {
    let popover: Popover;
    let clickEvent: PointerEvent;

    beforeEach(async ()=>{
      el = await fixture(html`
        <div>
          <sl-button id="anchor2" variant="primary" @click=${onClick}>Toggle popover</sl-button>
          <sl-popover anchor="anchor2">
            Popover content
          </sl-popover>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;
      popover = el.querySelector('sl-popover') as Popover;

      await showPopoverElement();

      clickEvent = new PointerEvent('click');
    });

    it('should close the popover after togglePopover was called twice', async () => {
      await showPopoverElement();

      expect(popover?.matches(':popover-open')).to.be.false;
    });

    it('should close the popover on escape', async () => {
      await sendKeys({ press: 'Escape' });

      expect(popover?.matches(':popover-open')).to.be.false;
    });
  });

  describe('Hiding popover', () => {
    let popover: Popover;

    const hideOnClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.nextElementSibling as HTMLElement).hidePopover();
    };

    beforeEach(async ()=>{
      el = await fixture(html`
        <div>
          <sl-button popovertarget="popover-2" id="anchor2" variant="primary" @click=${hideOnClick}>Toggle popover</sl-button>
          <sl-popover id="popover-2" anchor="anchor2">
            Popover content
          </sl-popover>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;
      popover = el.querySelector('sl-popover') as Popover;

      await showPopoverElement();
    });

    it('should close the popover after hidePopover was called', async () => {
      const clickEvent = new Event('click');
      button?.dispatchEvent(clickEvent);
      await popover.updateComplete;

      expect(popover?.matches(':popover-open')).to.be.false;
    });
  });

  describe('Showing popover', () => {
    let popover: Popover;

    const hideOnClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.nextElementSibling as HTMLElement).showPopover();
    };

    beforeEach(async ()=>{
      el = await fixture(html`
        <div>
          <sl-button popovertarget="popover-2" id="anchor2" variant="primary" @click=${hideOnClick}>Toggle popover</sl-button>
          <sl-popover id="popover-2" anchor="anchor2">
            Popover content
          </sl-popover>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;
      popover = el.querySelector('sl-popover') as Popover;
    });

    it('should show the popover after showPopover was called', async () => {
      const clickEvent = new Event('click');
      button?.dispatchEvent(clickEvent);
      await popover.updateComplete;

      expect(popover?.matches(':popover-open')).to.be.true;
    });
  });
});
