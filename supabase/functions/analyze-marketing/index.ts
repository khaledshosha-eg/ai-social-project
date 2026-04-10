// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY in Supabase Secrets");
    }

    const formData = await req.json();

    // ✅ Extract real numbers
    const clientF    = parseInt(formData?.client?.followers)    || 0;
    const clientP    = parseInt(formData?.client?.total_posts)  || 0;
    const clientLikes    = parseInt(formData?.client?.avg_likes)    || 0;
    const clientComments = parseInt(formData?.client?.avg_comments) || 0;
    const clientShares   = parseInt(formData?.client?.avg_shares)   || 0;
    const clientType = formData?.client?.content_type  || 'غير محدد';
    const clientFreq = formData?.client?.frequency     || 'غير محدد';
    const clientUrl  = formData?.client?.url           || 'غير محدد';
    const clientAds  = formData?.client?.ads           || 'لا';
    const clientTime = formData?.client?.posting_time  || 'غير محدد';
    const clientCommentsSample = formData?.client?.sample_comments || '';

    const comp1F = parseInt(formData?.comp1?.followers)   || 0;
    const comp2F = parseInt(formData?.comp2?.followers)   || 0;
    const comp3F = parseInt(formData?.comp3?.followers)   || 0;
    const comp1P = parseInt(formData?.comp1?.total_posts) || 0;
    const comp2P = parseInt(formData?.comp2?.total_posts) || 0;
    const comp3P = parseInt(formData?.comp3?.total_posts) || 0;
    const comp1Likes = parseInt(formData?.comp1?.avg_likes) || 0;
    const comp2Likes = parseInt(formData?.comp2?.avg_likes) || 0;
    const comp3Likes = parseInt(formData?.comp3?.avg_likes) || 0;

    const compsF = [comp1F, comp2F, comp3F].filter(f => f > 0);
    const avgF   = compsF.length > 0 ? Math.round(compsF.reduce((a, b) => a + b, 0) / compsF.length) : 0;
    const compsP = [comp1P, comp2P, comp3P].filter(p => p > 0);
    const avgP   = compsP.length > 0 ? Math.round(compsP.reduce((a, b) => a + b, 0) / compsP.length) : 0;

    // Engagement Rate
    const clientEngRate = clientF > 0 ? (((clientLikes + clientComments + clientShares) / clientF) * 100).toFixed(2) : '0';
    const comp1EngRate  = comp1F  > 0 ? ((comp1Likes / comp1F) * 100).toFixed(2) : '0';
    const comp2EngRate  = comp2F  > 0 ? ((comp2Likes / comp2F) * 100).toFixed(2) : '0';
    const comp3EngRate  = comp3F  > 0 ? ((comp3Likes / comp3F) * 100).toFixed(2) : '0';

    const followerGap = clientF - avgF;

    const allPages = [
      { url: clientUrl, followers: clientF },
      { url: formData?.comp1?.url || 'المنافس1', followers: comp1F },
      { url: formData?.comp2?.url || 'المنافس2', followers: comp2F },
      { url: formData?.comp3?.url || 'المنافس3', followers: comp3F },
    ];
    const maxF = Math.max(...allPages.map(p => p.followers));
    const strongestComp = allPages.find(p => p.followers === maxF && p.url !== clientUrl)?.url || allPages[1].url;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
أنت خبير استراتيجي عالمي في التسويق الرقمي + محلل بيانات + خبير سلوك مستهلك (Elite Marketing Intelligence AI).

مهمتك: تحويل البيانات الخام إلى تقرير Marketing Intelligence احترافي، دقيق، وقابل لاتخاذ قرارات فورية.

━━━━━━━━━━━━━━━━━━━━━━━
📥 بيانات العميل (صفحتي):
━━━━━━━━━━━━━━━━━━━━━━━
- الرابط: ${clientUrl}
- المتابعون: ${clientF.toLocaleString()}
- إجمالي المنشورات: ${clientP}
- متوسط اللايكات: ${clientLikes}
- متوسط التعليقات: ${clientComments}
- متوسط المشاركات: ${clientShares}
- معدل التفاعل المحسوب: ${clientEngRate}%
- نوع المحتوى: ${clientType}
- تكرار النشر: ${clientFreq}
- وقت النشر: ${clientTime}
- إعلانات ممولة: ${clientAds}
- عينة تعليقات: ${clientCommentsSample || 'لا يوجد'}

