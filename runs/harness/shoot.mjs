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
const rendered = await page.evaluate(() => {
  const root = document.querySelector('#storybook-root');
  const elements = [...(root?.querySelectorAll('*') ?? [])]
    .filter(element => element.tagName.includes('-'))
    .map(element => {
      const { width, height } = element.getBoundingClientRect();

      return {
        tag: element.tagName.toLowerCase(),
        defined: !!customElements.get(element.tagName.toLowerCase()),
        hasShadowRoot: !!element.shadowRoot,
        width: Math.round(width),
        height: Math.round(height)
      };
    });

  return { elements, bodyHeight: document.body.scrollHeight };
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
  verdict: rendered.elements.some(element => element.defined && element.hasShadowRoot)
    ? 'rendered'
    : 'nothing-rendered'
};

await writeFile(`${out}.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

if (report.verdict !== 'rendered') exit(1);
