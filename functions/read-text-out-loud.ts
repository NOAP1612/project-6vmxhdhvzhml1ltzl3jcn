import OpenAI from 'npm:openai';

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

Deno.serve(async (req) => {
  try {
    // Extract text and voice from the request body
    const { text, voice = 'fable' } = await req.json();

    // Ensure text is provided
    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Call the OpenAI API to generate speech
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice, // Use the 'fable' voice as requested
      input: text,
    });

    // Get the audio data as a buffer
    const buffer = await mp3.arrayBuffer();

    // Return the audio file as the response
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error('Error generating speech:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate audio' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});