import { type Button } from '@sl-design-system/button';
import '@sl-design-system/button/register.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Popover, type PopoverPlacement } from './popover.js';
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
          <sl-popover>
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
          <sl-popover> Popover content </sl-popover>
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
          <sl-popover id="popover-2"> Popover content </sl-popover>
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

    /** The `anchor-name` the popover gives its anchor; unique to the popover. */
    let anchorName: string;

    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <sl-button id="anchor4" variant="primary">Toggle popover</sl-button>
          <sl-popover>Popover content</sl-popover>
        </div>
      `);

      button = el.querySelector('sl-button') as Button;
      popover = el.querySelector('sl-popover') as Popover;
      anchorName = `--popover-anchor-${popover.id}`;
    });

    it('should not anchor the popover when it is opened without an invoker', async () => {
      popover.showPopover();
      await afterToggle();

      expect(popover.style.positionAnchor).to.equal('');
      expect(popover.placement).to.be.undefined;
    });

    it('should anchor the popover to the element that invoked it', async () => {
      popover.showPopover({ source: button });
      await afterToggle();

      expect(button.style.anchorName).to.equal(anchorName);
      expect(popover.style.positionAnchor).to.equal(anchorName);
    });

    it('should keep an anchor name that was already set', async () => {
      button.style.anchorName = '--custom';

      popover.showPopover({ source: button });
      await afterToggle();

      expect(button.style.anchorName).to.equal(`--custom, ${anchorName}`);
      expect(popover.style.positionAnchor).to.equal(anchorName);
    });

    it('should not add its anchor name to the same anchor twice', async () => {
      popover.showPopover({ source: button });
      await afterToggle();

      popover.hidePopover();
      await afterToggle();

      popover.showPopover({ source: button });
      await afterToggle();

      expect(button.style.anchorName).to.equal(anchorName);
    });

    it('should stop anchoring the popover when it closes', async () => {
      popover.showPopover({ source: button });
      await afterToggle();

      popover.hidePopover();
      await afterToggle();

      expect(popover.style.positionAnchor).to.equal('');
      expect(popover.placement).to.be.undefined;
    });

    it('should set the placement the popover ended up on', async () => {
      popover.showPopover({ source: button });
      await afterToggle();

      // The fixture sits at the top of the page, so there is room below the anchor.
      const anchorRect = button.getBoundingClientRect(),
        popoverRect = popover.getBoundingClientRect();

      expect(popoverRect.top).to.be.at.least(anchorRect.bottom);
      expect(popover.placement).to.equal('bottom');
      expect(popover.matches(':state(anchored-bottom)')).to.be.true;
    });

    it('should only set the custom state of the side it ended up on', async () => {
      popover.showPopover({ source: button });
      await afterToggle();

      expect(popover.matches(':state(anchored-bottom)')).to.be.true;
      expect(popover.matches(':state(anchored-top)')).to.be.false;
      expect(popover.matches(':state(anchored-left)')).to.be.false;
      expect(popover.matches(':state(anchored-right)')).to.be.false;
    });

    describe('the arrow', () => {
      /** The gap between the anchor and the given rect, on the side the popover ended up on. */
      const gap = (anchor: DOMRect, rect: DOMRect, placement: string): number => {
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

      /** How far the arrow reaches past the edge of the popover facing the anchor. */
      const overlap = (popoverRect: DOMRect, rect: DOMRect, placement: string): number => {
        switch (placement) {
          case 'top':
            return popoverRect.bottom - rect.top;
          case 'bottom':
            return rect.bottom - popoverRect.top;
          case 'left':
            return popoverRect.right - rect.left;
          default:
            return rect.right - popoverRect.left;
        }
      };

      /** The center of the rect on the axis the arrow slides along. */
      const center = (rect: DOMRect, placement: string): number =>
        placement === 'top' || placement === 'bottom'
          ? (rect.left + rect.right) / 2
          : (rect.top + rect.bottom) / 2;

      (['top', 'right', 'bottom', 'left'] as PopoverPlacement[]).forEach(placement => {
        describe(`anchored at the ${placement}`, () => {
          let anchor: HTMLElement, anchorRect: DOMRect, arrowRect: DOMRect, popoverRect: DOMRect;
          let borderWidth: number, offset: number;

          beforeEach(async () => {
            // The anchor sits in the middle of the viewport, so the popover has room on every side.
            el = await fixture(html`
              <div>
                <button id="anchor7" style="position: fixed; inset: 300px auto auto 400px">
                  Anchor
                </button>
                <sl-popover>Popover content</sl-popover>
              </div>
            `);

            anchor = el.querySelector('button') as HTMLElement;
            popover = el.querySelector('sl-popover') as Popover;
            popover.style.setProperty('position-area', `${placement} span-all`);

            popover.showPopover({ source: anchor });
            await afterToggle();

            const style = getComputedStyle(popover);

            borderWidth = parseFloat(style.getPropertyValue('--sl-size-borderWidth-default'));
            offset = parseFloat(style.getPropertyValue('--_offset'));
            anchorRect = anchor.getBoundingClientRect();
            popoverRect = popover.getBoundingClientRect();
            arrowRect = popover.renderRoot.querySelector('[part="arrow"]')!.getBoundingClientRect();
          });

          it('should end up on that side', () => {
            expect(popover.placement).to.equal(placement);
          });

          it('should leave the offset between the anchor and the popover', () => {
            expect(gap(anchorRect, popoverRect, placement)).to.equal(offset);
          });

          it('should overlap the border of the container so the two shapes join up', () => {
            expect(overlap(popoverRect, arrowRect, placement)).to.equal(borderWidth);
          });

          it('should be centered on the anchor', () => {
            expect(center(arrowRect, placement)).to.be.closeTo(center(anchorRect, placement), 0.5);
          });
        });
      });
    });
  });

  describe('invoker source', () => {
    // The `toggle` event is queued as a task, so it fires after `updateComplete` has resolved.
    const afterToggle = () => new Promise(resolve => setTimeout(resolve));

    let otherButton: Button;

    beforeEach(async () => {
      el = await fixture(html`
        <div>
          <sl-button id="anchor3" variant="primary">Anchor</sl-button>
          <sl-button id="other">Other</sl-button>
          <sl-popover>Popover content</sl-popover>
        </div>
      `);

      button = el.querySelector('#anchor3') as Button;
      otherButton = el.querySelector('#other') as Button;
      popover = el.querySelector('sl-popover') as Popover;
    });

    it('should position the popover against the invoker source', async () => {
      popover.showPopover({ source: otherButton });
      await afterToggle();

      const anchorRect = otherButton.getBoundingClientRect(),
        popoverRect = popover.getBoundingClientRect();

      expect(otherButton.style.anchorName).to.equal(`--popover-anchor-${popover.id}`);
      expect(popoverRect.top).to.be.at.least(anchorRect.bottom);
    });

    it('should re-anchor the popover when it is reopened from another source', async () => {
      popover.showPopover({ source: button });
      await afterToggle();

      popover.hidePopover();
      await afterToggle();

      popover.showPopover({ source: otherButton });
      await afterToggle();

      expect(button.style.anchorName).to.equal('');
      expect(otherButton.style.anchorName).to.equal(`--popover-anchor-${popover.id}`);
    });

    it('should re-anchor the popover to a source that comes before the previous one', async () => {
      popover.showPopover({ source: otherButton });
      await afterToggle();

      popover.hidePopover();
      await afterToggle();

      popover.showPopover({ source: button });
      await afterToggle();

      // A duplicate `anchor-name` resolves to the last one in tree order, so leaving the name on
      // `otherButton` would keep the popover anchored there instead of moving it to `button`.
      const anchorRect = button.getBoundingClientRect(),
        popoverRect = popover.getBoundingClientRect();

      expect(otherButton.style.anchorName).to.equal('');
      expect(popoverRect.top).to.be.at.least(anchorRect.bottom);
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
          <sl-popover id="popover-2"> Popover content </sl-popover>
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
