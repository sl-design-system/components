// Normalise the Figma reference for b-sesame-group-details.
//
// get_screenshot returned 934x1280 for a frame metadata reports as 1280x2392.
// Measured: the frame occupies x=0..684 (685px) of that image; x=685..933 (249px) is Figma
// canvas (#d7f0e7) carrying an annotation arrow that overflows the frame.
//   685/1280 = 0.535156  and  1280/2392 = 0.535117  -> the same uniform downscale.
// So: crop to (0,0,685,1280), then upscale to the frame's true 1280x2392.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const src = process.argv[2],
  out = process.argv[3];
const CROP_W = 685,
  CROP_H = 1280,
  TARGET_W = 1280,
  TARGET_H = 2392;
const b64 = readFileSync(src).toString('base64');

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: TARGET_W, height: TARGET_H },
  deviceScaleFactor: 1
});
await page.setContent(`<style>
  html,body{margin:0;padding:0;background:#fff}
  #w{width:${TARGET_W}px;height:${TARGET_H}px;overflow:hidden;position:relative}
  /* scale the SOURCE so its 685px crop width becomes TARGET_W, then clip */
  img{position:absolute;top:0;left:0;width:${(934 * TARGET_W) / CROP_W}px;height:${(1280 * TARGET_H) / CROP_H}px;image-rendering:auto}
</style><div id="w"><img src="data:image/png;base64,${b64}"></div>`);
await page.waitForLoadState('networkidle');
writeFileSync(out, await page.locator('#w').screenshot());
await browser.close();
console.log(`wrote ${out} at ${TARGET_W}x${TARGET_H}`);
