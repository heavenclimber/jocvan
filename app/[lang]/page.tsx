import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/app/[lang]/dictionaries";
import HomeClient from "@/app/[lang]/HomeClient";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  // Dictionary is already provided by layout via DictProvider
  // This page just needs to render the client home
  return <HomeClient />;
}
