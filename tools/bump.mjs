/* كيعاود يحسب گاع الـ ?v=… ف ملفات HTML من المحتوى الحقيقي ديال الملف.

   علاش: التيليفون كيخزن assets/*.js و *.css. إلا بدلتي النص
   وماشدّيتيش الـ ?v=، الزائر اللي دخل من قبل غادي يبقى يشوف
   النسخة القديمة. هاد السكريبت كيحل المشكل بضربة وحدة.

   الاستعمال:   node tools/bump.mjs
                node tools/bump.mjs --check    (كيشوف بلا مايبدل)
*/

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

const check = process.argv.includes("--check");

const stamp = (file) =>
    createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 8);

/* ملف JS مكسور كيطيح الصفحة كاملة، وكتبان بحال "ما زال ماكاينش
   تمارين". ماكنختموش حتى نتأكدو بلي كيتقرا. */
function broken(file) {
    if (!file.endsWith(".js")) return null;
    try {
        execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
        return null;
    } catch (error) {
        const out = String(error.stderr || error.stdout || error.message);
        const line = out.split("\n").find((l) => /SyntaxError|Error:/.test(l));
        return line ? line.trim() : "ماكيتقراش";
    }
}

const pages = readdirSync(".").filter((name) => name.endsWith(".html"));
const cache = new Map();
let changed = 0;
let missing = 0;

/* التحقق قبل كل شي — ماكنبدلو والو إلا كان شي ملف مكسور. */
const assets = new Set();
for (const page of pages) {
    for (const [, asset] of readFileSync(page, "utf8")
            .matchAll(/(assets\/[A-Za-z0-9._-]+\.(?:js|css))\?v=[0-9a-f]+/g)) {
        if (existsSync(asset)) assets.add(asset);
    }
}

const bad = [];
for (const asset of [...assets].sort()) {
    const why = broken(asset);
    if (why) bad.push(`${asset}\n     ${why}`);
}

if (bad.length) {
    console.error("\n❌ ماغاديش نختم — كاين ملف مكسور:\n");
    bad.forEach((b) => console.error("  · " + b));
    console.error("\nصلح الغلط وعاود. (غالبا علامة \" جوا نص بين \"…\")\n");
    process.exit(1);
}

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
