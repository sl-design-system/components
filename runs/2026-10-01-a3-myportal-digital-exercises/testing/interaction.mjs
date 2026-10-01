import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1024 } });
await p.goto(
  'http://localhost:6010/iframe.html?id=runs-a3-myportal-digital-exercises-digital-exercises-page--basic&viewMode=story&globals=theme:bingel-int',
  { waitUntil: 'networkidle' }
);
await p.waitForTimeout(1200);
const res = await p.evaluate(async () => {
  const seen = [];
  for (const n of [
    'sl-a3mp-nav-select',
    'sl-a3mp-quick-action',
    'sl-a3mp-app-bar-action',
    'sl-a3mp-chapter-header-action',
    'sl-a3mp-chapter-toggle',
    'sl-a3mp-tool-select',
    'sl-a3mp-exercise-view',
    'sl-a3mp-exercise-add-toggle',
    'sl-a3mp-level-change',
    'sl-a3mp-search-change'
  ])
    document.addEventListener(n, e => seen.push({ type: e.type, detail: e.detail }));
  const pg = document.querySelector('sl-a3mp-digital-exercises-page');
  const q = s => pg.renderRoot.querySelector(s);
  const click = el => el?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
  const deep = (h, s) => h?.renderRoot?.querySelector(s);
  click(deep(q('sl-a3mp-side-nav'), 'button.item'));
  click(deep(q('sl-a3mp-quick-actions-bar'), 'button'));
  click(deep(q('sl-a3mp-app-bar'), 'button'));
  click(deep(q('sl-a3mp-chapter-header'), 'sl-button'));
  const nav = q('sl-a3mp-chapter-nav');
  const item = deep(nav, 'sl-a3mp-chapter-nav-item');
  click(deep(item, 'button.header'));
  const expanded = [...nav.renderRoot.querySelectorAll('sl-a3mp-chapter-nav-item')].find(i =>
    i.renderRoot.querySelector('button.leaf')
  );
  click(deep(expanded, 'button.leaf'));
  const row = deep(q('sl-a3mp-exercises-panel'), 'sl-a3mp-exercise-list-item');
  const acts = row?.renderRoot?.querySelectorAll('button.action');
  click(acts?.[0]);
  click(acts?.[1]);
  await new Promise(r => setTimeout(r, 200));
  // a11y spot-checks
  const a11y = {
    hasMain: !!pg.renderRoot.querySelector('main, [role="main"]'),
    hasBanner: !!pg.renderRoot.querySelector('header, [role="banner"]'),
    h1: pg.renderRoot.querySelector('sl-a3mp-chapter-header')?.renderRoot?.querySelectorAll('h1')
      .length,
    h2: pg.renderRoot.querySelector('sl-a3mp-exercises-panel')?.renderRoot?.querySelectorAll('h2')
      .length,
    h3PerRow: row?.renderRoot?.querySelectorAll('h3').length,
    rowActionLabels: [...(acts || [])].map(a => a.getAttribute('aria-label')),
    addTogglePressed: acts?.[1]?.getAttribute('aria-pressed'),
    accordionExpanded: deep(expanded, 'button.header')?.getAttribute('aria-expanded'),
    accordionControls: !!deep(expanded, 'button.header')?.getAttribute('aria-controls'),
    navCurrent: deep(q('sl-a3mp-side-nav'), 'button.item.selected')?.getAttribute('aria-current'),
    unlabelledIconButtons: [...pg.renderRoot.querySelectorAll('*')].length
  };
  return { events: seen.map(e => e.type), eventCount: seen.length, a11y };
});
console.log(JSON.stringify(res, null, 2));
await b.close();
