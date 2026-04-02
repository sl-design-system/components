import {
  getProxiedAccessibleName,
  getProxiedDescription,
  isProxiedDisabled
} from '@sl-design-system/shared/helpers/proxied-aria-attributes.js';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type MenuButton } from './menu-button.js';

describe('getProxiedAccessibleName', () => {
  let el: MenuButton;

  describe('slotted button content', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu-button>
          <span slot="button">Edit</span>
          <sl-menu-item>Rename...</sl-menu-item>
        </sl-menu-button>
      `);
    });

    it('should return the slotted button text', () => {
      expect(getProxiedAccessibleName(el)).to.equal('Edit');
    });
  });

  describe('aria-label', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu-button aria-label="Actions menu">
          <span slot="button">Edit</span>
          <sl-menu-item>Rename...</sl-menu-item>
        </sl-menu-button>
      `);
    });

    it('should prefer aria-label over slotted content', () => {
      expect(getProxiedAccessibleName(el)).to.equal('Actions menu');
    });
  });

  describe('aria-labelledby', () => {
    beforeEach(async () => {
      const div = await fixture(html`
        <div>
          <span id="mb-label">External label</span>
          <sl-menu-button aria-labelledby="mb-label">
            <span slot="button">Edit</span>
            <sl-menu-item>Rename...</sl-menu-item>
          </sl-menu-button>
        </div>
      `);

      el = div.querySelector('sl-menu-button')!;
    });

    it('should prefer aria-labelledby over aria-label and slotted content', () => {
      expect(getProxiedAccessibleName(el)).to.equal('External label');
    });
  });

  describe('icon-only with aria-label', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu-button aria-label="More options">
          <sl-icon slot="button" name="far-ellipsis-vertical"></sl-icon>
          <sl-menu-item>Rename...</sl-menu-item>
        </sl-menu-button>
      `);
    });

    it('should return the aria-label', () => {
      expect(getProxiedAccessibleName(el)).to.equal('More options');
    });
  });

  describe('no label', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu-button>
          <sl-menu-item>Rename...</sl-menu-item>
        </sl-menu-button>
      `);
    });

    it('should return an empty string', () => {
      expect(getProxiedAccessibleName(el)).to.equal('');
    });
  });
});

describe('getProxiedDescription', () => {
  let el: MenuButton;

  describe('no description', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu-button>
          <span slot="button">Edit</span>
          <sl-menu-item>Rename...</sl-menu-item>
        </sl-menu-button>
      `);
    });

    it('should return an empty string', () => {
      expect(getProxiedDescription(el)).to.equal('');
    });
  });

  describe('aria-description', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu-button aria-description="Contains editing actions">
          <span slot="button">Edit</span>
          <sl-menu-item>Rename...</sl-menu-item>
        </sl-menu-button>
      `);
    });

    it('should return the aria-description value', () => {
      expect(getProxiedDescription(el)).to.equal('Contains editing actions');
    });
  });

  describe('aria-describedby', () => {
    beforeEach(async () => {
      const div = await fixture(html`
        <div>
          <span id="mb-desc">Opens a menu with file actions</span>
          <sl-menu-button aria-describedby="mb-desc">
            <span slot="button">File</span>
            <sl-menu-item>Save</sl-menu-item>
          </sl-menu-button>
        </div>
      `);

      el = div.querySelector('sl-menu-button')!;
    });

    it('should return text from the referenced element', () => {
      expect(getProxiedDescription(el)).to.equal('Opens a menu with file actions');
    });
  });

  describe('aria-describedby takes priority over aria-description', () => {
    beforeEach(async () => {
      const div = await fixture(html`
        <div>
          <span id="mb-desc-priority">From describedby</span>
          <sl-menu-button aria-describedby="mb-desc-priority" aria-description="From description">
            <span slot="button">Edit</span>
            <sl-menu-item>Rename...</sl-menu-item>
          </sl-menu-button>
        </div>
      `);

      el = div.querySelector('sl-menu-button')!;
    });

    it('should prefer aria-describedby over aria-description', () => {
      expect(getProxiedDescription(el)).to.equal('From describedby');
    });
  });
});

describe('isProxiedDisabled', () => {
  let el: MenuButton;

  describe('not disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu-button>
          <span slot="button">Edit</span>
          <sl-menu-item>Rename...</sl-menu-item>
        </sl-menu-button>
      `);
    });

    it('should return false', () => {
      expect(isProxiedDisabled(el)).to.equal(false);
    });
  });

  describe('disabled property', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu-button disabled>
          <span slot="button">Edit</span>
          <sl-menu-item>Rename...</sl-menu-item>
        </sl-menu-button>
      `);
    });

    it('should return true', () => {
      expect(isProxiedDisabled(el)).to.equal(true);
    });
  });

  describe('aria-disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-menu-button aria-disabled="true">
          <span slot="button">Edit</span>
          <sl-menu-item>Rename...</sl-menu-item>
        </sl-menu-button>
      `);
    });

    it('should return aria', () => {
      expect(isProxiedDisabled(el)).to.equal('aria');
    });
  });
});
