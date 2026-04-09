import { FolderKanban } from "lucide-react";
import { getProjects } from "@/lib/api/endpoints/projects.server";
import { PortalEmptyState } from "../_components/portal-empty-state";
import { PortalSectionHeader } from "../_components/portal-section-header";
import { ProjectCard } from "./_components/project-card";

export default async function PortalProyekPage() {
  const projects = await getProjects();

  return (
    <section className="max-w-6xl">
      <PortalSectionHeader title="Proyek" description="Daftar proyek legalitas yang sedang atau telah ditangani bersama tim kami." />

      {projects.length === 0 ? (
        <PortalEmptyState
          icon={FolderKanban}
          title="Belum ada proyek"
          description="Proyek legalitas yang ditangani bersama tim akan muncul di sini setelah tersedia."
        />
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.id} className="min-w-0">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
