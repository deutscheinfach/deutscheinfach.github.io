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

      /*
       * نص موضوع Premium. كيرجع غير للمشتركين.
       * النصوص كيسكنو فـ KV، ماشي فالـ repo — الـ repo عام.
       */
      if (typeof body.topicId === "string") {
        const topicId = body.topicId;

        if (!/^\d{2}$/.test(topicId)) {
          return jsonResponse({ error: "Invalid topic id." }, 400, allowedOrigin);
        }

        if (!env.TOPICS) {
          return jsonResponse(
            { error: "KV binding TOPICS is not configured." },
            500,
            allowedOrigin
          );
        }

        let claims;
        try {
          claims = await verifyIdToken(body.idToken);
        } catch (authError) {
          return jsonResponse(
            { error: "not_signed_in", details: authError.message },
            401,
            allowedOrigin
          );
        }

        let subscribed;
        try {
          subscribed = await hasActiveSubscription(claims.sub, body.idToken);
        } catch (lookupError) {
          return jsonResponse(
            { error: "subscription_lookup_failed", details: lookupError.message },
            502,
            allowedOrigin
          );
        }

        if (!subscribed) {
          return jsonResponse({ error: "not_subscribed" }, 403, allowedOrigin);
        }

        /*
         * مفتاح واحد "premium-topics" فيه جميع المواضيع: تحديث واحد
         * فالـ dashboard بدل 36. وإلا ما كانش، كنقلبو على مفتاح خاص
         * بالموضوع، باش يمكن تحديث واحد بوحدو.
         */
        const all = await env.TOPICS.get("premium-topics", "json");
        const topic = all?.[topicId] || (await env.TOPICS.get("topic-" + topicId, "json"));

        if (!topic) {
          return jsonResponse({ error: "Topic not found." }, 404, allowedOrigin);
        }

        return jsonResponse(topic, 200, allowedOrigin);
      }

      /* ترجمة الـ Anzeige والمهام للدارجة. ماشي محتاجة حساب. */
      if (body.translate && typeof body.translate.text === "string") {
        if (!env.GEMINI_API_KEY) {
          return jsonResponse(
            { error: "GEMINI_API_KEY is not configured." },
            500,
            allowedOrigin
          );
        }

        const sourceText = body.translate.text.trim().slice(0, 4000);

        if (sourceText.length < 2) {
          return jsonResponse(
            { error: "Nothing to translate." },
            400,
            allowedOrigin
          );
        }

        const translatePayload = {
          systemInstruction: {
            parts: [
              {
                text:
                  "ترجم النص الألماني للدارجة المغربية بالحروف العربية.\n" +
                  "- ترجمة مفهومة لطالب مغربي كيتعلم الألمانية، ماشي حرفية.\n" +
                  "- خلي الأرقام، الأسماء، العناوين والأثمنة كيف ما هوما.\n" +
                  "- حافظ على نفس تقسيم الأسطر والنقط.\n" +
                  "- رد غير بالترجمة، بلا شرح وبلا مقدمة.",
              },
            ],
          },
          contents: [{ role: "user", parts: [{ text: sourceText }] }],
          generationConfig: { temperature: 0.3 },
        };

        const translateResult = await callGeminiWithRetry(
          [env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL].concat(FALLBACK_MODELS),
          translatePayload,
          env.GEMINI_API_KEY
        );

        if (!translateResult.response.ok) {
          return jsonResponse(
            {
              error: "Translation failed.",
              details:
                translateResult.data?.error?.message ||
                "Unknown Gemini API error.",
            },
            502,
            allowedOrigin
          );
        }

        const translation =
          translateResult.data?.candidates?.[0]?.content?.parts
            ?.map((part) => part.text || "")
            .join("")
            .trim();

        if (!translation) {
          return jsonResponse(
            { error: "Gemini returned an empty translation." },
            502,
            allowedOrigin
          );
        }

        return jsonResponse({ translation }, 200, allowedOrigin);
      }

      const {
        level,
        taskType,
        situation,
        ad,
        points,
        words,
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
${words ? `Erwarteter Umfang: ${String(words).slice(0, 40)} Wörter` : ""}

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

/* ================= Firebase auth =================
 * الـ Worker ما كيثقش فالمتصفح: كيتحقق من توقيع الـ ID token
 * بالمفاتيح العمومية ديال Google، ومن بعد كيقرا الاشتراك من Firestore.
 */

const FIREBASE_PROJECT_ID = "deutsch-einfach-4c81f";

const FIREBASE_JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

let jwksCache = { keys: null, expiresAt: 0 };

async function getSigningKeys() {
  if (jwksCache.keys && Date.now() < jwksCache.expiresAt) return jwksCache.keys;

  const res = await fetch(FIREBASE_JWKS_URL);
  if (!res.ok) throw new Error("Could not fetch Google signing keys.");

  const data = await res.json();

  // Google كيقول شحال يعيش الكاش؛ كنحترموه بدل ما نخمنو.
  const maxAge = (res.headers.get("cache-control") || "").match(/max-age=(\d+)/);
  const ttl = maxAge ? Number(maxAge[1]) * 1000 : 3600 * 1000;

  jwksCache = { keys: data.keys, expiresAt: Date.now() + ttl };
  return data.keys;
}

function base64UrlToBytes(value) {
  let text = value.replace(/-/g, "+").replace(/_/g, "/");
  while (text.length % 4) text += "=";

  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function decodeSegment(segment) {
  return JSON.parse(new TextDecoder().decode(base64UrlToBytes(segment)));
}

async function verifyIdToken(token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) throw new Error("Malformed token.");

  const header = decodeSegment(parts[0]);
  const claims = decodeSegment(parts[1]);

  if (header.alg !== "RS256" || !header.kid) {
    throw new Error("Unexpected token algorithm.");
  }

  if (claims.aud !== FIREBASE_PROJECT_ID) throw new Error("Token audience mismatch.");
  if (claims.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) {
    throw new Error("Token issuer mismatch.");
  }
  if (!claims.sub) throw new Error("Token has no subject.");
  if (claims.exp <= Math.floor(Date.now() / 1000)) throw new Error("Token expired.");

  const keys = await getSigningKeys();
  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) throw new Error("Unknown signing key.");

  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64UrlToBytes(parts[2]),
    new TextEncoder().encode(parts[0] + "." + parts[1])
  );

  if (!valid) throw new Error("Invalid token signature.");

  return claims;
}

async function hasActiveSubscription(uid, idToken) {
  const url =
    `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}` +
    `/databases/(default)/documents/users/${uid}`;

  const res = await fetch(url, {
    headers: { Authorization: "Bearer " + idToken },
  });

  // ما كاينش وثيقة = ما كاينش اشتراك، ماشي خطأ.
  if (res.status === 404) return false;
  if (!res.ok) throw new Error("Could not read the subscription record.");

  const fields = (await res.json()).fields || {};

  if (fields.subscriptionActive?.booleanValue !== true) return false;

  const end = fields.subscriptionEnd?.timestampValue;
  if (end && new Date(end).getTime() <= Date.now()) return false;

  return true;
}
