/**
 * AI service: OpenRouter (Meta Llama 3.1 8B Instruct, free tier).
 * No Gemini — chat completions only.
 */

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'meta-llama/llama-3.1-8b-instruct:free';
const MAX_ATTEMPTS = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function shouldRetryResponse(status: number): boolean {
  return status === 429 || (status >= 500 && status <= 599);
}

function extractAssistantText(data: unknown): string {
  if (!data || typeof data !== 'object') return '';
  const d = data as Record<string, unknown>;
  const choices = d.choices;
  if (!Array.isArray(choices) || choices.length === 0) return '';
  const first = choices[0] as Record<string, unknown>;
  const message = first?.message as Record<string, unknown> | undefined;
  const content = message?.content;
  if (typeof content === 'string') return content;
  return '';
}

/**
 * Builds the full analytical prompt for the AI.
 */
export const buildPrompt = (formData: unknown, fileContent: string): string => {
  return ` 
أنت خبير استراتيجي في التسويق الرقمي (Senior Digital Marketing Strategist). مهمتك هي تحليل البيانات المقدمة وتحويلها إلى تقرير ذكاء تسويقي (Marketing Intelligence Report) احترافي وشامل لمشروع "Ai Social Project".

⚠️ قواعد التحليل (مهم جداً):
1. حساب نقاط الترتيب (Score 0-100) يجب أن يعتمد على معادلة متوازنة:
   - معدل التفاعل (Engagement Rate = Likes+Comments+Shares / Followers): ثقل 40%
   - جودة ونوع المحتوى (Content Quality & Variety): ثقل 20%
   - نية الشراء من التعليقات (Purchase Intent): ثقل 20%
   - عدد المتابعين (Followers Count): ثقل 10% (لا تجعله العامل المسيطر)
   - استمرارية النشر (Posting Frequency): ثقل 10%

2. يجب أن يتضمن التحليل مقارنة واقعية بين العميل (Client) والمنافسين الثلاثة.
3. استخرج أنماط سلوك الجمهور من "التعليقات الحقيقية" المقدمة.

البيانات للمعالجة:
${JSON.stringify(formData, null, 2)} 

بيانات الملفات الإضافية (إن وجدت):
${fileContent || 'لا يوجد ملفات إضافية'}

أجب بـ JSON فقط، بدون أي مقدمات أو خاتمة، متوافق تماماً مع هذا الهيكل:
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

async function postOpenRouterOnce(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  const referer = import.meta.env.VITE_OPENROUTER_HTTP_REFERER as string | undefined;
  const title = import.meta.env.VITE_OPENROUTER_APP_TITLE as string | undefined;
  if (referer) headers['HTTP-Referer'] = referer;
  if (title) headers['X-Title'] = title;

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const rawText = await response.text();
  let parsed: unknown;
  try {
    parsed = rawText ? JSON.parse(rawText) : {};
  } catch {
    parsed = { raw: rawText };
  }

  if (!response.ok) {
    const errMsg =
      typeof parsed === 'object' &&
      parsed !== null &&
      'error' in parsed &&
      typeof (parsed as { error?: { message?: string } }).error?.message === 'string'
        ? (parsed as { error: { message: string } }).error.message
        : rawText || `OpenRouter request failed (${response.status})`;
    const err = new Error(errMsg) as Error & { status?: number };
    err.status = response.status;
    throw err;
  }

  const text = extractAssistantText(parsed);
  if (!text.trim()) {
    throw new Error('OpenRouter returned an empty response.');
  }
  return text;
}

/**
 * Calls OpenRouter (Llama 3.1 8B Instruct free) with the built prompt.
 * Retries up to 3 times on transient failures.
 */
export async function callAI(formData: unknown, fileContent: string): Promise<string> {
  if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
    throw new Error(
      'OpenRouter API key missing. Set VITE_OPENROUTER_API_KEY in your environment.'
    );
  }

  const prompt = buildPrompt(formData, fileContent);
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await postOpenRouterOnce(prompt);
    } catch (err) {
      lastError = err;
      const status = typeof err === 'object' && err !== null && 'status' in err ? (err as { status?: number }).status : undefined;
      const isRetryable =
        status === undefined ||
        (typeof status === 'number' && shouldRetryResponse(status)) ||
        err instanceof TypeError;

      console.warn(`OpenRouter attempt ${attempt}/${MAX_ATTEMPTS} failed`, err);

      if (!isRetryable || attempt === MAX_ATTEMPTS) {
        break;
      }
      await sleep(400 * attempt * attempt);
    }
  }

  console.error('Error in aiService (OpenRouter):', lastError);
  throw lastError instanceof Error
    ? lastError
    : new Error('OpenRouter request failed after retries.');
}
