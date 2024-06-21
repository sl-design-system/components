import '../register.js';
// import { InlineMessage } from './inline-message.js';

// setupIgnoreWindowResizeObserverLoopErrors(beforeEach, afterEach);
//
// describe('sl-inline-message', () => {
//   let el: InlineMessage;
//
//   describe('defaults', () => {
//     beforeEach(async () => {
//       el = await fixture(html`
//         <sl-inline-message>
//           <span slot="title">Inline message title</span>
//         </sl-inline-message>
//       `);
//     });
//
//     it('should have an info variant', () => {
//       expect(el).to.have.attribute('variant', 'info');
//       expect(el.variant).to.equal('info');
//     });
//
//     it('should have success variant when set', async () => {
//       el.variant = 'success';
//       await el.updateComplete;
//
//       expect(el).to.have.attribute('variant', 'success');
//     });
//
//     it('should be dismissible', () => {
//       expect(el).not.to.have.attribute('indismissible');
//       expect(el.indismissible).not.to.be.true;
//     });
//
//     it('should be indismissible when set', async () => {
//       el.indismissible = true;
//       await el.updateComplete;
//
//       expect(el).to.have.attribute('indismissible');
//     });
//
//     it('should have a close button', () => {
//       const button = el.renderRoot.querySelector('sl-button');
//
//       expect(button).to.exist;
//       expect(button).to.contain('sl-icon[name="xmark"]');
//     });
//
//     it('should not have a close button when indismissible', async () => {
//       el.indismissible = true;
//       await el.updateComplete;
//
//       expect(el.renderRoot.querySelector('sl-button')).not.to.exist;
//     });
//
//     it('should remove itself when the close button is clicked', async () => {
//       const removeSpy = spy(el, 'remove');
//
//       el.renderRoot.querySelector('sl-button')?.click();
//
//       // Wait for the next frame
//       await el.updateComplete;
//
//       // Dispatch the animationend event
//       el.renderRoot.querySelector('.wrapper')?.dispatchEvent(new AnimationEvent('animationend'));
//
//       expect(removeSpy).to.have.been.calledOnce;
//     });
//
//     it('should emit an sl-dismiss event after clicking the close button', async () => {
//       const onDismiss = spy();
//
//       el.addEventListener('sl-dismiss', onDismiss);
//       el.renderRoot.querySelector('sl-button')?.click();
//
//       // Wait for the next frame
//       await el.updateComplete;
//
//       // Dispatch the animationend event
//       el.renderRoot.querySelector('.wrapper')?.dispatchEvent(new AnimationEvent('animationend'));
//
//       expect(onDismiss).to.have.been.calledOnce;
//     });
//   });
//
//   describe('no title', () => {
//     beforeEach(async () => {
//       el = await fixture(html`<sl-inline-message>Inline message text</sl-inline-message>`);
//     });
//
//     it('should not display a title', () => {
//       const title = el.renderRoot.querySelector('[part="title"]')!;
//
//       expect(title).to.exist;
//       expect(getComputedStyle(title).display).to.equal('none');
//     });
//
//     it('should have the no-title attribute set', () => {
//       expect(el).to.have.attribute('no-title');
//     });
//   });
//
//   describe('wrap action', () => {
//     beforeEach(async () => {
//       el = await fixture(html`
//         <sl-inline-message style="inline-size: 300px">
//           Proident nulla officia ad irure ex. Consequat cupidatat cupidatat non in sunt cillum eiusmod officia commodo
//           occaecat mollit sit laboris. Officia occaecat cupidatat laborum aliquip sint exercitation. Do mollit quis
//           dolor qui proident pariatur occaecat.
//           <sl-button slot="action">Action</sl-button>
//         </sl-inline-message>
//       `);
//
//       await new Promise(resolve => setTimeout(resolve, 50));
//     });
//
//     it('should have a wrap-action attribute', () => {
//       expect(el).to.have.attribute('wrap-action');
//     });
//   });
// });

import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';
import { FormatDate } from './format-date.js';

