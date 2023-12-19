// import { expect, fixture } from '@open-wc/testing';
// import '@sl-design-system/button/register.js';
// import { html } from 'lit';
// import '../register.js';
// import { InlineMessage } from "./inline-message.js";
// import type { Button } from '@sl-design-system/button';
//
//
// describe('sl-inline-message', () => {
//   let el: InlineMessage;
//
//   describe('defaults', () => {
//     beforeEach(async () => {
//       el = await fixture(html`
//           <sl-inline-message id="inlMsg-1" closing-button>
//             <span slot="title">Inline message title</span>
//           </sl-inline-message>
//       `);
//     });
//
//     it('should render correctly', () => {
//       expect(el).shadowDom.to.equalSnapshot();
//     });
//
//     it('should have the info variant by default', () => {
//       expect(el).to.have.attribute('variant', 'info');
//     });
//
//     it('should be dismissible by default', () => {
//       expect(el.hasAttribute('dismissible')).to.be.true;
//     });
//
//     it('should not have the no-icon by default', () => {
//       expect(el.hasAttribute('no-icon')).to.be.false;
//     });
//
//     it('should have success variant when set', async () => {
//       el.variant = 'success';
//       await el.updateComplete;
//
//       expect(el).to.have.attribute('variant', 'success');
//     });
//
//     it('should not be dismissible when set', async () => {
//       el.dismissible = false;
//       await el.updateComplete;
//
//       expect(el?.shadowRoot?.querySelector('slot[name="close-button"] sl-button')).to.be.null;
//     });
//   });
//
//   describe('Closing inline message', () => {
//       it('should close the inline message when the close button is clicked', async () => {
//       const msg = await fixture<InlineMessage>(html`
//         <sl-inline-message variant="danger">
//         Variant danger inline message
//         <span slot="description">A place for additional description</span>
//       </sl-inline-message> `);
//       const closeButton = msg.shadowRoot?.querySelector('slot[name="close-button"] sl-button') as Button;
//
//       setTimeout(() => closeButton.click());
//       await new Promise(resolve => setTimeout(resolve, 500));
//
//       expect(document.querySelectorAll('sl-inline-message')).not.to.exist;
//     });
//
//     it('should close the inline message when remove is called', async () => {
//       const elMsg = await fixture<InlineMessage>(html`
//         <sl-inline-message variant="info">
//           inline message
//           <span slot="description">A place for additional description</span>
//         </sl-inline-message> `);
//
//       elMsg.remove();
//
//       await new Promise(resolve => setTimeout(resolve, 1000));
//
//       expect(document.querySelectorAll('sl-inline-message')).not.to.exist;
//     });
//   });
// });


// describe('sl-skeleton', () => {
//   let el: Skeleton;
//
//   beforeEach(async () => {
//     el = await fixture(html`<sl-skeleton></sl-skeleton>`);
//   });
//
//   it('should render correctly', () => {
//     expect(el).shadowDom.to.equalSnapshot();
//   });
//
//   it('should have an aria busy', () => {
//     expect(el).to.have.attribute('aria-busy', 'true');
//   });
//
//   it('should have a shimmer effect by default', () => {
//     expect(el).to.have.attribute('effect', 'shimmer');
//   });
//
//   it('should have a shimmer effect when set', async () => {
//     el.setAttribute('effect', 'shimmer');
//     await el.updateComplete;
//
//     const effect = el.getAttribute('effect');
//     expect(effect).to.equal('shimmer');
//   });
//
//   it('should have a pulse effect when set', async () => {
//     el.setAttribute('effect', 'pulse');
//     await el.updateComplete;
//
//     const effect = el.getAttribute('effect');
//     expect(effect).to.equal('pulse');
//   });
//
//   it('should have a sheen effect when set', async () => {
//     el.setAttribute('effect', 'sheen');
//     await el.updateComplete;
//
//     const effect = el.getAttribute('effect');
//     expect(effect).to.equal('sheen');
//   });
//
//   it('should have no effect when set to none', async () => {
//     el.setAttribute('effect', 'none');
//     await el.updateComplete;
//
//     const effect = el.getAttribute('effect');
//     expect(effect).to.equal('none');
//   });
// });
