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
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300",
        glowOnHover &&
          "hover:border-purple-500/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-purple-500/5",
        className
      )}
    >
      {children}
    </div>
  );
}
