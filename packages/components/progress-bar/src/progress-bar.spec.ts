// import { expect, fixture } from '@open-wc/testing';
// import { html } from 'lit';
// import '../register.js';
// import { type ProgressBar, type ButtonBarAlign } from './progress-bar.js';
//
// describe('sl-button-bar', () => {
//   let el: ProgressBar;
//
//   beforeEach(async () => {
//     el = await fixture(
//       html`<sl-button-bar>
//         <sl-button>Foo</sl-button>
//         <sl-button>Bar</sl-button>
//         <sl-button><sl-icon name="close"></sl-icon></sl-button>
//       </sl-button-bar>`
//     );
//   });
//
//   it('should render correctly', () => {
//     expect(el).shadowDom.to.equalSnapshot();
//   });
//
//   it('should not have a default alignment', () => {
//     expect(el).not.to.have.attribute('align');
//   });
//
//   ['center', 'end', 'space-between', 'start'].forEach(align => {
//     it(`should support ${align} alignment`, async () => {
//       el.align = align as ButtonBarAlign;
//       await el.updateComplete;
//
//       expect(el).to.have.attribute('align', align);
//     });
//   });
//
//   it('should not reverse the order by default', () => {
//     expect(el).not.to.have.attribute('reverse');
//   });
//
//   it('should reverse the order when set', async () => {
//     el.reverse = true;
//     await el.updateComplete;
//
//     expect(el).to.have.attribute('reverse');
//   });
//
//   it('should not have icon-only when there are not only icon-only buttons', () => {
//     expect(el).not.to.have.attribute('icon-only');
//   });
//
//   describe('icon only', () => {
//     beforeEach(async () => {
//       el = await fixture(
//         // the button component is not actually loaded, so it doesn't add the icon-only attribute automatically
//         html`<sl-button-bar>
//           <sl-button fill="ghost" icon-only><sl-icon name="close"></sl-icon></sl-button>
//           <sl-button fill="ghost" icon-only><sl-icon name="full-screen"></sl-icon></sl-button>
//         </sl-button-bar>`
//       );
//       await el.updateComplete;
//     });
//
//     it('should render correctly', () => {
//       expect(el).to.have.attribute('icon-only');
//     });
//   });
//
//   describe('icon only with non-ghost button', () => {
//     beforeEach(async () => {
//       el = await fixture(
//         // the button component is not actually loaded, so it doesn't add the icon-only attribute automatically
//         html`<sl-button-bar>
//           <sl-button icon-only><sl-icon name="close"></sl-icon></sl-button>
//           <sl-button fill="ghost" icon-only><sl-icon name="full-screen"></sl-icon></sl-button>
//         </sl-button-bar>`
//       );
//       await el.updateComplete;
//     });
//
//     it('should render correctly', () => {
//       expect(el).not.to.have.attribute('icon-only');
//     });
//   });
//
//   describe('mix of icon only and buttons with text', () => {
//     beforeEach(async () => {
//       el = await fixture(
//         // the button component is not actually loaded, so it doesn't add the icon-only attribute automatically
//         html`<sl-button-bar>
//           <sl-button fill="ghost">Foo</sl-button>
//           <sl-button fill="ghost" icon-only><sl-icon name="full-screen"></sl-icon></sl-button>
//         </sl-button-bar>`
//       );
//       await el.updateComplete;
//     });
//
//     it('should render correctly', () => {
//       expect(el).not.to.have.attribute('icon-only');
//     });
//   });
// });
