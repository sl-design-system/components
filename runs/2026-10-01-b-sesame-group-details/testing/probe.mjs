import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto(
  'http://localhost:6010/iframe.html?id=runs-b-sesame-group-details-page--basic&viewMode=story&globals=theme:my-digital-book',
  { waitUntil: 'networkidle' }
);
await p.waitForTimeout(1500);
console.log(
  JSON.stringify(
    await p.evaluate(() => {
      const deep = (root, tag) => {
        const out = [];
        const walk = n => {
          for (const el of n.querySelectorAll('*')) {
            if (el.localName === tag) out.push(el);
            if (el.shadowRoot) walk(el.shadowRoot);
          }
        };
        walk(root);
        return out;
      };
      const page = document.querySelector('sl-b-sesame-group-details-page');
      const av = deep(page.shadowRoot, 'sl-avatar')[0];
      const bg = deep(page.shadowRoot, 'sl-badge')[0];
      const r = e => {
        const b = e.getBoundingClientRect();
        return { w: +b.width.toFixed(1), h: +b.height.toFixed(1) };
      };
      return {
        avatar: {
          html: av.innerHTML.trim().slice(0, 200),
          box: r(av),
          shadow: av.shadowRoot.innerHTML.replace(/\s+/g, ' ').slice(0, 400)
        },
        badge: {
          text: bg.textContent.trim(),
          box: r(bg),
          attrs: [...bg.attributes].map(a => a.name + '=' + a.value),
          shadow: bg.shadowRoot.innerHTML.replace(/\s+/g, ' ').slice(0, 300),
          bgColor: getComputedStyle(bg).backgroundColor,
          assignedSlot: bg.assignedSlot?.name
        }
      };
    }),
    null,
    1
  )
);
await b.close();
