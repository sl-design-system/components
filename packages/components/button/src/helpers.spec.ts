import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type Button } from './button.js';
import { getButtonAccessibleName, getButtonAriaAttribute, getButtonDescription, isButtonDisabled } from './helpers.js';

describe('getButtonAccessibleName', () => {
  let el: Button;

  describe('text content', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button>Click me</sl-button>`);
    });

    it('should return the text content', () => {
      expect(getButtonAccessibleName(el)).to.equal('Click me');
    });
  });

  describe('aria-label', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button aria-label="Close dialog">X</sl-button>`);
    });

    it('should prefer aria-label over text content', () => {
      expect(getButtonAccessibleName(el)).to.equal('Close dialog');
    });
  });

  describe('aria-labelledby', () => {
    beforeEach(async () => {
      const div = await fixture(html`
        <div>
          <span id="label-el">External label</span>
          <sl-button aria-labelledby="label-el">Fallback text</sl-button>
        </div>
      `);

      el = div.querySelector('sl-button')!;
    });

    it('should prefer aria-labelledby over aria-label and text content', () => {
      expect(getButtonAccessibleName(el)).to.equal('External label');
    });
  });

  describe('aria-labelledby with multiple ids', () => {
    beforeEach(async () => {
      const div = await fixture(html`
        <div>
          <span id="part1">Save</span>
          <span id="part2">document</span>
          <sl-button aria-labelledby="part1 part2">Button</sl-button>
        </div>
      `);

      el = div.querySelector('sl-button')!;
    });

    it('should concatenate text from multiple referenced elements', () => {
      expect(getButtonAccessibleName(el)).to.equal('Save document');
    });
  });

  describe('empty button', () => {
    beforeEach(async () => {
      // eslint-disable-next-line slds/button-has-label
      el = await fixture(html`<sl-button></sl-button>`);
    });

    it('should return an empty string', () => {
      expect(getButtonAccessibleName(el)).to.equal('');
    });
  });

  describe('icon-only button with aria-label', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-button aria-label="Settings">
          <sl-icon name="far-gear"></sl-icon>
        </sl-button>
      `);
    });

    it('should return the aria-label', () => {
      expect(getButtonAccessibleName(el)).to.equal('Settings');
    });
  });

  describe('whitespace handling', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button> Spaced </sl-button>`);
    });

    it('should trim whitespace from text content', () => {
      expect(getButtonAccessibleName(el)).to.equal('Spaced');
    });
  });
});

describe('getButtonDescription', () => {
  let el: Button;

  describe('no description', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button>Click me</sl-button>`);
    });

    it('should return an empty string', () => {
      expect(getButtonDescription(el)).to.equal('');
    });
  });

  describe('aria-description', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button aria-description="Opens a new window">Click me</sl-button>`);
    });

    it('should return the aria-description value', () => {
      expect(getButtonDescription(el)).to.equal('Opens a new window');
    });
  });

  describe('aria-describedby', () => {
    beforeEach(async () => {
      const div = await fixture(html`
        <div>
          <span id="desc-el">This action is irreversible</span>
          <sl-button aria-describedby="desc-el">Delete</sl-button>
        </div>
      `);

      el = div.querySelector('sl-button')!;
    });

    it('should return text from the referenced element', () => {
      expect(getButtonDescription(el)).to.equal('This action is irreversible');
    });
  });

  describe('aria-describedby with multiple ids', () => {
    beforeEach(async () => {
      const div = await fixture(html`
        <div>
          <span id="desc1">Saves the document.</span>
          <span id="desc2">Cannot be undone.</span>
          <sl-button aria-describedby="desc1 desc2">Save</sl-button>
        </div>
      `);

      el = div.querySelector('sl-button')!;
    });

    it('should concatenate text from multiple referenced elements', () => {
      expect(getButtonDescription(el)).to.equal('Saves the document. Cannot be undone.');
    });
  });

  describe('aria-describedby takes priority over aria-description', () => {
    beforeEach(async () => {
      const div = await fixture(html`
        <div>
          <span id="desc-priority">From describedby</span>
          <sl-button aria-describedby="desc-priority" aria-description="From description">Click</sl-button>
        </div>
      `);

      el = div.querySelector('sl-button')!;
    });

    it('should prefer aria-describedby over aria-description', () => {
      expect(getButtonDescription(el)).to.equal('From describedby');
    });
  });
});

describe('isButtonDisabled', () => {
  let el: Button;

  describe('not disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button>Click me</sl-button>`);
    });

    it('should return false', () => {
      expect(isButtonDisabled(el)).to.equal(false);
    });
  });

  describe('natively disabled via attribute', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button disabled>Click me</sl-button>`);
    });

    it('should return true', () => {
      expect(isButtonDisabled(el)).to.equal(true);
    });
  });

  describe('natively disabled via property', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button>Click me</sl-button>`);
      el.disabled = true;
      await el.updateComplete;
    });

    it('should return true', () => {
      expect(isButtonDisabled(el)).to.equal(true);
    });
  });

  describe('aria-disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button aria-disabled="true">Click me</sl-button>`);
    });

    it('should return aria', () => {
      expect(isButtonDisabled(el)).to.equal('aria');
    });
  });

  describe('aria-disabled="false"', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button aria-disabled="false">Click me</sl-button>`);
    });

    it('should return false', () => {
      expect(isButtonDisabled(el)).to.equal(false);
    });
  });

  describe('native disabled takes priority over aria-disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-button disabled aria-disabled="true">Click me</sl-button>`);
    });

    it('should return true', () => {
      expect(isButtonDisabled(el)).to.equal(true);
    });
  });
});

describe('getButtonAriaAttribute', () => {
  let el: Button;

  it('should return the attribute value from the inner button', async () => {
    el = await fixture(html`<sl-button aria-disabled="true">Click me</sl-button>`);

    expect(getButtonAriaAttribute(el, 'aria-disabled')).to.equal('true');
  });

  it('should return null when the attribute is not set', async () => {
    el = await fixture(html`<sl-button>Click me</sl-button>`);

    expect(getButtonAriaAttribute(el, 'aria-disabled')).to.be.null;
  });

  it('should return aria-expanded from the inner button', async () => {
    el = await fixture(html`<sl-button aria-expanded="false">Click me</sl-button>`);

    expect(getButtonAriaAttribute(el, 'aria-expanded')).to.equal('false');
  });

  it('should return aria-haspopup from the inner button', async () => {
    el = await fixture(html`<sl-button aria-haspopup="menu">Click me</sl-button>`);

    expect(getButtonAriaAttribute(el, 'aria-haspopup')).to.equal('menu');
  });
});
