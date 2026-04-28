"use client";

import { CATEGORIES, NEIGHBORHOODS, VIBES } from "@/lib/types";

interface FilterBarProps {
  filters: {
    category: string;
    neighborhood: string;
    price: string;
    vibe: string;
    q: string;
  };
  onChange: (key: string, value: string) => void;
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange("category", "")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            filters.category === ""
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() =>
              onChange(
                "category",
                filters.category === cat.value ? "" : cat.value
              )
            }
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filters.category === cat.value
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search places..."
          value={filters.q}
          onChange={(e) => onChange("q", e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm outline-none focus:border-zinc-400 w-48"
        />

        <select
          value={filters.neighborhood}
          onChange={(e) => onChange("neighborhood", e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm outline-none focus:border-zinc-400"
        >
          <option value="">All Neighborhoods</option>
          {NEIGHBORHOODS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <select
          value={filters.price}
          onChange={(e) => onChange("price", e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm outline-none focus:border-zinc-400"
        >
          <option value="">Any Price</option>
          <option value="1">$</option>
          <option value="2">$$</option>
          <option value="3">$$$</option>
          <option value="4">$$$$</option>
        </select>

        <select
          value={filters.vibe}
          onChange={(e) => onChange("vibe", e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm outline-none focus:border-zinc-400"
        >
          <option value="">Any Vibe</option>
          {VIBES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        {(filters.category ||
          filters.neighborhood ||
          filters.price ||
          filters.vibe ||
          filters.q) && (
          <button
            onClick={() => {
              onChange("category", "");
              onChange("neighborhood", "");
              onChange("price", "");
              onChange("vibe", "");
              onChange("q", "");
            }}
            className="text-sm text-zinc-400 hover:text-zinc-600 transition"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
