import { OpenAI } from "npm:openai@4.47.1";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

Deno.serve(async (req) => {
  try {
    const { text, slideCount, topic } = await req.json();

    const prompt = `
You are an expert presentation designer for university students. Your task is to create a presentation with approximately ${slideCount} slides based on the provided academic text and topic.

CRITICAL INSTRUCTIONS:
1.  STRICT GROUNDING: Every piece of text on every slide (titles and bullet points) MUST be derived STRICTLY from the information within the provided text. Do not add external information or make up details.
2.  NO HALLUCINATIONS: If a concept is not detailed enough in the text for a full slide, summarize only what is available. Do not invent content to fill space. If the text is completely irrelevant to the topic, create slides stating that the text does not cover the topic.
3.  LOGICAL FLOW: The slides should follow a logical progression, starting with an introduction and ending with a conclusion, based on the original text's structure.
4.  VISUALS: For each slide, suggest a visual element. This can be a 'chart' or an 'image'.
    *   For 'chart', if the text contains quantitative data suitable for visualization, define a chart object with 'type', 'data' (name-value pairs), and a brief 'explanation'. Supported chart types are: 'bar', 'pie', 'line', 'area', 'radar', 'treemap'.
    *   For 'image', you don't need to provide a URL. Just indicate that an image is needed by setting the type to 'image'.
    *   If no specific visual is relevant, set 'visual' to null.
5.  HEBREW LANGUAGE: The entire presentation (title, slide titles, content) must be in Hebrew.
6.  JSON FORMAT: Return the result as a single JSON object.

Here is the text:
---
${text}
---

The main topic of the presentation is: "${topic}".

Generate the presentation now based ONLY on the substantive content of the text above.
Return the result in the specified JSON format:
{
  "title": "A concise, engaging title for the presentation in Hebrew",
  "slides": [
    {
      "title": "Slide title in Hebrew",
      "content": [
        "Bullet point 1 from the text.",
        "Bullet point 2 from the text.",
        "Bullet point 3 from the text."
      ],
      "visual": {
        "type": "chart" | "image" | null,
        "data": { // Only if type is 'chart'
          "type": "bar" | "pie" | "line" | "area" | "radar" | "treemap",
          "data": [
            { "name": "Category A", "value": 40 },
            { "name": "Category B", "value": 60 }
          ],
          "explanation": "A brief explanation of the chart's data."
        },
        "url": null // Keep as null
      }
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Upgraded model for better content generation
      messages: [
        { role: 'system', content: 'You are a presentation designer that generates presentation slides from text in a specific JSON format.' },
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
    console.error("Error generating presentation slides:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});