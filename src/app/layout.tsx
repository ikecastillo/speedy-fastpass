import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./animations.css";

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
  other: {
    // iOS Safari status bar color matching the blue sky in your facility image
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    // Additional mobile browser theming
    'msapplication-navbutton-color': '#3b5ea8',
    'msapplication-TileColor': '#3b5ea8',
  },
};

export const viewport: Viewport = {
  themeColor: '#3b5ea8',
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
        
        {/* Modern 2025 Bottom Fade Effect */}
        <div 
          className="fixed bottom-0 left-0 right-0 h-12 pointer-events-none z-50"
          style={{
            background: `linear-gradient(
              to top,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 255, 255, 0.7) 25%,
              rgba(255, 255, 255, 0.4) 50%,
              rgba(255, 255, 255, 0.2) 75%,
              transparent 100%
            )`,
            backdropFilter: 'blur(1px)',
            WebkitBackdropFilter: 'blur(1px)',
          }}
        />
        
        {/* Subtle animated gradient accent */}
        <div 
          className="fixed bottom-0 left-0 right-0 h-1 pointer-events-none z-50 animate-shimmer"
          style={{
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(20, 99, 180, 0.2) 20%,
              rgba(20, 99, 180, 0.4) 40%,
              rgba(20, 99, 180, 0.6) 50%,
              rgba(20, 99, 180, 0.4) 60%,
              rgba(20, 99, 180, 0.2) 80%,
              transparent 100%
            )`,
          }}
        />
      </body>
    </html>
  );
}
