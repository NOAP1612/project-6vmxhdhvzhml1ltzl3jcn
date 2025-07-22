import { OpenAI } from "npm:openai@4.47.1";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

Deno.serve(async (req) => {
  try {
    const { topic, concepts, language, text } = await req.json();

    const prompt = `
You are an academic assistant specializing in creating detailed summary tables in ${language}. Your task is to create a summary for the topic "${topic}" based on the provided text.

The summary table should focus on the following concepts:
- ${concepts.join("\n- ")}

CRITICAL INSTRUCTIONS:
1.  STRICT GROUNDING: Base your ENTIRE output STRICTLY on the information found within the provided text. DO NOT use any external knowledge or make assumptions.
2.  NO HALLUCINATIONS: If the text does not contain information for a specific concept or column (definition, explanation, example), you MUST write "Not specified in text" in the corresponding cell. Do not invent information.
3.  FOCUS ON SUBSTANCE: For each concept, extract its definition, a detailed explanation, and a relevant example from the text.
4.  LANGUAGE: The entire output, including the title and all table content, must be in ${language}.
5.  JSON FORMAT: Return the output as a single JSON object with the following structure:
    {
      "title": "A concise title for the summary table in ${language}",
      "summary": [
        {
          "concept": "The concept name",
          "definition": "The definition from the text",
          "explanation": "The explanation from the text",
          "example": "An example from the text, or 'Not specified in text'"
        }
      ]
    }
    Ensure the 'summary' array contains one object for each concept provided.

Here is the text:
---
${text}
---

Generate the summary table based only on the text above.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Upgraded model for higher accuracy
      messages: [
        { role: 'system', content: 'You are an academic assistant that generates summary tables from text in a specific JSON format.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("OpenAI returned empty content.");
    }

    return new Response(content, {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error generating summary table:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});