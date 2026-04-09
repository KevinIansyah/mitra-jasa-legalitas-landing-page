import type { ProjectStatusValue } from "@/lib/constants/project-status";

/** Selaras dengan API / enum backend. */
export type DocumentStatus = "not_uploaded" | "pending_review" | "uploaded" | "verified" | "rejected";

export type MilestoneStatus = "not_started" | "in_progress" | "completed" | "blocked" | "cancelled";

export interface ProjectServiceRef {
  id: number;
  name: string;
  slug: string;
}

export interface ProjectServicePackageRef {
  id: number;
  name: string;
}

export interface ProjectCompanyRef {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  customer_id: number;
  company_id: number;
  service_id: number;
  service_package_id: number;
  name: string;
  description: string | null;
  budget: string;
  start_date: string | null;
  actual_start_date: string | null;
  planned_end_date: string | null;
  actual_end_date: string | null;
  status: ProjectStatusValue | string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  progress_percentage: number;
  service: ProjectServiceRef | null;
  service_package: ProjectServicePackageRef | null;
  company: ProjectCompanyRef | null;
}

export interface ProjectDocument {
  id: number;
  project_id: number;
  name: string;
  description: string | null;
  document_format: string | null;
  is_required: boolean;
  notes: string | null;
  file_path: string | null;
  file_size: number | null;
  file_type: string | null;
  is_encrypted: boolean;
  status: DocumentStatus | string;
  uploaded_by: number | null;
  uploaded_at: string | null;
  verified_by: number | null;
  verified_at: string | null;
  rejection_reason: string | null;
  sort_order: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  upload_url: string;
  download_url: string | null;
}

export interface ProjectMilestone {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  estimated_duration_days: number | null;
  start_date: string | null;
  planned_end_date: string | null;
  actual_start_date: string | null;
  actual_end_date: string | null;
  status: MilestoneStatus | string;
  sort_order: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectDeliverable {
  id: number;
  project_id: number;
  name: string;
  description: string | null;
  file_path: string | null;
  file_size: number | null;
  file_type: string | null;
  is_encrypted: boolean;
  uploaded_by: number | null;
  uploaded_at: string | null;
  is_final: boolean;
  version: string | null;
  notes: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  download_url: string | null;
}

export interface ProjectDetail extends Project {
  documents: ProjectDocument[];
  milestones: ProjectMilestone[];
  deliverables: ProjectDeliverable[];
}
