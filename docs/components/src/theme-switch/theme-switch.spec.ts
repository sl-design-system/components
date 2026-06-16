import { type Switch } from '@sl-design-system/switch';
import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { type ThemeSwitch } from './theme-switch.js';

// Register the component for testing
const { ThemeSwitch: ThemeSwitchClass } = await import('./theme-switch.js');

try {
  customElements.define('doc-theme-switch', ThemeSwitchClass);
} catch {
  /* empty */
}

describe('doc-theme-switch', () => {
  let el: ThemeSwitch;

  describe('defaults', () => {
    beforeEach(async () => {
      document.documentElement.removeAttribute('data-color-scheme');

      el = await fixture(html`<doc-theme-switch></doc-theme-switch>`);
    });

    it('should render a switch', () => {
      const switchEl = el.renderRoot.querySelector('sl-switch');

      expect(switchEl).to.exist;
    });

    it('should have a sun icon for the off state', () => {
      const switchEl = el.renderRoot.querySelector('sl-switch');

      expect(switchEl).to.have.attribute('icon-off', 'fas-sun-bright');
    });

    it('should have a moon icon for the on state', () => {
      const switchEl = el.renderRoot.querySelector('sl-switch');

      expect(switchEl).to.have.attribute('icon-on', 'fas-moon-stars');
    });

    it('should have an aria-label on the switch', () => {
      const switchEl = el.renderRoot.querySelector('sl-switch');

      expect(switchEl).to.have.attribute('aria-label', 'Switch between light and dark mode');
    });

    it('should set the data-color-scheme attribute on the document', () => {
      expect(document.documentElement).to.have.attribute('data-color-scheme');
    });

    it('should have a medium switch by default', () => {
      const switchEl = el.renderRoot.querySelector('sl-switch');

      expect(switchEl).to.not.have.attribute('size');
    });
  });

  describe('light mode', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-theme-switch color-scheme="light"></doc-theme-switch>`);
    });

    it('should have the color-scheme attribute set to light', () => {
      expect(el).to.have.attribute('color-scheme', 'light');
    });

    it('should not have the switch checked', () => {
      const switchEl = el.renderRoot.querySelector<Switch>('sl-switch');

      expect(switchEl?.checked).to.not.be.ok;
    });

    it('should set data-color-scheme to light on the document', () => {
      expect(document.documentElement).to.have.attribute('data-color-scheme', 'light');
    });
  });

  describe('dark mode', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-theme-switch color-scheme="dark"></doc-theme-switch>`);
    });

    it('should have the color-scheme attribute set to dark', () => {
      expect(el).to.have.attribute('color-scheme', 'dark');
    });

    it('should have the switch checked', () => {
      const switchEl = el.renderRoot.querySelector<Switch>('sl-switch');

      expect(switchEl?.checked).to.be.true;
    });

    it('should set data-color-scheme to dark on the document', () => {
      expect(document.documentElement).to.have.attribute('data-color-scheme', 'dark');
    });
  });

  describe('toggling', () => {
    beforeEach(async () => {
      el = await fixture(html`<doc-theme-switch color-scheme="light"></doc-theme-switch>`);
    });

    it('should switch to dark mode when the switch is toggled', async () => {
      const switchEl = el.renderRoot.querySelector<Switch>('sl-switch')!;

      switchEl.click();
      await el.updateComplete;

      expect(el.colorScheme).to.equal('dark');
      expect(document.documentElement).to.have.attribute('data-color-scheme', 'dark');
    });

    it('should switch back to light mode when toggled again', async () => {
      const switchEl = el.renderRoot.querySelector<Switch>('sl-switch')!;

      switchEl.click();
      await el.updateComplete;

      switchEl.click();
      await el.updateComplete;

      expect(el.colorScheme).to.equal('light');
      expect(document.documentElement).to.have.attribute('data-color-scheme', 'light');
    });

    it('should reflect the color-scheme attribute when toggled', async () => {
      const switchEl = el.renderRoot.querySelector<Switch>('sl-switch')!;

      switchEl.click();
      await el.updateComplete;

      expect(el).to.have.attribute('color-scheme', 'dark');
    });
  });
});
