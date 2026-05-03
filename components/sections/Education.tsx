"use client";

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useDict } from "@/lib/DictContext";

// Dynamic import for R3F Door Scene — prevent SSR hydration issues
const DoorScene = dynamic(() => import("@/components/canvas/DoorScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
    </div>
  ),
});

export default function Education() {
  const dict = useDict();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  const handleDoorOpened = useCallback(() => {
    router.push(`/${lang}/journey`);
  }, [router, lang]);

  return (
    <div className="relative w-full min-h-[60vh] lg:h-full flex items-center justify-center">
      {/* 3D Door Scene — fills entire panel, transparent background */}
      <DoorScene
        onDoorOpened={handleDoorOpened}
        hintText={
          (dict.education as any).doorCta || "click the door to see my origin"
        }
      />
    </div>
  );
}
