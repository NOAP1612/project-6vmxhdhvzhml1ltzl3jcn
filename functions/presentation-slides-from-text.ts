import OpenAI from "npm:openai";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

// Helper function to generate chart data directly
async function generateChartDataForSlide(text: string, slideTitle: string, topic: string) {
  try {
    console.log(`🔄 Generating chart for slide: "${slideTitle}"`);
    
    const prompt = `
      Based on the following text and the overall topic "${topic}", generate meaningful data for a chart relevant to the slide titled "${slideTitle}".
      The chart should be one of the following types: 'bar', 'pie', 'line', 'area', 'radar'.
      Invent realistic data if the source text lacks specific numbers, but ensure it logically fits the context of the slide.
      Provide a title for the chart, the chart type, the data points (name, value), and a brief, insightful explanation of what the chart shows. Everything must be in Hebrew.

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
        { role: "system", content: "You are an expert in data visualization and analysis, creating insightful charts in Hebrew from text." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });
    
    const chartData = JSON.parse(response.choices[0].message.content || "{}");
    console.log(`📊 Generated chart data:`, JSON.stringify(chartData, null, 2));
    
    // Basic validation
    if (chartData.title && chartData.type && chartData.data && Array.isArray(chartData.data) && chartData.data.length > 0) {
      console.log(`✅ Chart validation passed for slide: "${slideTitle}"`);
      return chartData;
    }
    
    console.log(`❌ Chart validation failed for slide: "${slideTitle}"`);
    return null;
  } catch (error) {
    console.error(`❌ Error generating chart data for slide "${slideTitle}":`, error);
    return null; // Return null on error to not break the whole presentation
  }
}

Deno.serve(async (req) => {
  try {
    const { text, slideCount, topic } = await req.json();

    if (!text || !slideCount || !topic) {
      return new Response(JSON.stringify({ error: "Missing required parameters: text, slideCount, and topic are required." }), { 
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`🚀 Starting presentation generation for topic: "${topic}" with ${slideCount} slides`);

    const initialPrompt = `
      Create a professional and detailed presentation in Hebrew on the topic "${topic}" based on the provided text.
      The presentation must have exactly ${slideCount} slides.
      
      IMPORTANT: For each slide, provide:
      1. A concise "title".
      2. A "content" field containing a single, well-written paragraph that summarizes a part of the text. Do NOT use bullet points. The content should flow logically from one slide to the next, covering the main points of the source text.
      3. A boolean flag "generate_chart". Set this to 'true' for every third slide (slide 3, 6, 9, etc.) and 'false' for all other slides. This is MANDATORY - do not skip this field.
      
      Source Text:
      ---
      ${text}
      ---

      Return a JSON object in the following structure. Do not include any extra explanations or text outside the JSON object.
      {
        "title": "כותרת המצגת",
        "slides": [
          {
            "title": "כותרת שקופית 1",
            "content": "זוהי פסקה המסכמת את החלק הראשון של הטקסט...",
            "generate_chart": false
          },
          {
            "title": "כותרת שקופית 2",
            "content": "זוהי פסקה המסכמת את החלק השני של הטקסט...",
            "generate_chart": false
          },
          {
            "title": "כותרת שקופית 3",
            "content": "זוהי פסקה המסכמת את החלק השלישי, שמתאים להמחשה ויזואלית...",
            "generate_chart": true
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert in creating structured, professional presentations in Hebrew based on text. You follow instructions precisely and ALWAYS include the generate_chart field for each slide." },
        { role: "user", content: initialPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const presentationStructure = JSON.parse(response.choices[0].message.content || "{}");
    console.log(`📋 Generated presentation structure:`, JSON.stringify(presentationStructure, null, 2));

    if (!presentationStructure.slides || !Array.isArray(presentationStructure.slides)) {
        throw new Error("Failed to generate a valid presentation structure from the AI.");
    }

    const finalSlides = [];

    for (let i = 0; i < presentationStructure.slides.length; i++) {
      const slide = presentationStructure.slides[i];
      let visual = null;
      
      console.log(`🔍 Processing slide ${i + 1}: "${slide.title}", generate_chart: ${slide.generate_chart}`);
      
      if (slide.generate_chart === true) {
        console.log(`📊 Generating chart for slide ${i + 1}...`);
        // Generate a real chart for this slide
        const chartData = await generateChartDataForSlide(text, slide.title, topic);
        if (chartData) {
          visual = { type: 'chart', data: chartData };
          console.log(`✅ Chart successfully generated for slide ${i + 1}`);
        } else {
          console.log(`❌ Failed to generate chart for slide ${i + 1}`);
        }
      }
      
      // Ensure content is a string, not an array
      const slideContent = Array.isArray(slide.content) ? slide.content.join("\n") : slide.content;

      finalSlides.push({ 
        title: slide.title,
        content: [slideContent], // Keep content as an array of one string to match the frontend hook
        visual: visual,
        visualSuggestion: visual ? `גרף: ${visual.data?.title || 'גרף מותאם אישית'}` : 'אין המחשה ויזואלית'
      });
    }

    const finalPresentation = {
      title: presentationStructure.title,
      slides: finalSlides,
    };

    console.log(`🎉 Presentation generation completed successfully with ${finalSlides.length} slides`);
    console.log(`📊 Charts generated: ${finalSlides.filter(s => s.visual?.type === 'chart').length}`);

    return new Response(JSON.stringify(finalPresentation), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error in presentation generation function:", error);
    return new Response(JSON.stringify({ error: "Failed to generate presentation: " + error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});