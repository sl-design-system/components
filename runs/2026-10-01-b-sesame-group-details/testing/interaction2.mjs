import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
const errs = [];
p.on('pageerror', e => errs.push(String(e)));
await p.goto(
  'http://localhost:6010/iframe.html?id=runs-b-sesame-group-details-page--basic&viewMode=story&globals=theme:my-digital-book',
  { waitUntil: 'networkidle' }
);
await p.waitForTimeout(1500);
console.log(
  JSON.stringify(
    await p.evaluate(async () => {
      const page = document.querySelector('sl-b-sesame-group-details-page');
      const sr = page.shadowRoot;
      const seen = {};
      for (const n of ['search-students', 'create-student', 'cancel-create', 'regenerate-username'])
        page.addEventListener(`sl-b-sesame-group-details-${n}`, e => {
          seen[n] = e.detail === undefined ? 'void' : JSON.stringify(e.detail).slice(0, 90);
        });

      const form = sr.querySelector('sl-b-sesame-group-details-create-student-form');
      const panel = sr.querySelector('sl-b-sesame-group-details-add-student-panel');
      const btns = [...form.shadowRoot.querySelectorAll('sl-button')];
      btns.find(b => b.textContent.trim() === 'Regenerate')?.click();
      btns.find(b => b.textContent.trim() === 'Create new student')?.click();
      btns.find(b => b.textContent.trim() === 'Cancel')?.click();
      panel.shadowRoot.querySelector('sl-form')?.dispatchEvent(new CustomEvent('sl-submit'));
      await page.updateComplete;
      return seen;
    }),
    null,
    1
  ),
  'pageErrors:',
  errs.length
);
await b.close();
