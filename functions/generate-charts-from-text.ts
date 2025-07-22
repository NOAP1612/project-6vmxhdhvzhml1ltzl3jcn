import OpenAI from 'npm:openai@4.52.7';

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

Deno.serve(async (req) => {
  try {
    // Ensure the request method is POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { text } = await req.json();
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return new Response(JSON.stringify({ error: 'Text is required and must be a non-empty string' }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `
      Analyze the following text in Hebrew. Your goal is to create a "visual formula sheet" by extracting up to 5 key data points, concepts, or relationships that can be visualized.

      For each key insight, suggest a chart (e.g., bar, pie, line, area), provide a clear Hebrew title, and generate the corresponding data points. The data should be ready for plotting.

      Text:
      ${text}

      Return a single JSON object with a "charts" array. Each object in the array should represent one chart and have the following structure:
      {
        "title": "Hebrew Chart Title",
        "type": "bar",
        "data": [ { "name": "Category Name", "value": 123 } ]
      }
      Ensure the generated data is directly from the text or a logical summary of it. Generate between 2 and 5 different charts if the text allows.
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are an expert data analyst specializing in creating data visualizations from text. You always respond in valid JSON format."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    
    return new Response(content, {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-charts-from-text:", error);
    return new Response(JSON.stringify({ error: error.message || 'An unexpected error occurred' }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
    });
  }
});