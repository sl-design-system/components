import { expect, fixture } from '@open-wc/testing';
import { SlAnnounceEvent } from '@sl-design-system/announcer';
import { html } from 'lit';
import { spy } from 'sinon';
import '../register.js';
import { type ProgressBar } from './progress-bar.js';

describe('sl-progress-bar', () => {
  let el: ProgressBar;
  let progressBar: HTMLDivElement;
  const sendToAnnouncerSpy = spy();

  beforeEach(async () => {
    document.body.addEventListener('sl-announce', sendToAnnouncerSpy);
    el = await fixture(html`<sl-progress-bar> Downloaded 30% of 100% </sl-progress-bar>`);

    progressBar = el.renderRoot.querySelector('div.container') as HTMLDivElement;
  });

  it('should have no variant by default', () => {
    expect(el).not.to.have.attribute('variant');
  });

  it('should have no color by default', () => {
    expect(el).not.to.have.attribute('color');
  });

  it('should have no icon by default', () => {
    const icon = el.renderRoot.querySelector('sl-icon') as HTMLElement;

    expect(icon).not.to.exist;
  });

  it('should not have any label by default', () => {
    expect(el).not.to.have.attribute('label');
  });

  it('should have 0 value by default', () => {
    expect(el).not.to.have.attribute('value', '0');
  });

  it('should have determinate progress bar by default', () => {
    expect(progressBar).to.have.attribute('aria-valuenow');
    expect(el).not.to.have.attribute('indeterminate');
  });

  it('should have a progressbar role', () => {
    expect(progressBar).to.have.attribute('role', 'progressbar');
  });

  it('should have the correct attributes', () => {
    expect(progressBar).to.have.attribute('aria-describedby', 'helper');
    expect(progressBar).to.have.attribute('aria-valuemin', '0');
    expect(progressBar).to.have.attribute('aria-valuemax', '100');
    expect(progressBar).to.have.attribute('aria-valuenow', '0');
  });

  it('should be labelled properly when the label is set', async () => {
    el.label = 'Progress label';
    await el.updateComplete;

    const label = el.renderRoot.querySelector('div.label') as HTMLElement;

    expect(label).to.have.trimmed.text('Progress label');
    expect(progressBar).to.have.attribute('aria-labelledby', 'label');
  });

  it('should have the proper icon when the success variant is set', async () => {
    el.label = 'Progress label';
    el.variant = 'success';
    await el.updateComplete;

    const label = el.renderRoot.querySelector('div.label') as HTMLElement,
      icon = label?.querySelector('sl-icon') as HTMLElement;

    expect(label).to.exist;
    expect(label).to.have.trimmed.text('Progress label');
    expect(icon).to.have.attribute('name', 'circle-check-solid');
  });

  it('should have the proper icon when the warning variant is set', async () => {
    el.label = 'Progress label';
    el.variant = 'warning';
    await el.updateComplete;

    const label = el.renderRoot.querySelector('div.label') as HTMLElement,
      icon = label?.querySelector('sl-icon') as HTMLElement;

    expect(label).to.exist;
    expect(label).to.have.trimmed.text('Progress label');
    expect(icon).to.have.attribute('name', 'octagon-exclamation-solid');
  });

  it('should have the proper icon when the error variant is set', async () => {
    el.label = 'Progress label';
    el.variant = 'error';
    await el.updateComplete;

    const label = el.renderRoot.querySelector('div.label') as HTMLElement,
      icon = label?.querySelector('sl-icon') as HTMLElement;

    expect(label).to.exist;
    expect(label).to.have.trimmed.text('Progress label');
    expect(icon).to.have.attribute('name', 'triangle-exclamation-solid');
  });

  it('should have the icon in the helper text part when there is no label', async () => {
    const label = el.renderRoot.querySelector('div.label') as HTMLElement;
    expect(label).not.to.exist;

    el.variant = 'success';
    await el.updateComplete;

    const helper = el.renderRoot.querySelector('div.helper') as HTMLElement,
      helperIcon = helper?.querySelector('sl-icon') as HTMLElement;

    expect(helper).to.exist;
    expect(helperIcon).to.exist;
  });

  it('should send a message to the announcer with the current value', async () => {
    // Give the resize observer time to do its thing
    await new Promise(resolve => setTimeout(resolve, 1500));
    el.value = 60;
    el.variant = 'warning';
    await el.updateComplete;

    expect((sendToAnnouncerSpy.getCall(-1).args[0] as SlAnnounceEvent).detail.message).to.equal('60%');
  });
});
