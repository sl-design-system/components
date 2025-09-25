import { fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { expect } from 'chai';
import { html } from 'lit';
import { spy } from 'sinon';
import { GridFilter } from './filter.js';

try {
  customElements.define('sl-grid-filter', GridFilter);
} catch {
  // empty
}

describe('sl-grid-filter', () => {
  let el: GridFilter;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-grid-filter></sl-grid-filter>`);
    });

    it('should render a search field', () => {
      const searchField = el.renderRoot.querySelector('sl-search-field');

      expect(searchField).to.exist;
      expect(searchField).to.have.property('placeholder', 'Filter by ');
      expect(searchField).to.have.property('value', '');
    });

    it('should not be active', () => {
      expect(el.active).to.not.be.true;
    });

    it('should be active after typing in the search field', async () => {
      el.renderRoot.querySelector('sl-search-field')?.focus();
      await sendKeys({ type: 'Lorem' });

      expect(el.active).to.be.true;
    });

    it('should emit the filter change event when typing in the search field', async () => {
      const onFilterChange = spy();

      el.addEventListener('sl-filter-change', onFilterChange);

      el.renderRoot.querySelector('sl-search-field')?.focus();
      await sendKeys({ type: 'Lorem' });

      expect(onFilterChange).to.have.callCount(5);
      expect(onFilterChange).to.have.been.calledWithMatch({ detail: { value: 'Lorem' } });
    });

    it('should emit the filter change event when clearing the search field', async () => {
      const onFilterChange = spy(),
        searchField = el.renderRoot.querySelector('sl-search-field');

      el.addEventListener('sl-filter-change', onFilterChange);

      searchField?.focus();
      await sendKeys({ type: 'L' });
      searchField?.renderRoot.querySelector('button')?.click();
      await el.updateComplete;

      expect(onFilterChange).to.have.callCount(2);
      expect(onFilterChange).to.have.been.calledWithMatch({ detail: { value: undefined } });
    });
  });

  describe('register', () => {
    it('should emit a filter register event when the filter is inserted into the DOM', () => {
      const container = document.createElement('div'),
        onFilterRegister = spy();

      document.body.appendChild(container);
      container.addEventListener('sl-filter-register', onFilterRegister);
      container.appendChild(document.createElement('sl-grid-filter'));

      expect(onFilterRegister).to.have.been.calledOnce;

      container.remove();
    });
  });

  describe('select mode', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-grid-filter
          mode="select"
          .options=${[
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' }
          ]}
        ></sl-grid-filter>
      `);
    });

    it('should render a select', () => {
      const select = el.renderRoot.querySelector('sl-select');

      expect(select).to.exist;
      expect(select).to.have.property('clearable', true);
      expect(select).to.have.property('options').that.is.an('array').with.lengthOf(2);
      expect(select).to.have.property('placeholder', 'Filter by ');
    });

    it('should not be active', () => {
      expect(el.active).to.not.be.true;
    });

    it('should be active when an option is selected', async () => {
      const select = el.renderRoot.querySelector('sl-select');
      select?.querySelector('sl-select-button')?.click();
      select?.querySelector('sl-option')?.click();
      await el.updateComplete;

      expect(el.active).to.be.true;
    });

    it('should emit the filter change event when selecting an option', async () => {
      const onFilterChange = spy();

      el.addEventListener('sl-filter-change', onFilterChange);

      const select = el.renderRoot.querySelector('sl-select');
      select?.querySelector('sl-select-button')?.click();
      select?.querySelector('sl-option')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(onFilterChange).to.have.callCount(1);
      expect(onFilterChange).to.have.been.calledWithMatch({ detail: { value: 'option1' } });
    });

    it('should emit the filter change event when clearing the select', async () => {
      const onFilterChange = spy();

      el.addEventListener('sl-filter-change', onFilterChange);

      const select = el.renderRoot.querySelector('sl-select');
      select?.querySelector('sl-select-button')?.click();
      select?.querySelector('sl-option')?.click();
      await new Promise(resolve => setTimeout(resolve));

      select?.querySelector('sl-select-button')?.renderRoot.querySelector('button')?.click();
      await new Promise(resolve => setTimeout(resolve));

      expect(onFilterChange).to.have.callCount(2);
      expect(onFilterChange).to.have.been.calledWithMatch({ detail: { value: undefined } });
    });
  });

  describe('filter label', () => {
    it('should default to the filter label property', async () => {
      el = await fixture(html`<sl-grid-filter filter-label="Lorem"></sl-grid-filter>`);

      expect(el.renderRoot.querySelector('sl-search-field')).to.have.property('placeholder', 'Filter by Lorem');
    });

    it('should use the lowercase column header value as the filter label', async () => {
      el = await fixture(html`<sl-grid-filter .column=${{ header: 'Lorem' }}></sl-grid-filter>`);

      expect(el.renderRoot.querySelector('sl-search-field')).to.have.property('placeholder', 'Filter by lorem');
    });

    it('should use the column header value as the filter label', async () => {
      el = await fixture(
        html`<sl-grid-filter .column=${{ header: html`Lorem<sl-button>Ipsum</sl-button>` }}></sl-grid-filter>`
      );

      expect(el.renderRoot.querySelector('sl-search-field')).to.have.property('placeholder', 'Filter by lorem');
    });

    it('should use the column path name as the filter label', async () => {
      el = await fixture(html`<sl-grid-filter .column=${{ path: 'school.name' }}></sl-grid-filter>`);

      expect(el.renderRoot.querySelector('sl-search-field')).to.have.property('placeholder', 'Filter by name');
    });
  });
});
