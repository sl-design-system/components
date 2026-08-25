import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../register.js';
describe('sl-search-field', () => {
  let el;
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
    it('should emit a search event when the clear button is clicked', () => {
      const onSearch = spy();
      el.addEventListener('sl-search', event => onSearch(event.detail));
      el.renderRoot.querySelector('button')?.click();
      expect(onSearch).to.be.calledOnceWith('');
    });
    it('should emit a clear event when the escape key is pressed', async () => {
      const onClear = spy();
      el.addEventListener('sl-clear', onClear);
      el.focus();
      await userEvent.keyboard('{Escape}');
      expect(onClear).to.be.calledOnce;
    });
    it('should emit a search event when the escape key is pressed', async () => {
      const onSearch = spy();
      el.addEventListener('sl-search', event => onSearch(event.detail));
      el.focus();
      await userEvent.keyboard('{Escape}');
      expect(onSearch).to.be.calledOnceWith('');
    });
    it('should emit a search event with the value when enter is pressed', async () => {
      const onSearch = spy();
      el.addEventListener('sl-search', event => onSearch(event.detail));
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
      const onSearch = spy();
      el.addEventListener('sl-search', event => onSearch(event.detail));
      el.focus();
      await userEvent.type(el.input, 'a');
      await el.updateComplete;
      expect(onSearch).not.to.have.been.called;
      await new Promise(resolve => setTimeout(resolve, 400));
      expect(onSearch).to.have.been.calledOnce;
      expect(onSearch).to.have.been.calledWith('a');
    });
    it('should reset debounce timer when typing continues', async () => {
      const onSearch = spy();
      el.addEventListener('sl-search', event => onSearch(event.detail));
      el.focus();
      await userEvent.type(el.input, 'h');
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 200));
      await userEvent.type(el.input, 'e');
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(onSearch).not.to.have.been.called;
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(onSearch).to.have.been.calledOnce;
      expect(onSearch).to.have.been.calledWith('he');
    });
    it('should emit multiple events for separate typing sessions', async () => {
      const onSearch = spy();
      el.addEventListener('sl-search', event => onSearch(event.detail));
      el.focus();
      await userEvent.type(el.input, 'hello');
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 400));
      expect(onSearch).to.have.been.calledOnce;
      expect(onSearch).to.have.been.calledWith('hello');
      el.clear();
      await el.updateComplete;
      await userEvent.type(el.input, 'world');
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 400));
      expect(onSearch).to.have.been.calledThrice;
      expect(onSearch).to.have.been.calledWith('world');
    });
    it('should emit sl-clear event and search event for empty value after debounce', async () => {
      const onSearch = spy();
      const onClear = spy();
      el.addEventListener('sl-search', event => onSearch(event.detail));
      el.addEventListener('sl-clear', onClear);
      el.focus();
      await userEvent.type(el.input, 'a');
      await el.updateComplete;
      await userEvent.keyboard('{Backspace}');
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 400));
      expect(onSearch).to.have.been.calledOnceWith('');
      expect(onClear).to.have.been.calledOnce;
    });
    it('should cancel debounced search when Enter is pressed', async () => {
      const onSearch = spy();
      el.addEventListener('sl-search', event => onSearch(event.detail));
      el.focus();
      await userEvent.type(el.input, 'test');
      await el.updateComplete;
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;
      expect(onSearch).to.have.been.calledOnce;
      expect(onSearch).to.have.been.calledWith('test');
      await new Promise(resolve => setTimeout(resolve, 400));
      expect(onSearch).to.have.been.calledOnce;
    });
  });
});
//# sourceMappingURL=search-field.spec.js.map
