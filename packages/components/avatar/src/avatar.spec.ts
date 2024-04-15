import { expect, fixture } from '@open-wc/testing';
import { Config, ConfigSettings } from '@sl-design-system/shared';
import { html } from 'lit';
import '../register.js';
import { type Avatar } from './avatar.js';

const users = [
  {
    name: 'Yousef van der Schaaf',
    picture: 'https://randomuser.me/api/portraits/thumb/men/81.jpg'
  },
  {
    name: 'Chester Reid',
    picture: 'https://randomuser.me/api/portraits/thumb/men/19.jpg'
  },
  {
    name: 'Emma Henderson - Van Deursen',
    picture: 'https://randomuser.me/api/portraits/thumb/women/19.jpg'
  },
  {
    name: 'Johnni Sullivan'
  },
  {
    name: 'Non Existing',
    picture: 'https://sanomalearning.design/nonexistingavatar.jpg'
  }
];

describe('sl-avatar', () => {
  let el: Avatar;

  const config: ConfigSettings = {
    avatar: {
      shape: 'circle',
      badgeGapWidth: 2
    }
  };

  Config.setConfig(config);

  describe('header', () => {
    let name: Element | null, subheader: Element | null;

    beforeEach(async () => {
      el = await fixture(html`<sl-avatar .displayName=${users[3].name}>Straight A student</sl-avatar>`);
      await el.updateComplete;
      await new Promise(resolve => setTimeout(resolve));
      name = el.renderRoot.querySelector('[part="name"]');
      subheader = el.renderRoot.querySelector('.subheader');
    });

    it('should render the name and subheader', () => {
      expect(name).to.have.text('Johnni Sullivan');
      expect(subheader).to.exist;
      expect(el).to.have.text('Straight A student');
    });

    it('should render the name but not the subheader on small', async () => {
      el.size = 'sm';
      await el.updateComplete;

      name = el.renderRoot.querySelector('[part="name"]');
      subheader = el.renderRoot.querySelector('.subheader');

      expect(name).to.have.text('Johnni Sullivan');
      expect(name).to.match('span');
      expect(subheader).not.to.exist;
    });

    it('should render the name in a link if href is set', async () => {
      el.href = 'https://www.example.com';
      await el.updateComplete;

      name = el.renderRoot.querySelector('[part="name"]');

      expect(name).to.have.attribute('href', 'https://www.example.com');
      expect(name).to.have.text('Johnni Sullivan');
      expect(name).to.match('a');
    });
  });

  describe('no image', () => {
    let name: Element | null, svg: Element | null;

    beforeEach(async () => {
      el = await fixture(html`<sl-avatar .displayName=${users[3].name}></sl-avatar>`);
      name = el.renderRoot.querySelector('[part="name"]');
      svg = el.renderRoot.querySelector('svg');
    });

    it('should render initials when no image is provided', () => {
      const avatarText = svg?.querySelector('.initials');
      expect(avatarText).to.have.text('JS');
      expect(svg?.querySelector('image')).not.to.exist;
      expect(svg?.querySelector('use')).not.to.exist;
    });

    it('should not render initials but an icon when no image is provided and fallback is set to icon', async () => {
      el.setAttribute('fallback', 'image');
      await el.updateComplete;

      const avatarIcon = svg?.querySelector('use');
      expect(avatarIcon).to.exist;
      expect(svg?.querySelector('image')).not.to.exist;
      expect(svg?.querySelector('.initials')).not.to.exist;
    });

    it('should not render the name when the avatar is set to image only', async () => {
      el.setAttribute('image-only', 'true');
      await el.updateComplete;

      name = el.renderRoot.querySelector('.header');
      svg = el.renderRoot.querySelector('svg');
      expect(name).not.to.exist;
      expect(svg).to.exist;
    });

    it('should fall back to initials when there is an error loading the image', async () => {
      el.displayName = users[4].name;
      el.setAttribute('fallback', 'initials');
      await el.updateComplete;

      svg?.querySelector('image')?.dispatchEvent(new Event('error'));
      await el.updateComplete;

      expect(svg?.querySelector('image')).not.to.exist;
      expect(svg?.querySelector('.initials')).to.have.text('NE');
    });
  });

  describe('with image', () => {
    let svg: Element | null;
    const user = users[0];

    beforeEach(async () => {
      el = await fixture(html` <sl-avatar .displayName=${user.name} .pictureUrl=${user.picture}></sl-avatar> `);
      svg = el.renderRoot.querySelector('svg');
    });

    it('should render initials when no image is provided', () => {
      const avatarText = svg?.querySelector('image');

      expect(avatarText).to.have.attribute('href', user.picture);
      expect(svg?.querySelector('.initials')).not.to.exist;
      expect(svg?.querySelector('use')).not.to.exist;
    });
  });

  describe('positioning of elements', () => {
    beforeEach(async () => {
      el = await fixture(html`<sl-avatar .displayName=${users[0].name}></sl-avatar>`);
    });

    const valuesPerSize = [
      {
        name: 'sm',
        image: {
          containerSize: 32,
          size: 24,
          radius: 12,
          y: 4,
          x: 4,
          focusRingPosition: 1
        },
        statusBadge: {
          height: 8,
          width: 8,
          radius: 4,
          badgeY: 2,
          badgeX: 22,
          badgeBaseX: 30
        }
      },
      {
        name: 'md',
        image: {
          containerSize: 40,
          size: 32,
          radius: 16,
          y: 4,
          x: 4,
          focusRingPosition: 1
        },
        statusBadge: {
          height: 12,
          width: 12,
          radius: 6,
          badgeY: 0,
          badgeX: 28,
          badgeBaseX: 40
        },
        textBadge: {
          width: 21,
          badgeX: 19,
          textX: 29,
          textY: 12
        }
      },
      {
        name: 'lg',
        image: {
          containerSize: 48,
          size: 40,
          radius: 20,
          y: 4,
          x: 4,
          focusRingPosition: 1
        },
        statusBadge: {
          height: 14,
          width: 14,
          radius: 7,
          badgeY: 0,
          badgeX: 34,
          badgeBaseX: 48
        },
        textBadge: {
          width: 23,
          badgeX: 25,
          textX: 36,
          textY: 13
        }
      },
      {
        name: 'xl',
        image: {
          containerSize: 60,
          size: 52,
          radius: 26,
          y: 4,
          x: 4,
          focusRingPosition: 1
        },
        statusBadge: {
          height: 16,
          width: 16,
          radius: 8,
          badgeY: 2,
          badgeX: 42,
          badgeBaseX: 58
        },
        textBadge: {
          width: 25,
          badgeX: 33,
          textX: 45,
          textY: 16
        }
      },
      {
        name: '2xl',
        image: {
          containerSize: 72,
          size: 64,
          radius: 32,
          y: 4,
          x: 4,
          focusRingPosition: 1
        },
        statusBadge: {
          height: 18,
          width: 18,
          radius: 9,
          badgeY: 2,
          badgeX: 52,
          badgeBaseX: 70
        },
        textBadge: {
          width: 27,
          badgeX: 43,
          textX: 56,
          textY: 17
        }
      },
      {
        name: '3xl',
        image: {
          containerSize: 88,
          size: 80,
          radius: 40,
          y: 4,
          x: 4,
          focusRingPosition: 1
        },
        statusBadge: {
          height: 20,
          width: 20,
          radius: 10,
          badgeY: 6,
          badgeX: 62,
          badgeBaseX: 82
        },
        textBadge: {
          width: 29,
          badgeX: 53,
          textX: 67,
          textY: 22
        }
      }
    ];

    valuesPerSize.forEach(sizeValues => {
      it(`should calculate the right properties for the image in size ${sizeValues.name}`, async () => {
        el.setAttribute('size', sizeValues.name);
        el.setAttribute('status', 'online');
        el.setAttribute('badge-text', '');
        await el.updateComplete;
        await new Promise(resolve => setTimeout(resolve, 500));

        expect(el.image).to.exist;
        expect(el.image?.containerSize).to.equal(sizeValues.image.containerSize);
        expect(el.image?.size).to.equal(sizeValues.image.size);
        expect(el.image?.radius).to.equal(sizeValues.image.radius);
        expect(el.image?.y).to.equal(sizeValues.image.y);
        expect(el.image?.x).to.equal(sizeValues.image.x);
        expect(el.image?.focusRingPosition).to.equal(sizeValues.image.focusRingPosition);

        expect(el.badge).to.exist;
        expect(el.badge?.height).to.equal(sizeValues.statusBadge.height);
        expect(el.badge?.width).to.equal(sizeValues.statusBadge.width);
        expect(el.badge?.radius).to.equal(sizeValues.statusBadge.radius);
        expect(el.badge?.badgeY).to.equal(sizeValues.statusBadge.badgeY);
        expect(el.badge?.badgeX).to.equal(sizeValues.statusBadge.badgeX);
        expect(el.badge?.badgeBaseX).to.equal(sizeValues.statusBadge.badgeBaseX);

        el.setAttribute('badge-text', '99+');
        if (sizeValues.textBadge) {
          await el.updateComplete;
          await new Promise(resolve => setTimeout(resolve, 200));

          // using "within" here because fonts/rendering, calculations can differ slightly between different browsers
          expect(Math.floor(el.badge?.width || 0)).to.be.within(
            sizeValues.textBadge.width - 1,
            sizeValues.textBadge.width + 1
          );
          expect(Math.floor(el.badge?.badgeX || 0)).to.be.within(
            sizeValues.textBadge.badgeX - 1,
            sizeValues.textBadge.badgeX + 1
          );
          expect(Math.floor(el.badge?.textX || 0)).to.be.within(
            sizeValues.textBadge.textX - 1,
            sizeValues.textBadge.textX + 1
          );
          expect(Math.floor(el.badge?.textY || 0)).to.be.within(
            sizeValues.textBadge.textY - 1,
            sizeValues.textBadge.textY + 1
          );
        }
      });
    });
  });

  describe('label', () => {
    let svg: Element | null;

    beforeEach(async () => {
      el = await fixture(html`<sl-avatar .displayName=${users[3].name}></sl-avatar>`);
      svg = el.renderRoot.querySelector('svg');
    });

    it("should not have an aria-label when it's just an image and a name", () => {
      expect(svg).to.have.attribute('aria-label', '');
    });

    it("should have an aria-label with the name when it's image only", async () => {
      el.setAttribute('image-only', 'true');
      await el.updateComplete;
      expect(svg).to.have.attribute('aria-label', 'Johnni Sullivan');
    });

    it("should have an aria-label with the name and the value of the badge when it's image only", async () => {
      el.setAttribute('image-only', 'true');
      el.setAttribute('badge-text', '99+');
      await el.updateComplete;
      expect(svg).to.have.attribute('aria-label', 'Johnni Sullivan (99+)');
    });

    it("should have an aria-label with the name and the value of the badge, applied in the given label when it's image only", async () => {
      el.setAttribute('image-only', 'true');
      el.setAttribute('badge-text', '99+');
      el.setAttribute('label', '{{badgeText}} unread messages');
      await el.updateComplete;
      expect(svg).to.have.attribute('aria-label', 'Johnni Sullivan 99+ unread messages');
    });

    it("should have an aria-label with the value of the badge, applied in the given label when it's image only", async () => {
      el.removeAttribute('image-only');
      el.setAttribute('badge-text', '99+');
      el.setAttribute('label', '{{badgeText}} unread messages');
      await el.updateComplete;
      expect(svg).to.have.attribute('aria-label', '99+ unread messages');
    });
  });
});
