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

    const conceptList = concepts.join(', ');

    const prompt = language === 'hebrew'
      ? `צור טבלת סיכום בנושא "${topic}" עבור המושגים הבאים: ${conceptList}.
עבור כל מושג, ספק סיכום קצר וברור וגם דוגמה קצרה (משפט אחד) הממחישה את המושג.

החזר את התשובה בפורמט JSON הבא:
{
  "title": "סיכום בנושא: ${topic}",
  "items": [
    {
      "concept": "שם המושג",
      "summary": "סיכום קצר של המושג",
      "example": "דוגמה קצרה הממחישה את המושג"
    }
  ]
}`
      : `Create a summary table on the topic "${topic}" for the following concepts: ${conceptList}.
For each concept, provide a clear, concise summary and a short example (one sentence) that illustrates the concept.

Return the response in the following JSON format:
{
  "title": "Summary on: ${topic}",
  "items": [
    {
      "concept": "Concept Name",
      "summary": "A brief summary of the concept",
      "example": "A short example illustrating the concept"
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
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: language === 'hebrew'
              ? "אתה מומחה ביצירת טבלאות סיכום חינוכיות. תמיד החזר תשובה בעברית בפורמט JSON תקין."
              : "You are an expert at creating educational summary tables. Always return a valid JSON response."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(content), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating summary table:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to generate summary table",
      details: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});