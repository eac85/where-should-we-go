/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import SuggestModal from "./components/SuggestModal";

const PLACES = require("@/data/places.json");
const CATEGORIES = [
  { key: "restaurant", label: "RESTAURANTS" },
  { key: "bar", label: "BARS" },
  { key: "date_spot", label: "DATE SPOTS" },
  { key: "outdoor", label: "OUTDOOR" },
  { key: "cultural", label: "CULTURAL" },
];

const NEIGHBORHOODS: string[] = [...new Set((PLACES as Place[]).map((p) => p.neighborhood))];

const PRICE_LEVELS = [
  { value: 1, label: "$" },
  { value: 2, label: "$$" },
  { value: 3, label: "$$$" },
  { value: 4, label: "$$$$" },
];

const MapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);


const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);


interface Place {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  neighborhood: string;
  price_level: number;
  vibe: string[];
  address: string;
  image_url: string;
  website_url: string;
  instagram: string;
  google_maps_url: string;
  tags: string[];
  featured: boolean;
}

const MUTED_COLORS = [
  // Row 1
     "#D12400",
      "#801B08",
        "#C46647",  
        "#E7B34E",
        "#E6D5C1",
        "#E6D5C1",
        "#012480",
        "#001B88",
        "#4C6671",
        "#67B3AE",  
        "#CDCDCD",
        "#F3EDE6",  
        "#1F2E2B",
        "#365840",
        "#749267",
        "#8A8A8A",
        "#4F4F4F",
        "#000000",
]

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function PlaceCard({ place, index }: {
  place: Place;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const bgColor = place.image_url
    ? "var(--color-muted)"
    : MUTED_COLORS[hashId(place.id) % MUTED_COLORS.length];

  return (
    <div
      style={{
        animation: `fadeUp 0.4s ease both`,
        animationDelay: `${index * 60}ms`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 1",
          overflow: "hidden",
          cursor: "pointer",
          backgroundColor: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {place.image_url && (
          <img
            src={place.image_url}
            alt={place.name}
            onLoad={() => setImgLoaded(true)}
            style={{
              maxWidth: "40%",
              maxHeight: "40%",
              objectFit: "contain",
              display: "block",
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease",
              transform: hovered ? "scale(1.1)" : "scale(1)",
              opacity: imgLoaded ? 1 : 0,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            padding: 12,
            gap: 6,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        >
          {place.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 10,
                fontFamily: "var(--font-body)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-cream)",
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: 2,
                padding: "3px 7px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "var(--color-cream)",
            borderRadius: 2,
            padding: "3px 8px",
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "var(--font-body)",
            color: "var(--color-ink)",
          }}
        >
          {"$".repeat(place.price_level)}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div
          className="place-sub"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 11,
            letterSpacing: "0.12em",
            color: "var(--color-ink)",
            opacity: 0.55,
            textTransform: "uppercase",
            marginBottom: 3,
          }}
        >
          {place.subcategory}
        </div>
        <div
          className="place-name"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.02em",
            color: "var(--color-ink)",
            lineHeight: 1.3,
          }}
        >
          {place.name}
        </div>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--color-ink)",
            opacity: 0.45,
            marginTop: 2,
            letterSpacing: "0.04em",
          }}
        >
          {place.neighborhood}
        </div>
      </div>

      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 0 }}>
        {place.google_maps_url && (
          <ActionRow icon={<MapIcon />} label="MAP" value={place.neighborhood} accent href={place.google_maps_url} />
        )}
        {place.website_url && (
          <ActionRow icon={<LinkIcon />} label="WEBSITE" href={place.website_url} />
        )}
      </div>
    </div>
  );
}

function ActionRow({ icon, label, value, accent, onClick, highlight, href }: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  accent?: boolean;
  onClick?: () => void;
  highlight?: boolean;
  href?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const style: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 0",
    borderTop: "1px solid var(--color-rule)",
    cursor: onClick || href ? "pointer" : "default",
    fontFamily: "var(--font-heading)",
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: highlight ? "var(--color-accent)" : "var(--color-ink)",
    opacity: hovered && (onClick || href) ? 1 : highlight ? 1 : 0.7,
    transition: "opacity 0.2s ease, color 0.2s ease",
    textDecoration: "none",
  };
  const content = (
    <>
      <span style={{ display: "flex", alignItems: "center", color: accent ? "var(--color-accent)" : "inherit" }}>
        {icon}
      </span>
      <span>{label}</span>
      {value && (
        <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.5, letterSpacing: "0.06em" }}>
          {value}
        </span>
      )}
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={style}
      >
        {content}
      </a>
    );
  }
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={style}
    >
      {content}
    </div>
  );
}

