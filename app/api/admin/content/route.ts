import { NextResponse } from "next/server";
import { authorizedToken, github, sameOrigin } from "../../../../lib/admin";
import { validateContent } from "../../../../lib/content";
const file = "/repos/jamescahours/Portfolio/contents/content/site.json";
const json = (value: object, status = 200) =>
  NextResponse.json(value, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
export async function GET() {
  try {
    const token = await authorizedToken();
    if (!token) return json({ error: "Please sign in again." }, 401);
    const result = await github(token, `${file}?ref=main`);
    if (!result.ok)
      return json(
        { error: "Could not load content from GitHub. Try again." },
        502,
      );
    const data = await result.json();
    return json({
      content: JSON.parse(Buffer.from(data.content, "base64").toString("utf8")),
      sha: data.sha,
    });
  } catch {
    return json({ error: "Could not load content. Try again." }, 502);
  }
}
export async function PUT(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Forbidden" }, 403);
  try {
    const token = await authorizedToken();
    if (!token) return json({ error: "Please sign in again." }, 401);
    const text = await request.text();
    if (Buffer.byteLength(text) > 200000)
      return json({ error: "Content is too large." }, 413);
    let data, content;
    try {
      data = JSON.parse(text);
      content = validateContent(data.content);
      if (typeof data.sha !== "string" || !/^[a-f0-9]{40}$/.test(data.sha))
        throw new Error("Reload the latest content before publishing.");
    } catch (error) {
      return json(
        { error: error instanceof Error ? error.message : "Invalid content." },
        400,
      );
    }
    const result = await github(token, file, {
      method: "PUT",
      body: JSON.stringify({
        message: "Update portfolio content from admin",
        branch: "main",
        sha: data.sha,
        content: Buffer.from(JSON.stringify(content, null, 2) + "\n").toString(
          "base64",
        ),
      }),
    });
    if (result.status === 409 || result.status === 422)
      return json(
        {
          error:
            "Content changed elsewhere or GitHub rejected the update. Copy your edits, then reload before retrying.",
        },
        409,
      );
    if (!result.ok)
      return json(
        {
          error:
            "GitHub could not save your changes. Check repository permissions and try again.",
        },
        502,
      );
    const saved = await result.json();
    return json({ sha: saved.content.sha, commitUrl: saved.commit.html_url });
  } catch {
    return json(
      {
        error:
          "Publishing could not be confirmed. Reload to check whether GitHub saved your changes before retrying.",
      },
      502,
    );
  }
}
