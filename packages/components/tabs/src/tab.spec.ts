import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { Tab } from './tab.js';

describe('sl-tab', () => {
  let el: Tab;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-tab></sl-tab>`);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should have a tab role', () => {
      expect(el).to.have.attribute('role', 'tab');
    });

    it('should have a tabs slot', () => {
      expect(el).to.have.attribute('slot', 'tabs');
    });

    it('should not be disabled', () => {
      expect(el).not.to.have.attribute('disabled');
      expect(el.disabled).not.to.be.true;
    });

    it('should be disabled when set', async () => {
      el.disabled = true;
      await el.updateComplete;

      expect(el).to.have.attribute('disabled');
    });

    it('should not be selected', () => {
      expect(el).not.to.have.attribute('aria-selected');
      expect(el.selected).not.to.be.true;
    });

    it('should be selected when set', async () => {
      el.setAttribute('selected', '');
      await el.updateComplete;

      expect(el).to.have.attribute('aria-selected', 'true');
      expect(el.selected).to.be.true;
    });

    it('should not render a link', () => {
      expect(el.renderRoot.querySelector('a')).not.to.exist;
    });

    it('should not have a has-icon attribute', () => {
      expect(el).not.to.have.attribute('has-icon');
    });

    it('should have a has-icon attribute if the icon slot has content', async () => {
      el.innerHTML = '<span slot="icon"></span>';
      await el.updateComplete;

      expect(el).to.have.attribute('has-icon');
    });

    it('should not have a has-title attribute', () => {
      expect(el).not.to.have.attribute('has-title');
    });

    it('should have a has-title attribute if the default slot has content', async () => {
      el.innerHTML = 'Hello world';
      await el.updateComplete;

      expect(el).to.have.attribute('has-title');
    });

    it('should not have a has-subtitle attribute', () => {
      expect(el).not.to.have.attribute('has-subtitle');
    });

    it('should have a has-subtitle attribute if the subtitle slot has text', async () => {
      el.innerHTML = '<span slot="subtitle">Subtitle</span>';
      await el.updateComplete;

      expect(el).to.have.attribute('has-subtitle');
    });
  });

  describe('href', () => {
    let link: HTMLAnchorElement;

    beforeEach(async () => {
      el = await fixture(html`<sl-tab href="javascript:void(0)"></sl-tab>`);
      link = el.renderRoot.querySelector('a')!;
    });

    it('should render a link', () => {
      expect(link).to.exist;
      expect(link).to.have.property('href', 'javascript:void(0)');
    });

    it('should activate the link when pressing Enter', async () => {
      const onClick = spy(link, 'click');

      el.focus();
      await sendKeys({ press: 'Enter' });

      expect(onClick).to.have.been.calledOnce;
    });

    it('should not activate the link when disabled and pressing Enter', async () => {
      el.disabled = true;
      await el.updateComplete;

      const onClick = spy(link, 'click');

      el.focus();
      await sendKeys({ press: 'Enter' });

      expect(onClick).not.to.have.been.called;
    });

    it('should activate the link when pressing Space', async () => {
      const onClick = spy(link, 'click');

      el.focus();
      await sendKeys({ press: 'Space' });

      expect(onClick).to.have.been.calledOnce;
    });

    it('should not activate the link when disabled and pressing Space', async () => {
      el.disabled = true;
      await el.updateComplete;

      const onClick = spy(link, 'click');

      el.focus();
      await sendKeys({ press: 'Space' });

      expect(onClick).not.to.have.been.called;
    });
  });
});