function FilterPill({ label, active, onClick }: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-heading)",
        fontSize: 11,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        padding: "8px 16px",
        border: active ? "2px solid var(--color-ink)" : "1px solid var(--color-rule)",
        borderRadius: 0,
        background: active ? "var(--color-ink)" : "transparent",
        color: active ? "var(--color-cream)" : "var(--color-ink)",
        cursor: "pointer",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function toggleSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  next.has(value) ? next.delete(value) : next.add(value);
  return next;
}

export default function Home() {
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [neighborhoods, setNeighborhoods] = useState<Set<string>>(new Set());
  const [prices, setPrices] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);

  useEffect(() => setMounted(true), []);

  const hasFilters = categories.size > 0 || neighborhoods.size > 0 || prices.size > 0;

  const filtered = PLACES.filter((p: Place) => {
    if (categories.size > 0 && !categories.has(p.category)) return false;
    if (neighborhoods.size > 0 && !neighborhoods.has(p.neighborhood)) return false;
    if (prices.size > 0 && !prices.has(p.price_level)) return false;
    return true;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=Oswald:wght@400;500;600;700&display=swap');

        :root {
          --color-cream: #F5F0E8;
          --color-ink: #1A1A1A;
          --color-accent: #D94F3B;
          --color-muted: #E8E2D8;
          --color-rule: rgba(26, 26, 26, 0.12);
          --font-heading: 'Oswald', sans-serif;
          --font-body: 'DM Sans', sans-serif;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body, html {
          background: var(--color-cream);
          color: var(--color-ink);
          -webkit-font-smoothing: antialiased;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        ::selection {
          background: var(--color-accent);
          color: var(--color-cream);
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px 28px;
        }

        @media (max-width: 1000px) {
          .grid-container { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 700px) {
          .grid-container { grid-template-columns: repeat(2, 1fr); gap: 28px 16px; }
          .place-name { font-size: 18px !important; }
          .place-sub { font-size: 9px !important; }
        }
        @media (max-width: 440px) {
          .grid-container { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-cream)",
          padding: "0 clamp(16px, 4vw, 48px)",
        }}
      >
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 0",
            borderBottom: "1px solid var(--color-rule)",
            animation: mounted ? "slideDown 0.5s ease both" : "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(14px, 2vw, 18px)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Where Should We Go
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                opacity: 0.4,
                letterSpacing: "0.04em",
              }}
            >
              PHL
            </span>
          </div>
          <button
            onClick={() => setShowSuggest(true)}
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              background: "none",
              border: "1px solid var(--color-rule)",
              color: "var(--color-ink)",
              padding: "8px 16px",
              transition: "all 0.2s ease",
            }}
          >
            + SUGGEST A PLACE
          </button>
        </header>

        {/* Hero tagline */}
        <div
          style={{
            padding: "48px 0 36px",
            maxWidth: 560,
            animation: mounted ? "fadeUp 0.6s ease 0.1s both" : "none",
          }}
        >
        
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            paddingBottom: 32,
            borderBottom: "1px solid var(--color-rule)",
            animation: mounted ? "fadeUp 0.6s ease 0.2s both" : "none",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            {CATEGORIES.map((c) => (
              <FilterPill
                key={c.key}
                label={c.label}
                active={categories.has(c.key)}
                onClick={() => setCategories((prev) => toggleSet(prev, c.key))}
              />
            ))}
            <div style={{ width: 1, height: 24, background: "var(--color-rule)", margin: "0 4px" }} />
            {PRICE_LEVELS.map((p) => (
              <FilterPill
                key={p.value}
                label={p.label}
                active={prices.has(p.value)}
                onClick={() => setPrices((prev) => toggleSet(prev, p.value))}
              />
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
            {NEIGHBORHOODS.map((n: string) => (
              <FilterPill
                key={n}
                label={n}
                active={neighborhoods.has(n)}
                onClick={() => setNeighborhoods((prev) => toggleSet(prev, n))}
              />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, opacity: 0.4 }}>
              {filtered.length} place{filtered.length !== 1 ? "s" : ""}
            </span>
            {hasFilters && (
              <button
                onClick={() => { setCategories(new Set()); setNeighborhoods(new Set()); setPrices(new Set()); }}
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: "none",
                  border: "none",
                  color: "var(--color-accent)",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                CLEAR ALL
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <div style={{ padding: "36px 0 64px" }}>
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                fontFamily: "var(--font-heading)",
                fontSize: 16,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                opacity: 0.35,
              }}
            >
              No spots match your filters — try broadening your search
            </div>
          ) : (
            <div className="grid-container">
              {filtered.map((place: Place, i: number) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid var(--color-rule)",
            padding: "24px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "var(--font-body)",
            fontSize: 11,
            opacity: 0.4,
            letterSpacing: "0.04em",
          }}
        >
          <span>WHERE SHOULD WE GO PHL</span>
          <span>A PHILLY THING</span>
        </footer>
      </div>
      {showSuggest && <SuggestModal onClose={() => setShowSuggest(false)} />}
    </>
  );
}
