import { expect, fixture } from '@open-wc/testing';
import '@sl-design-system/button/register.js';
import {html} from 'lit';
import '../register.js';
import { Tooltip } from './tooltip.js';
import { Button } from 'packages/components/button/src/button.js';


describe('sl-tooltip', () => {
  let el: HTMLElement;
  let button: Button | null;
  let tooltip: Tooltip | null;
  
  const showTooltip = async () => {
    const focusinEvent = new Event('pointerover',{bubbles:true});
    button?.dispatchEvent(focusinEvent);
    await el.updateComplete;
    return new Promise(resolve => setTimeout(resolve));
  }
   
  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`
        <div style="display: block; width: 400px; height: 400px;">
          <sl-button aria-describedby="tooltip" fill="outline" style="margin-top: 100px">Button element</sl-button>
          <sl-tooltip id="tooltip">Message</sl-tooltip>
        </div>
      `);
      button = el.querySelector<Button>('sl-button');
      tooltip = el.querySelector<Tooltip>('sl-tooltip');
    });
    it('should not show the tooltip by default', () => {
      expect(tooltip?.matches(':popover-open')).to.be.false;
    });

    it('should toggle the tooltip on focusin and focusout', async () => {
      const focusinEvent = new Event('focusin',{bubbles:true});
      button?.dispatchEvent(focusinEvent);
      expect(tooltip?.matches(':popover-open')).to.be.true;

      
      const focusoutEvent = new Event('focusout',{bubbles:true});
      button?.dispatchEvent(focusoutEvent);
      expect(tooltip?.matches(':popover-open')).to.be.false;
    });

    it('should toggle the tooltip on pointerover and pointerout', async () => {
      const focusinEvent = new Event('pointerover',{bubbles:true});
      button?.dispatchEvent(focusinEvent);
      expect(tooltip?.matches(':popover-open')).to.be.true;

      
      const focusoutEvent = new Event('pointerout',{bubbles:true});
      button?.dispatchEvent(focusoutEvent);
      expect(tooltip?.matches(':popover-open')).to.be.false;
    });

    it('should be positioned at the top by default', async () => {
      await showTooltip();
      
      expect(tooltip?.position).to.equal('top');
    });
    
    it('should set the position to the position option chosen', async () => {
      tooltip.setAttribute('position', 'bottom');
      await tooltip.updateComplete;
      
      await showTooltip();  

      expect(tooltip?.position).to.equal('bottom');

    });

    it('should not have a maxWidth by default', async () => {
      tooltip.setAttribute('max-width', 150);
      await tooltip.updateComplete;

      await showTooltip();
        
      expect(window.getComputedStyle(tooltip).maxWidth).to.equal('150px');
    });
  });
});
