import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
