/* كيعاود يحسب گاع الـ ?v=… ف ملفات HTML من المحتوى الحقيقي ديال الملف.

   علاش: التيليفون كيخزن assets/*.js و *.css. إلا بدلتي النص
   وماشدّيتيش الـ ?v=، الزائر اللي دخل من قبل غادي يبقى يشوف
   النسخة القديمة. هاد السكريبت كيحل المشكل بضربة وحدة.

   الاستعمال:   node tools/bump.mjs
                node tools/bump.mjs --check    (كيشوف بلا مايبدل)
*/

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const check = process.argv.includes("--check");

const stamp = (file) =>
    createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 8);

const pages = readdirSync(".").filter((name) => name.endsWith(".html"));
const cache = new Map();
let changed = 0;
let missing = 0;

for (const page of pages) {
    const before = readFileSync(page, "utf8");

    const after = before.replace(
        /(assets\/[A-Za-z0-9._-]+\.(?:js|css))\?v=[0-9a-f]+/g,
        (whole, asset) => {
            if (!existsSync(asset)) {
                console.warn(`⚠  ${page}: ماكاينش ${asset}`);
                missing++;
                return whole;
            }
            if (!cache.has(asset)) cache.set(asset, stamp(asset));
            return `${asset}?v=${cache.get(asset)}`;
        });

    if (after !== before) {
        changed++;
        if (!check) writeFileSync(page, after);
        console.log(`${check ? "خاصو تبديل" : "تبدل"}: ${page}`);
    }
}

console.log(`\n${pages.length} صفحة · ${cache.size} ملف · ${changed} تبدلات`
          + (missing ? ` · ${missing} ملف ناقص` : ""));

if (check && changed) process.exit(1);
