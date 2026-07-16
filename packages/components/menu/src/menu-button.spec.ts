import { faGear } from '@fortawesome/pro-regular-svg-icons';
import { type Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import {
  getForwardedAccessibleName,
  getForwardedAriaAttribute,
  getForwardedAriaProperty,
  isForwardedDisabled
} from '@sl-design-system/shared/helpers/forward-aria.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { type MenuButton } from './menu-button.js';
import { type Menu } from './menu.js';

Icon.register(faGear);

describe('sl-menu-button', () => {
  let el: MenuButton, button: Button, menu: Menu;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu-button>
          <span slot="button">Button</span>

          <sl-menu-item>Item 1</sl-menu-item>
          <sl-menu-item>Item 2</sl-menu-item>
        </sl-menu-button>
      `);

      button = el.renderRoot.querySelector('sl-button') as Button;
      menu = el.renderRoot.querySelector('sl-menu') as Menu;
    });

    it('should not be disabled', () => {
      expect(el.disabled).not.to.be.true;
    });

    describe('button', () => {
      it('should have a disabled button when set', async () => {
        el.disabled = true;
        await el.updateComplete;

        expect(isForwardedDisabled(button)).to.be.true;
      });

      it('should not have an explicit size', () => {
        expect(button).not.to.have.attribute('size');
        expect(button.size).to.be.undefined;
      });

      it('should have a different size when set', async () => {
        el.size = 'sm';
        await el.updateComplete;

        expect(button).to.have.attribute('size', 'sm');
      });

      it('should have an outline fill', () => {
        expect(button).to.have.attribute('fill', 'outline');
      });

      it('should have a different fill when set', async () => {
        el.fill = 'solid';
        await el.updateComplete;

        expect(button).to.have.attribute('fill', 'solid');
      });

      it('should not have an explicit variant', () => {
        expect(button).not.to.have.attribute('variant');
      });

      it('should have a different variant when set', async () => {
        el.variant = 'primary';
        await el.updateComplete;

        expect(button).to.have.attribute('variant', 'primary');
      });

      it('should slot the button content', () => {
        const slot = button.querySelector('slot'),
          assignedElements = slot?.assignedElements();

        expect(slot).to.have.attribute('name', 'button');
        expect(assignedElements).to.have.length(1);
        expect(assignedElements?.at(0)).to.have.text('Button');
      });

      it('should have an arrow', () => {
        const icon = button.querySelector('sl-icon');

        expect(icon).to.exist;
        expect(icon).to.have.attribute('name', 'angle-down');
      });

      it('should focus the button after the menu is hidden', async () => {
        button.click();

        el.querySelector('sl-menu-item')?.focus();

        // The 50msec timeout fixes the flakiness of this test on headless browsers
        await new Promise(resolve => setTimeout(resolve, 50));

        await userEvent.keyboard('{Escape}');

        expect(el.shadowRoot?.activeElement).to.equal(button);
      });
    });

    describe('menu', () => {
      it('should have a bottom-start position', () => {
        expect(menu.position).to.equal('bottom-start');
      });

      it('should slot the menu items', () => {
        const slot = menu.querySelector('slot'),
          assignedElements = slot?.assignedElements();

        expect(slot).not.to.have.attribute('name');
        expect(assignedElements).to.have.length(2);
        expect(assignedElements).to.eql(Array.from(el.querySelectorAll(':scope > sl-menu-item')));
      });

      it('should be anchored to the button', () => {
        expect(menu.anchorElement).to.equal(button);
      });

      describe('show', () => {
        it('should show the menu when the button is clicked', () => {
          button.click();

          expect(menu).to.match(':popover-open');
        });

        it('should emit an sl-toggle event when the menu opens', async () => {
          const event = new Promise<CustomEvent<boolean>>(resolve =>
            el.addEventListener('sl-toggle', event => resolve(event as CustomEvent<boolean>), {
              once: true
            })
          );

          button.click();

          expect((await event).detail).to.be.true;
        });

        it('should not show the menu when the button is clicked while disabled', async () => {
          el.disabled = true;
          await el.updateComplete;

          button.click();

          expect(menu).not.to.match(':popover-open');
        });

        it('should not move focus when the button is clicked without being focused', async () => {
          // Ensure button is not focused
          document.body.focus();

          button.click();
          await new Promise(resolve => setTimeout(resolve, 50));

          expect(menu).to.match(':popover-open');
          expect(document.activeElement).not.to.equal(el.querySelector('sl-menu-item'));
        });

        it('should focus the first menu item when opened with Enter while button is focused', async () => {
          button.focus();

          await userEvent.keyboard('{Enter}');
          await new Promise(resolve => setTimeout(resolve, 50));

          expect(document.activeElement).to.equal(el.querySelector('sl-menu-item'));
        });

        it('should show the menu when the button is focused and the down arrow key is pressed', async () => {
          button.focus();
          await userEvent.keyboard('{ArrowDown}');

          expect(menu).to.match(':popover-open');
        });

        it('should focus the menu when the button is focused and the down arrow key is pressed', async () => {
          button.focus();
          await userEvent.keyboard('{ArrowDown}');

          expect(el.querySelector('sl-menu-item')).to.equal(document.activeElement);
        });

        it('should show the menu when the button is focused and the enter key is pressed', async () => {
          button.focus();
          await userEvent.keyboard('{Enter}');

          expect(menu).to.match(':popover-open');
        });

        it('should show the menu when the button is focused and the space key is pressed', async () => {
          button.focus();
          await userEvent.keyboard('{Space}');

          expect(menu).to.match(':popover-open');
        });
      });

      describe('hide', () => {
        beforeEach(async () => {
          button.click();

          // Give the browser time to open the popover
          await new Promise(resolve => setTimeout(resolve, 50));
        });

        it('should hide the menu when the button is clicked', () => {
          expect(menu).to.match(':popover-open');

          button.click();

          expect(menu).not.to.match(':popover-open');
        });

        it('should emit an sl-toggle event when the menu closes', async () => {
          const event = new Promise<CustomEvent<boolean>>(resolve =>
            el.addEventListener('sl-toggle', event => resolve(event as CustomEvent<boolean>), {
              once: true
            })
          );

          button.click();

          expect((await event).detail).to.be.false;
        });

        it('should hide the menu when the escape key is pressed', async () => {
          expect(menu).to.match(':popover-open');

          await userEvent.keyboard('{Escape}');

          expect(menu).not.to.match(':popover-open');
        });

        it('should hide the menu when a menu item is clicked', () => {
          expect(menu).to.match(':popover-open');

          el.querySelector('sl-menu-item')?.click();

          expect(menu).not.to.match(':popover-open');
        });

        it('should hide the menu when a menu item is focused and the enter key is pressed', async () => {
          expect(menu).to.match(':popover-open');

          el.querySelector('sl-menu-item')?.focus();
          await userEvent.keyboard('{Enter}');

          expect(menu).not.to.match(':popover-open');
        });

        it('should hide the menu when a menu item is focused and the space key is pressed', async () => {
          expect(menu).to.match(':popover-open');

          el.querySelector('sl-menu-item')?.focus();
          await userEvent.keyboard('{ }');

          expect(menu).not.to.match(':popover-open');
        });
      });
    });
  });

  describe('icon only button', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu-button>
          <sl-icon name="far-gear" slot="button"></sl-icon>

          <sl-menu-item>Item 1</sl-menu-item>
          <sl-menu-item>Item 2</sl-menu-item>
        </sl-menu-button>
      `);

      button = el.renderRoot.querySelector('sl-button') as Button;
    });

    it('should not have an arrow in the button', () => {
      expect(button.querySelector('sl-icon[name="angle-down"]')).not.to.exist;
    });

    it('should not have a selected span', () => {
      expect(button.querySelector('.selected')).not.to.exist;
    });

    it('should mark the button as icon only', () => {
      expect(button).to.match(':state(icon-only)');
    });
  });

  describe('accessibility', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu-button>
          <span slot="button">Button</span>

          <sl-menu-item>Item 1</sl-menu-item>
          <sl-menu-item>Item 2</sl-menu-item>
        </sl-menu-button>
      `);

      button = el.renderRoot.querySelector('sl-button') as Button;
      menu = el.renderRoot.querySelector('sl-menu') as Menu;
    });

    it('should indicate it opens a menu', () => {
      expect(getForwardedAriaAttribute(button, 'aria-haspopup')).to.equal('menu');
    });

    it('should not be expanded', () => {
      expect(getForwardedAriaAttribute(button, 'aria-expanded')).to.equal('false');
    });

    it('should be expanded when the menu is open', async () => {
      button.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(getForwardedAriaAttribute(button, 'aria-expanded')).to.equal('true');
    });

    it('should be linked to the menu', () => {
      expect(getForwardedAriaProperty(button, 'ariaControlsElements')).to.contain(menu);
    });

    it('should proxy the aria-disabled attribute to the button element', async () => {
      el.setAttribute('aria-disabled', 'true');
      await new Promise(resolve => setTimeout(resolve));

      expect(el).to.not.have.attribute('aria-disabled');
      expect(isForwardedDisabled(button)).to.equal('aria');
    });

    it('should proxy the aria-label attribute to the button element', async () => {
      el.setAttribute('aria-label', 'Label');
      await new Promise(resolve => setTimeout(resolve));

      expect(el).to.not.have.attribute('aria-label');
      expect(getForwardedAccessibleName(button)).to.equal('Label');
    });

    it('should proxy the aria-labelledby attribute to ariaLabelledByElements on the button', async () => {
      const label = document.createElement('span');
      label.id = 'my-label';
      label.textContent = 'My label';
      el.insertAdjacentElement('afterend', label);
      el.setAttribute('aria-labelledby', 'my-label');

      await new Promise(resolve => setTimeout(resolve));

      expect(el).to.not.have.attribute('aria-labelledby');
      expect(button.ariaLabelledByElements).to.deep.equal([label]);

      label.remove();
    });
  });
});
