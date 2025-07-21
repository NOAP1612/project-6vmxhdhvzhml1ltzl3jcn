Deno.serve(async (req) => {
  try {
    const { topic, numQuestions, questionType, language } = await req.json();
    
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = language === "hebrew" 
      ? `צור ${numQuestions} שאלות ${questionType === 'multiple' ? 'אמריקאיות' : questionType === 'open' ? 'פתוחות' : 'מעורבות'} בנושא "${topic}". 
         עבור שאלות אמריקאיות, כלול 4 תשובות אפשריות עם סימון התשובה הנכונה.
         החזר את התוצאה בפורמט JSON עם המבנה הבא:
         {
           "questions": [
             {
               "question": "השאלה",
               "type": "multiple" או "open",
               "options": ["אפשרות 1", "אפשרות 2", "אפשרות 3", "אפשרות 4"] (רק לשאלות אמריקאיות),
               "correctAnswer": "התשובה הנכונה",
               "explanation": "הסבר קצר"
             }
           ]
         }`
      : `Create ${numQuestions} ${questionType === 'multiple' ? 'multiple choice' : questionType === 'open' ? 'open-ended' : 'mixed'} questions about "${topic}".
         For multiple choice questions, include 4 options with the correct answer marked.
         Return the result in JSON format with this structure:
         {
           "questions": [
             {
               "question": "The question",
               "type": "multiple" or "open",
               "options": ["Option 1", "Option 2", "Option 3", "Option 4"] (only for multiple choice),
               "correctAnswer": "The correct answer",
               "explanation": "Brief explanation"
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
              ? "אתה מורה מומחה שיוצר שאלות לימוד איכותיות בעברית. השתמש בעברית תקנית וברורה."
              : "You are an expert teacher creating high-quality educational questions. Use clear and proper English."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
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