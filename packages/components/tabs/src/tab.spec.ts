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

    it('should not emit keydown events when disabled', async () => {
      const onKeydown = spy();

      el.addEventListener('keydown', onKeydown);
      el.disabled = true;
      await el.updateComplete;

      el.focus();
      await sendKeys({ type: 'asdf' });

      expect(onKeydown).not.to.have.been.called;
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
    let tab: Tab;
    let link: HTMLAnchorElement;

    beforeEach(async () => {
      el = await fixture(html`
        <sl-tab-group>
          <sl-tab href="javascript:void(0)"></sl-tab>
        </sl-tab-group>
      `);

      // We need to wait for the RovingTabindexController to do its thing
      await new Promise(resolve => setTimeout(resolve, 50));

      tab = el.querySelector('sl-tab')!;
      link = tab.renderRoot.querySelector('a')!;
    });

    it('should render a link', () => {
      expect(link).to.exist;
      expect(link).to.have.property('href', 'javascript:void(0)');
    });

    it('should have link with role "presentation"', () => {
      expect(link).to.have.attribute('role', 'presentation');
    });

    it('should have a link with tabindex of -1', () => {
      expect(link).to.have.attribute('tabindex', '-1');
    });

    it('should not render a link when the tab is disabled', async () => {
      tab.disabled = true;
      await tab.updateComplete;

      expect(tab.renderRoot.querySelector('a')).not.to.exist;
    });

    it('should click the link when the user presses Enter', async () => {
      const onClick = spy();

      link.addEventListener('click', onClick);
      tab.focus();
      await sendKeys({ press: 'Enter' });

      expect(onClick).to.have.been.called;
    });

    it('should click the link when the user presses Space', async () => {
      const onClick = spy();

      link.addEventListener('click', onClick);
      tab.focus();
      await sendKeys({ press: 'Space' });

      expect(onClick).to.have.been.called;
    });
  });
});
