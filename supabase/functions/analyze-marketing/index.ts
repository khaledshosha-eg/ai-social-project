import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY in Supabase Secrets");
    }

    const formData = await req.json();

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
You are a social media marketing expert. Analyze the following social media page data and compare the "Primary Page" with its "Competitors".
Return the analysis strictly in JSON format with the following structure:

{
  "market_score": number (0-100),
  "swot_analysis": {
    "strengths": ["string in Arabic", "string in Arabic"],
    "weaknesses": ["string in Arabic", "string in Arabic"]
  },
  "analysis_summary": "detailed strategic analysis in Arabic",
  "comparison": [
    { "metric": "Followers", "client": "value", "competitor_avg": "value" },
    { "metric": "Content Quality", "client": "value", "competitor_avg": "value" },
    { "metric": "Engagement", "client": "value", "competitor_avg": "value" }
  ]
}

Input Data:
${JSON.stringify(formData, null, 2)}

Important:
1. All descriptions, strengths, and weaknesses must be in Arabic.
2. Ensure the "comparison" metrics reflect the input data accurately.
3. Return ONLY the JSON object, no markdown blocks or extra text.
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error(errorData.error?.message || "Failed to call Gemini API");
    }

    const result = await response.json();
    const aiText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      throw new Error("Empty response from AI");
    }

    let parsed;
    try {
      // Robust JSON cleaning
      const cleaned = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("JSON Parsing Error. Raw AI Text:", aiText);
      throw new Error("AI returned invalid JSON format");
    }

    // Standardize the response structure
    const finalData = {
      market_score: Number(parsed.market_score) || 0,
      swot_analysis: {
        strengths: Array.isArray(parsed.swot_analysis?.strengths) ? parsed.swot_analysis.strengths : [],
        weaknesses: Array.isArray(parsed.swot_analysis?.weaknesses) ? parsed.swot_analysis.weaknesses : []
      },
      analysis_summary: String(parsed.analysis_summary || "تحليل غير متوفر حالياً"),
      comparison: Array.isArray(parsed.comparison) ? parsed.comparison : []
    };

    return new Response(JSON.stringify(finalData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Edge Function Error:", err.message);

    return new Response(JSON.stringify({
      error: err.message || "An unexpected error occurred"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
