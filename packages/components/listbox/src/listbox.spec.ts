import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type Listbox } from './listbox.js';
import { type Option } from './option.js';

setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);

describe('sl-listbox', () => {
  let el: Listbox;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-listbox></sl-listbox>`);
    });

    it('should have a role of listbox', () => {
      expect(el).to.have.attribute('role', 'listbox');
    });
  });

  describe('virtual list', () => {
    const items = Array.from({ length: 1000 }).map((_, i) => ({
      label: `Item ${i + 1}`,
      selected: i % 2 === 0,
      value: i
    }));

    beforeEach(async () => {
      el = await fixture(html`<sl-listbox .items=${items} style="height: 200px"></sl-listbox>`);

      // Give the virtualizer time to render
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    it('should render a virtualizer', () => {
      expect(el.querySelector('lit-virtualizer')).to.exist;
    });

    it('should render options for each item', () => {
      const options = Array.from(el.querySelectorAll('sl-option'));

      expect(options.length).to.be.greaterThan(0);
      expect(options.length).to.be.lessThan(items.length);
      expect(options.map(o => o.textContent)).to.deep.equal(items.slice(0, options.length).map(i => JSON.stringify(i)));
    });

    it('should update the options when the items changed', async () => {
      el.items = items.map(i => i.label);
      await new Promise(resolve => setTimeout(resolve, 10));

      const options = Array.from(el.querySelectorAll('sl-option'));

      expect(options.map(o => o.textContent)).to.deep.equal(el.items.slice(0, options.length));
    });

    it('should use the given label, selected and value path for each item', async () => {
      el.itemLabelPath = 'label';
      el.itemSelectedPath = 'selected';
      el.itemValuePath = 'value';
      await el.updateComplete;

      const options = Array.from<Option<(typeof items)[0]>>(el.querySelectorAll('sl-option'));

      expect(options.map(o => o.textContent)).to.deep.equal(items.slice(0, options.length).map(i => i.label));
      expect(options.map(o => o.selected)).to.deep.equal(items.slice(0, options.length).map(i => i.selected));
      expect(options.map(o => o.value)).to.deep.equal(items.slice(0, options.length).map(i => i.value));
    });

    it('should support a custom renderer', async () => {
      el.renderer = (item: (typeof items)[0]) => {
        const option = document.createElement('div');
        option.setAttribute('role', 'option');
        option.textContent = item.label;

        return option;
      };
      await el.updateComplete;

      const options = Array.from(el.querySelectorAll('div[role="option"]'));

      expect(options.length).to.be.greaterThan(0);
      expect(options.length).to.be.lessThan(items.length);
      expect(options.map(o => o.textContent)).to.deep.equal(items.slice(0, options.length).map(i => i.label));
    });
  });
});
