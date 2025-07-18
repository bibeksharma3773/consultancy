// This is the standard root layout for a Next.js App Router project.
// The key fix is adding `suppressHydrationWarning` to the <html> tag
// to prevent errors caused by browser extensions modifying the HTML.

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Updated metadata to match the application
export const metadata: Metadata = {
  title: "ApplyBoard - Study Abroad Simplified",
  description: "Find and apply to educational programs around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The key fix is adding suppressHydrationWarning here
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
