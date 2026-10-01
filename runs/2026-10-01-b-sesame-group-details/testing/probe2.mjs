import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto(
  'http://localhost:6010/iframe.html?id=runs-b-sesame-group-details-page--basic&viewMode=story&globals=theme:my-digital-book',
  { waitUntil: 'networkidle' }
);
await p.waitForTimeout(1500);
console.log(
  JSON.stringify(
    await p.evaluate(() => {
      const page = document.querySelector('sl-b-sesame-group-details-page');
      const bg = page.shadowRoot.querySelector('sl-badge');
      const cs = getComputedStyle(bg);
      const av = page.shadowRoot
        .querySelector('sl-b-sesame-group-details-app-header')
        .shadowRoot.querySelector('sl-avatar');
      const slot = av.shadowRoot.querySelector('slot:not([name])');
      return {
        badgeTag: bg.localName,
        adopted: bg.shadowRoot.adoptedStyleSheets.length,
        bg: cs.backgroundColor,
        color: cs.color,
        varBg: cs.getPropertyValue('--_background'),
        tokenBold: cs.getPropertyValue('--sl-color-background-accent-yellow-bold'),
        avatarSlotAssigned: slot
          ? slot
              .assignedNodes()
              .map(n => (n.textContent || '').trim())
              .filter(Boolean)
          : null,
        avatarSlotDisplay: slot ? getComputedStyle(slot).display : null,
        avatarAdopted: av.shadowRoot.adoptedStyleSheets.length
      };
    }),
    null,
    1
  )
);
await b.close();
