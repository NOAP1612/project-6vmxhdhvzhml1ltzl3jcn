import OpenAI from 'npm:openai';
import { generateChartsFromText } from '@/functions';
import { generateImage } from '@/integrations/core';

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

// Helper function to generate a single chart
async function generateChartForSlide(text: string, topic: string) {
  try {
    const chartDataResponse = await generateChartsFromText({ text, topic });
    if (chartDataResponse && chartDataResponse.charts && chartDataResponse.charts.length > 0) {
      return chartDataResponse.charts[0]; // Return the first chart found
    }
    return null;
  } catch (e) {
    console.error("Could not generate chart for slide:", e);
    return null;
  }
}

// Helper function to generate an image
async function generateImageForSlide(slideContent: string[]) {
  try {
    const imagePrompt = `צור תמונה פוטוריאליסטית המייצגת את הרעיון המרכזי במשפטים הבאים: ${slideContent.join(' ')}. התמונה צריכה להיות מקצועית ומתאימה למצגת עסקית.`;
    const { url } = await generateImage({ prompt: imagePrompt });
    return url;
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
      צור מצגת מקצועית ומפורטת בעברית בנושא "${topic}" על בסיס הטקסט הבא.
      המצגת צריכה להכיל ${slideCount} שקופיות.
      עבור כל שקופית, ספק כותרת ו-3-5 נקודות תוכן מעמיקות המנתחות את הטקסט.
      בנוסף, לכל שקופית, ציין אם היא מתאימה יותר ל'גרף', 'תמונה' או 'טקסט בלבד' תחת המפתח "visual_type".
      - בחר 'גרף' אם השקופית מכילה נתונים כמותיים או השוואתיים.
      - בחר 'תמונה' אם התוכן הוא תיאורי וניתן לייצוג חזותי.
      - בחר 'טקסט בלבד' במקרים אחרים.
      
      הטקסט לניתוח:
      ---
      ${text}
      ---

      החזר JSON במבנה הבא:
      {
        "title": "כותרת המצגת",
        "slides": [
          {
            "title": "כותרת שקופית",
            "content": ["נקודה 1", "נקודה 2"],
            "visual_type": "גרף" | "תמונה" | "טקסט בלבד"
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "אתה מומחה ביצירת מצגות עסקיות מעמיקות ומפורטות בעברית, עם יכולת לזהות הזדמנויות לשילוב עזרים חזותיים." },
        { role: "user", content: initialPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const presentationStructure = JSON.parse(response.choices[0].message.content || "{}");

    const finalSlides = [];
    let visualCount = 0;

    for (const slide of presentationStructure.slides) {
      let visual = null;
      if (slide.visual_type === 'גרף') {
        const chartData = await generateChartForSlide(text, slide.title);
        if (chartData) {
          visual = { type: 'chart', data: chartData };
          visualCount++;
        }
      } else if (slide.visual_type === 'תמונה') {
        const imageUrl = await generateImageForSlide(slide.content);
        if (imageUrl) {
          visual = { type: 'image', url: imageUrl };
          visualCount++;
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
          const chartData = await generateChartForSlide(text, slideToEnhance.title);
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