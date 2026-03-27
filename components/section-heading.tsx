import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string | React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[align];

  return (
    <div className={cn("flex flex-col gap-3", alignClass, className)}>
      {badge && (
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gray-300 dark:bg-white/20" />
          <span className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/15 rounded-md bg-white dark:bg-white/8">
            {badge}
          </span>
          <span className="h-px w-8 bg-gray-300 dark:bg-white/20" />
        </div>
      )}

      <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
        {title}
      </h2>

      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
