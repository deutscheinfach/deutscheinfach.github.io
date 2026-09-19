/* Deutsch Einfach — B2 Schreiben Engine
   Requires: schreiben-topics-b2.js (SCHREIBEN_B2_TOPICS) loaded first,
   and a global TOPIC_ID string ("01".."41") set on the page. */

/* ==========================================================
   ⚙️ CONFIG — set this to your deployed Cloudflare Worker URL
   Example: "https://deutscheinfach-correction.YOURNAME.workers.dev"
   See /worker/cloudflare-worker.js + SETUP-GUIDE.md
   ========================================================== */
const CORRECTION_ENDPOINT = "https://deutsch-einfach-correction.soufianemouyr.workers.dev";

(async function () {
    const meta = SCHREIBEN_B2_TOPICS[TOPIC_ID];
    if (!meta) {
        showNotice("Thema nicht gefunden.", "");
        return;
    }

    /* المواضيع Premium ما كيجيوش فالملف العام (الـ repo عام):
       كنجيبو النص من الـ Worker من بعد ما يتحقق من الاشتراك. */
    let topic = meta;

    if (!Array.isArray(meta.points) || meta.points.length === 0) {
        try {
            topic = Object.assign({}, meta, await loadPremiumTopic(TOPIC_ID));
        } catch (error) {
            showPremiumNotice(error.code || String(error.message || error));
            return;
        }
    }

    // ---------- render header ----------
    document.title = "Deutsch Einfach – " + topic.title;
    document.getElementById("task-title").textContent = topic.title;
    document.getElementById("task-sub").textContent =
        topic.level + " · " + topic.type;

    // ---------- render situation ----------
    document.getElementById("situation-ad").textContent = topic.ad;
    document.getElementById("situation-text").textContent = topic.situation;

    // ---------- render aufgabe points ----------
    const pointsWrap = document.getElementById("aufgabe-points");
    topic.points.forEach((p, i) => {
        const row = document.createElement("div");
        row.className = "point-row";
        row.innerHTML =
            '<span class="point-num">' + (i + 1) + "</span><span>" + p + "</span>";
        pointsWrap.appendChild(row);
    });

    // ---------- expected length ----------
    /* TELC كيحدد عدد الكلمات، والتصحيح كيحسبو. */
    if (topic.words) {
        const intro = document.querySelector(".aufgabe-intro");
        if (intro) {
            const badge = document.createElement("span");
            badge.className = "words-badge";
            badge.textContent = topic.words + " Wörter";
            intro.appendChild(badge);
        }
    }

    // ---------- timer ----------
    const timerEl = document.getElementById("timer-pill");
    let totalSeconds = (parseInt(topic.time, 10) || 30) * 60;
    function tick() {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        timerEl.textContent =
            "⏱ " + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
        if (totalSeconds <= 120) timerEl.classList.add("low");
        if (totalSeconds > 0) totalSeconds--;
    }
    tick();
    setInterval(tick, 1000);

    // ---------- theme toggle ----------
    document.getElementById("theme-toggle").addEventListener("click", function () {
        const cur = document.body.getAttribute("data-theme");
        document.body.setAttribute("data-theme", cur === "dark" ? "light" : "dark");
    });

    // ---------- fullscreen ----------
    document.getElementById("fullscreen-toggle").addEventListener("click", function () {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
    });

    // ---------- back ----------
    document.getElementById("back-btn").addEventListener("click", function () {
        window.location.href = "b2-schreiben.html";
    });

    // ---------- textarea + word count + placeholder ----------
    const textarea = document.getElementById("answer-text");
    const placeholder = document.getElementById("editor-placeholder");
    const wordCountEl = document.getElementById("word-count");

    function updateWordCount() {
        const text = textarea.value.trim();
        const words = text.length ? text.split(/\s+/).length : 0;
        wordCountEl.textContent = words + " كلمة";
        placeholder.classList.toggle("hidden", text.length > 0);
    }
    textarea.addEventListener("input", updateWordCount);
    updateWordCount();

    // ---------- umlaut insert buttons ----------
    document.querySelectorAll("[data-umlaut]").forEach((btn) => {
        btn.addEventListener("click", function () {
            const ch = btn.getAttribute("data-umlaut");
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            textarea.value =
                textarea.value.slice(0, start) + ch + textarea.value.slice(end);
            textarea.selectionStart = textarea.selectionEnd = start + ch.length;
            textarea.focus();
            updateWordCount();
        });
    });

    // ---------- translation ----------
    /* كنخزنو الترجمة باش الضغطة الثانية تخبي/تبين بلا ما نعاودو الطلب. */
    const translationCache = {};

    const translationSources = {
        situation: () => topic.ad + "\n\n" + topic.situation,
        aufgabe: () => topic.points.map((p, i) => (i + 1) + ". " + p).join("\n"),
    };

    document.querySelectorAll("[data-translate]").forEach((btn) => {
        const kind = btn.getAttribute("data-translate");
        const box = document.getElementById("translation-" + kind);
        if (!box || !translationSources[kind]) return;

        btn.addEventListener("click", async function () {
            // عندنا الترجمة ديجا: غير نبينوها/نخبيوها.
            if (translationCache[kind]) {
                box.hidden = !box.hidden;
                return;
            }

            btn.setAttribute("aria-busy", "true");
            box.classList.remove("error");
            box.textContent = "جاري الترجمة…";
            box.hidden = false;

            try {
                const res = await fetch(CORRECTION_ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        translate: { text: translationSources[kind]() },
                    }),
                });

                const raw = await res.text();
                let data = null;
                try {
                    data = JSON.parse(raw);
                } catch (parseError) {
                    data = null;
                }

                if (!res.ok || !data || !data.translation) {
                    const serverMessage = data
                        ? [data.error, data.details].filter(Boolean).join(" — ")
                        : raw.slice(0, 200);
                    throw new Error("HTTP " + res.status + (serverMessage ? " · " + serverMessage : ""));
                }

                translationCache[kind] = data.translation;
                box.textContent = data.translation;
            } catch (err) {
                const message = String(err && err.message ? err.message : err);
                box.classList.add("error");
                box.textContent = "ما قدرناش نترجمو. " + message + "\n" + errorHint(message);
            } finally {
                btn.removeAttribute("aria-busy");
            }
        });
    });

    // ---------- AI correction ----------
    const correctBtn = document.getElementById("correct-btn");
    const overlay = document.getElementById("result-overlay");
    const resultBody = document.getElementById("result-body");

    correctBtn.addEventListener("click", async function () {
        const studentText = textarea.value.trim();
        if (studentText.length < 20) {
            alert("كتب جواب أطول قبل ما تصحح.");
            return;
        }

        correctBtn.disabled = true;
        correctBtn.innerHTML =
            'كيتصحح <span class="loading-dots"><span></span><span></span><span></span></span>';

        overlay.classList.remove("hidden");
        resultBody.innerHTML =
            '<p style="text-align:center;padding:30px 0">جاري التصحيح…</p>';

        try {
            const res = await fetch(CORRECTION_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    level: topic.level,
                    taskType: topic.type,
                    situation: topic.situation,
                    ad: topic.ad,
                    points: topic.points,
                    words: topic.words || "",
                    studentText: studentText,
                }),
            });

            // كنقراو الجواب ديما، حتى ملي كيكون خطأ،
            // باش نوريو الرسالة الحقيقية اللي كيرجع الـ Worker.
            const raw = await res.text();

            let data = null;
            try {
                data = JSON.parse(raw);
            } catch (parseError) {
                data = null;
            }

            if (!res.ok) {
                const serverMessage = data
                    ? [data.error, data.details].filter(Boolean).join(" — ")
                    : raw.slice(0, 300);

                throw new Error(
                    "HTTP " + res.status + (serverMessage ? " · " + serverMessage : "")
                );
            }

            if (!data) throw new Error("الـ Worker رجّع جواب ماشي JSON: " + raw.slice(0, 300));

            renderResult(data);
        } catch (err) {
            const message = String(err && err.message ? err.message : err);

            resultBody.innerHTML =
                '<div class="error-banner"><strong>وقع مشكل فالتصحيح.</strong><br>' +
                escapeHtml(message) +
                "<br><br>" +
                escapeHtml(errorHint(message)) +
                "</div>";
        } finally {
            correctBtn.disabled = false;
            correctBtn.innerHTML = "✅ تصحيح";
        }
    });

    // زر الإغلاق اختياري: شي صفحات ماعندهاش، وخاصنا ما نطيحوش السكريبت كامل.
    const resultClose = document.getElementById("result-close");
    if (resultClose) {
        resultClose.addEventListener("click", function () {
            overlay.classList.add("hidden");
        });
    }

    // الإغلاق بالضغط برّا الكارد ولا بـ Escape
    overlay.addEventListener("click", function (event) {
        if (event.target === overlay) overlay.classList.add("hidden");
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") overlay.classList.add("hidden");
    });

    function renderResult(data) {
        // Expected shape from the worker/AI:
        // { score: number (0-45), summary: string,
        //   strengths: string[], improvements: string[],
        //   corrected_text: string }
        const score = Math.max(0, Math.min(45, Number(data.score) || 0));
        const pct = Math.round((score / 45) * 100);

        let html = "";
        html += '<div class="result-score"><span class="num">' + score +
            '</span><span class="max">/ 45</span></div>';
        html += '<div class="result-bar"><div class="result-bar-fill" style="width:' +
            pct + '%"></div></div>';

        if (data.summary) {
            html += '<div class="result-section"><h3>📝 ملاحظة عامة</h3><p>' +
                escapeHtml(data.summary) + "</p></div>";
        }
        if (data.strengths && data.strengths.length) {
            html += '<div class="result-section"><h3>✅ نقاط قوية</h3><ul>' +
                data.strengths.map((s) => "<li>" + escapeHtml(s) + "</li>").join("") +
                "</ul></div>";
        }
        if (data.improvements && data.improvements.length) {
            html += '<div class="result-section"><h3>🔧 نقاط للتحسين</h3><ul>' +
                data.improvements.map((s) => "<li>" + escapeHtml(s) + "</li>").join("") +
                "</ul></div>";
        }
        if (data.corrected_text) {
            html += '<div class="result-section"><h3>✍️ نسخة مصححة</h3><p style="white-space:pre-wrap">' +
                escapeHtml(data.corrected_text) + "</p></div>";
        }
        html += '<button class="result-close-btn result-close" id="result-close-2">فهمت، شكراً</button>';

        resultBody.innerHTML = html;
        document.getElementById("result-close-2").addEventListener("click", function () {
            overlay.classList.add("hidden");
        });
    }

    /* كتعطي شرح بالدارجة حسب نوع الخطأ */
    function errorHint(message) {
        const m = message.toLowerCase();

        if (m.indexOf("failed to fetch") !== -1 || m.indexOf("networkerror") !== -1) {
            return "💡 ما وصلناش للـ Worker: تأكد من CORRECTION_ENDPOINT، وأن الـ Worker مـ deployé، وأن ALLOWED_ORIGIN موافق للدومين ديال الموقع.";
        }
        if (m.indexOf("gemini_api_key") !== -1) {
            return "💡 المفتاح ما مضاف والو: زيد Secret سميتو GEMINI_API_KEY فـ Cloudflare (Workers → Settings → Variables → Secrets) وعاود Deploy.";
        }
        if (m.indexOf("api key not valid") !== -1 || m.indexOf("api_key_invalid") !== -1 || m.indexOf("http 401") !== -1 || m.indexOf("http 403") !== -1) {
            return "💡 المفتاح خايب ولا expiré: جيب واحد جديد من https://aistudio.google.com/apikey وبدّلو فـ Cloudflare.";
        }
        if (m.indexOf("high demand") !== -1 || m.indexOf("overloaded") !== -1 || m.indexOf("http 503") !== -1) {
            return "💡 السيرفرات ديال Gemini معمّرين دابا. تسنا شي دقيقة وعاود — المشكل مؤقت وماشي منك.";
        }
        if (m.indexOf("quota") !== -1 || m.indexOf("resource_exhausted") !== -1 || m.indexOf("http 429") !== -1) {
            return "💡 سالا الـ quota المجاني ديال اليوم. تسنا شوية ولا استعمل مفتاح آخر.";
        }
        if (m.indexOf("http 500") !== -1 || m.indexOf("http 502") !== -1) {
            return "💡 مشكل من جيهة الـ Worker. شوف اللوغ: npx wrangler tail";
        }

        return "💡 عاود المحاولة، وإلا بقا المشكل شوف اللوغ ديال الـ Worker: npx wrangler tail";
    }

    async function loadPremiumTopic(id) {
        const idToken = await (window.__deutschEinfachIdToken || Promise.resolve(null));

        const res = await fetch(CORRECTION_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topicId: id, idToken: idToken || "" }),
        });

        const raw = await res.text();
        let data = null;
        try {
            data = JSON.parse(raw);
        } catch (parseError) {
            data = null;
        }

        if (res.ok && data && Array.isArray(data.points)) return data;

        const error = new Error("HTTP " + res.status);
        error.code = data && data.error ? data.error : "HTTP " + res.status;
        throw error;
    }

    function showNotice(titleText, bodyHtml) {
        document.body.innerHTML =
            '<div style="max-width:560px;margin:60px auto;padding:28px;font-family:Arial,sans-serif;' +
            'background:#fff;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.12);text-align:center">' +
            '<h1 style="font-size:22px;margin-bottom:14px">' + titleText + "</h1>" +
            bodyHtml +
            "</div>";
    }

    function showPremiumNotice(code) {
        const backLink =
            '<a href="b2-schreiben.html" style="display:inline-block;margin-top:18px;background:#e30613;' +
            'color:#fff;padding:11px 20px;border-radius:9px;text-decoration:none;font-weight:bold">' +
            "← رجع للمواضيع</a>";

        if (code === "not_signed_in") {
            showNotice(
                "🔒 خاصك تسجل الدخول",
                '<p style="line-height:1.8;color:#555">هاد الموضوع ديال المشتركين. دخل لحسابك باش تكمل.</p>' +
                '<a href="login.html" style="display:inline-block;margin-top:18px;background:#111;color:#ffd500;' +
                'padding:11px 20px;border-radius:9px;text-decoration:none;font-weight:bold">تسجيل الدخول</a> ' +
                backLink
            );
            return;
        }

        if (code === "not_subscribed") {
            showNotice(
                "🔒 هاد الموضوع Premium",
                '<p style="line-height:1.8;color:#555">باش تفتح هاد الموضوع، فعّل الاشتراك ديالك.</p>' +
                '<a href="https://wa.me/212653618205" target="_blank" rel="noopener noreferrer" ' +
                'style="display:inline-block;margin-top:18px;background:#111;color:#ffd500;padding:11px 20px;' +
                'border-radius:9px;text-decoration:none;font-weight:bold">💬 WhatsApp</a> ' +
                backLink
            );
            return;
        }

        showNotice(
            "⚠️ ما قدرناش نحملو الموضوع",
            '<p style="line-height:1.8;color:#555">' + escapeHtml(code) + "</p>" +
            '<p style="line-height:1.8;color:#555;margin-top:8px">' + escapeHtml(errorHint(code)) + "</p>" +
            backLink
        );
    }

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }
})();