Deno.serve(async (req) => {
  try {
    const { topics, availableTime, examDate, language } = await req.json();
    
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = language === "hebrew" 
      ? `צור תוכנית לימודים יומית (גאנט לימודים) לקראת מבחן בתאריך ${examDate}.
         נושאי הלימוד: ${topics.join(', ')}
         זמן פנוי יומי: ${availableTime} שעות
         
         החזר תוכנית מפורטת בפורמט JSON:
         {
           "title": "תוכנית לימודים",
           "totalDays": מספר הימים,
           "schedule": [
             {
               "day": מספר היום,
               "date": "תאריך",
               "topics": ["נושא 1", "נושא 2"],
               "duration": "זמן בשעות",
               "tasks": ["משימה 1", "משימה 2"],
               "goals": "יעדי היום"
             }
           ]
         }`
      : `Create a daily study schedule (study Gantt) for an exam on ${examDate}.
         Study topics: ${topics.join(', ')}
         Daily available time: ${availableTime} hours
         
         Return a detailed plan in JSON format:
         {
           "title": "Study Schedule",
           "totalDays": number of days,
           "schedule": [
             {
               "day": day number,
               "date": "date",
               "topics": ["topic 1", "topic 2"],
               "duration": "time in hours",
               "tasks": ["task 1", "task 2"],
               "goals": "daily goals"
             }
           ]
         }`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: language === "hebrew" 
              ? "אתה יועץ לימודים מומחה שיוצר תוכניות לימוד מותאמות אישית. השתמש בעברית תקנית."
              : "You are an expert study advisor creating personalized study plans. Use clear English."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.6,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const parsedContent = JSON.parse(content);
      return new Response(JSON.stringify(parsedContent), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (parseError) {
      return new Response(JSON.stringify({ 
        error: "Failed to parse OpenAI response",
        rawContent: content 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});