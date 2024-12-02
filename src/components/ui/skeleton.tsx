import { cn } from "@/lib";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-emerald-700/30 dark:bg-slate-600/50",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
