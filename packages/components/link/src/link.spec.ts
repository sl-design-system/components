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

    it('should add an aria description when missing', () => {
      expect(anchor).to.have.attribute('aria-description', 'Opens in a new tab');
    });

    it('should render an indicator icon', () => {
      const icon = el.renderRoot.querySelector('sl-icon');

      expect(icon).to.exist;
      expect(icon).to.have.attribute('name', 'far-arrow-up-right-from-square');
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
  });

  describe('existing rel and aria-description', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-link>
          <a
            href="https://example.com"
            rel="external nofollow"
            aria-description="Custom description">
            External
          </a>
        </sl-link>
      `);

      anchor = el.querySelector('a')!;
    });

    it('should not override existing rel', () => {
      expect(anchor).to.have.attribute('rel', 'external nofollow');
    });

    it('should not override existing aria-description', () => {
      expect(anchor).to.have.attribute('aria-description', 'Custom description');
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
  });
});
