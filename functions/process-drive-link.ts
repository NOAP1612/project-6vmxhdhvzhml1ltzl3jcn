import { GoogleWorkspace } from "npm:@superdevhq/google-workspace";

const extractFileIdFromUrl = (url: string): string | null => {
    const patterns = [
        /drive\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/,
        /drive\.google\.com\/open\?id=([a-zA-Z0-9-_]+)/,
        /docs\.google\.com\/document\/d\/([a-zA-Z0-9-_]+)/
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
};

Deno.serve(async (req: Request) => {
    try {
        const { driveLink } = await req.json();
        if (!driveLink) {
            return new Response(JSON.stringify({ success: false, error: "driveLink is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        const fileId = extractFileIdFromUrl(driveLink);
        if (!fileId) {
            return new Response(JSON.stringify({ success: false, error: "Invalid Google Drive link provided." }), { status: 400, headers: { "Content-Type": "application/json" } });
        }

        const google = new GoogleWorkspace();
        
        const text_content = await google.drive.extractText({ fileId });

        if (text_content === null || typeof text_content !== 'string') {
             return new Response(JSON.stringify({ success: false, error: "Could not extract text from the file. The file might be empty, unsupported, or permissions are missing." }), { status: 500, headers: { "Content-Type": "application/json" } });
        }

        return new Response(JSON.stringify({ success: true, text_content }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error in processDriveLink function:", error);
        
        let errorMessage = "An unknown error occurred while processing the Drive link.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return new Response(JSON.stringify({ success: false, error: errorMessage }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
