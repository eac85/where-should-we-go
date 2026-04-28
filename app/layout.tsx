import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Where Should We Go? — Philadelphia",
  description:
    "Curated restaurants, bars, date spots, outdoor escapes, and cultural gems across Philadelphia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
