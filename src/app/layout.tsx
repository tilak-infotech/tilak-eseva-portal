import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tilak E-Seva Portal — Indian Government Services, Online",
  description:
    "A single gateway to 500+ Indian Government services — Aadhaar, PAN, Passport, Voter ID, Income Tax, GST, pensions, certificates, welfare schemes and more. Apply online, track status, and get assistance from Tilak Infotech.",
  keywords: [
    "Indian government services",
    "e-seva",
    "Aadhaar",
    "PAN card",
    "Passport",
    "Voter ID",
    "Income Tax",
    "GST",
    "Tilak Infotech",
    "online government portal India",
    "PM-KISAN",
    "Ayushman Bharat",
  ],
  authors: [{ name: "Tilak Infotech" }],
  openGraph: {
    title: "Tilak E-Seva Portal — Indian Government Services Online",
    description:
      "500+ Indian Government services in one portal. Apply, track, and get assisted by Tilak Infotech.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#07090E" },
    { media: "(prefers-color-scheme: dark)", color: "#07090E" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plexSans.variable} ${plexMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
