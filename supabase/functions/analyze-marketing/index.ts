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
    const clientF    = parseInt(formData?.client?.followers)   || 0;
    const clientP    = parseInt(formData?.client?.total_posts)  || 0;
    const clientType = formData?.client?.content_type           || 'غير محدد';
    const clientFreq = formData?.client?.frequency              || 'غير محدد';
    const clientUrl  = formData?.client?.url                    || 'غير محدد';

    const comp1F = parseInt(formData?.comp1?.followers)   || 0;
    const comp2F = parseInt(formData?.comp2?.followers)   || 0;
    const comp3F = parseInt(formData?.comp3?.followers)   || 0;
    const comp1P = parseInt(formData?.comp1?.total_posts)  || 0;
    const comp2P = parseInt(formData?.comp2?.total_posts)  || 0;
    const comp3P = parseInt(formData?.comp3?.total_posts)  || 0;

    const compsF = [comp1F, comp2F, comp3F].filter(f => f > 0);
    const avgF   = compsF.length > 0 ? Math.round(compsF.reduce((a, b) => a + b, 0) / compsF.length) : 0;

    const compsP = [comp1P, comp2P, comp3P].filter(p => p > 0);
    const avgP   = compsP.length > 0 ? Math.round(compsP.reduce((a, b) => a + b, 0) / compsP.length) : 0;

    const followerGap = clientF - avgF;
    const postGap     = clientP - avgP;
    const maxF        = Math.max(clientF, comp1F, comp2F, comp3F);
    const strongestComp =
      comp1F === maxF ? (formData?.comp1?.url || 'المنافس 1') :
      comp2F === maxF ? (formData?.comp2?.url || 'المنافس 2') :
                        (formData?.comp3?.url || 'المنافس 3');

    // ✅ v1beta endpoint + gemini-2.0-flash (stable & free)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
أنت خبير تسويق رقمي متخصص في تحليل صفحات السوشيال ميديا. قدم تحليلاً حقيقياً ومخصصاً بناءً على الأرقام فقط.

=== البيانات ===

صفحتي:
- الرابط: ${clientUrl}
- المتابعون: ${clientF.toLocaleString()}
- إجمالي المنشورات: ${clientP}
- نوع المحتوى: ${clientType}
- تكرار النشر: ${clientFreq}

المنافس 1:
- الرابط: ${formData?.comp1?.url || 'غير محدد'}
- المتابعون: ${comp1F.toLocaleString()}
- المنشورات: ${comp1P}
- نوع المحتوى: ${formData?.comp1?.content_type || 'غير محدد'}
- تكرار النشر: ${formData?.comp1?.frequency || 'غير محدد'}

المنافس 2:
- الرابط: ${formData?.comp2?.url || 'غير محدد'}
- المتابعون: ${comp2F.toLocaleString()}
- المنشورات: ${comp2P}
- نوع المحتوى: ${formData?.comp2?.content_type || 'غير محدد'}
- تكرار النشر: ${formData?.comp2?.frequency || 'غير محدد'}

المنافس 3:
- الرابط: ${formData?.comp3?.url || 'غير محدد'}
- المتابعون: ${comp3F.toLocaleString()}
- المنشورات: ${comp3P}
- نوع المحتوى: ${formData?.comp3?.content_type || 'غير محدد'}
- تكرار النشر: ${formData?.comp3?.frequency || 'غير محدد'}

=== الحسابات ===
- متوسط متابعي المنافسين: ${avgF.toLocaleString()}
- فجوة المتابعين: ${followerGap >= 0 ? '+' : ''}${followerGap.toLocaleString()}
- متوسط منشورات المنافسين: ${avgP}
- فجوة المنشورات: ${postGap >= 0 ? '+' : ''}${postGap}
- أقوى منافس: ${strongestComp} بـ ${maxF.toLocaleString()} متابع

=== مطلوب ===
- كل نقطة لازم تستند لرقم حقيقي من البيانات
- لا كلام عام مثل "حسن المحتوى" بدون تفاصيل

أرجع JSON فقط بهذا الشكل بدون أي نص إضافي:

