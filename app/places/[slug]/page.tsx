import Link from "next/link";
import { notFound } from "next/navigation";
import places from "@/data/places.json";
import type { Place } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  restaurant: "Restaurant",
  bar: "Bar",
  date_spot: "Date Spot",
  outdoor: "Outdoors",
  cultural: "Cultural",
  dog_friendly: "Dog Friendly",
};

export function generateStaticParams() {
  return (places as Place[]).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = (places as Place[]).find((p) => p.slug === slug);
  if (!place) return { title: "Not Found" };
  return {
    title: `${place.name} — Where Should We Go PHL`,
    description: place.description,
  };
}

export default async function PlaceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const place = (places as Place[]).find((p) => p.slug === slug);
  if (!place) notFound();

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="text-sm text-zinc-400 hover:text-zinc-600 transition mb-6 inline-block"
        >
          &larr; Back to all places
        </Link>

        <div className="bg-white rounded-xl border border-zinc-100 p-6 mt-2">
          <div className="flex items-center gap-3 mb-4">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              {categoryLabels[place.category] ?? place.category}
            </span>
            <span className="text-sm text-zinc-400">
              {place.subcategory}
            </span>
            <span className="text-sm text-zinc-300">
              {"$".repeat(place.price_level)}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-zinc-900">{place.name}</h1>
          <p className="text-zinc-500 mt-1">{place.neighborhood}</p>

          <p className="text-zinc-700 leading-relaxed mt-4">
            {place.description}
          </p>

          {place.vibe.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {place.vibe.map((v) => (
                <span
                  key={v}
                  className="rounded-full bg-zinc-50 border border-zinc-100 px-3 py-1 text-sm text-zinc-500"
                >
                  {v}
                </span>
              ))}
            </div>
          )}

          {place.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {place.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-zinc-50 px-3 py-1 text-xs text-zinc-400"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <hr className="my-6 border-zinc-100" />

          <div className="space-y-2 text-sm">
            <p className="text-zinc-600">
              <span className="font-medium text-zinc-700">Address:</span>{" "}
              {place.address}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              {place.google_maps_url && (
                <a
                  href={place.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-700 underline underline-offset-2 transition"
                >
                  Google Maps
                </a>
              )}
              {place.website_url && (
                <a
                  href={place.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-700 underline underline-offset-2 transition"
                >
                  Website11
                </a>
              )}
              {place.instagram && (
                <a
                  href={`https://instagram.com/${place.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-zinc-700 underline underline-offset-2 transition"
                >
                  @{place.instagram}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
