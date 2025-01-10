import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import { type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { sendKeys } from '@web/test-runner-commands';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { type Panel } from './panel.js';

describe('sl-panel', () => {
  let el: Panel;

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-panel heading="Heading">Body content</sl-panel>`);
    });

    it('should not be collapsible', () => {
      expect(el.collapsible).not.to.be.true;
      expect(el).not.to.have.attribute('collapsible');
    });

    it('should not be collapsed', () => {
      expect(el.collapsed).not.to.be.true;
      expect(el).not.to.have.attribute('collapsed');
    });

    it('should not render the wrapper as a button', () => {
      const wrapper = el.renderRoot.querySelector('[part="wrapper"]');

      expect(wrapper?.tagName).not.to.equal('BUTTON');
    });

    it('should not have a body with a role of "region"', () => {
      const body = el.renderRoot.querySelector('[part="body"]');

      expect(body).not.to.have.attribute('role', 'region');
    });

    it('should render the heading into the heading slot', () => {
      const heading = el.renderRoot.querySelector<HTMLSlotElement>('slot[name="heading"]');

      expect(heading).to.have.trimmed.text('Heading');
    });
  });

  describe('collapsible', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-panel collapsible heading="Heading">Body content</sl-panel>`);
    });

    it('should be collapsible', () => {
      expect(el.collapsible).to.be.true;
    });

    it('should not be collapsed', () => {
      expect(el.collapsed).not.to.be.true;
      expect(el).not.to.have.attribute('collapsed');
    });

    it('should render the toggle button', () => {
      const button = el.renderRoot.querySelector('sl-button');

      expect(button).to.exist;

      const toggleIcon = button!.querySelector('sl-icon');

      expect(toggleIcon?.name).to.equal('chevron-down');
    });

    it('should use ARIA to indicate expanded state', async () => {
      const button = el.renderRoot.querySelector('sl-button');

      expect(button).to.have.attribute('aria-controls', 'body');
      expect(button).to.have.attribute('aria-expanded', 'true');

      button?.click();
      await el.updateComplete;

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 300));

      expect(button).to.have.attribute('aria-expanded', 'false');
    });

    it('should have a body with a role of "region"', () => {
      const body = el.renderRoot.querySelector('[part="body"]');

      expect(body).to.have.attribute('role', 'region');
    });

    it('should emit an sl-toggle event when button is clicked', async () => {
      const button = el.renderRoot.querySelector('sl-button'),
        onToggle = spy();

      el.addEventListener('sl-toggle', (event: SlToggleEvent<boolean>) => {
        onToggle(event.detail);
      });

      button?.click();
      await el.updateComplete;

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.be.true;

      button?.click();
      await el.updateComplete;

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledTwice;
      expect(onToggle.lastCall.args[0]).to.be.false;
    });

    it('should emit an sl-toggle event when Enter is pressed while the button has focus', async () => {
      const button = el.renderRoot.querySelector('sl-button'),
        onToggle = spy();

      el.addEventListener('sl-toggle', (event: SlToggleEvent<boolean>) => {
        onToggle(event.detail);
      });

      button?.focus();
      await sendKeys({ press: 'Enter' });

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.be.true;

      await sendKeys({ press: 'Enter' });

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledTwice;
      expect(onToggle.lastCall.args[0]).to.be.false;
    });

    it('should emit an sl-toggle event when Space is pressed while the button has focus', async () => {
      const button = el.renderRoot.querySelector('sl-button'),
        onToggle = spy();

      el.addEventListener('sl-toggle', (event: SlToggleEvent<boolean>) => {
        onToggle(event.detail);
      });

      button?.focus();
      await sendKeys({ press: 'Space' });

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.be.true;

      await sendKeys({ press: 'Space' });

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledTwice;
      expect(onToggle.lastCall.args[0]).to.be.false;
    });

    it('should emit an sl-toggle event when toggle() is called', async () => {
      const onToggle = spy();

      el.addEventListener('sl-toggle', (event: SlToggleEvent<boolean>) => {
        onToggle(event.detail);
      });

      el.toggle();

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledOnce;
      expect(onToggle.lastCall.args[0]).to.be.true;

      el.toggle();

      // Wait for the animation to finish
      await new Promise(resolve => setTimeout(resolve, 400));

      expect(onToggle).to.have.been.calledTwice;
      expect(onToggle.lastCall.args[0]).to.be.false;
    });

    it('should render the toggle button at the end of the header', async () => {
      el.togglePlacement = 'end';
      await el.updateComplete;

      const button = el.renderRoot.querySelector('div[part="header"] sl-button');

      expect(button).to.exist;
      expect(button?.nextElementSibling).not.to.exist;
    });
  });

  describe('slotted elements', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <sl-panel>
          <sl-badge slot="prefix" emphasis="subtle" size="lg" variant="info">prefix badge</sl-badge>
          <div slot="heading">Custom heading</div>
          <sl-badge slot="suffix" emphasis="subtle" size="lg" variant="info">suffix badge</sl-badge>
          <sl-button slot="actions">Action</sl-button>
          <div>Content</div>
        </sl-panel>
      `);
    });

    it('should slot the heading into the heading slot', () => {
      const elements = el.renderRoot
        .querySelector<HTMLSlotElement>('slot[name="heading"]')
        ?.assignedElements({ flatten: true });

      expect(elements).to.have.lengthOf(1);
      expect(elements?.at(0)).to.match('div');
      expect(elements?.at(0)).to.have.text('Custom heading');
    });

    it('should slot the button into the actions slot', () => {
      const elements = el.renderRoot
        .querySelector<HTMLSlotElement>('slot[name="actions"]')
        ?.assignedElements({ flatten: true });

      expect(elements).to.have.lengthOf(1);
      expect(elements?.at(0)).to.match('sl-button');
      expect(elements?.at(0)).to.have.text('Action');
    });

    it('should slot the content into the default slot', () => {
      const elements = el.renderRoot
        .querySelector<HTMLSlotElement>('slot:not([name])')
        ?.assignedElements({ flatten: true });

      expect(elements).to.have.lengthOf(1);
      expect(elements?.at(0)).to.match('div');
      expect(elements?.at(0)).to.have.text('Content');
    });

    it('should slot the prefix into the prefix slot', () => {
      const elements = el.renderRoot
        .querySelector<HTMLSlotElement>('slot[name="prefix"]')
        ?.assignedElements({ flatten: true });

      expect(elements).to.have.lengthOf(1);
      expect(elements?.at(0)).to.match('sl-badge');
      expect(elements?.at(0)).to.have.text('prefix badge');
    });

    it('should slot the suffix into the suffix slot', () => {
      const elements = el.renderRoot
        .querySelector<HTMLSlotElement>('slot[name="suffix"]')
        ?.assignedElements({ flatten: true });

      expect(elements).to.have.lengthOf(1);
      expect(elements?.at(0)).to.match('sl-badge');
      expect(elements?.at(0)).to.have.text('suffix badge');
    });
  });

  describe('panel content without header', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-panel>Body content</sl-panel>`);
    });

    it('should have no header attribute when there is nothing in the header', () => {
      expect(el).to.have.attribute('no-header');
    });

    it('should have the content without padding when no-padding is set', async () => {
      el.noPadding = true;
      await el.updateComplete;

      const content = el.renderRoot.querySelector('[part="content"]');

      expect(content).to.exist;
      expect(content).to.have.style('padding', '0px');
    });
  });
});
