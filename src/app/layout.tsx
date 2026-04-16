// src/app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.options";
import SessionProvider from "@/components/auth/SessionProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lat Shop — African Gifts & Jewellery",
    template: "%s | Lat Shop",
  },
  description:
    "Discover handcrafted African gifts, jewelry, and accessories. Shipped from Calgary, Canada to the US, Canada, and Europe.",
  keywords: ["African gifts", "African jewelry", "African accessories", "Calgary", "handcrafted"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Lat Shop",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${playfair.variable} ${lora.variable}`}>
      <body>
        <SessionProvider session={session}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "system-ui, sans-serif",
                fontSize: "14px",
                background: "#1a1209",
                color: "#fdf8f0",
                border: "1px solid #3d2b14",
              },
              success: {
                iconTheme: { primary: "#d4832a", secondary: "#fdf8f0" },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
