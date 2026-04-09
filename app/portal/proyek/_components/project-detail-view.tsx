"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { ArrowDownFromLine, ArrowUpFromLine, FileText, Flag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getProjectDocumentFormatLabel } from "@/lib/constants/project-document-format";
import { getProjectDocumentStatusMeta } from "@/lib/constants/project-document-status";
import { getProjectMilestoneStatusMeta } from "@/lib/constants/project-milestone-status";
import { getProjectStatusMeta } from "@/lib/constants/project-status";
import type { ProjectDetail, ProjectDocument } from "@/lib/types/project";
import { cn, formatDate, formatDateTime, formatIdrFromApi } from "@/lib/utils";
import { PortalDetailSectionHeading } from "@/app/portal/_components/portal-detail-section-heading";
import { PortalEmptyState } from "@/app/portal/_components/portal-empty-state";
import {
  PORTAL_DATA_TABLE,
  PORTAL_DATA_TABLE_BODY,
  PORTAL_DATA_TABLE_HEAD,
  PORTAL_DATA_TABLE_WRAP,
} from "@/app/portal/_components/portal-table-classes";
import { ProjectDocumentUploadModal } from "./project-document-upload-modal";

type Props = {
  initialProject: ProjectDetail;
};

function formatBytes(bytes: number | null): string | null {
  if (!bytes || bytes <= 0) return null;
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[i]}`;
}

/** API kadang sudah mengirim "v1.0"; hindari jadi "vv1.0". */
function formatDeliverableVersionLabel(version: string | null | undefined): string | null {
  const t = version?.trim() ?? "";
  if (!t) return null;
  if (/^v/i.test(t)) return t;
  return `v${t}`;
}

const FIELD_TEXT = "text-sm leading-relaxed";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={cn("space-y-1.5", FIELD_TEXT)}>
      <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
      <div className="font-normal text-gray-800 dark:text-gray-200">{children}</div>
    </div>
  );
}

export function ProjectDetailView({ initialProject }: Props) {
  const [project, setProject] = useState<ProjectDetail>(initialProject);
  const [uploadModalDocument, setUploadModalDocument] = useState<ProjectDocument | null>(null);
  const projectStatus = getProjectStatusMeta(project.status);

  const documents = useMemo(() => [...(project.documents ?? [])].sort((a, b) => a.sort_order - b.sort_order), [project.documents]);
  const milestones = useMemo(() => [...(project.milestones ?? [])].sort((a, b) => a.sort_order - b.sort_order), [project.milestones]);
  const deliverables = useMemo(() => [...(project.deliverables ?? [])].sort((a, b) => a.id - b.id), [project.deliverables]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-10">
        <section className="space-y-6">
          <PortalDetailSectionHeading
            title="Informasi proyek"
            description="Status, ringkasan layanan, jadwal, dan detail terkait proyek Anda di satu tempat."
          />
          <Field label="Status">
            <span className={cn("inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold", projectStatus.classes)}>
              {projectStatus.label} - {project.progress_percentage}%
            </span>
          </Field>

          <Field label="Nama proyek">{project.name}</Field>

          {project.description?.trim() ? (
            <Field label="Deskripsi">
              <p className="whitespace-pre-wrap text-muted-foreground">{project.description}</p>
            </Field>
          ) : null}

          <div className="grid gap-6 sm:grid-cols-2">
            {project.service?.name ? <Field label="Layanan">{project.service.name}</Field> : null}
            {project.service_package?.name ? <Field label="Paket">{project.service_package.name}</Field> : null}
            {project.start_date ? <Field label="Tanggal mulai">{formatDate(project.start_date)}</Field> : null}
            {project.planned_end_date ? <Field label="Target selesai">{formatDate(project.planned_end_date)}</Field> : null}
            {project.company?.name ? <Field label="Perusahaan">{project.company.name}</Field> : null}
            {project.budget ? <Field label="Anggaran">{formatIdrFromApi(project.budget)}</Field> : null}
          </div>
        </section>

        <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-white/10">
          <PortalDetailSectionHeading
            title="Dokumen proyek"
            description="Unggah berkas sesuai format yang diminta, pantau status verifikasi, dan unduh salinan jika tersedia."
          />
          {documents.length === 0 ? (
            <PortalEmptyState
              icon={FileText}
              title="Belum ada dokumen"
              description="Dokumen proyek belum ditambahkan untuk proyek ini."
            />
          ) : (
            <div className={PORTAL_DATA_TABLE_WRAP}>
              <table className={PORTAL_DATA_TABLE}>
                <thead className={PORTAL_DATA_TABLE_HEAD}>
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Dokumen</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">File</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Aksi</th>
                  </tr>
                </thead>
                <tbody className={PORTAL_DATA_TABLE_BODY}>
                  {documents.map((document) => {
                  const docStatus = getProjectDocumentStatusMeta(document.status);
                  const sizeLabel = formatBytes(document.file_size);
                  const formatLabel = getProjectDocumentFormatLabel(document.document_format);
                  const canUpload = document.status === "not_uploaded" || document.status === "rejected";

                  return (
                    <tr key={document.id} className="align-middle">
                      <td className="px-4 py-3">
                        <div className="space-y-1.5">
                          <p className="font-semibold text-gray-900 dark:text-white">{document.name}</p>
                          {formatLabel ? <p className="text-xs font-medium text-brand-blue dark:text-brand-blue/90">Format unggah: {formatLabel}</p> : null}
                          {document.notes ? <p className="font-normal text-gray-800 dark:text-gray-200">{document.notes}</p> : null}
                          {document.status === "rejected" && document.rejection_reason?.trim() ? (
                            <div className="mt-3 rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm dark:bg-destructive/15">
                              <p className="font-semibold text-destructive">Alasan penolakan</p>
                              <p className="mt-1.5 whitespace-pre-wrap text-gray-800 dark:text-gray-200">{document.rejection_reason.trim()}</p>
                            </div>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn("inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold text-center whitespace-nowrap", docStatus.classes)}>{docStatus.label}</span>
                          {document.is_encrypted ? (
                            <span className="inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold text-center whitespace-nowrap bg-slate-600 text-white">Terenkripsi</span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1.5 font-normal text-gray-800 dark:text-gray-200">
                          {document.file_type ? <p>{document.file_type}</p> : null}
                          {sizeLabel ? <p>{sizeLabel}</p> : null}
                          {document.uploaded_at ? <p className="text-muted-foreground">{formatDateTime(document.uploaded_at)}</p> : null}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Tooltip>
                            {canUpload ? (
                              <TooltipTrigger asChild>
                                <Button type="button" size="icon" className="rounded-md bg-brand-blue text-white hover:bg-brand-blue/90" onClick={() => setUploadModalDocument(document)}>
                                  <ArrowUpFromLine className="size-3.5" aria-hidden />
                                </Button>
                              </TooltipTrigger>
                            ) : (
                              <TooltipTrigger asChild>
                                <span className="inline-flex">
                                  <Button type="button" size="icon" className="rounded-md bg-brand-blue text-white hover:bg-brand-blue/90" disabled>
                                    <ArrowUpFromLine className="size-3.5" aria-hidden />
                                  </Button>
                                </span>
                              </TooltipTrigger>
                            )}
                            <TooltipContent side="top">{canUpload ? "Unggah dokumen" : "Unggah hanya untuk dokumen belum diunggah atau yang ditolak"}</TooltipContent>
                          </Tooltip>
                          {document.download_url ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button asChild variant="secondary" size="icon" className="rounded-md">
                                  <a href={document.download_url} target="_blank" rel="noopener noreferrer">
                                    <ArrowDownFromLine className="size-3.5" aria-hidden />
                                  </a>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">Unduh dokumen</TooltipContent>
                            </Tooltip>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-white/10">
          <PortalDetailSectionHeading
            title="Deliverables"
            description="Hasil akhir atau berkas keluaran yang dipublikasikan tim untuk Anda unduh."
          />
          {deliverables.length === 0 ? (
            <PortalEmptyState
              icon={Package}
              title="Belum ada deliverable"
              description="Berkas hasil akhir akan tampil di sini setelah diunggah oleh tim kami."
            />
          ) : (
            <div className={PORTAL_DATA_TABLE_WRAP}>
              <table className={PORTAL_DATA_TABLE}>
                <thead className={PORTAL_DATA_TABLE_HEAD}>
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Deliverable</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Info</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">File</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Aksi</th>
                  </tr>
                </thead>
                <tbody className={PORTAL_DATA_TABLE_BODY}>
                  {deliverables.map((item) => {
                    const sizeLabel = formatBytes(item.file_size);
                    const versionLabel = formatDeliverableVersionLabel(item.version);
                    return (
                      <tr key={item.id} className="align-middle">
                        <td className="px-4 py-3">
                          <div className="space-y-1.5">
                            <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                            {item.description?.trim() ? <p className="text-sm text-muted-foreground">{item.description.trim()}</p> : null}
                            {item.notes ? <p className="font-normal text-gray-800 dark:text-gray-200">{item.notes}</p> : null}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            {item.is_final ? <span className="inline-flex rounded-full bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-white">Final</span> : null}
                            {item.is_encrypted ? <span className="inline-flex rounded-full bg-slate-600 px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-white">Terenkripsi</span> : null}
                            {versionLabel ? <span className="inline-flex rounded-full bg-brand-blue px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-white">{versionLabel}</span> : null}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1.5 font-normal text-gray-800 dark:text-gray-200">
                            {item.file_type ? <p>{item.file_type}</p> : null}
                            {sizeLabel ? <p>{sizeLabel}</p> : null}
                            {item.uploaded_at ? <p className="text-muted-foreground">{formatDateTime(item.uploaded_at)}</p> : null}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {item.download_url ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button asChild variant="secondary" size="icon" className="rounded-md">
                                  <a href={item.download_url} target="_blank" rel="noopener noreferrer">
                                    <ArrowDownFromLine className="size-3.5" aria-hidden />
                                  </a>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">Unduh dokumen hasil akhir</TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-white/10">
          <PortalDetailSectionHeading
            title="Milestone"
            description="Tahapan pengerjaan, status terkini, dan jadwal rencana maupun aktual untuk proyek ini."
          />
          {milestones.length === 0 ? (
            <PortalEmptyState
              icon={Flag}
              title="Belum ada milestone"
              description="Milestone proyek ini belum ditambahkan."
            />
          ) : (
            <div className={PORTAL_DATA_TABLE_WRAP}>
              <table className={cn(PORTAL_DATA_TABLE, "table-fixed")}>
                <colgroup>
                  <col className="w-[48%]" />
                  <col className="w-[16%]" />
                  <col className="w-[36%]" />
                </colgroup>
                <thead className={PORTAL_DATA_TABLE_HEAD}>
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Milestone</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 dark:text-white">Jadwal</th>
                  </tr>
                </thead>
                <tbody className={PORTAL_DATA_TABLE_BODY}>
                  {milestones.map((milestone) => {
                    const ms = getProjectMilestoneStatusMeta(milestone.status);
                    const hasEst = typeof milestone.estimated_duration_days === "number" && milestone.estimated_duration_days > 0;
                    const hasSchedule = hasEst || Boolean(milestone.start_date) || Boolean(milestone.planned_end_date) || Boolean(milestone.actual_start_date) || Boolean(milestone.actual_end_date);
                    return (
                      <tr key={milestone.id} className="align-middle">
                        <td className="px-4 py-3">
                          <div className="space-y-1.5">
                            <p className="font-semibold text-gray-900 dark:text-white">{milestone.title}</p>
                            {milestone.description?.trim() ? <p className="text-sm text-muted-foreground">{milestone.description.trim()}</p> : null}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("inline-flex rounded-full px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap", ms.classes)}>{ms.label}</span>
                        </td>
                        <td className="px-4 py-3 align-middle">
                          {hasSchedule ? (
                            <div className="space-y-1.5 wrap-break-word font-normal text-gray-800 dark:text-gray-200">
                              {hasEst ? (
                                <p>
                                  <span className="text-muted-foreground">Estimasi: </span>
                                  {milestone.estimated_duration_days} hari
                                </p>
                              ) : null}
                              {milestone.start_date ? (
                                <p>
                                  <span className="text-muted-foreground">Mulai (rencana): </span>
                                  {formatDate(milestone.start_date)}
                                </p>
                              ) : null}
                              {milestone.planned_end_date ? (
                                <p>
                                  <span className="text-muted-foreground">Target selesai: </span>
                                  {formatDate(milestone.planned_end_date)}
                                </p>
                              ) : null}
                              {milestone.actual_start_date ? (
                                <p>
                                  <span className="text-muted-foreground">Mulai aktual: </span>
                                  {formatDate(milestone.actual_start_date)}
                                </p>
                              ) : null}
                              {milestone.actual_end_date ? (
                                <p>
                                  <span className="text-muted-foreground">Selesai aktual: </span>
                                  {formatDate(milestone.actual_end_date)}
                                </p>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <ProjectDocumentUploadModal open={uploadModalDocument != null} projectId={project.id} document={uploadModalDocument} onClose={() => setUploadModalDocument(null)} onUploaded={setProject} />
      </div>
    </TooltipProvider>
  );
}
