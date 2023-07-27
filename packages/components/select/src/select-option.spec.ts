import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { SelectOption } from './select-option.js';

describe('sl-select-option', () => {
  let el: SelectOption;

  describe('default (string)', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-option>Option</sl-select-option>`);
    });
  
    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });
  
    it('should have the correct attributes', () => {
      expect(el).attribute('role').to.equal('option');
      expect(el).attribute('aria-selected').to.equal('false');
      expect(el).attribute('aria-disabled').to.equal('false');
    });
  
    it('should have the correct content type', () => {
      expect(el.contentType).equal('string')
    });
  });

  describe('selected', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-option selected>Option</sl-select-option>`);
    });

    it('should have the correct attributes', () => {
      expect(el).attribute('aria-selected').to.equal('true');
    });

    it('should have the selected status', () => {
      expect(el.selected).equal(true);
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-option disabled>Option</sl-select-option>`);
    });

    it('should have the correct attributes', () => {
      expect(el).attribute('aria-disabled').to.equal('true');
    });

    it('should have the selected status', () => {
      expect(el.disabled).equal(true);
    });
  });

  describe('custom option (element)', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-select-option><sl-avatar></sl-avatar></sl-select-option>`);
    });
  
    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });
  
    it('should have the correct content type', () => {
      expect(el.contentType).equal('element')
    });
  });
});
