import OpenAI from 'npm:openai';
import { encode } from "https://deno.land/std@0.208.0/encoding/base64.ts";

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

Deno.serve(async (req) => {
  try {
    // Extract text and voice from the request body
    const { text, voice = 'alloy' } = await req.json();

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
      voice: voice, // Now using 'alloy' as the default voice
      input: text,
    });

    // Get the audio data as a buffer and encode it to base64
    const buffer = await mp3.arrayBuffer();
    const base64Audio = encode(buffer);

    // Return the base64 encoded audio in a JSON object
    return new Response(JSON.stringify({ audioData: base64Audio }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error('Error generating speech:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate audio' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});