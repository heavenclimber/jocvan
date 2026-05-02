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
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    type: "website",
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
