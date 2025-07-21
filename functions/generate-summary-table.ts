Deno.serve(async (req) => {
  try {
    const { topic, concepts, language } = await req.json();
    
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = language === "hebrew" 
      ? `צור טבלת סיכום מסודרת לנושא "${topic}" עם המושגים הבאים: ${concepts.join(', ')}.
         עבור כל מושג, כלול הסבר פשוט וברור.
         החזר את התוצאה בפורמט JSON עם המבנה הבא:
         {
           "title": "כותרת הטבלה",
           "summary": [
             {
               "concept": "המושג",
               "definition": "הגדרה פשוטה",
               "explanation": "הסבר מפורט",
               "example": "דוגמה (אופציונלי)"
             }
           ]
         }`
      : `Create an organized summary table for the topic "${topic}" with the following concepts: ${concepts.join(', ')}.
         For each concept, include a simple and clear explanation.
         Return the result in JSON format with this structure:
         {
           "title": "Table title",
           "summary": [
             {
               "concept": "The concept",
               "definition": "Simple definition",
               "explanation": "Detailed explanation",
               "example": "Example (optional)"
             }
           ]
         }`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: language === "hebrew" 
              ? "אתה מורה מומחה שיוצר טבלאות סיכום ברורות ומסודרות בעברית. השתמש בעברית תקנית."
              : "You are an expert teacher creating clear and organized summary tables. Use proper English."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const parsedContent = JSON.parse(content);
      return new Response(JSON.stringify(parsedContent), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (parseError) {
      return new Response(JSON.stringify({ 
        error: "Failed to parse OpenAI response",
        rawContent: content 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});