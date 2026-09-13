import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = path.dirname(fileURLToPath(import.meta.url));
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.png':'image/png', '.jpg':'image/jpeg', '.pdf':'application/pdf' };
const server = http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep)) throw new Error('Invalid path');
    const body = await readFile(file);
    res.writeHead(200, {'Content-Type':mime[path.extname(file)] || 'application/octet-stream'});
    res.end(body);
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const base = process.env.TEST_URL || `http://127.0.0.1:${server.address().port}/`;
let browser;
try {
  browser = await chromium.launch({headless:true, ...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
  for (const width of [1440,375]) {
    const page = await browser.newPage({viewport:{width,height:900},acceptDownloads:true,reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if(r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    page.on('requestfailed', r => errors.push(r.url()));
    await page.goto(base,{waitUntil:'networkidle'});
    const refs = await page.locator('[src],link[href]').evaluateAll(els => els.map(el => el.getAttribute('src') || el.getAttribute('href')));
    for (const ref of refs) {
      assert(!/^(file:|[a-z]:[\\/])/i.test(ref),ref);
      const response = await page.request.get(new URL(ref,base).href);
      assert.equal(response.status(),200,ref);
    }
    assert(await page.locator('img').evaluateAll(imgs => imgs.every(img => img.complete && img.naturalWidth > 0)),'All images decode');
    const anchors = await page.locator('a[href^="#"]').evaluateAll(els => els.map(el => el.getAttribute('href')));
    for (const hash of new Set(anchors)) assert.equal(await page.locator(hash).count(),1,hash);
    for (const hash of ['#home','#education','#projects','#work','#skills','#contact']) {
      if(width===375) await page.locator('.menu-toggle').click();
      await page.locator(`#main-nav a[href="${hash}"]`).click();
      assert.equal(new URL(page.url()).hash,hash);
      await page.reload({waitUntil:'networkidle'});
      assert.equal(new URL(page.url()).hash,hash);
      const bounds = await page.locator(hash).boundingBox();
      assert(bounds.y < 200 && bounds.y + bounds.height > 0,`Anchor visible: ${hash}`);
    }
    for (const carousel of await page.locator('.work-carousel').all()) {
      const slides = carousel.locator('figure');
      const count = await slides.count();
      for(let step=1;step<=count;step++) {
        await carousel.locator('.next').click();
        assert.match(await slides.nth(step%count).getAttribute('class'),/active/);
      }
      await carousel.locator('.prev').click();
      assert.match(await slides.last().getAttribute('class'),/active/);
    }
    assert.equal(await page.locator('a[href^="mailto:"]').getAttribute('href'),'mailto:heyue092@gmail.com');
    const pdf = await page.request.get(new URL('assets/resume.pdf',base).href);
    assert.equal(pdf.status(),200);
    assert.match(pdf.headers()['content-type'],/application\/pdf/);
    assert.equal((await pdf.body()).subarray(0,5).toString(),'%PDF-');
    const downloaded = page.waitForEvent('download');
    await page.locator('a[download]').click();
    assert.equal((await downloaded).suggestedFilename(),'何悦-产品经理简历.pdf');
    const before = await page.locator('.skill-card h3').textContent();
    await page.locator('.draw-button').click();
    await page.waitForFunction(old => document.querySelector('.skill-card h3').textContent !== old,before);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),'No horizontal overflow');
    assert.deepEqual(errors,[]);
    console.log(`PASS ${width}px: resources, images, six anchors + reload, all five carousels + wrap, mailto, PDF download, skills, overflow, JS errors`);
    await page.close();
  }
} finally {
  await browser?.close();
  server.close();
}
