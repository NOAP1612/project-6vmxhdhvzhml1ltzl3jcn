Deno.serve(async (req) => {
  try {
    const { topic, style, language } = await req.json();
    
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = language === "hebrew" 
      ? `צור פוסט לימודי קצר ומעוצב בנושא "${topic}" בסגנון ${style}.
         הפוסט צריך להיות מתאים לשיתוף ברשתות חברתיות או בקבוצות וואטסאפ.
         
         החזר את התוצאה בפורמט JSON:
         {
           "title": "כותרת מושכת",
           "content": "תוכן הפוסט עם אמוג'י ועיצוב",
           "hashtags": ["#האשטג1", "#האשטג2"],
           "callToAction": "קריאה לפעולה"
         }`
      : `Create a short and stylized study post about "${topic}" in ${style} style.
         The post should be suitable for sharing on social media or WhatsApp groups.
         
         Return the result in JSON format:
         {
           "title": "Catchy title",
           "content": "Post content with emojis and formatting",
           "hashtags": ["#hashtag1", "#hashtag2"],
           "callToAction": "Call to action"
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
              ? "אתה יוצר תוכן מומחה שיוצר פוסטים לימודיים מעניינים ומושכים. השתמש באמוג'י ובעיצוב יפה."
              : "You are an expert content creator making engaging and attractive educational posts. Use emojis and beautiful formatting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
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