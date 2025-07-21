Deno.serve(async (req) => {
  try {
    const { text, language } = await req.json();
    
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: "alloy",
        response_format: "mp3"
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: { message: response.statusText } }));
      const errorMessage = errorBody.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new Response(audioBuffer, {
      status: 200,
      headers: { 
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "attachment; filename=speech.mp3"
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});