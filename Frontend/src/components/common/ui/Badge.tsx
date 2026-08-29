import { cn } from "@/lib/utils";

export function Badge({
  label,
  text,
  bg,
  dot,
  className,
}: {
  label: string;
  text: string;
  bg: string;
  dot: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        text,
        bg,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}
