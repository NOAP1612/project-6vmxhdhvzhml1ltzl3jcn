Deno.serve(async (req) => {
  try {
    const { subject, language } = await req.json();
    
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = language === "hebrew" 
      ? `צור דף נוסחאות מסודר ומעוצב לתחום "${subject}".
         כלול את הנוסחאות החשובות ביותר עם הסברים קצרים.
         
         החזר את התוצאה בפורמט JSON:
         {
           "title": "דף נוסחאות - ${subject}",
           "categories": [
             {
               "name": "שם הקטגוריה",
               "formulas": [
                 {
                   "name": "שם הנוסחה",
                   "formula": "הנוסחה (LaTeX או טקסט)",
                   "description": "הסבר קצר",
                   "variables": "הסבר המשתנים",
                   "example": "דוגמה (אופציונלי)"
                 }
               ]
             }
           ]
         }`
      : `Create an organized and formatted formula sheet for "${subject}".
         Include the most important formulas with brief explanations.
         
         Return the result in JSON format:
         {
           "title": "Formula Sheet - ${subject}",
           "categories": [
             {
               "name": "Category name",
               "formulas": [
                 {
                   "name": "Formula name",
                   "formula": "Formula (LaTeX or text)",
                   "description": "Brief explanation",
                   "variables": "Variable explanations",
                   "example": "Example (optional)"
                 }
               ]
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
              ? "אתה מורה מומחה במתמטיקה ומדעים שיוצר דפי נוסחאות מסודרים. השתמש בעברית תקנית."
              : "You are an expert math and science teacher creating organized formula sheets. Use clear English."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
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