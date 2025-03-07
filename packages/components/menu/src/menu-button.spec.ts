import { faGear } from '@fortawesome/pro-regular-svg-icons';
import { expect, fixture } from '@open-wc/testing';
import { type Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
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
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    describe('button', () => {
      it('should have a button', () => {
        expect(button).to.exist;
      });

      it('should not be expanded', () => {
        expect(button).to.have.attribute('aria-expanded', 'false');
      });

      it('should be expanded when the menu is open', () => {
        button.click();

        expect(button).to.have.attribute('aria-expanded', 'true');
      });

      it('should be linked to the menu', () => {
        expect(button.getAttribute('aria-controls')).to.equal(menu.id);
      });

      it('should not have a disabled button', () => {
        expect(button).not.to.have.attribute('disabled');
        expect(button.disabled).not.to.be.true;
        expect(el.disabled).not.to.be.true;
      });

      it('should have a disabled button when set', async () => {
        el.disabled = true;
        await el.updateComplete;

        expect(button).to.have.attribute('disabled');
        expect(button.disabled).to.be.true;
        expect(el.disabled).to.be.true;
      });

      it('should not have an explicit size', () => {
        expect(button).not.to.have.attribute('size');
        expect(button.size).to.be.undefined;
      });

      it('should have a different size when set', async () => {
        el.size = 'sm';
        await el.updateComplete;

        expect(button).to.have.attribute('size', 'sm');
        expect(button.size).to.equal('sm');
      });

      it('should have an outline fill', () => {
        expect(button).to.have.attribute('fill', 'outline');
        expect(button.fill).to.equal('outline');
      });

      it('should have a different fill when set', async () => {
        el.fill = 'solid';
        await el.updateComplete;

        expect(button).to.have.attribute('fill', 'solid');
        expect(button.fill).to.equal('solid');
      });

      it('should not have an explicit variant', () => {
        expect(button).not.to.have.attribute('variant');
        expect(button.variant).to.be.undefined;
      });

      it('should have a different variant when set', async () => {
        el.variant = 'primary';
        await el.updateComplete;

        expect(button).to.have.attribute('variant', 'primary');
        expect(button.variant).to.equal('primary');
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
        spy(button, 'focus');

        button.click();

        el.querySelector('sl-menu-item')?.focus();
        await sendKeys({ press: 'Escape' });

        expect(button.focus).to.have.been.calledOnce;
      });
    });

    describe('menu', () => {
      it('should have a menu', () => {
        expect(menu).to.exist;
      });

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

        it('should show the menu when the button is focused and the down arrow key is pressed', async () => {
          button.focus();
          await sendKeys({ press: 'ArrowDown' });

          expect(menu).to.match(':popover-open');
        });

        it('should focus the menu when the button is focused and the down arrow key is pressed', async () => {
          button.focus();
          await sendKeys({ press: 'ArrowDown' });

          expect(el.querySelector('sl-menu-item')).to.equal(document.activeElement);
        });

        it('should show the menu when the button is focused and the enter key is pressed', async () => {
          button.focus();
          await sendKeys({ press: 'Enter' });

          expect(menu).to.match(':popover-open');
        });

        it('should show the menu when the button is focused and the space key is pressed', async () => {
          button.focus();
          await sendKeys({ press: ' ' });

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

        it('should hide the menu when the escape key is pressed', async () => {
          expect(menu).to.match(':popover-open');

          await sendKeys({ press: 'Escape' });

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
          await sendKeys({ press: 'Enter' });

          expect(menu).not.to.match(':popover-open');
        });

        it('should hide the menu when a menu item is focused and the space key is pressed', async () => {
          expect(menu).to.match(':popover-open');

          el.querySelector('sl-menu-item')?.focus();
          await sendKeys({ press: ' ' });

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
  });

  describe('aria attributes', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu-button aria-label="my label" aria-disabled="true">
          <span slot="button">Button</span>

          <sl-menu-item>Item 1</sl-menu-item>
          <sl-menu-item>Item 2</sl-menu-item>
        </sl-menu-button>
      `);

      button = el.renderRoot.querySelector('sl-button') as Button;
      menu = el.renderRoot.querySelector('sl-menu') as Menu;

      // Give time to rewrite arias
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should have a button with proper arias', () => {
      expect(el).not.to.have.attribute('aria-label', 'my label');
      expect(el).not.to.have.attribute('aria-disabled', 'true');
      expect(button).to.have.attribute('aria-label', 'my label');
      expect(button).to.have.attribute('aria-disabled', 'true');
    });
  });
});