{
  "market_score": رقم من 0 إلى 100,
  "ranking": {
    "position": "رقم من 1 إلى 4 (1 الأقوى)",
    "strongest_competitor": "${strongestComp}",
    "gap_to_leader": "الفجوة بالأرقام"
  },
  "swot_analysis": {
    "strengths": ["نقطة بالرقم", "نقطة بالرقم", "نقطة بالرقم"],
    "weaknesses": ["نقطة بالرقم", "نقطة بالرقم", "نقطة بالرقم"],
    "opportunities": ["فرصة حقيقية", "فرصة ثانية", "فرصة ثالثة"],
    "threats": ["تهديد حقيقي", "تهديد ثانٍ", "تهديد ثالث"]
  },
  "action_plan": [
    {
      "priority": "1",
      "action": "خطوة محددة جداً",
      "reason": "لأن الفجوة في X تساوي Y بالأرقام",
      "expected_result": "النتيجة خلال كم أسبوع"
    },
    {
      "priority": "2",
      "action": "خطوة محددة",
      "reason": "السبب بالرقم",
      "expected_result": "النتيجة المتوقعة"
    },
    {
      "priority": "3",
      "action": "خطوة محددة",
      "reason": "السبب بالرقم",
      "expected_result": "النتيجة المتوقعة"
    }
  ],
  "analysis_summary": "فقرة 3-4 جمل بالعربي: أنت في المرتبة X من 4، الفجوة الأكبر Y متابع، أهم خطوتين هما...",
  "comparison": [
    { "metric": "Followers", "client": ${clientF}, "competitor_avg": ${avgF} },
    { "metric": "Total Posts", "client": ${clientP}, "competitor_avg": ${avgP} },
    { "metric": "Content Score", "client": 0, "competitor_avg": 0 },
    { "metric": "Consistency", "client": 0, "competitor_avg": 0 }
  ]
}
`;

// ==========================================
    // 🛑 وضع الديمو (DEMO MODE) - إرجاع بيانات افتراضية
    // ==========================================
    const demoData = {
      market_score: 50,
      ranking: {
        position: "2",
        strongest_competitor: strongestComp,
        gap_to_leader: Math.abs(followerGap).toString()
      },
      swot_analysis: {
        strengths: ["بيانات تجريبية (Demo)", "معدل نشر مستقر نسبياً"],
        weaknesses: ["بيانات تجريبية (Demo)", "تأخر في أرقام المتابعين مقارنة بالمتوسط"],
        opportunities: ["استغلال نوع المحتوى الحالي لزيادة التفاعل"],
        threats: ["نشاط المنافسين العالي"]
      },
      action_plan: [
        {
          priority: "1",
          action: "تجربة النظام (Demo)",
          reason: "للتأكد من عمل الواجهة بشكل سليم",
          expected_result: "نجاح اختبار الموقع 100%"
        }
      ],
      analysis_summary: "💡 وضع التجربة (Demo Mode): يتم عرض بيانات تقديرية من داخل السيرفر بدون استهلاك رصيد الذكاء الاصطناعي.",
      comparison: [
        { metric: "Followers", client: clientF, competitor_avg: avgF },
        { metric: "Total Posts", client: clientP, competitor_avg: avgP },
        { metric: "Content Score", client: 6, competitor_avg: 7 },
        { metric: "Consistency", client: 5, competitor_avg: 6 }
      ]
    };

    return new Response(JSON.stringify(demoData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    // ==========================================

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1500,
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

    // ✅ Clean and parse JSON
    let cleaned = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }
    const parsed = JSON.parse(jsonMatch[0]);

    // ✅ Fix Content Score and Consistency with real calculated values
    const freqScore = (freq) => {
      if (freq === 'High')   return 9;
      if (freq === 'Medium') return 6;
      if (freq === 'Low')    return 3;
      return 5;
    };
    const contentScore = (type) => {
      if (type === 'Video')    return 9;
      if (type === 'Carousel') return 8;
      if (type === 'Mixed')    return 7;
      if (type === 'Image')    return 6;
      return 5;
    };

    const myContentScore  = contentScore(clientType);
    const myFreqScore     = freqScore(clientFreq);
    const avgContentScore = Math.round(
      (contentScore(formData?.comp1?.content_type) +
       contentScore(formData?.comp2?.content_type) +
       contentScore(formData?.comp3?.content_type)) / 3
    );
    const avgFreqScore = Math.round(
      (freqScore(formData?.comp1?.frequency) +
       freqScore(formData?.comp2?.frequency) +
       freqScore(formData?.comp3?.frequency)) / 3
    );

    const finalComparison = Array.isArray(parsed.comparison) ? parsed.comparison.map((row) => {
      if (row.metric === 'Content Score') return { ...row, client: myContentScore,  competitor_avg: avgContentScore };
      if (row.metric === 'Consistency')   return { ...row, client: myFreqScore,     competitor_avg: avgFreqScore };
      return row;
    }) : [
      { metric: 'Followers',      client: clientF,        competitor_avg: avgF           },
      { metric: 'Total Posts',    client: clientP,        competitor_avg: avgP           },
      { metric: 'Content Score',  client: myContentScore, competitor_avg: avgContentScore },
      { metric: 'Consistency',    client: myFreqScore,    competitor_avg: avgFreqScore   },
    ];

    const finalData = {
      market_score:     Number(parsed.market_score) || 0,
      ranking:          parsed.ranking || null,
      swot_analysis: {
        strengths:     Array.isArray(parsed.swot_analysis?.strengths)     ? parsed.swot_analysis.strengths     : [],
        weaknesses:    Array.isArray(parsed.swot_analysis?.weaknesses)    ? parsed.swot_analysis.weaknesses    : [],
        opportunities: Array.isArray(parsed.swot_analysis?.opportunities) ? parsed.swot_analysis.opportunities : [],
        threats:       Array.isArray(parsed.swot_analysis?.threats)       ? parsed.swot_analysis.threats       : [],
      },
      action_plan:      Array.isArray(parsed.action_plan) ? parsed.action_plan : [],
      analysis_summary: String(parsed.analysis_summary || ''),
      comparison:       finalComparison,
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