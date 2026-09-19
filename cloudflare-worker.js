// Deutsch Einfach - B2 Schreiben Correction Worker
// Gemini API backend
//
// Required Cloudflare secret:
// GEMINI_API_KEY
//
// Optional environment variables:
// ALLOWED_ORIGIN = https://deutscheinfach.github.io
// GEMINI_MODEL   = gemini-3.6-flash

// gemini-2.5-flash بقا محجور على الحسابات الجداد، و Gemini نفسها
// كتوصي بـ gemini-3.6-flash. تأكدنا منو عبر ListModels.
// يقدر يتبدل بلا ما نعاودو الكود: زيد variable سميتها GEMINI_MODEL.
const DEFAULT_GEMINI_MODEL = "gemini-3.6-flash";

export default {
  async fetch(request, env) {
    const allowedOrigin =
      env.ALLOWED_ORIGIN || "https://deutscheinfach.github.io";

    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(allowedOrigin),
      });
    }

    if (request.method !== "POST") {
      return jsonResponse(
        { error: "Method not allowed" },
        405,
        allowedOrigin
      );
    }

    try {
      const body = await request.json();

      /*
       * أداة تشخيص: POST {"listModels": true}
       * كترجع الموديلات المتاحة للمفتاح. المفتاح كيبقى فالسيرفر.
       */
      if (body.listModels === true) {
        if (!env.GEMINI_API_KEY) {
          return jsonResponse(
            { error: "GEMINI_API_KEY is not configured." },
            500,
            allowedOrigin
          );
        }

        const listResponse = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models?pageSize=200",
          { headers: { "x-goog-api-key": env.GEMINI_API_KEY } }
        );

        const listData = await listResponse.json();

        if (!listResponse.ok) {
          return jsonResponse(
            {
              error: "ListModels failed.",
              details: listData?.error?.message || "Unknown error.",
            },
            502,
            allowedOrigin
          );
        }

        // غير اللي كيدعمو generateContent — هوما اللي كينفعونا.
        const usable = (listData.models || [])
          .filter((m) =>
            (m.supportedGenerationMethods || []).includes("generateContent")
          )
          .map((m) => m.name);

        return jsonResponse(
          { currentModel: env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL, usable },
          200,
          allowedOrigin
        );
      }

      const {
        level,
        taskType,
        situation,
        ad,
        points,
        studentText,
      } = body;

      // Basic validation
      if (!studentText || studentText.trim().length < 10) {
        return jsonResponse(
          { error: "Student text is too short." },
          400,
          allowedOrigin
        );
      }

      if (!env.GEMINI_API_KEY) {
        return jsonResponse(
          { error: "GEMINI_API_KEY is not configured." },
          500,
          allowedOrigin
        );
      }

      // Limit input size
      const safeStudentText = studentText
        .trim()
        .slice(0, 4000);

      const safeSituation = String(situation || "")
        .slice(0, 2000);

      const safeAd = String(ad || "")
        .slice(0, 2000);

      const safePoints = Array.isArray(points)
        ? points.slice(0, 8)
        : [];

      const systemPrompt = `
Du bist ein erfahrener TELC-Deutschprüfer und korrigierst
einen Schreibtext auf dem Niveau ${level || "B2"}.

Aufgabe:
Bewerte den Text nach diesen Bereichen:

1. Inhaltliche Angemessenheit
2. Kommunikative Gestaltung
3. Formale Richtigkeit

Die Gesamtbewertung ist von 0 bis 45 Punkten.

WICHTIG:
- Bewerte den tatsächlichen Studententext.
- Erfinde keine Informationen.
- Berücksichtige die Aufgabenstellung und alle vorgegebenen Punkte.
- Der Studententext soll nicht einfach komplett neu erfunden werden.
- corrected_text soll eine verbesserte, natürliche deutsche Version des
  ursprünglichen Textes sein.
- Behalte die ursprüngliche Aussage und Absicht möglichst bei.
- summary, strengths und improvements müssen auf Marokkanischem Darija
  (Arabisch-Schrift) geschrieben werden.
- corrected_text muss vollständig auf Deutsch sein.
- Gib ausschließlich gültiges JSON zurück.
- Kein Markdown.
- Keine Erklärung außerhalb des JSON.

Das JSON muss exakt diese Struktur haben:

{
  "score": 0,
  "summary": "...",
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "corrected_text": "..."
}

score muss eine Zahl zwischen 0 und 45 sein.
`;

      const userPrompt = `
Prüfungsniveau: ${level || "B2"}
Aufgabentyp: ${taskType || "Schreiben"}

Situation:
${safeSituation}

Anzeige / Kontext:
${safeAd}

Aufgabenpunkte:
${JSON.stringify(safePoints)}

Text des Studenten:
${safeStudentText}

Korrigiere und bewerte diesen Text gemäß den Regeln.
`;

      // Gemini REST API
      const requestPayload = {
          systemInstruction: {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },

          contents: [
            {
              role: "user",
              parts: [
                {
                  text: userPrompt,
                },
              ],
            },
          ],

          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                score: {
                  type: "INTEGER",
                },
                summary: {
                  type: "STRING",
                },
                strengths: {
                  type: "ARRAY",
                  items: {
                    type: "STRING",
                  },
                },
                improvements: {
                  type: "ARRAY",
                  items: {
                    type: "STRING",
                  },
                },
                corrected_text: {
                  type: "STRING",
                },
              },
              required: [
                "score",
                "summary",
                "strengths",
                "improvements",
                "corrected_text",
              ],
            },
          },
        };

      const primaryModel = env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;

      // ديما كنبداو بالموديل الأساسي، ومن بعد الاحتياطيين إلا كان معمّر.
      const candidates = [primaryModel].concat(
        FALLBACK_MODELS.filter((m) => m !== primaryModel)
      );

      const { response: geminiResponse, data: geminiData } =
        await callGeminiWithRetry(
          candidates,
          requestPayload,
          env.GEMINI_API_KEY
        );

      if (!geminiResponse.ok) {
        console.error("Gemini API error:", geminiData);

        return jsonResponse(
          {
            error: "Gemini API request failed.",
            details:
              (geminiData?.error?.message ||
                "Unknown Gemini API error.") +
              " (Gemini HTTP " + geminiResponse.status + ")",
            retryable:
              geminiResponse.status === 503 || geminiResponse.status === 429,
          },
          502,
          allowedOrigin
        );
      }

      // Extract Gemini generated text
      const generatedText =
        geminiData?.candidates?.[0]?.content?.parts
          ?.map((part) => part.text || "")
          .join("")
          .trim();

      if (!generatedText) {
        console.error("Empty Gemini response:", geminiData);

        return jsonResponse(
          { error: "Gemini returned an empty response." },
          502,
          allowedOrigin
        );
      }

      let result;

      try {
        result = JSON.parse(generatedText);
      } catch (parseError) {
        console.error(
          "Failed to parse Gemini JSON:",
          generatedText
        );

        return jsonResponse(
          {
            error: "Gemini returned invalid JSON.",
          },
          502,
          allowedOrigin
        );
      }

      // Normalize / validate result
      const score = Number(result.score);

      if (
        !Number.isFinite(score) ||
        score < 0 ||
        score > 45
      ) {
        return jsonResponse(
          { error: "Invalid score returned by Gemini." },
          502,
          allowedOrigin
        );
      }

      const finalResult = {
        score: Math.round(score),
        summary: String(result.summary || ""),
        strengths: Array.isArray(result.strengths)
          ? result.strengths.map(String)
          : [],
        improvements: Array.isArray(result.improvements)
          ? result.improvements.map(String)
          : [],
        corrected_text: String(result.corrected_text || ""),
      };

      return jsonResponse(
        finalResult,
        200,
        allowedOrigin
      );

    } catch (error) {
      console.error("Worker error:", error);

      return jsonResponse(
        {
          error: "Internal server error.",
        },
        500,
        allowedOrigin
      );
    }
  },
};


function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
  };
}


function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin),
  });
}


/*
 * 503 = الموديل معمّر، و 429 = تجاوزنا المعدل. بجوج مؤقتين،
 * علا هاكدا كنعاودو المحاولة قبل ما نيأسو، ومن بعد كنجربو موديل احتياطي.
 */
const FALLBACK_MODELS = ["gemini-3.5-flash", "gemini-flash-latest"];

const MAX_ATTEMPTS_PER_MODEL = 3;

function isTransient(status) {
  return status === 503 || status === 429 || status >= 500;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGeminiWithRetry(models, payload, apiKey) {
  let last = null;

  for (const model of models) {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) return { response, data };

      last = { response, data };

      // خطأ دائم (مفتاح خايب، موديل ماكاينش): ما كاين علاش نعاودو.
      if (!isTransient(response.status)) break;

      console.error(
        `Gemini ${model} attempt ${attempt} failed with ${response.status}`
      );

      // 1s ثم 2s — الـ Worker عندو حدود ديال الوقت، ف ما نطولوش.
      if (attempt < MAX_ATTEMPTS_PER_MODEL) await sleep(attempt * 1000);
    }
  }

  return last;
}
