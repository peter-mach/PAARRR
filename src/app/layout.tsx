import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteName = "PAARRR";
const siteDescription =
  "Pull-request Automated Analysis, Reporting, & Review Rig — AI-driven scoring for any GitHub repo across Impact, AI-Leverage, and Quality.";

export const metadata: Metadata = {
  title: {
    default: `${siteName} — AI pull request quality scorer`,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "pull request review",
    "AI code review",
    "GitHub PR quality",
    "code quality score",
    "AI-leverage",
  ],
  authors: [{ name: "PAARRR" }],
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} — AI pull request quality scorer`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — AI pull request quality scorer`,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfcf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1830" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
