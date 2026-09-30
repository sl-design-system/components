/**
 * Renders one story in the harness and writes a screenshot plus a small render report.
 *
 * Stage 4 of the batch runs eighteen times over, so capturing has to be something a run can do
 * without contending for a shared browser: each invocation launches and closes its own Chromium. It
 * also has to be repeatable — a fidelity number that moves because a human drove the browser
 * differently is not a measurement.
 *
 * Usage: node runs/harness/shoot.mjs --story <id> --out <file.png> [--theme <id>] [--width 1280]
 * [--height 1024] [--full] [--wait 1500]
 *
 * Writes `<out>` and `<out>.json`. The report carries the console errors, the failed network
 * requests and the rendered size — the three things that explain a blank or collapsed capture, and
 * all three invisible in the image itself.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { argv, exit } from 'node:process';
import { chromium } from 'playwright';

const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

const story = arg('story'),
  out = arg('out'),
  theme = arg('theme', 'sanoma-learning'),
  width = Number(arg('width', 1280)),
  height = Number(arg('height', 1024)),
  wait = Number(arg('wait', 1500)),
  fullPage = argv.includes('--full'),
  base = arg('base', 'http://localhost:6010');

if (!story || !out) {
  console.error(
    'usage: shoot.mjs --story <id> --out <file.png> [--theme id] [--width n] [--height n] [--full] [--wait ms]'
  );
  exit(2);
}

const url = `${base}/iframe.html?id=${encodeURIComponent(story)}&viewMode=story&globals=theme:${encodeURIComponent(theme)}`,
  browser = await chromium.launch(),
  page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 }),
  consoleErrors = [],
  failedRequests = [];

page.on('console', message => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('requestfailed', request => failedRequests.push(request.url()));
page.on('response', response => {
  if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`);
});

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(wait);

// A custom element that never registered still occupies the DOM, so "is it there" proves nothing.
// What distinguishes a rendered component from an unknown tag is a shadow root and a non-zero box.
//
// And the check has to descend into shadow roots. A root that uses `ScopedElementsMixin` owns a
// private registry, so a child that registered itself *globally* is unknown inside it: the root
// registers, paints, reports a healthy box — and its children are inert. One run lost its whole
// navigation and every card that way while the page still looked like a successful render.
const rendered = await page.evaluate(() => {
  const found = [];

  const walk = (node, depth) => {
    if (depth > 20) return;

    for (const element of node.querySelectorAll('*')) {
      const tag = element.tagName.toLowerCase();

      if (tag.includes('-')) {
        const { width, height } = element.getBoundingClientRect();

        found.push({
          tag,
          depth,
          // Deciding this correctly took three attempts, and the two wrong ones each looked right.
          //
          // `customElements.get` consults only the *global* registry, but this design system uses
          // `ScopedElementsMixin`, which registers children in a private one — so that question
          // reports correctly upgraded children as broken.
          //
          // Constructor identity (`element.constructor !== HTMLElement`) fails differently: the
          // scoped-registry polyfill replaces the global `HTMLElement` binding, so even an element
          // the browser never upgraded compares unequal to it, and everything looks fine.
          //
          // The class *name* survives both. An element that was never upgraded is literally an
          // `HTMLElement`; an upgraded one carries its own class name. This holds because the
          // harness only ever runs an unminified dev server.
          upgraded: element.constructor.name !== 'HTMLElement' || !!element.shadowRoot,
          inGlobalRegistry: !!customElements.get(tag),
          hasShadowRoot: !!element.shadowRoot,
          width: Math.round(width),
          height: Math.round(height)
        });
      }

      if (element.shadowRoot) walk(element.shadowRoot, depth + 1);
    }
  };

  const root = document.querySelector('#storybook-root');
  if (root) walk(root, 0);

  return { elements: found, bodyHeight: document.body.scrollHeight };
});

await mkdir(dirname(resolve(out)), { recursive: true });
await page.screenshot({ path: out, fullPage });
await browser.close();

const report = {
  story,
  theme,
  url,
  viewport: { width, height },
  fullPage,
  screenshot: out,
  rendered,
  consoleErrors,
  failedRequests: [...new Set(failedRequests)],
  // An unregistered element is the failure mode that looks like success: the story loads, nothing
  // throws, and the capture is of an empty page. Say so here rather than leaving it to be noticed.
  //
  // `rendered` therefore requires that *every* custom element in the tree resolved, not just the
  // top one. A root that paints while its children are unknown is the more dangerous case,
  // because the capture looks plausible.
  notUpgraded: rendered.elements.filter(element => !element.upgraded).map(element => element.tag),
  collapsed: rendered.elements
    .filter(element => element.upgraded && element.width === 0)
    .map(element => element.tag),
  verdict: !rendered.elements.some(element => element.upgraded && element.hasShadowRoot)
    ? 'nothing-rendered'
    : rendered.elements.some(element => !element.upgraded)
      ? 'children-not-upgraded'
      : 'rendered'
};

await writeFile(`${out}.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

if (report.verdict !== 'rendered') exit(1);
