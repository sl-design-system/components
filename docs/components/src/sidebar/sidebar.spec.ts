import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';

// Use dynamic import from dist to avoid CSS module resolution issues in browser tests
const { Sidebar } = await import('@sl-design-system/doc-components/sidebar/sidebar');

try {
  customElements.define('doc-sidebar', Sidebar);
} catch {
  /* empty */
}

describe('doc-sidebar', () => {
  let el: InstanceType<typeof Sidebar>;

  beforeEach(async () => {
    el = await fixture(html`<doc-sidebar></doc-sidebar>`);
  });

  describe('structure', () => {
    it('should render a header with a link', () => {
      const link = el.renderRoot.querySelector('header a');

      expect(link).to.exist;
      expect(link).to.have.attribute('href', '/');
      expect(link).to.have.attribute('aria-label', 'SL Design System');
    });

    it('should render logo images in the header', () => {
      const lightLogo = el.renderRoot.querySelector('header img.logo-light');
      const darkLogo = el.renderRoot.querySelector('header img.logo-dark');

      expect(lightLogo).to.exist;
      expect(lightLogo).to.have.attribute('src', '/assets/logo-black.svg');
      expect(darkLogo).to.exist;
      expect(darkLogo).to.have.attribute('src', '/assets/logo.svg');
    });

    it('should render a body section with a site-nav', () => {
      const body = el.renderRoot.querySelector('.body');
      const siteNav = el.renderRoot.querySelector('doc-site-nav');

      expect(body).to.exist;
      expect(siteNav).to.exist;
    });

    it('should render a slot inside the site-nav', () => {
      const slot = el.renderRoot.querySelector('doc-site-nav slot');

      expect(slot).to.exist;
    });

    it('should render a footer', () => {
      const footer = el.renderRoot.querySelector('footer');

      expect(footer).to.exist;
    });

    it('should render a GitHub link in the footer', () => {
      const link = el.renderRoot.querySelector('footer a');

      expect(link).to.exist;
      expect(link).to.have.attribute('href', 'https://github.com/sl-design-system/components');
      expect(link).to.have.attribute('target', '_blank');
      expect(link).to.have.attribute('rel', 'noopener noreferrer');
    });

    it('should render a GitHub icon in the footer link', () => {
      const icon = el.renderRoot.querySelector('footer a sl-icon');

      expect(icon).to.exist;
      expect(icon).to.have.attribute('name', 'fab-github');
    });

    it('should render a theme switch in the footer', () => {
      const themeSwitch = el.renderRoot.querySelector('footer doc-theme-switch');

      expect(themeSwitch).to.exist;
    });
  });

  describe('slotted content', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <doc-sidebar>
          <span class="test-content">Navigation content</span>
        </doc-sidebar>
      `);
    });

    it('should slot content into the site-nav', () => {
      const slot = el.renderRoot.querySelector('doc-site-nav slot') as HTMLSlotElement;
      const assignedNodes = slot?.assignedNodes({ flatten: true });

      expect(assignedNodes?.length).to.be.greaterThan(0);
    });
  });
});
