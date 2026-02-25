import { faGear } from '@fortawesome/pro-regular-svg-icons';
import { type Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should proxy the aria-disabled attribute to the input element', async () => {
      el.setAttribute('aria-disabled', 'true');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.not.have.attribute('aria-disabled');
      expect(el.button).to.have.attribute('aria-disabled', 'true');
    });

    it('should proxy the aria-label attribute to the input element', async () => {
      el.setAttribute('aria-label', 'Label');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).to.not.have.attribute('aria-label');
      expect(el.button).to.have.attribute('aria-label', 'Label');
    });

    describe('button', () => {
      it('should have a button', () => {
        expect(button).to.exist;
      });

      it('should indicate it opens a menu', () => {
        expect(button).to.have.attribute('aria-haspopup', 'menu');
      });

      it('should not be expanded', () => {
        expect(button).to.have.attribute('aria-expanded', 'false');
      });

      it('should be expanded when the menu is open', () => {
        button.click();

        expect(button).to.have.attribute('aria-expanded', 'true');
      });

      it('should be linked to the menu', () => {
        expect(button).to.have.attribute('aria-controls', menu.id);
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
        button.click();

        el.querySelector('sl-menu-item')?.focus();

        // The 50msec timeout fixes the flakiness of this test on headless browsers
        await new Promise(resolve => setTimeout(resolve, 50));

        await userEvent.keyboard('{Escape}');

        expect(el.shadowRoot?.activeElement).to.equal(button);
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
  });

  describe('aria-labelledby', () => {
    let label: HTMLElement, container: HTMLDivElement;

    beforeEach(async () => {
      container = document.createElement('div');

      container.innerHTML = `
        <span id="label-test">Menu button label</span>
        <sl-menu-button aria-labelledby="label-test">
          <sl-icon name="far-gear" slot="button"></sl-icon>
          <sl-menu-item>Item 1</sl-menu-item>
          <sl-menu-item>Item 2</sl-menu-item>
        </sl-menu-button>
      `;
      document.body.appendChild(container);

      el = container.querySelector('sl-menu-button') as MenuButton;
      label = container.querySelector('#label-test') as HTMLElement;

      await el.updateComplete;

      button = el.renderRoot.querySelector('sl-button') as Button;

      await new Promise(resolve => setTimeout(resolve, 50));
    });

    afterEach(() => {
      container.remove();
    });

    it('should remove aria-labelledby from sl-menu-button and set it on the button', () => {
      expect(el).not.to.have.attribute('aria-labelledby');
      expect(button.ariaLabelledByElements).to.not.be.null;
      expect(button.ariaLabelledByElements).to.deep.equal([label]);
    });

    it('should update aria-labelledby on the button when aria-labelledby changes', async () => {
      const newLabel = document.createElement('span');
      newLabel.id = 'new-label';
      newLabel.textContent = 'New label';
      document.body.appendChild(newLabel);

      el.setAttribute('aria-labelledby', 'new-label');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).not.to.have.attribute('aria-labelledby');
      expect(button.ariaLabelledByElements).to.deep.equal([newLabel]);

      newLabel.remove();
    });

    it('should handle multiple ids in aria-labelledby', async () => {
      const label2 = document.createElement('span');
      label2.id = 'label-test-2';
      label2.textContent = 'Additional label';
      document.body.appendChild(label2);

      el.setAttribute('aria-labelledby', 'label-test label-test-2');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).not.to.have.attribute('aria-labelledby');
      expect(button.ariaLabelledByElements).to.deep.equal([label, label2]);

      label2.remove();
    });

    it('should clear aria-labelledby when all ids are not existing', async () => {
      el.setAttribute('aria-labelledby', 'non-existent-1 non-existent-2');
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(el).not.to.have.attribute('aria-labelledby');
      expect(button.ariaLabelledByElements).to.be.null;
    });
  });

  describe('aria-describedby', () => {
    let description: HTMLElement, container: HTMLDivElement;

    beforeEach(async () => {
      container = document.createElement('div');

      container.innerHTML = `
        <span id="description-test">Menu button description</span>
        <sl-menu-button aria-describedby="description-test">
          <sl-icon name="far-gear" slot="button"></sl-icon>
          <sl-menu-item>Item 1</sl-menu-item>
          <sl-menu-item>Item 2</sl-menu-item>
        </sl-menu-button>
      `;
      document.body.appendChild(container);

      el = container.querySelector('sl-menu-button') as MenuButton;
      description = container.querySelector('#description-test') as HTMLElement;

      await el.updateComplete;

      button = el.renderRoot.querySelector('sl-button') as Button;

      await new Promise(resolve => setTimeout(resolve, 50));
    });

    afterEach(() => {
      container.remove();
    });

    it('should remove aria-describedby from sl-menu-button and set it on the button', () => {
      expect(el).not.to.have.attribute('aria-describedby');
      expect(button.ariaDescribedByElements).to.not.be.null;
      expect(button.ariaDescribedByElements).to.deep.equal([description]);
    });

    it('should update aria-describedby on the button when aria-describedby changes', async () => {
      const newDescription = document.createElement('span');
      newDescription.id = 'new-description';
      newDescription.textContent = 'New description';
      document.body.appendChild(newDescription);

      el.setAttribute('aria-describedby', 'new-description');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).not.to.have.attribute('aria-describedby');
      expect(button.ariaDescribedByElements).to.deep.equal([newDescription]);

      newDescription.remove();
    });

    it('should handle multiple ids in aria-describedby', async () => {
      const description2 = document.createElement('span');
      description2.id = 'description-test-2';
      description2.textContent = 'Additional description';
      document.body.appendChild(description2);

      el.setAttribute('aria-describedby', 'description-test description-test-2');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).not.to.have.attribute('aria-describedby');
      expect(button.ariaDescribedByElements).to.deep.equal([description, description2]);

      description2.remove();
    });

    it('should filter out not existing ids from aria-describedby', async () => {
      const description2 = document.createElement('span');
      description2.id = 'valid-description';
      description2.textContent = 'Valid description';
      document.body.appendChild(description2);

      el.setAttribute('aria-describedby', 'abc valid-description def');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).not.to.have.attribute('aria-describedby');
      expect(button.ariaDescribedByElements).to.deep.equal([description2]);

      description2.remove();
    });

    it('should handle both aria-describedby and aria-labelledby', async () => {
      const newLabel = document.createElement('span');
      newLabel.id = 'my-label';
      newLabel.textContent = 'Label';
      document.body.appendChild(newLabel);

      el.setAttribute('aria-describedby', 'description-test');
      el.setAttribute('aria-labelledby', 'my-label');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).not.to.have.attribute('aria-labelledby');
      expect(el).not.to.have.attribute('aria-describedby');
      expect(button.ariaLabelledByElements).to.deep.equal([newLabel]);
      expect(button.ariaDescribedByElements).to.deep.equal([description]);

      newLabel.remove();
    });

    it('should clear aria-describedby on the button when all ids are non-existent', async () => {
      el.setAttribute('aria-describedby', 'non-existent-1 non-existent-2');
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(el).not.to.have.attribute('aria-describedby');
      expect(button.ariaDescribedByElements).to.be.null;
    });
  });

  describe('dynamic aria attribute updates', () => {
    let container: HTMLDivElement;

    beforeEach(async () => {
      container = document.createElement('div');
      container.innerHTML = `
        <span id="observer-label">Label</span>
        <span id="observer-description">Description</span>
        <sl-menu-button aria-labelledby="observer-label" aria-describedby="observer-description">
          <sl-icon name="far-gear" slot="button"></sl-icon>
          <sl-menu-item>Item 1</sl-menu-item>
          <sl-menu-item>Item 2</sl-menu-item>
        </sl-menu-button>
      `;

      document.body.appendChild(container);

      el = container.querySelector('sl-menu-button') as MenuButton;
      await el.updateComplete;

      button = el.renderRoot.querySelector('sl-button') as Button;

      await new Promise(resolve => setTimeout(resolve, 50));
    });

    afterEach(() => {
      container.remove();
    });

    it('should update aria-labelledby on the button when aria-labelledby attribute changes', async () => {
      const newLabel = document.createElement('span');
      newLabel.id = 'new-label';
      newLabel.textContent = 'This is a new label';
      document.body.appendChild(newLabel);

      el.setAttribute('aria-labelledby', 'new-label');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).not.to.have.attribute('aria-labelledby');
      expect(button.ariaLabelledByElements).to.deep.equal([newLabel]);

      newLabel.remove();
    });

    it('should update aria-describedby on the button when aria-describedby attribute changes', async () => {
      const newDescription = document.createElement('span');
      newDescription.id = 'new-description';
      newDescription.textContent = 'This is a new description';
      document.body.appendChild(newDescription);

      el.setAttribute('aria-describedby', 'new-description');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).not.to.have.attribute('aria-describedby');
      expect(button.ariaDescribedByElements).to.deep.equal([newDescription]);

      newDescription.remove();
    });

    it('should update aria references after multiple attribute changes', async () => {
      const newLabel = document.createElement('span');
      newLabel.id = 'reconnect-label';
      newLabel.textContent = 'Reconnect Label';
      document.body.appendChild(newLabel);

      el.setAttribute('aria-labelledby', 'reconnect-label');
      await new Promise(resolve => setTimeout(resolve, 50));

      const anotherLabel = document.createElement('span');
      anotherLabel.id = 'another-reconnect-label';
      anotherLabel.textContent = 'Another Label';
      document.body.appendChild(anotherLabel);

      el.setAttribute('aria-labelledby', 'another-reconnect-label');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(el).not.to.have.attribute('aria-labelledby');
      expect(button.ariaLabelledByElements).to.deep.equal([anotherLabel]);

      newLabel.remove();
      anotherLabel.remove();
    });
  });
});
