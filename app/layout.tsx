import "./globals.css";

// Root layout - minimal shell. The full layout (fonts, Navbar, DictProvider)
// lives in app/[lang]/layout.tsx which is nested inside this.
// We intentionally omit <html>/<body> here because the [lang] layout provides them.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
