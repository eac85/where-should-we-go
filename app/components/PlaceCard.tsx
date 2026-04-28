import Link from "next/link";
import type { Place } from "@/lib/types";

const categoryColors: Record<string, string> = {
  restaurant: "bg-orange-100 text-orange-700",
  bar: "bg-purple-100 text-purple-700",
  date_spot: "bg-pink-100 text-pink-700",
  outdoor: "bg-green-100 text-green-700",
  cultural: "bg-blue-100 text-blue-700",
};

const categoryLabels: Record<string, string> = {
  restaurant: "Restaurant",
  bar: "Bar",
  date_spot: "Date Spot",
  outdoor: "Outdoors",
  cultural: "Cultural",
};

function PriceDots({ level }: { level: number }) {
  return (
    <span className="text-sm text-zinc-400">
      {"$".repeat(level)}
      <span className="text-zinc-200">{"$".repeat(4 - level)}</span>
    </span>
  );
}

export default function PlaceCard({ place }: { place: Place }) {
  return (
    <Link href={`/places/${place.slug}`} className="group block">
      <div className="rounded-xl border border-zinc-100 bg-white p-5 transition hover:border-zinc-200 hover:shadow-sm h-full flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[place.category] ?? "bg-zinc-100 text-zinc-600"}`}
          >
            {categoryLabels[place.category] ?? place.category}
          </span>
          <PriceDots level={place.price_level} />
        </div>

        <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-zinc-700 transition">
          {place.name}
        </h3>
        <p className="text-sm text-zinc-500 mt-0.5 mb-2">
          {place.subcategory} &middot; {place.neighborhood}
        </p>

        <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3 flex-1">
          {place.description}
        </p>

        {place.vibe.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-zinc-50">
            {place.vibe.map((v) => (
              <span
                key={v}
                className="rounded-full bg-zinc-50 px-2 py-0.5 text-xs text-zinc-500"
              >
                {v}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
