import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  href?: string;
  external?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  href,
  external,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 cursor-pointer";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-sky-400 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105",
    outline:
      "border border-white/20 text-white hover:border-blue-400/50 hover:bg-blue-500/10 hover:scale-105",
  };

  const classes = cn(baseStyles, variants[variant], className);

  if (href) {
    return (
      <a 
        href={href} 
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
