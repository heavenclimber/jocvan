import { notFound } from "next/navigation";
import { hasLocale } from "@/app/[lang]/dictionaries";
import PortfolioRoomClient from "./PortfolioRoomClient";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <PortfolioRoomClient />;
}
