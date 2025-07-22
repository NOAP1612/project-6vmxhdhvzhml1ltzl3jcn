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

    const systemPrompt = language === "hebrew" 
      ? "אתה מורה מומחה שיוצר שאלות לימוד איכותיות בעברית. השתמש בעברית תקנית וברורה. החזר תמיד JSON תקין בלבד."
      : "You are an expert teacher creating high-quality educational questions. Use clear and proper English. Always return valid JSON only.";

    const userPrompt = language === "hebrew" 
      ? `צור ${numQuestions} שאלות ${questionType === 'multiple' ? 'אמריקאיות' : questionType === 'open' ? 'פתוחות' : 'מעורבות'} בנושא: "${topic}".

עבור שאלות אמריקאיות - כלול בדיוק 4 תשובות אפשריות.
עבור שאלות פתוחות - אל תכלול options.

החזר JSON בפורמט הזה בלבד:
{
  "questions": [
    {
      "id": "q1",
      "question": "השאלה כאן",
      "type": "multiple",
      "options": ["אפשרות 1", "אפשרות 2", "אפשרות 3", "אפשרות 4"],
      "correctAnswer": "אפשרות 1",
      "explanation": "הסבר מפורט למה זו התשובה הנכונה"
    }
  ]
}`
      : `Create ${numQuestions} ${questionType === 'multiple' ? 'multiple choice' : questionType === 'open' ? 'open-ended' : 'mixed'} questions about: "${topic}".

For multiple choice questions - include exactly 4 options.
For open questions - do not include options.

Return JSON in this exact format:
{
  "questions": [
    {
      "id": "q1", 
      "question": "Question text here",
      "type": "multiple",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Option 1",
      "explanation": "Detailed explanation why this is correct"
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
            content: systemPrompt
          },
          {
            role: "user", 
            content: userPrompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const parsedContent = JSON.parse(content);
      
      // Add unique IDs if missing
      if (parsedContent.questions) {
        parsedContent.questions = parsedContent.questions.map((q, index) => ({
          ...q,
          id: q.id || `q${index + 1}`
        }));
      }
      
      return new Response(JSON.stringify(parsedContent), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (parseError) {
      console.error("Parse error:", parseError);
      return new Response(JSON.stringify({ 
        error: "Failed to parse OpenAI response",
        details: parseError.message,
        rawContent: content 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    console.error("Quiz generation error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Unknown error occurred" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});