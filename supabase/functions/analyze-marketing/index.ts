import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const formData = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY in Supabase Secrets");
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
ارجع JSON فقط بدون أي نص إضافي بالشكل التالي:

{
  "market_score": رقم من 0 إلى 100 يعبر عن مدى نجاح الصفحة الأساسية مقارنة بالمنافسين,
  "swot_analysis": {
    "strengths": ["نقطة قوة بالعربي", "نقطة قوة بالعربي"],
    "weaknesses": ["نقطة ضعف بالعربي", "نقطة ضعف بالعربي"]
  },
  "analysis_summary": "تحليل استراتيجي كامل ومفصل بالعربي للنقاط الرئيسية وكيفية التحسين",
  "comparison": [
    { "metric": "Followers", "client": "عدد المتابعين للصفحة الأساسية", "competitor_avg": "متوسط عدد المتابعين للمنافسين" },
    { "metric": "Content Quality", "client": "تقييم من 10", "competitor_avg": "تقييم من 10 للمنافسين" },
    { "metric": "Engagement", "client": "تقييم من 10", "competitor_avg": "تقييم من 10 للمنافسين" }
  ]
}

حلل البيانات دي وقارن بين الصفحة الأساسية (Primary Page) والمنافسين (Competitors):
${JSON.stringify(formData)}
`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Gemini Error:", result);
      throw new Error(result.error?.message || "Gemini API error");
    }

    const aiText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    let parsed;
    try {
      const cleaned = aiText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("Parsing error:", aiText);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Ensure all expected fields are present
    const finalData = {
      market_score: parsed.market_score || 0,
      swot_analysis: {
        strengths: parsed.swot_analysis?.strengths || [],
        weaknesses: parsed.swot_analysis?.weaknesses || []
      },
      analysis_summary: parsed.analysis_summary || "لم يتم توليد تحليل متاح",
      comparison: parsed.comparison || []
    };

    return new Response(JSON.stringify(finalData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Function error:", err);

    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
