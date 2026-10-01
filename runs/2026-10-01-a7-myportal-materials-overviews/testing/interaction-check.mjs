import { chromium } from 'playwright';

const URL =
  'http://localhost:6010/iframe.html?id=runs-a7-myportal-materials-overviews-materials-overviews-page--basic&viewMode=story&globals=theme:bingel-int';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1890 } });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const result = await page.evaluate(async () => {
  const root = document.querySelector('sl-a7-myportal-materials-overviews-page');
  if (!root) return { error: 'root not found' };
  const sr = root.shadowRoot;
  const q = s => sr.querySelector(s);
  const out = [];
  const snap = () =>
    JSON.parse(
      JSON.stringify({
        nav: root.model.activeNavItem,
        tree: root.model.activeTreeItemId,
        heading: root.model.filePanel.heading,
        cls: root.model.appBar.selectedClassId,
        school: root.model.appBar.selectedSchoolId,
        testsExpanded: root.model.tree.sections.find(s => s.id === 'tests').expanded,
        query: root.searchQuery,
        last: root.lastAction
      })
    );
  const fire = (el, name, detail) =>
    el.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
  const step = async (label, fn, field) => {
    const before = snap();
    fn();
    await root.updateComplete;
    const after = snap();
    out.push({
      label,
      field,
      before: before[field],
      after: after[field],
      changed: JSON.stringify(before[field]) !== JSON.stringify(after[field])
    });
  };

  const bar = q('sl-a7-myportal-app-bar'),
    rail = q('sl-a7-myportal-nav-rail'),
    header = q('sl-a7-myportal-material-header'),
    tree = q('sl-a7-myportal-material-tree'),
    panel = q('sl-a7-myportal-file-panel');

  await step(
    'class-change',
    () => fire(bar, 'sl-a7-myportal-class-change', { classId: '5a' }),
    'cls'
  );
  await step(
    'school-change',
    () => fire(bar, 'sl-a7-myportal-school-change', { schoolId: 'bs-5678' }),
    'school'
  );
  await step(
    'quick-action',
    () => fire(bar, 'sl-a7-myportal-quick-action', { action: 'new-task' }),
    'last'
  );
  await step('user-menu-toggle', () => fire(bar, 'sl-a7-myportal-user-menu-toggle'), 'last');
  await step(
    'nav-select',
    () => fire(rail, 'sl-a7-myportal-nav-select', { itemId: 'planner' }),
    'nav'
  );
  await step('digiboard-action', () => fire(header, 'sl-a7-myportal-digiboard-action'), 'last');
  await step('material-edit', () => fire(header, 'sl-a7-myportal-material-edit'), 'last');
  await step(
    'tree-select -> activeTreeItemId',
    () => fire(tree, 'sl-a7-myportal-tree-select', { itemId: 'goals' }),
    'tree'
  );
  await step(
    'tree-select -> filePanel.heading',
    () => fire(tree, 'sl-a7-myportal-tree-select', { itemId: 'manuals' }),
    'heading'
  );
  await step(
    'tree-toggle',
    () => fire(tree, 'sl-a7-myportal-tree-toggle', { sectionId: 'tests', expanded: true }),
    'testsExpanded'
  );
  await step(
    'tree-search',
    () => fire(tree, 'sl-a7-myportal-tree-search', { query: 'clock' }),
    'query'
  );
  await step('file-open', () => fire(panel, 'sl-a7-myportal-file-open', { fileId: 'f4' }), 'last');

  // a real click, not just a synthetic dispatch, on a genuine control
  const navBtn = rail.shadowRoot.querySelectorAll('button')[2];
  const beforeClick = snap();
  navBtn.click();
  await root.updateComplete;
  out.push({
    label: 'REAL CLICK on nav rail button #3',
    field: 'nav',
    before: beforeClick.nav,
    after: snap().nav,
    changed: beforeClick.nav !== snap().nav
  });
  return { steps: out };
});

console.log(JSON.stringify(result, null, 1));
const failed = (result.steps || []).filter(s => !s.changed);
console.log(
  `\n${(result.steps || []).length - failed.length}/${(result.steps || []).length} wired`
);
if (failed.length) console.log('INERT:', failed.map(f => f.label).join(', '));
await browser.close();
process.exit(failed.length ? 1 : 0);
