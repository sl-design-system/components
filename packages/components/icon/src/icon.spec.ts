import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { SinonStub, stub } from 'sinon';
import '../register.js';
import { Icon } from './icon.js';
import { type IconDefinition } from './models.js';

describe('sl-icon', () => {
  let el: Icon;
  const systemIcons = {
    'face-smile': {
      value: 'face-smile',
      type: 'Icons',
      description: 'icon.core.fa-face_smile',
      svg: '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="var(--fill-default)"></path></svg>'
    },
    menu: {
      value: 'bars',
      type: 'Icons',
      description: 'icon.core.fa-menu',
      svg: '<svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 88C0 74.7 10.7 64 24 64H424c13.3 0 24 10.7 24 24s-10.7 24-24 24H24C10.7 112 0 101.3 0 88zM0 248c0-13.3 10.7-24 24-24H424c13.3 0 24 10.7 24 24s-10.7 24-24 24H24c-13.3 0-24-10.7-24-24zM448 408c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24s10.7-24 24-24H424c13.3 0 24 10.7 24 24z" fill="var(--fill-default)"></path></svg>'
    },
    fav: {
      value: 'star',
      type: 'Icons',
      description: 'icon.core.fa-fav',
      svg: '<svg viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" fill="var(--fill-default)"></path></svg>'
    }
  };

  const faIcon1: IconDefinition = {
    prefix: 'fat',
    iconName: 'pinata',
    icon: [
      512,
      512,
      [],
      'e3c3',
      'M176 40c0-22.1 17.9-40 40-40s40 17.9 40 40V232H424c48.6 0 88 39.4 88 88V472c0 22.1-17.9 40-40 40H440c-22.1 0-40-17.9-40-40V448c0-17.6-11.3-32.5-27.1-37.9c-5-1.4-10.1-2.1-15.3-2.1H264c-22.1 0-40 17.9-40 40v24c0 22.1-17.9 40-40 40H136c-22.1 0-40-17.9-40-40V220.9L37.2 191.6C14.4 180.1 0 156.8 0 131.3C0 94.1 30.1 64 67.3 64H176V40zm88 352h93.6H360c6.2 0 12.2 1 17.8 2.9c.9 .3 1.7 .5 2.6 .8l33.1 11c1.6 .5 3.4 .5 5.1 0l37.4-12.5c5.4-1.8 11.2-1.6 16.5 .5l23.6 9.4V331.6l-3.8 1.5c-6.1 2.3-12.9 2.1-18.8-.8L452 322.2c-2-.9-4.2-1-6.3-.3l-29.3 11.1c-6.1 2.3-12.9 2.1-18.8-.8l-21.4-10.1c-2-.9-4.2-1-6.3-.3l-29.3 11.1c-6.1 2.3-12.9 2.1-18.8-.8l-21.4-10.1c-2-.9-4.2-1-6.3-.3l-29.3 11.1c-6.1 2.3-12.9 2.1-18.8-.8l-21.4-10.1c-2-.9-4.2-1-6.3-.3L189 333.1c-6.1 2.3-12.9 2.1-18.8-.8l-21.4-10.1c-2-.9-4.2-1-6.3-.3L112 333.5v70.7l23.6-9.4c5.3-2.1 11.1-2.3 16.5-.5l37.4 12.5c1.6 .5 3.4 .5 5.1 0l33.1-11c7.3-2.4 15-3.7 22.8-3.7H264zM112 316.4l24.9-9.5c6.1-2.3 12.9-2.1 18.8 .8l21.4 10.1c2 .9 4.2 1 6.3 .3l29.3-11.1c6.1-2.3 12.9-2.1 18.8 .8l21.4 10.1c2 .9 4.2 1 6.3 .3l29.3-11.1c6.1-2.3 12.9-2.1 18.8 .8l21.4 10.1c2 .9 4.2 1 6.3 .3l29.3-11.1c6.1-2.3 12.9-2.1 18.8 .8l21.4 10.1c2 .9 4.2 1 6.3 .3L440 306.9c6.1-2.3 12.9-2.1 18.8 .8l21.4 10.1c2 .9 4.2 1 6.3 .3l9.3-3.5C493 277.3 461.9 248 424 248H249.4l-38.8 13.8c-4.8 1.7-10 1.8-14.9 .4l-44-13c-1.6-.5-3.4-.4-5 .1L112 261.6v54.8zM240 40c0-13.3-10.7-24-24-24s-24 10.7-24 24V72c0 4.4-3.6 8-8 8H67.3C39 80 16 103 16 131.3c0 19.4 11 37.2 28.4 45.9l63.2 31.6c2.7 1.4 4.4 4.1 4.4 7.2v28.7l29.4-10.5c4.8-1.7 10-1.8 14.9-.4l44 13c1.6 .5 3.4 .4 5-.1L240 234.4V40zM112 421.4V472c0 13.3 10.7 24 24 24h48c13.3 0 24-10.7 24-24V448c0-12 3.8-23.2 10.3-32.3l-18.7 6.2c-4.9 1.6-10.3 1.6-15.2 0L147 409.4c-1.8-.6-3.7-.5-5.5 .2L112 421.4zm384 0l-29.5-11.8c-1.8-.7-3.7-.8-5.5-.2l-37.4 12.5c-4.5 1.5-9.3 1.6-13.8 .4c4 7.7 6.2 16.4 6.2 25.7v24c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24V421.4zM176 128a16 16 0 1 0 0 32 16 16 0 1 0 0-32zm32 16a32 32 0 1 1 -64 0 32 32 0 1 1 64 0z'
    ]
  };
  const faIcon2: IconDefinition = {
    prefix: 'fal',
    iconName: 'pinata',
    icon: [
      512,
      512,
      [],
      'e3c3',
      'M160 48c0-26.5 21.5-48 48-48s48 21.5 48 48V224H416c53 0 96 43 96 96V464c0 26.5-21.5 48-48 48H432c-26.5 0-48-21.5-48-48V448c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v16c0 26.5-21.5 48-48 48H144c-26.5 0-48-21.5-48-48V225.9L38.9 197.3C15.1 185.4 0 161 0 134.4C0 95.5 31.5 64 70.4 64H160V48zm96 336h96 3.7c10.2 0 20.3 1.9 29.7 5.7l23.1 9.2 36.9-12.3c7.2-2.4 15-2.2 22 .6l12.6 5V342.5c-4.7-.1-9.3-1.2-13.6-3.4l-19.1-9.6-26.7 10.7c-8.5 3.4-18 3-26.2-1.1l-19.1-9.6-26.7 10.7c-8.5 3.4-18 3-26.2-1.1l-19.1-9.6-26.7 10.7c-8.5 3.4-18 3-26.2-1.1l-19.1-9.6-26.7 10.7c-8.5 3.4-18 3-26.2-1.1l-19.1-9.6L128 342v50.3l12.6-5c7-2.8 14.8-3 22-.6L199.5 399l23.1-9.2c9.4-3.8 19.5-5.7 29.7-5.7H256zM128 307.6l19.4-7.8c8.5-3.4 18-3 26.2 1.1l19.1 9.6 26.7-10.7c8.5-3.4 18-3 26.2 1.1l19.1 9.6 26.7-10.7c8.5-3.4 18-3 26.2 1.1l19.1 9.6 26.7-10.7c8.5-3.4 18-3 26.2 1.1l19.1 9.6 26.7-10.7c8.5-3.4 18-3 26.2 1.1l17.6 8.8C474.2 279.3 447.8 256 416 256H240c-3.5 0-6.7-1.1-9.4-3l-19.3 7.7c-7 2.8-14.8 3-22 .6L152.5 249 128 258.8v48.7zM224 48c0-8.8-7.2-16-16-16s-16 7.2-16 16V80c0 8.8-7.2 16-16 16H70.4C49.2 96 32 113.2 32 134.4c0 14.5 8.2 27.8 21.2 34.3l65.9 33c5.4 2.7 8.8 8.3 8.8 14.3v8.4l12.6-5c7-2.8 14.8-3 22-.6L199.5 231l24.5-9.8V48zM128 426.8V464c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V448c0-6 .8-11.9 2.4-17.4c-1.7-.3-3.4-.7-5-1.2L152.5 417 128 426.8zm352 0L455.5 417l-36.9 12.3c-1.6 .6-3.3 1-5 1.2c1.6 5.5 2.4 11.4 2.4 17.4v16c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V426.8zM152 144a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z'
    ]
  };
  const faIcon3: IconDefinition = {
    prefix: 'fas',
    iconName: 'pinata',
    icon: [
      512,
      512,
      [],
      'e3c3',
      [
        'M112 318.1V254.7l25.8 9.9c14.7 5.6 31.1 4.9 45.1-2.2L259.8 224H288 432c44.2 0 80 35.8 80 80v13.2l-23.3 9.3-19.1-9.6c-8.2-4.1-17.7-4.5-26.2-1.1l-26.7 10.7-19.1-9.6c-8.2-4.1-17.7-4.5-26.2-1.1l-26.7 10.7-19.1-9.6c-8.2-4.1-17.7-4.5-26.2-1.1l-26.7 10.7-19.1-9.6c-8.2-4.1-17.7-4.5-26.2-1.1l-26.7 10.7-19.1-9.6c-8.2-4.1-17.7-4.5-26.2-1.1l-26.7 10.7L112 318.1zm0 35.8l2.4 1.2c8.2 4.1 17.7 4.5 26.2 1.1l26.7-10.7 19.1 9.6c8.2 4.1 17.7 4.5 26.2 1.1l26.7-10.7 19.1 9.6c8.2 4.1 17.7 4.5 26.2 1.1l26.7-10.7 19.1 9.6c8.2 4.1 17.7 4.5 26.2 1.1l26.7-10.7 19.1 9.6c8.2 4.1 17.7 4.5 26.2 1.1l26.7-10.7 19.1 9.6c8.2 4.1 17.7 4.5 26.2 1.1l11.4-4.6v50.5l-24 12-17.7-8.8c-9-4.5-19.6-4.5-28.6 0l-16.5 8.3-16.3-10.8c-2.6-1.8-5.7-2.7-8.9-2.7H224c-3.2 0-6.2 .9-8.9 2.7l-16.3 10.8-16.5-8.3c-9-4.5-19.6-4.5-28.6 0L136 414.1l-24-12V353.9zm37.3-119.2L34.4 190.6C13.4 179.6 0 157.8 0 133.8V128C0 92.7 28.7 64 64 64H176V32c0-17.7 14.3-32 32-32s32 14.3 32 32V198.1l-71.4 35.7c-6 3-13.1 3.4-19.3 .9zM112 437.9l9.7 4.8c9 4.5 19.6 4.5 28.6 0l17.7-8.8 16.5 8.3c10.3 5.1 22.5 4.4 32.1-2l7.4-4.9V480c0 17.7-14.3 32-32 32H144c-17.7 0-32-14.3-32-32V437.9zm288-2.7l7.4 4.9c9.6 6.4 21.8 7.1 32.1 2l16.5-8.3 17.7 8.8c9 4.5 19.6 4.5 28.6 0l9.7-4.8V480c0 17.7-14.3 32-32 32H432c-17.7 0-32-14.3-32-32V435.2zM200 144a24 24 0 1 0 -48 0 24 24 0 1 0 48 0z'
      ]
    ]
  };

  describe('without icons registered', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-icon></sl-icon>`);
    });

    it('should render correctly', () => {
      expect(el).shadowDom.to.equalSnapshot();
    });

    it('should show no icons because none are registered', async () => {
      el.name = 'check';
      await el.updateComplete;

      expect(el.shadowRoot?.firstElementChild).to.match('.icon-not-def');
    });

    it('should be able to register icons from the icons.js', async () => {
      expect(window.SLDS.icons).to.be.empty;
      Icon.register(systemIcons);
      await el.updateComplete;
      expect(window.SLDS.icons).not.to.be.empty;
      expect(window.SLDS.icons.menu).to.equal(systemIcons.menu);
    });
  });

  describe('with icons registered', () => {
    let consoleStub: SinonStub;

    afterEach(() => {
      consoleStub.restore();
    });

    beforeEach(async () => {
      Icon.register(systemIcons);
      el = await fixture(html`<sl-icon></sl-icon>`);
      await el.updateComplete;
      consoleStub = stub(console, 'warn');
    });

    it('should not render anything when no icon name is given', async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));

      expect(el.shadowRoot?.firstElementChild).to.match('.icon-not-def');
    });

    it('should be able to show a registered icon.', async () => {
      el.name = 'menu';
      await el.updateComplete;
      await elementUpdated(el);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const icon = el.shadowRoot?.querySelector('svg');
      expect(icon?.outerHTML).to.equal(systemIcons.menu.svg);
    });

    it('should show the correct label and be accessible', () => {
      expect(el).attribute('aria-hidden').to.equal('true');
      expect(el).not.have.attribute('role');
    });

    it('should show the correct label and be accessible when a label is set', async () => {
      el.label = 'menu';
      await el.updateComplete;
      expect(el).not.have.attribute('aria-hidden');
      expect(el).attribute('role').to.equal('img');
      expect(el).attribute('aria-label').to.equal('menu');
    });

    it('should be able to register a single FA icon', () => {
      Icon.register(faIcon1);
      expect(window.SLDS.icons['fat-pinata']).not.to.be.undefined;
    });

    it('should not register the same icon twice', () => {
      Icon.register(faIcon1);
      expect(consoleStub.calledWith('Icon fat-pinata is already in the registry')).to.be.true;
    });

    it('should be able to register multiple FA icons', () => {
      Icon.register(faIcon2, faIcon3);
      expect(window.SLDS.icons['fal-pinata']).not.to.be.undefined;
      expect(window.SLDS.icons['fas-pinata']).not.to.be.undefined;
    });

    it('should be able to show a FA icon', async () => {
      el.name = 'fal-pinata';
      await el.updateComplete;
      await elementUpdated(el);
      expect(el.shadowRoot?.firstElementChild).not.to.match('.icon-not-def');
    });
  });
});
