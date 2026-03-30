import "https://deno.land/std@0.168.0/dotenv/load.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const buildDemoAnalysis = (clientUrl: string, competitors: string[] = []) => {
  const competitorCount = competitors.filter(Boolean).length;

  return {
    market_score: competitorCount >= 2 ? 74 : 78,
    comparison_table: [
      { metric: "Followers", client: "12.4K", competitor_avg: competitorCount >= 2 ? "18.1K" : "8.2K" },
      { metric: "Engagement Rate", client: "4.2%", competitor_avg: competitorCount >= 2 ? "3.6%" : "2.8%" },
      { metric: "Post Frequency", client: "3/week", competitor_avg: competitorCount >= 2 ? "5/week" : "4/week" },
      { metric: "Response Time", client: "2.1h", competitor_avg: competitorCount >= 2 ? "4.5h" : "3.8h" },
    ],
    swot_analysis: {
      strengths: [
        "Strong visual branding across recent posts",
        "Healthy engagement relative to posting frequency",
        "Clear product positioning and audience fit",
      ],
      weaknesses: [
        "Inconsistent publishing cadence reduces momentum",
        "Some posts lack strong conversion-focused CTAs",
        "Content mix could better balance education and promotion",
      ],
      opportunities: [
        "Increase short-form video and carousel educational content",
        "Partner with adjacent brands or creators for wider reach",
        "Use testimonial-led content to improve trust and conversion",
      ],
      threats: [
        "Competitors may outpace reach with higher posting volume",
        "Platform algorithm changes can reduce organic visibility",
        "Audience fatigue from repetitive promotional messaging",
      ],
    },
    content_plan: [
      { day: "Monday", topic: "Brand authority post", platform: "Facebook", best_time: "10:00 AM", detail: `Share a practical industry insight tailored to audiences similar to ${clientUrl}.` },
      { day: "Tuesday", topic: "Behind-the-scenes reel", platform: "Instagram", best_time: "1:00 PM", detail: "Show process, people, or product creation with a light narrative hook." },
      { day: "Wednesday", topic: "Customer proof", platform: "Facebook", best_time: "12:00 PM", detail: "Turn a customer win or testimonial into a short case-study style post." },
      { day: "Thursday", topic: "Comparison/educational carousel", platform: "Instagram", best_time: "11:00 AM", detail: "Explain how to choose the right solution and subtly position your brand." },
      { day: "Friday", topic: "Offer or CTA post", platform: "Facebook", best_time: "3:00 PM", detail: "Promote a timely offer with one clear CTA and urgency-driven copy." },
      { day: "Saturday", topic: "Community engagement prompt", platform: "Facebook", best_time: "10:00 AM", detail: "Ask a simple opinion question to increase comments and interaction." },
      { day: "Sunday", topic: "UGC or social proof recap", platform: "Instagram", best_time: "4:00 PM", detail: "Reshare community content or summarize the week’s top audience reactions." },
    ],
  };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientUrl, competitors } = await req.json();

    if (!clientUrl) {
      return new Response(JSON.stringify({ error: "clientUrl is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const competitorList = (competitors || []).filter(Boolean).join(", ");
    const prompt = `You are a social media marketing analyst. Analyze the following Facebook page and its competitors.

Facebook Page URL: ${clientUrl}
Competitor URLs: ${competitorList || "None provided"}

Provide a comprehensive market analysis with structured data.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert social media analyst. Always respond by calling the provided function with realistic, data-driven analysis.",
          },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "market_analysis",
              description: "Return a full social media market analysis",
              parameters: {
                type: "object",
                properties: {
                  market_score: {
                    type: "integer",
                    description: "Overall market score from 0-100",
                  },
                  comparison_table: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        metric: { type: "string" },
                        client: { type: "string" },
                        competitor_avg: { type: "string" },
                      },
                      required: ["metric", "client", "competitor_avg"],
                    },
                  },
                  swot_analysis: {
                    type: "object",
                    properties: {
                      strengths: { type: "array", items: { type: "string" } },
                      weaknesses: { type: "array", items: { type: "string" } },
                      opportunities: { type: "array", items: { type: "string" } },
                      threats: { type: "array", items: { type: "string" } },
                    },
                    required: ["strengths", "weaknesses", "opportunities", "threats"],
                  },
                  content_plan: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        day: { type: "string" },
                        topic: { type: "string" },
                        platform: { type: "string" },
                        best_time: { type: "string" },
                        detail: { type: "string" },
                      },
                      required: ["day", "topic", "platform", "best_time", "detail"],
                    },
                  },
                },
                required: ["market_score", "comparison_table", "swot_analysis", "content_plan"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "market_analysis" } },
      }),
    });

    let analysis;
    let isDemo = false;
    let notice: string | null = null;
    let rawResponse: unknown = null;

    if (!aiResponse.ok) {
      const statusCode = aiResponse.status;
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", statusCode, errorText);

      if (statusCode === 402) {
        analysis = buildDemoAnalysis(clientUrl, competitors || []);
        isDemo = true;
        notice = "AI credits are exhausted, so a demo analysis was generated instead.";
        rawResponse = { fallback: "credits_exhausted", status: statusCode, errorText };
      } else {
        if (statusCode === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ error: "AI analysis failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      const aiData = await aiResponse.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];

      if (!toolCall?.function?.arguments) {
        console.error("No tool call in AI response:", JSON.stringify(aiData));
        return new Response(JSON.stringify({ error: "AI returned unexpected format" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      analysis = JSON.parse(toolCall.function.arguments);
      rawResponse = aiData;
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: insertedRow, error: dbError } = await supabase
      .from("analyses")
      .insert({
        facebook_url: clientUrl,
        competitors: competitors || [],
        market_score: analysis.market_score,
        comparison: analysis.comparison_table,
        swot: analysis.swot_analysis,
        content_plan: analysis.content_plan,
        raw_response: rawResponse,
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB insert error:", dbError);
    }

    return new Response(
      JSON.stringify({
        id: insertedRow?.id,
        market_score: analysis.market_score,
        comparison_table: analysis.comparison_table,
        swot_analysis: analysis.swot_analysis,
        content_plan: analysis.content_plan,
        is_demo: isDemo,
        notice,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("analyze-market error:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
