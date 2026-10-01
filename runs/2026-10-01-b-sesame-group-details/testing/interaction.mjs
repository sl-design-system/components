import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const errs = [];
p.on('console', m => m.type() === 'error' && errs.push(m.text()));
p.on('pageerror', e => errs.push(String(e)));
await p.goto(
  'http://localhost:6010/iframe.html?id=runs-b-sesame-group-details-page--basic&viewMode=story&globals=theme:my-digital-book',
  { waitUntil: 'networkidle' }
);
await p.waitForTimeout(1500);

const out = await p.evaluate(async () => {
  const page = document.querySelector('sl-b-sesame-group-details-page');
  const sr = page.shadowRoot;
  const log = [];
  let renders = 0;
  const orig = page.requestUpdate.bind(page);
  page.requestUpdate = (...a) => {
    renders++;
    return orig(...a);
  };

  const seen = {};
  for (const n of [
    'nav-select',
    'switch-school',
    'profile-select',
    'back',
    'edit-field',
    'archive-group',
    'search-students',
    'dismiss-panel',
    'create-student',
    'cancel-create',
    'regenerate-username',
    'add-first-student',
    'legal-select'
  ])
    page.addEventListener(`sl-b-sesame-group-details-${n}`, () => {
      seen[n] = (seen[n] || 0) + 1;
    });

  const q = (host, sel) => host.shadowRoot.querySelector(sel);
  const header = sr.querySelector('sl-b-sesame-group-details-app-header');
  const summary = sr.querySelector('sl-b-sesame-group-details-summary');
  const panel = sr.querySelector('sl-b-sesame-group-details-add-student-panel');
  const empty = sr.querySelector('sl-b-sesame-group-details-empty-state');
  const footer = sr.querySelector('sl-b-sesame-group-details-app-footer');

  q(header, 'nav a').click();
  q(header, '.profile').click();
  q(header, 'sl-button').click();
  q(summary, 'a.back').click();
  q(summary, 'sl-button').click();
  q(summary, '.archive').click();
  q(panel, 'sl-button').click();
  q(empty, '.body button').click();
  q(footer, 'nav a').click();
  await page.updateComplete;

  // Keyboard: the back link and the edit buttons must be reachable and activatable.
  const focusables = [];
  const walk = root => {
    for (const el of root.querySelectorAll(
      'a[href],button,sl-button,input,select,textarea,[tabindex]'
    ))
      focusables.push(el.localName);
    for (const el of root.querySelectorAll('*')) if (el.shadowRoot) walk(el.shadowRoot);
  };
  walk(sr);

  log.push({
    eventsFired: seen,
    distinctEvents: Object.keys(seen).length,
    rendersTriggered: renders,
    focusableCount: focusables.length
  });
  return log[0];
});

// One real keyboard activation through the browser, not a synthetic click.
await p.keyboard.press('Tab');
const firstFocus = await p.evaluate(() => {
  let a = document.activeElement;
  while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement;
  return { tag: a?.localName, text: (a?.textContent || '').trim().slice(0, 40) };
});
console.log(JSON.stringify({ ...out, firstTabStop: firstFocus, consoleErrors: errs }, null, 1));
await b.close();
