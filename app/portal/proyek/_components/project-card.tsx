import Link from "next/link";
import { getProjectStatusMeta } from "@/lib/constants/project-status";
import type { Project } from "@/lib/types/project";
import { cn, formatDate, formatIdrFromApi } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const status = getProjectStatusMeta(project.status);
  const progress = Math.min(100, Math.max(0, Number(project.progress_percentage) || 0));

  return (
    <Link
      href={`/portal/proyek/${project.id}`}
      className="blog-card group flex h-full flex-col rounded-2xl border border-gray-200 p-5 text-inherit no-underline shadow-sm outline-none transition-[border-color,box-shadow] dark:border-white/10 dark:bg-white/5"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold leading-snug text-gray-900 dark:text-white">{project.name}</h3>
            {project.company?.name ? <p className="text-sm text-muted-foreground">{project.company.name}</p> : null}
          </div>

          <span className={cn("inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold", status.classes)}>{status.label}</span>
        </div>

        <div className="mt-5 space-y-3 text-sm">
          {project.service?.name ? (
            <p>
              <span className="text-muted-foreground">Layanan: </span>
              <span className="font-semibold text-gray-900 dark:text-white">{project.service.name}</span>
            </p>
          ) : null}

          {project.service_package?.name ? (
            <p className="text-muted-foreground">
              Paket: <span className="font-medium text-gray-800 dark:text-gray-200">{project.service_package.name}</span>
            </p>
          ) : null}

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {project.start_date ? (
              <p>
                <span className="text-muted-foreground">Mulai: </span>
                <span className="font-medium text-gray-900 dark:text-white">{formatDate(project.start_date)}</span>
              </p>
            ) : null}
            {project.planned_end_date ? (
              <p>
                <span className="text-muted-foreground">Selesai: </span>
                <span className="font-medium text-gray-900 dark:text-white">{formatDate(project.planned_end_date)}</span>
              </p>
            ) : null}
          </div>

          {project.budget ? (
            <p>
              <span className="text-muted-foreground">Anggaran: </span>
              <span className="font-medium text-gray-900 dark:text-white">{formatIdrFromApi(project.budget)}</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-auto shrink-0 pt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold tabular-nums text-gray-900 dark:text-white">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
          <div className="h-full rounded-full bg-brand-blue transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Link>
  );
}
