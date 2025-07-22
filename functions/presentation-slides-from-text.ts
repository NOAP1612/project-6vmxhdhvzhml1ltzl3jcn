import OpenAI from 'npm:openai';

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

// Helper function to generate chart data directly
async function generateChartDataForSlide(text: string, slideTitle: string) {
  try {
    const prompt = `
      Based on the following text, generate data for a chart relevant to the slide titled "${slideTitle}".
      The chart should be one of the following types: 'bar', 'pie', 'line'.
      Provide a title for the chart, the chart type, and the data points (name, value).
      Also, provide a brief explanation of what the chart shows.

      Text:
      ---
      ${text}
      ---

      Return a single JSON object with the following structure:
      {
        "title": "Chart Title",
        "type": "bar",
        "data": [
          { "name": "Category A", "value": 123 },
          { "name": "Category B", "value": 456 }
        ],
        "explanation": "This chart shows..."
      }
    `;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert in data visualization and analysis." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });
    const chartData = JSON.parse(response.choices[0].message.content || "{}");
    // Basic validation
    if (chartData.title && chartData.type && chartData.data) {
      return chartData;
    }
    return null;
  } catch (e) {
    console.error("Could not generate chart data for slide:", e);
    return null;
  }
}

// Helper function to generate an image using DALL-E
async function generateImageForSlide(slideContent: string[]) {
  try {
    const imagePrompt = `Create a photorealistic image representing the key concept in the following sentences: ${slideContent.join(' ')}. The image should be professional and suitable for a business presentation.`;
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });
    return response.data[0].url;
  } catch (e) {
    console.error("Could not generate image for slide:", e);
    return null;
  }
}

Deno.serve(async (req) => {
  try {
    const { text, slideCount, topic } = await req.json();

    if (!text || !slideCount || !topic) {
      return new Response(JSON.stringify({ error: "Missing required parameters" }), { status: 400 });
    }

    const initialPrompt = `
      Create a professional and detailed presentation in Hebrew on the topic "${topic}" based on the following text.
      The presentation should have ${slideCount} slides.
      For each slide, provide a title and 3-5 in-depth content points analyzing the text.
      Additionally, for each slide, specify whether it is more suitable for a 'graph', 'image', or 'text only' under the key "visual_type".
      - Choose 'graph' if the slide contains quantitative or comparative data.
      - Choose 'image' if the content is descriptive and can be visually represented.
      - Choose 'text only' in other cases.
      
      Text for analysis:
      ---
      ${text}
      ---

      Return JSON in the following structure:
      {
        "title": "Presentation Title",
        "slides": [
          {
            "title": "Slide Title",
            "content": ["Point 1", "Point 2"],
            "visual_type": "graph" | "image" | "text only"
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert in creating in-depth and detailed business presentations in Hebrew, with the ability to identify opportunities for integrating visual aids." },
        { role: "user", content: initialPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const presentationStructure = JSON.parse(response.choices[0].message.content || "{}");

    const finalSlides = [];

    for (const slide of presentationStructure.slides) {
      let visual = null;
      if (slide.visual_type === 'גרף') {
        const chartData = await generateChartDataForSlide(text, slide.title);
        if (chartData) {
          visual = { type: 'chart', data: chartData };
        }
      } else if (slide.visual_type === 'תמונה') {
        const imageUrl = await generateImageForSlide(slide.content);
        if (imageUrl) {
          visual = { type: 'image', url: imageUrl };
        }
      }
      finalSlides.push({ ...slide, visual });
    }

    // Enforce "at least 1 in 3" rule
    for (let i = 0; i < finalSlides.length; i++) {
      const slideIndexInBlock = i % 3;
      if (slideIndexInBlock === 2) { // Check at the end of each block of 3
        const blockHasVisual = finalSlides.slice(i - 2, i + 1).some(s => s.visual);
        if (!blockHasVisual) {
          const slideToEnhance = finalSlides[i]; // Enhance the last slide of the block
          const chartData = await generateChartDataForSlide(text, slideToEnhance.title);
          if (chartData) {
            slideToEnhance.visual = { type: 'chart', data: chartData };
          }
        }
      }
    }

    const finalPresentation = {
      title: presentationStructure.title,
      slides: finalSlides,
    };

    return new Response(JSON.stringify(finalPresentation), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating presentation:", error);
    return new Response(JSON.stringify({ error: "Failed to generate presentation" }), { status: 500 });
  }
});