━━━━━━━━━━━━━━━━━━━━━━━
📥 بيانات المنافسين:
━━━━━━━━━━━━━━━━━━━━━━━
المنافس 1: ${formData?.comp1?.url || 'غير محدد'}
- المتابعون: ${comp1F.toLocaleString()} | المنشورات: ${comp1P} | Avg Likes: ${comp1Likes} | معدل التفاعل: ${comp1EngRate}%
- المحتوى: ${formData?.comp1?.content_type || 'غير محدد'} | التكرار: ${formData?.comp1?.frequency || 'غير محدد'}
- تعليقات: ${formData?.comp1?.sample_comments || 'لا يوجد'}

المنافس 2: ${formData?.comp2?.url || 'غير محدد'}
- المتابعون: ${comp2F.toLocaleString()} | المنشورات: ${comp2P} | Avg Likes: ${comp2Likes} | معدل التفاعل: ${comp2EngRate}%
- المحتوى: ${formData?.comp2?.content_type || 'غير محدد'} | التكرار: ${formData?.comp2?.frequency || 'غير محدد'}
- تعليقات: ${formData?.comp2?.sample_comments || 'لا يوجد'}

المنافس 3: ${formData?.comp3?.url || 'غير محدد'}
- المتابعون: ${comp3F.toLocaleString()} | المنشورات: ${comp3P} | Avg Likes: ${comp3Likes} | معدل التفاعل: ${comp3EngRate}%
- المحتوى: ${formData?.comp3?.content_type || 'غير محدد'} | التكرار: ${formData?.comp3?.frequency || 'غير محدد'}
- تعليقات: ${formData?.comp3?.sample_comments || 'لا يوجد'}

━━━━━━━━━━━━━━━━━━━━━━━
📊 الحسابات الجاهزة:
━━━━━━━━━━━━━━━━━━━━━━━
- متوسط متابعي المنافسين: ${avgF.toLocaleString()}
- فجوة المتابعين: ${followerGap >= 0 ? '+' : ''}${followerGap.toLocaleString()}
- متوسط منشورات المنافسين: ${avgP}
- أقوى منافس: ${strongestComp} بـ ${maxF.toLocaleString()} متابع

━━━━━━━━━━━━━━━━━━━━━━━
⚠️ قواعد صارمة:
━━━━━━━━━━━━━━━━━━━━━━━
1. كل نقطة تحليل يجب أن تستند لرقم من البيانات المقدمة
2. ممنوع تماماً كتابة نصائح عامة مثل "حسّن المحتوى"
3. بدلاً من ذلك: "انشر 3 ريلز أسبوعياً بين 7-9 مساءً لأن معدل تفاعلك الحالي ${clientEngRate}% ويمكن رفعه"
4. الخطط 30/60/90 يوم يجب أن تكون واقعية ومبنية على الأرقام الفعلية
5. حساب السكور = 40% Engagement + 20% Content + 20% Purchase Intent + 10% Followers + 10% Frequency

أرجع JSON فقط بهذا الشكل بدون أي نص إضافي أو markdown:

