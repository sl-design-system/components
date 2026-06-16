import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Command } from './command-palette.js';

// Use dynamic import from dist to avoid CSS module resolution issues in browser tests

const { CommandPalette: CommandPaletteClass } =
  await import('@sl-design-system/doc-components/command-palette/command-palette.js');

try {
  customElements.define('doc-command-palette', CommandPaletteClass);
} catch {
  /* empty */
}

const commands = [
  { id: 'home', label: 'Go to home', keywords: ['start'] },
  { id: 'components', label: 'Browse components' },
  { id: 'tokens', label: 'Design tokens' }
];

describe('doc-command-palette', () => {
  let el: InstanceType<typeof CommandPaletteClass>;

  beforeEach(async () => {
    el = await fixture(html`<doc-command-palette .commands=${commands}></doc-command-palette>`);
  });

  describe('dialog', () => {
    it('should render a dialog', () => {
      expect(el.renderRoot.querySelector('dialog')).to.exist;
    });

    it('should not be open by default', () => {
      expect(el.renderRoot.querySelector('dialog')!.open).to.be.false;
    });

    it('should use a plain input instead of sl-search-field', () => {
      expect(el.renderRoot.querySelector('input')).to.exist;
      expect(el.renderRoot.querySelector('sl-search-field')).not.to.exist;
    });

    it('should render a legend with keyboard hints', () => {
      const legend = el.renderRoot.querySelector('.legend');

      expect(legend).to.exist;
      expect(legend!.querySelectorAll('kbd').length).to.be.greaterThan(0);
    });

    it('should open when show() is called and focus the input', async () => {
      el.show();

      expect(el.dialog!.open).to.be.true;

      await new Promise(resolve => requestAnimationFrame(resolve));

      expect(el.renderRoot.activeElement).to.equal(el.input);
    });

    it('should close when close() is called', () => {
      el.show();
      expect(el.dialog!.open).to.be.true;

      el.close();

      expect(el.dialog!.open).to.be.false;
    });
  });

  describe('commands', () => {
    it('should render all commands by default', () => {
      expect(el.renderRoot.querySelectorAll('.results li').length).to.equal(commands.length);
    });

    it('should highlight the first command when opened', () => {
      el.show();

      expect(el.activeIndex).to.equal(0);
    });

    it('should filter commands by the query', async () => {
      el.query = 'browse';
      await el.updateComplete;

      const items = el.renderRoot.querySelectorAll('.results li');

      expect(items.length).to.equal(1);
      expect(items[0].textContent?.trim()).to.equal('Browse components');
    });

    it('should match against keywords', async () => {
      el.query = 'start';
      await el.updateComplete;

      const items = el.renderRoot.querySelectorAll('.results li');

      expect(items.length).to.equal(1);
      expect(items[0].textContent?.trim()).to.equal('Go to home');
    });

    it('should show a message when there are no results', async () => {
      el.query = 'nonexistent';
      await el.updateComplete;

      expect(el.renderRoot.querySelector('.message')).to.exist;
      expect(el.renderRoot.querySelectorAll('.results li').length).to.equal(0);
    });

    it('should emit doc-command-select when a command is clicked', () => {
      const onSelect = vi.fn<(event: CustomEvent<Command>) => void>();
      el.addEventListener('doc-command-select', onSelect);

      el.show();
      el.renderRoot.querySelector<HTMLElement>('.results li')!.click();

      expect(onSelect).toHaveBeenCalledOnce();
      expect(onSelect.mock.calls[0][0].detail.id).to.equal('home');
    });
  });

  describe('keyboard', () => {
    it('should open on Cmd+K', () => {
      const showModalSpy = vi.spyOn(el.dialog!, 'showModal');

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
      );

      expect(showModalSpy).toHaveBeenCalled();
    });

    it('should open on Ctrl+K', () => {
      const showModalSpy = vi.spyOn(el.dialog!, 'showModal');

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true })
      );

      expect(showModalSpy).toHaveBeenCalled();
    });

    it('should move the active index with the arrow keys', async () => {
      el.show();
      expect(el.activeIndex).to.equal(0);

      el.dialog!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await el.updateComplete;
      expect(el.activeIndex).to.equal(1);

      el.dialog!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await el.updateComplete;
      expect(el.activeIndex).to.equal(0);
    });

    it('should wrap around when navigating past the ends', async () => {
      el.show();

      el.dialog!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await el.updateComplete;

      expect(el.activeIndex).to.equal(commands.length - 1);
    });

    it('should select the active command on Enter', () => {
      const onSelect = vi.fn<(event: CustomEvent<Command>) => void>();
      el.addEventListener('doc-command-select', onSelect);

      el.show();
      el.dialog!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(onSelect).toHaveBeenCalledOnce();
      expect(onSelect.mock.calls[0][0].detail.id).to.equal('home');
    });

    it('should close on Escape', () => {
      el.show();
      expect(el.dialog!.open).to.be.true;

      el.dialog!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      expect(el.dialog!.open).to.be.false;
    });
  });

  describe('cleanup', () => {
    it('should remove the keydown listener on disconnect', () => {
      const showModalSpy = vi.spyOn(el.dialog!, 'showModal');

      el.remove();

      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
      );

      expect(showModalSpy).not.toHaveBeenCalled();
    });
  });
});
