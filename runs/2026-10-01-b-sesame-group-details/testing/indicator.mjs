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
      const g = document
        .querySelector('sl-b-sesame-group-details-page')
        .shadowRoot.querySelector('sl-tab-group');
      const ind = g.shadowRoot.querySelector('.indicator');
      return {
        indicatorBackground: getComputedStyle(ind).backgroundColor,
        expected: 'rgb(10, 87, 87) = #0a5757'
      };
    })
  )
);
await b.close();
