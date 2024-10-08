import { expect, fixture } from '@open-wc/testing';
import { type Button } from '@sl-design-system/button';
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
    return await new Promise(resolve => setTimeout(resolve));
  };

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <sl-button id="anchor" variant="primary" @click=${onClick}>Toggle popover</sl-button>
          <sl-popover anchor="anchor">
            <header>Please confirm</header>
            <section>Are you sure you want to continue?</section>
            <footer>
              <sl-button size="sm">Cancel</sl-button>
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

    it('should set id if not already set', () => {
      expect(popover).to.have.attribute('id');
      expect(popover.id).to.match(/sl-popover-(\d+)/);
    });

    it('should not show the popover by default', () => {
      expect(popover.matches(':popover-open')).to.be.false;
    });

    it('should show the popover after togglePopover was called', async () => {
      await showPopoverElement();

      expect(popover?.matches(':popover-open')).to.be.true;
    });
  });

  describe('Closing popover', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <sl-button id="anchor2" variant="primary" @click=${onClick}>Toggle popover</sl-button>
          <sl-popover anchor="anchor2"> Popover content </sl-popover>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;
      popover = el.querySelector('sl-popover') as Popover;

      await showPopoverElement();
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
    const hideOnClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.nextElementSibling as HTMLElement).hidePopover();
    };

    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <sl-button popovertarget="popover-2" id="anchor2" variant="primary" @click=${hideOnClick}
            >Toggle popover</sl-button
          >
          <sl-popover id="popover-2" anchor="anchor2"> Popover content </sl-popover>
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
    const hideOnClick = (event: Event & { target: HTMLElement }): void => {
      (event.target.nextElementSibling as HTMLElement).showPopover();
    };

    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <sl-button popovertarget="popover-2" id="anchor2" variant="primary" @click=${hideOnClick}
            >Toggle popover</sl-button
          >
          <sl-popover id="popover-2" anchor="anchor2"> Popover content </sl-popover>
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
