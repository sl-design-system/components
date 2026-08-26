import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { type Link } from './link.js';
import './register.js';

describe('sl-link', () => {
  let anchor: HTMLAnchorElement, el: Link;

  describe('internal links by default', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-link>
          <a href="/dashboard">Dashboard</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
    });

    it('should not force opening in a new tab', () => {
      expect(anchor).not.to.have.attribute('target');
    });

    it('should not set rel when the link does not open in a new tab', () => {
      expect(anchor).not.to.have.attribute('rel');
    });
  });

  describe('reversed state', () => {
    it('should not be reversed by default', async () => {
      el = await fixture(html`<sl-link><a href="/dashboard">Dashboard</a></sl-link>`);

      expect(el.reversed).to.be.false;
      expect(el).not.to.match(':state(reversed)');
    });

    it('should be reversed when the icon is positioned at the start', async () => {
      el = await fixture(html`
        <sl-link icon-position="start"><a href="/dashboard">Dashboard</a></sl-link>
      `);

      expect(el.reversed).to.be.true;
      expect(el).to.match(':state(reversed)');
    });

    it('should not be reversed when the icon is hidden', async () => {
      el = await fixture(html`
        <sl-link icon-position="start" no-icon><a href="/dashboard">Dashboard</a></sl-link>
      `);

      expect(el.reversed).to.be.false;
      expect(el).not.to.match(':state(reversed)');
    });

    it('should not be reversed for external links', async () => {
      el = await fixture(html`
        <sl-link icon-position="start"><a href="https://example.com">Example</a></sl-link>
      `);

      expect(el.reversed).to.be.false;
      expect(el).not.to.match(':state(reversed)');
    });

    it('should update the state when iconPosition changes', async () => {
      el = await fixture(html`<sl-link><a href="/dashboard">Dashboard</a></sl-link>`);

      expect(el).not.to.match(':state(reversed)');

      el.iconPosition = 'start';
      await el.updateComplete;

      expect(el).to.match(':state(reversed)');

      el.iconPosition = 'end';
      await el.updateComplete;

      expect(el).not.to.match(':state(reversed)');
    });

    it('should update the state when noIcon changes', async () => {
      el = await fixture(html`
        <sl-link icon-position="start"><a href="/dashboard">Dashboard</a></sl-link>
      `);

      expect(el).to.match(':state(reversed)');

      el.noIcon = true;
      await el.updateComplete;

      expect(el).not.to.match(':state(reversed)');
    });
  });

  describe('external links', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-link>
          <a href="https://example.com">External</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
    });

    it('should always open in a new tab', () => {
      expect(anchor).to.have.attribute('target', '_blank');
    });

    it('should set rel when missing', () => {
      expect(anchor).to.have.attribute('rel', 'noopener noreferrer');
    });

    it('should add a "opens in new tab" span when missing', () => {
      const srOnly = anchor.querySelector('span.sl-link-new-tab');

      expect(srOnly).to.exist;
      expect(srOnly?.textContent).to.include('opens in a new tab');
    });

    it('should render an indicator icon', () => {
      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.exist;
      expect(icon).to.have.attribute('name', 'arrow-up-right-from-square');
    });
  });

  describe('internal links that open in a new tab', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-link>
          <a href="/reports" target="_blank">Reports</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
    });

    it('should keep target as _blank and set rel when missing', () => {
      expect(anchor).to.have.attribute('target', '_blank');
      expect(anchor).to.have.attribute('rel', 'noopener noreferrer');
    });

    it('should treat absolute same-origin _blank links as internal-new-tab', async () => {
      const href = `${globalThis.location.origin}/reports`;

      el = await fixture(html`
        <sl-link>
          <a href=${href} target="_blank">Reports</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
      await el.updateComplete;

      expect(anchor).to.have.attribute('target', '_blank');
      expect(el.linkType).to.equal('internal-new-tab');

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.have.attribute('name', 'square-arrow-up-right');
    });
  });

  describe('existing rel and screen reader text', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-link>
          <a href="https://example.com" rel="external nofollow">External</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
    });

    it('should not override existing rel', () => {
      expect(anchor).to.have.attribute('rel', 'external nofollow');
    });

    it('should add screen reader only text even with existing rel', () => {
      const srOnly = anchor.querySelector('span.sl-link-new-tab');

      expect(srOnly).to.exist;
    });
  });

  describe('type override', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-link type="internal">
          <a href="https://example.com">Treat as internal</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
    });

    it('should respect an explicit internal type override', () => {
      expect(anchor).not.to.have.attribute('target', '_blank');
    });
  });

  describe('type override to external', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-link type="external">
          <a href="/internal-page">Force external</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
    });

    it('should force external behavior on internal link', () => {
      expect(anchor).to.have.attribute('target', '_blank');
    });
  });

  describe('type override to internal-new-tab', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-link type="internal-new-tab">
          <a href="/internal-page">Force new tab</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
    });

    it('should force internal-new-tab behavior on internal link', () => {
      expect(anchor).to.have.attribute('target', '_blank');
    });
  });

  describe('fill variants', () => {
    it('should apply solid fill by default', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="/page">Link</a>
        </sl-link>
      `);

      expect(el).not.to.have.attribute('fill');
    });

    it('should apply outline fill when set', async () => {
      el = await fixture(html`
        <sl-link fill="outline">
          <a href="/page">Link</a>
        </sl-link>
      `);

      expect(el).to.have.attribute('fill', 'outline');
    });

    it('should apply ghost fill when set', async () => {
      el = await fixture(html`
        <sl-link fill="ghost">
          <a href="/page">Link</a>
        </sl-link>
      `);

      expect(el).to.have.attribute('fill', 'ghost');
    });
  });

  describe('relative path patterns', () => {
    it('should treat ./ paths as internal', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="./page">Relative</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;

      expect(anchor).not.to.have.attribute('target', '_blank');
    });

    it('should treat ../ paths as internal', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="../parent/page">Parent relative</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;

      expect(anchor).not.to.have.attribute('target', '_blank');
    });

    it('should treat hash links as internal', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="#section">Hash link</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;

      expect(anchor).not.to.have.attribute('target', '_blank');
    });

    it('should treat same-origin protocol-relative links as internal', async () => {
      const host = new URL(globalThis.location.href).host;

      el = await fixture(html`
        <sl-link>
          <a href=${`//${host}/page`}>Protocol-relative</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;

      expect(anchor).not.to.have.attribute('target', '_blank');
    });

    it('should treat cross-origin protocol-relative links as external', async () => {
      const currentUrl = new URL(globalThis.location.href);
      // A fixed host, because deriving one from the current hostname produces an unparseable URL
      // when the test server binds to an IP address (`alt-127.0.0.1` parses as a malformed IPv4).
      const protocolRelativeUrl = '//example.com/page';

      expect(new URL(`${currentUrl.protocol}${protocolRelativeUrl}`).origin).not.to.equal(
        currentUrl.origin
      );

      el = await fixture(html`
        <sl-link>
          <a href=${protocolRelativeUrl}>Protocol-relative external</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;

      expect(anchor).to.have.attribute('target', '_blank');
    });
  });

  describe('non-http protocols', () => {
    it('should treat mailto: links as email type', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="mailto:test@example.com">Email</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
      await el.updateComplete;

      expect(el.linkType).to.equal('email');
      expect(anchor).not.to.have.attribute('target');
    });

    it('should remove target="_blank" from mailto: links', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="mailto:test@example.com" target="_blank">Email</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
      await el.updateComplete;

      expect(el.linkType).to.equal('email');
      expect(anchor).not.to.have.attribute('target');
    });

    it('should show envelope icon for email links', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="mailto:test@example.com">Email</a>
        </sl-link>
      `);

      await el.updateComplete;

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.exist;
      expect(icon).to.have.attribute('name', 'envelope');
    });

    it('should treat tel: links as tel type', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="tel:+1234567890">Phone</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
      await el.updateComplete;

      expect(el.linkType).to.equal('tel');
      expect(anchor).not.to.have.attribute('target');
    });

    it('should remove target="_blank" from tel: links', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="tel:+1234567890" target="_blank">Phone</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
      await el.updateComplete;

      expect(el.linkType).to.equal('tel');
      expect(anchor).not.to.have.attribute('target');
    });

    it('should show mobile icon for tel links', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="tel:+1234567890">Phone</a>
        </sl-link>
      `);

      await el.updateComplete;

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.exist;
      expect(icon).to.have.attribute('name', 'mobile');
    });

    it('should not add sr-only text for email links', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="mailto:test@example.com">Email</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
      await el.updateComplete;

      const srOnly = anchor.querySelector('span.sl-link-new-tab');

      expect(srOnly).to.not.exist;
    });

    it('should not add sr-only text for tel links', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="tel:+1234567890">Phone</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
      await el.updateComplete;

      const srOnly = anchor.querySelector('span.sl-link-new-tab');

      expect(srOnly).to.not.exist;
    });
  });

  describe('empty href', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-link>
          <a href="">Empty href</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
    });

    it('should treat empty href as internal', () => {
      expect(anchor).not.to.have.attribute('target', '_blank');
    });
  });

  describe('type property changes', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-link>
          <a href="/page">Link</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
    });

    it('should update when type changes to external', async () => {
      el.type = 'external';
      await el.updateComplete;

      expect(anchor).to.have.attribute('target', '_blank');
    });

    it('should remove injected target when type changes back to internal', async () => {
      el.type = 'external';
      await el.updateComplete;

      el.type = 'internal';
      await el.updateComplete;

      expect(anchor).not.to.have.attribute('target');
    });

    it('should restore a consumer-supplied target when type changes back to internal', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="/page" target="_self">Link</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;

      el.type = 'external';
      await el.updateComplete;

      el.type = 'internal';
      await el.updateComplete;

      expect(anchor).to.have.attribute('target', '_self');
    });
  });

  describe('icon position', () => {
    it('should default to end position', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="/page">Link</a>
        </sl-link>
      `);

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.have.attribute('name', 'arrow-right');
    });

    it('should show left arrow when position is start', async () => {
      el = await fixture(html`
        <sl-link icon-position="start">
          <a href="/page">Link</a>
        </sl-link>
      `);

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(el).to.have.attribute('icon-position', 'start');
      expect(icon).to.have.attribute('name', 'arrow-left');
    });

    it('should ignore icon-position for external links', async () => {
      el = await fixture(html`
        <sl-link icon-position="start">
          <a href="https://example.com">External</a>
        </sl-link>
      `);

      await el.updateComplete;

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.have.attribute('name', 'arrow-up-right-from-square');
    });

    it('should ignore icon-position for internal-new-tab links', async () => {
      el = await fixture(html`
        <sl-link icon-position="start">
          <a href="/page" target="_blank">New tab</a>
        </sl-link>
      `);

      await el.updateComplete;

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.have.attribute('name', 'square-arrow-up-right');
    });
  });

  describe('indicator icon changes', () => {
    it('should show arrow-right for internal links', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="/page">Internal</a>
        </sl-link>
      `);

      await el.updateComplete;

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.have.attribute('name', 'arrow-right');
    });

    it('should show square-arrow-up-right for internal-new-tab links', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="/page" target="_blank">Internal new tab</a>
        </sl-link>
      `);

      await el.updateComplete;

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.have.attribute('name', 'square-arrow-up-right');
    });

    it('should show arrow-up-right-from-square for external links', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="https://example.com">External</a>
        </sl-link>
      `);

      await el.updateComplete;

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.have.attribute('name', 'arrow-up-right-from-square');
    });
  });

  describe('reversed state', () => {
    it('should set the reversed state for internal start icon position', async () => {
      el = await fixture(html`
        <sl-link icon-position="start">
          <a href="/page">Link</a>
        </sl-link>
      `);

      expect(el).to.match(':state(reversed)');
    });

    it('should not set the reversed state for external links', async () => {
      el = await fixture(html`
        <sl-link icon-position="start">
          <a href="https://example.com">External</a>
        </sl-link>
      `);

      expect(el).not.to.match(':state(reversed)');
    });

    it('should remove the reversed state when no-icon is enabled', async () => {
      el = await fixture(html`
        <sl-link icon-position="start">
          <a href="/page">Link</a>
        </sl-link>
      `);

      el.noIcon = true;
      await el.updateComplete;

      expect(el).not.to.match(':state(reversed)');
    });
  });

  describe('screen reader text for new tab links', () => {
    it('should not add sl-link-new-tab span if one already exists', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="https://example.com">
            External
            <span class="sl-link-new-tab">(custom text)</span>
          </a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
      const srOnlySpans = anchor.querySelectorAll('span.sl-link-new-tab');

      expect(srOnlySpans).to.have.lengthOf(1);
      expect(srOnlySpans[0].textContent).to.include('custom text');
    });

    it('should add sl-link-new-tab span for internal-new-tab links', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="/page" target="_blank">New tab</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
      const srOnly = anchor.querySelector('span.sl-link-new-tab');

      expect(srOnly).to.exist;
      expect(srOnly?.textContent).to.include('opens in a new tab');
    });
  });

  describe('noIcon property', () => {
    it('should show icon for internal links', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="/page">Internal link</a>
        </sl-link>
      `);

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.exist;
      expect(icon).to.have.attribute('name', 'arrow-right');
    });

    it('should hide icon when noIcon is true for internal links', async () => {
      el = await fixture(html`
        <sl-link no-icon>
          <a href="/page">Internal link</a>
        </sl-link>
      `);

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.not.exist;
    });

    it('should still show icon when noIcon is true for internal-new-tab links', async () => {
      el = await fixture(html`
        <sl-link no-icon>
          <a href="/page" target="_blank">New tab link</a>
        </sl-link>
      `);

      await el.updateComplete;

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.exist;
      expect(icon).to.have.attribute('name', 'square-arrow-up-right');
    });

    it('should still show icon when noIcon is true for external links', async () => {
      el = await fixture(html`
        <sl-link no-icon>
          <a href="https://example.com">External link</a>
        </sl-link>
      `);

      await el.updateComplete;

      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.exist;
      expect(icon).to.have.attribute('name', 'arrow-up-right-from-square');
    });

    it('should toggle icon visibility when noIcon changes for internal links', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="/page">Internal link</a>
        </sl-link>
      `);

      let icon = el.renderRoot.querySelector('sl-icon');
      expect(icon).to.exist;

      el.noIcon = true;
      await el.updateComplete;

      icon = el.renderRoot.querySelector('sl-icon');
      expect(icon).to.not.exist;

      el.noIcon = false;
      await el.updateComplete;

      icon = el.renderRoot.querySelector('sl-icon');
      expect(icon).to.exist;
    });
  });

  describe('hideIcon state', () => {
    it('should not have hideIcon state by default', async () => {
      el = await fixture(html`<sl-link><a href="/dashboard">Dashboard</a></sl-link>`);

      expect(el.hideIcon).to.be.false;
      expect(el).not.to.match(':state(hide-icon)');
    });

    it('should have hideIcon state when noIcon is true for internal links', async () => {
      el = await fixture(html`<sl-link no-icon><a href="/dashboard">Dashboard</a></sl-link>`);

      expect(el.hideIcon).to.be.true;
      expect(el).to.match(':state(hide-icon)');
    });

    it('should not have hideIcon state when noIcon is true for external links', async () => {
      el = await fixture(html`
        <sl-link no-icon><a href="https://example.com">External</a></sl-link>
      `);

      expect(el.hideIcon).to.be.false;
      expect(el).not.to.match(':state(hide-icon)');
    });

    it('should not have hideIcon state when noIcon is true for internal-new-tab links', async () => {
      el = await fixture(html`
        <sl-link no-icon><a href="/page" target="_blank">New tab</a></sl-link>
      `);

      expect(el.hideIcon).to.be.false;
      expect(el).not.to.match(':state(hide-icon)');
    });

    it('should not have hideIcon state when noIcon is true for email links', async () => {
      el = await fixture(html`
        <sl-link no-icon><a href="mailto:test@example.com">Email</a></sl-link>
      `);

      expect(el.hideIcon).to.be.false;
      expect(el).not.to.match(':state(hide-icon)');
    });

    it('should not have hideIcon state when noIcon is true for tel links', async () => {
      el = await fixture(html` <sl-link no-icon><a href="tel:+1234567890">Phone</a></sl-link> `);

      expect(el.hideIcon).to.be.false;
      expect(el).not.to.match(':state(hide-icon)');
    });

    it('should update state when noIcon changes', async () => {
      el = await fixture(html`<sl-link><a href="/dashboard">Dashboard</a></sl-link>`);

      expect(el).not.to.match(':state(hide-icon)');

      el.noIcon = true;
      await el.updateComplete;

      expect(el).to.match(':state(hide-icon)');

      el.noIcon = false;
      await el.updateComplete;

      expect(el).not.to.match(':state(hide-icon)');
    });

    it('should update state when type changes from internal to external', async () => {
      el = await fixture(html`<sl-link no-icon><a href="/page">Internal</a></sl-link>`);

      expect(el).to.match(':state(hide-icon)');

      el.type = 'external';
      await el.updateComplete;

      expect(el).not.to.match(':state(hide-icon)');
    });

    it('should update state when type changes from external to internal', async () => {
      el = await fixture(html`
        <sl-link no-icon type="external"><a href="/page">Override</a></sl-link>
      `);

      expect(el).not.to.match(':state(hide-icon)');

      el.type = 'internal';
      await el.updateComplete;

      expect(el).to.match(':state(hide-icon)');
    });

    it('should not have hideIcon state when noIcon is false even for internal links', async () => {
      el = await fixture(html`<sl-link><a href="/dashboard">Dashboard</a></sl-link>`);

      expect(el.hideIcon).to.be.false;
      expect(el).not.to.match(':state(hide-icon)');
    });
  });
});
