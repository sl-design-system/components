import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type Listbox, type ListboxItem } from './listbox.js';
import { type Option } from './option.js';

const waitForNextFrame = (): Promise<void> =>
  new Promise(resolve => requestAnimationFrame(() => resolve()));

const waitForVirtualizer = async (): Promise<void> => {
  await waitForNextFrame();
  await waitForNextFrame();
};

const getVirtualizer = (listbox: Listbox): Element | undefined =>
  Array.from(listbox.children).find(
    child =>
      child.hasAttribute('data-virtual-list') ||
      child.tagName.toLowerCase().includes('virtual-list')
  );

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
      const virtualList = getVirtualizer(el);

      return Array.from(virtualList?.querySelectorAll<T>(selector) ?? []);
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
      await waitForVirtualizer();
    });

    it('should render a virtualizer', () => {
      expect(getVirtualizer(el)).to.exist;
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
      await waitForVirtualizer();

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
      await waitForVirtualizer();

      // Now should have the attribute
      expect(getVirtualizer(unconstrained)).to.exist;
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
      await waitForVirtualizer();

      // Should NOT have attribute when consumer sets explicit inline height
      // This prevents the CSS fallback from clamping the consumer's height
      expect(withHeight.hasAttribute('data-virtual-unconstrained')).to.be.false;

      // The inline height should not be clamped
      const computedStyle = getComputedStyle(withHeight);
      // Height in pixels, roughly 30rem = 480px at 16px base
      expect(parseFloat(computedStyle.height)).to.be.greaterThan(400);
    });

    it('should respect CSS-set max-height constraints', async () => {
      // Add CSS rule to document
      const style = document.createElement('style');
      style.textContent = '.custom-listbox { max-height: 25rem; }';
      document.head.appendChild(style);

      const withCssHeight = await fixture<Listbox>(html`
        <sl-listbox class="custom-listbox"></sl-listbox>
      `);

      // Set options to trigger virtual list
      withCssHeight.options = options;
      withCssHeight.optionLabelPath = 'label';
      withCssHeight.optionValuePath = 'value';

      await withCssHeight.updateComplete;
      await waitForVirtualizer();

      // Should NOT have attribute when consumer sets max-height via CSS
      // This prevents the 20rem fallback from clamping the consumer's 25rem constraint
      expect(withCssHeight.hasAttribute('data-virtual-unconstrained')).to.be.false;

      // Verify the CSS max-height is respected
      const computedStyle = getComputedStyle(withCssHeight);
      // 25rem = 400px at 16px base
      expect(computedStyle.maxHeight).to.not.equal('none');

      // Cleanup
      document.head.removeChild(style);
    });

    it('should NOT prevent fallback for CSS-set height (known limitation)', async () => {
      // Add CSS rule to document
      const style = document.createElement('style');
      style.textContent = '.height-listbox { height: 30rem; }';
      document.head.appendChild(style);

      const withCssHeight = await fixture<Listbox>(html`
        <sl-listbox class="height-listbox"></sl-listbox>
      `);

      // Set options to trigger virtual list
      withCssHeight.options = options;
      withCssHeight.optionLabelPath = 'label';
      withCssHeight.optionValuePath = 'value';

      await withCssHeight.updateComplete;
      await waitForVirtualizer();

      // Known limitation: attribute IS applied when height is set via CSS
      // We can't reliably detect explicit height from computed styles
      expect(withCssHeight.hasAttribute('data-virtual-unconstrained')).to.be.true;

      // This means the fallback clamps the CSS height
      // Workaround: use inline style or max-height instead

      // Cleanup
      document.head.removeChild(style);
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

  describe('flattened position cache', () => {
    it('should compute flattened positions correctly with grouped options', async () => {
      type GroupedOption = {
        group: string;
        label: string;
        selected: boolean;
        value: string;
      };

      const listbox = await fixture<Listbox<GroupedOption>>(html`
        <sl-listbox
          option-group-path="group"
          option-label-path="label"
          option-selected-path="selected"
          option-value-path="value"></sl-listbox>
      `);

      listbox.options = [
        { group: 'Fruits', label: 'Apple', selected: false, value: 'apple' },
        { group: 'Fruits', label: 'Banana', selected: true, value: 'banana' },
        { group: 'Vegetables', label: 'Carrot', selected: false, value: 'carrot' },
        { group: 'Vegetables', label: 'Potato', selected: false, value: 'potato' }
      ];
      await listbox.updateComplete;

      const items = listbox.items!,
        optionItems = items.filter(
          (item): item is Extract<ListboxItem<GroupedOption, string>, { option: GroupedOption }> =>
            'option' in item
        ),
        groupItems = items.filter(item => !('option' in item));

      expect(listbox.getFlattenedSetSize()).to.equal(4);
      expect(optionItems.map(item => listbox.getFlattenedPosition(item))).to.deep.equal([
        0, 1, 2, 3
      ]);
      expect(groupItems.map(item => listbox.getFlattenedPosition(item))).to.deep.equal([-1, -1]);
    });

    it('should resolve flattened position for payload items with same id but different object instance', async () => {
      const listbox = await fixture<Listbox<string>>(html`<sl-listbox></sl-listbox>`),
        items: Array<ListboxItem<string, string>> = [
          { id: 'group-a', label: 'Group A' },
          { id: 'opt-a', label: 'Option A', option: 'A', selected: false, value: 'A' },
          { id: 'opt-b', label: 'Option B', option: 'B', selected: true, value: 'B' }
        ];

      listbox.items = items;
      await listbox.updateComplete;
      await waitForVirtualizer();

      const payloadWithSameId: ListboxItem<string, string> = {
        id: 'opt-b',
        label: 'Option B (payload clone)',
        option: 'B',
        selected: false,
        value: 'B'
      };

      expect(payloadWithSameId).not.to.equal(items[2]);
      expect(listbox.getFlattenedPosition(payloadWithSameId)).to.equal(1);
    });

    it('should refresh flattened positions across options/items changes and after clearing items', async () => {
      type SimpleOption = { label: string; value: string };

      const listbox = await fixture<Listbox<SimpleOption, string>>(html`
        <sl-listbox option-label-path="label" option-value-path="value"></sl-listbox>
      `);

      listbox.options = [
        { label: 'One', value: 'one' },
        { label: 'Two', value: 'two' }
      ];
      await listbox.updateComplete;
      await waitForVirtualizer();

      const firstOptionItems = listbox.items!.filter(
          (item): item is Extract<ListboxItem<SimpleOption, string>, { option: SimpleOption }> =>
            'option' in item
        ),
        firstPayload = { ...firstOptionItems[0] };

      expect(listbox.getFlattenedSetSize()).to.equal(2);
      expect(listbox.getFlattenedPosition(firstPayload)).to.equal(0);

      listbox.options = [{ label: 'Three', value: 'three' }];
      await listbox.updateComplete;
      await waitForVirtualizer();

      const secondOptionItems = listbox.items!.filter(
        (item): item is Extract<ListboxItem<SimpleOption, string>, { option: SimpleOption }> =>
          'option' in item
      );

      expect(listbox.getFlattenedSetSize()).to.equal(1);
      expect(listbox.getFlattenedPosition(secondOptionItems[0])).to.equal(0);
      expect(listbox.getFlattenedPosition(firstPayload)).to.equal(-1);

      listbox.items = [
        { id: 'manual-group', label: 'Manual Group' },
        {
          id: 'manual-opt-1',
          label: 'Manual One',
          option: { label: 'M1', value: 'm1' },
          value: 'm1'
        },
        {
          id: 'manual-opt-2',
          label: 'Manual Two',
          option: { label: 'M2', value: 'm2' },
          value: 'm2'
        }
      ];
      await listbox.updateComplete;
      await waitForVirtualizer();

      const manualPayload: ListboxItem<SimpleOption, string> = {
        id: 'manual-opt-2',
        label: 'Manual Two clone',
        option: { label: 'M2', value: 'm2' },
        value: 'm2'
      };

      expect(listbox.getFlattenedSetSize()).to.equal(2);
      expect(listbox.getFlattenedPosition(manualPayload)).to.equal(1);

      listbox.items = undefined;
      await listbox.updateComplete;
      await waitForVirtualizer();

      expect(listbox.getFlattenedSetSize()).to.equal(0);
      expect(listbox.getFlattenedPosition(manualPayload)).to.equal(-1);
    });

    it('should refresh flattened cache immediately when items is replaced', async () => {
      const listbox = await fixture<Listbox<string, string>>(html`<sl-listbox></sl-listbox>`);

      listbox.items = [
        { id: 'initial-opt-1', label: 'Initial One', option: 'one', value: 'one' },
        { id: 'initial-opt-2', label: 'Initial Two', option: 'two', value: 'two' }
      ];
      await listbox.updateComplete;

      expect(listbox.getFlattenedSetSize()).to.equal(2);

      listbox.items = [
        { id: 'replacement-group', label: 'Replacement Group' },
        { id: 'replacement-opt-1', label: 'Replacement One', option: 'one', value: 'one' }
      ];
      await listbox.updateComplete;

      const replacementPayload: ListboxItem<string, string> = {
        id: 'replacement-opt-1',
        label: 'Replacement One payload',
        option: 'one',
        value: 'one'
      };

      expect(listbox.getFlattenedPosition(replacementPayload)).to.equal(0);
      expect(listbox.getFlattenedSetSize()).to.equal(1);
    });
  });
});
