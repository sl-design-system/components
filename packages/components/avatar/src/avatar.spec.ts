import type { Avatar, UserProfile } from './avatar.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import '../register.js';

describe('sl-avatar', () => {
  let el: Avatar;

  const users = [
    {
      name: {
        first: 'Yousef',
        prefix: 'van der',
        last: 'Schaaf'
      },
      picture: {
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/81.jpg'
      }
    },
    {
      name: {
        first: 'Chester',
        last: 'Reid'
      },
      picture: {
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/19.jpg'
      }
    },
    {
      name: {
        first: 'Emma',
        last: 'Henderson - Van Deursen'
      },
      picture: {
        thumbnail: 'https://randomuser.me/api/portraits/thumb/women/19.jpg'
      }
    },
    {
      name: {
        first: 'Johnni',
        last: 'Sullivan'
      }
    }
  ];

  describe('defaults', () => {
    let name: Element|null, svg:Element|null;
    beforeEach(async () => {
      el = await fixture(html`
        <sl-avatar .user=${users[0]}></sl-avatar>
      `);
      name = el.renderRoot.querySelector('.header');
      svg = el.renderRoot.querySelector('svg');
    });

    it('should render the Avatar', () => {
      expect(name).to.have.text("Yousef van der Schaaf");
      expect(svg).to.exist;
    });

    it('should render initials when no image is provided', () => {
      const avatarText = svg?.querySelector('.initials');
      console.log(svg);
      expect(avatarText).to.have.text("YS");
    });
  });
});
