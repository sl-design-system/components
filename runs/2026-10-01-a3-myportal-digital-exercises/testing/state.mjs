import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1024 } });
await p.goto(
  'http://localhost:6010/iframe.html?id=runs-a3-myportal-digital-exercises-digital-exercises-page--basic&viewMode=story&globals=theme:bingel-int',
  { waitUntil: 'networkidle' }
);
await p.waitForTimeout(1200);
console.log(
  JSON.stringify(
    await p.evaluate(async () => {
      const pg = document.querySelector('sl-a3mp-digital-exercises-page');
      const q = s => pg.renderRoot.querySelector(s);
      const deep = (h, s) => h?.renderRoot?.querySelector(s);
      const click = el =>
        el?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      const navSelBefore = deep(q('sl-a3mp-side-nav'), 'button.item.selected')?.textContent.trim();
      const items = [...q('sl-a3mp-side-nav').renderRoot.querySelectorAll('button.item')];
      click(items[2]);
      await pg.updateComplete;
      await new Promise(r => setTimeout(r, 120));
      const navSelAfter = deep(q('sl-a3mp-side-nav'), 'button.item.selected')?.textContent.trim();
      const ch = [
        ...q('sl-a3mp-chapter-nav').renderRoot.querySelectorAll('sl-a3mp-chapter-nav-item')
      ];
      const expBefore = deep(ch[0], 'button.header')?.getAttribute('aria-expanded');
      click(deep(ch[0], 'button.header'));
      await pg.updateComplete;
      await new Promise(r => setTimeout(r, 120));
      const expAfter = deep(ch[0], 'button.header')?.getAttribute('aria-expanded');
      const row = deep(q('sl-a3mp-exercises-panel'), 'sl-a3mp-exercise-list-item');
      const addBefore = row.renderRoot
        .querySelectorAll('button.action')[1]
        ?.getAttribute('aria-pressed');
      click(row.renderRoot.querySelectorAll('button.action')[1]);
      await pg.updateComplete;
      await new Promise(r => setTimeout(r, 150));
      const row2 = deep(q('sl-a3mp-exercises-panel'), 'sl-a3mp-exercise-list-item');
      const addAfter = row2.renderRoot
        .querySelectorAll('button.action')[1]
        ?.getAttribute('aria-pressed');
      return { navSelBefore, navSelAfter, expBefore, expAfter, addBefore, addAfter };
    }),
    null,
    2
  )
);
await b.close();
