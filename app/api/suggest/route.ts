import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

async function callClaude(
  apiKey: string,
  messages: { role: string; content: string }[],
  options: { tools?: unknown[]; model?: string; max_tokens?: number } = {}
) {
  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: options.model ?? "claude-sonnet-4-20250514",
      max_tokens: options.max_tokens ?? 4096,
      messages,
      ...(options.tools ? { tools: options.tools } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude API ${res.status}: ${body}`);
  }

  return res.json();
}

function extractText(response: { content: { type: string; text?: string }[] }): string {
  return response.content
    .filter((b) => b.type === "text" && b.text)
    .map((b) => b.text)
    .join("\n");
}

export async function POST(request: NextRequest) {
  const { name } = await request.json();
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!name) {
    return NextResponse.json({ error: "Place name is required" }, { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json({ error: "CLAUDE_API_KEY not configured" }, { status: 500 });
  }

  try {
    // --- Call 1: Search only ---
    const searchPrompt = `Search the web for "${name}" in Philadelphia, PA.

Find and report:
- The official name of the place
- Street address
- Official website URL
- Instagram handle
- What type of place it is (restaurant, bar, park, museum, etc.)
- Neighborhood in Philadelphia
- Price range
- What people say about it (reviews, descriptions, vibe)
- Any notable features (outdoor seating, BYOB, dog friendly, etc.)
- Hours if available

Report everything you find. Be thorough. Include exact URLs and handles — do not guess.`;

    const searchResponse = await callClaude(
      apiKey,
      [{ role: "user", content: searchPrompt }],
      {
        tools: [
          {
            type: "web_search_20250305",
            name: "web_search",
            max_uses: 5,
          },
        ],
      }
    );

    const searchFindings = extractText(searchResponse);

    // --- Call 2: Structure only (no tools) ---
    const structurePrompt = `Below are real search findings about a place in Philadelphia. Extract the information into JSON using ONLY what's provided below. Do NOT guess or fabricate any details.

RULES:
- Use empty string "" for any field not found in the search findings
- An empty string is ALWAYS better than a guess
- For google_maps_url: construct as https://www.google.com/maps/search/?api=1&query=ENCODED+ADDRESS if an address was found, otherwise empty string
- For description: write 2-3 opinionated sentences like a friend recommending it, based on what the findings say
- For vibe/tags: infer from the findings content only

Return ONLY valid JSON (no markdown, no code fences, no explanation):
{
  "name": "string (official name from findings)",
  "slug": "string (lowercase, hyphens, url-friendly)",
  "description": "string (2-3 sentences, opinionated and helpful)",
  "category": "restaurant | bar | date_spot | outdoor | cultural",
  "subcategory": "string (e.g. 'Israeli', 'Dive Bar', 'Museum', 'Trail', 'BYOB')",
  "neighborhood": "string (Philly neighborhood from findings, or empty)",
  "price_level": "number 1-4 (1=$ 4=$$$$), or 0 if unknown",
  "vibe": ["array from: romantic, chill, lively, artsy, trendy, cozy, upscale, casual, historic"],
  "address": "string (exact address from findings, or empty)",
  "website_url": "string (exact URL from findings, or empty)",
  "instagram": "string (handle without @, from findings, or empty)",
  "google_maps_url": "string (constructed from address, or empty)",
  "tags": ["array of relevant tags"]
}

--- SEARCH FINDINGS ---
${searchFindings}`;

    const structureResponse = await callClaude(
      apiKey,
      [{ role: "user", content: structurePrompt }],
      { max_tokens: 1024 }
    );

    const jsonText = extractText(structureResponse);
    const place = JSON.parse(jsonText);

    return NextResponse.json(place);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
