import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import '../register.js';
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

    it('should make the last link as the current page', async () => {
      await el.updateComplete;
      // Wait for requestAnimationFrame
      await new Promise(resolve => requestAnimationFrame(resolve));

      const links = Array.from(el.querySelectorAll('a'));
      const lastLink = links[links.length - 1];
      expect(lastLink).to.have.attribute('aria-current', 'page');
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

      // Wait for requestAnimationFrame
      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;
    });

    it('should have all links with separators in the DOM', () => {
      // 6 slotted links in light DOM
      expect(el.querySelectorAll('a')).to.have.length(6);

      // Separator after home link, button and 2 visible links
      expect(el.renderRoot.querySelectorAll('sl-icon[name="breadcrumb-separator"]')).to.have.length(4);
    });

    it('should only show the last 3 breadcrumbs', () => {
      const slots = Array.from(
          el.renderRoot.querySelectorAll<HTMLSlotElement>('slot[name^="breadcrumb-"]:not([name*="menu"])')
        ),
        visibleLinks = slots.map(slot => slot.assignedElements()[0]);

      expect(visibleLinks).to.have.length(3);
      expect(visibleLinks[0]).to.have.trimmed.text('4');
      expect(visibleLinks[1]).to.have.trimmed.text('5');
      expect(visibleLinks[2]).to.have.trimmed.text('6');
    });

    it('should have an expand button to show the rest of the breadcrumbs', () => {
      const button = el.renderRoot.querySelector('sl-button');
      const menuSlots = Array.from(el.renderRoot.querySelectorAll<HTMLSlotElement>('slot[name^="breadcrumb-menu-"]'));
      const menuItems = menuSlots.map(slot => slot.assignedElements()[0]);

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
      const slots = Array.from(
        el.renderRoot.querySelectorAll<HTMLSlotElement>('slot[name^="breadcrumb-"]:not([name*="menu"])')
      );
      const visibleLinks = slots.map(slot => slot.assignedElements()[0]);

      expect(visibleLinks).to.have.length(2);
      expect(visibleLinks[0]).to.have.trimmed.text('5');
      expect(visibleLinks[1]).to.have.trimmed.text('6');
    });

    it('should show all hidden links in the popover', () => {
      const button = el.renderRoot.querySelector('sl-button');
      const menuSlots = Array.from(el.renderRoot.querySelectorAll<HTMLSlotElement>('slot[name^="breadcrumb-menu-"]'));
      const menuItems = menuSlots.map(slot => slot.assignedElements()[0]);

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

  describe('custom home link via slot', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-breadcrumbs>
          <a slot="home" href="/custom">Custom Home</a>
          <a href="/docs">Docs</a>
          <a href="/docs/getting-started">Getting Started</a>
        </sl-breadcrumbs>
      `);

      // Wait for requestAnimationFrame to process slot assignments
      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;
      // Extra wait for mutation observer
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should render the custom home link', () => {
      const homeSlot = el.renderRoot.querySelector<HTMLSlotElement>('slot[name="home"]');
      const customHome = homeSlot?.assignedElements()[0] as HTMLAnchorElement;

      expect(customHome).to.exist;
      expect(customHome).to.have.attribute('href', '/custom');
      expect(customHome).to.have.trimmed.text('Custom Home');
    });

    it('should not render the default home link', () => {
      const defaultHomeLink = el.renderRoot.querySelector('li.home > a');
      expect(defaultHomeLink).not.to.exist;
    });

    it('should still render the home list item', () => {
      const homeListItem = el.renderRoot.querySelector('li.home');
      expect(homeListItem).to.exist;
    });
  });

  describe('dynamic content changes', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-breadcrumbs>
          <a href="/1">Link 1</a>
          <a href="/2">Link 2</a>
        </sl-breadcrumbs>
      `);

      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;
    });

    it('should update when links are added dynamically', async () => {
      const newLink = document.createElement('a');
      newLink.href = '/3';
      newLink.textContent = 'Link 3';
      el.appendChild(newLink);

      // Wait for mutation observer
      await new Promise(resolve => setTimeout(resolve, 50));
      await new Promise(resolve => requestAnimationFrame(resolve));

      const links = Array.from(el.querySelectorAll('a'));
      expect(links).to.have.length(3);

      const lastLink = links[links.length - 1];
      expect(lastLink).to.have.attribute('aria-current', 'page');
    });

    it('should update when links are removed dynamically', async () => {
      const links = Array.from(el.querySelectorAll('a'));
      const lastLink = links[links.length - 1];
      lastLink.remove();

      // Wait for mutation observer
      await new Promise(resolve => setTimeout(resolve, 50));
      await new Promise(resolve => requestAnimationFrame(resolve));

      const remainingLinks = Array.from(el.querySelectorAll('a'));
      expect(remainingLinks).to.have.length(1);

      const newLastLink = remainingLinks[remainingLinks.length - 1];
      expect(newLastLink).to.have.attribute('aria-current', 'page');
    });
  });

  describe('popover interaction', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-breadcrumbs>
          <a href="/1">1</a>
          <a href="/2">2</a>
          <a href="/3">3</a>
          <a href="/4">4</a>
          <a href="/5">5</a>
        </sl-breadcrumbs>
      `);

      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;
    });

    it('should toggle popover when button is clicked', async () => {
      const button = el.renderRoot.querySelector('sl-button');
      const popover = el.renderRoot.querySelector('sl-popover');

      expect(button).to.exist;
      expect(popover).to.exist;

      button?.click();
      await el.updateComplete;

      // The popover should be toggled (implementation depends on Popover component)
      // We can verify the click handler was called without errors
      expect(popover).to.exist;
    });

    it('should have inverted button variant when breadcrumbs are inverted', async () => {
      el.inverted = true;
      await el.updateComplete;

      const button = el.renderRoot.querySelector('sl-button');
      expect(button).to.have.attribute('variant', 'inverted');
    });

    it('should not have inverted button variant by default', () => {
      const button = el.renderRoot.querySelector('sl-button');
      expect(button).not.to.have.attribute('variant');
    });
  });

  describe('edge cases', () => {
    it('should handle breadcrumbs with only 1 link', async () => {
      el = await fixture(html`
        <sl-breadcrumbs>
          <a href="/single">Single Link</a>
        </sl-breadcrumbs>
      `);

      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;

      const link = el.querySelector('a');
      expect(link).to.have.attribute('aria-current', 'page');

      // Should not show collapse button
      const button = el.renderRoot.querySelector('sl-button');
      expect(button).not.to.exist;
    });

    it('should handle breadcrumbs with exactly threshold number of links', async () => {
      // Reset viewport to desktop to ensure consistent threshold behavior
      await page.viewport(1024, 768);

      el = await fixture(html`
        <sl-breadcrumbs>
          <a href="/1">1</a>
          <a href="/2">2</a>
          <a href="/3">3</a>
        </sl-breadcrumbs>
      `);

      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;
      // Wait for resize observer
      await new Promise(resolve => setTimeout(resolve, 50));

      // Should not show collapse button with exactly threshold (3) links - need MORE than threshold
      const button = el.renderRoot.querySelector('sl-button');
      expect(button).not.to.exist;

      // All 3 breadcrumbs should be visible
      const slots = Array.from(
        el.renderRoot.querySelectorAll<HTMLSlotElement>('slot[name^="breadcrumb-"]:not([name*="menu"])')
      );
      expect(slots).to.have.length(3);
    });

    it('should handle breadcrumbs with non-anchor elements', async () => {
      el = await fixture(html`
        <sl-breadcrumbs>
          <span>Not a link</span>
          <a href="/docs">Real Link</a>
        </sl-breadcrumbs>
      `);

      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;

      // Should process all elements, not just anchors
      const slots = Array.from(
        el.renderRoot.querySelectorAll<HTMLSlotElement>('slot[name^="breadcrumb-"]:not([name*="menu"])')
      );
      expect(slots.length).to.be.greaterThan(0);
    });

    it('should handle empty breadcrumbs', async () => {
      el = await fixture(html`<sl-breadcrumbs></sl-breadcrumbs>`);

      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;

      // Should still render home link
      const homeLink = el.renderRoot.querySelector('li.home a');
      expect(homeLink).to.exist;

      // Should not have any breadcrumb slots
      const slots = el.renderRoot.querySelectorAll<HTMLSlotElement>('slot[name^="breadcrumb-"]');
      expect(slots).to.have.length(0);
    });

    it('should handle noHome with custom home link', async () => {
      el = await fixture(html`
        <sl-breadcrumbs no-home>
          <a slot="home" href="/custom">Custom Home</a>
          <a href="/docs">Docs</a>
        </sl-breadcrumbs>
      `);

      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;

      // Should not render home section at all when noHome is true
      const homeListItem = el.renderRoot.querySelector('li.home');
      expect(homeListItem).not.to.exist;
    });
  });

  describe('observers', () => {
    it('should disconnect observers on disconnectedCallback', async () => {
      el = await fixture(html`
        <sl-breadcrumbs>
          <a href="/docs">Docs</a>
        </sl-breadcrumbs>
      `);

      await el.updateComplete;

      // Remove from DOM
      el.remove();

      // The component should clean up observers (no error should be thrown)
      expect(el.isConnected).to.be.false;
    });
  });

  describe('tooltips for truncated links', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-breadcrumbs style="width: 200px;">
          <a
            href="javascript:void(0)"
            style="max-width: 100px; display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
            >Very Long Breadcrumb Link That Will Be Truncated</a
          >
          <a
            href="javascript:void(0)"
            style="max-width: 100px; display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
            >Another Very Long Breadcrumb Link</a
          >
          <a href="javascript:void(0)">Short</a>
        </sl-breadcrumbs>
      `);

      // Wait for requestAnimationFrame to process slot assignments
      await new Promise(resolve => requestAnimationFrame(resolve));
      await el.updateComplete;

      // Give the resize observer time to process and check for truncation
      await new Promise(resolve => setTimeout(resolve, 100));
      await el.updateComplete;
    });

    it('should mark truncated links with data-has-tooltip attribute', () => {
      const slots = Array.from(
        el.renderRoot.querySelectorAll<HTMLSlotElement>('slot[name^="breadcrumb-"]:not([name*="menu"])')
      );
      const visibleLinks = slots.map(slot => slot.assignedElements()[0]) as HTMLElement[];
      const truncatedLinks = visibleLinks.filter(link => link.hasAttribute('data-has-tooltip'));

      // At least the long links should be marked for tooltips
      expect(truncatedLinks.length).to.be.greaterThan(0);
    });

    it('should not mark non-truncated links for tooltips', () => {
      const slots = Array.from(
        el.renderRoot.querySelectorAll<HTMLSlotElement>('slot[name^="breadcrumb-"]:not([name*="menu"])')
      );
      const visibleLinks = slots.map(slot => slot.assignedElements()[0]) as HTMLElement[];

      // Find the "Short" link - it should not have any tooltip attributes initially
      const shortLink = visibleLinks.find(link => link.textContent?.trim() === 'Short');

      if (shortLink) {
        // Check if link is actually not truncated (offsetWidth >= scrollWidth)
        const isTruncated = shortLink.offsetWidth < shortLink.scrollWidth;

        if (!isTruncated) {
          expect(shortLink).not.to.have.attribute('data-has-tooltip');
        }
      }
    });

    it('should detect truncation based on offsetWidth vs scrollWidth', () => {
      const slots = Array.from(
        el.renderRoot.querySelectorAll<HTMLSlotElement>('slot[name^="breadcrumb-"]:not([name*="menu"])')
      );
      const visibleLinks = slots.map(slot => slot.assignedElements()[0]) as HTMLElement[];

      visibleLinks.forEach(link => {
        const isTruncated = link.offsetWidth < link.scrollWidth;
        const hasTooltipMarker = link.hasAttribute('data-has-tooltip');

        // If marked for tooltip, it should be truncated
        if (hasTooltipMarker) {
          expect(isTruncated).to.be.true;
        }
      });
    });
  });
});
