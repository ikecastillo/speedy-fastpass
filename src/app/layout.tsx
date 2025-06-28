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

export const metadata: Metadata = {
  title: "Speedy FastPass - Unlimited Car Wash Membership",
  description: "Unlimited car-wash membership for Speedy Wash. Choose from Basic, Deluxe, Works, or Works+ plans. Fast, convenient, and affordable car care for your vehicle.",
  metadataBase: new URL("https://speedyfastpass.com"),
  keywords: ["car wash", "unlimited", "membership", "speedy wash", "vehicle care", "auto detailing"],
  authors: [{ name: "Speedy Wash" }],
  openGraph: {
    title: "Speedy FastPass - Unlimited Car Wash Membership",
    description: "Unlimited car-wash membership for Speedy Wash. Fast, convenient, and affordable car care.",
    url: "https://speedyfastpass.com",
    siteName: "Speedy FastPass",
    images: [
      {
        url: "/api/og-image",
        width: 1200,
        height: 630,
        alt: "Speedy FastPass - Unlimited Car Wash Membership",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Speedy FastPass - Unlimited Car Wash Membership",
    description: "Unlimited car-wash membership for Speedy Wash. Fast, convenient, and affordable car care.",
    images: ["/api/og-image"],
  },
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
