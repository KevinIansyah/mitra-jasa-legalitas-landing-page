import { apiClient } from "@/lib/api/client";
import type { ProjectDetail } from "@/lib/types/project";
import { resolvePublicFileUrl } from "@/lib/utils";

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

export async function fetchProjectDetail(projectId: number): Promise<ProjectDetail> {
  const project = await apiClient.get<ProjectDetail>(`/projects/${projectId}`);
  return hydrateProjectActionUrls(project);
}

export async function uploadProjectDocument(args: {
  projectId: number;
  documentId: number;
  file: File;
}): Promise<ProjectDetail> {
  const { projectId, documentId, file } = args;
  const formData = new FormData();
  formData.append("file", file);

  await apiClient.postFormData<unknown>(
    `/projects/${projectId}/documents/${documentId}/upload`,
    formData,
  );

  return fetchProjectDetail(projectId);
}

export function getProjectDocumentDownloadPath(projectId: number, documentId: number): string {
  return resolvePublicFileUrl(`/projects/${projectId}/documents/${documentId}/download`) ?? "";
}

export function getProjectDeliverableDownloadPath(projectId: number, deliverableId: number): string {
  return resolvePublicFileUrl(`/projects/${projectId}/deliverables/${deliverableId}/download`) ?? "";
}
