import { fixture } from '@sl-design-system/vitest-browser-lit';
import { html } from 'lit';
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import './register.js';
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

    it('should not have an explicit shape', () => {
      expect(el).not.to.have.attribute('shape');
      expect(el.shape).to.be.undefined;
    });

    it('should have a pill shape when set', async () => {
      el.shape = 'pill';
      await el.updateComplete;

      expect(el).to.have.attribute('shape', 'pill');
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

    it('should have a focusable clear button', () => {
      const button = el.renderRoot.querySelector('button');

      expect(button).to.exist;
      expect(button).not.to.have.attribute('tabindex', '-1');
    });

    it('should move focus from input to clear button when pressing Tab', async () => {
      const button = el.renderRoot.querySelector<HTMLButtonElement>('button'),
        input = el.querySelector<HTMLInputElement>('input');

      input?.focus();
      await userEvent.tab();

      expect(el.shadowRoot?.activeElement).to.equal(button);
    });

    it('should not have a clear button when disabled', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el.renderRoot.querySelector('button')).to.not.exist;
    });

    it('should not have a clear button when readonly', async () => {
      el.readonly = true;
      await el.updateComplete;

      expect(el.renderRoot.querySelector('button')).to.not.exist;
    });

    it('should clear the input when the clear button is clicked', async () => {
      el.renderRoot.querySelector('button')?.click();
      await el.updateComplete;

      expect(el.value).to.equal('');
    });

    it('should receive focus on the clear button', () => {
      const button = el.renderRoot.querySelector<HTMLButtonElement>('button');

      button?.focus();

      expect(el.shadowRoot?.activeElement).to.equal(button);
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
      const onSearch: (value: string) => void = spy();

      el.addEventListener('sl-search', (event: SlSearchEvent) => onSearch(event.detail));
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
      const onSearch: (value: string) => void = spy();

      el.addEventListener('sl-search', (event: SlSearchEvent) => onSearch(event.detail));
      el.focus();
      await userEvent.keyboard('{Escape}');

      expect(onSearch).to.be.calledOnceWith('');
    });

    it('should emit a search event with the value when enter is pressed', async () => {
      const onSearch: (value: string) => void = spy();

      el.addEventListener('sl-search', (event: SlSearchEvent) => onSearch(event.detail));
      el.focus();
      await userEvent.keyboard('{Enter}');

      expect(onSearch).to.be.calledOnce;
      expect(onSearch).to.be.calledWith('Foo');
    });

    it('should clear the input when Enter is pressed on the clear button', async () => {
      const button = el.renderRoot.querySelector<HTMLButtonElement>('button');

      button?.focus();
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      expect(el.value).to.equal('');
      expect(document.activeElement).to.equal(el.querySelector('input'));
    });

    it('should not emit a search event with the old value when Enter is pressed on the clear button', async () => {
      const onSearch: (value: string) => void = spy(),
        button = el.renderRoot.querySelector<HTMLButtonElement>('button');

      el.addEventListener('sl-search', (event: SlSearchEvent) => onSearch(event.detail));

      button?.focus();
      await userEvent.keyboard('{Enter}');

      expect(onSearch).to.have.been.calledOnceWith('');
    });

    it('should focus the input when Escape is pressed on the clear button', async () => {
      const button = el.renderRoot.querySelector<HTMLButtonElement>('button');

      button?.focus();
      await userEvent.keyboard('{Escape}');
      await el.updateComplete;

      expect(el.value).to.equal('');
      expect(document.activeElement).to.equal(el.querySelector('input'));
    });

    it('should clear the input when Space is pressed on the clear button', async () => {
      const button = el.renderRoot.querySelector<HTMLButtonElement>('button');

      button?.focus();
      await userEvent.keyboard('{Space}');
      await el.updateComplete;

      expect(el.value).to.equal('');
      expect(document.activeElement).to.equal(el.querySelector('input'));
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
      await el.updateComplete;

      // Should not emit immediately
      expect(onSearch).not.to.have.been.called;

      // Wait for debounce (300ms + buffer)
      await new Promise(resolve => setTimeout(resolve, 400));

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
      await el.updateComplete;

      // Wait 200ms (less than debounce period)
      await new Promise(resolve => setTimeout(resolve, 200));

      // Type second character - should reset timer
      await userEvent.type(el.input, 'e');
      await el.updateComplete;

      // Wait another 200ms (still less than 300ms from second character)
      await new Promise(resolve => setTimeout(resolve, 200));

      // Should not have emitted yet
      expect(onSearch).not.to.have.been.called;

      // Wait for remaining debounce time + buffer
      await new Promise(resolve => setTimeout(resolve, 200));

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
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onSearch).to.have.been.calledOnce;
      expect(onSearch).to.have.been.calledWith('hello');

      // Clear and start new typing session
      el.clear();
      await el.updateComplete;
      await userEvent.type(el.input, 'world');
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onSearch).to.have.been.calledThrice;
      expect(onSearch).to.have.been.calledWith('world');
    });

    it('should emit sl-clear event and search event for empty value after debounce', async () => {
      const onSearch: (value: string) => void = spy();
      const onClear = spy();

      el.addEventListener('sl-search', (event: SlSearchEvent) => onSearch(event.detail));
      el.addEventListener('sl-clear', onClear);
      el.focus();

      // Type and then delete
      await userEvent.type(el.input, 'a');
      await el.updateComplete;
      await userEvent.keyboard('{Backspace}');
      await el.updateComplete;

      // Wait for debounce + buffer
      await new Promise(resolve => setTimeout(resolve, 400));

      // Should emit search with empty string for empty value, and should emit clear
      expect(onSearch).to.have.been.calledOnceWith('');
      expect(onClear).to.have.been.calledOnce;
    });

    it('should cancel debounced search when Enter is pressed', async () => {
      const onSearch: (value: string) => void = spy();

      el.addEventListener('sl-search', (event: SlSearchEvent) => onSearch(event.detail));
      el.focus();

      // Type some text
      await userEvent.type(el.input, 'test');
      await el.updateComplete;

      // Press Enter before debounce completes
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;

      // Should emit immediately from Enter press
      expect(onSearch).to.have.been.calledOnce;
      expect(onSearch).to.have.been.calledWith('test');

      // Wait for where debounce would have fired + buffer
      await new Promise(resolve => setTimeout(resolve, 400));

      // Should still only have been called once (debounce was cancelled)
      expect(onSearch).to.have.been.calledOnce;
    });
  });

  describe('suggestions', () => {
    const phrases = ['García', 'High West Institute', 'Elementary High School'];
    const list = () => el.querySelector('sl-listbox')!;
    const options = () => [...list().querySelectorAll('sl-option')];
    const searchSpy = () => {
      const listener = spy();
      el.addEventListener('sl-search', (event: SlSearchEvent) => {
        listener(event.detail);
      });
      return listener;
    };

    beforeEach(async () => {
      el = await fixture(
        html`<sl-search-field
          aria-label="Search"
          autocomplete="both"
          .suggestions=${phrases}></sl-search-field>`
      );
    });

    it('keeps the typed value separate from the proposed suffix', async () => {
      await userEvent.type(el.input, 'Gar');
      await el.updateComplete;
      expect(el.value).to.equal('Gar');
      expect(el.input.value).to.equal('García');
      expect(el.input.selectionStart).to.equal(3);
      expect(el.input.selectionEnd).to.equal(6);
      expect(options()).to.have.length(1);
    });

    it('searches typed words on Enter and cancels the pending search', async () => {
      const onSearch = searchSpy();
      await userEvent.type(el.input, 'Gar');
      await userEvent.keyboard('{Enter}');
      await el.updateComplete;
      expect(onSearch).to.have.been.calledOnceWith('Gar');
      expect(el.input.value).to.equal('Gar');
      expect(list().hidden).to.be.true;
      await new Promise(resolve => setTimeout(resolve, 350));
      expect(onSearch).to.have.been.calledOnce;
    });

    for (const key of ['ArrowRight', 'End']) {
      it(`accepts the inline completion with ${key}`, async () => {
        await userEvent.type(el.input, 'Gar');
        await userEvent.keyboard(`{${key}}`);
        await el.updateComplete;
        expect(el.value).to.equal('García');
        const onSearch = searchSpy();
        await userEvent.keyboard('{Enter}');
        expect(onSearch).to.have.been.calledOnceWith('García');
      });
    }

    it('deletes a typed character in one Backspace despite the selected suffix', async () => {
      await userEvent.type(el.input, 'Gar');
      await userEvent.keyboard('{Backspace}');
      await el.updateComplete;
      expect(el.value).to.equal('Ga');
      expect(el.input.value).to.equal('Ga');
      expect(list().hidden).to.be.true;
    });

    it('dismisses the suffix with Delete while preserving typed words', async () => {
      await userEvent.type(el.input, 'Gar');
      await userEvent.keyboard('{Delete}');
      expect(el.value).to.equal('Gar');
      expect(el.input.value).to.equal('Gar');
    });

    it('does not complete a contains match that is not a prefix', async () => {
      el.matching = 'contains';
      await userEvent.type(el.input, 'School');
      await el.updateComplete;
      expect(el.input.value).to.equal('School');
      expect(options()).to.have.length(1);
      expect(options()[0].querySelector('strong')?.textContent).to.equal('School');
    });

    it('filters by prefix and emphasises the remainder', async () => {
      await userEvent.type(el.input, 'High');
      await el.updateComplete;
      expect(options()).to.have.length(1);
      expect(options()[0].querySelector('strong')?.textContent).to.equal(' West Institute');
      expect(options()[0].querySelector('span')?.textContent).to.equal('High West Institute');
    });

    it('supports contains filtering independently of inline prefix completion', async () => {
      el.matching = 'contains';
      await userEvent.type(el.input, 'High');
      await el.updateComplete;
      expect(options()).to.have.length(2);
      expect(options()[0].querySelector('strong')?.textContent).to.equal('High');
      expect(options()[1].querySelector('strong')?.textContent).to.equal('High');
      expect(el.input.value).to.equal('High West Institute');
    });

    it('moves through Clear to the separately focusable list with Tab', async () => {
      await userEvent.type(el.input, 'Gar');
      await userEvent.tab();
      expect(el.renderRoot.querySelector('button')?.matches(':focus')).to.be.true;
      await userEvent.tab();
      expect(document.activeElement).to.equal(list());
      expect(list().getAttribute('aria-activedescendant')).to.equal(options()[0].id);
      expect(el.input.getAttribute('aria-controls')).to.equal(list().id);
    });

    it('searches the focused suggestion on Enter in the list', async () => {
      const onSearch = searchSpy();
      el.matching = 'contains';
      await userEvent.type(el.input, 'High');
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
      await el.updateComplete;
      expect(onSearch).to.have.been.calledOnceWith('Elementary High School');
      expect(el.value).to.equal('Elementary High School');
      expect(document.activeElement).to.equal(el.input);
      expect(list().hidden).to.be.true;
    });

    it('closes the list with Escape and returns focus without clearing', async () => {
      await userEvent.type(el.input, 'Gar');
      await userEvent.keyboard('{ArrowDown}{Escape}');
      await el.updateComplete;
      expect(document.activeElement).to.equal(el.input);
      expect(el.value).to.equal('Gar');
      expect(list().hidden).to.be.true;
      await userEvent.keyboard('{Escape}');
      expect(el.value).to.equal('');
    });

    it('selects suggestions by pointer', async () => {
      const onSearch = searchSpy();
      await userEvent.type(el.input, 'Gar');
      await userEvent.click(options()[0]);
      expect(onSearch).to.have.been.calledOnceWith('García');
    });

    it('counts only non-space characters towards the configurable threshold', async () => {
      el.autocomplete = 'list';
      await userEvent.type(el.input, ' G ');
      await el.updateComplete;
      expect(list().hidden).to.be.true;
      el.suggestionThreshold = 1;
      await el.updateComplete;
      expect(list().hidden).to.be.false;
    });

    for (const mode of ['off', 'inline', 'list'] as const) {
      it(`supports ${mode} mode`, async () => {
        el.autocomplete = mode;
        await userEvent.type(el.input, 'Gar');
        await el.updateComplete;
        expect(list().hidden).to.equal(mode !== 'list');
        expect(el.input.value).to.equal(mode === 'inline' ? 'García' : 'Gar');
        expect(el.input.autocomplete).to.equal('off');
        expect(el.input.getAttribute('aria-autocomplete')).to.equal(mode === 'off' ? 'none' : mode);
      });
    }

    for (const state of ['loading', 'unavailable', 'empty'] as const) {
      it(`keeps searching available in the ${state} state`, async () => {
        if (state === 'empty') el.suggestions = [];
        else el[state] = true;
        const onSearch = searchSpy();
        await userEvent.type(el.input, 'Gar');
        await el.updateComplete;
        const message = el.querySelector('[role="status"]') as HTMLElement;
        expect(message.hidden).to.be.false;
        expect(message.textContent).to.equal(
          state === 'loading'
            ? 'Finding suggestions…'
            : state === 'unavailable'
              ? 'Suggestions unavailable'
              : 'No suggested searches'
        );
        expect(el.input.value).to.equal('Gar');
        await userEvent.keyboard('{Enter}');
        expect(onSearch).to.have.been.calledOnceWith('Gar');
      });
    }

    it('updates suggestions when an asynchronous response arrives', async () => {
      el.loading = true;
      await userEvent.type(el.input, 'Gar');
      el.suggestions = ['Garcia Ruiz'];
      el.loading = false;
      await el.updateComplete;
      expect(options()).to.have.length(1);
      expect(el.value).to.equal('Gar');
      expect(el.input.value).to.equal('Garcia Ruiz');
    });

    it('accepts native options and observes changes to them', async () => {
      el.suggestions = undefined;
      const option = document.createElement('option');
      option.textContent = 'Garland';
      el.append(option);
      await userEvent.type(el.input, 'Gar');
      await el.updateComplete;
      expect(el.input.value).to.equal('Garland');
      option.textContent = 'Garden';
      await new Promise(resolve => setTimeout(resolve, 0));
      await el.updateComplete;
      expect(el.input.value).to.equal('Garden');
    });

    it('matches accents and expanded letters while highlighting original text', async () => {
      el.autocomplete = 'list';
      el.suggestions = ['García', 'Straße'];
      await userEvent.type(el.input, 'Garcia');
      await el.updateComplete;
      expect(options()).to.have.length(1);
      expect(options()[0].value).to.equal('García');
      el.clear();
      await userEvent.type(el.input, 'Strasse');
      await el.updateComplete;
      expect(options()).to.have.length(1);
      expect(options()[0].value).to.equal('Straße');
    });

    it('uses original display offsets for a decomposed accent in inline completion', async () => {
      el.suggestions = ['Garci\u0301a Ruiz'];
      await userEvent.type(el.input, 'Garci');
      await el.updateComplete;
      expect(el.input.value).to.equal('Garcia Ruiz');
      expect(el.value).to.equal('Garci');
    });

    it('searches only typed words when the debounce expires', async () => {
      const onSearch = searchSpy();
      await userEvent.type(el.input, 'Gar');
      await new Promise(resolve => setTimeout(resolve, 350));
      expect(onSearch).to.have.been.calledOnceWith('Gar');
      expect(el.input.value).to.equal('García');
    });

    it('closes on focus leaving the component', async () => {
      await userEvent.type(el.input, 'Gar');
      await userEvent.tab();
      await userEvent.tab();
      await userEvent.tab();
      await el.updateComplete;
      expect(list().hidden).to.be.true;
      expect(el.input.value).to.equal('Gar');
    });

    it('keeps the field size unchanged when overlay suggestions open', async () => {
      const height = el.getBoundingClientRect().height;
      await userEvent.type(el.input, 'Gar');
      await el.updateComplete;
      expect(el.getBoundingClientRect().height).to.equal(height);
      el.suggestionPlacement = 'flow';
      await el.updateComplete;
      expect(el.getBoundingClientRect().height).to.be.greaterThan(height);
    });

    it('ignores Enter during composition', () => {
      const onSearch = searchSpy();
      el.input.dispatchEvent(
        new CompositionEvent('compositionstart', { bubbles: true, composed: true })
      );
      el.input.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          isComposing: true,
          bubbles: true,
          composed: true
        })
      );
      expect(onSearch).not.to.have.been.called;
    });

    it('closes suggestions when disabled or readonly', async () => {
      await userEvent.type(el.input, 'Gar');
      el.readonly = true;
      await el.updateComplete;
      expect(list().hidden).to.be.true;
      expect(el.input.value).to.equal('Gar');
    });
  });
});
