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
      בהתבסס על הטקסט הבא בנושא "${topic}", צור מצגת בעברית עם בדיוק ${slideCount} שקופיות.
      לכל שקופית, ספק כותרת, מספר נקודות עיקריות (3-5), והצעה לאלמנט חזותי רלוונטי.
      
      הנחיות חשובות:
      - כל התוכן חייב להיות בעברית
      - השקופיות צריכות להיות ממורכזות ומסודרות בצורה לוגית
      - התחל עם שקופית פתיחה וסיים עם סיכום או מסקנות
      - הטון צריך להיות מקצועי ואינפורמטיבי
      - עבור כל שקופית, הצע אלמנט חזותי מתאים:
        * גרף (עמודות, עוגה, קו) אם יש נתונים מספריים
        * תמונה רלוונטית לנושא
        * איקון או סמל מתאים
        * דיאגרמה או תרשים זרימה אם מתאים
      - לא חובה שלכל שקופית יהיה אלמנט חזותי, רק כשזה מוסיף ערך

      הטקסט לניתוח:
      ---
      ${text}
      ---

      החזר את התוצאה בפורמט JSON תקין עם המבנה הבא:
      {
        "title": "כותרת ראשית של המצגת בעברית",
        "slides": [
          {
            "title": "כותרת השקופית בעברית",
            "content": [
              "נקודה עיקרית 1",
              "נקודה עיקרית 2", 
              "נקודה עיקרית 3"
            ],
            "visualSuggestion": "תיאור של האלמנט החזותי המוצע (לדוגמה: 'גרף עמודות המשווה נתוני מכירות', 'תמונה של נורה לרעיונות חדשים', 'דיאגרמת זרימה של התהליך')"
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "אתה מומחה ביצירת מצגות ברורות ומקצועיות בעברית. אתה יוצר תוכן ממורכז ומסודר עם הצעות חזותיות מתאימות." 
        },
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