import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1024 } });
await page.goto(
  'http://localhost:6010/iframe.html?id=runs-a3-myportal-digital-exercises-digital-exercises-page--basic&viewMode=story&globals=theme:bingel-int',
  { waitUntil: 'networkidle' }
);
await page.waitForTimeout(1000);
console.log(
  JSON.stringify(
    await page.evaluate(() => {
      const r = el => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          w: Math.round(b.width),
          h: Math.round(b.height),
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 28)
        };
      };
      const pg = document.querySelector('sl-a3mp-digital-exercises-page');
      const bar = pg.renderRoot.querySelector('sl-a3mp-app-bar');
      const kids = [...bar.renderRoot.querySelectorAll('*')].slice(0, 16).map(r);
      const host = getComputedStyle(bar);
      const inner = bar.renderRoot.querySelector('*');
      return {
        barBox: r(bar),
        hostPadding: [host.paddingTop, host.paddingBottom],
        hostBoxSizing: host.boxSizing,
        innerStyle: inner ? getComputedStyle(inner).padding : null,
        kids,
        sideNavBoxSizing: getComputedStyle(pg.renderRoot.querySelector('sl-a3mp-side-nav'))
          .boxSizing
      };
    }),
    null,
    2
  )
);
await browser.close();
