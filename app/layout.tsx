import { Inter, Sora } from "next/font/google";
import "./globals.css";

import AuthProvider from "@/components/providers/AuthProvider";

import { Toaster } from "sonner";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata = {
  title: "BuilderOS — The Operating System for Product Builders",
  description: "Turn ideas into products faster with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} dark`}
    >
      <body className="font-sans antialiased">

        <AuthProvider>
          {children}
        </AuthProvider>

        <Toaster
          richColors
          position="top-right"
        />

        <Analytics />
        <SpeedInsights />

      </body>
    </html>
  );
}