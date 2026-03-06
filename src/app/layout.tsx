import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KK Hair Styling — מחשבון פורמולות צבע",
  description:
    "מחשבון פורמולות צבע שיער מקצועי של לוריאל. חישוב פורמולת שורשים ואורכים, ניהול היסטוריית לקוחות.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hair Formula",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#18181b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="KK Hair" />
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
          href="/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
          href="/apple-touch-icon.png"
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-zinc-50 text-zinc-900`}
      >
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
