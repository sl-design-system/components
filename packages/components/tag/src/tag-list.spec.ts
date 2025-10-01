import { fixture } from '@sl-design-system/vitest-browser-lit';
import { userEvent } from '@vitest/browser/context';
import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import '../register.js';
import { type TagList } from './tag-list.js';

describe('sl-tag', () => {
  let el: TagList;

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
      await new Promise(resolve => setTimeout(resolve, 100));
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
        tooltip = el.renderRoot.querySelector('sl-tooltip');

      expect(tooltip).to.exist;
      expect(tooltip?.id).to.equal(tag?.getAttribute('aria-labelledby'));

      const tagContent = tooltip!.textContent?.trim();

      expect(tagContent).to.exist;
      expect(tagContent!.includes('List of hidden elements:')).to.be.true;
      expect(tagContent!.includes('My label 1, My label 2, My label 3, My label 4, My label 5, My label 6, My label 7'))
        .to.be.true;
    });

    it('should have a stack with a tag, which contains the stack size', () => {
      const tag = el.renderRoot.querySelector('sl-tag');

      expect(tag).to.exist;
      expect(tag).to.have.trimmed.text('+7');
    });

    it('should have hidden tags with tabindex -1', async () => {
      // Give some time to updateVisibility
      await new Promise(resolve => setTimeout(resolve, 200));

      const tag = el.renderRoot.querySelector('sl-tag');

      expect(tag).to.exist;

      const tabindexes = [tag!.tabIndex, ...Array.from(el.querySelectorAll('sl-tag')).map(tag => tag.tabIndex)],
        visibility = [
          getComputedStyle(tag!).display,
          ...Array.from(el.querySelectorAll('sl-tag')).map(tag => getComputedStyle(tag).display)
        ];

      expect(visibility).to.deep.equal(['flex', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'flex']);
      expect(tabindexes).to.deep.equal([0, -1, -1, -1, -1, -1, -1, -1, -1]);
    });

    it('should not have a stack when there is enough space', async () => {
      // Give the `#breakResizeObserverLoop` time to do its thing
      await new Promise(resolve => setTimeout(resolve, 201));

      el.style.inlineSize = '2000px';
      await new Promise(resolve => setTimeout(resolve, 300));

      expect(el.renderRoot.querySelector('.stack')).to.not.be.displayed;
    });

    it('should update the stack size when a tag is removed', async () => {
      const tag = el.renderRoot.querySelector('sl-tag');

      expect(tag).to.have.trimmed.text('+7');

      el.querySelector('sl-tag:last-child')?.remove();
      await new Promise(resolve => setTimeout(resolve));

      expect(tag).to.have.trimmed.text('+6');
    });
  });
});
