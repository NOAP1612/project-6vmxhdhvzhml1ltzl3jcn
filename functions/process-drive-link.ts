import { GoogleWorkspace } from "npm:@superdevhq/google-workspace";

const extractFileIdFromUrl = (url: string): string | null => {
// ... keep existing code
};

Deno.serve(async (req: Request) => {
    try {
        const { url } = await req.json();
        if (!url) {
            return new Response(JSON.stringify({ error: "URL is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const fileId = extractFileIdFromUrl(url);
        if (!fileId) {
            return new Response(JSON.stringify({ error: "Invalid Google Drive URL" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const googleWorkspace = new GoogleWorkspace({
            superdev: {
                baseUrl: Deno.env.get("SUPERDEV_BASE_URL"),
                appId: Deno.env.get("SUPERDEV_APP_ID"),
            },
        });

        const content = await googleWorkspace.getDriveFileContent(fileId);

        return new Response(JSON.stringify({ content }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error processing drive link:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
