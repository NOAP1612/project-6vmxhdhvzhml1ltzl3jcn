import OpenAI from "npm:openai";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

// Helper function to generate chart data directly with specific chart type
async function generateChartDataForSlide(text: string, slideTitle: string, topic: string, chartType: 'bar' | 'pie' | 'radar') {
  try {
    console.log(`🔄 Generating ${chartType} chart for slide: "${slideTitle}"`);
    
    const chartTypeInstructions = {
      bar: "עמודות - השווה בין קטגוריות או הראה התפתחות לאורך זמן",
      pie: "עוגה - הראה חלוקה או אחוזים של שלם",
      radar: "דיאגרמה רדאר - הראה מספר מדדים או תכונות בו זמנית"
    };
    
    const prompt = `
      Based on the following text and the overall topic "${topic}", generate meaningful data for a ${chartType} chart relevant to the slide titled "${slideTitle}".
      
      Chart type: ${chartType} (${chartTypeInstructions[chartType]})
      
      Invent realistic data if the source text lacks specific numbers, but ensure it logically fits the context of the slide and the chart type.
      For ${chartType} charts, make sure the data structure fits this chart type perfectly.
      
      Provide a title for the chart, the data points (name, value), and a brief, insightful explanation of what the chart shows. Everything must be in Hebrew.

      Text:
      ---
      ${text}
      ---

      Return a single JSON object with the following structure:
      {
        "title": "כותרת הגרף",
        "type": "${chartType}",
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
        { role: "system", content: "You are an expert in data visualization and analysis, creating insightful charts in Hebrew from text. You create charts that match the requested type perfectly." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });
    
    const chartData = JSON.parse(response.choices[0].message.content || "{}");
    console.log(`📊 Generated ${chartType} chart data:`, JSON.stringify(chartData, null, 2));
    
    // Basic validation
    if (chartData.title && chartData.type && chartData.data && Array.isArray(chartData.data) && chartData.data.length > 0) {
      console.log(`✅ ${chartType} chart validation passed for slide: "${slideTitle}"`);
      return chartData;
    }
    
    console.log(`❌ ${chartType} chart validation failed for slide: "${slideTitle}"`);
    return null;
  } catch (error) {
    console.error(`❌ Error generating ${chartType} chart data for slide "${slideTitle}":`, error);
    return null;
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
      3. A boolean flag "generate_chart". Set this to 'true' for exactly 3 slides that are evenly distributed throughout the presentation (for example, if there are 9 slides, use slides 3, 6, 9). Set to 'false' for all other slides. This is MANDATORY - do not skip this field.
      
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
        { role: "system", content: "You are an expert in creating structured, professional presentations in Hebrew based on text. You follow instructions precisely and ALWAYS include the generate_chart field for each slide. You distribute exactly 3 chart slides evenly throughout the presentation." },
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
    const chartTypes: ('bar' | 'pie' | 'radar')[] = ['bar', 'pie', 'radar'];
    let chartIndex = 0;

    for (let i = 0; i < presentationStructure.slides.length; i++) {
      const slide = presentationStructure.slides[i];
      let visual = null;
      
      console.log(`🔍 Processing slide ${i + 1}: "${slide.title}", generate_chart: ${slide.generate_chart}`);
      
      if (slide.generate_chart === true && chartIndex < chartTypes.length) {
        const chartType = chartTypes[chartIndex];
        console.log(`📊 Generating ${chartType} chart for slide ${i + 1}...`);
        
        const chartData = await generateChartDataForSlide(text, slide.title, topic, chartType);
        if (chartData) {
          visual = { type: 'chart', data: chartData };
          console.log(`✅ ${chartType} chart successfully generated for slide ${i + 1}`);
        } else {
          console.log(`❌ Failed to generate ${chartType} chart for slide ${i + 1}`);
        }
        chartIndex++;
      }
      
      // Ensure content is a string, not an array
      const slideContent = Array.isArray(slide.content) ? slide.content.join("\n") : slide.content;

      finalSlides.push({ 
        title: slide.title,
        content: [slideContent],
        visual: visual
        // Removed visualSuggestion completely - no fallback text when there's no chart
      });
    }

    const finalPresentation = {
      title: presentationStructure.title,
      slides: finalSlides,
    };

    console.log(`🎉 Presentation generation completed successfully with ${finalSlides.length} slides`);
    console.log(`📊 Charts generated: ${finalSlides.filter(s => s.visual?.type === 'chart').length}`);
    console.log(`📊 Chart types used: ${finalSlides.filter(s => s.visual?.type === 'chart').map(s => s.visual?.data?.type).join(', ')}`);

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