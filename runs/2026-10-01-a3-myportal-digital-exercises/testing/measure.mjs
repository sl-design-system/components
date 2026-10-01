import { chromium } from 'playwright';
const url =
  'http://localhost:6010/iframe.html?id=runs-a3-myportal-digital-exercises-digital-exercises-page--basic&viewMode=story&globals=theme:bingel-int';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1024 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const out = await page.evaluate(() => {
  const r = el => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return {
      x: Math.round(b.x),
      y: Math.round(b.y),
      w: Math.round(b.width),
      h: Math.round(b.height)
    };
  };
  const page = document.querySelector('sl-a3mp-digital-exercises-page');
  const q = sel => page?.renderRoot?.querySelector(sel);
  const deep = (host, sel) => host?.renderRoot?.querySelector(sel);
  const nav = q('sl-a3mp-side-nav');
  const bar = q('sl-a3mp-app-bar');
  const quick = q('sl-a3mp-quick-actions-bar');
  const header = q('sl-a3mp-chapter-header');
  const cnav = q('sl-a3mp-chapter-nav');
  const panel = q('sl-a3mp-exercises-panel');
  const cluster = deep(header, 'sl-a3mp-avatar-cluster');
  const avatar = cluster?.renderRoot?.querySelector('sl-avatar');
  const item = deep(panel, 'sl-a3mp-exercise-list-item');
  return {
    docScrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    pageBox: r(page),
    appBar: r(bar),
    quickBar: r(quick),
    sideNav: r(nav),
    chapterHeader: r(header),
    chapterNav: r(cnav),
    exercisesPanel: r(panel),
    avatarBox: r(avatar),
    exerciseRow: r(item),
    widest: (() => {
      let worst = null;
      for (const el of document.querySelectorAll('*')) {
        const b = el.getBoundingClientRect();
        if (b.right > 1441 && (!worst || b.right > worst.right))
          worst = {
            tag: el.tagName.toLowerCase(),
            cls: el.className?.toString?.().slice(0, 40),
            right: Math.round(b.right),
            w: Math.round(b.width)
          };
      }
      return worst;
    })()
  };
});
console.log(JSON.stringify(out, null, 2));
await browser.close();
