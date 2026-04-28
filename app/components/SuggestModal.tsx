"use client";

import { useState, useEffect } from "react";

const LOADING_PHRASES = [
  "Scouting the neighborhood...",
  "Checking the vibe...",
  "Asking the locals...",
  "Reading the reviews...",
  "Finding the best seat in the house...",
  "Peeking at the menu...",
  "Tracking down the hours...",
  "Looking for parking nearby...",
  "Checking if they take reservations...",
  "Seeing what the regulars say...",
  "Scrolling through the Instagram...",
  "Getting the inside scoop...",
  "Mapping the route...",
  "Sniffing out the details...",
  "Almost there...",
];

interface PlaceData {
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  neighborhood: string;
  price_level: number;
  vibe: string[];
  address: string;
  website_url: string;
  instagram: string;
  google_maps_url: string;
  tags: string[];
}

const CATEGORY_OPTIONS = ["restaurant", "bar", "date_spot", "outdoor", "cultural"];

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 13,
  padding: "8px 10px",
  border: "1px solid var(--color-rule)",
  background: "var(--color-cream)",
  color: "var(--color-ink)",
  width: "100%",
  borderRadius: 0,
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: 10,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--color-ink)",
  opacity: 0.6,
  marginBottom: 4,
  display: "block",
};

export default function SuggestModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"input" | "loading" | "edit" | "submitted">("input");
  const [placeName, setPlaceName] = useState("");
  const [error, setError] = useState("");
  const [place, setPlace] = useState<PlaceData | null>(null);
  const [prUrl, setPrUrl] = useState<string | null>(null);

  const handleLookup = async () => {
    if (!placeName.trim()) {
      setError("Please enter a place name.");
      return;
    }
    setError("");
    setStep("loading");

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: placeName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setStep("input");
        return;
      }
      setPlace(data);
      setStep("edit");
    } catch {
      setError("Failed to reach the API");
      setStep("input");
    }
  };

  const handleSubmit = async () => {
    if (!place) return;
    setStep("loading");
    try {
      const res = await fetch("/api/places/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(place),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save");
        setStep("edit");
        return;
      }
      if (data.prUrl) setPrUrl(data.prUrl);
      setStep("submitted");
    } catch {
      setError("Failed to save");
      setStep("edit");
    }
  };

  const updateField = (key: keyof PlaceData, value: string | number | string[]) => {
    if (!place) return;
    setPlace({ ...place, [key]: value });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26, 26, 26, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-cream)",
          border: "1px solid var(--color-rule)",
          width: "100%",
          maxWidth: 520,
          maxHeight: "85vh",
          overflowY: "auto",
          padding: 32,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span style={{
            fontFamily: "var(--font-heading)",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            Suggest a Place
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontFamily: "var(--font-heading)",
              fontSize: 18,
              cursor: "pointer",
              color: "var(--color-ink)",
              opacity: 0.4,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Step: Input */}
        {step === "input" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Place Name</label>
              <input
                type="text"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
                placeholder="e.g. Suraya, Bok Bar, Wissahickon Trail..."
                style={inputStyle}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              />
            </div>
            {error && (
              <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-accent)" }}>
                {error}
              </span>
            )}
            <button onClick={handleLookup} style={buttonStyle}>
              LOOK UP
            </button>
          </div>
        )}

        {/* Step: Loading */}
        {step === "loading" && (
          <LoadingState placeName={placeName} />
        )}

        {/* Step: Edit */}
        {step === "edit" && place && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle} value={place.name} onChange={(e) => updateField("name", e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
                value={place.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Category</label>
                <select
                  style={inputStyle}
                  value={place.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Subcategory</label>
                <input style={inputStyle} value={place.subcategory} onChange={(e) => updateField("subcategory", e.target.value)} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Neighborhood</label>
                <input style={inputStyle} value={place.neighborhood} onChange={(e) => updateField("neighborhood", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Price Level (1-4)</label>
                <input
                  style={inputStyle}
                  type="number"
                  min={1}
                  max={4}
                  value={place.price_level}
                  onChange={(e) => updateField("price_level", Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Address</label>
              <input style={inputStyle} value={place.address} onChange={(e) => updateField("address", e.target.value)} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Website</label>
                <input style={inputStyle} value={place.website_url} onChange={(e) => updateField("website_url", e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Instagram</label>
                <input style={inputStyle} value={place.instagram} onChange={(e) => updateField("instagram", e.target.value)} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Vibes (comma-separated)</label>
              <input
                style={inputStyle}
                value={place.vibe.join(", ")}
                onChange={(e) => updateField("vibe", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              />
            </div>
            <div>
              <label style={labelStyle}>Tags (comma-separated)</label>
              <input
                style={inputStyle}
                value={place.tags.join(", ")}
                onChange={(e) => updateField("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              />
            </div>
            {error && (
              <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--color-accent)" }}>
                {error}
              </span>
            )}
            <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
              <button onClick={() => setStep("input")} style={{ ...buttonStyle, background: "transparent", color: "var(--color-ink)", border: "1px solid var(--color-rule)", flex: 1 }}>
                BACK
              </button>
              <button onClick={handleSubmit} style={{ ...buttonStyle, flex: 2 }}>
                SUBMIT
              </button>
            </div>
          </div>
        )}

        {/* Step: Submitted */}
        {step === "submitted" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{
              fontFamily: "var(--font-heading)",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}>
              Added!
            </div>
            <div style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              opacity: 0.55,
              marginBottom: 24,
            }}>
              {prUrl
                ? <>{place?.name} has been submitted for review.</>
                : <>{place?.name} has been added. Reload to see it in the grid.</>
              }
            </div>
            {prUrl && (
              <a
                href={prUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  display: "block",
                  marginBottom: 20,
                }}
              >
                View Pull Request →
              </a>
            )}
            <button onClick={onClose} style={buttonStyle}>
              CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState({ placeName }: { placeName: string }) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
        setFade(true);
      }, 600);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "48px 0" }}>
      <div style={{
        fontFamily: "var(--font-heading)",
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        marginBottom: 20,
      }}>
        {placeName}
      </div>
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 13,
          opacity: fade ? 0.55 : 0,
          transition: "opacity 0.3s ease",
          minHeight: 20,
        }}
      >
        {LOADING_PHRASES[index]}
      </div>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  padding: "12px 24px",
  border: "none",
  background: "var(--color-ink)",
  color: "var(--color-cream)",
  cursor: "pointer",
  transition: "opacity 0.2s ease",
  width: "100%",
};
