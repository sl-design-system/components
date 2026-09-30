import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1024 } });
await p.goto(
  'http://localhost:6010/iframe.html?id=examples-group-list-page--basic&viewMode=story&globals=theme:sanoma-pro',
  { waitUntil: 'networkidle' }
);
await p.waitForTimeout(1500);
const out = await p.evaluate(() => {
  const root = document.querySelector('sl-group-list-page');
  const sr = root.shadowRoot;
  const rectOf = el => {
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x),
      y: Math.round(r.y),
      w: Math.round(r.width),
      h: Math.round(r.height)
    };
  };
  const ll = sr.querySelector('sl-group-list-live-lesson');
  const s2 = ll.shadowRoot;
  const img = s2.querySelector('img');
  const cs = img ? getComputedStyle(img) : null;
  const buttons = [...s2.querySelectorAll('sl-button')];
  const btnRects = buttons.map(x => rectOf(x));
  const gaps = [];
  for (let i = 1; i < btnRects.length; i++)
    gaps.push(btnRects[i].y - (btnRects[i - 1].y + btnRects[i - 1].h));
  const card1 = sr.querySelector('sl-card');
  const cardImg = card1 ? card1.querySelector('img') : null;
  const cardImgRect = cardImg ? rectOf(cardImg) : null;
  const cardRect = card1 ? rectOf(card1) : null;
  const article = s2.querySelector('article');
  const artRect = rectOf(article);
  const artCS = getComputedStyle(article);
  return {
    liveLessonImg: img
      ? {
          rect: rectOf(img),
          width_attr: img.getAttribute('width'),
          height_attr: img.getAttribute('height'),
          cssWidth: cs.width,
          cssHeight: cs.height,
          objectFit: cs.objectFit
        }
      : null,
    article: { rect: artRect, padding: artCS.padding, border: artCS.border },
    buttonRects: btnRects,
    buttonGaps: gaps,
    card1: cardRect,
    card1Img: cardImgRect,
    h1: rectOf(sr.querySelector('h1')),
    subtext: rectOf(sr.querySelector('h1').nextElementSibling),
    h2s: [...sr.querySelectorAll('h2')].map(rectOf)
  };
});
console.log(JSON.stringify(out, null, 1));
await b.close();
