/**
 * Regenerates PNG/ICO icons and the default social sharing image from the SVG
 * brand files. Run after changing the logo:  npm run brand:assets
 */
import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";

const pub = new URL("../public/", import.meta.url);
const favicon = await readFile(new URL("favicon.svg", pub), "utf8");
const icon = await readFile(new URL("brand/icon.svg", pub), "utf8");

const browser = await chromium.launch();
const page = await browser.newPage();

async function renderSvg(svg, size) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg width="${size}" height="${size}" `)}</body></html>`);
  return page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}

for (const [name, size] of [["icon-512.png", 512], ["icon-192.png", 192], ["apple-touch-icon.png", 180]]) {
  await writeFile(new URL(name, pub), await renderSvg(favicon, size));
}

// favicon.ico containing 16, 32 and 48 px PNG images.
const pngs = await Promise.all([16, 32, 48].map((s) => renderSvg(favicon, s).then((buf) => ({ s, buf }))));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = 6 + 16 * pngs.length;
const entries = pngs.map(({ s, buf }) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(buf.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += buf.length;
  return e;
});
await writeFile(new URL("favicon.ico", pub), Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]));

// Default Open Graph image (1200x630).
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<!doctype html><html><head><style>
  body{margin:0;width:1200px;height:630px;background:#05080f;font-family:Inter,Segoe UI,Arial,sans-serif;color:#eef2fa;overflow:hidden;position:relative}
  .glow{position:absolute;width:760px;height:760px;right:-200px;top:-260px;border-radius:50%;background:radial-gradient(circle,rgba(76,125,255,.45),rgba(34,211,238,.08) 55%,transparent 70%)}
  .grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(148,163,200,.07) 1px,transparent 1px),linear-gradient(to bottom,rgba(148,163,200,.07) 1px,transparent 1px);background-size:56px 56px}
  .wrap{position:absolute;left:80px;top:90px;right:80px}
  .brand{display:flex;align-items:center;gap:22px}
  .brand svg{width:96px;height:96px}
  .name{font-size:52px;font-weight:800;letter-spacing:-1.5px}
  .sub{font-size:17px;letter-spacing:7px;color:#a3aec5;font-weight:600;margin-top:6px}
  h1{font-size:60px;line-height:1.08;letter-spacing:-2px;margin:70px 0 0;max-width:900px;font-weight:700}
  h1 span{background:linear-gradient(100deg,#9db6ff,#67e8f9);-webkit-background-clip:text;color:transparent}
  p{font-size:24px;color:#a3aec5;margin-top:22px}
</style></head><body><div class="grid"></div><div class="glow"></div><div class="wrap">
  <div class="brand">${icon}<div><div class="name">Digivertising</div><div class="sub">MEDIA &amp; PR</div></div></div>
  <h1>Growth, reputation and technology, <span>engineered together.</span></h1>
  <p>Digital marketing · Public relations · Web, software &amp; AI</p>
</div></body></html>`);
await writeFile(new URL("og-default.png", pub), await page.screenshot({ type: "png" }));

await browser.close();
console.log("Brand assets generated in public/");
