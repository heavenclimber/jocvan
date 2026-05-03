import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants";
import { getDictionary, hasLocale } from "@/app/[lang]/dictionaries";
import { LOCALES } from "@/lib/locales";
import type { Locale } from "@/lib/locales";
import { DictProvider } from "@/lib/DictContext";
import Navbar from "@/components/layout/Navbar";
import { BackgroundProvider } from "@/lib/BackgroundContext";
import type { Viewport } from "next";
import Script from "next/script";
import "@/app/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: "Jovan Maurel Bastian", url: SITE_CONFIG.url }],
  creator: "Jovan Maurel Bastian",
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: "Jovan Maurel Bastian Portfolio",
    type: "website",
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

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {SITE_CONFIG.gaId !== "G-XXXXXXXXXX" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${SITE_CONFIG.gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${SITE_CONFIG.gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <BackgroundProvider>
          <DictProvider dict={dict}>
            <Navbar lang={lang as Locale} />
            {children}
          </DictProvider>
        </BackgroundProvider>
      </body>
    </html>
  );
}
