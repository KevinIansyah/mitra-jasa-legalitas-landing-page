import { cache } from "react";
import { apiServer } from "@/lib/api/server";
import type { Project, ProjectDetail } from "@/lib/types/project";
import { resolvePublicFileUrl } from "@/lib/utils";

export const getProjects = cache(async (): Promise<Project[]> => {
  try {
    return await apiServer.get<Project[]>("/projects");
  } catch {
    return [];
  }
});

function hydrateProjectActionUrls(project: ProjectDetail): ProjectDetail {
  return {
    ...project,
    documents: (project.documents ?? []).map((document) => {
      const uploadUrl = `/projects/${project.id}/documents/${document.id}/upload`;
      const downloadPath = `/projects/${project.id}/documents/${document.id}/download`;
      const downloadUrl = document.file_path
        ? resolvePublicFileUrl(downloadPath)
        : null;

      return {
        ...document,
        upload_url: uploadUrl,
        download_url: downloadUrl,
      };
    }),
    deliverables: (project.deliverables ?? []).map((deliverable) => {
      const downloadPath = `/projects/${project.id}/deliverables/${deliverable.id}/download`;
      const downloadUrl = deliverable.file_path
        ? resolvePublicFileUrl(downloadPath)
        : null;

      return {
        ...deliverable,
        download_url: downloadUrl,
      };
    }),
  };
}

export const getProjectDetail = cache(async (projectId: number): Promise<ProjectDetail | null> => {
  try {
    const project = await apiServer.get<ProjectDetail>(`/projects/${projectId}`);
    return hydrateProjectActionUrls(project);
  } catch {
    return null;
  }
});
