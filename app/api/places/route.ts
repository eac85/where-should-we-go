import { NextRequest, NextResponse } from "next/server";
import places from "@/data/places.json";
import type { Place } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  let filtered: Place[] = places as Place[];

  const category = searchParams.get("category");
  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  const neighborhood = searchParams.get("neighborhood");
  if (neighborhood) {
    filtered = filtered.filter((p) => p.neighborhood === neighborhood);
  }

  const price = searchParams.get("price");
  if (price) {
    const levels = price.split(",").map(Number);
    filtered = filtered.filter((p) => levels.includes(p.price_level));
  }

  const vibe = searchParams.get("vibe");
  if (vibe) {
    filtered = filtered.filter((p) => p.vibe.includes(vibe));
  }

  const q = searchParams.get("q");
  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query)) ||
        p.subcategory.toLowerCase().includes(query)
    );
  }

  const sort = searchParams.get("sort");
  if (sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "price") {
    filtered.sort((a, b) => a.price_level - b.price_level);
  }

  return NextResponse.json(filtered);
}
