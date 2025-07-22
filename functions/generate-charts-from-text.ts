import OpenAI from 'npm:openai';

// This is a Deno serverless function
// It can be called from the client-side using:
// import { generateChartsFromText } from "@/functions";
// const result = await generateChartsFromText({ ... });

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

Deno.serve(async (req) => {
    try {
        const { text, chartType, chartTitle } = await req.json();

        if (!text) {
            return new Response(JSON.stringify({ error: "Text is required" }), { 
                status: 400, 
                headers: { "Content-Type": "application/json" } 
            });
        }

        let prompt;

        if (!chartType) {
            // Phase 1: Suggest charts
            prompt = `Analyze the following text and suggest up to 4 relevant charts that can be created from it. The text is in Hebrew. Your suggestions should also be in Hebrew. For each chart, provide:
1.  'type': one of 'bar', 'pie', 'line', 'area'.
2.  'title': a concise and descriptive title for the chart.
3.  'description': a short, one-sentence explanation of what the chart shows.

Text:
"""
${text}
"""

Return a valid JSON object with a single key "suggestions" which is an array of suggestion objects.`;
        } else {
            // Phase 2: Generate chart data
            prompt = `Based on the following Hebrew text, generate data for a '${chartType}' chart titled '${chartTitle}'.
- The data you generate must be in Hebrew.
- For 'pie' charts, the data array must contain objects with "name" (string) and "value" (number) keys.
- For 'bar', 'line', and 'area' charts, the data array must contain objects with a "name" (string for the x-axis label) and one or more other keys with numeric values for the y-axis. Use short, descriptive Hebrew key names for the data keys.
- Extract relevant entities and their counts or values from the text to build the chart data.

Text:
"""
${text}
"""

Return a valid JSON object with a single key "data" which contains the JSON array of data points.`;
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error("Empty response from OpenAI");
        }

        const jsonData = JSON.parse(content);

        return new Response(JSON.stringify(jsonData), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in generate-charts-from-text:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});