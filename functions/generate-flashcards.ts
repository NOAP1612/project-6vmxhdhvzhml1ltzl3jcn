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
      ? `צור כרטיסיות זיכרון (פלאש קארדס) לנושא "${topic}" עם המושגים: ${concepts.join(', ')}.
         כל כרטיסייה צריכה להכיל שאלה בצד אחד ותשובה בצד שני.
         
         החזר את התוצאה בפורמט JSON:
         {
           "title": "כותרת הכרטיסיות",
           "flashcards": [
             {
               "front": "השאלה או המושג",
               "back": "התשובה או ההסבר",
               "category": "קטגוריה",
               "difficulty": "קל/בינוני/קשה"
             }
           ]
         }`
      : `Create flashcards for the topic "${topic}" with concepts: ${concepts.join(', ')}.
         Each flashcard should have a question on one side and an answer on the other.
         
         Return the result in JSON format:
         {
           "title": "Flashcards title",
           "flashcards": [
             {
               "front": "Question or concept",
               "back": "Answer or explanation",
               "category": "Category",
               "difficulty": "easy/medium/hard"
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
              ? "אתה מורה מומחה שיוצר כרטיסיות זיכרון יעילות ללמידה מהירה. השתמש בעברית תקנית."
              : "You are an expert teacher creating effective flashcards for quick learning. Use clear English."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
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