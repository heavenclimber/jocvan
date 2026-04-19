import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
}

export default function Card({
  children,
  className,
  glowOnHover = true,
}: CardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 p-6 backdrop-blur-2xl shadow-2xl transition-all duration-300",
        glowOnHover &&
          "hover:border-white/30 hover:bg-white/10 hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]",
        className
      )}
    >
      {children}
    </div>
  );
}
