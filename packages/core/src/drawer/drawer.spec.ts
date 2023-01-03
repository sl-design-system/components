import type { Drawer, DrawerAttachement } from './drawer.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import './register.js';

describe('sl-drawer', () => {
  let el: Drawer;

  beforeEach(async () => {
    el = await fixture(html`<sl-drawer></sl-drawer>`);
  });

  it('should render correctly', () => {
    expect(el).shadowDom.to.equalSnapshot();
  });

  // it('should have a dialog role', async () => {
  //   const { role } = await a11ySnapshot({ selector: 'dialog' }) as any;

  //   expect(role).to.equal('dialog');
  // });

  describe('positioning', () => {
    it('should attach the drawer to the right by default', () => {
      expect(el).to.have.attribute('attachment', 'right');
    });
  
    ['right', 'left', 'top', 'bottom'].forEach(attachment => {
      it(`should support ${attachment} attachment`, async () => {
        el.attachment = attachment as DrawerAttachement;
        await el.updateComplete;
  
        expect(el).to.have.attribute('attachment', attachment);
      });
    });
  });

  describe('opening and closing', () => {
    it('should not show the dialog by default', () => {
      expect(el.renderRoot.querySelector('dialog')).not.to.have.attribute('open');
    });
    
    it('should open and close the drawer', async () => {
      const dialog = el.renderRoot.querySelector('dialog')
      el.showModal();
      await el.updateComplete;
      
      expect(dialog).to.have.attribute('open');
      expect(document.documentElement.style.overflow).to.equal('hidden');
      
      console.log(dialog?.open);
      el.close();
      // console.log('close is called');
      
      // await el.updateComplete;
      // await new Promise(resolve => setTimeout(resolve));
      // console.log('update complete');
      // await new Promise(resolve => setTimeout(resolve));
      // await el.updateComplete;
      
      expect(dialog).not.to.have.attribute('open');
     
      dialog?.dispatchEvent(new Event('close'));
      // console.log('test finished');
      expect(document.documentElement.style.overflow).to.equal('');

    });
  });
});
