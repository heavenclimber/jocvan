import { redirect } from "next/navigation";

// Root page redirects to the default locale handled by middleware.
// This file stays as a fallback for edge cases.
export default function RootPage() {
  redirect("/en");
}
