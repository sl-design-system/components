import { expect, fixture } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import { html } from 'lit';
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
      expect(homeLink).to.have.text('Home');
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
      expect(button).to.have.attribute('fill', 'link');
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
      await setViewport({ width: 393, height: 852 });

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
      expect(button).to.have.attribute('fill', 'link');
      expect(button?.querySelector('sl-icon')).to.have.attribute('name', 'ellipsis');

      expect(menuItems).to.have.length(4);
      expect(menuItems[0]).to.have.text('1');
      expect(menuItems[1]).to.have.text('2');
      expect(menuItems[2]).to.have.text('3');
      expect(menuItems[3]).to.have.text('4');
    });
  });
});
