import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import { html } from 'lit';
import '../register.js';
import { ButtonGroup } from './button-group.js';

describe('sl-button-group', () => {
  let el: ButtonGroup;

  beforeEach(async () => {
    el = await fixture(html`
      <sl-button-group>
        <sl-button>Lorem</sl-button>
        <sl-button>Ipsum</sl-button>
        <sl-button>Dolar</sl-button>
      </sl-button-group>
    `);
  });

  it('should not be disabled by default', () => {
    expect(el).not.to.have.attribute('disabled');
    expect(el.disabled).not.to.be.true;
  });

  it('should be disabled when set', async () => {
    el.disabled = true;
    await el.updateComplete;

    expect(el).to.have.attribute('disabled');
  });

  it('should not have a size by default', () => {
    expect(el).not.to.have.attribute('size');
    expect(el.size).to.be.undefined;
  });

  it('should propagate disabled to the buttons', async () => {
    const buttons = Array.from(el.querySelectorAll('sl-button'));

    el.disabled = true;
    await el.updateComplete;

    expect(buttons.every(b => b.disabled)).to.be.true;
  });

  it('should set fill to outline for all the buttons', () => {
    const buttons = Array.from(el.querySelectorAll('sl-button'));

    expect(buttons.map(b => b.fill)).to.deep.equal(['outline', 'outline', 'outline']);
  });

  it('should have a size when set', async () => {
    el.size = 'lg';
    await el.updateComplete;

    expect(el).to.have.attribute('size', 'lg');
  });

  it('should propagate size to the buttons', async () => {
    const buttons = Array.from(el.querySelectorAll('sl-button'));

    el.size = 'lg';
    await el.updateComplete;

    expect(buttons.map(b => b.size)).to.deep.equal(['lg', 'lg', 'lg']);
  });
});
