import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. Parse Request Body
    const requestData = await req.json().catch((e) => {
      throw new Error(`Failed to parse request body: ${e.message}`);
    });
    
    const { prompt } = requestData;
    if (!prompt) {
      throw new Error("No prompt provided in request body.");
    }

    // 2. Validate API Key
    const apiKey = Deno.env.get("GROQ_API_KEY");
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured in Supabase environment variables.");
    }

    // 3. Call External AI Service (Groq)
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 2500,
          temperature: 0.7,
        }),
      }
    );

    // 4. Handle HTTP Errors from External Service
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = errorText;
      }
      throw new Error(`AI Service (Groq) returned error ${response.status}: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    // 5. Validate Response Structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error(`Invalid response structure from AI Service: ${JSON.stringify(data)}`);
    }

    const text = data.choices[0].message.content;

    // 6. Return Success
    return new Response(JSON.stringify({ content: [{ text }] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Edge Function Error:", err.message);
    
    // Return the exact error message to the frontend for debugging
    return new Response(
      JSON.stringify({ 
        error: "Edge Function Error", 
        message: err.message,
        timestamp: new Date().toISOString()
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
