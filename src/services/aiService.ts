/**
 * AI Service for interacting with Supabase Edge Functions proxy.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Builds the full analytical prompt for the AI.
 */
export const buildPrompt = (formData: any, fileContent: string): string => { 
  return ` 
أنت خبير استراتيجي في التسويق الرقمي (Senior Digital Marketing Strategist). مهمتك هي تحليل البيانات المقدمة وتحويلها إلى تقرير ذكاء تسويقي (Marketing Intelligence Report) احترافي وشامل لمشروع "The Terminator AI".

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

/**
 * Calls the AI proxy edge function with the provided prompt.
 * @param formData The form data containing client and competitor info
 * @param fileContent Additional file content if any
 * @returns The AI generated content as a raw string
 */
export async function callAI(formData: any, fileContent: string): Promise<string> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.');
  }

  const prompt = buildPrompt(formData, fileContent);

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `AI Request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Ensure we have a string to work with
    let text = "";
    if (data && data.content && Array.isArray(data.content) && data.content[0] && typeof data.content[0].text === 'string') {
      text = data.content[0].text;
    } else if (typeof data.text === 'string') {
      text = data.text;
    } else if (typeof data.content === 'string') {
      text = data.content;
    } else {
      text = JSON.stringify(data);
    }

    return text;
  } catch (error) {
    console.error('Error in aiService:', error);
    throw error;
  }
}
