import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1024 } });
const bad = [];
p.on('requestfailed', r => bad.push(r.url()));
p.on('response', r => {
  if (r.status() >= 400) bad.push(r.status() + ' ' + r.url());
});
await p.goto(
  'http://localhost:6010/iframe.html?id=examples-group-list-page--basic&viewMode=story&globals=theme:sanoma-pro',
  { waitUntil: 'networkidle' }
);
await p.waitForTimeout(2500);
const out = await p.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  const tok = n => cs.getPropertyValue(n).trim();
  const root = document.querySelector('sl-group-list-page');
  const sr = root.shadowRoot;
  const pick = (sel, ctx = sr) => {
    const el = ctx.querySelector(sel);
    if (!el) return { sel, missing: true };
    const s = getComputedStyle(el),
      r = el.getBoundingClientRect();
    return {
      sel,
      font: `${s.fontFamily} | ${s.fontSize}/${s.lineHeight} w${s.fontWeight}`,
      color: s.color,
      box: `${Math.round(r.width)}x${Math.round(r.height)} @${Math.round(r.x)},${Math.round(r.y)}`
    };
  };
  const ll = sr.querySelector('sl-group-list-live-lesson');
  const ab = sr.querySelector('sl-group-list-app-bar');
  return {
    tokens: {
      fgPrimaryBold: tok('--sl-color-foreground-primary-bold'),
      bgPrimaryBold: tok('--sl-color-background-primary-bold'),
      headingXlFamily: tok('--sl-text-new-heading-xl-fontFamily'),
      headingXlSize: tok('--sl-text-new-heading-xl-fontSize'),
      bodyLgFamily: tok('--sl-text-new-body-lg-fontFamily'),
      borderPrimaryBold: tok('--sl-color-border-primary-bold'),
      space700: tok('--sl-space-700'),
      fontsLoaded: [...document.fonts].map(f => f.family + ':' + f.status).slice(0, 12)
    },
    page: [
      pick('h1'),
      pick('p, .subtext'),
      ...[...sr.querySelectorAll('h2')].map((_, i) => pick(`h2:nth-of-type(${i + 1})`))
    ],
    card0: (() => {
      const c = sr.querySelector('sl-card');
      if (!c) return null;
      const s = getComputedStyle(c),
        r = c.getBoundingClientRect();
      return {
        box: `${Math.round(r.width)}x${Math.round(r.height)} @${Math.round(r.x)},${Math.round(r.y)}`,
        border: s.border,
        radius: s.borderRadius
      };
    })(),
    liveLesson: ll
      ? (() => {
          const r = ll.getBoundingClientRect();
          const s2 = ll.shadowRoot;
          const art = s2.querySelector('article');
          const as = getComputedStyle(art);
          const ar = art.getBoundingClientRect();
          const btns = [...s2.querySelectorAll('sl-button')].map(x => {
            const q = x.getBoundingClientRect();
            return `${Math.round(q.width)}x${Math.round(q.height)}@${Math.round(q.x)},${Math.round(q.y)}`;
          });
          const avs = [...s2.querySelectorAll('sl-avatar')].map(x => {
            const q = x.getBoundingClientRect();
            return `${Math.round(q.width)}x${Math.round(q.height)}@${Math.round(q.x)}`;
          });
          const img = s2.querySelector('img');
          const ir = img?.getBoundingClientRect();
          return {
            host: `${Math.round(r.width)}x${Math.round(r.height)}@${Math.round(r.x)},${Math.round(r.y)}`,
            article: `${Math.round(ar.width)}x${Math.round(ar.height)}`,
            border: as.border,
            radius: as.borderRadius,
            h3: (() => {
              const h = s2.querySelector('h3');
              const s = getComputedStyle(h);
              return `${s.fontFamily}|${s.fontSize}|w${s.fontWeight}|${s.color}`;
            })(),
            buttons: btns,
            avatars: avs,
            img: ir ? `${Math.round(ir.width)}x${Math.round(ir.height)}` : 'none'
          };
        })()
      : null,
    appBar: ab
      ? (() => {
          const r = ab.getBoundingClientRect();
          const s2 = ab.shadowRoot;
          const logo = s2.querySelector('.logo');
          const lr = logo?.getBoundingClientRect();
          const ls = logo && getComputedStyle(logo);
          return {
            host: `${Math.round(r.width)}x${Math.round(r.height)}`,
            logo: lr
              ? `${Math.round(lr.width)}x${Math.round(lr.height)} bg=${ls.backgroundColor} radius=${ls.borderRadius} font=${ls.fontFamily}/${ls.fontSize}`
              : 'none'
          };
        })()
      : null
  };
});
console.log(JSON.stringify(out, null, 1));
console.log('NON200:', JSON.stringify([...new Set(bad)], null, 1));
await b.close();
