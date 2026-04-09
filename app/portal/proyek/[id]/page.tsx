import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortalSectionHeader } from "@/app/portal/_components/portal-section-header";
import { getProjectDetail } from "@/lib/api/endpoints/projects.server";
import { ProjectDetailView } from "../_components/project-detail-view";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const projectId = Number.parseInt(id, 10);
  if (!Number.isFinite(projectId)) {
    return { title: "Detail proyek" };
  }

  const project = await getProjectDetail(projectId);
  if (!project) {
    return { title: "Detail proyek" };
  }

  return {
    title: `${project.name} · Detail proyek`,
    description: project.description ?? "Detail progress, dokumen, dan deliverables proyek.",
  };
}

export default async function PortalProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const projectId = Number.parseInt(id, 10);
  if (!Number.isFinite(projectId)) {
    notFound();
  }

  const project = await getProjectDetail(projectId);
  if (!project) {
    notFound();
  }

  return (
    <section className="max-w-6xl">
      <PortalSectionHeader title="Detail proyek" description="Kelola dokumen, pantau milestone, dan unduh berkas proyek Anda." />
      <div className="border-t border-gray-200 pt-10 dark:border-white/10">
        <ProjectDetailView initialProject={project} />
      </div>
    </section>
  );
}