{
  "market_overview": {
    "ranking": [
      {
        "page": "اسم_الصفحة أو URL مختصر",
        "score": 85,
        "rank": 1,
        "reason": "تحليل رقمي دقيق: معدل تفاعله X% مقارنة بمتوسط السوق Y%",
        "top_advantage": "الميزة التنافسية الأقوى بالرقم"
      }
    ],
    "market_leader": {
      "page": "اسم القائد",
      "why": "شرح تفصيلي بالأرقام لماذا يقود السوق"
    },
    "quick_comparison": [
      {"metric": "Engagement Rate", "values": {"client": "${clientEngRate}%", "comp1": "${comp1EngRate}%", "comp2": "${comp2EngRate}%", "comp3": "${comp3EngRate}%"}},
      {"metric": "Post Frequency", "values": {"client": "${clientFreq}", "comp1": "${formData?.comp1?.frequency || 'N/A'}", "comp2": "${formData?.comp2?.frequency || 'N/A'}", "comp3": "${formData?.comp3?.frequency || 'N/A'}"}},
      {"metric": "Followers", "values": {"client": "${clientF.toLocaleString()}", "comp1": "${comp1F.toLocaleString()}", "comp2": "${comp2F.toLocaleString()}", "comp3": "${comp3F.toLocaleString()}"}},
      {"metric": "Content Type", "values": {"client": "${clientType}", "comp1": "${formData?.comp1?.content_type || 'N/A'}", "comp2": "${formData?.comp2?.content_type || 'N/A'}", "comp3": "${formData?.comp3?.content_type || 'N/A'}"}}
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
      "reasons": ["سبب محدد بدليل من التعليقات", "سبب ثانٍ"]
    },
    "purchase_intent": {
      "percentage": 30,
      "examples": ["مثال حقيقي من التعليقات يدل على نية شراء"]
    },
    "persona": {
      "description": "وصف دقيق لشخصية العميل المثالي",
      "age_range": "25-35",
      "interests": ["اهتمام1", "اهتمام2"],
      "pain_points": ["مشكلة حقيقية يعاني منها الجمهور بدليل"]
    },
    "negative_to_opportunity": "كيفية تحويل الانتقادات السلبية لفرص نمو مع خطوة عملية"
  },
  "competitive": {
    "swot": [
      {
        "page": "اسم_الصفحة",
        "strengths": ["نقطة قوة بالرقم", "نقطة قوة ثانية"],
        "weaknesses": ["نقطة ضعف بالرقم", "نقطة ضعف ثانية"],
        "opportunities": ["فرصة نمو حقيقية"],
        "threats": ["تهديد محتمل حقيقي"]
      }
    ],
    "content_gaps": ["محتوى يطلبه الجمهور ولا يقدمه أي منافس - بدليل من التعليقات أو الأرقام"],
    "engagement_comparison": [
      {"page": "اسم", "rate": "5.2%", "rank": 1}
    ],
    "differentiation": [
      {"vs": "اسم_المنافس", "strategy": "خطة تميز محددة وقابلة للتنفيذ"}
    ]
  },
  "performance": {
    "data": [{"name": "اسم", "value": 85}],
    "engagement_rates": [{"page": "اسم", "rate": 5.2}],
    "urgent_improvements": [
      {
        "page": "اسم_الصفحة",
        "issue": "مشكلة عاجلة بالرقم (مثال: معدل التفاعل 0.5% أقل من متوسط السوق 2.3%)",
        "solution": "حل عملي فوري خلال 7 أيام"
      }
    ],
    "hidden_insights": ["نمط سلوكي غير واضح تم اكتشافه من البيانات مع دليل رقمي"]
  },
  "content": {
    "best_type": {
      "type": "Video/Reels/Images",
      "reason": "لماذا هذا النوع هو الأنجح بالأرقام"
    },
    "caption_length": {
      "ideal": "قصير/متوسط/طويل",
      "reason": "تأثير طول النص على تفاعل الجمهور"
    },
    "hashtags": {
      "needed": true,
      "recommendation": "استراتيجية هاشتاج محددة: X هاشتاج عام + Y هاشتاج متخصص"
    },
    "best_time": "الوقت المثالي للنشر بناءً على بيانات التفاعل المقدمة",
    "next_content": "فكرة محتوى إبداعية ومحددة للمنشور القادم مع Hook مقترح"
  },
  "actionable": {
    "do": [
      "افعل محدد وقابل للقياس بالرقم",
      "افعل ثانٍ محدد"
    ],
    "dont": [
      "تجنب محدد بدليل رقمي",
      "تجنب ثانٍ"
    ],
    "biggest_opportunity": "أكبر فرصة لزيادة المبيعات الآن - محددة وقابلة للتنفيذ",
    "quick_win": "فوز سريع يمكن تحقيقه في 7 أيام مع خطوات واضحة",
    "best_ad": "أفضل زاوية إعلانية مع نوع الجمهور المستهدف والميزانية المقترحة",
    "plan_30_60_90": {
      "days_30": {
        "goal": "هدف قابل للقياس خلال 30 يوم بناءً على الأرقام الحالية",
        "tasks": [
          "مهمة أسبوع 1: محددة جداً مع الرقم المستهدف",
          "مهمة أسبوع 2: محددة جداً",
          "مهمة أسبوع 3: محددة جداً",
          "مهمة أسبوع 4: محددة جداً"
        ],
        "kpi": "مؤشر قياس النجاح: مثلاً رفع معدل التفاعل من X% إلى Y%"
      },
      "days_60": {
        "goal": "هدف 60 يوم يبني على نتائج الـ 30 الأولى",
        "tasks": [
          "مهمة شهر 2 - أسبوع 1",
          "مهمة شهر 2 - أسبوع 2",
          "مهمة شهر 2 - أسبوع 3",
          "مهمة شهر 2 - أسبوع 4"
        ],
        "kpi": "مؤشر قياس النجاح للـ 60 يوم"
      },
      "days_90": {
        "goal": "الهدف النهائي 90 يوم: التفوق على منافس محدد بالرقم",
        "tasks": [
          "مهمة شهر 3 - أسبوع 1",
          "مهمة شهر 3 - أسبوع 2",
          "مهمة شهر 3 - أسبوع 3",
          "مهمة شهر 3 - أسبوع 4"
        ],
        "kpi": "مؤشر قياس النجاح النهائي"
      }
    },
    "checklist": [
      {
        "task": "مهمة محددة وقابلة للقياس",
        "priority": "High",
        "deadline": "خلال 7 أيام",
        "done": false
      },
      {
        "task": "مهمة ثانية",
        "priority": "Medium",
        "deadline": "خلال 30 يوم",
        "done": false
      },
      {
        "task": "مهمة ثالثة",
        "priority": "Low",
        "deadline": "خلال 60 يوم",
        "done": false
      }
    ]
  },
  "summary": [
    "توصية استراتيجية نهائية 1 بالرقم",
    "توصية استراتيجية نهائية 2"
  ]
}
`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4000,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", JSON.stringify(errorData));
      throw new Error(errorData.error?.message || "Gemini API failed");
    }

    const result = await response.json();
    const aiText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) throw new Error("Empty response from Gemini");

    // Clean and parse JSON
    let cleaned = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in AI response");

    const parsed = JSON.parse(jsonMatch[0]);

    // ✅ Fix Content Score and Consistency with real calculated values
    const freqScore  = (freq)  => freq === 'High' ? 9 : freq === 'Medium' ? 6 : freq === 'Low' ? 3 : 5;
    const contentScoreFn = (type) => type === 'Video' ? 9 : type === 'Carousel' ? 8 : type === 'Mixed' ? 7 : type === 'Image' ? 6 : 5;

    const myContentScore  = contentScoreFn(clientType);
    const myFreqScore     = freqScore(clientFreq);
    const avgContentScore = Math.round(
      (contentScoreFn(formData?.comp1?.content_type) +
       contentScoreFn(formData?.comp2?.content_type) +
       contentScoreFn(formData?.comp3?.content_type)) / 3
    );
    const avgFreqScore = Math.round(
      (freqScore(formData?.comp1?.frequency) +
       freqScore(formData?.comp2?.frequency) +
       freqScore(formData?.comp3?.frequency)) / 3
    );

    // Fix summary_stats in market_overview
    if (parsed.market_overview?.ranking?.length) {
      const clientRankItem = parsed.market_overview.ranking[0];
      const allScores = parsed.market_overview.ranking.map(r => r.score || 0);
      const avgScore  = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
      const maxScore  = Math.max(...allScores);

      parsed.market_overview.summary_stats = {
        rank_score:     clientRankItem?.score || 0,
        pages_analyzed: parsed.market_overview.ranking.length,
        avg_score:      avgScore,
        score_gap:      maxScore - (clientRankItem?.score || 0),
      };
    }

    const finalData = {
      market_overview: parsed.market_overview || {},
      audience:        parsed.audience        || {},
      competitive:     parsed.competitive     || {},
      performance:     parsed.performance     || {},
      content:         parsed.content         || {},
      actionable:      parsed.actionable      || {},
      summary:         parsed.summary         || [],
      // Legacy fields for ResultsPage compatibility
      market_score:    parsed.market_overview?.ranking?.[0]?.score || 0,
      ranking: {
        position:             String(parsed.market_overview?.ranking?.[0]?.rank || 1),
        strongest_competitor: strongestComp,
        gap_to_leader:        String(Math.abs(followerGap)),
      },
      swot_analysis: {
        strengths:     parsed.competitive?.swot?.[0]?.strengths     || [],
        weaknesses:    parsed.competitive?.swot?.[0]?.weaknesses    || [],
        opportunities: parsed.competitive?.swot?.[0]?.opportunities || [],
        threats:       parsed.competitive?.swot?.[0]?.threats       || [],
      },
      action_plan: (parsed.actionable?.checklist || []).map((c, i) => ({
        priority:        String(i + 1),
        action:          c.task,
        reason:          c.priority,
        expected_result: c.deadline,
      })),
      analysis_summary: (parsed.summary || []).join(' — '),
      comparison: [
        { metric: 'Followers',     client: clientF,        competitor_avg: avgF           },
        { metric: 'Total Posts',   client: clientP,        competitor_avg: avgP           },
        { metric: 'Content Score', client: myContentScore, competitor_avg: avgContentScore },
        { metric: 'Consistency',   client: myFreqScore,    competitor_avg: avgFreqScore   },
        { metric: 'Engagement',    client: parseFloat(clientEngRate), competitor_avg: parseFloat(((parseFloat(comp1EngRate) + parseFloat(comp2EngRate) + parseFloat(comp3EngRate)) / 3).toFixed(2)) },
      ],
    };

    return new Response(JSON.stringify(finalData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const err = error;
    console.error("Edge Function Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
