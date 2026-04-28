import type { Place } from "@/lib/types";
import PlaceCard from "./PlaceCard";

export default function PlaceGrid({ places }: { places: Place[] }) {
  if (places.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-400 text-lg">No places found</p>
        <p className="text-zinc-300 text-sm mt-1">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}
