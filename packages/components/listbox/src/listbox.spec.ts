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
      expect(el.querySelector('lit-virtualizer')).to.exist;
    });

    it('should render options for each option', () => {
      const renderedOptions = Array.from(el.querySelectorAll('sl-option'));

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

      const renderedOptions = Array.from(el.querySelectorAll('sl-option'));

      expect(renderedOptions.map(o => o.textContent)).to.deep.equal(
        el.options.slice(0, renderedOptions.length)
      );
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

  describe('slotted options accessibility', () => {
    it('should derive grouped option aria-label from nested slotted content', async () => {
      el = await fixture(html`
        <sl-listbox>
          <sl-option-group label="Group">
            <sl-option><span>Label</span></sl-option>
          </sl-option-group>
        </sl-listbox>
      `);
      await el.updateComplete;

      const option = el.querySelector<Option>('sl-option');

      expect(option).to.exist;
      expect(option).to.have.attribute('aria-label', 'Label (Group)');
    });

    it('should clear stale aria-label when option moves out of a group', async () => {
      const listbox = await fixture<Listbox>(html`
        <sl-listbox>
          <sl-option-group label="Group">
            <sl-option id="opt1">Option 1</sl-option>
          </sl-option-group>
          <div id="container"></div>
        </sl-listbox>
      `);
      await listbox.updateComplete;

      const option = listbox.querySelector<Option>('#opt1')!;
      const container = listbox.querySelector<HTMLElement>('#container')!;

      // Initially in group, should have generated aria-label and marker
      expect(option).to.have.attribute('aria-label', 'Option 1 (Group)');
      expect(option).to.have.attribute('data-generated-aria-label', 'true');

      // Move option out of group and re-apply accessibility (public API)
      container.appendChild(option);
      await listbox.updateComplete;
      listbox.applyFlattenedOptionAccessibility([option]);

      // aria-label should be cleared since option is no longer in a group
      expect(option).not.to.have.attribute('aria-label');
    });
  });
});
