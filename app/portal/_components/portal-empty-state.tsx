import type { LucideIcon } from "lucide-react";

export type PortalEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function PortalEmptyState({ icon: Icon, title, description }: PortalEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center" role="status">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
        <Icon className="size-6" aria-hidden />
      </div>
      <div>
        <p className="mb-2 text-base font-medium text-gray-900 dark:text-gray-100">{title}</p>
        <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}
