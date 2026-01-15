import { fixture } from '@sl-design-system/vitest-browser-lit';
import { page } from '@vitest/browser/context';
import { html } from 'lit';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { BreadcrumbItem } from './breadcrumb-item.js';
import { Breadcrumbs } from './breadcrumbs.js';

describe('sl-breadcrumbs', () => {
  let el: Breadcrumbs;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-breadcrumbs>
          <a href="/docs">Docs</a>
          <a href="/docs/getting-started">Getting Started</a>
          <a href="/docs/getting-started/developers">Developers</a>
        </sl-breadcrumbs>
      `);
    });

    it('should have a navigation role', () => {
      expect(el).to.have.attribute('role', 'navigation');
    });

    it('should have an aria label', () => {
      expect(el).to.have.attribute('aria-label', 'Breadcrumb trail');
    });

    it('should not be inverted', () => {
      expect(el).not.to.have.attribute('inverted');
      expect(el.inverted).to.be.undefined;
    });

    it('should be inverted when set', async () => {
      el.inverted = true;
      await el.updateComplete;

      expect(el).to.have.attribute('inverted');
    });

    it('should render a list of breadcrumbs', () => {
      const listItems = Array.from(el.renderRoot.querySelectorAll('ul > li'));

      expect(listItems).to.have.length(4);
      expect(listItems.at(0)).to.have.class('home');
    });

    it('should render a home link', () => {
      const homeLink = el.renderRoot.querySelector('a')!;

      expect(homeLink).to.exist;
      expect(homeLink).to.have.attribute('href', '/');
      expect(homeLink).to.have.trimmed.text('Home');
      expect(homeLink.querySelector('sl-icon')).to.have.attribute('name', 'home-blank');
    });

    it('should not render a home link when noHome is set', async () => {
      el.noHome = true;
      await el.updateComplete;

      expect(el.renderRoot.querySelector('li.home')).not.to.exist;
    });

    it('should support a custom home link', async () => {
      el.homeUrl = '/custom-home';
      await el.updateComplete;

      expect(el.renderRoot.querySelector('li.home > a')).to.have.attribute('href', '/custom-home');
    });

    it('should have a separator after each list item except the last one', () => {
      const separators = el.renderRoot.querySelectorAll('li + sl-icon[name="breadcrumb-separator"]');

      expect(separators).to.have.length(3);
    });

    it('should make the last link as the current page', () => {
      const link = el.renderRoot.querySelector('li:last-of-type a');

      expect(link).to.have.attribute('aria-current', 'page');
    });

    it('should not have an expand button', () => {
      expect(el.renderRoot.querySelector('sl-button')).not.to.exist;
    });
  });

  describe('custom aria label', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-breadcrumbs aria-label="Lorem ipsum">
          <a href="/docs">Docs</a>
          <a href="/docs/getting-started">Getting Started</a>
          <a href="/docs/getting-started/developers">Developers</a>
        </sl-breadcrumbs>
      `);
    });

    it('should not overwrite the custom aria label', () => {
      expect(el).to.have.attribute('aria-label', 'Lorem ipsum');
    });
  });

  describe('static no home default', () => {
    beforeEach(async () => {
      Breadcrumbs.noHome = true;

      el = await fixture(html`
        <sl-breadcrumbs>
          <a href="/docs">Docs</a>
          <a href="/docs/getting-started">Getting Started</a>
          <a href="/docs/getting-started/developers">Developers</a>
        </sl-breadcrumbs>
      `);
    });

    afterEach(() => (Breadcrumbs.noHome = false));

    it('should not have a home link', () => {
      expect(el.renderRoot.querySelector('li.home')).not.to.exist;
    });
  });

  describe('static home url default', () => {
    beforeEach(async () => {
      Breadcrumbs.homeUrl = '/custom-home';

      el = await fixture(html`
        <sl-breadcrumbs>
          <a href="/docs">Docs</a>
          <a href="/docs/getting-started">Getting Started</a>
          <a href="/docs/getting-started/developers">Developers</a>
        </sl-breadcrumbs>
      `);
    });

    afterEach(() => (Breadcrumbs.homeUrl = '/'));

    it('should not have a home link', () => {
      expect(el.renderRoot.querySelector('li.home a')).to.have.attribute('href', '/custom-home');
    });
  });

  describe('hideHomeLabel', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-breadcrumbs>
          <a href="/docs">Docs</a>
          <a href="/docs/getting-started">Getting Started</a>
          <a href="/docs/getting-started/developers">Developers</a>
        </sl-breadcrumbs>
      `);
    });

    it('should show the home label by default', () => {
      const homeLink = el.renderRoot.querySelector('li.home a')!;

      expect(homeLink).to.have.trimmed.text('Home');
      expect(homeLink.querySelector('sl-icon')).to.have.attribute('name', 'home-blank');
      expect(homeLink).not.to.have.attribute('aria-label');
    });

    it('should hide the home label when hideHomeLabel is set', async () => {
      el.hideHomeLabel = true;
      await el.updateComplete;

      const homeLink = el.renderRoot.querySelector('li.home a')!;

      expect(homeLink).to.have.trimmed.text('');
      expect(homeLink).to.have.attribute('aria-label', 'Home');
      expect(homeLink.querySelector('sl-icon')).to.have.attribute('name', 'home-blank');
    });

    it('should hide the home label when the attribute is set', async () => {
      el.setAttribute('hide-home-label', '');
      await el.updateComplete;

      const homeLink = el.renderRoot.querySelector('li.home a')!;

      expect(homeLink).to.have.trimmed.text('');
      expect(homeLink).to.have.attribute('aria-label', 'Home');
    });

    it('should show the home label again when hideHomeLabel is unset', async () => {
      el.hideHomeLabel = true;
      await el.updateComplete;

      let homeLink = el.renderRoot.querySelector('li.home a')!;
      expect(homeLink).to.have.trimmed.text('');

      el.hideHomeLabel = false;
      await el.updateComplete;

      homeLink = el.renderRoot.querySelector('li.home a')!;
      expect(homeLink).to.have.trimmed.text('Home');
      expect(homeLink).not.to.have.attribute('aria-label');
    });
  });

  describe('static hideHomeLabel default', () => {
    beforeEach(async () => {
      Breadcrumbs.hideHomeLabel = true;

      el = await fixture(html`
        <sl-breadcrumbs>
          <a href="/docs">Docs</a>
          <a href="/docs/getting-started">Getting Started</a>
          <a href="/docs/getting-started/developers">Developers</a>
        </sl-breadcrumbs>
      `);
    });

    afterEach(() => (Breadcrumbs.hideHomeLabel = false));

    it('should hide the home label when the static property is set', () => {
      const homeLink = el.renderRoot.querySelector('li.home a')!;

      expect(homeLink).to.have.trimmed.text('');
      expect(homeLink).to.have.attribute('aria-label', 'Home');
      expect(homeLink.querySelector('sl-icon')).to.have.attribute('name', 'home-blank');
    });
  });

  describe('collapsing behavior', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-breadcrumbs>
          <a href="javascript:void(0)">1</a>
          <a href="javascript:void(0)">2</a>
          <a href="javascript:void(0)">3</a>
          <a href="javascript:void(0)">4</a>
          <a href="javascript:void(0)">5</a>
          <a href="javascript:void(0)">6</a>
        </sl-breadcrumbs>
      `);
    });

    it('should have all links with separators in the DOM', () => {
      // Home link + 6 slotted links
      expect(el.renderRoot.querySelectorAll('a')).to.have.length(7);

      // Separator after home link, button and 2 visible links
      expect(el.renderRoot.querySelectorAll('sl-icon[name="breadcrumb-separator"]')).to.have.length(4);
    });

    it('should only show the last 3 breadcrumbs', () => {
      const children = Array.from(el.renderRoot.querySelectorAll('li > *'));

      expect(children).to.have.length(6);
      expect(children[0]).to.have.trimmed.text('Home');
      expect(children[1]).to.match('sl-button');
      expect(children[2]).to.match('sl-popover');
      expect(children[3]).to.have.trimmed.text('4');
      expect(children[4]).to.have.trimmed.text('5');
      expect(children[5]).to.have.trimmed.text('6');
    });

    it('should have an expand button to show the rest of the breadcrumbs', () => {
      const button = el.renderRoot.querySelector('sl-button'),
        menuItems = Array.from(el.renderRoot.querySelectorAll('sl-popover a') ?? []);

      expect(button).to.exist;
      expect(button).to.have.attribute('fill', 'ghost');
      expect(button?.querySelector('sl-icon')).to.have.attribute('name', 'ellipsis');

      expect(menuItems).to.have.length(3);
      expect(menuItems[0]).to.have.text('1');
      expect(menuItems[1]).to.have.text('2');
      expect(menuItems[2]).to.have.text('3');
    });
  });

  describe('on mobile', () => {
    beforeEach(async () => {
      // iPhone 15 portrait
      await page.viewport(393, 852);

      el = await fixture(html`
        <sl-breadcrumbs>
          <a href="javascript:void(0)">1</a>
          <a href="javascript:void(0)">2</a>
          <a href="javascript:void(0)">3</a>
          <a href="javascript:void(0)">4</a>
          <a href="javascript:void(0)">5</a>
          <a href="javascript:void(0)">6</a>
        </sl-breadcrumbs>
      `);

      // Give the resize observer time to process
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should only show the home icon', () => {
      const homeLink = el.renderRoot.querySelector('a')!;

      expect(homeLink).to.contain('sl-icon');
      expect(homeLink).not.to.have.text('Home');
    });

    it('should only show the last 2 breadcrumbs', () => {
      const children = Array.from(el.renderRoot.querySelectorAll('li > *'));

      expect(children).to.have.length(5);
      expect(children[0]).to.have.trimmed.text('');
      expect(children[1]).to.match('sl-button');
      expect(children[2]).to.match('sl-popover');
      expect(children[3]).to.have.trimmed.text('5');
      expect(children[4]).to.have.trimmed.text('6');
    });

    it('should show all hidden links in the popover', () => {
      const button = el.renderRoot.querySelector('sl-button'),
        menuItems = Array.from(el.renderRoot.querySelectorAll('sl-popover a') ?? []);

      expect(button).to.exist;
      expect(button).to.have.attribute('fill', 'ghost');
      expect(button?.querySelector('sl-icon')).to.have.attribute('name', 'ellipsis');

      expect(menuItems).to.have.length(4);
      expect(menuItems[0]).to.have.text('1');
      expect(menuItems[1]).to.have.text('2');
      expect(menuItems[2]).to.have.text('3');
      expect(menuItems[3]).to.have.text('4');
    });
  });
  describe('breadcrumb items with click delegation', () => {
    let el: Breadcrumbs;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-breadcrumbs>
          <sl-breadcrumb-item>1</sl-breadcrumb-item>
          <sl-breadcrumb-item>2</sl-breadcrumb-item>
          <sl-breadcrumb-item>3</sl-breadcrumb-item>
          <sl-breadcrumb-item>4</sl-breadcrumb-item>
          <sl-breadcrumb-item>5</sl-breadcrumb-item>
          <sl-breadcrumb-item>6</sl-breadcrumb-item>
        </sl-breadcrumbs>
      `);
    });

    it('should render breadcrumb items in the popover', () => {
      const menuItems = Array.from(el.renderRoot.querySelectorAll('sl-popover a') ?? []);

      expect(menuItems).to.have.length(3);
      expect(menuItems[0]).to.have.text('1');
      expect(menuItems[1]).to.have.text('2');
      expect(menuItems[2]).to.have.text('3');
    });

    it('should have href="#" for visible breadcrumb items', () => {
      const visibleLinks = Array.from(el.renderRoot.querySelectorAll('li:not(.home):not(.more-menu) a'));

      visibleLinks.forEach(link => {
        expect(link).to.have.attribute('href', '#');
      });
    });

    it('should have href="#" for collapsed breadcrumb items in popover', () => {
      const popoverLinks = Array.from(el.renderRoot.querySelectorAll('sl-popover a'));

      popoverLinks.forEach(link => {
        expect(link).to.have.attribute('href', '#');
      });
    });

    it('should call click on the breadcrumb item when visible link is clicked', async () => {
      const items = el.querySelectorAll('sl-breadcrumb-item');
      let clickedItem: BreadcrumbItem | null = null;

      items.forEach(item => {
        item.addEventListener('click', () => {
          clickedItem = item;
        });
      });

      const visibleLinks = Array.from(el.renderRoot.querySelectorAll('li:not(.home):not(.more-menu) a'));
      const firstVisibleLink = visibleLinks[0] as HTMLAnchorElement;

      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      firstVisibleLink.dispatchEvent(clickEvent);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(clickEvent.defaultPrevented).to.be.true;
      expect(clickedItem).to.equal(items[3]);
    });

    it('should prevent default and call click on breadcrumb item when popover link is clicked', async () => {
      const items = el.querySelectorAll<BreadcrumbItem>('sl-breadcrumb-item');
      let clickedItem: BreadcrumbItem | null = null;

      items.forEach(item => {
        item.addEventListener('click', () => {
          clickedItem = item;
        });
      });

      const popoverLinks = Array.from(el.renderRoot.querySelectorAll('sl-popover a'));
      const firstPopoverLink = popoverLinks[0] as HTMLAnchorElement;

      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      firstPopoverLink.dispatchEvent(clickEvent);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(clickEvent.defaultPrevented).to.be.true;
      expect(clickedItem).to.equal(items[0]);
    });

    it('should call click on breadcrumb item when Enter key is pressed on visible link', async () => {
      const items = el.querySelectorAll<BreadcrumbItem>('sl-breadcrumb-item');
      let clickedItem: BreadcrumbItem | null = null;

      items.forEach(item => {
        item.addEventListener('click', () => {
          clickedItem = item;
        });
      });

      const visibleLinks = Array.from(el.renderRoot.querySelectorAll('li:not(.home):not(.more-menu) a'));
      const firstVisibleLink = visibleLinks[0] as HTMLAnchorElement;

      const keyEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
      firstVisibleLink.dispatchEvent(keyEvent);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(keyEvent.defaultPrevented).to.be.true;
      expect(clickedItem).to.equal(items[3]);
    });

    it('should call click on breadcrumb item when Space key is pressed on visible link', async () => {
      const items = el.querySelectorAll<BreadcrumbItem>('sl-breadcrumb-item');
      let clickedItem: BreadcrumbItem | null = null;

      items.forEach(item => {
        item.addEventListener('click', () => {
          clickedItem = item;
        });
      });

      const visibleLinks = Array.from(el.renderRoot.querySelectorAll('li:not(.home):not(.more-menu) a'));
      const firstVisibleLink = visibleLinks[0] as HTMLAnchorElement;

      const keyEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
      firstVisibleLink.dispatchEvent(keyEvent);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(keyEvent.defaultPrevented).to.be.true;
      expect(clickedItem).to.equal(items[3]);
    });

    it('should call click on breadcrumb item when Enter key is pressed on popover link', async () => {
      const items = el.querySelectorAll<BreadcrumbItem>('sl-breadcrumb-item');
      let clickedItem: BreadcrumbItem | null = null;

      items.forEach(item => {
        item.addEventListener('click', () => {
          clickedItem = item;
        });
      });

      const popoverLinks = Array.from(el.renderRoot.querySelectorAll('sl-popover a'));
      const firstPopoverLink = popoverLinks[0] as HTMLAnchorElement;

      const keyEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
      firstPopoverLink.dispatchEvent(keyEvent);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(keyEvent.defaultPrevented).to.be.true;
      expect(clickedItem).to.equal(items[0]);
    });

    it('should call click on breadcrumb item when Space key is pressed on popover link', async () => {
      const items = el.querySelectorAll<BreadcrumbItem>('sl-breadcrumb-item');
      let clickedItem: BreadcrumbItem | null = null;

      items.forEach(item => {
        item.addEventListener('click', () => {
          clickedItem = item;
        });
      });

      const popoverLinks = Array.from(el.renderRoot.querySelectorAll('sl-popover a'));
      const firstPopoverLink = popoverLinks[0] as HTMLAnchorElement;

      const keyEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
      firstPopoverLink.dispatchEvent(keyEvent);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(keyEvent.defaultPrevented).to.be.true;
      expect(clickedItem).to.equal(items[0]);
    });
  });

  describe('collapsing with mixed elements', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-breadcrumbs>
          <a href="/1">1</a>
          <sl-breadcrumb-item>2</sl-breadcrumb-item>
          <a href="/3">3</a>
          <sl-breadcrumb-item>4</sl-breadcrumb-item>
          <a href="/5">5</a>
          <sl-breadcrumb-item>6</sl-breadcrumb-item>
        </sl-breadcrumbs>
      `);
    });

    it('should collapse mixed elements into popover', () => {
      const popoverLinks = Array.from(el.renderRoot.querySelectorAll('sl-popover a'));

      expect(popoverLinks).to.have.length(3);
      expect(popoverLinks[0]).to.have.text('1');
      expect(popoverLinks[0]).to.have.attribute('href', '/1');
      expect(popoverLinks[1]).to.have.text('2');
      expect(popoverLinks[1]).to.have.attribute('href', '#');
      expect(popoverLinks[2]).to.have.text('3');
      expect(popoverLinks[2]).to.have.attribute('href', '/3');
    });

    it('should show last 3 items with mixed types', () => {
      const visibleLinks = Array.from(el.renderRoot.querySelectorAll('li:not(.home):not(.more-menu) a'));

      expect(visibleLinks).to.have.length(3);
      expect(visibleLinks[0].textContent.trim()).to.equal('4');
      expect(visibleLinks[0]).to.have.attribute('href', '#');
      expect(visibleLinks[1].textContent.trim()).to.equal('5');
      expect(visibleLinks[1]).to.have.attribute('href', '/5');
      expect(visibleLinks[2].textContent.trim()).to.equal('6');
      expect(visibleLinks[2]).to.have.attribute('href', '#');
    });
  });
});
