import { type Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { type PopoverPosition } from '@sl-design-system/shared';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Popover } from './popover.js';
import './register.js';

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
      await userEvent.keyboard('{Escape}');

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

  describe('anchoring', () => {
    // The `toggle` event is queued as a task, so it fires after `updateComplete` has resolved.
    const afterToggle = () => new Promise(resolve => setTimeout(resolve));

    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <sl-button id="anchor4" variant="primary">Toggle popover</sl-button>
          <sl-popover anchor="anchor4" position="top-start">Popover content</sl-popover>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;
      popover = el.querySelector('sl-popover') as Popover;
    });

    it('should resolve the anchor attribute to an element', () => {
      expect(popover.anchorElement).to.equal(button);
    });

    it('should reflect the position so it can be styled', () => {
      expect(popover).to.have.attribute('position', 'top-start');
    });

    it('should default to the bottom position', async () => {
      const other = await fixture<Popover>(html`<sl-popover>Popover content</sl-popover>`);

      expect(other).to.have.attribute('position', 'bottom');
    });

    it('should link the anchor to the popover using CSS anchor positioning', () => {
      expect(button.style.anchorName).to.equal(`--${popover.id}`);
      expect(popover.style.positionAnchor).to.equal(`--${popover.id}`);
    });

    it('should mark the popover as anchored', () => {
      expect(popover).to.have.attribute('anchored');
    });

    it('should not mark a popover without an anchor as anchored', async () => {
      const other = await fixture<Popover>(html`<sl-popover>Popover content</sl-popover>`);

      expect(other).not.to.have.attribute('anchored');
    });

    it('should reuse an anchor name that was set in CSS', async () => {
      const wrapper = await fixture(html`
        <div>
          <sl-button id="anchor5" style="anchor-name: --custom">Toggle popover</sl-button>
          <sl-popover anchor="anchor5">Popover content</sl-popover>
        </div>
      `);
      const other = wrapper.querySelector('sl-popover') as Popover;

      expect(other.style.positionAnchor).to.equal('--custom');
    });

    it('should mark the anchor as expanded while the popover is open', async () => {
      popover.showPopover();
      await afterToggle();

      expect(button).to.have.attribute('popover-opened');

      popover.hidePopover();
      await afterToggle();

      expect(button).not.to.have.attribute('popover-opened');
    });

    it('should set the placement the popover ended up on', async () => {
      popover.showPopover();
      await afterToggle();

      // The fixture sits at the top of the page, so a top position has to flip to the bottom.
      const anchorRect = button.getBoundingClientRect(),
        popoverRect = popover.getBoundingClientRect();

      expect(popoverRect.top).to.be.at.least(anchorRect.bottom);
      expect(popover).to.have.attribute('actual-placement', 'bottom');
    });

    describe('the arrow', () => {
      /** The distance between the anchor and the given rect, on the side the popover ended up on. */
      const distance = (anchor: DOMRect, rect: DOMRect, placement: string): number => {
        switch (placement) {
          case 'top':
            return anchor.top - rect.bottom;
          case 'bottom':
            return rect.top - anchor.bottom;
          case 'left':
            return anchor.left - rect.right;
          default:
            return rect.left - anchor.right;
        }
      };

      (['top', 'right', 'bottom', 'left'] as PopoverPosition[]).forEach(position => {
        it(`should not sit in the offset when the popover is positioned at the ${position}`, async () => {
          // The anchor sits in the middle of the viewport, so the popover has room on every side.
          el = await fixture(html`
            <div>
              <button id="anchor7" style="position: fixed; inset: 300px auto auto 400px">
                Anchor
              </button>
              <sl-popover anchor="anchor7" position=${position}>Popover content</sl-popover>
            </div>
          `);

          popover = el.querySelector('sl-popover') as Popover;
          popover.showPopover();
          await afterToggle();

          const placement = popover.getAttribute('actual-placement')!,
            anchorRect = (el.querySelector('button') as HTMLElement).getBoundingClientRect(),
            arrowRect = popover.renderRoot.querySelector('[part="arrow"]')!.getBoundingClientRect(),
            offset = parseFloat(getComputedStyle(popover).getPropertyValue('--_offset')),
            arrowSize =
              placement === 'top' || placement === 'bottom' ? arrowRect.height : arrowRect.width;

          expect(placement).to.equal(position);

          // The arrow sticks out of the popover, so the gap has to fit both the arrow and the offset.
          expect(distance(anchorRect, popover.getBoundingClientRect(), placement)).to.equal(
            offset + arrowSize
          );
          expect(distance(anchorRect, arrowRect, placement)).to.be.greaterThan(0);
        });
      });
    });

    describe('with a plain anchor', () => {
      // sl-button forwards ARIA attributes to the button inside its shadow root, so a plain
      // element is used here to assert on them directly.
      let anchor: HTMLElement;

      beforeEach(async () => {
        el = await fixture(html`
          <div>
            <button id="anchor6">Toggle popover</button>
            <sl-popover anchor="anchor6">Popover content</sl-popover>
          </div>
        `);

        anchor = el.querySelector('button') as HTMLElement;
        popover = el.querySelector('sl-popover') as Popover;
      });

      it('should link the anchor to the popover for screen readers', () => {
        expect(anchor).to.have.attribute('aria-details', popover.id);
      });

      it('should reflect the open state on the anchor', async () => {
        popover.showPopover();
        await afterToggle();

        expect(anchor).to.have.attribute('aria-expanded', 'true');

        popover.hidePopover();
        await afterToggle();

        expect(anchor).to.have.attribute('aria-expanded', 'false');
      });
    });
  });

  describe('Invoker source', () => {
    let otherButton: Button;

    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <sl-button id="anchor3" variant="primary">Anchor</sl-button>
          <sl-button id="other">Other</sl-button>
          <sl-popover anchor="anchor3">Popover content</sl-popover>
        </div>
      `);

      button = el.querySelector('#anchor3') as Button;
      otherButton = el.querySelector('#other') as Button;
      popover = el.querySelector('sl-popover') as Popover;
    });

    // The `toggle` event is queued as a task, so it fires after `updateComplete` has resolved.
    const afterToggle = () => new Promise(resolve => setTimeout(resolve));

    it('should keep the anchor when there is no invoker source', async () => {
      popover.showPopover();
      await afterToggle();

      expect(popover.anchorElement).to.equal(button);
    });

    it('should position the popover against the invoker source', async () => {
      popover.showPopover({ source: otherButton });
      await afterToggle();

      expect(popover.anchorElement).to.equal(otherButton);
    });

    it('should not change the anchor when the popover is closed', async () => {
      popover.showPopover({ source: button });
      await afterToggle();

      popover.hidePopover();
      await afterToggle();

      expect(popover.anchorElement).to.equal(button);
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
