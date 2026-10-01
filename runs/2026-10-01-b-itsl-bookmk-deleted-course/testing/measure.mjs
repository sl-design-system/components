import { chromium } from 'playwright';
const url =
  'http://localhost:6010/iframe.html?id=runs-b-itsl-bookmk-deleted-course-course-files-page--basic&viewMode=story&globals=theme:itslearning';
const b = await chromium.launch();
const p = await b.newPage();
await p.setViewportSize({ width: 1280, height: 1082 });
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const r = await p.evaluate(() => {
  const deep = (root, sel) => {
    const out = [];
    const walk = n => {
      if (!n) return;
      if (n.querySelectorAll) for (const e of n.querySelectorAll(sel)) out.push(e);
      const all = n.querySelectorAll ? n.querySelectorAll('*') : [];
      for (const e of all) if (e.shadowRoot) walk(e.shadowRoot);
    };
    walk(root);
    return out;
  };
  const box = e => {
    const b = e.getBoundingClientRect();
    return {
      w: +b.width.toFixed(1),
      h: +b.height.toFixed(1),
      x: +b.x.toFixed(1),
      y: +b.y.toFixed(1)
    };
  };
  const page = document.querySelector('sl-course-files-page');
  const sr = page.shadowRoot;
  const q = s => sr.querySelector(s);
  const out = {};
  out.nav = box(sr.querySelector('sl-its-app-nav'));
  const navSr = sr.querySelector('sl-its-app-nav').shadowRoot;
  out.appBar = box(navSr.querySelector('.app-bar'));
  out.productBar = box(navSr.querySelector('.product-bar'));
  const im = sr.querySelector('sl-inline-message');
  out.banner = box(im);
  out.bannerStyle = (() => {
    const c = getComputedStyle(
      im.shadowRoot.querySelector('[part~="wrapper"]') || im.shadowRoot.firstElementChild
    );
    return {
      border: c.borderWidth + ' ' + c.borderStyle + ' ' + c.borderColor,
      bg: c.backgroundColor
    };
  })();
  const imHost = getComputedStyle(im);
  out.bannerHostStyle = {
    border: imHost.borderWidth + ' ' + imHost.borderColor,
    bg: imHost.backgroundColor
  };
  const tbl = sr.querySelector('sl-course-files-table');
  out.table = box(tbl);
  const tsr = tbl.shadowRoot;
  out.thead = box(tsr.querySelector('thead tr'));
  const rows = [...tsr.querySelectorAll('tbody tr')];
  out.rowHeights = rows.map(r => +r.getBoundingClientRect().height.toFixed(1));
  out.h1 = box(sr.querySelector('h1'));
  out.h1Font = (() => {
    const c = getComputedStyle(sr.querySelector('h1'));
    return { size: c.fontSize, weight: c.fontWeight, family: c.fontFamily, lh: c.lineHeight };
  })();
  out.card = box(sr.querySelector('.card') || sr.querySelector('[class*=card]'));
  out.search = box(sr.querySelector('sl-search-field'));
  out.actionsBtn = box(sr.querySelector('sl-menu-button'));
  out.bulk = box(sr.querySelector('sl-course-files-bulk-actions'));
  out.pager = box(sr.querySelector('sl-course-files-pager'));
  out.bodyFont = getComputedStyle(document.body).fontFamily;
  return out;
});
console.log(JSON.stringify(r, null, 2));
await b.close();
