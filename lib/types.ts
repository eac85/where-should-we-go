export type Category =
  | "restaurant"
  | "bar"
  | "date_spot"
  | "outdoor"
  | "cultural";

export interface Place {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: Category;
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

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "restaurant", label: "Restaurants" },
  { value: "bar", label: "Bars" },
  { value: "date_spot", label: "Date Spots" },
  { value: "outdoor", label: "Outdoors" },
  { value: "cultural", label: "Cultural" },
];

export const NEIGHBORHOODS = [
  "Bella Vista",
  "Brewerytown",
  "Center City",
  "Chestnut Hill",
  "Chinatown",
  "East Passyunk",
  "Fairmount",
  "Fishtown",
  "Germantown",
  "Graduate Hospital",
  "Kensington",
  "Manayunk",
  "Mt. Airy",
  "Northern Liberties",
  "Old City",
  "Point Breeze",
  "Queen Village",
  "Rittenhouse",
  "Roxborough",
  "Society Hill",
  "South Philly",
  "Spring Garden",
  "University City",
  "West Philly",
];

export const VIBES = [
  "romantic",
  "chill",
  "lively",
  "artsy",
  "trendy",
  "cozy",
  "family-friendly",
  "upscale",
  "casual",
  "historic",
];
