/**
 * AI service: Groq (Meta Llama 3.1 8B Instruct).
 * Direct integration with Groq API.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.1-8b-instant';
const MAX_ATTEMPTS = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function shouldRetryResponse(status: number): boolean {
  return status === 429 || (status >= 500 && status <= 599);
}

function extractAssistantText(data: any): string {
  if (!data || typeof data !== 'object') return '';
  return data.choices?.[0]?.message?.content || '';
}

/**
 * Builds the full analytical prompt for the AI.
 */
export const buildPrompt = (formData: unknown, fileContent: string): string => {
  return ` 
أنت خبير استراتيجي عالمي في التسويق الرقمي + محلل بيانات + خبير سلوك مستهلك (Elite Marketing Intelligence AI).

مهمتك: تحويل البيانات الخام إلى تقرير "Marketing Intelligence" احترافي جداً، دقيق، وقابل لاتخاذ قرارات فورية.

━━━━━━━━━━━━━━━━━━━━━━━
🧠 منهج التفكير (CRITICAL THINKING MODE)
━━━━━━━━━━━━━━━━━━━━━━━

1) حلل البيانات كـ:
- Data Analyst (أرقام)
- Behavioral Analyst (سلوك)
- Strategist (قرارات)

2) لا تعتمد على الافتراضات.
3) أي Insight يجب أن يكون مبني على:
   - رقم
   - أو نمط متكرر
   - أو دليل من التعليقات

4) لو البيانات ناقصة:
- لا تخترع
- استخدم أقرب استنتاج منطقي
- وقلل الثقة ضمنياً في التحليل

━━━━━━━━━━━━━━━━━━━━━━━
📊 قواعد حساب السكور (STRICT LOGIC)
━━━━━━━━━━━━━━━━━━━━━━━

احسب Score (0–100) باستخدام:

- Engagement Rate → 40%
- Content Quality & Variety → 20%
- Purchase Intent → 20%
- Followers Count → 10%
- Posting Frequency → 10%

⚠️ قواعد مهمة:
- Normalize كل القيم قبل الحساب
- لا تجعل Followers يطغى على Engagement
- الصفحات ذات التفاعل العالي تتفوق حتى لو المتابعين أقل

━━━━━━━━━━━━━━━━━━━━━━━
💬 تحليل التعليقات (CLAUDE-LEVEL)
━━━━━━━━━━━━━━━━━━━━━━━

استخرج:

1) Sentiment حقيقي:
- Positive / Negative / Neutral / Sarcasm

2) الأسباب:
- لماذا الجمهور سعيد أو غاضب؟

3) Purchase Intent:
- Identify real buying signals:
  (price / location / how to order / availability)

4) Behavioral Patterns:
- ماذا يريد الجمهور فعلياً؟
- ما الذي يزعجه؟

⚠️ مهم:
- استخدم أمثلة حقيقية من التعليقات
- لا تعطي Insights عامة

━━━━━━━━━━━━━━━━━━━━━━━
⚔️ Competitive Intelligence
━━━━━━━━━━━━━━━━━━━━━━━

- قارن العميل مع 3 منافسين:
  - بالأرقام
  - بالاستراتيجية
  - بالمحتوى

- حدد:
  - من القائد؟
  - لماذا؟
  - أين الفجوات؟

━━━━━━━━━━━━━━━━━━━━━━━
🧩 Content Intelligence
━━━━━━━━━━━━━━━━━━━━━━━

حلل:

- أفضل نوع محتوى (ولماذا)
- أسوأ نوع (ولماذا)
- أنماط النجاح (Hooks / Style / Timing)
- أنماط الفشل

━━━━━━━━━━━━━━━━━━━━━━━
🚀 Action Engine (ChatGPT-Level)
━━━━━━━━━━━━━━━━━━━━━━━

حوّل كل Insight إلى:

- Action واضح
- قابل للتنفيذ
- له تأثير مباشر

⚠️ لا تكتب نصائح عامة مثل:
"حسّن المحتوى"

✔️ بل:
"انشر 3 فيديوهات قصيرة أسبوعياً تركز على حل مشكلة السعر"

━━━━━━━━━━━━━━━━━━━━━━━
📦 قواعد الإخراج (STRICT JSON MODE)
━━━━━━━━━━━━━━━━━━━━━━━

⚠️ ممنوع تماماً:
- أي نص خارج JSON
- أي شرح إضافي
- أي Markdown

⚠️ يجب:
- كل القيم تكون واقعية
- لا تترك أي field فارغ
- لو لا يوجد بيانات → ضع أفضل تقدير منطقي

━━━━━━━━━━━━━━━━━━━━━━━
📥 البيانات للمعالجة:
━━━━━━━━━━━━━━━━━━━━━━━

${JSON.stringify(formData, null, 2)} 

━━━━━━━━━━━━━━━━━━━━━━━
📎 ملفات إضافية:
━━━━━━━━━━━━━━━━━━━━━━━

${fileContent || 'لا يوجد ملفات إضافية'}

⚠️ Ranking Rules (MANDATORY):

- يجب إرجاع 4 عناصر داخل "ranking" بالضبط:
  1 عميل + 3 منافسين

- كل عنصر يجب أن يحتوي:
  page, score, rank

- الترتيب:
  rank = 1 → الأعلى أداء
  rank = 4 → الأضعف

- لا يُسمح بإرجاع أقل أو أكثر من 4 عناصر

- Ensure all pages from input are included
- Do NOT drop any page

━━━━━━━━━━━━━━━━━━━━━━━
📤 OUTPUT (JSON ONLY — STRICT)
━━━━━━━━━━━━━━━━━━━━━━━

{ 
  "market_overview": { 
    "ranking": [ 
      {"page": "اسم_الصفحة", "score": 85, "rank": 1, "reason": "تحليل رقمي دقيق لسبب هذا الترتيب", "top_advantage": "الميزة التنافسية الأقوى"} 
    ], 
    "market_leader": {"page": "اسم", "why": "شرح تفصيلي لماذا هذا المنافس يقود السوق حالياً"}, 
    "quick_comparison": [ 
      {"metric": "Engagement Rate", "values": {"client": "5%", "comp1": "3%", "comp2": "2%", "comp3": "1%"}},
      {"metric": "Post Frequency", "values": {"client": "High", "comp1": "Low", "comp2": "Med", "comp3": "High"}}
    ] 
  }, 
  "audience": { 
    "sentiment": {"positive": 60, "negative": 25, "neutral": 15, "reasons": ["سبب1", "سبب2"]}, 
    "purchase_intent": {"percentage": 30, "examples": ["مثال حقيقي لتعليق يدل على نية الشراء"]}, 
    "persona": {"description": "وصف دقيق لشخصية العميل المثالي", "age_range": "25-35", "interests": ["اهتمام1", "اهتمام2"], "pain_points": ["مشكلة يعاني منها الجمهور"]}, 
    "negative_to_opportunity": "كيفية تحويل الانتقادات السلبية لفرص نمو" 
  }, 
  "competitive": { 
    "swot": [ 
      { 
        "page": "اسم_الصفحة", 
        "strengths": ["نقطة قوة1", "نقطة قوة2"], 
        "weaknesses": ["نقطة ضعف1", "نقطة ضعف2"], 
        "opportunities": ["فرصة نمو"], 
        "threats": ["تهديد محتمل"] 
      } 
    ], 
    "content_gaps": ["محتوى يطلبه الجمهور ولا يقدمه المنافسون"], 
    "engagement_comparison": [{"page": "اسم", "rate": "5.2%", "rank": 1}], 
    "differentiation": [{"vs": "اسم_المنافس", "strategy": "خطة التميز عنه"}] 
  }, 
  "performance": { 
    "data": [{"name": "اسم", "value": 85}], 
    "engagement_rates": [{"page": "اسم", "rate": 5.2}], 
    "urgent_improvements": [{"page": "اسم", "issue": "مشكلة عاجلة", "solution": "حل عملي فوري"}], 
    "hidden_insights": ["نمط سلوكي مخفي تم اكتشافه من البيانات"] 
  }, 
  "content": { 
    "best_type": {"type": "Video/Reels/Images", "reason": "لماذا هذا النوع هو الأنجح؟"}, 
    "caption_length": {"ideal": "قصير/متوسط/طويل", "reason": "تأثير طول النص على الجمهور"}, 
    "hashtags": {"needed": true, "recommendation": "استراتيجية الهاشتاجات المقترحة"}, 
    "best_time": "الوقت المثالي للنشر بناءً على التفاعل", 
    "next_content": "فكرة محتوى إبداعي للمنشور القادم" 
  }, 
  "actionable": { 
    "do": ["افعل (قائمة مهام)", "افعل"], 
    "dont": ["تجنب", "تجنب"], 
    "biggest_opportunity": "أكبر فرصة لزيادة المبيعات الآن", 
    "quick_win": "فوز سريع يمكن تحقيقه في 7 أيام", 
    "best_ad": "أفضل زاوية إعلانية (Ad Angle) مقترحة", 
    "checklist": [ 
      {"task": "مهمة محددة", "priority": "High/Medium/Low", "deadline": "موعد الإنجاز", "done": false} 
    ] 
  }, 
  "summary": ["توصية استراتيجية نهائية 1", "توصية 2"] 
 } 
  `;
};

