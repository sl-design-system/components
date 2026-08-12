import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type Link } from './link.js';

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
      expect(el).not.to.have.attribute('has-indicator');
    });

    it('should not set rel when the link does not open in a new tab', () => {
      expect(anchor).not.to.have.attribute('rel');
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
      expect(el).to.have.attribute('has-indicator');
    });

    it('should set rel when missing', () => {
      expect(anchor).to.have.attribute('rel', 'noopener noreferrer');
    });

    it('should add a screen reader only span when missing', () => {
      const srOnly = anchor.querySelector('span.sr-only');

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

    it('should show the indicator icon', () => {
      expect(el).to.have.attribute('has-indicator');
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
      expect(el).to.have.attribute('has-indicator');

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
      const srOnly = anchor.querySelector('span.sr-only');

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
      expect(el).not.to.have.attribute('has-indicator');
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
      expect(el).to.have.attribute('has-indicator');
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
      expect(el).to.have.attribute('has-indicator');
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
      expect(el).not.to.have.attribute('has-indicator');
    });

    it('should treat ../ paths as internal', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="../parent/page">Parent relative</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;

      expect(anchor).not.to.have.attribute('target', '_blank');
      expect(el).not.to.have.attribute('has-indicator');
    });

    it('should treat hash links as internal', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="#section">Hash link</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;

      expect(anchor).not.to.have.attribute('target', '_blank');
      expect(el).not.to.have.attribute('has-indicator');
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
      expect(el).not.to.have.attribute('has-indicator');
    });

    it('should treat cross-origin protocol-relative links as external', async () => {
      const currentUrl = new URL(globalThis.location.href);
      const externalHost = `alt-${currentUrl.hostname}`;
      const protocolRelativeUrl = `//${externalHost}${currentUrl.port ? `:${currentUrl.port}` : ''}/page`;

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
      expect(el).to.have.attribute('has-indicator');
    });
  });

  describe('non-http protocols', () => {
    it('should treat mailto: links as external', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="mailto:test@example.com">Email</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;

      expect(anchor).to.have.attribute('target', '_blank');
      expect(el).to.have.attribute('has-indicator');
    });

    it('should treat tel: links as external', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="tel:+1234567890">Phone</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;

      expect(anchor).to.have.attribute('target', '_blank');
      expect(el).to.have.attribute('has-indicator');
    });
  });

  describe('empty or missing anchor', () => {
    it('should handle empty slot gracefully', async () => {
      el = await fixture(html`<sl-link></sl-link>`);

      expect(el).not.to.have.attribute('has-indicator');
    });

    it('should handle slot without anchor', async () => {
      el = await fixture(html`<sl-link><span>Not a link</span></sl-link>`);

      expect(el).not.to.have.attribute('has-indicator');
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
      expect(el).not.to.have.attribute('has-indicator');
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
      expect(el).to.have.attribute('has-indicator');
    });

    it('should remove injected target when type changes back to internal', async () => {
      el.type = 'external';
      await el.updateComplete;

      el.type = 'internal';
      await el.updateComplete;

      expect(anchor).not.to.have.attribute('target');
      expect(el).not.to.have.attribute('has-indicator');
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
      expect(el).not.to.have.attribute('has-indicator');
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

      expect(el).to.have.attribute('icon-position', 'end');
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

  describe('click delegation', () => {
    it('should delegate clicks on the host to the anchor', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="/page">Link</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;

      let clicked = false;
      anchor.addEventListener('click', e => {
        e.preventDefault();
        clicked = true;
      });

      el.click();
      await el.updateComplete;

      expect(clicked).to.be.true;
    });

    it('should not create double events when clicking the anchor directly', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="/page">Link</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;

      let clickCount = 0;
      anchor.addEventListener('click', e => {
        e.preventDefault();
        clickCount++;
      });

      anchor.click();
      await el.updateComplete;

      expect(clickCount).to.equal(1);
    });

    it('should emit only one bubbled click and preserve modifiers for host-originated clicks', async () => {
      const wrapper = await fixture(html`
        <div>
          <sl-link>
            <a href="/page">Link</a>
          </sl-link>
        </div>
      `);

      el = wrapper.querySelector('sl-link')!;

      const clicks: MouseEvent[] = [];
      wrapper.addEventListener('click', event => {
        event.preventDefault();
        clicks.push(event as MouseEvent);
      });

      el.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, composed: true, ctrlKey: true })
      );
      await el.updateComplete;

      expect(clicks).to.have.lengthOf(1);
      expect(clicks[0].ctrlKey).to.be.true;
    });

    it('should emit only one bubbled click and preserve modifiers for shadow icon clicks', async () => {
      const wrapper = await fixture(html`
        <div>
          <sl-link>
            <a href="/page">Link</a>
          </sl-link>
        </div>
      `);

      el = wrapper.querySelector('sl-link')!;

      const icon = el.renderRoot.querySelector('sl-icon')!;
      const clicks: MouseEvent[] = [];

      wrapper.addEventListener('click', event => {
        event.preventDefault();
        clicks.push(event as MouseEvent);
      });

      icon.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true, composed: true, metaKey: true })
      );
      await el.updateComplete;

      expect(clicks).to.have.lengthOf(1);
      expect(clicks[0].metaKey).to.be.true;
    });
  });

  describe('screen reader text for new tab links', () => {
    it('should not add sr-only span if one already exists', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="https://example.com">
            External
            <span class="sr-only">(custom text)</span>
          </a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
      const srOnlySpans = anchor.querySelectorAll('span.sr-only');

      expect(srOnlySpans).to.have.lengthOf(1);
      expect(srOnlySpans[0].textContent).to.include('custom text');
    });

    it('should add sr-only span for internal-new-tab links', async () => {
      el = await fixture(html`
        <sl-link>
          <a href="/page" target="_blank">New tab</a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
      const srOnly = anchor.querySelector('span.sr-only');

      expect(srOnly).to.exist;
      expect(srOnly?.textContent).to.include('opens in a new tab');
    });
  });
});
