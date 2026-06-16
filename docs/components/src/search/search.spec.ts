import { fixture } from '@sl-design-system/vitest-browser-lit';
import { type LitElement, html } from 'lit';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Use dynamic import from dist to avoid CSS module resolution issues in browser tests
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { Search: SearchClass } = await import('@sl-design-system/doc-components/search/search');

try {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  customElements.define('doc-search', SearchClass);
} catch {
  /* empty */
}

describe('doc-search', () => {
  let el: LitElement;

  beforeEach(async () => {
    el = await fixture(html`<doc-search></doc-search>`);
  });

  describe('trigger button', () => {
    it('should render a trigger button', () => {
      const button = el.renderRoot.querySelector('button');

      expect(button).to.exist;
    });

    it('should have a search icon', () => {
      const icon = el.renderRoot.querySelector('button sl-icon');

      expect(icon).to.exist;
      expect(icon?.getAttribute('name')).to.equal('far-magnifying-glass');
    });

    it('should have "Search" text', () => {
      const span = el.renderRoot.querySelector('button span');

      expect(span).to.exist;
      expect(span?.textContent).to.equal('Search');
    });

    it('should have a keyboard shortcut hint', () => {
      const kbd = el.renderRoot.querySelector('button kbd');

      expect(kbd).to.exist;
    });

    it('should open the dialog when clicked', () => {
      const button = el.renderRoot.querySelector('button')!;
      const dialog = el.renderRoot.querySelector('dialog')!;

      button.click();

      expect(dialog.open).to.be.true;
    });
  });

  describe('dialog', () => {
    it('should render a dialog', () => {
      const dialog = el.renderRoot.querySelector('dialog');

      expect(dialog).to.exist;
    });

    it('should not be open by default', () => {
      const dialog = el.renderRoot.querySelector('dialog')!;

      expect(dialog.open).to.be.false;
    });

    it('should contain a search field', () => {
      const searchField = el.renderRoot.querySelector('sl-search-field');

      expect(searchField).to.exist;
    });

    it('should have an aria-label on the search field', () => {
      const searchField = el.renderRoot.querySelector('sl-search-field');

      expect(searchField?.getAttribute('aria-label')).to.equal('Search documentation');
    });

    it('should not contain any results before a query is entered', () => {
      const results = el.renderRoot.querySelectorAll('.results li');

      expect(results.length).to.equal(0);
    });

    it('should show a prompt message before a query is entered', () => {
      const message = el.renderRoot.querySelector('.message');

      expect(message).to.exist;
    });

    it('should close when the Escape key is pressed', () => {
      const button = el.renderRoot.querySelector('button')!;
      const dialog = el.renderRoot.querySelector('dialog')!;

      button.click();
      expect(dialog.open).to.be.true;

      dialog.close();

      expect(dialog.open).to.be.false;
    });
  });

  describe('keyboard shortcut', () => {
    it('should open the dialog on Cmd+K', () => {
      const dialog = el.renderRoot.querySelector('dialog')!;
      const showModalSpy = vi.spyOn(dialog, 'showModal');

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
      );

      expect(showModalSpy).toHaveBeenCalled();
    });

    it('should open the dialog on Ctrl+K', () => {
      const dialog = el.renderRoot.querySelector('dialog')!;
      const showModalSpy = vi.spyOn(dialog, 'showModal');

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true })
      );

      expect(showModalSpy).toHaveBeenCalled();
    });

    it('should not open the dialog on just K', () => {
      const dialog = el.renderRoot.querySelector('dialog')!;
      const showModalSpy = vi.spyOn(dialog, 'showModal');

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', bubbles: true }));

      expect(showModalSpy).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should remove the keydown listener on disconnect', () => {
      const dialog = el.renderRoot.querySelector('dialog')!;
      const showModalSpy = vi.spyOn(dialog, 'showModal');

      el.remove();

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
      );

      expect(showModalSpy).not.toHaveBeenCalled();
    });
  });
});
