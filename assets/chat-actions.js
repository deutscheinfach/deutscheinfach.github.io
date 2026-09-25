/* ===== أدوات الرسائل فالشات =====

   كل رسالة عندها زر ⋯ (ولا ضغطة طويلة فالتيليفون، ولا
   كليك يمين فالـPC) كيحل مينيو فيه:

   - تفاعلات سريعة 👍 ❤️ 😂 😮 👏 🙏
   - ↩️ الرد على الرسالة (كتبان مقتطفة فوق الجواب)
   - ✍️ Korrigieren: الـAI كيصحح الألمانية ويشرح بالدارجة
   - 📋 نسخ
   - 🗑 مسح (صاحب الرسالة، مول المجموعة، ولا الأدمين فـCommunity)
   - 🚩 تبليغ و ⛔ بلوك

   الكتابة فـFirestore كتدوز عبر window.__chatApi اللي
   كيعرّفها chat.html (فيها db والمستخدم). التصحيح
   كيبقى غير عند اللي طلبو — ما كيتسجلش. */

(function () {
    "use strict";

    const ENDPOINT = "https://deutsch-einfach-correction.soufianemouyr.workers.dev";
    const EMOJIS = ["👍", "❤️", "😂", "😮", "👏", "🙏"];
    const REASONS = ["Beleidigung / سب وشتم", "Spam / إشهار", "Unangemessen / محتوى ماشي مناسب", "Andere / شي حاجة أخرى"];

    /* نتائج التصحيح: كترجع تتحط ملي الرسائل يتعاودو يترسمو */
    const extras = new Map();

    function api() { return window.__chatApi; }
    function el(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }
    function btn(className, text) {
        const node = el("button", className, text);
        node.type = "button";
        return node;
    }
    function findMsg(id) {
        const a = api();
        return a ? a.messages.find(function (m) { return m.id === id; }) : null;
    }
    function toast(text) { const a = api(); if (a) a.toast(text); }
    function nameOf(message) {
        const node = document.querySelector('.message[data-message-id="' + cssEscape(message.id) + '"] .message-name');
        return (node && node.textContent.trim()) || message.userName || "";
    }
    function cssEscape(v) {
        return window.CSS && CSS.escape ? CSS.escape(v) : String(v).replace(/"/g, '\\"');
    }
    function canDelete(message) {
        const a = api();
        if (!a) return false;
        if (message.userId === a.me()) return true;
        if (a.mode === "community" && a.isAdmin()) return true;
        if (a.mode === "group" && a.groupOwner && a.groupOwner() === a.me()) return true;
        return false;
    }

    /* ---------- المينيو ---------- */
    let sheet = null;
    function closeMenu() {
        if (sheet) { sheet.remove(); sheet = null; }
        document.removeEventListener("keydown", onEsc);
    }
    function onEsc(e) { if (e.key === "Escape") closeMenu(); }

    function openMenu(id, anchor) {
        closeMenu();
        const message = findMsg(id);
        const a = api();
        if (!message || !a) return;
        const mine = message.userId === a.me();

        const back = el("div", "ca-backdrop");
        back.addEventListener("click", function (e) { if (e.target === back) closeMenu(); });
        const menu = el("div", "ca-menu");
        menu.setAttribute("role", "menu");

        const reacts = el("div", "ca-reacts");
        EMOJIS.forEach(function (emoji) {
            const b = btn("ca-emoji" + (message.r && message.r[a.me()] === emoji ? " is-mine" : ""), emoji);
            b.setAttribute("aria-label", "Reaktion " + emoji);
            b.addEventListener("click", function () {
                closeMenu();
                a.react(id, emoji).catch(function (e) { console.error(e); toast("Reaktion fehlgeschlagen."); });
            });
            reacts.appendChild(b);
        });
        menu.appendChild(reacts);

        function item(icon, label, fn, danger) {
            const b = btn("ca-item" + (danger ? " is-danger" : ""));
            b.setAttribute("role", "menuitem");
            b.appendChild(el("span", "ca-ico", icon));
            b.appendChild(el("span", "ca-label", label));
            b.addEventListener("click", function () { closeMenu(); fn(); });
            menu.appendChild(b);
        }

        item("↩️", "Antworten · جاوب", function () { startReply(message); });
        if (message.text) {
            item("✍️", "Korrigieren · صحح الألمانية", function () { correct(message); });
            item("📋", "Kopieren · نسخ", function () {
                (navigator.clipboard ? navigator.clipboard.writeText(message.text) : Promise.reject())
                    .then(function () { toast("Kopiert ✓"); })
                    .catch(function () { toast("Kopieren nicht möglich."); });
            });
        }
        if (canDelete(message)) {
            item("🗑", "Löschen · مسح", function () { removeMsg(message); }, true);
        }
        if (!mine) {
            item("🚩", "Melden · بلّغ", function () { openReport(message); }, true);
            item("⛔", "Blockieren · بلوكي", function () { block(message); }, true);
        }

        back.appendChild(menu);
        document.body.appendChild(back);
        sheet = back;
        document.addEventListener("keydown", onEsc);

        /* فالـPC: حدا الرسالة. فالتيليفون: من التحت (CSS) */
        if (anchor && window.matchMedia("(min-width: 751px)").matches) {
            const r = anchor.getBoundingClientRect();
            const w = menu.offsetWidth, h = menu.offsetHeight;
            let left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), window.innerWidth - w - 8);
            let top = r.bottom + 6;
            if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 6);
            menu.style.left = left + "px";
            menu.style.top = top + "px";
            menu.classList.add("is-floating");
        }
        const first = menu.querySelector("button");
        if (first) first.focus({ preventScroll: true });
    }

    /* ---------- الرد ---------- */
    function startReply(message) {
        const text = message.text ? message.text : (message.imageId ? "📷 Bild" : "");
        window.__chatPendingReply = { id: message.id, userId: message.userId, name: nameOf(message), text: text.slice(0, 140) };
        const area = document.querySelector(".input-area");
        if (!area) return;
        let bar = area.querySelector(".ca-replybar");
        if (!bar) {
            bar = el("div", "ca-replybar");
            bar.style.flexBasis = "100%";
            const body = el("div", "ca-replybar-body");
            body.appendChild(el("span", "ca-replybar-name"));
            body.appendChild(el("span", "ca-replybar-text"));
            const x = btn("ca-replybar-x", "✕");
            x.setAttribute("aria-label", "Antwort abbrechen");
            x.addEventListener("click", clearReply);
            bar.append(body, x);
            const composer = area.querySelector(".composer");
            area.insertBefore(bar, composer || area.firstChild);
        }
        bar.querySelector(".ca-replybar-name").textContent = "↩️ " + (window.__chatPendingReply.name || "");
        bar.querySelector(".ca-replybar-text").textContent = window.__chatPendingReply.text;
        const input = document.getElementById("messageInput");
        if (input) input.focus();
    }
    function clearReply() {
        window.__chatPendingReply = null;
        const bar = document.querySelector(".ca-replybar");
        if (bar) bar.remove();
    }
    window.__chatClearReply = clearReply;

    function jumpTo(id) {
        const node = document.querySelector('.message[data-message-id="' + cssEscape(id) + '"]');
        if (!node) { toast("Die Nachricht ist nicht mehr da."); return; }
        node.scrollIntoView({ behavior: "smooth", block: "center" });
        node.classList.remove("ca-flash");
        void node.offsetWidth;
        node.classList.add("ca-flash");
    }

    /* ---------- التصحيح ---------- */
    function post(body) {
        return fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        }).then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (data) {
                if (!res.ok) throw new Error(data.error || ("HTTP " + res.status));
                return data;
            });
        });
    }
    /* النتائج مرتبة حسب النوع تحت نص الرسالة */
    function setExtra(id, kind, box) {
        if (!extras.has(id)) extras.set(id, new Map());
        const old = extras.get(id).get(kind);
        if (old && old !== box) old.remove();
        extras.get(id).set(kind, box);
        placeExtra(id);
    }
    function dropExtra(id, kind) {
        const boxes = extras.get(id);
        if (!boxes) return;
        const box = boxes.get(kind);
        if (box) box.remove();
        boxes.delete(kind);
        if (!boxes.size) extras.delete(id);
    }
    function placeExtra(id) {
        const boxes = extras.get(id);
        const node = document.querySelector('.message[data-message-id="' + cssEscape(id) + '"] .message-text');
        if (!boxes || !node) return;
        let after = node;
        boxes.forEach(function (box) {
            if (after.nextSibling !== box) after.after(box);
            after = box;
        });
    }
    function aiBox(kind, title) {
        const box = el("div", "ca-ai ca-ai-" + kind);
        const head = el("div", "ca-ai-head");
        head.appendChild(el("span", "ca-ai-title", title));
        const x = btn("ca-ai-x", "✕");
        x.setAttribute("aria-label", "Schließen");
        head.appendChild(x);
        box.appendChild(head);
        const body = el("div", "ca-ai-body", "…");
        box.appendChild(body);
        return { box: box, body: body, close: x };
    }
    function correct(message) {
        const ui = aiBox("co", "✍️ Korrektur");
        ui.close.addEventListener("click", function () { dropExtra(message.id, "co"); });
        setExtra(message.id, "co", ui.box);
        post({ chatCorrect: { text: message.text } })
            .then(function (data) {
                ui.body.textContent = "";
                if (data.ok) {
                    ui.body.appendChild(el("p", "ca-ok", "✅ Sehr gut! ما كاين حتى غلط."));
                } else {
                    ui.body.appendChild(el("p", "ca-fixed", data.corrected || ""));
                }
                (data.notes || []).forEach(function (n) {
                    const p = el("p", "ca-note", "• " + n);
                    p.dir = "auto";
                    ui.body.appendChild(p);
                });
            })
            .catch(function () {
                ui.body.textContent = "التصحيح ما خدمش دابا. عاود من بعد.";
                ui.box.classList.add("is-error");
            });
    }

    /* ---------- المسح، التبليغ، البلوك ---------- */
    function removeMsg(message) {
        if (!confirm("Nachricht löschen? · واش نمسحو هاد الرسالة؟")) return;
        api().remove(message.id)
            .then(function () { extras.delete(message.id); toast("Gelöscht ✓"); })
            .catch(function (e) { console.error(e); toast("Löschen fehlgeschlagen."); });
    }

    function openReport(message) {
        closeMenu();
        const back = el("div", "ca-backdrop");
        const card = el("div", "ca-menu ca-report");
        card.appendChild(el("h3", "ca-report-title", "🚩 Nachricht melden · بلّغ على الرسالة"));
        const quote = el("p", "ca-report-quote", "„" + (message.text || "📷 Bild").slice(0, 160) + "“");
        card.appendChild(quote);
        REASONS.forEach(function (reason) {
            const b = btn("ca-item", reason);
            b.addEventListener("click", function () {
                back.remove();
                api().report(message.id, reason)
                    .then(function () {
                        toast("Danke! Wir prüfen die Meldung. · شكراً، غادي نشوفوها");
                        if (confirm("Willst du diese Person auch blockieren? · بغيتي تبلوكيه حتى هو؟")) block(message, true);
                    })
                    .catch(function (e) { console.error(e); toast("Meldung fehlgeschlagen."); });
            });
            card.appendChild(b);
        });
        const cancel = btn("ca-item ca-cancel", "Abbrechen · رجوع");
        cancel.addEventListener("click", function () { back.remove(); });
        card.appendChild(cancel);
        back.addEventListener("click", function (e) { if (e.target === back) back.remove(); });
        back.appendChild(card);
        document.body.appendChild(back);
    }

    function block(message, skipConfirm) {
        const name = nameOf(message) || "diese Person";
        if (!skipConfirm && !confirm(name + " blockieren? Du siehst dann keine Nachrichten mehr von dieser Person.\nواش نبلوكيو " + name + "؟ ما غاديش تبان ليك الرسائل ديالو.")) return;
        api().setBlocked(message.userId, true)
            .then(function () { toast("Blockiert ✓ · تبلوكا"); refreshBlockedRow(); })
            .catch(function (e) { console.error(e); toast("Blockieren fehlgeschlagen."); });
    }

    /* الإعدادات: لائحة الناس المبلوكيين مع زر "حيد البلوك" */
    function refreshBlockedRow() {
        const a = api();
        const row = document.querySelector(".ca-blocked-row .val");
        if (row && a) { const n = a.blocked().length; row.textContent = n ? String(n) : ""; }
    }
    function blockedRow() {
        const list = document.querySelector(".settings-list");
        if (!list || list.querySelector(".ca-blocked-row")) return;
        const row = btn("settings-row ca-blocked-row");
        row.appendChild(el("span", "ico ca-row-ico", "⛔"));
        row.appendChild(document.createTextNode("الناس اللي بلوكيتي"));
        row.appendChild(el("span", "val"));
        row.addEventListener("click", openBlocked);
        const danger = list.querySelector(".settings-row.danger");
        list.insertBefore(row, danger || null);
        refreshBlockedRow();
    }
    function openBlocked() {
        const a = api();
        if (!a) return;
        const back = el("div", "ca-backdrop");
        const card = el("div", "ca-menu ca-report");
        card.appendChild(el("h3", "ca-report-title", "⛔ Blockiert · الناس اللي بلوكيتي"));
        const ids = a.blocked();
        if (!ids.length) card.appendChild(el("p", "ca-report-quote", "ما بلوكيتي حتى واحد."));
        ids.forEach(function (uid) {
            const line = el("div", "ca-blocked-line");
            const nm = el("span", "ca-blocked-name", "…");
            a.userName(uid).then(function (n) { nm.textContent = n; });
            const un = btn("ca-unblock", "Entsperren · حيد البلوك");
            un.addEventListener("click", function () {
                a.setBlocked(uid, false).then(function () { line.remove(); refreshBlockedRow(); toast("Entsperrt ✓"); })
                    .catch(function () { toast("Fehler."); });
            });
            line.append(nm, un);
            card.appendChild(line);
        });
        const close = btn("ca-item ca-cancel", "Schließen · سد");
        close.addEventListener("click", function () { back.remove(); });
        card.appendChild(close);
        back.addEventListener("click", function (e) { if (e.target === back) back.remove(); });
        back.appendChild(card);
        document.body.appendChild(back);
    }

    /* ---------- الأحداث ---------- */
    function init() {
        const messages = document.getElementById("messages");
        if (!messages) return;

        messages.addEventListener("click", function (e) {
            const more = e.target.closest(".msg-more");
            if (more) { openMenu(more.dataset.more, more); return; }
            const react = e.target.closest(".msg-react");
            if (react && api()) {
                api().react(react.dataset.msg, react.dataset.react).catch(function () { toast("Reaktion fehlgeschlagen."); });
                return;
            }
            const quote = e.target.closest(".msg-quote");
            if (quote) jumpTo(quote.dataset.jump);
        });

        /* كليك يمين فالـPC */
        messages.addEventListener("contextmenu", function (e) {
            const bubble = e.target.closest(".message-content");
            if (!bubble || e.target.closest("a, img")) return;
            const msg = bubble.closest(".message");
            if (!msg) return;
            e.preventDefault();
            openMenu(msg.dataset.messageId, bubble);
        });

        /* ضغطة طويلة فالتيليفون */
        let timer = 0, startX = 0, startY = 0;
        messages.addEventListener("touchstart", function (e) {
            const bubble = e.target.closest(".message-content");
            if (!bubble || e.target.closest("button, a")) return;
            const msg = bubble.closest(".message");
            const t = e.touches[0];
            startX = t.clientX; startY = t.clientY;
            timer = setTimeout(function () {
                timer = 0;
                if (navigator.vibrate) navigator.vibrate(15);
                openMenu(msg.dataset.messageId, bubble);
            }, 480);
        }, { passive: true });
        messages.addEventListener("touchmove", function (e) {
            const t = e.touches[0];
            if (timer && (Math.abs(t.clientX - startX) > 10 || Math.abs(t.clientY - startY) > 10)) { clearTimeout(timer); timer = 0; }
        }, { passive: true });
        ["touchend", "touchcancel"].forEach(function (name) {
            messages.addEventListener(name, function () { if (timer) { clearTimeout(timer); timer = 0; } });
        });

        blockedRow();
    }

    /* chat.html كيعيط لهادي من بعد كل رسم */
    window.__chatAfterRender = function () {
        extras.forEach(function (_, id) { placeExtra(id); });
        refreshBlockedRow();
    };

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
})();
