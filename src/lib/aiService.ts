/**
 * AI service: Groq (llama-3.3-70b-versatile) — upgraded for richer output.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'llama-3.3-70b-versatile';   // ← أقوى من 8b ويدعم JSON mode
const MAX_ATTEMPTS = 3;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function shouldRetry(status: number) {
  return status === 429 || (status >= 500 && status <= 599);
}

function extractText(data: any): string {
  return data?.choices?.[0]?.message?.content || '';
}

// ─────────────────────────────────────────────────────────────
// Prompt builder
// ─────────────────────────────────────────────────────────────
export const buildPrompt = (formData: any, fileContent: string): string => {
  const clientF        = parseInt(formData?.client?.followers)    || 0;
  const clientP        = parseInt(formData?.client?.total_posts)  || 0;
  const clientLikes    = parseInt(formData?.client?.avg_likes)    || 0;
  const clientComments = parseInt(formData?.client?.avg_comments) || 0;
  const clientShares   = parseInt(formData?.client?.avg_shares)   || 0;
  const clientType     = formData?.client?.content_type           || 'غير محدد';
  const clientFreq     = formData?.client?.frequency              || 'غير محدد';
  const clientUrl      = formData?.client?.url                    || 'غير محدد';
  const clientTime     = formData?.client?.posting_time           || 'غير محدد';
  const clientAds      = formData?.client?.ads                    || 'لا';
  const clientComments2 = formData?.client?.sample_comments       || '';

  const comp1F = parseInt(formData?.comp1?.followers)    || 0;
  const comp2F = parseInt(formData?.comp2?.followers)    || 0;
  const comp3F = parseInt(formData?.comp3?.followers)    || 0;
  const comp1P = parseInt(formData?.comp1?.total_posts)  || 0;
  const comp2P = parseInt(formData?.comp2?.total_posts)  || 0;
  const comp3P = parseInt(formData?.comp3?.total_posts)  || 0;
  const comp1L = parseInt(formData?.comp1?.avg_likes)    || 0;
  const comp2L = parseInt(formData?.comp2?.avg_likes)    || 0;
  const comp3L = parseInt(formData?.comp3?.avg_likes)    || 0;

  const avgF = [comp1F, comp2F, comp3F].filter(Boolean).reduce((a, b) => a + b, 0) / ([comp1F, comp2F, comp3F].filter(Boolean).length || 1);
  const avgP = [comp1P, comp2P, comp3P].filter(Boolean).reduce((a, b) => a + b, 0) / ([comp1P, comp2P, comp3P].filter(Boolean).length || 1);

  const engRate     = clientF > 0 ? (((clientLikes + clientComments + clientShares) / clientF) * 100).toFixed(2) : '0';
  const comp1Eng    = comp1F  > 0 ? ((comp1L / comp1F) * 100).toFixed(2) : '0';
  const comp2Eng    = comp2F  > 0 ? ((comp2L / comp2F) * 100).toFixed(2) : '0';
  const comp3Eng    = comp3F  > 0 ? ((comp3L / comp3F) * 100).toFixed(2) : '0';
  const followerGap = clientF - Math.round(avgF);

  const pages = [
    { url: clientUrl,                              f: clientF },
    { url: formData?.comp1?.url || 'المنافس 1',    f: comp1F  },
    { url: formData?.comp2?.url || 'المنافس 2',    f: comp2F  },
    { url: formData?.comp3?.url || 'المنافس 3',    f: comp3F  },
  ];
  const maxF          = Math.max(...pages.map(p => p.f));
  const strongestComp = pages.find(p => p.f === maxF && p.url !== clientUrl)?.url || pages[1].url;

  return `
أنت خبير استراتيجي عالمي في التسويق الرقمي ومحلل بيانات محترف.

مهمتك: تحليل البيانات التالية وإنتاج تقرير Marketing Intelligence كامل.

━━━━━━━━━━━━━━━━━━━━━━━
📥 بيانات العميل:
━━━━━━━━━━━━━━━━━━━━━━━
الرابط: ${clientUrl}
المتابعون: ${clientF.toLocaleString()} | المنشورات: ${clientP}
متوسط اللايكات: ${clientLikes} | التعليقات: ${clientComments} | المشاركات: ${clientShares}
معدل التفاعل المحسوب: ${engRate}%
نوع المحتوى: ${clientType} | التكرار: ${clientFreq} | وقت النشر: ${clientTime}
إعلانات: ${clientAds}
تعليقات عينة: ${clientComments2 || 'لا يوجد'}

━━━━━━━━━━━━━━━━━━━━━━━
📥 المنافسون:
━━━━━━━━━━━━━━━━━━━━━━━
المنافس 1: ${formData?.comp1?.url || 'N/A'}
  متابعون: ${comp1F.toLocaleString()} | منشورات: ${comp1P} | avg likes: ${comp1L} | engagement: ${comp1Eng}%
  محتوى: ${formData?.comp1?.content_type || 'N/A'} | تكرار: ${formData?.comp1?.frequency || 'N/A'}
  تعليقات: ${formData?.comp1?.sample_comments || 'لا يوجد'}

المنافس 2: ${formData?.comp2?.url || 'N/A'}
  متابعون: ${comp2F.toLocaleString()} | منشورات: ${comp2P} | avg likes: ${comp2L} | engagement: ${comp2Eng}%
  محتوى: ${formData?.comp2?.content_type || 'N/A'} | تكرار: ${formData?.comp2?.frequency || 'N/A'}
  تعليقات: ${formData?.comp2?.sample_comments || 'لا يوجد'}

المنافس 3: ${formData?.comp3?.url || 'N/A'}
  متابعون: ${comp3F.toLocaleString()} | منشورات: ${comp3P} | avg likes: ${comp3L} | engagement: ${comp3Eng}%
  محتوى: ${formData?.comp3?.content_type || 'N/A'} | تكرار: ${formData?.comp3?.frequency || 'N/A'}
  تعليقات: ${formData?.comp3?.sample_comments || 'لا يوجد'}

━━━━━━━━━━━━━━━━━━━━━━━
📊 إحصاءات جاهزة:
━━━━━━━━━━━━━━━━━━━━━━━
متوسط متابعي المنافسين: ${Math.round(avgF).toLocaleString()}
فجوة المتابعين: ${followerGap >= 0 ? '+' : ''}${followerGap.toLocaleString()}
متوسط منشورات المنافسين: ${Math.round(avgP)}
أقوى منافس: ${strongestComp} (${maxF.toLocaleString()} متابع)

━━━━━━━━━━━━━━━━━━━━━━━
⚠️ قواعد صارمة جداً:
━━━━━━━━━━━━━━━━━━━━━━━
1. كل insight لازم يستند لرقم حقيقي من البيانات أعلاه
2. ممنوع نصائح عامة مثل "حسّن المحتوى" — لازم تقول بالظبط إيه وليه وبأي رقم
3. الخطط 30/60/90 يوم لازم تكون واقعية ومبنية على الفجوات الفعلية
4. السكور يُحسب: 40% Engagement + 20% Content Quality + 20% Purchase Intent + 10% Followers + 10% Frequency
5. لازم ترجع 4 عناصر في ranking (العميل + 3 منافسين)

أرجع JSON فقط — بدون أي نص خارج الـ JSON، بدون markdown، بدون شرح:

{
  "market_overview": {
    "ranking": [
      {
        "page": "اسم مختصر للصفحة",
        "score": 85,
        "rank": 1,
        "reason": "سبب الترتيب بالأرقام الفعلية من البيانات",
        "top_advantage": "الميزة التنافسية الأقوى"
      },
      {
        "page": "اسم المنافس 1",
        "score": 60,
        "rank": 2,
        "reason": "سبب الترتيب بالأرقام",
        "top_advantage": "ميزته"
      },
      {
        "page": "اسم المنافس 2",
        "score": 55,
        "rank": 3,
        "reason": "سبب الترتيب بالأرقام",
        "top_advantage": "ميزته"
      },
      {
        "page": "اسم المنافس 3",
        "score": 40,
        "rank": 4,
        "reason": "سبب الترتيب بالأرقام",
        "top_advantage": "ميزته"
      }
    ],
    "market_leader": {
      "page": "اسم القائد",
      "why": "شرح تفصيلي بالأرقام لماذا يقود السوق"
    },
    "quick_comparison": [
      {"metric": "Engagement Rate", "values": {"client": "${engRate}%", "comp1": "${comp1Eng}%", "comp2": "${comp2Eng}%", "comp3": "${comp3Eng}%"}},
      {"metric": "Followers",       "values": {"client": "${clientF.toLocaleString()}", "comp1": "${comp1F.toLocaleString()}", "comp2": "${comp2F.toLocaleString()}", "comp3": "${comp3F.toLocaleString()}"}},
      {"metric": "Post Frequency",  "values": {"client": "${clientFreq}", "comp1": "${formData?.comp1?.frequency || 'N/A'}", "comp2": "${formData?.comp2?.frequency || 'N/A'}", "comp3": "${formData?.comp3?.frequency || 'N/A'}"}},
      {"metric": "Content Type",    "values": {"client": "${clientType}", "comp1": "${formData?.comp1?.content_type || 'N/A'}", "comp2": "${formData?.comp2?.content_type || 'N/A'}", "comp3": "${formData?.comp3?.content_type || 'N/A'}"}}
    ],
    "summary_stats": {
      "rank_score": 0,
      "pages_analyzed": 4,
      "avg_score": 0,
      "score_gap": 0
    }
  },
  "audience": {
    "sentiment": {
      "positive": 60,
      "negative": 25,
      "neutral": 15,
      "reasons": ["سبب محدد مستند لعينة التعليقات", "سبب ثانٍ"]
    },
    "purchase_intent": {
      "percentage": 30,
      "examples": ["مثال حقيقي من التعليقات يدل على نية شراء"]
    },
    "persona": {
      "description": "وصف دقيق لشخصية العميل المثالي بناءً على التعليقات والبيانات",
      "age_range": "25-35",
      "interests": ["اهتمام 1", "اهتمام 2"],
      "pain_points": ["مشكلة حقيقية بدليل من البيانات"]
    },
    "negative_to_opportunity": "كيفية تحويل الانتقادات السلبية لفرص نمو مع خطوة عملية"
  },
  "competitive": {
    "swot": [
      {
        "page": "اسم الصفحة",
        "strengths": ["نقطة قوة بالرقم", "نقطة ثانية"],
        "weaknesses": ["نقطة ضعف بالرقم", "نقطة ثانية"],
        "opportunities": ["فرصة نمو حقيقية"],
        "threats": ["تهديد محتمل"]
      },
      {
        "page": "المنافس 1",
        "strengths": ["قوة بالرقم"],
        "weaknesses": ["ضعف بالرقم"],
        "opportunities": ["فرصة"],
        "threats": ["تهديد"]
      },
      {
        "page": "المنافس 2",
        "strengths": ["قوة"],
        "weaknesses": ["ضعف"],
        "opportunities": ["فرصة"],
        "threats": ["تهديد"]
      },
      {
        "page": "المنافس 3",
        "strengths": ["قوة"],
        "weaknesses": ["ضعف"],
        "opportunities": ["فرصة"],
        "threats": ["تهديد"]
      }
    ],
    "content_gaps": ["محتوى يطلبه الجمهور ولا يقدمه أحد — بدليل من التعليقات أو الأرقام"],
    "engagement_comparison": [
      {"page": "${clientUrl}", "rate": "${engRate}%", "rank": 1},
      {"page": "${formData?.comp1?.url || 'comp1'}", "rate": "${comp1Eng}%", "rank": 2},
      {"page": "${formData?.comp2?.url || 'comp2'}", "rate": "${comp2Eng}%", "rank": 3},
      {"page": "${formData?.comp3?.url || 'comp3'}", "rate": "${comp3Eng}%", "rank": 4}
    ],
    "differentiation": [
      {"vs": "${formData?.comp1?.url || 'المنافس 1'}", "strategy": "خطة تميز محددة وقابلة للتنفيذ"},
      {"vs": "${formData?.comp2?.url || 'المنافس 2'}", "strategy": "خطة تميز"},
      {"vs": "${formData?.comp3?.url || 'المنافس 3'}", "strategy": "خطة تميز"}
    ]
  },
  "performance": {
    "data": [
      {"name": "${clientUrl}", "value": 0},
      {"name": "${formData?.comp1?.url || 'comp1'}", "value": 0},
      {"name": "${formData?.comp2?.url || 'comp2'}", "value": 0},
      {"name": "${formData?.comp3?.url || 'comp3'}", "value": 0}
    ],
    "engagement_rates": [
      {"page": "${clientUrl}", "rate": ${parseFloat(engRate)}},
      {"page": "${formData?.comp1?.url || 'comp1'}", "rate": ${parseFloat(comp1Eng)}},
      {"page": "${formData?.comp2?.url || 'comp2'}", "rate": ${parseFloat(comp2Eng)}},
      {"page": "${formData?.comp3?.url || 'comp3'}", "rate": ${parseFloat(comp3Eng)}}
    ],
    "urgent_improvements": [
      {
        "page": "اسم الصفحة",
        "issue": "مشكلة عاجلة بالرقم الفعلي (مثال: معدل تفاعل 0.3% أقل من متوسط السوق 2.1%)",
        "solution": "حل عملي قابل للتنفيذ خلال 7 أيام"
      }
    ],
    "hidden_insights": ["نمط سلوكي غير واضح تم اكتشافه من البيانات مع دليل رقمي"]
  },
  "content": {
    "best_type": {
      "type": "Video/Reels/Images",
      "reason": "لماذا هذا النوع هو الأنجح بناءً على الأرقام"
    },
    "caption_length": {
      "ideal": "قصير/متوسط/طويل",
      "reason": "تأثير طول النص على تفاعل هذا الجمهور تحديداً"
    },
    "hashtags": {
      "needed": true,
      "recommendation": "استراتيجية هاشتاج محددة: X هاشتاج عام + Y هاشتاج متخصص + Z هاشتاج براند"
    },
    "best_time": "الوقت المثالي للنشر بناءً على بيانات التفاعل المقدمة",
    "next_content": "فكرة محتوى إبداعية ومحددة للمنشور القادم مع Hook مقترح"
  },
  "actionable": {
    "do": [
      "افعل 1: محدد وقابل للقياس بالرقم",
      "افعل 2: محدد",
      "افعل 3: محدد"
    ],
    "dont": [
      "تجنب 1: بدليل رقمي",
      "تجنب 2",
      "تجنب 3"
    ],
    "biggest_opportunity": "أكبر فرصة لزيادة المبيعات الآن — محددة وقابلة للتنفيذ فوراً",
    "quick_win": "فوز سريع يمكن تحقيقه في 7 أيام مع خطوات واضحة",
    "best_ad": "أفضل زاوية إعلانية مع نوع الجمهور المستهدف والميزانية المقترحة",
    "plan_30_60_90": {
      "days_30": {
        "goal": "هدف قابل للقياس خلال 30 يوم مبني على الأرقام الحالية — مثال: رفع معدل التفاعل من ${engRate}% إلى X%",
        "tasks": [
          "أسبوع 1: مهمة محددة جداً (مثال: انشر 3 ريلز بين 7-9 مساءً عن مشكلة السعر)",
          "أسبوع 2: مهمة محددة",
          "أسبوع 3: مهمة محددة",
          "أسبوع 4: مهمة محددة + قياس النتائج"
        ],
        "kpi": "مؤشر نجاح محدد بالرقم: مثلاً رفع معدل التفاعل من X% إلى Y% أو زيادة X متابع"
      },
      "days_60": {
        "goal": "هدف الشهر الثاني يبني على نتائج الـ 30 الأولى",
        "tasks": [
          "أسبوع 5: مهمة محددة",
          "أسبوع 6: مهمة محددة",
          "أسبوع 7: مهمة محددة",
          "أسبوع 8: مهمة محددة + مراجعة"
        ],
        "kpi": "مؤشر نجاح الشهر الثاني بالرقم"
      },
      "days_90": {
        "goal": "الهدف النهائي: التفوق على منافس محدد بالاسم والرقم",
        "tasks": [
          "أسبوع 9: مهمة محددة",
          "أسبوع 10: مهمة محددة",
          "أسبوع 11: مهمة محددة",
          "أسبوع 12: تقييم شامل + خطة الـ 90 التالية"
        ],
        "kpi": "مؤشر النجاح النهائي: مثلاً أصبح القائد في السوق بمعدل تفاعل X%"
      }
    },
    "checklist": [
      {"task": "مهمة محددة وقابلة للقياس — High priority", "priority": "High",   "deadline": "خلال 7 أيام",  "done": false},
      {"task": "مهمة ثانية — Medium priority",               "priority": "Medium", "deadline": "خلال 30 يوم", "done": false},
      {"task": "مهمة ثالثة — Low priority",                  "priority": "Low",    "deadline": "خلال 60 يوم", "done": false}
    ]
  },
  "summary": [
    "توصية استراتيجية نهائية 1 بالرقم والسبب",
    "توصية 2"
  ]
}

ملفات إضافية: ${fileContent || 'لا يوجد'}
`;
};

// ─────────────────────────────────────────────────────────────
// Post to Groq
// ─────────────────────────────────────────────────────────────
async function postGroqOnce(prompt: string): Promise<string> {
  const apiKey = (import.meta as any).env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY is missing');

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.15,
      max_tokens: 6000,
      response_format: { type: 'json_object' },
    }),
  });

  const raw = await res.json();
  if (!res.ok) {
    const msg = raw?.error?.message || `Groq error (${res.status})`;
    const err = new Error(msg) as any;
    err.status = res.status;
    throw err;
  }

  const text = extractText(raw);
  if (!text.trim()) throw new Error('Groq returned empty response.');
  return text;
}

// ─────────────────────────────────────────────────────────────
// Public callAI — retries on transient errors
// ─────────────────────────────────────────────────────────────
export async function callAI(formData: unknown, fileContent: string): Promise<string> {
  const apiKey = (import.meta as any).env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY is missing. Check your .env file.');

  const prompt = buildPrompt(formData, fileContent);
  let lastError: any;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await postGroqOnce(prompt);
    } catch (err: any) {
      lastError = err;
      if (!shouldRetry(err.status) || attempt === MAX_ATTEMPTS) break;
      await sleep(400 * attempt * attempt);
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Groq failed after retries.');
}
