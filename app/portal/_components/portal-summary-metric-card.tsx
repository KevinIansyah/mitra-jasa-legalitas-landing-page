import type { ReactNode } from "react";
import Link from "next/link";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type SummaryTrendTone = "up" | "down" | "neutral";

type TrendPillProps = {
  tone: SummaryTrendTone;
  label: string;
};

export function SummaryTrendPill({ tone, label }: TrendPillProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums",
        tone === "up" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        tone === "down" && "bg-red-500/15 text-red-600 dark:text-red-400",
        tone === "neutral" && "bg-muted/80 text-muted-foreground dark:bg-white/5 dark:text-gray-400",
      )}
    >
      {tone === "up" ? (
        <TrendingUp className="size-3.5 shrink-0" aria-hidden />
      ) : tone === "down" ? (
        <TrendingDown className="size-3.5 shrink-0" aria-hidden />
      ) : (
        <Minus className="size-3.5 shrink-0 opacity-70" aria-hidden />
      )}
      {label}
    </span>
  );
}

type Props = {
  href: string;
  title: string;
  value: ReactNode;
  highlight: string;
  footer: string;
  trend?: TrendPillProps | null;
};

export function PortalSummaryMetricCard({ href, title, value, highlight, footer, trend }: Props) {
  const pill = trend ?? { tone: "neutral" as const, label: "- 0%" };

  return (
    <Link href={href} className="blog-card group p-5 flex flex-col h-full rounded-2xl border border-gray-200 bg-white dark:bg-surface-card overflow-hidden">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <SummaryTrendPill tone={pill.tone} label={pill.label} />
      </div>

      <div className="mt-5 min-h-0 flex-1">
        <p className="text-4xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-white">{value}</p>
        <p className="mt-2 text-sm leading-snug text-gray-800 dark:text-gray-200">{highlight}</p>
      </div>

      <div className="mt-5 border-t border-gray-200/90 pt-4 dark:border-white/8">
        <p className="text-xs leading-relaxed text-muted-foreground">{footer}</p>
      </div>
    </Link>
  );
}
