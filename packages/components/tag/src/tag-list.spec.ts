import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { type TagList } from './tag-list.js';

describe('sl-tag-list', () => {
  let el: TagList;
  const triggerVisibilityUpdate = async (): Promise<void> => {
    const slot = el.renderRoot.querySelector('slot');
    slot?.dispatchEvent(new Event('slotchange'));
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  };

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-tag-list>
          <sl-tag>My label 1</sl-tag>
          <sl-tag>My label 2</sl-tag>
          <sl-tag>My label 3</sl-tag>
        </sl-tag-list>
      `);
    });

    it('should have a list role', () => {
      expect(el).to.have.attribute('role', 'list');
    });

    it('should not be disabled', () => {
      expect(el.disabled).not.to.be.true;
    });

    it('should not have an explicit variant', () => {
      expect(el).not.to.have.attribute('variant');
      expect(el.variant).to.be.undefined;
    });

    it('should propagate the variant to the tags', async () => {
      el.variant = 'info';
      await el.updateComplete;

      const variant = Array.from(el.querySelectorAll('sl-tag')).map(tag => tag.variant);

      expect(variant).to.deep.equal(['info', 'info', 'info']);
    });

    it('should not have size', () => {
      expect(el).not.to.have.attribute('size');
      expect(el.size).to.be.undefined;
    });

    it('should propagate the size to the tags', async () => {
      el.size = 'lg';
      await el.updateComplete;

      const sizes = Array.from(el.querySelectorAll('sl-tag')).map(tag => tag.size);

      expect(sizes).to.deep.equal(['lg', 'lg', 'lg']);
    });

    it('should not be stacked', () => {
      expect(el).not.to.have.attribute('stacked');
      expect(el.stacked).not.to.be.true;
    });
  });

  describe('removable', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-tag-list>
          <sl-tag removable>My label 1</sl-tag>
          <sl-tag removable>My label 2</sl-tag>
          <sl-tag removable>My label 3</sl-tag>
        </sl-tag-list>
      `);
    });

    it('should focus the previous tag when a tag is removed', async () => {
      const tags = Array.from(el.querySelectorAll('sl-tag'));

      tags.at(-1)?.focus();
      await userEvent.keyboard('{Backspace}');

      expect(document.activeElement).to.equal(tags.at(-2));
    });
  });

  describe('stacked', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-tag-list stacked style="inline-size: 200px;">
          <sl-tag removable>My label 1</sl-tag>
          <sl-tag removable>My label 2</sl-tag>
          <sl-tag removable>My label 3</sl-tag>
          <sl-tag removable>My label 4</sl-tag>
          <sl-tag removable>My label 5</sl-tag>
          <sl-tag removable>My label 6</sl-tag>
          <sl-tag removable>My label 7</sl-tag>
          <sl-tag removable>My label 8</sl-tag>
        </sl-tag-list>
      `);

      // Give the resize observer time to do its thing
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should have a stack', () => {
      expect(el.renderRoot.querySelector('.stack')).to.exist;
    });

    it('should disable the stack tag when the list is disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      const tag = el.renderRoot.querySelector('sl-tag');

      expect(tag).to.have.attribute('disabled');
    });

    it('should have a tooltip for the stack', () => {
      const tag = el.renderRoot.querySelector('sl-tag'),
        container = tag?.renderRoot.querySelector('[part="container"]'),
        tooltip = tag?.renderRoot.querySelector('sl-tooltip'),
        text = tooltip?.textContent?.trim() ?? '';

      expect(container?.ariaDescribedByElements).to.include(tooltip);
      expect(tooltip).to.exist;
      expect(text).to.include('List of hidden elements:');
      expect(text).to.include(
        'My label 1, My label 2, My label 3, My label 4, My label 5, My label 6, My label 7'
      );
    });

    it('should have a stack with a tag, which contains the stack size', () => {
      const tag = el.renderRoot.querySelector('sl-tag');

      expect(tag).to.exist;
      expect(tag).to.have.trimmed.text('+7');
    });

    it('should have hidden tags with tabindex -1', async () => {
      // Give some time to updateVisibility
      await new Promise(resolve => setTimeout(resolve, 60));

      const tag = el.renderRoot.querySelector('sl-tag');

      expect(tag).to.exist;

      const tabindexes = [
          tag!.tabIndex,
          ...Array.from(el.querySelectorAll('sl-tag')).map(tag => tag.tabIndex)
        ],
        visibility = [
          getComputedStyle(tag!).display,
          ...Array.from(el.querySelectorAll('sl-tag')).map(tag => getComputedStyle(tag).display)
        ];

      expect(visibility).to.deep.equal([
        'flex',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'none',
        'flex'
      ]);
      expect(tabindexes).to.deep.equal([0, -1, -1, -1, -1, -1, -1, -1, -1]);
    });

    it('should not have a stack when there is enough space', async () => {
      // Give the `#breakResizeObserverLoop` time to do its thing
      await new Promise(resolve => setTimeout(resolve, 60));

      el.style.inlineSize = '2000px';
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(el.renderRoot.querySelector('.stack')).to.not.be.displayed;
    });

    it('should update the stack size when a tag is removed', async () => {
      const tag = el.renderRoot.querySelector('sl-tag');

      expect(tag).to.have.trimmed.text('+7');

      (el.querySelector('sl-tag:last-child') as HTMLElement)?.focus();
      await userEvent.keyboard('{Backspace}');

      await new Promise<void>((resolve, reject) => {
        const start = performance.now();
        const timeoutMs = 2000;
        const check = (): void => {
          if (tag?.textContent?.trim() === '+6') {
            resolve();
          } else if (performance.now() - start > timeoutMs) {
            reject(new Error('Timed out waiting for stack size to update to +6'));
          } else {
            requestAnimationFrame(check);
          }
        };
        requestAnimationFrame(check);
      });

      expect(tag).to.have.trimmed.text('+6');
    });

    it('should stop observing the previous stack element when stacked mode is disabled', async () => {
      const stack = el.renderRoot.querySelector('.stack') as HTMLElement;
      const unobserveSpy = vi.spyOn(ResizeObserver.prototype, 'unobserve');

      el.stacked = false;
      await el.updateComplete;

      expect(unobserveSpy.mock.calls.some(([target]) => target === stack)).to.be.true;

      unobserveSpy.mockRestore();
    });
  });

  describe('sub-pixel buffer', () => {
    const listStyles = 'gap: 0px; padding: 0; margin: 0; border: none;',
      tagStyles =
        'inline-size: 100px; margin: 0; padding: 0; border: none; box-sizing: border-box;';

    it('should not collapse when contents exceed container width by less than 0.5px', async () => {
      // We create a scenario where we can precisely control the width.
      // The component logic uses getBoundingClientRect().width, so we stub it
      // to avoid relying on actual browser sub-pixel rendering.
      el = await fixture(html`
        <sl-tag-list stacked style=${listStyles}>
          <sl-tag style=${tagStyles}>Tag 1</sl-tag>
          <sl-tag style=${tagStyles}>Tag 2</sl-tag>
        </sl-tag-list>
      `);

      // Total tags width = 100 + 100 = 200px (gap is 0)
      // We set the container width to 199.7px (diff = 0.3px, which is < 0.5px)
      el.getBoundingClientRect = () => new DOMRect(0, 0, 199.7, 20);

      Array.from(el.querySelectorAll('sl-tag')).forEach(tag => {
        tag.getBoundingClientRect = () => new DOMRect(0, 0, 100, 20);
      });

      await triggerVisibilityUpdate();

      const stack = el.renderRoot.querySelector('.stack') as HTMLElement;

      expect(stack.style.display).to.equal('none');
    });

    it('should collapse when contents exceed container width by more than 0.5px', async () => {
      el = await fixture(html`
        <sl-tag-list stacked style=${listStyles}>
          <sl-tag style=${tagStyles}>Tag 1</sl-tag>
          <sl-tag style=${tagStyles}>Tag 2</sl-tag>
        </sl-tag-list>
      `);

      // Total = 200px. Container = 199.4px (diff = 0.6px > 0.5px)
      el.getBoundingClientRect = () => new DOMRect(0, 0, 199.4, 20);

      Array.from(el.querySelectorAll('sl-tag')).forEach(tag => {
        tag.getBoundingClientRect = () => new DOMRect(0, 0, 100, 20);
      });

      await triggerVisibilityUpdate();

      const stack = el.renderRoot.querySelector('.stack') as HTMLElement;
      const tags = Array.from(el.querySelectorAll('sl-tag')) as HTMLElement[];
      const hiddenTags = tags.filter(tag => tag.style.display === 'none');

      // Stack should be visible and at least one tag should be collapsed.
      expect(stack.style.display).to.not.equal('none');
      expect(hiddenTags.length).to.be.greaterThan(0);
    });
  });

  describe('visibility edge cases', () => {
    it('should mark visibility as resolved after the initial stabilization pass', async () => {
      el = await fixture(html`<sl-tag-list stacked></sl-tag-list>`);

      expect(el).not.to.have.attribute('data-visibility-resolved');

      const firstTag = document.createElement('sl-tag');
      firstTag.textContent = 'Tag 1';
      const secondTag = document.createElement('sl-tag');
      secondTag.textContent = 'Tag 2';
      el.append(firstTag, secondTag);

      await triggerVisibilityUpdate();
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

      expect(el).to.have.attribute('data-visibility-resolved');
    });

    it('should use column gap when gap shorthand has two values', async () => {
      el = await fixture(html`
        <sl-tag-list stacked style="gap: 4px 12px; padding: 0; margin: 0; border: none;">
          <sl-tag style="inline-size: 100px;">Tag 1</sl-tag>
          <sl-tag style="inline-size: 100px;">Tag 2</sl-tag>
          <sl-tag style="inline-size: 100px;">Tag 3</sl-tag>
        </sl-tag-list>
      `);

      // With column-gap=12px and stack=40px, container=260px should keep only the last tag visible.
      el.getBoundingClientRect = () => new DOMRect(0, 0, 260, 20);
      el.stack!.getBoundingClientRect = () => new DOMRect(0, 0, 40, 20);

      Array.from(el.querySelectorAll('sl-tag')).forEach(tag => {
        tag.getBoundingClientRect = () => new DOMRect(0, 0, 100, 20);
      });

      await triggerVisibilityUpdate();

      const tags = Array.from(el.querySelectorAll('sl-tag'));
      const visibility = tags.map(t => t.style.display);

      expect(visibility).to.deep.equal(['none', 'none', '']);
      expect(el.stackSize).to.equal(2);
    });

    it('should keep the last tag visible when it fits in the remaining width', async () => {
      el = await fixture(html`
        <sl-tag-list stacked style="gap: 10px; padding: 0; margin: 0; border: none;">
          <sl-tag style="inline-size: 100px;">Tag 1</sl-tag>
          <sl-tag style="inline-size: 100px;">Tag 2</sl-tag>
          <sl-tag style="inline-size: 100px;">Tag 3</sl-tag>
        </sl-tag-list>
      `);

      // Total tags: 300px + 20px gaps = 320px
      // Container is 150px, stack 40px, gap 10px => remaining width for visible tags is 100px.
      // Last tag is 100px, so it should remain visible.
      el.getBoundingClientRect = () => new DOMRect(0, 0, 150, 20);
      el.stack!.getBoundingClientRect = () => new DOMRect(0, 0, 40, 20);

      Array.from(el.querySelectorAll('sl-tag')).forEach(tag => {
        tag.getBoundingClientRect = () => new DOMRect(0, 0, 100, 20);
      });

      await triggerVisibilityUpdate();

      const tags = Array.from(el.querySelectorAll('sl-tag'));
      const visibility = tags.map(t => t.style.display);

      expect(visibility).to.deep.equal(['none', 'none', '']);
      expect(el.stackSize).to.equal(2);
    });

    it('should hide the last tag when it does not fit in the remaining width', async () => {
      el = await fixture(html`
        <sl-tag-list stacked style="gap: 10px; padding: 0; margin: 0; border: none;">
          <sl-tag style="inline-size: 100px;">Tag 1</sl-tag>
          <sl-tag style="inline-size: 100px;">Tag 2</sl-tag>
          <sl-tag style="inline-size: 100px;">Tag 3</sl-tag>
        </sl-tag-list>
      `);

      // Container is 140px, stack 40px, gap 10px => remaining width is 90px.
      // Last tag is 100px, so it should be hidden.
      el.getBoundingClientRect = () => new DOMRect(0, 0, 140, 20);
      el.stack!.getBoundingClientRect = () => new DOMRect(0, 0, 40, 20);

      Array.from(el.querySelectorAll('sl-tag')).forEach(tag => {
        tag.getBoundingClientRect = () => new DOMRect(0, 0, 100, 20);
      });

      await triggerVisibilityUpdate();

      const tags = Array.from(el.querySelectorAll('sl-tag'));
      const visibility = tags.map(t => t.style.display);

      expect(visibility).to.deep.equal(['none', 'none', 'none']);
      expect(el.stackSize).to.equal(3);
    });

    it('should not overwrite cached stack width when the stack measurement is 0', async () => {
      el = await fixture(html`
        <sl-tag-list stacked style="gap: 10px; padding: 0; margin: 0; border: none;">
          <sl-tag style="inline-size: 100px;">Tag 1</sl-tag>
          <sl-tag style="inline-size: 100px;">Tag 2</sl-tag>
        </sl-tag-list>
      `);

      el.stackInlineSize = 40;
      el.getBoundingClientRect = () => new DOMRect(0, 0, 250, 20);
      el.stack!.getBoundingClientRect = () => new DOMRect(0, 0, 0, 20);

      Array.from(el.querySelectorAll('sl-tag')).forEach(tag => {
        tag.getBoundingClientRect = () => new DOMRect(0, 0, 100, 20);
      });

      await triggerVisibilityUpdate();

      expect(el.stackInlineSize).to.equal(40);
    });

    it('should unstack tags after a stale collapsed-width measurement', async () => {
      el = await fixture(html`
        <sl-tag-list stacked style="gap: 10px; padding: 0; margin: 0; border: none;">
          <sl-tag style="inline-size: 100px;">Tag 1</sl-tag>
          <sl-tag style="inline-size: 100px;">Tag 2</sl-tag>
        </sl-tag-list>
      `);

      const tags = Array.from(el.querySelectorAll('sl-tag')) as HTMLElement[];

      el.stackInlineSize = 40;
      tags.forEach(tag => {
        tag.style.display = 'none';
        tag.getBoundingClientRect = () => new DOMRect(0, 0, 100, 20);
      });

      // Reproduce a collapsed-width trap:
      // - when all tags are hidden, host width appears very small (120px)
      // - when tags are visible, there is enough real space (260px)
      el.getBoundingClientRect = () => {
        const visibleTags = tags.filter(tag => tag.style.display !== 'none').length;

        return new DOMRect(0, 0, visibleTags === 0 ? 120 : 260, 20);
      };

      await triggerVisibilityUpdate();

      const stack = el.renderRoot.querySelector('.stack') as HTMLElement;

      expect(tags.map(tag => tag.style.display)).to.deep.equal(['', '']);
      expect(el.stackSize).to.equal(0);
      expect(stack.style.display).to.equal('none');
    });
  });
});