describe('sl-format-number', () => {
  let el: FormatDate;
  const date = new Date(Date.UTC(2022, 11, 17, 14, 5, 42));

  describe('defaults', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-format-date date=${date}></sl-format-date>`);
    });

    it('should render a date by default', () => {
      console.log('eeeeel', el, el.renderRoot, el.locale);
      // expect(el.renderRoot).to.have.text('12/17/2022');
      expect(el.renderRoot).to.have.trimmed.text('12/17/2022');
    });

    it('should use a proper locale when set', async () => {
      el.locale = 'pl-PL';

      await el.updateComplete;
      console.log('eeeeel with locale', el, el.renderRoot);
      // expect(el.renderRoot).to.have.text('17.12.2022');
      expect(el.renderRoot).to.have.trimmed.text('17.12.2022');
    });

    it('should not use formatting options except day, month and year by default', async () => {
      expect(el.weekday).to.be.undefined;
      expect(el.era).to.be.undefined;
      expect(el.dayPeriod).to.be.undefined;
      expect(el.hour).to.be.undefined;
      expect(el.minute).to.be.undefined;
      expect(el.second).to.be.undefined;
      expect(el.timeZoneName).to.be.undefined;
      expect(el.timeZone).to.be.undefined;
      expect(el.hour12).to.be.undefined;
    });

    it('should format date with the right long era when set', async () => {
      el.era = 'long';

      await el.updateComplete;
      console.log('eraaa', el, el.renderRoot);
      expect(el.renderRoot).to.have.trimmed.text('12/17/2022 Anno Domini');
    });

    // it('should render a currency number if numberStyle is set to currency', async () => {
    //   el.numberStyle = 'currency';
    //   el.currency = 'USD';
    //   await el.updateComplete;
    //
    //   expect(el.renderRoot).to.have.text('$1,234.56');
    // });
    //
    // it('should render a percentage if numberStyle is set to percent', async () => {
    //   el.numberStyle = 'percent';
    //   await el.updateComplete;
    //
    //   expect(el.renderRoot).to.have.text('123,456%');
    // });
    //
    // it('should render a currency unit if numberStyle is set to unit', async () => {
    //   el.numberStyle = 'unit';
    //   el.unit = 'meter';
    //   el.unitDisplay = 'long';
    //   await el.updateComplete;
    //
    //   expect(el.renderRoot).to.have.text('1,234.56 meters');
    // });
    //
    // it('should not use grouping if useGrouping is set to false', async () => {
    //   el.useGrouping = false;
    //   await el.updateComplete;
    //
    //   expect(el.renderRoot).to.have.text('1234.56');
    // });
    //
    // it('should render fractions according to minimumFractionDigits', async () => {
    //   el.minimumFractionDigits = 3;
    //   await el.updateComplete;
    //
    //   expect(el.renderRoot).to.have.text('1,234.560');
    // });
    //
    // it('should render fractions according to maximumFractionDigits', async () => {
    //   el.maximumFractionDigits = 1;
    //   await el.updateComplete;
    //
    //   expect(el.renderRoot).to.have.text('1,234.6');
    // });
    //
    // it('should have formatOptions override any other formatting options', async () => {
    //   el.formatOptions = { minimumFractionDigits: 3 };
    //   el.minimumFractionDigits = 1;
    //   await el.updateComplete;
    //
    //   expect(el.renderRoot).to.have.text('1,234.560');
    // });
  });

  // describe('fallback', () => {
  //   beforeEach(async () => {
  //     el = await fixture(html`<sl-format-number>Hello world</sl-format-number>`);
  //   });
  //
  //   it('should not render the slotted content if the number is valid', async () => {
  //     el.number = 1234;
  //     await el.updateComplete;
  //
  //     expect(el.renderRoot).to.have.text('1,234');
  //   });
  //
  //   it('should render the slotted content if the number is not a number', async () => {
  //     el.number = 'lorem' as unknown as number;
  //     await el.updateComplete;
  //
  //     const slot = el.renderRoot.querySelector('slot');
  //
  //     expect(slot).to.exist;
  //     expect(
  //       slot!
  //         .assignedNodes()
  //         .map(n => n.textContent)
  //         .join('')
  //     ).to.equal('Hello world');
  //   });
  // });
});
