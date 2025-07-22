import OpenAI from 'npm:openai';

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

Deno.serve(async (req) => {
  try {
    const { text, slideCount, topic } = await req.json();

    if (!text || !slideCount || !topic) {
      return new Response(JSON.stringify({ error: "Missing required parameters: text, slideCount, topic" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `
      Based on the following text about "${topic}", create a presentation with exactly ${slideCount} slides.
      For each slide, provide a title, a few bullet points (3-5), and a suggestion for a relevant visual element (like a type of chart, an icon, or a concept for an image).
      The presentation should have a logical flow, starting with an introduction and ending with a conclusion or summary.
      The tone should be professional and informative.

      Text to analyze:
      ---
      ${text}
      ---

      Please return the output in a valid JSON format with the following structure:
      {
        "title": "Main title of the presentation",
        "slides": [
          {
            "title": "Slide title",
            "content": [
              "Bullet point 1",
              "Bullet point 2",
              "Bullet point 3"
            ],
            "visualSuggestion": "Description of a suggested visual (e.g., 'Bar chart comparing sales figures', 'Icon of a lightbulb for new ideas')"
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert in creating clear and concise presentations." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const presentationData = JSON.parse(response.choices[0].message.content || "{}");

    return new Response(JSON.stringify(presentationData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating presentation slides:", error);
    return new Response(JSON.stringify({ error: "Failed to generate presentation slides." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});