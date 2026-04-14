import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Heading } from './heading.js';

try {
  customElements.define('doc-heading', Heading);
} catch {
  /* empty */
}

describe('doc-heading', () => {
  let el: Heading;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-heading>My Heading</doc-heading>`);
    });

    it('should render', () => {
      expect(el).to.exist;
      expect(el).to.be.instanceOf(Heading);
    });

    it('should have a heading role', () => {
      expect(el).to.have.attribute('role', 'heading');
    });

    it('should have aria-level 2 by default', () => {
      expect(el).to.have.attribute('aria-level', '2');
    });

    it('should render an h2 element by default', () => {
      expect(el.renderRoot.querySelector('h2')).to.exist;
      expect(el.renderRoot.querySelector('h3')).not.to.exist;
    });

    it('should have level 2 by default', () => {
      expect(el.level).to.equal(2);
    });

    it('should not render a copy button when there is no id', () => {
      expect(el.renderRoot.querySelector('doc-copy-button')).not.to.exist;
    });
  });

  describe('level 3', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-heading level="3">Sub Heading</doc-heading>`);
    });

    it('should render an h3 element', () => {
      expect(el.renderRoot.querySelector('h3')).to.exist;
      expect(el.renderRoot.querySelector('h2')).not.to.exist;
    });

    it('should have aria-level 3', () => {
      expect(el).to.have.attribute('aria-level', '3');
    });
  });

  describe('copy button', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-heading id="my-section">My Section</doc-heading>`);
    });

    it('should render a copy button when heading has an id', () => {
      expect(el.renderRoot.querySelector('doc-copy-button')).to.exist;
    });

    it('should copy the URL with hash to the clipboard on click', async () => {
      const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);

      el.renderRoot.querySelector<HTMLElement>('doc-copy-button')!.click();
      await el.updateComplete;

      expect(writeText).toHaveBeenCalledWith(expect.stringContaining('#my-section'));

      writeText.mockRestore();
    });
  });
});
