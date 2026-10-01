import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto(
  'http://localhost:6010/iframe.html?id=runs-b-sesame-group-details-page--basic&viewMode=story&globals=theme:my-digital-book',
  { waitUntil: 'networkidle' }
);
await p.waitForTimeout(2000);
console.log(
  JSON.stringify(
    await p.evaluate(async () => {
      const page = document.querySelector('sl-b-sesame-group-details-page');
      const h1 = page.shadowRoot
        .querySelector('sl-b-sesame-group-details-summary')
        .shadowRoot.querySelector('h1');
      const cs = getComputedStyle(h1);
      const loaded = [...document.fonts].map(f => `${f.family}|${f.status}`);
      return {
        h1FontFamily: cs.fontFamily,
        h1FontSize: cs.fontSize,
        openSansAvailable: document.fonts.check(`700 28px 'Open Sans'`),
        documentFontsCount: document.fonts.size,
        registeredFaces: [...new Set(loaded)].slice(0, 12)
      };
    }),
    null,
    1
  )
);
await b.close();
