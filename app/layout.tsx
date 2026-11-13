import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// K1 "Engineering precision" signature typography — site-wide.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FSB d.o.o. | Passive fire protection experts",
    template: "%s | FSB d.o.o.",
  },
  description:
    "FSB d.o.o. - passive fire protection contractor with 20 years of experience. Works execution, consulting and cost optimization, and FSB Academy.",
  keywords: [
    "fire protection",
    "passive fire protection",
    "firestopping",
    "fire doors",
    "fire protection cladding",
    "FSB",
    "Europe",
    "Brandschutz",
    "Abschottung",
  ],
  authors: [{ name: "FSB d.o.o." }],
  creator: "FSB d.o.o.",
  metadataBase: new URL("https://www.firestopping.eu"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${archivo.variable} ${plexMono.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
