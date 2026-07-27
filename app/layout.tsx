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
    default: "FSB Fire Protection | Fire Protection Experts",
    template: "%s | FSB Fire Protection",
  },
  description:
    "FSB Fire Protection - over 30 years of experience in fire protection. Construction, cost optimization, training, and laboratory testing.",
  keywords: [
    "fire protection",
    "fire sealing",
    "fire coating",
    "fire boards",
    "FSB",
    "Europe",
    "Brandschutz",
  ],
  authors: [{ name: "FSB Fire Protection" }],
  creator: "FSB Fire Protection",
  metadataBase: new URL("https://fsb-fire-protection.com"),
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
