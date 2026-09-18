/* Deutsch Einfach — B2 Schreiben Engine
   Requires: schreiben-topics-b2.js (SCHREIBEN_B2_TOPICS) loaded first,
   and a global TOPIC_ID string ("01".."41") set on the page. */

/* ==========================================================
   ⚙️ CONFIG — set this to your deployed Cloudflare Worker URL
   Example: "https://deutscheinfach-correction.YOURNAME.workers.dev"
   See /worker/cloudflare-worker.js + SETUP-GUIDE.md
   ========================================================== */
const CORRECTION_ENDPOINT = "https://deutsch-einfach-correction.soufianemouyr.workers.dev";

(function () {
    const topic = SCHREIBEN_B2_TOPICS[TOPIC_ID];
    if (!topic) {
        document.body.innerHTML = "<p style='padding:40px;font-family:sans-serif'>Thema nicht gefunden.</p>";
        return;
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
                    studentText: studentText,
                }),
            });

            if (!res.ok) throw new Error("HTTP " + res.status);
            const data = await res.json();
            renderResult(data);
        } catch (err) {
            resultBody.innerHTML =
                '<div class="error-banner">وقع مشكل فالتصحيح. تأكد أن الـ Worker خدام مزيان، وعاود المحاولة. (' +
                (err.message || err) +
                ")</div>";
        } finally {
            correctBtn.disabled = false;
            correctBtn.innerHTML = "✅ تصحيح";
        }
    });

    document.getElementById("result-close").addEventListener("click", function () {
        overlay.classList.add("hidden");
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

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }
})();