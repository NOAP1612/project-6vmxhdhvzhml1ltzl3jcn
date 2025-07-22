Deno.serve(async (req) => {
  try {
    const { text, topic, language } = await req.json();
    
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = language === 'hebrew' 
      ? `נתון הטקסט הבא על הנושא "${topic}":

${text}

אנא חלץ את המושגים/קריטריונים החשובים ביותר מהטקסט הזה. החזר רשימה של 5-8 מושגים מרכזיים שמתאימים ליצירת טבלת סיכום.

החזר את התשובה בפורמט JSON הבא:
{
  "concepts": ["מושג 1", "מושג 2", "מושג 3", ...]
}`
      : `Given the following text about "${topic}":

${text}

Please extract the most important concepts/criteria from this text. Return a list of 5-8 key concepts that would be suitable for creating a summary table.

Return the response in the following JSON format:
{
  "concepts": ["concept 1", "concept 2", "concept 3", ...]
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
              ? "אתה מומחה בחילוץ מושגים מרכזיים מטקסטים אקדמיים. תמיד החזר תשובה בעברית בפורמט JSON תקין."
              : "You are an expert at extracting key concepts from academic texts. Always return a valid JSON response."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const parsedContent = JSON.parse(content);
      return new Response(JSON.stringify(parsedContent), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (parseError) {
      // If JSON parsing fails, try to extract concepts manually
      const concepts = content.match(/"([^"]+)"/g)?.map((match: string) => match.slice(1, -1)) || [];
      return new Response(JSON.stringify({ concepts: concepts.slice(0, 8) }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    console.error("Error extracting concepts:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to extract concepts",
      details: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});