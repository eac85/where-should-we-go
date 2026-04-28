import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const isLocal = process.env.NODE_ENV === "development";

interface PlaceInput {
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  neighborhood: string;
  price_level: number;
  vibe: string[];
  address: string;
  image_url?: string;
  website_url: string;
  instagram: string;
  google_maps_url: string;
  tags: string[];
}

async function githubRequest(endpoint: string, options: RequestInit = {}) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) throw new Error("GITHUB_TOKEN and GITHUB_REPO must be set");

  const res = await fetch(`https://api.github.com/repos/${repo}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${res.status}: ${body}`);
  }
  return res.json();
}

async function submitViaGitHub(newPlace: PlaceInput) {
  const filePath = "data/places.json";
  const branchName = `suggest/${newPlace.slug}-${Date.now()}`;

  const { object: { sha: baseSha } } = await githubRequest("/git/ref/heads/main");

  await githubRequest("/git/refs", {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: baseSha }),
  });

  const { content: encodedContent, sha: fileSha } = await githubRequest(
    `/contents/${filePath}?ref=main`
  );

  const existing = JSON.parse(
    Buffer.from(encodedContent, "base64").toString("utf-8")
  );

  const placeWithId = {
    ...newPlace,
    id: String(existing.length + 1),
    image_url: newPlace.image_url || "",
    featured: false,
  };
  existing.push(placeWithId);

  const updatedContent = Buffer.from(
    JSON.stringify(existing, null, 2) + "\n"
  ).toString("base64");

  await githubRequest(`/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Add place: ${placeWithId.name}`,
      content: updatedContent,
      sha: fileSha,
      branch: branchName,
    }),
  });

  const { html_url: prUrl } = await githubRequest("/pulls", {
    method: "POST",
    body: JSON.stringify({
      title: `Add place: ${placeWithId.name}`,
      head: branchName,
      base: "main",
      body: `Suggested via the site.\n\n**${placeWithId.name}** — ${placeWithId.subcategory} in ${placeWithId.neighborhood}\n\n> ${placeWithId.description}`,
    }),
  });

  return { place: placeWithId, prUrl };
}

function submitLocally(place: PlaceInput) {
  const filePath = path.join(process.cwd(), "data", "places.json");
  const existing = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const newPlace = {
    ...place,
    id: String(existing.length + 1),
    image_url: place.image_url || "",
    featured: false,
  };

  existing.push(newPlace);
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2) + "\n");

  return { place: newPlace };
}

export async function POST(request: NextRequest) {
  try {
    const place = await request.json();

    if (isLocal) {
      const result = submitLocally(place);
      return NextResponse.json({ success: true, ...result });
    }

    const result = await submitViaGitHub(place);
    return NextResponse.json({ success: true, ...result });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
