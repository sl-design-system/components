import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
import { type SearchField, type SlSearchEvent } from './search-field.js';

describe('sl-search-field', () => {
  let el: SearchField;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-search-field></sl-search-field>`);
    });

    it('should have a search icon', () => {
      expect(el.renderRoot.querySelector('sl-icon[name="search"]')).to.exist;
    });

    it('should not have a clear button', () => {
      expect(el.renderRoot.querySelector('sl-field-button')).to.not.exist;
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
      expect(el.disabled).to.be.true;
    });
  });

  describe('with value', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-search-field value="Foo"></sl-search-field>`);
    });

    it('should have a clear button', () => {
      const button = el.renderRoot.querySelector('button');

      expect(button).to.exist;
      expect(button).to.contain('sl-icon[name="circle-xmark"]');
    });

    it('should not have a clear button when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el.renderRoot.querySelector('button')).to.not.exist;
    });

    it('should clear the input when the clear button is clicked', async () => {
      el.renderRoot.querySelector('button')?.click();
      await el.updateComplete;

      expect(el.value).to.equal('');
    });

    it('should clear the input when the escape key is pressed', async () => {
      el.focus();
      await userEvent.keyboard('{Escape}');

      expect(el.value).to.equal('');
    });

    it('should focus the input when the clear button is clicked', () => {
      el.renderRoot.querySelector('button')?.click();

      expect(document.activeElement).to.equal(el.querySelector('input'));
    });

    it('should emit a clear event when the clear button is clicked', () => {
      const onClear = spy();

      el.addEventListener('sl-clear', onClear);
      el.renderRoot.querySelector('button')?.click();

      expect(onClear).to.be.calledOnce;
    });

    it('should emit a clear event when the escape key is pressed', async () => {
      const onClear = spy();

      el.addEventListener('sl-clear', onClear);
      el.focus();
      await userEvent.keyboard('{Escape}');

      expect(onClear).to.be.calledOnce;
    });

    it('should emit a search event with the value when enter is pressed', async () => {
      const onSearch: (value: string) => void = spy();

      el.addEventListener('sl-search', (event: SlSearchEvent) => onSearch(event.detail));
      el.focus();
      await userEvent.keyboard('{Enter}');

      expect(onSearch).to.be.calledOnce;
      expect(onSearch).to.be.calledWith('Foo');
    });
  });

  describe('debounced search', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-search-field></sl-search-field>`);
    });

    it('should emit sl-search event 300ms after typing stops', async () => {
      const onSearch: (value: string) => void = spy();

      el.addEventListener('sl-search', (event: SlSearchEvent) => onSearch(event.detail));
      el.focus();

      // Type a character
      await userEvent.type(el.input, 'a');

      // Should not emit immediately
      expect(onSearch).not.to.have.been.called;

      // Wait for debounce (300ms)
      await new Promise(resolve => setTimeout(resolve, 350));

      // Should have emitted after debounce period
      expect(onSearch).to.have.been.calledOnce;
      expect(onSearch).to.have.been.calledWith('a');
    });

    it('should reset debounce timer when typing continues', async () => {
      const onSearch: (value: string) => void = spy();

      el.addEventListener('sl-search', (event: SlSearchEvent) => onSearch(event.detail));
      el.focus();

      // Type first character
      await userEvent.type(el.input, 'h');

      // Wait 200ms (less than debounce period)
      await new Promise(resolve => setTimeout(resolve, 200));

      // Type second character - should reset timer
      await userEvent.type(el.input, 'e');

      // Wait another 200ms (still less than 300ms from second character)
      await new Promise(resolve => setTimeout(resolve, 200));

      // Should not have emitted yet
      expect(onSearch).not.to.have.been.called;

      // Wait for remaining debounce time
      await new Promise(resolve => setTimeout(resolve, 150));

      // Should have emitted with full text
      expect(onSearch).to.have.been.calledOnce;
      expect(onSearch).to.have.been.calledWith('he');
    });

    it('should emit multiple events for separate typing sessions', async () => {
      const onSearch: (value: string) => void = spy();

      el.addEventListener('sl-search', (event: SlSearchEvent) => onSearch(event.detail));
      el.focus();

      // First typing session
      await userEvent.type(el.input, 'hello');
      await new Promise(resolve => setTimeout(resolve, 350));

      expect(onSearch).to.have.been.calledOnce;
      expect(onSearch).to.have.been.calledWith('hello');

      // Clear and start new typing session
      el.clear();
      await userEvent.type(el.input, 'world');
      await new Promise(resolve => setTimeout(resolve, 350));

      expect(onSearch).to.have.been.calledTwice;
      expect(onSearch).to.have.been.calledWith('world');
    });

    it('should not emit search event for empty value after debounce', async () => {
      const onSearch: (value: string) => void = spy();

      el.addEventListener('sl-search', (event: SlSearchEvent) => onSearch(event.detail));
      el.focus();

      // Type and then delete
      await userEvent.type(el.input, 'a');
      await userEvent.keyboard('{Backspace}');

      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 350));

      // Should not emit for empty value
      expect(onSearch).not.to.have.been.called;
    });

    it('should cancel debounced search when Enter is pressed', async () => {
      const onSearch: (value: string) => void = spy();

      el.addEventListener('sl-search', (event: SlSearchEvent) => onSearch(event.detail));
      el.focus();

      // Type some text
      await userEvent.type(el.input, 'test');

      // Press Enter before debounce completes
      await userEvent.keyboard('{Enter}');

      // Should emit immediately from Enter press
      expect(onSearch).to.have.been.calledOnce;
      expect(onSearch).to.have.been.calledWith('test');

      // Wait for where debounce would have fired
      await new Promise(resolve => setTimeout(resolve, 350));

      // Should still only have been called once (debounce was cancelled)
      expect(onSearch).to.have.been.calledOnce;
    });
  });
});
