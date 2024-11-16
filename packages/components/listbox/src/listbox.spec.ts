import { setupIgnoreWindowResizeObserverLoopErrors } from '@lit-labs/virtualizer/support/resize-observer-errors.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type Listbox, type ListboxItem } from './listbox.js';
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
    type TestOption = {
      label: string;
      selected: boolean;
      value: number;
    };

    const options: TestOption[] = Array.from({ length: 1000 }).map((_, i) => ({
      label: `Item ${i + 1}`,
      selected: i % 2 === 0,
      value: i
    }));

    beforeEach(async () => {
      el = await fixture(html`<sl-listbox .options=${options} style="height: 200px"></sl-listbox>`);

      // Give the virtualizer time to render
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    it('should render a virtualizer', () => {
      expect(el.querySelector('lit-virtualizer')).to.exist;
    });

    it('should render options for each option', () => {
      const renderedOptions = Array.from(el.querySelectorAll('sl-option'));

      expect(renderedOptions.length).to.be.greaterThan(0);
      expect(renderedOptions.length).to.be.lessThan(options.length);
      expect(renderedOptions.map(o => o.textContent)).to.deep.equal(
        options.slice(0, renderedOptions.length).map(i => JSON.stringify(i))
      );
    });

    it('should update the options when the options changed', async () => {
      el.options = options.map(o => o.label);
      await new Promise(resolve => setTimeout(resolve, 10));

      const renderedOptions = Array.from(el.querySelectorAll('sl-option'));

      expect(renderedOptions.map(o => o.textContent)).to.deep.equal(el.options.slice(0, renderedOptions.length));
    });

    it('should use the given label, selected and value path for each item', async () => {
      el.optionLabelPath = 'label';
      el.optionSelectedPath = 'selected';
      el.optionValuePath = 'value';
      await el.updateComplete;

      const renderedOptions = Array.from<Option<TestOption>>(el.querySelectorAll('sl-option'));

      expect(renderedOptions.map(o => o.textContent)).to.deep.equal(
        options.slice(0, renderedOptions.length).map(i => i.label)
      );
      expect(renderedOptions.map(o => o.selected)).to.deep.equal(
        options.slice(0, renderedOptions.length).map(i => i.selected)
      );
      expect(renderedOptions.map(o => o.value)).to.deep.equal(
        options.slice(0, renderedOptions.length).map(i => i.value)
      );
    });

    it('should support a custom renderer', async () => {
      el.renderer = (item: ListboxItem<TestOption>) => {
        const div = document.createElement('div');
        div.setAttribute('role', 'option');
        div.textContent = item.label;

        return div;
      };
      await el.updateComplete;

      const renderedOptions = Array.from(el.querySelectorAll('div[role="option"]'));

      expect(renderedOptions.length).to.be.greaterThan(0);
      expect(renderedOptions.length).to.be.lessThan(options.length);
      expect(renderedOptions.map(o => o.textContent)).to.deep.equal(
        options.slice(0, renderedOptions.length).map(i => i.label)
      );
    });
  });
});
