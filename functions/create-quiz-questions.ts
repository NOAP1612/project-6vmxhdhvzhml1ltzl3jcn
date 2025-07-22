import { OpenAI } from "npm:openai@4.47.1";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

Deno.serve(async (req) => {
  try {
    const { text, numQuestions = 10, language = 'hebrew' } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "Text input is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `
You are an expert quiz creator for university students. Your task is to generate a multiple-choice quiz in Hebrew with ${numQuestions} questions based on the provided academic text.

**CRITICAL INSTRUCTIONS:**
1.  **DEEP CONCEPTUAL QUESTIONS:** Generate questions that test deep understanding of the core concepts, arguments, and data presented in the text.
2.  **IGNORE METADATA:** DO NOT create questions about the text's structure, titles, chapter names, or section numbers. Focus on the content itself.
3.  **UNIQUE AND DISTINCT ANSWERS:** For each question, ensure that all 4 answer options (including the correct and incorrect ones) are unique, distinct, and plausible. Do not repeat answers.
4.  **HEBREW LANGUAGE:** The entire quiz (title, questions, options, explanation) must be in Hebrew.
5.  **JSON OUTPUT:** The final output must be a valid JSON object.

Here is the text:
---
${text}
---

Generate the quiz now based *only* on the substantive content of the text above, with a concise title that reflects the main topic.
Return the result in the specified JSON format:
{
  "title": "כותרת החידון",
  "questions": [
    {
      "question": "השאלה כאן?",
      "options": ["אפשרות 1", "אפשרות 2", "אפשרות 3", "אפשרות 4"],
      "correctAnswer": "התשובה הנכונה",
      "explanation": "הסבר קצר למה זו התשובה הנכונה"
    }
  ]
}
`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Upgraded model for higher quality
      messages: [
        { role: 'system', content: 'You are an expert quiz creator for university students. Always return a valid JSON response in Hebrew.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("OpenAI returned empty content.");
    }
    
    // Post-processing to remove duplicate options, just in case.
    const quizData = JSON.parse(content);
    if (quizData.questions) {
      quizData.questions.forEach(q => {
        if (q.options && Array.isArray(q.options)) {
          const uniqueOptions = new Set(q.options);
          q.options = Array.from(uniqueOptions);
        }
      });
    }

    return new Response(JSON.stringify(quizData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error creating quiz:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});