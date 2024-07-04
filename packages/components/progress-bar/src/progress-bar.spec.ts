import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { type ProgressBar, type ProgressState } from './progress-bar.js';

describe('sl-progress-bar', () => {
  let el: ProgressBar;
  let progressBar: HTMLDivElement;

  beforeEach(async () => {
    el = await fixture(
      html`<sl-progress-bar>
        Downloaded 30% of 100%
      </sl-progress-bar>`
    );

    progressBar = el.renderRoot.querySelector('div.container') as HTMLDivElement;
  });

  it('should render correctly', () => {
    console.log('el', el, el.renderRoot);
    expect(el).to.have.attribute('align', align);
    expect(el).shadowDom.to.equalSnapshot();
  });

  it('should have active state by default', () => {
    expect(el).to.have.attribute('state', 'active');
  });

  it('should have no icon by default', () => {
    const icon = el.renderRoot.querySelector('sl-icon') as HTMLElement;

    expect(icon).not.to.exist;
    // expect(el).to.have.attribute('state', 'active');
  });

  it('should not have any label by default', () => {
    expect(el).not.to.have.attribute('label');
  });

  it('should have 0 value by default', () => {
    expect(el).not.to.have.attribute('value', '0');
  });

  it('should have determinate progress bar by default', () => {
    expect(el).not.to.have.attribute('indeterminate');
  });

  it('should have a progressbar role', () => {
    expect(progressBar).to.have.attribute('role', 'progressbar');
  });

  it('should have the correct attributes', () => {
    expect(progressBar).to.have.attribute('aria-describedby', 'helper');
    expect(progressBar).to.have.attribute('aria-valuemin', '0');
    expect(progressBar).to.have.attribute('aria-valuemax', '100');
    expect(progressBar).to.have.attribute('aria-busy', 'true');
    expect(progressBar).to.have.attribute('aria-valuenow', '0');
  });

  // it('should be labelled correctly', async () => {
  //   el.label = 'Progress label';
  //   await el.updateComplete;
  //
  //   console.log('el', el, progressBar);
  //
  //   expect(progressBar).to.have.attribute('label', 'Progress label');
  // });

  // TODO: check the proper icon and properties when exaqct state is set, no icon when active and indeterminate, icon nead helper when no label and the other way

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
});
