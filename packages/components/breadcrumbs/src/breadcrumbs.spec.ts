import { expect, fixture } from '@open-wc/testing';
import { Icon } from '@sl-design-system/icon';
import { setViewport } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
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
          <span>Developers</span>
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
      expect(separator).to.have.attribute('name', 'slash-forward');
    });

    it('should render icon separators between the links', () => {
      expect(
        Array.from(el.querySelectorAll('a'))
          .map(link => link.nextElementSibling as Icon)
          .every(icon => icon.tagName === 'SL-ICON' && icon.name === 'slash-forward')
      ).to.be.true;

      expect(el.querySelector('span')).to.match(':last-child');
    });

    it('should not have a menu button', () => {
      expect(el.renderRoot.querySelector('sl-menu-button')).not.to.exist;
    });
  });

  describe('static no home default', () => {
    beforeEach(async () => {
      Breadcrumbs.noHome = true;

      el = await fixture(html`
        <sl-breadcrumbs>
          <a href="/docs">Docs</a>
          <a href="/docs/getting-started">Getting Started</a>
          <span>Developers</span>
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
          <span>Developers</span>
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
          <span>6</span>
        </sl-breadcrumbs>
      `);
    });

    it('should have all links with separators in the DOM', () => {
      expect(el.querySelectorAll('a')).to.have.length(5);
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
      expect(children[10]).to.be.displayed; // <span>6</span>
    });

    it('should have a menu button to show the rest of the breadcrumbs', () => {
      const menuButton = el.renderRoot.querySelector('sl-menu-button'),
        menuItems = Array.from(menuButton?.querySelectorAll('sl-menu-item') ?? []);

      expect(menuButton).to.exist;
      expect(menuButton).to.have.attribute('fill', 'link');
      expect(menuButton?.querySelector('sl-icon')).to.have.attribute('name', 'ellipsis');

      expect(menuItems).to.have.length(3);
      expect(menuItems[0]).to.have.text('1');
      expect(menuItems[1]).to.have.text('2');
      expect(menuItems[2]).to.have.text('3');
    });

    it('should click the link when clicking on the menu item', () => {
      const onClick = spy();

      el.querySelector('a')?.addEventListener('click', onClick);

      const menuButton = el.renderRoot.querySelector<HTMLElement>('sl-menu-button');
      menuButton?.click();
      menuButton?.querySelector<HTMLElement>('sl-menu-item')?.click();

      expect(onClick).to.have.been.calledOnce;
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
          <span>6</span>
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
      expect(children[10]).to.be.displayed; // <span>6</span>
    });

    it('should show all hidden links in the menu', () => {
      const menuButton = el.renderRoot.querySelector('sl-menu-button'),
        menuItems = Array.from(menuButton?.querySelectorAll('sl-menu-item') ?? []);

      expect(menuButton).to.exist;
      expect(menuButton).to.have.attribute('fill', 'link');
      expect(menuButton?.querySelector('sl-icon')).to.have.attribute('name', 'ellipsis');

      expect(menuItems).to.have.length(4);
      expect(menuItems[0]).to.have.text('1');
      expect(menuItems[1]).to.have.text('2');
      expect(menuItems[2]).to.have.text('3');
      expect(menuItems[3]).to.have.text('4');
    });
  });
});
