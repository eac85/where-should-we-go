import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { name } = await request.json();
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!name) {
    return NextResponse.json(
      { error: "Place name is required" },
      { status: 400 }
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "CLAUDE_API_KEY not configured in .env.local" },
      { status: 500 }
    );
  }

  const prompt = `You are a Philadelphia local guide. Given the name of a place in or near Philadelphia, return a JSON object with info about it. If you're not sure about a field, make your best guess or leave it empty.

Return ONLY valid JSON (no markdown, no explanation) matching this exact schema:
{
  "name": "string",
  "slug": "string (lowercase, hyphens, url-friendly)",
  "description": "string (2-3 sentences, opinionated and helpful, like a friend recommending it)",
  "category": "restaurant | bar | date_spot | outdoor | cultural",
  "subcategory": "string (e.g. 'Israeli', 'Dive Bar', 'Museum', 'Trail', 'BYOB')",
  "neighborhood": "string (Philly neighborhood)",
  "price_level": "number 1-4 (1=$ cheap, 4=$$$$ expensive)",
  "vibe": ["array of vibes like 'romantic', 'chill', 'lively', 'artsy', 'trendy', 'cozy', 'upscale', 'casual', 'historic'"],
  "address": "string (full address)",
  "website_url": "string (url or empty)",
  "instagram": "string (handle without @, or empty)",
  "google_maps_url": "string (google maps search url)",
  "tags": ["array of tags like 'outdoor seating', 'BYOB', 'dog friendly', 'date night', 'free', 'reservations required'"]
}

The place is: ${name}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: `Claude API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.content[0].text;
    const place = JSON.parse(text);

    return NextResponse.json(place);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