async function postGroqOnce(prompt: string): Promise<string> {
  const apiKey = (import.meta as any).env.VITE_GROQ_API_KEY;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      response_format: { type: "json_object" } // عشان يبعت JSON نضيف
    }),
  });

  const rawData = await response.json();

  if (!response.ok) {
    const errMsg = rawData?.error?.message || `Groq request failed (${response.status})`;
    const err = new Error(errMsg) as any;
    err.status = response.status;
    throw err;
  }

  const text = extractAssistantText(rawData);
  if (!text.trim()) {
    throw new Error('Groq returned an empty response.');
  }
  return text;
}

export async function callAI(formData: unknown, fileContent: string): Promise<string> {
  const apiKey = (import.meta as any).env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('Groq API key missing. Set VITE_GROQ_API_KEY in your environment.');
  }

  const prompt = buildPrompt(formData, fileContent);
  let lastError: any;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await postGroqOnce(prompt);
    } catch (err: any) {
      lastError = err;
      const status = err.status;
      const isRetryable = status === undefined || shouldRetryResponse(status);

      console.warn(`Groq attempt ${attempt}/${MAX_ATTEMPTS} failed`, err);

      if (!isRetryable || attempt === MAX_ATTEMPTS) {
        break;
      }
      await sleep(400 * attempt * attempt);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Groq request failed after retries.');
}