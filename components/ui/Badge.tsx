import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export default function Badge({ children, className, active }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300",
        active
          ? "bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/50"
          : "bg-white/5 text-zinc-400 ring-1 ring-white/10 hover:bg-white/10",
        className
      )}
    >
      {children}
    </span>
  );
}
