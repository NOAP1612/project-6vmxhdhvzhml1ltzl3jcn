import OpenAI from 'npm:openai';

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

// Helper function to generate chart data directly
async function generateChartDataForSlide(text: string, slideTitle: string, topic: string) {
  try {
    const prompt = `
      Based on the following text and the overall topic "${topic}", generate meaningful data for a chart relevant to the slide titled "${slideTitle}".
      The chart should be one of the following types: 'bar', 'pie', 'line', 'area', 'radar'.
      Invent realistic data if the source text lacks specific numbers, but ensure it logically fits the context.
      Provide a title for the chart, the chart type, and the data points (name, value).
      Also, provide a brief, insightful explanation of what the chart shows in Hebrew.

      Text:
      ---
      ${text}
      ---

      Return a single JSON object with the following structure:
      {
        "title": "כותרת הגרף",
        "type": "bar",
        "data": [
          { "name": "קטגוריה א", "value": 123 },
          { "name": "קטגוריה ב", "value": 456 }
        ],
        "explanation": "הגרף מציג..."
      }
    `;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert in data visualization and analysis, creating insightful charts from text." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });
    const chartData = JSON.parse(response.choices[0].message.content || "{}");
    // Basic validation
    if (chartData.title && chartData.type && chartData.data && Array.isArray(chartData.data) && chartData.data.length > 0) {
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
      return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
    }

    const initialPrompt = `
      Create a professional and detailed presentation in Hebrew on the topic "${topic}" based on the following text.
      The presentation must have exactly ${slideCount} slides.
      For each slide, provide a concise title and 2-4 short, clear bullet points. Avoid long paragraphs.
      
      Crucially, for every 2-3 slides, you MUST designate the 'visual_type' as 'graph' to ensure the presentation is visually engaging. For other slides, choose 'image' if the content is descriptive, or 'text only' otherwise. Distribute the visual types logically.

      Text for analysis:
      ---
      ${text}
      ---

      Return JSON in the following structure:
      {
        "title": "כותרת המצגת",
        "slides": [
          {
            "title": "כותרת שקופית",
            "content": ["נקודה קצרה 1", "נקודה קצרה 2"],
            "visual_type": "graph" | "image" | "text only"
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert in creating concise, engaging business presentations in Hebrew. You prioritize clarity and visual data representation." },
        { role: "user", content: initialPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const presentationStructure = JSON.parse(response.choices[0].message.content || "{}");

    if (!presentationStructure.slides || !Array.isArray(presentationStructure.slides)) {
        throw new Error("Failed to generate valid presentation structure.");
    }

    const finalSlides = [];

    for (const slide of presentationStructure.slides) {
      let visual = null;
      if (slide.visual_type === 'graph') {
        const chartData = await generateChartDataForSlide(text, slide.title, topic);
        if (chartData) {
          visual = { type: 'chart', data: chartData };
        }
      } else if (slide.visual_type === 'image') {
        const imageUrl = await generateImageForSlide(slide.content);
        if (imageUrl) {
          visual = { type: 'image', url: imageUrl };
        }
      }
      finalSlides.push({ ...slide, visual });
    }

    const finalPresentation = {
      title: presentationStructure.title,
      slides: finalSlides,
    };

    return new Response(JSON.stringify(finalPresentation), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in presentation generation function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});