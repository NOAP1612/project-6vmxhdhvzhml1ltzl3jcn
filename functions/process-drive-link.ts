import { invokeLLM } from "@/integrations/core";

Deno.serve(async (req) => {
  try {
    const { driveLink } = await req.json();
    
    if (!driveLink) {
      return new Response(JSON.stringify({ error: "Drive link is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Extract file ID from Google Drive link
    let fileId = '';
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9-_]+)/,
      /id=([a-zA-Z0-9-_]+)/,
      /\/d\/([a-zA-Z0-9-_]+)/
    ];

    for (const pattern of patterns) {
      const match = driveLink.match(pattern);
      if (match) {
        fileId = match[1];
        break;
      }
    }

    if (!fileId) {
      return new Response(JSON.stringify({ 
        error: "Invalid Google Drive link format" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create a public viewing link
    const publicLink = `https://drive.google.com/uc?id=${fileId}&export=download`;

    // Use LLM to extract text from the PDF via the public link
    const result = await invokeLLM({
      prompt: `Please extract all text content from the PDF document at this Google Drive link: ${publicLink}
      
      Return the full text content preserving the original language (Hebrew or English). 
      If the document is not accessible or not a PDF, please indicate the error.`,
      response_json_schema: {
        type: "object",
        properties: {
          text_content: {
            type: "string",
            description: "The full text content of the document"
          },
          success: {
            type: "boolean",
            description: "Whether the extraction was successful"
          },
          error: {
            type: "string",
            description: "Error message if extraction failed"
          }
        },
        required: ["success"]
      }
    });

    if (result.success && result.text_content) {
      return new Response(JSON.stringify({
        success: true,
        text_content: result.text_content
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: result.error || "Failed to extract text from the document"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    console.error("Error processing drive link:", error);
    return new Response(JSON.stringify({ 
      error: "Internal server error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});