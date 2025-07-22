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
      נתח את הטקסט הבא בעברית. המטרה שלך היא ליצור "דף נוסחאות חזותי" על ידי חילוץ עד 5 נקודות מידע מרכזיות, מושגים או קשרים שניתן להמחיש.

      עבור כל תובנה מרכזית:
      - הצע גרף מפורט (כגון עמודות, עוגה, קו, שטח) עם כמה שיותר קטגוריות רלוונטיות מהטקסט.
      - ספק כותרת ברורה בעברית.
      - צור את נקודות הנתונים המתאימות, מוכנות לשרטוט.
      - כתב הסבר מפורט (בעברית) מתחת לגרף, המתאר מה הגרף מראה ואילו תובנות ניתן ללמוד ממנו.
      - הקפד שהנתונים יהיו מבוססים על הטקסט או סיכום לוגי שלו.

      טקסט:
      ${text}

      החזר אובייקט JSON יחיד עם מערך "charts". כל אובייקט במערך צריך לייצג גרף אחד ולהיות במבנה הבא:
      {
        "title": "כותרת הגרף בעברית",
        "type": "bar",
        "data": [ { "name": "שם הקטגוריה", "value": 123 } ],
        "explanation": "פירוט מפורט בעברית על מה שהגרף מראה, מה המשמעות של הנתונים, ואילו תובנות חשובות ניתן ללמוד ממנו"
      }
      
      צור בין 2 ל-5 גרפים שונים ומפורטים אם הטקסט מאפשר זאת. הקפד שכל גרף יהיה עשיר במידע ובעל ערך הסברי גבוה.
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "אתה מומחה בניתוח נתונים המתמחה ביצירת הדמיות נתונים מטקסט. אתה תמיד מחזיר תשובה בפורמט JSON תקין ומפורט."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
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