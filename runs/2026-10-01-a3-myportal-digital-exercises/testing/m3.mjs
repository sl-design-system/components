import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1024 } });
await p.goto(
  'http://localhost:6010/iframe.html?id=runs-a3-myportal-digital-exercises-digital-exercises-page--level-menu-open&viewMode=story&globals=theme:bingel-int',
  { waitUntil: 'networkidle' }
);
await p.waitForTimeout(2500);
console.log(
  JSON.stringify(
    await p.evaluate(() => {
      const pg = document.querySelector('sl-a3mp-digital-exercises-page');
      const sel = pg?.renderRoot
        ?.querySelector('sl-a3mp-exercises-panel')
        ?.renderRoot?.querySelector('sl-select');
      const lb = sel?.renderRoot?.querySelector('sl-listbox');
      const r = e => {
        if (!e) return null;
        const x = e.getBoundingClientRect();
        return { w: Math.round(x.width), h: Math.round(x.height), y: Math.round(x.y) };
      };
      return {
        selectFound: !!sel,
        listboxFound: !!lb,
        listboxBox: r(lb),
        optionCount:
          lb?.querySelectorAll?.('sl-option')?.length ?? sel?.querySelectorAll('sl-option').length
      };
    }),
    null,
    2
  )
);
await b.close();
