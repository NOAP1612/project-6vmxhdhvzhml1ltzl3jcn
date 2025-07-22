import OpenAI from "npm:openai@4.47.1";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

Deno.serve(async (req) => {
  try {
    const { text, style, language } = await req.json();

    if (!text || !style || !language) {
      return new Response(JSON.stringify({ error: "Missing text, style, or language" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `
      אתה עוזר ספריה אקדמי, מומחה לביבליוגרפיות. המשימה שלך היא לחלץ את כל המקורות הביבליוגרפיים מהטקסט שאספק לך, ולאחר מכן לסדר אותם ברשימה מסודרת לפי כללי הציטוט והשפה המבוקשים.
      **הוראות קריטיות:**
      1.  **חילוץ (Extraction):** קרא את הטקסט המצורף וזהה את רשימת המקורות המלאה (בדרך כלל תחת כותרת כמו "ביבליוגרפיה" או "References"). התעלם מציטוטים קצרים בתוך הטקסט עצמו, כמו (ישראלי, 2023).
      2.  **עיצוב וסגנון (Formatting & Style):** סדר את הרשימה שחולצה באופן מדויק לפי כללי סגנון הציטוט: **${style}**.
      3.  **שפת הפלט (Output Language):** כתוב את הרשימה הביבליוגרפית הסופית בשפה המבוקשת: **${language}**.
          * אם השפה היא 'he' (עברית), וודא שהקישורים והמונחים תקינים בעברית (למשל: "בתוך:", "עמ'").
          * אם השפה היא 'en' (אנגלית), השתמש במונחים המקובלים באנגלית (e.g., "In:", "pp.").
      4.  **פלט נקי:** הפלט הסופי שלך צריך להכיל **אך ורק** את הרשימה הביבליוגרפית המסודרת. אל תוסיף כותרות, הקדמות או כל טקסט אחר. אם לא מצאת מקורות, החזר את התשובה "לא נמצאו מקורות ביבליוגרפיים במסמך".
      **הטקסט לעיבוד:**
      ---
      ${text}
      ---
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.0,
    });

    const result = completion.choices[0].message.content;
    
    return new Response(JSON.stringify({ bibliography: result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error in format-bilingual-bibliography endpoint:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request.' }), { 
        status: 500,
        headers: { "Content-Type": "application/json" },
    });
  }
});