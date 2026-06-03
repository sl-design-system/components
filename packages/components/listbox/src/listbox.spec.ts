import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type Listbox, type ListboxItem } from './listbox.js';
import { type Option } from './option.js';

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

    const queryVirtualized = <T extends Element = Element>(selector: string): T[] => {
      const virtualList = el.querySelector('sl-virtual-list');

      return Array.from(virtualList?.shadowRoot?.querySelectorAll<T>(selector) ?? []);
    };

    beforeEach(async () => {
      el = await fixture(html`
        <sl-listbox
          .options=${options}
          option-label-path="label"
          option-selected-path="selected"
          option-value-path="value"
          style="height: 200px"></sl-listbox>
      `);

      // Give the virtualizer time to render
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should render a virtualizer', () => {
      expect(el.querySelector('sl-virtual-list')).to.exist;
    });

    it('should render options for each option', () => {
      const renderedOptions = queryVirtualized<Option>('sl-option');

      expect(renderedOptions.length).to.be.greaterThan(0);
      expect(renderedOptions.length).to.be.lessThan(options.length);
      expect(renderedOptions.map(o => o.textContent)).to.deep.equal(
        options.slice(0, renderedOptions.length).map(i => i.label)
      );
    });

    it('should update the options when the options changed', async () => {
      el.options = options.map(o => o.label);
      el.optionLabelPath = undefined;
      el.optionSelectedPath = undefined;
      el.optionValuePath = undefined;

      // wait for virtualizer to pick up the change
      await new Promise(resolve => setTimeout(resolve, 50));

      const renderedOptions = queryVirtualized<Option>('sl-option');

      expect(renderedOptions.map(o => o.textContent)).to.deep.equal(
        el.options.slice(0, renderedOptions.length)
      );
    });

    it('should use the given label, selected and value path for each item', async () => {
      el.optionLabelPath = 'label';
      el.optionSelectedPath = 'selected';
      el.optionValuePath = 'value';
      await el.updateComplete;

      const renderedOptions = queryVirtualized<Option<TestOption>>('sl-option');

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

      const renderedOptions = queryVirtualized<HTMLDivElement>('div[role="option"]');

      expect(renderedOptions.length).to.be.greaterThan(0);
      expect(renderedOptions.length).to.be.lessThan(options.length);
      expect(renderedOptions.map(o => o.textContent)).to.deep.equal(
        options.slice(0, renderedOptions.length).map(i => i.label)
      );
    });

    it('should apply data-virtual-unconstrained attribute when using virtual list', async () => {
      const unconstrained = await fixture<Listbox>(html`<sl-listbox></sl-listbox>`);

      // Initially should not have the attribute (no items)
      expect(unconstrained.hasAttribute('data-virtual-unconstrained')).to.be.false;

      // Set options to trigger virtual list
      unconstrained.options = options;
      unconstrained.optionLabelPath = 'label';
      unconstrained.optionSelectedPath = 'selected';
      unconstrained.optionValuePath = 'value';

      // Wait for all updates
      await unconstrained.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      // Now should have the attribute
      expect(unconstrained.querySelector('sl-virtual-list')).to.exist;
      expect(unconstrained.hasAttribute('data-virtual-unconstrained')).to.be.true;

      // Verify CSS fallback is applied
      const computedStyle = getComputedStyle(unconstrained);
      expect(computedStyle.maxBlockSize).to.not.equal('none');
    });

    it('should allow consumers to override the fallback with inline styles', async () => {
      const withHeight = await fixture<Listbox>(html`
        <sl-listbox style="height: 30rem"></sl-listbox>
      `);

      // Set options to trigger virtual list
      withHeight.options = options;
      withHeight.optionLabelPath = 'label';
      withHeight.optionValuePath = 'value';

      await withHeight.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 50));

      // Should NOT have attribute when consumer sets explicit inline height
      // This prevents the CSS fallback from clamping the consumer's height
      expect(withHeight.hasAttribute('data-virtual-unconstrained')).to.be.false;

      // The inline height should not be clamped
      const computedStyle = getComputedStyle(withHeight);
      // Height in pixels, roughly 30rem = 480px at 16px base
      expect(parseFloat(computedStyle.height)).to.be.greaterThan(400);
    });
  });
});
