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
        voice: "fable",
        response_format: "mp3"
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: { message: response.statusText } }));
      const errorMessage = errorBody.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const audioBuffer = await response.arrayBuffer();
    const uint8 = new Uint8Array(audioBuffer);
    
    // btoa is not available in Deno's global scope, need to use a library or a polyfill
    // For simplicity, let's use a simple implementation
    let binary = '';
    for (let i = 0; i < uint8.byteLength; i++) {
        binary += String.fromCharCode(uint8[i]);
    }
    const base64String = btoa(binary);

    return new Response(JSON.stringify({ audioData: base64String }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json"
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});