import { fixture } from '@sl-design-system/vitest-browser-lit';
import { LitElement, html } from 'lit';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LocaleMixin } from './locale.js';

class LocaleElement extends LocaleMixin(LitElement) {
  /** The number of times the element has rendered. */
  renderCount = 0;

  override render() {
    this.renderCount++;

    return html`${this.locale}`;
  }
}

try {
  customElements.define('locale-mixin-test', LocaleElement);
} catch {
  // Element may already be defined in watch / repeated test runs
}

describe('LocaleMixin', () => {
  let el: LocaleElement;

  const documentLanguage = document.documentElement.lang;

  /** Sets `<html lang>` and gives the mutation observer a chance to react to it. */
  const setDocumentLanguage = async (lang: string): Promise<void> => {
    document.documentElement.lang = lang;

    await new Promise(resolve => setTimeout(resolve));
  };

  afterEach(async () => {
    await setDocumentLanguage(documentLanguage);
  });

  describe('defaults', () => {
    beforeEach(async () => {
      await setDocumentLanguage('en-GB');

      el = await fixture(html`<locale-mixin-test></locale-mixin-test>`);
    });

    it('should not have a locale attribute', () => {
      expect(el).not.to.have.attribute('locale');
    });

    it('should use the language of the document', () => {
      expect(el.locale).to.equal('en-GB');
      expect(el.renderRoot.textContent).to.equal('en-GB');
    });

    it('should use the language of the browser when the document has none', async () => {
      await setDocumentLanguage('');

      expect(el.locale).to.equal(navigator.language);
    });

    it('should update when the language of the document changes', async () => {
      const { renderCount } = el;

      await setDocumentLanguage('nl-NL');
      await el.updateComplete;

      expect(el.locale).to.equal('nl-NL');
      expect(el.renderCount).to.equal(renderCount + 1);
      expect(el.renderRoot.textContent).to.equal('nl-NL');
    });
  });

  describe('explicit locale', () => {
    beforeEach(async () => {
      await setDocumentLanguage('en-GB');

      el = await fixture(html`<locale-mixin-test locale="fr-FR"></locale-mixin-test>`);
    });

    it('should use the locale from the attribute', () => {
      expect(el.locale).to.equal('fr-FR');
      expect(el.renderRoot.textContent).to.equal('fr-FR');
    });

    it('should update when the locale is set as a property', async () => {
      el.locale = 'de-DE';
      await el.updateComplete;

      expect(el.locale).to.equal('de-DE');
      expect(el.renderRoot.textContent).to.equal('de-DE');
    });

    it('should ignore the language of the document', async () => {
      await setDocumentLanguage('nl-NL');
      await el.updateComplete;

      expect(el.locale).to.equal('fr-FR');
    });
  });

  describe('disconnected', () => {
    beforeEach(async () => {
      await setDocumentLanguage('en-GB');

      el = await fixture(html`<locale-mixin-test></locale-mixin-test>`);
      el.remove();
    });

    it('should not update when the language of the document changes', async () => {
      const { renderCount } = el;

      await setDocumentLanguage('nl-NL');
      await el.updateComplete;

      expect(el.renderCount).to.equal(renderCount);
    });

    it('should update again once reconnected', async () => {
      document.body.append(el);
      await el.updateComplete;

      const { renderCount } = el;

      await setDocumentLanguage('nl-NL');
      await el.updateComplete;

      expect(el.locale).to.equal('nl-NL');
      expect(el.renderCount).to.equal(renderCount + 1);

      el.remove();
    });
  });
});
