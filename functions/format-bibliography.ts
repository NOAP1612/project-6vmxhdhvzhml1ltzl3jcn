import OpenAI from "npm:openai@4.47.1";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

Deno.serve(async (req) => {
  try {
    const { text, style } = await req.json(); // Expecting JSON with text and style

    if (!text || !style) {
      return new Response(JSON.stringify({ error: "Missing document text or citation style" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // This is the optimized prompt
    const prompt = `
You are a meticulous academic librarian AI. Your task is to extract all bibliographic references from the provided text and format them perfectly into the specified citation style.

**Step 1: Extraction**
Carefully scan the entire document text provided below. Your goal is to identify and extract the full list of bibliographic entries, which are usually located in a "References", "Bibliography", or "Works Cited" section.
- **IGNORE** simple in-text citations (e.g., "(Author, Year)").
- **FOCUS** on the complete reference entries.

**Step 2: Formatting**
Take the extracted list and format it flawlessly according to the **${style}** citation style rules. The final output must be a clean, alphabetized (where appropriate for the style), and correctly formatted list.

**CRITICAL INSTRUCTIONS:**
- The output should ONLY be the final, formatted bibliography. Do not include any extra text, headings, or explanations like "Here is the formatted list:".
- If no references are found in the text, return the single phrase: "No bibliographic references were found."
- Pay close attention to details like punctuation, capitalization, and italics as required by the **${style}** style.

**Document Text:**
---
${text}
---
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Best model for accuracy-critical tasks
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.0, // Set to 0 for maximum consistency and accuracy
    });

    const result = completion.choices[0].message.content;

    return new Response(JSON.stringify({ bibliography: result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error in format-bibliography endpoint:', error);
    return new Response(JSON.stringify({ error: 'Failed to format bibliography.' }), { 
        status: 500,
        headers: { "Content-Type": "application/json" },
    });
  }
});