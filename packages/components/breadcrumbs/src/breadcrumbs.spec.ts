import { expect, fixture } from '@open-wc/testing';
import { Icon } from '@sl-design-system/icon';
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

      expect(el.renderRoot.querySelector('a')).not.to.exist;
    });

    it('should support a custom home link', async () => {
      el.homeUrl = '/custom-home';
      await el.updateComplete;

      expect(el.renderRoot.querySelector('a')).to.have.attribute('href', '/custom-home');
    });

    it('should have a separator after the home link', () => {
      const separator = el.renderRoot.querySelector('a + sl-icon')!;

      expect(separator).to.exist;
      expect(separator).to.have.attribute('name', 'breadcrumb-separator');
    });

    it('should render icon separators between the links', () => {
      expect(
        Array.from(el.querySelectorAll('a:not(:last-of-type)'))
          .map(link => link.nextElementSibling as Icon)
          .every(icon => icon.tagName === 'SL-ICON' && icon.name === 'breadcrumb-separator')
      ).to.be.true;

      expect(el.querySelector('a[aria-current="page"]')).to.match(':last-child');
    });

    it('should not have a expand button', () => {
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
      expect(el.renderRoot.querySelector('a')).not.to.exist;
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
      expect(el.renderRoot.querySelector('a')).to.have.attribute('href', '/custom-home');
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
      expect(el.querySelectorAll('a')).to.have.length(6);
      expect(el.querySelectorAll('sl-icon')).to.have.length(5);
    });

    it('should only show the last 3 breadcrumbs', () => {
      const children = Array.from(el.children);

      expect(children).to.have.length(5 + 5 + 1);
      expect(children[0]).to.not.be.displayed; // <a>1</a>
      expect(children[1]).to.not.be.displayed; // <sl-icon>
      expect(children[2]).to.not.be.displayed; // <a>2</a>
      expect(children[3]).to.not.be.displayed; // <sl-icon>
      expect(children[4]).to.not.be.displayed; // <a>3</a>
      expect(children[5]).to.be.displayed; // <sl-icon>
      expect(children[6]).to.be.displayed; // <a>4</a>
      expect(children[7]).to.be.displayed; // <sl-icon>
      expect(children[8]).to.be.displayed; // <a>5</a>
      expect(children[9]).to.be.displayed; // <sl-icon>
      expect(children[10]).to.be.displayed; // <a>6</a>
    });

    it('should have a expand button to show the rest of the breadcrumbs', () => {
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
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should only show the home icon', () => {
      const homeLink = el.renderRoot.querySelector('a')!;

      expect(homeLink).to.contain('sl-icon');
      expect(homeLink).not.to.have.text('Home');
    });

    it('should only show the last 2 breadcrumbs', () => {
      const children = Array.from(el.children);

      expect(children).to.have.length(5 + 5 + 1);
      expect(children[0]).to.not.be.displayed; // <a>1</a>
      expect(children[1]).to.not.be.displayed; // <sl-icon>
      expect(children[2]).to.not.be.displayed; // <a>2</a>
      expect(children[3]).to.not.be.displayed; // <sl-icon>
      expect(children[4]).to.not.be.displayed; // <a>3</a>
      expect(children[5]).to.not.be.displayed; // <sl-icon>
      expect(children[6]).to.not.be.displayed; // <a>4</a>
      expect(children[7]).to.be.displayed; // <sl-icon>
      expect(children[8]).to.be.displayed; // <a>5</a>
      expect(children[9]).to.be.displayed; // <sl-icon>
      expect(children[10]).to.be.displayed; // <a>6</a>
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
